import React from 'react';

export default function PanelCard({ title, subtitle, icon, children, className = '' }) {
  return (
    <div className={`glass-panel ${className}`}>
      <div className="panel-header">
        {icon && <span className="panel-icon">{icon}</span>}
        <div>
          <h3 className="panel-title">{title}</h3>
          {subtitle && <p className="panel-subtitle">{subtitle}</p>}
        </div>
      </div>
      <div className="panel-body">
        {children}
      </div>
    </div>
  );
}
