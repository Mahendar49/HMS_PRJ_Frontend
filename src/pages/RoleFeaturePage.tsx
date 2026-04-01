import React, { useEffect, useMemo, useState } from 'react'
import RoleDropdown from '../components/RoleDropdown'
import RoleCreateForm from '../components/RoleCreateForm'
import SearchBar from '../components/SearchBar'
import Pagination from '../components/Pagination'
import FeatureGrid from '../components/FeatureGrid'
import { RBACPermissionGuard } from '../components/RBACPermissionGuard'
import { roles as roleApi } from '../api'
import { features as featureApi } from '../api'
import { FeatureDto, Role } from '../types'

const PAGE_SIZE = 5

export default function RoleFeaturePage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [features, setFeatures] = useState<FeatureDto[]>([])
  const [selectedRole, setSelectedRole] = useState<number | null>(null)
  const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(()=> {
    async function load() {
      try {
        setLoading(true)
        const [r, f] = await Promise.all([roleApi.getRoles(), featureApi.getFeatureTree()])
        setRoles(r)
        setFeatures(f)
      } catch(e) {
        setMsg('Failed to load')
      } finally { setLoading(false) }
    }
    load()
  },[])

  useEffect(()=> {
    if (!selectedRole) { setCheckedIds(new Set()); return }
    let cancelled = false
    setLoading(true)
    roleApi.getRoleFeatures(selectedRole).then(ids => {
      if (cancelled) return
      setCheckedIds(new Set(ids))
    }).catch(err => {
      setMsg('Failed to load role features')
    }).finally(()=> setLoading(false))
    return ()=> { cancelled = true }
  }, [selectedRole])

  const filtered = useMemo(()=> {
    const q = search.trim().toLowerCase()
    if (!q) return features
    return features.filter(f => f.name.toLowerCase().includes(q))
  }, [features, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  useEffect(()=> { if (page > totalPages) setPage(1) }, [totalPages])

  const pageItems = useMemo(()=> filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE), [filtered, page])

  const handleToggle = (id:number, checked:boolean) => {
    setCheckedIds(prev => {
      const copy = new Set(prev)
      if (checked) copy.add(id)
      else copy.delete(id)
      return copy
    })
  }

  const handleSave = async () => {
    if (!selectedRole) { setMsg('Select a role first'); return }
    try {
      setSaving(true)
      await roleApi.setRoleFeatures(selectedRole, Array.from(checkedIds))
      setMsg('Saved')
    } catch(e) {
      setMsg('Save failed')
    } finally { setSaving(false); setTimeout(()=> setMsg(null),2000) }
  }

  const handleCreate = async (name:string, desc?:string) => {
    // Role creation not available in multilevelmenu service
    setMsg('Role creation not available - contact administrator');
    setTimeout(() => setMsg(null), 3000);
  }

  return (
    <RBACPermissionGuard>
      <div className="container-main">
        <div className="card p-4">
          <h3 className="mb-3">Role Feature Management (Advanced)</h3>
          
          {/* Search Bar at top */}
          <SearchBar value={search} onChange={setSearch} placeholder="Search features or children..." />
        
        {/* Role Dropdown */}
        <RoleDropdown roles={roles} value={selectedRole} onChange={setSelectedRole} />
        
        {/* Feature Grid */}
        {loading ? (
          <div className="text-center py-3">Loading...</div>
        ) : (
          <>
            <FeatureGrid features={pageItems} checkedIds={checkedIds} onToggle={handleToggle} />
            <Pagination page={page} totalPages={totalPages} onPage={setPage} />
          </>
        )}
        
        {/* Save Button */}
        <div className="mt-3 text-center">
          <button 
            className="btn btn-success btn-lg px-5" 
            disabled={saving || !selectedRole} 
            onClick={handleSave}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
        
        {/* Message */}
        {msg && <div className="mt-3 alert alert-info">{msg}</div>}
      </div>
    </div>
    </RBACPermissionGuard>
  )
}
