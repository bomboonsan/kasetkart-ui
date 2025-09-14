import assert from 'node:assert/strict'
import { extractResearchTeam, applyTeamToProject } from './utils/team.js'

// Mock Strapi-like project shape
const project = {
    id: 'prj1',
    attributes: {
        title: 'Demo',
        research_partners: {
            data: [
                { id: 'pp1', attributes: { fullname: 'Alice', orgName: 'KU', participant_type: 'หัวหน้าโครงการ', users_permissions_user: 1, participation_percentage: 60, participation_percentage_custom: 60, isFirstAuthor: true } },
                { id: 'pp2', attributes: { fullname: 'Bob', orgName: 'KU', participant_type: 'นักวิจัยร่วม', users_permissions_user: 2, participation_percentage: 40, participation_percentage_custom: 40 } },
            ],
        },
    },
}

const team = extractResearchTeam(project)
assert.equal(Array.isArray(team), true, 'extractResearchTeam returns array')
assert.equal(team.length, 2, 'extractResearchTeam length')
assert.equal(team[0].fullname, 'Alice', 'first member name')

const updated = applyTeamToProject(project, team)
assert.equal(updated.attributes.title, 'Demo', 'non-team fields preserved')
const data = updated.attributes.research_partners.data
assert.equal(Array.isArray(data), true, 'partners data exists')
assert.equal(data.length, 2, 'partners length preserved')

console.log('team utils ok')
