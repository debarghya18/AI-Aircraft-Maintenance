import React from 'react';

export default function FlightTrajectory() {
  const flightPath = "M 50 80 Q 250 15 450 80";

  return (
    <div className="trajectory-container">
      <svg viewBox="0 0 500 120" className="trajectory-svg">
        <defs>
          <linearGradient id="flightPathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="1" />
          </linearGradient>

          <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="planeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComponentTransfer in="blur" result="glow1">
              <feFuncA type="linear" slope="0.8" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode in="glow1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Dynamic Curved Trajectory Line */}
        <path
          d={flightPath}
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

        {/* Node 2: Cruising Altitude */}
        <g transform="translate(250, 47)">
          <circle r="12" fill="rgba(56, 189, 248, 0.2)" className="pulse-ring-delay" />
          <circle r="6" fill="#38bdf8" filter="url(#glow)" />
        </g>

        {/* Node 3: Touchdown Landing */}
        <g transform="translate(450, 80)">
          <circle r="14" fill="rgba(16, 185, 129, 0.25)" className="pulse-ring" />
          <circle r="7" fill="#10b981" filter="url(#glow)" />
        </g>

        {/* Dynamic Animated Airplane Flying Along Curve */}
        <g filter="url(#planeGlow)">
          <animateMotion
            path={flightPath}
            dur="6s"
            repeatCount="indefinite"
            rotate="auto"
            calcMode="spline"
            keyTimes="0; 0.5; 1"
            keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
          />
          {/* Jet Contrail Stream */}
          <ellipse cx="-12" cy="0" rx="6" ry="2" fill="#38bdf8" opacity="0.8" />
          <ellipse cx="-20" cy="0" rx="8" ry="1.5" fill="#06b6d4" opacity="0.5" />
          
          {/* Detailed Jet Aircraft Silhouette */}
          <path
            d="M 14 0 L -3 -11 L -1 -3 L -11 -4 L -9 0 L -11 4 L -1 3 L -3 11 Z"
            fill="#ffffff"
          />
          <circle cx="10" cy="0" r="2" fill="#38bdf8" />
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
