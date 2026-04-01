import React, { useState } from 'react'

interface Props {
  onCreate: (name: string, description?: string) => Promise<void>
}

export default function RoleCreateForm({ onCreate }: Props) {
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) { setMsg('Role name required'); return }
    setLoading(true)
    try {
      await onCreate(name.trim(), desc.trim() || undefined)
      setName(''); setDesc(''); setMsg('Created')
      setTimeout(()=> setMsg(null), 2000)
    } catch (err) {
      setMsg('Create failed')
    } finally { setLoading(false) }
  }

  return (
    <form onSubmit={submit} className="mb-3">
      <h6>Create Role</h6>
      <div className="mb-2">
        <input className="form-control" placeholder="Role name" value={name} onChange={e=> setName(e.target.value)} />
      </div>
      <div className="mb-2">
        <input className="form-control" placeholder="Description" value={desc} onChange={e=> setDesc(e.target.value)} />
      </div>
      <div className="d-grid">
        <button className="btn btn-outline-primary" disabled={loading}>{loading ? 'Creating...' : 'Create Role'}</button>
      </div>
      {msg && <div className="mt-2 small text-muted">{msg}</div>}
    </form>
  )
}