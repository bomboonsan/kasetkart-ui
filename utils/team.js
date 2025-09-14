// Utilities to map research team between ProjectResearch object shapes

// Normalize partners from various Strapi v5 shapes into the UI shape used by ResearchTeamTable
export function extractResearchTeam(project) {
    if (!project) return [];

    // Support both plain object and Strapi populated attributes
    const attrs = project.attributes || project;
    let partners = [];

    // Strapi populated relation may be at attributes.research_partners.data
    if (attrs?.research_partners?.data) {
        partners = attrs.research_partners.data.map((item) => item.attributes ? { ...item.attributes, id: item.id } : item);
    } else if (Array.isArray(attrs?.research_partners)) {
        partners = attrs.research_partners;
    } else if (project.research_partners?.data) {
        partners = project.research_partners.data.map((item) => item.attributes ? { ...item.attributes, id: item.id } : item);
    } else if (Array.isArray(project.research_partners)) {
        partners = project.research_partners;
    }

    // Normalize to the table row shape used in ProjectForm
    return (partners || []).map((p) => {
        const usersPerm = p.users_permissions_user?.data?.id || p.users_permissions_user?.id || p.users_permissions_user;
        const id = p.id ?? p.documentId ?? undefined;
        return {
            id,
            fullname: p.fullname || p.name || "",
            orgName: p.orgName || p.org || "",
            partnerType: p.participant_type || p.partnerType || "",
            isInternal: Boolean(p.users_permissions_user || p.userID),
            userID: p.userID || usersPerm || undefined,
            partnerComment: [
                p.isFirstAuthor ? "First Author" : "",
                p.isCoreespondingAuthor ? "Corresponding Author" : "",
            ]
                .filter(Boolean)
                .join(" "),
            partnerProportion:
                p.participation_percentage !== undefined && p.participation_percentage !== null
                    ? String(p.participation_percentage)
                    : undefined,
            partnerProportion_percentage_custom:
                p.participation_percentage_custom !== undefined && p.participation_percentage_custom !== null
                    ? String(p.participation_percentage_custom)
                    : undefined,
            // Pass through raw if table needs it in the future
            User: p.User || undefined,
        };
    });
}

// Apply normalized team back onto a ProjectResearch object (client-side state only)
export function applyTeamToProject(project, team = []) {
    if (!project) return project;
    const next = { ...project };
    const attrs = next.attributes || null;

    // Convert normalized team back to a Strapi-ish partner record
    const toStrapiPartner = (row) => ({
        id: row.id,
        fullname: row.fullname,
        orgName: row.orgName,
        participant_type: row.partnerType,
        users_permissions_user: row.userID,
        participation_percentage:
            row.partnerProportion !== undefined && row.partnerProportion !== ""
                ? Number(row.partnerProportion)
                : undefined,
        participation_percentage_custom:
            row.partnerProportion_percentage_custom !== undefined && row.partnerProportion_percentage_custom !== ""
                ? Number(row.partnerProportion_percentage_custom)
                : undefined,
        isFirstAuthor: String(row.partnerComment || "").includes("First Author"),
        isCoreespondingAuthor: String(row.partnerComment || "").includes("Corresponding Author"),
    });

    const dataArr = team.map((row) => ({ id: row.id, attributes: toStrapiPartner(row) }));

    if (attrs) {
        next.attributes = { ...attrs, research_partners: { ...(attrs.research_partners || {}), data: dataArr } };
    } else {
        // Fallback plain shape
        next.research_partners = dataArr.map((d) => ({ id: d.id, ...d.attributes }));
    }

    return next;
}
