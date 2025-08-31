"use client"

import { useState } from 'react'
import useSWR from 'swr'
import { api } from '@/lib/api'
import Button from '@/components/Button'

function Manager({ title, path }) {
  const { data, mutate, error } = useSWR(path, api.get)
  const items = data || []
  const [name, setName] = useState('')
  const [editing, setEditing] = useState(null)
  const [editName, setEditName] = useState('')
  const base = path

  async function add() {
    if (!name.trim()) return
    await api.post(base, { name: name.trim() })
    setName('')
    mutate()
  }
  async function save(id) {
    await api.patch(`${base}/${id}`, { name: editName.trim() })
    setEditing(null); setEditName(''); mutate()
  }
  async function remove(id) {
    await api.del(`${base}/${id}`); mutate()
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
      <div className="text-lg font-semibold text-gray-800">{title}</div>
      {error && <div className="text-sm text-red-600">{error.message}</div>}
      <div className="flex gap-2">
        <input className="border rounded px-2 py-1 text-sm flex-1" value={name} onChange={e=>setName(e.target.value)} placeholder="เพิ่มชื่อใหม่" />
        <Button type="button" onClick={add}>เพิ่ม</Button>
      </div>
      <ul className="divide-y">
        {items.map((it) => (
          <li key={it.id} className="py-2 flex items-center gap-2">
            {editing === it.id ? (
              <>
                <input className="border rounded px-2 py-1 text-sm flex-1" value={editName} onChange={e=>setEditName(e.target.value)} />
                <Button type="button" variant="primary" onClick={() => save(it.id)}>บันทึก</Button>
                <Button type="button" variant="outline" onClick={() => { setEditing(null); setEditName('') }}>ยกเลิก</Button>
              </>
            ) : (
              <>
                <span className="flex-1 text-sm">{it.name}</span>
                <Button type="button" variant="outline" onClick={() => { setEditing(it.id); setEditName(it.name) }}>แก้ไข</Button>
                <Button type="button" variant="danger" onClick={() => remove(it.id)}>ลบ</Button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function LookupsPage() {
  return (
    <div className="space-y-6">
      <div className="text-2xl font-semibold text-gray-900">จัดการตัวเลือกอ้างอิง (Lookup)</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Manager title="Research Kind" path="/lookups/research-kinds" />
        <Manager title="IC Types" path="/lookups/ic-types" />
        <Manager title="Impact" path="/lookups/impacts" />
        <Manager title="SDG" path="/lookups/sdgs" />
      </div>
    </div>
  )
}

