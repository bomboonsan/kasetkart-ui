"use client"

import { useEffect, useMemo, useState } from 'react'
import SectionCard from '@/components/SectionCard'
import PublicationItem from '@/components/PublicationItem'
import { projectAPI, fundingAPI, worksAPI } from '@/lib/api'
import { api } from '@/lib/api-base'

const TYPE_TABS = [
	{ key: 'PROJECT', label: 'โครงการวิจัย' },
	{ key: 'CONFERENCE', label: 'ประชุมวิชาการ' },
	{ key: 'PUBLICATION', label: 'ตีพิมพ์ทางวิชาการ' },
	{ key: 'FUNDING', label: 'ขอรับทุนเขียนตำรา' },
	{ key: 'BOOK', label: 'หนังสือและตำรา' },
]

export default function ResearchPublicationsSection({ profileData = null }) {
	const [activeType, setActiveType] = useState('PROJECT')
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	const [myProjects, setMyProjects] = useState([])
	const [works, setWorks] = useState({ conferences: [], publications: [], books: [] })
	const [fundings, setFundings] = useState([])

	// derive userId from profileData if present, otherwise fetch /users/me
	const getUserIdFromProfile = async () => {
		try {
			const p = profileData?.data || profileData || {}
			const uid = p?.id || p?.data?.id || null
			if (uid) return uid
			const me = await api.get('/users/me')
			return me?.data?.id || me?.id || null
		} catch (e) {
			console.warn('getUserIdFromProfile failed', e)
			return null
		}
	}

	useEffect(() => {
		let mounted = true
		async function load() {
			setLoading(true)
			setError(null)
			try {
				const userId = await getUserIdFromProfile()

				// 1) get projects where current user is a partner
				let projectsRes = []
				try {
					const resp = await projectAPI.getMyProjects()
					projectsRes = resp?.data || resp || []
				} catch (e) {
					projectsRes = []
				}

				if (!mounted) return
				setMyProjects(projectsRes)

				// gather project documentIds to filter works
				const projectIds = (projectsRes || []).map(p => p.documentId || p.id).filter(Boolean)

				// 2) fetch works related to these projects (conferences / publications)
				const confs = []
				const pubs = []
				const books = []

				if (projectIds.length > 0) {
					// Build Strapi v5 $in array params properly
					const confParams = { publicationState: 'preview', ['pagination[pageSize]']: 1000 }
					const pubParams = { publicationState: 'preview', ['pagination[pageSize]']: 1000 }
					projectIds.forEach((id, idx) => {
						confParams[`filters[project_research][documentId][$in][${idx}]`] = id
						pubParams[`filters[project_research][documentId][$in][${idx}]`] = id
					})
					try {
						const confRes = await worksAPI.getConferences(confParams)
						const confData = confRes?.data || confRes || []
						confs.push(...confData)
					} catch (e) {
						// ignore conference fetch failures
					}

					try {
						const pubRes = await worksAPI.getPublications(pubParams)
						const pubData = pubRes?.data || pubRes || []
						pubs.push(...pubData)
					} catch (e) {
						// ignore publication fetch failures
					}
				}

				// 3) Get fundings where user is a partner and books linked to those fundings
				let fundingArr = []
				try {
					if (userId) {
						// Get funding-partners where this user is involved
						const fundingPartnersRes = await api.get('/funding-partners', {
							['filters[users_permissions_user][id][$eq]']: userId,
							publicationState: 'preview',
							populate: 'project_fundings',
							['pagination[pageSize]']: 1000
						})
						const fundingPartners = fundingPartnersRes?.data || []
						
						// Extract unique project-fundings
						const fundingIds = new Set()
						const fundingMap = new Map()
						
						fundingPartners.forEach(partner => {
							const fundings = partner.project_fundings || []
							fundings.forEach(funding => {
								if (funding.documentId || funding.id) {
									const id = funding.documentId || funding.id
									if (!fundingIds.has(id)) {
										fundingIds.add(id)
										fundingMap.set(id, funding)
									}
								}
							})
						})

						fundingArr = Array.from(fundingMap.values())
					}
				} catch (e) {
					// ignore funding fetch failures
				}

				if (fundingArr.length > 0) {
					const fundingIds = fundingArr.map(f => f.documentId || f.id).filter(Boolean)
					if (fundingIds.length > 0) {
						try {
							const bookParams = { publicationState: 'preview', ['pagination[pageSize]']: 1000 }
							fundingIds.forEach((id, idx) => {
								bookParams[`filters[project_funding][documentId][$in][${idx}]`] = id
							})
							const booksRes = await worksAPI.getBooks(bookParams)
							const bookData = booksRes?.data || booksRes || []
							books.push(...bookData)
						} catch (e) {
							// ignore book fetch failures
						}
					}
				}

				if (!mounted) return
				setWorks({ conferences: confs, publications: pubs, books })
				setFundings(fundingArr)
			} catch (e) {
				if (mounted) setError(e.message || String(e))
			} finally {
				if (mounted) setLoading(false)
			}
		}

		load()
		return () => { mounted = false }
	}, [profileData])

	// counts memo
	const counts = useMemo(() => ({
		PROJECT: myProjects?.length || 0,
		CONFERENCE: works.conferences?.length || 0,
		PUBLICATION: works.publications?.length || 0,
		FUNDING: fundings?.length || 0,
		BOOK: works.books?.length || 0,
	}), [myProjects, works, fundings])

	// normalization functions to map Strapi shapes into PublicationItem props
	function toItemFromConference(w) {
		const title = w?.titleTH || w?.titleEN || w?.title || (w?.ConferenceDetail?.titleTh) || 'Conference'
		const description = w?.summary || w?.abstractTH || w?.abstractEN || ''
		const year = String(w?.durationStart ? new Date(w.durationStart).getFullYear() : (w?.durationYear || ''))
		return { title, description, year, type: 'ประชุมวิชาการ', status: w?.status }
	}

	function toItemFromPublication(w) {
		const title = w?.titleTH || w?.titleEN || w?.title || (w?.PublicationDetail?.titleTh) || 'Publication'
		const description = w?.abstractTH || w?.abstractEN || ''
		const year = String(w?.durationStart ? new Date(w.durationStart).getFullYear() : (w?.durationYear || ''))
		return { title, description, year, type: 'ตีพิมพ์ทางวิชาการ', status: w?.status }
	}

	function projectItem(p) {
		return {
			title: p.nameTH || p.nameEN || p.name || p.title || `Project #${p.id}`,
			description: p.keywords || p.researchKind || '',
			year: String(p.fiscalYear || p.year || ''),
			type: 'โครงการวิจัย',
			status: p.status
		}
	}

	return (
		<SectionCard title="ผลงานการการเขียนตามประเภท">
			<div className="space-y-6">
				<div className="flex gap-2 border-b">
					{TYPE_TABS.map(t => (
						<button
							key={t.key}
							onClick={() => setActiveType(t.key)}
							className={`px-3 py-2 text-sm -mb-px border-b-2 ${activeType === t.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600'}`}
						>
							{t.label} {counts[t.key] ? `(${counts[t.key]})` : ''}
						</button>
					))}
				</div>

				{error ? (
					<div className="text-sm text-red-600">{error}</div>
				) : loading ? (
					<div className="text-sm text-gray-500">กำลังโหลด...</div>
				) : (
					<div className="space-y-4">
						{activeType === 'PROJECT' ? (
							myProjects.length === 0 ? (
								<div className="text-sm text-gray-500">ยังไม่มีโครงการ</div>
							) : (
								myProjects.map(p => {
									const item = projectItem(p)
									return (
										<PublicationItem
											key={p.documentId || p.id}
											title={item.title}
											description={item.description}
											year={item.year}
											type={item.type}
											status={item.status}
										/>
									)
								})
							)
						) : activeType === 'CONFERENCE' ? (
							works.conferences.length === 0 ? (
								<div className="text-sm text-gray-500">ยังไม่มีผลงานในหมวดนี้</div>
							) : (
								works.conferences.map(w => {
									const item = toItemFromConference(w)
									return (
										<PublicationItem
											key={w.documentId || w.id}
											title={item.title}
											description={item.description}
											year={item.year}
											type={item.type}
											status={item.status}
										/>
									)
								})
							)
						) : activeType === 'PUBLICATION' ? (
							works.publications.length === 0 ? (
								<div className="text-sm text-gray-500">ยังไม่มีผลงานในหมวดนี้</div>
							) : (
								works.publications.map(w => {
									const item = toItemFromPublication(w)
									return (
										<PublicationItem
											key={w.documentId || w.id}
											title={item.title}
											description={item.description}
											year={item.year}
											type={item.type}
											status={item.status}
										/>
									)
								})
							)
						) : activeType === 'FUNDING' ? (
							fundings.length === 0 ? (
								<div className="text-sm text-gray-500">ยังไม่มีคำขอทุน</div>
							) : (
								fundings.map(f => (
									<PublicationItem
										key={f.documentId || f.id}
										title={f.fundTypeText || f.contentDesc || f.title || 'Funding'}
										description={f.purpose || ''}
										year={String(f.duration ? new Date(f.duration).getFullYear() : '')}
										type={'ขอรับทุนเขียนตำรา'}
										status={f.status}
									/>
								))
							)
						) : (
							works.books.length === 0 ? (
								<div className="text-sm text-gray-500">ยังไม่มีหนังสือและตำรา</div>
							) : (
								works.books.map(b => (
									<PublicationItem
										key={b.documentId || b.id}
										title={b.titleTH || b.titleEN || b.title || 'Book'}
										description={b.detail || ''}
										year={String(b.publicationDate ? new Date(b.publicationDate).getFullYear() : '')}
										type={'หนังสือและตำรา'}
										status={b.status}
									/>
								))
							)
						)}
					</div>
				)}
			</div>
		</SectionCard>
	)
}
