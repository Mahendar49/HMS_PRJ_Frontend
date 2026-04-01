import React from 'react'
import { Role } from '../types'

interface Props {
  roles: Role[]
  value?: number | null
  onChange: (id: number | null) => void
}

export default function RoleDropdown({ roles, value, onChange }: Props) {
  return (
    <div className="mb-3">
      <label className="form-label">Role</label>
      <select className="form-select" value={value ?? ''} onChange={(e)=> onChange(e.target.value ? Number(e.target.value) : null)}>
        <option value="">-- select role --</option>
        {roles.map(r=> <option key={r.id} value={r.id}>{r.name}</option>)}
      </select>
    </div>
  )
}