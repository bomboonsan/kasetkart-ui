'use client'

import { useState } from 'react'
import { executeGraphQL } from '@/lib/graphql/client'
import { 
  GET_ORGANIZATIONS, 
  GET_FACULTIES, 
  GET_DEPARTMENTS,
  GET_MY_PROFILE_SIDEBAR,
  GET_MY_PROFILE,
  GET_ACADEMIC_TYPES,
  GET_PARTICIPATION_TYPES 
} from '@/lib/graphql/queries'

export default function GraphQLTestPage() {
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const testQuery = async (queryName, query, variables = {}, requireAuth = false) => {
    setLoading(true)
    setResult('')
    try {
      console.log(`🧪 Testing ${queryName}...`)
      const data = await executeGraphQL({
        query,
        variables,
        skipAuth: !requireAuth
      })
      setResult(`✅ ${queryName} succeeded:\n${JSON.stringify(data, null, 2)}`)
    } catch (error) {
      setResult(`❌ ${queryName} failed:\n${error.message}`)
      console.error('GraphQL Error:', error)
    }
    setLoading(false)
  }

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">GraphQL Test Page</h1>
      <p className="text-gray-600">Testing GraphQL schema fixes for Strapi backend</p>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Lookup Queries (No Auth)</h2>
          <div className="space-y-2">
            <button
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              onClick={() => testQuery('Organizations', GET_ORGANIZATIONS, { pagination: { limit: 3 } })}
              disabled={loading}
            >
              Test Organizations
            </button>
            
            <button
              className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
              onClick={() => testQuery('Faculties', GET_FACULTIES, { pagination: { limit: 3 } })}
              disabled={loading}
            >
              Test Faculties
            </button>
            
            <button
              className="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
              onClick={() => testQuery('Departments', GET_DEPARTMENTS, { pagination: { limit: 3 } })}
              disabled={loading}
            >
              Test Departments
            </button>
            
            <button
              className="w-full px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
              onClick={() => testQuery('Academic Types', GET_ACADEMIC_TYPES, { pagination: { limit: 3 } })}
              disabled={loading}
            >
              Test Academic Types
            </button>
            
            <button
              className="w-full px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 disabled:opacity-50"
              onClick={() => testQuery('Participation Types', GET_PARTICIPATION_TYPES, { pagination: { limit: 3 } })}
              disabled={loading}
            >
              Test Participation Types
            </button>
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-2">User Profile Queries (Requires Auth)</h2>
          <div className="space-y-2">
            <button
              className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
              onClick={() => testQuery('My Profile Sidebar', GET_MY_PROFILE_SIDEBAR, {}, true)}
              disabled={loading}
            >
              Test My Profile Sidebar
            </button>
            
            <button
              className="w-full px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:opacity-50"
              onClick={() => testQuery('My Full Profile', GET_MY_PROFILE, {}, true)}
              disabled={loading}
            >
              Test My Full Profile
            </button>
          </div>
        </div>
      </div>
      
      {loading && <p className="text-blue-600">Testing...</p>}
      
      {result && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Result:</h3>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 text-sm">
            {result}
          </pre>
        </div>
      )}
    </div>
  )
}