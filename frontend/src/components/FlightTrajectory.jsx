import React from 'react';

export default function FlightTrajectory() {
  return (
    <div className="trajectory-container">
      <svg viewBox="0 0 500 120" className="trajectory-svg">
        <defs>
          <linearGradient id="flightPathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="1" />
          </linearGradient>
          <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Dynamic Animated Trajectory Path */}
        <path
          d="M 50 80 Q 250 15 450 80"
          fill="none"
          stroke="url(#flightPathGrad)"
          strokeWidth="3.5"
          strokeDasharray="8 6"
          className="animated-flight-path"
          filter="url(#glow)"
        />

        {/* Node 1: Departure */}
        <g transform="translate(50, 80)">
          <circle r="12" fill="rgba(6, 182, 212, 0.2)" className="pulse-ring" />
          <circle r="6" fill="#06b6d4" filter="url(#glow)" />
        </g>

        {/* Node 2: Midpoint / En-route */}
        <g transform="translate(250, 47)">
          <circle r="12" fill="rgba(56, 189, 248, 0.2)" className="pulse-ring-delay" />
          <circle r="6" fill="#38bdf8" filter="url(#glow)" />
        </g>

        {/* Animated Plane Icon travelling along arc */}
        <g transform="translate(345, 50) rotate(16)" className="animated-plane-icon">
          <path
            d="M 0 -9 L 14 0 L 0 9 L 2.5 2.5 L -11 5 L -7 0 L -11 -5 L 2.5 -2.5 Z"
            fill="#ffffff"
            filter="url(#glow)"
          />
        </g>

        {/* Node 3: Touchdown Landing */}
        <g transform="translate(450, 80)">
          <circle r="14" fill="rgba(16, 185, 129, 0.25)" className="pulse-ring" />
          <circle r="7" fill="#10b981" filter="url(#glow)" />
        </g>
      </svg>

      <div className="trajectory-labels">
        <span className="traj-step"><span className="dot cyan-dot"></span> Departure (DEL)</span>
        <span className="traj-step"><span className="dot sky-dot"></span> Cruising 34,000 ft</span>
        <span className="traj-step active-touchdown"><span className="dot green-dot"></span> Touchdown & Intake</span>
      </div>
    </div>
  );
}
