import React from 'react';

export default function FlightTrajectory() {
  return (
    <div className="trajectory-container">
      <svg viewBox="0 0 500 120" className="trajectory-svg">
        <defs>
          <linearGradient id="flightPathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="1" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Trajectory Dotted Curved Line */}
        <path
          d="M 50 80 Q 250 10 450 80"
          fill="none"
          stroke="url(#flightPathGrad)"
          strokeWidth="3"
          strokeDasharray="6 6"
          filter="url(#glow)"
        />

        {/* Node 1: Departure */}
        <circle cx="50" cy="80" r="7" fill="#06b6d4" filter="url(#glow)" />

        {/* Node 2: En route */}
        <circle cx="250" cy="45" r="7" fill="#38bdf8" filter="url(#glow)" />

        {/* Airplane Icon at midpoint */}
        <g transform="translate(340, 52) rotate(12)">
          <path
            d="M 0 -8 L 12 0 L 0 8 L 2 2 L -10 4 L -6 0 L -10 -4 L 2 -2 Z"
            fill="#ffffff"
            filter="url(#glow)"
          />
        </g>

        {/* Node 3: Landing */}
        <circle cx="450" cy="80" r="8" fill="#10b981" filter="url(#glow)" />
      </svg>

      <div className="trajectory-labels">
        <span>Departure</span>
        <span>En route</span>
        <span style={{ color: '#10b981', fontWeight: 600 }}>Landing</span>
      </div>
    </div>
  );
}
