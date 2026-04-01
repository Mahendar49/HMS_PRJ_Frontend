import React from 'react'

interface Props {
  value: string
  onChange: (v:string) => void
  placeholder?: string
}

export default function SearchBar({ value, onChange, placeholder }: Props) {
  return (
    <div className="mb-3">
      <input className="form-control" placeholder={placeholder || 'Search...'} value={value} onChange={e=> onChange(e.target.value)} />
    </div>
  )
}