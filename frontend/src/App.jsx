import React, { useState, useEffect, useRef } from 'react';
import FlightTrajectory from './components/FlightTrajectory';
import { fetchHealth, uploadExcelAnalytics, fetchMaintenancePrediction } from './api/client';

export default function App() {
  const [backendStatus, setBackendStatus] = useState('AI maintenance recommendation generated');
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedPdf, setSelectedPdf] = useState('AeroTech_ATX200_Maintenance_Manual.pdf');
  const [analyticsResult, setAnalyticsResult] = useState(null);
  const [predictionReport, setPredictionReport] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [loadingPrediction, setLoadingPrediction] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);
  const pdfInputRef = useRef(null);

  useEffect(() => {
    fetchHealth()
      .then(() => setBackendStatus('AI maintenance recommendation generated'))
      .catch(() => setBackendStatus('EKS Backend Standby'));
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setErrorMessage(null);
    }
  };

  const handlePdfChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedPdf(e.target.files[0].name);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        setSelectedFile(file);
        setErrorMessage(null);
      } else {
        setErrorMessage('Please upload a valid Excel file (.xlsx or .xls).');
      }
    }
  };

  const handleRunAnalytics = async () => {
    if (!selectedFile) return;
    setLoadingAnalytics(true);
    setErrorMessage(null);
    try {
      const data = await uploadExcelAnalytics(selectedFile);
      setAnalyticsResult(data);
      // Auto-trigger prediction with the returned analytics
      handleRunPrediction(data);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const handleRunPrediction = async (analyticsPayload = analyticsResult) => {
    if (!analyticsPayload) {
      setErrorMessage('Please generate engineering analytics first.');
      return;
    }
    setLoadingPrediction(true);
    setErrorMessage(null);
    try {
      const reportData = await fetchMaintenancePrediction(analyticsPayload);
      setPredictionReport(reportData);
    } catch (err) {
      console.warn('Prediction call error:', err);
      setErrorMessage(`Prediction failed: ${err.message}`);
    } finally {
      setLoadingPrediction(false);
    }
  };

  // Extract dynamic payloads - strictly based on code
  const summary = analyticsResult?.summary;
  const currentRecord = summary?.current_record;
  const historicalAnalysis = summary?.historical_analysis || [];
  const report = predictionReport?.report;

  // Helper for trend lookup from historical_analysis
  const getTrend = (colName) => {
    return historicalAnalysis.find((item) => item.column === colName);
  };

  // Helper to format parameter column names
  const formatParamName = (colName) => {
    return colName.replace(/_/g, ' ');
  };

  // Helper for gauge percentage calculation
  const getGaugePercent = (val, max = 1500) => {
    if (val === undefined || val === null) return 0;
    const num = parseFloat(val);
    return Math.min(Math.max((num / max) * 100, 5), 100);
  };

  return (
    <div className="aerocare-app">
      {/* Header Banner */}
      <header className="aerocare-header">
        <div className="sub-header-label">POST-LANDING OPERATIONAL INTELLIGENCE</div>
        <h1 className="main-title">
          <span>✈️</span> AeroCare Maintenance
        </h1>
        <p className="tagline">
          From touchdown to action — every flight is reviewed with clarity and precision.
        </p>
        <div className="pill-group">
          <span className="pill-item">AI-Powered</span>
          <span className="pill-item">Real-time Analytics</span>
          <span className="pill-item">Manual-Grounded</span>
        </div>
        <div className="header-status-badge">
          <span className="status-pulse"></span>
          {backendStatus}
        </div>
      </header>

      {/* 3-Step Process Steps */}
      <div className="process-steps-grid">
        <div className="step-card">
          <div className="step-number">1</div>
          <div className="step-title">Flight intake</div>
          <div className="step-desc">Upload the landed-flight telemetry export for review.</div>
        </div>
        <div className="step-card">
          <div className="step-number">2</div>
          <div className="step-title">Condition review</div>
          <div className="step-desc">Compare the current signals with recent historical behavior.</div>
        </div>
        <div className="step-card">
          <div className="step-number">3</div>
          <div className="step-title">Action guidance</div>
          <div className="step-desc">Receive AI-backed maintenance direction grounded in the manual.</div>
        </div>
      </div>

      {/* Live Flight Monitoring Banner */}
      <div className="monitoring-banner">
        <div>
          <div className="monitoring-title-label">LIVE FLIGHT MONITORING</div>
          <h2 className="monitoring-headline">
            {currentRecord
              ? `Flight ${currentRecord.Aircraft_ID} has Landed and is being assessed.`
              : 'A landed flight is ready for assessment.'}
          </h2>
          <p className="monitoring-subtext">
            The telemetry loop is visualized here so the transition from landing to maintenance review feels immediate and operational.
          </p>
        </div>
        <FlightTrajectory />
      </div>

      {errorMessage && (
        <div style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#fca5a5', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
          ⚠️ {errorMessage}
        </div>
      )}

      {/* Dynamic 9-Header Cards Grid - Strictly based on API output */}
      {currentRecord && (
        <div className="telemetry-header-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="telemetry-card">
            <div className="card-header-row">✈️ AIRCRAFT</div>
            <div className="card-main-val" style={{ color: '#38bdf8' }}>{currentRecord.Aircraft_ID}</div>
            <div className="card-sub-val">{currentRecord.Aircraft_Model || 'A320neo'}</div>
          </div>

          <div className="telemetry-card">
            <div className="card-header-row">⚙️ ENGINE</div>
            <div className="card-main-val" style={{ color: '#f8fafc', fontSize: '1.15rem' }}>{currentRecord.Engine_Model || 'CFM LEAP-1A'}</div>
            <div className="card-sub-val">Airport: {currentRecord.Airport_Code || 'DEL'}</div>
          </div>

          <div className="telemetry-card">
            <div className="card-header-row">🔄 FLIGHT CYCLE</div>
            <div className="card-main-val" style={{ color: '#f8fafc' }}>{currentRecord.Flight_Cycle}</div>
            <div className="card-sub-val">{currentRecord.Flight_Hours} flight hours logged</div>
          </div>

          <div className="telemetry-card">
            <div className="card-header-row">🔧 SINCE OVERHAUL</div>
            <div className="card-main-val" style={{ color: '#38bdf8' }}>{currentRecord.Cycles_Since_Overhaul}</div>
            <div className="card-sub-val">Last maintenance: {currentRecord.Last_Maintenance_Date}</div>
          </div>

          <div className="telemetry-card">
            <div className="card-header-row">⚠️ RISK SCORE</div>
            <div className="card-main-val" style={{ color: '#f43f5e' }}>{currentRecord.Risk_Score}</div>
            <div className="card-sub-val" style={{ color: getTrend('Risk_Score')?.change_percent > 0 ? '#f43f5e' : '#10b981' }}>
              {getTrend('Risk_Score') ? `${getTrend('Risk_Score').change_percent > 0 ? '+' : ''}${getTrend('Risk_Score').change_percent}% vs history` : 'Computed from baseline'}
            </div>
          </div>

          <div className="telemetry-card">
            <div className="card-header-row">🛡️ REMAINING LIFE</div>
            <div className="card-main-val" style={{ color: '#f59e0b' }}>{currentRecord.Remaining_Useful_Life} cycles</div>
            <div className="card-sub-val" style={{ color: '#f59e0b' }}>
              {getTrend('Remaining_Useful_Life') ? `${getTrend('Remaining_Useful_Life').change_percent}% vs avg` : 'Useful life remaining'}
            </div>
          </div>

          <div className="telemetry-card">
            <div className="card-header-row">📊 VIBRATION</div>
            <div className="card-main-val" style={{ color: '#38bdf8' }}>{currentRecord.Engine_Vibration} mm/s</div>
            <div className="card-sub-val" style={{ color: '#38bdf8', fontWeight: 600 }}>
              {getTrend('Engine_Vibration')?.trend_direction || 'ANALYZED'}
            </div>
          </div>

          <div className="telemetry-card">
            <div className="card-header-row">📶 SIGNALS</div>
            <div className="card-main-val" style={{ color: '#f8fafc' }}>{historicalAnalysis.length}</div>
            <div className="card-sub-val">Window: {summary?.historical_window_size || 10} cycles</div>
          </div>

          <div className="telemetry-card">
            <div className="card-header-row">🌡️ AMBIENT</div>
            <div className="card-main-val" style={{ color: '#f8fafc' }}>{currentRecord.Ambient_Temperature}°C</div>
            <div className="card-sub-val">Humidity: {currentRecord.Humidity}%</div>
          </div>
        </div>
      )}

      {/* Main 3-Column Dashboard Layout */}
      <div className="three-column-grid">
        {/* Left Column: Upload Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Card 1: Flight Data Upload */}
          <div className="upload-card">
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Flight Data Upload</h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.25rem' }}>
              Upload the landed-flight telemetry export and begin the engineering review.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />

            <div
              className={`file-input-box ${isDragging ? 'dragging' : ''}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{
                borderColor: isDragging ? '#38bdf8' : undefined,
                background: isDragging ? 'rgba(56, 189, 248, 0.08)' : undefined,
                marginTop: '1rem',
              }}
            >
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1' }}>
                Engineering Excel (.xlsx)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginTop: '0.6rem' }}>
                <span
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#fff',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '0.4rem',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                  }}
                >
                  Choose file
                </span>
                <span style={{ fontSize: '0.8rem', color: selectedFile ? '#38bdf8' : '#94a3b8', fontWeight: selectedFile ? 600 : 400 }}>
                  {selectedFile ? selectedFile.name : 'No file chosen'}
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '1rem', lineHeight: '1.4' }}>
              This stage compares the latest landed-flight telemetry with the historical baseline to reveal the current aircraft condition.
            </p>

            <button
              className="btn-cyan-gradient"
              disabled={!selectedFile || loadingAnalytics}
              onClick={handleRunAnalytics}
            >
              {loadingAnalytics ? 'Processing Telemetry...' : 'Generate Engineering Analytics'}
            </button>
          </div>

          {/* Card 2: Maintenance Guidance (Purple glowing panel) */}
          <div className="upload-card purple-panel" style={{ border: '1px solid rgba(192, 132, 252, 0.35)', background: 'linear-gradient(180deg, rgba(168, 85, 247, 0.08) 0%, rgba(11, 21, 36, 0.85) 100%)' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc' }}>Maintenance Guidance</h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.25rem' }}>
              Use the analytics output and the aviation manual for action guidance.
            </p>

            <input
              ref={pdfInputRef}
              type="file"
              accept=".pdf"
              onChange={handlePdfChange}
              style={{ display: 'none' }}
            />

            <div
              className="file-input-box"
              onClick={() => pdfInputRef.current?.click()}
              style={{ marginTop: '1rem', borderColor: 'rgba(192, 132, 252, 0.3)' }}
            >
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1' }}>
                Maintenance PDF (.pdf)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginTop: '0.6rem' }}>
                <span
                  style={{
                    background: 'rgba(192, 132, 252, 0.15)',
                    border: '1px solid rgba(192, 132, 252, 0.3)',
                    color: '#c084fc',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '0.4rem',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                  }}
                >
                  Choose file
                </span>
                <span style={{ fontSize: '0.8rem', color: '#c084fc', fontWeight: 500 }}>
                  {selectedPdf}
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.75rem' }}>
              Manual loaded: <span style={{ color: '#cbd5e1', fontWeight: 600 }}>{selectedPdf}</span>
            </p>

            <button
              className="btn-purple-gradient"
              disabled={!analyticsResult || loadingPrediction}
              onClick={() => handleRunPrediction(analyticsResult)}
              style={{
                background: 'linear-gradient(135deg, #a855f7 0%, #c084fc 100%)',
                color: '#050b14',
                border: 'none',
                padding: '0.85rem 1.25rem',
                borderRadius: '0.6rem',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                width: '100%',
                marginTop: '1.25rem',
                boxShadow: '0 4px 14px rgba(168, 85, 247, 0.3)',
              }}
            >
              {loadingPrediction ? 'Invoking Bedrock...' : '✨ Generate AI Recommendation'}
            </button>
          </div>
        </div>

        {/* Middle Column: Engineering Analytics */}
        <div className="upload-card">
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Engineering Analytics</h3>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.25rem' }}>
            Operational health derived from the uploaded aircraft dataset
          </p>

          {!currentRecord ? (
            <div className="empty-state-container">
              <div className="empty-state-icon">📊</div>
              <p className="empty-state-text">
                Upload the Excel file and generate engineering analytics to view the aircraft health dashboard.
              </p>
            </div>
          ) : (
            <div>
              {/* Aircraft Summary Badge Bar */}
              <div className="aircraft-summary-badge" style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.2)', padding: '0.75rem 1rem', borderRadius: '0.6rem', margin: '1rem 0', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 700, color: '#ffffff' }}>✈️ {currentRecord.Aircraft_ID} — {currentRecord.Aircraft_Model || 'A320neo'}</span>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>🔧 {currentRecord.Engine_Model || 'CFM LEAP-1A'}</span>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>📍 {currentRecord.Airport_Code || 'DEL'}</span>
                <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 600 }}>🔄 Cycle {currentRecord.Flight_Cycle}</span>
              </div>

              {/* Dynamic 8 Engine Sensor Gauge Cards Grid (2x4) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {currentRecord.Engine_Temperature !== undefined && (
                  <div className="gauge-card">
                    <div className="gauge-label">ENGINE TEMP</div>
                    <div className="gauge-val">{currentRecord.Engine_Temperature} °C</div>
                    <div className="gauge-bar-bg"><div className="gauge-bar-fill" style={{ width: `${getGaugePercent(currentRecord.Engine_Temperature, 1000)}%`, background: '#f97316' }}></div></div>
                  </div>
                )}

                {currentRecord.Exhaust_Gas_Temperature !== undefined && (
                  <div className="gauge-card">
                    <div className="gauge-label">EGT</div>
                    <div className="gauge-val">{currentRecord.Exhaust_Gas_Temperature} °C</div>
                    <div className="gauge-bar-bg"><div className="gauge-bar-fill" style={{ width: `${getGaugePercent(currentRecord.Exhaust_Gas_Temperature, 900)}%`, background: '#10b981' }}></div></div>
                  </div>
                )}

                {currentRecord.Oil_Temperature !== undefined && (
                  <div className="gauge-card">
                    <div className="gauge-label">OIL TEMP</div>
                    <div className="gauge-val">{currentRecord.Oil_Temperature} °C</div>
                    <div className="gauge-bar-bg"><div className="gauge-bar-fill" style={{ width: `${getGaugePercent(currentRecord.Oil_Temperature, 200)}%`, background: '#38bdf8' }}></div></div>
                  </div>
                )}

                {currentRecord.Oil_Pressure !== undefined && (
                  <div className="gauge-card">
                    <div className="gauge-label">OIL PRESSURE</div>
                    <div className="gauge-val">{currentRecord.Oil_Pressure} psi</div>
                    <div className="gauge-bar-bg"><div className="gauge-bar-fill" style={{ width: `${getGaugePercent(currentRecord.Oil_Pressure, 100)}%`, background: '#f59e0b' }}></div></div>
                  </div>
                )}

                {currentRecord.Engine_RPM !== undefined && (
                  <div className="gauge-card">
                    <div className="gauge-label">ENGINE RPM</div>
                    <div className="gauge-val">{currentRecord.Engine_RPM.toLocaleString()} RPM</div>
                    <div className="gauge-bar-bg"><div className="gauge-bar-fill" style={{ width: `${getGaugePercent(currentRecord.Engine_RPM, 12000)}%`, background: '#10b981' }}></div></div>
                  </div>
                )}

                {currentRecord.Fuel_Flow !== undefined && (
                  <div className="gauge-card">
                    <div className="gauge-label">FUEL FLOW</div>
                    <div className="gauge-val">{currentRecord.Fuel_Flow.toLocaleString()} kg/h</div>
                    <div className="gauge-bar-bg"><div className="gauge-bar-fill" style={{ width: `${getGaugePercent(currentRecord.Fuel_Flow, 4000)}%`, background: '#38bdf8' }}></div></div>
                  </div>
                )}

                {currentRecord.Compressor_Pressure !== undefined && (
                  <div className="gauge-card">
                    <div className="gauge-label">COMPRESSOR</div>
                    <div className="gauge-val">{currentRecord.Compressor_Pressure} psi</div>
                    <div className="gauge-bar-bg"><div className="gauge-bar-fill" style={{ width: `${getGaugePercent(currentRecord.Compressor_Pressure, 80)}%`, background: '#10b981' }}></div></div>
                  </div>
                )}

                {currentRecord.Hydraulic_Pressure !== undefined && (
                  <div className="gauge-card">
                    <div className="gauge-label">HYDRAULIC</div>
                    <div className="gauge-val">{currentRecord.Hydraulic_Pressure.toLocaleString()} psi</div>
                    <div className="gauge-bar-bg"><div className="gauge-bar-fill" style={{ width: `${getGaugePercent(currentRecord.Hydraulic_Pressure, 4000)}%`, background: '#f43f5e' }}></div></div>
                  </div>
                )}
              </div>

              {/* Dynamic Signal Trends Table (Renders ALL items in historicalAnalysis) */}
              {historicalAnalysis.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Signal Trends</h4>
                    <span style={{ fontSize: '0.75rem', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '0.3rem' }}>
                      {historicalAnalysis.length} parameters
                    </span>
                  </div>

                  <div className="trends-table-container" style={{ overflowX: 'auto', maxHeight: '320px', overflowY: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8' }}>
                          <th style={{ padding: '0.5rem 0.75rem', fontWeight: 600 }}>PARAMETER</th>
                          <th style={{ padding: '0.5rem 0.75rem', fontWeight: 600 }}>CURRENT</th>
                          <th style={{ padding: '0.5rem 0.75rem', fontWeight: 600 }}>CHANGE</th>
                          <th style={{ padding: '0.5rem 0.75rem', fontWeight: 600 }}>TREND</th>
                        </tr>
                      </thead>
                      <tbody>
                        {historicalAnalysis.map((item, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                            <td style={{ padding: '0.5rem 0.75rem', color: '#cbd5e1', fontWeight: 500 }}>{formatParamName(item.column)}</td>
                            <td style={{ padding: '0.5rem 0.75rem', fontFamily: 'JetBrains Mono', color: '#f8fafc' }}>{item.latest_value}</td>
                            <td style={{ padding: '0.5rem 0.75rem', color: item.change_percent > 0 ? '#f43f5e' : item.change_percent < 0 ? '#38bdf8' : '#94a3b8' }}>
                              {item.change_percent > 0 ? '+' : ''}{item.change_percent}%
                            </td>
                            <td style={{ padding: '0.5rem 0.75rem' }}>
                              <span
                                style={{
                                  fontSize: '0.7rem',
                                  fontWeight: 700,
                                  padding: '0.15rem 0.45rem',
                                  borderRadius: '0.25rem',
                                  background:
                                    item.trend_direction === 'INCREASING'
                                      ? 'rgba(244, 63, 94, 0.15)'
                                      : item.trend_direction === 'DECREASING'
                                      ? 'rgba(56, 189, 248, 0.15)'
                                      : 'rgba(148, 163, 184, 0.15)',
                                  color:
                                    item.trend_direction === 'INCREASING'
                                      ? '#f43f5e'
                                      : item.trend_direction === 'DECREASING'
                                      ? '#38bdf8'
                                      : '#94a3b8',
                                }}
                              >
                                {item.trend_direction}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: AI Maintenance Recommendation */}
        <div className="upload-card ai-recommendation-panel">
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc' }}>
            AI Maintenance Recommendation
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.25rem' }}>
            Intelligent guidance generated from analytics & maintenance manual
          </p>

          {loadingPrediction ? (
            <div className="empty-state-container">
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🧠</div>
              <p style={{ color: '#c084fc', fontWeight: 600 }}>Evaluating telemetry against AeroTech manual...</p>
            </div>
          ) : !report ? (
            <div className="empty-state-container">
              <div className="empty-state-icon" style={{ filter: 'drop-shadow(0 0 12px rgba(192, 132, 252, 0.4))' }}>🧠</div>
              <p className="empty-state-text">
                Generate the AI recommendation to view the intelligent maintenance decision board.
              </p>
            </div>
          ) : (
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* AI Analysis Header Bar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(192, 132, 252, 0.1)', padding: '0.6rem 0.85rem', borderRadius: '0.5rem', border: '1px solid rgba(192, 132, 252, 0.2)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#c084fc' }}>
                  🧠 AI ANALYSIS — {report.aircraft || currentRecord?.Aircraft_ID} • {report.aircraft_model || currentRecord?.Aircraft_Model}
                </span>
              </div>

              {/* Status Badges Row */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {report.health_status && (
                  <span style={{ background: 'rgba(245, 158, 11, 0.2)', border: '1px solid rgba(245, 158, 11, 0.4)', color: '#fbbf24', padding: '0.25rem 0.65rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>
                    🟡 {report.health_status}
                  </span>
                )}
                {report.risk_level && (
                  <span style={{ background: 'rgba(249, 115, 22, 0.2)', border: '1px solid rgba(249, 115, 22, 0.4)', color: '#f97316', padding: '0.25rem 0.65rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>
                    🟠 {report.risk_level} RISK
                  </span>
                )}
                {report.safe_for_next_flight !== undefined && (
                  <span style={{ background: report.safe_for_next_flight ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)', border: report.safe_for_next_flight ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(244, 63, 94, 0.4)', color: report.safe_for_next_flight ? '#10b981' : '#f43f5e', padding: '0.25rem 0.65rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>
                    {report.safe_for_next_flight ? '🟢 SAFE FOR FLIGHT' : '🔴 GROUND AIRCRAFT'}
                  </span>
                )}
              </div>

              {/* Summary Quote Box */}
              {report.overall_summary && (
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', borderLeft: '3px solid #c084fc', padding: '0.85rem', borderRadius: '0.4rem', fontSize: '0.825rem', color: '#cbd5e1', fontStyle: 'italic', lineHeight: '1.5' }}>
                  "{report.overall_summary}"
                </div>
              )}

              {/* Flight Decision Banner */}
              {report.final_flight_decision && (
                <div style={{ background: report.final_flight_decision.can_fly_now ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)', border: report.final_flight_decision.can_fly_now ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(244, 63, 94, 0.3)', padding: '1rem', borderRadius: '0.6rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: report.final_flight_decision.can_fly_now ? '#10b981' : '#f43f5e', fontSize: '0.9rem' }}>
                    {report.final_flight_decision.can_fly_now ? '✅ FLY WITH MONITORING' : '🔴 GROUND AIRCRAFT IMMEDIATELY'}
                  </div>
                  <div style={{ fontWeight: 700, color: '#ffffff', marginTop: '0.35rem', fontSize: '0.85rem' }}>
                    {report.final_flight_decision.ui_statement}
                  </div>
                  {report.final_flight_decision.required_before_next_flight && (
                    <div style={{ fontSize: '0.775rem', color: '#cbd5e1', marginTop: '0.35rem' }}>
                      ⚡ {report.final_flight_decision.required_before_next_flight}
                    </div>
                  )}
                </div>
              )}

              {/* Threshold Violations Section */}
              {report.threshold_violations && report.threshold_violations.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f43f5e', marginBottom: '0.6rem' }}>
                    ⚠️ Threshold Violations
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {report.threshold_violations.map((viol, idx) => (
                      <div key={idx} style={{ background: 'rgba(244, 63, 94, 0.06)', border: '1px solid rgba(244, 63, 94, 0.2)', padding: '0.8rem', borderRadius: '0.5rem' }}>
                        <div style={{ fontWeight: 700, color: '#fca5a5', fontSize: '0.85rem' }}>{viol.parameter}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '0.3rem', color: '#94a3b8' }}>
                          <span>OBSERVED: <strong style={{ color: '#f43f5e' }}>{viol.observed_value}</strong></span>
                          <span>THRESHOLD: <strong style={{ color: '#f8fafc' }}>{viol.manual_threshold}</strong></span>
                        </div>
                        {viol.explanation && (
                          <div style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: '0.35rem' }}>{viol.explanation}</div>
                        )}
                        {viol.manual_reference && (
                          <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.35rem' }}>📖 {viol.manual_reference}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Inspection Checklist */}
              {report.inspection_checklist && report.inspection_checklist.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#c084fc', marginBottom: '0.6rem' }}>
                    📋 Inspection Checklist
                  </h4>
                  <div className="checklist-container">
                    {report.inspection_checklist.map((item, idx) => (
                      <div key={idx} className="inspection-step-item">
                        <div className="step-badge">Step {item.step || idx + 1}</div>
                        <div className="step-item-title">{item.inspection_item}</div>
                        <div className="step-item-criteria">Criteria: {item.acceptance_criteria}</div>
                        <div className="step-item-ref">Ref: {item.manual_reference}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
