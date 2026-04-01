// Debug component to analyze routing and RBAC menu issues
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useMenuItems, useMenuError } from '../state/menuStore';

export const RouteDebugger: React.FC = () => {
  const location = useLocation();
  const menuItems = useMenuItems();
  const menuError = useMenuError();
  const [routeHistory, setRouteHistory] = useState<string[]>([]);

  useEffect(() => {
    setRouteHistory(prev => [...prev, location.pathname].slice(-5)); // Keep last 5 routes
  }, [location.pathname]);

  const token = localStorage.getItem('authToken');

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: 0, 
      right: 0, 
      width: '400px', 
      height: '300px',
      backgroundColor: 'rgba(0,0,0,0.9)', 
      color: 'white', 
      padding: '10px',
      fontSize: '12px',
      overflow: 'auto',
      zIndex: 9999,
      border: '2px solid #007bff'
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>🔍 Route Debugger</div>
      
      <div><strong>Current Path:</strong> {location.pathname}</div>
      <div><strong>Has Token:</strong> {token ? 'Yes' : 'No'}</div>
      <div><strong>Menu Items:</strong> {menuItems?.length || 0}</div>
      <div><strong>Menu Error:</strong> {menuError || 'None'}</div>
      
      <div style={{ marginTop: '10px' }}>
        <strong>Recent Routes:</strong>
        {routeHistory.map((route, index) => (
          <div key={index} style={{ marginLeft: '10px' }}>
            {index + 1}. {route}
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '10px' }}>
        <strong>RBAC Menu Items:</strong>
        {menuItems?.map((item, index) => (
          <div key={index} style={{ marginLeft: '10px', fontSize: '10px' }}>
            {item.code} → {item.name}
            {item.children?.map((child, childIndex) => (
              <div key={childIndex} style={{ marginLeft: '20px' }}>
                {child.code} → {child.name}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};