import React from 'react'
import { FeatureDto } from '../types'

interface Props {
  features: FeatureDto[]           // first-level features 
  checkedIds: Set<number>
  onToggle: (id:number, checked:boolean) => void
}

// Since FeatureDto doesn't have children, we'll remove the children rendering functionality
// If you need hierarchical features, the FeatureDto type needs to be updated

export default function FeatureGrid({ features, checkedIds, onToggle }: Props) {
  return (
    <table className="table table-bordered bg-white">
      <thead className="table-primary">
        <tr>
          <th style={{width:'60%'}}>Feature</th>
          <th>Code</th>
          <th>Enabled</th>
        </tr>
      </thead>
      <tbody>
        {features.map(f => (
          <tr key={f.id || 'unknown'}>
            <td>
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id={`f-${f.id || 'unknown'}`} 
                  checked={f.id ? checkedIds.has(f.id) : false} 
                  onChange={(e)=> {
                    if (f.id) {
                      onToggle(f.id, e.target.checked)
                    }
                  }} 
                />
                <label className="form-check-label ms-2" htmlFor={`f-${f.id || 'unknown'}`}>
                  {f.name}
                </label>
              </div>
            </td>
            <td>{f.code ?? ''}</td>
            <td>{f.enable ? 'Yes' : 'No'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}