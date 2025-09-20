// Utilities to map research team between ProjectResearch object shapes

/**
 * Extract partners array from various Strapi v5 populated shapes
 */
function extractPartnersArray(project) {
    if (!project) return [];

    const attrs = project.attributes || project;
    
    // Strapi populated relation may be at attributes.research_partners.data
    if (attrs?.research_partners?.data) {
        return attrs.research_partners.data.map(normalizePartnerItem);
    }
    
    if (Array.isArray(attrs?.research_partners)) {
        return attrs.research_partners;
    }
    
    if (project.research_partners?.data) {
        return project.research_partners.data.map(normalizePartnerItem);
    }
    
    if (Array.isArray(project.research_partners)) {
        return project.research_partners;
    }
    
    return [];
}

/**
 * Normalize partner item from Strapi structure
 */
function normalizePartnerItem(item) {
    return item.attributes ? { ...item.attributes, id: item.id } : item;
}

/**
 * Extract user ID from various partner user reference shapes
 */
function extractUserPermissionId(partner) {
    return partner.users_permissions_user?.data?.id || 
           partner.users_permissions_user?.id || 
           partner.users_permissions_user;
}

/**
 * Build partner comment from boolean flags
 */
function buildPartnerComment(partner) {
    const comments = [];
    if (partner.isFirstAuthor) comments.push("First Author");
    if (partner.isCoreespondingAuthor) comments.push("Corresponding Author");
    return comments.join(" ");
}

/**
 * Normalize partners from various Strapi v5 shapes into the UI shape used by ResearchTeamTable
 */
export function extractResearchTeam(project) {
    const partners = extractPartnersArray(project);

    return partners.map((partner) => {
        const userId = extractUserPermissionId(partner);
        const id = partner.id ?? partner.documentId ?? undefined;
        
        return {
            id,
            fullname: partner.fullname || partner.name || "",
            orgName: partner.orgName || partner.org || "",
            partnerType: partner.participant_type || partner.partnerType || "",
            isInternal: Boolean(partner.users_permissions_user || partner.userID),
            userID: partner.userID || userId || undefined,
            partnerComment: buildPartnerComment(partner),
            partnerProportion: formatPartnerProportion(partner.participation_percentage),
            partnerProportion_percentage_custom: formatPartnerProportion(partner.participation_percentage_custom),
            // Pass through raw if table needs it in the future
            User: partner.User || undefined,
        };
    });
}

/**
 * Format participation percentage for display
 */
function formatPartnerProportion(value) {
    return value !== undefined && value !== null ? String(value) : undefined;
}

/**
 * Convert normalized team row back to Strapi partner record
 */
function normalizeTeamRowToStrapi(row) {
    return {
        id: row.id,
        fullname: row.fullname,
        orgName: row.orgName,
        participant_type: row.partnerType,
        users_permissions_user: row.userID,
        participation_percentage: parsePartnerProportion(row.partnerProportion),
        participation_percentage_custom: parsePartnerProportion(row.partnerProportion_percentage_custom),
        isFirstAuthor: String(row.partnerComment || "").includes("First Author"),
        isCoreespondingAuthor: String(row.partnerComment || "").includes("Corresponding Author"),
    };
}

/**
 * Parse participation percentage from string
 */
function parsePartnerProportion(value) {
    return value !== undefined && value !== "" ? Number(value) : undefined;
}

/**
 * Apply normalized team back onto a ProjectResearch object (client-side state only)
 */
export function applyTeamToProject(project, team = []) {
    if (!project) return project;
    
    const next = { ...project };
    const attrs = next.attributes || null;
    
    const dataArray = team.map((row) => ({ 
        id: row.id, 
        attributes: normalizeTeamRowToStrapi(row) 
    }));

    if (attrs) {
        next.attributes = { 
            ...attrs, 
            research_partners: { 
                ...(attrs.research_partners || {}), 
                data: dataArray 
            } 
        };
    } else {
        // Fallback plain shape
        next.research_partners = dataArray.map((d) => ({ id: d.id, ...d.attributes }));
    }

    return next;
}
