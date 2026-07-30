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

          <linearGradient id="contrailGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
          </linearGradient>

          <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="planeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComponentTransfer in="blur" result="glow1">
              <feFuncA type="linear" slope="0.7" />
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

        {/* Dynamic Animated Realistic Commercial Jet Airliner */}
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

          {/* Dual Jet Contrails */}
          <ellipse cx="-20" cy="-7" rx="12" ry="2" fill="url(#contrailGrad)" />
          <ellipse cx="-20" cy="7" rx="12" ry="2" fill="url(#contrailGrad)" />
          <path d="M -22 0 L -45 -3 L -45 3 Z" fill="url(#contrailGrad)" />

          {/* Tail Stabilizers & Vertical Fin */}
          <path d="M -18 0 L -27 -10 L -30 -9 L -22 0 L -30 9 L -27 10 Z" fill="#cbd5e1" />
          <path d="M -16 0 L -26 -13 L -29 -13 L -21 0 Z" fill="#38bdf8" />

          {/* Swept Main Wings & Winglets */}
          <path d="M 6 0 L -6 -21 L -12 -20 L -2 0 Z" fill="#f8fafc" />
          <path d="M 6 0 L -6 21 L -12 20 L -2 0 Z" fill="#f8fafc" />
          {/* Winglets */}
          <path d="M -6 -21 L -10 -23 L -12 -20 Z" fill="#06b6d4" />
          <path d="M -6 21 L -10 23 L -12 20 Z" fill="#06b6d4" />

          {/* Turbofan Jet Engine Nacelles under wings */}
          <path d="M 3 -8 L -6 -8 C -7 -8 -7 -6 -6 -6 L 3 -6 Z" fill="#64748b" />
          <path d="M 3 8 L -6 8 C -7 8 -7 6 -6 6 L 3 6 Z" fill="#64748b" />
          <circle cx="3" cy="-7" r="1" fill="#38bdf8" />
          <circle cx="3" cy="7" r="1" fill="#38bdf8" />

          {/* Sleek Aerodynamic Fuselage Body */}
          <path
            d="M 24 0 C 24 -3.5, 16 -5.5, 6 -5.5 L -16 -4.5 C -22 -3.5, -26 -2, -28 0 C -26 2, -22 3.5, -16 4.5 L 6 5.5 C 16 5.5, 24 3.5, 24 0 Z"
            fill="#ffffff"
          />

          {/* Cockpit Windshield Shield */}
          <path d="M 18 -1.8 C 16 -3, 13 -3, 12 -1.8 C 13 -1, 16 -1, 18 -1.8 Z" fill="#0284c7" />
          
          {/* Cabin Window Strip */}
          <circle cx="6" cy="0" r="0.8" fill="#38bdf8" />
          <circle cx="2" cy="0" r="0.8" fill="#38bdf8" />
          <circle cx="-2" cy="0" r="0.8" fill="#38bdf8" />
          <circle cx="-6" cy="0" r="0.8" fill="#38bdf8" />
          <circle cx="-10" cy="0" r="0.8" fill="#38bdf8" />
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
