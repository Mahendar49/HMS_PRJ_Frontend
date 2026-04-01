import React from 'react';
import sample from '../data.sample.json';

export default function Dashboard() {
  const tp = sample.patients.length;
  
  return (
    <div>
      <h3>Dashboard</h3>
      <div className='card p-3'>
        <h5>Summary</h5>
        <p>Total Patients: {tp}</p>
      </div>
    </div>
  );
}