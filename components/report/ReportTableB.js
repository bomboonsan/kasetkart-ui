import { useEffect, useState } from 'react'
import { valueFromAPI, projectAPI, reportAPI } from '@/lib/api'

export default function ReportTableB() {
  const [rows, setRows] = useState([])
  const [totals, setTotals] = useState({ teaching: 0, research: 0, practice: 0, societal: 0, total: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Impact names expected from /impacts
  const IMPACT_NAMES = {
    teaching: 'Teaching & Learning Impact',
    research: 'Research & Scholarly Impact',
    practice: 'Practice & Community Impact',
    societal: 'Societal Impact'
  }

  useEffect(() => {
    let mounted = true

    async function load() {
      setLoading(true)
      setError('')
      try {
        // Prefer server-side aggregated report when available
        try {
          const reportRes = await reportAPI.getImpactsByDepartment()
          const reportData = reportRes?.data || reportRes || []

          const resultRows = []
          const totalsAcc = { teaching: 0, research: 0, practice: 0, societal: 0 }

          for (const dept of reportData) {
            const discipline = dept.name || dept.title || 'Unknown'
            // map impacts by name for safety
            const impactMap = (dept.impacts || []).reduce((acc, it) => {
              acc[it.name] = Number(it.value || 0)
              return acc
            }, {})

            const teaching = Number(impactMap[IMPACT_NAMES.teaching] || 0)
            const research = Number(impactMap[IMPACT_NAMES.research] || 0)
            const practice = Number(impactMap[IMPACT_NAMES.practice] || 0)
            const societal = Number(impactMap[IMPACT_NAMES.societal] || 0)

            totalsAcc.teaching += teaching
            totalsAcc.research += research
            totalsAcc.practice += practice
            totalsAcc.societal += societal

            const total = teaching + research + practice + societal
            resultRows.push({ discipline, teaching, research, practice, societal, total })
          }

          const totalAll = totalsAcc.teaching + totalsAcc.research + totalsAcc.practice + totalsAcc.societal
          if (!mounted) return
          setRows(resultRows)
          setTotals({ ...totalsAcc, total: totalAll })
        } catch (err) {
          // fallback to client-side aggregation if server endpoint not available
          // ...existing client-side logic fallback...
          console.warn('reportAPI.getImpactsByDepartment failed, falling back to client aggregation', err)
          // reuse previous logic: fetch departments/impacts and projects
          const [deptsRes, impactsRes] = await Promise.all([
            valueFromAPI.getDepartments(),
            valueFromAPI.getImpacts()
          ])

          const deptsRaw = deptsRes?.data || deptsRes || []
          const impactsRaw = impactsRes?.data || impactsRes || []

          const depts = (deptsRaw || []).map(d => {
            const attrs = d?.attributes || d
            return {
              id: d?.id || attrs?.id || null,
              documentId: attrs?.documentId || d?.documentId || null,
              name: attrs?.name || d?.name || String(d)
            }
          })

          const impactByName = {}
          (impactsRaw || []).forEach(i => {
            const attrs = i?.attributes || i
            const name = attrs?.name || i?.name
            const id = i?.id || attrs?.id
            impactByName[name] = id
          })

          const projParams = {
            publicationState: 'preview',
            ['populate[research_partners]']: '*',
            ['populate[impacts]']: '*',
            ['populate[department]']: '*',
            ['pagination[pageSize]']: 1000
          }

          const projRes = await projectAPI.getProjects(projParams)
          const projectsRaw = projRes?.data || projRes || []

          // helper functions (same as before)
          function projectDeptId(project) {
            const p = project?.attributes || project
            const dept = p?.department || project?.department || null
            if (!dept) return null
            const d = dept.data || dept
            return d?.id || d?.documentId || d || null
          }

          function projectImpactIds(project) {
            const p = project?.attributes || project
            const impacts = p?.impacts || project?.impacts || []
            const arr = impacts.data || impacts || []
            return arr.map(it => it?.id || it?.documentId || (it?.attributes && (it.attributes.id || it.attributes.documentId))).filter(Boolean)
          }

          function partnerPercentages(project) {
            const p = project?.attributes || project
            const partners = p?.research_partners?.data || p?.research_partners || project?.research_partners || []
            const arr = Array.isArray(partners) ? partners : (partners.data || [])
            return arr.map(pp => {
              const attrs = pp?.attributes || pp
              const val = attrs?.participation_percentage ?? attrs?.participation_percentage_custom ?? attrs?.participationPercentage ?? null
              return Number(val) || 0
            })
          }

          const resultRows = []
          const totalsAcc = { teaching: 0, research: 0, practice: 0, societal: 0 }

          for (const dept of depts) {
            let teaching = 0, research = 0, practice = 0, societal = 0

            for (const project of projectsRaw) {
              const projDeptId = projectDeptId(project)
              const matchesDept = projDeptId && (projDeptId === dept.id || projDeptId === dept.documentId)
              if (!matchesDept) continue

              const projImpactIds = projectImpactIds(project)
              const partnerPercs = partnerPercentages(project)
              const projectPartnerSum = partnerPercs.reduce((s, v) => s + v, 0)

              const teachingImpactId = impactByName[IMPACT_NAMES.teaching]
              const researchImpactId = impactByName[IMPACT_NAMES.research]
              const practiceImpactId = impactByName[IMPACT_NAMES.practice]
              const societalImpactId = impactByName[IMPACT_NAMES.societal]

              if (teachingImpactId && projImpactIds.includes(teachingImpactId)) teaching += projectPartnerSum
              if (researchImpactId && projImpactIds.includes(researchImpactId)) research += projectPartnerSum
              if (practiceImpactId && projImpactIds.includes(practiceImpactId)) practice += projectPartnerSum
              if (societalImpactId && projImpactIds.includes(societalImpactId)) societal += projectPartnerSum
            }

            const total = teaching + research + practice + societal
            totalsAcc.teaching += teaching
            totalsAcc.research += research
            totalsAcc.practice += practice
            totalsAcc.societal += societal

            resultRows.push({ discipline: dept.name, teaching, research, practice, societal, total })
          }

          const totalAll = totalsAcc.teaching + totalsAcc.research + totalsAcc.practice + totalsAcc.societal
          if (!mounted) return
          setRows(resultRows)
          setTotals({ ...totalsAcc, total: totalAll })
        }
      } catch (e) {
        setError(e?.message || String(e))
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => { mounted = false }
  }, [])

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <div className="p-4 border-b bg-blue-100">
        <h3 className="text-center text-lg font-bold text-gray-800">Impacts</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="bg-blue-100 px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border-r">
                Discipline
              </th>
              <th className="bg-blue-100 px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border-r">
                Teaching & Learning Impact
              </th>
              <th className="bg-blue-100 px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border-r">
                Research & Scholarly Impact
              </th>
              <th className="bg-blue-100 px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border-r">
                Practice & Community Impact
              </th>
              <th className="bg-blue-100 px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border-r">
                Societal Impact
              </th>
              <th className="bg-blue-100 px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-500">กำลังโหลด...</td></tr>
            ) : error ? (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-sm text-red-600">{error}</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-500">ยังไม่มีข้อมูล</td></tr>
            ) : (
              rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900 border-r font-medium">{row.discipline}</td>
                  <td className="px-4 py-3 text-sm text-center text-gray-900 border-r">{Number(row.teaching).toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-center text-gray-900 border-r">{Number(row.research).toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-center text-gray-900 border-r">{Number(row.practice).toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-center text-gray-900 border-r">{Number(row.societal).toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-center text-gray-900 font-medium">{Number(row.total).toFixed(2)}</td>
                </tr>
              ))
            )}

            {!loading && !error && rows.length > 0 && (
              <tr className="bg-gray-100 font-semibold">
                <td className="px-4 py-3 text-sm text-gray-900 border-r font-bold">Total</td>
                <td className="px-4 py-3 text-sm text-center text-gray-900 border-r">{Number(totals.teaching).toFixed(2)}</td>
                <td className="px-4 py-3 text-sm text-center text-gray-900 border-r">{Number(totals.research).toFixed(2)}</td>
                <td className="px-4 py-3 text-sm text-center text-gray-900 border-r">{Number(totals.practice).toFixed(2)}</td>
                <td className="px-4 py-3 text-sm text-center text-gray-900 border-r">{Number(totals.societal).toFixed(2)}</td>
                <td className="px-4 py-3 text-sm text-center text-gray-900 font-bold">{Number(totals.total).toFixed(2)}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
