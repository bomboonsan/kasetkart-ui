'use client'

import { useState } from 'react'
import { executeGraphQL } from '@/lib/graphql/client'
import { GET_ORGANIZATIONS, GET_FACULTIES } from '@/lib/graphql/queries'

export default function GraphQLTestPage() {
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const testQuery = async (queryName, query, variables = {}) => {
    setLoading(true)
    setResult('')
    try {
      console.log(`🧪 Testing ${queryName}...`)
      const data = await executeGraphQL({
        query,
        variables,
        skipAuth: true // Skip authentication for this test
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
      
      <div className="space-x-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          onClick={() => testQuery('Organizations', GET_ORGANIZATIONS, { pagination: { limit: 5 } })}
          disabled={loading}
        >
          Test Organizations Query
        </button>
        
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          onClick={() => testQuery('Faculties', GET_FACULTIES, { pagination: { limit: 5 } })}
          disabled={loading}
        >
          Test Faculties Query
        </button>
      </div>
      
      {loading && <p className="text-blue-600">Testing...</p>}
      
      {result && (
        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 text-sm">
          {result}
        </pre>
      )}
    </div>
  )
}