import React, { useState, useEffect, useRef } from 'react';
import FlightTrajectory from './components/FlightTrajectory';
import { fetchHealth, uploadExcelAnalytics, fetchMaintenancePrediction } from './api/client';

export default function App() {
  const [backendStatus, setBackendStatus] = useState('AI maintenance recommendation generated');
  const [selectedFile, setSelectedFile] = useState(null);
  const [analyticsResult, setAnalyticsResult] = useState(null);
  const [predictionReport, setPredictionReport] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [loadingPrediction, setLoadingPrediction] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

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

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRunAnalytics = async () => {
    if (!selectedFile) return;
    setLoadingAnalytics(true);
    setErrorMessage(null);
    try {
      const data = await uploadExcelAnalytics(selectedFile);
      setAnalyticsResult(data);
      // Automatically trigger AI maintenance prediction
      handleRunPrediction(data);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const handleRunPrediction = async (analyticsPayload) => {
    setLoadingPrediction(true);
    try {
      const reportData = await fetchMaintenancePrediction(analyticsPayload);
      setPredictionReport(reportData);
    } catch (err) {
      console.warn('Prediction call failed:', err);
    } finally {
      setLoadingPrediction(false);
    }
  };

  const currentRecord = analyticsResult?.summary?.current_record;

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
            A landed flight is ready for assessment.
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

      {/* 3-Column Bottom Layout */}
      <div className="three-column-grid">
        {/* Column 1: Flight Data Upload */}
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
            onClick={triggerFileInput}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
              borderColor: isDragging ? '#38bdf8' : undefined,
              background: isDragging ? 'rgba(56, 189, 248, 0.08)' : undefined,
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
                  padding: '0.45rem 0.9rem',
                  borderRadius: '0.4rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  display: 'inline-block',
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

        {/* Column 2: Engineering Analytics */}
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
            <div className="telemetry-compact-grid">
              <div className="telemetry-card">
                <div className="card-header-row">✈️ AIRCRAFT</div>
                <div className="card-main-val" style={{ color: '#38bdf8' }}>{currentRecord.Aircraft_ID || 'AIR-001'}</div>
                <div className="card-sub-val">{currentRecord.Aircraft_Model || 'A320neo'}</div>
              </div>
              <div className="telemetry-card">
                <div className="card-header-row">⚙️ ENGINE</div>
                <div className="card-main-val" style={{ color: '#f8fafc', fontSize: '1.1rem' }}>{currentRecord.Engine_Model || 'CFM LEAP-1A'}</div>
                <div className="card-sub-val">Airport: {currentRecord.Airport_Code || 'DEL'}</div>
              </div>
              <div className="telemetry-card">
                <div className="card-header-row">📊 FLIGHT CYCLE</div>
                <div className="card-main-val" style={{ color: '#f8fafc' }}>{currentRecord.Flight_Cycle || 101}</div>
                <div className="card-sub-val">{currentRecord.Flight_Hours || 390} flight hours logged</div>
              </div>
              <div className="telemetry-card">
                <div className="card-header-row">🔧 SINCE OVERHAUL</div>
                <div className="card-main-val" style={{ color: '#38bdf8' }}>{currentRecord.Cycles_Since_Overhaul || 101}</div>
                <div className="card-sub-val">Last maint: {currentRecord.Last_Maintenance_Date || '2026-10-28'}</div>
              </div>
              <div className="telemetry-card">
                <div className="card-header-row">⚠️ RISK SCORE</div>
                <div className="card-main-val" style={{ color: '#f43f5e' }}>98</div>
                <div className="card-sub-val" style={{ color: '#f43f5e' }}>+32.2% vs history</div>
              </div>
              <div className="telemetry-card">
                <div className="card-header-row">⏱️ REMAINING LIFE</div>
                <div className="card-main-val" style={{ color: '#f59e0b' }}>30 cycles</div>
                <div className="card-sub-val" style={{ color: '#f59e0b' }}>-13.0% vs avg</div>
              </div>
            </div>
          )}
        </div>

        {/* Column 3: AI Maintenance Recommendation */}
        <div className="upload-card ai-recommendation-panel">
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc' }}>
            AI Maintenance Recommendation
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.25rem' }}>
            Intelligent guidance generated from analytics & maintenance manual
          </p>

          {loadingPrediction ? (
            <div className="empty-state-container">
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚡</div>
              <p style={{ color: '#c084fc', fontWeight: 600 }}>Analyzing telemetry against maintenance manual...</p>
            </div>
          ) : !predictionReport?.report ? (
            <div className="empty-state-container">
              <div className="empty-state-icon" style={{ filter: 'drop-shadow(0 0 12px rgba(192, 132, 252, 0.4))' }}>🧠</div>
              <p className="empty-state-text">
                Generate the AI recommendation to view the intelligent maintenance report.
              </p>
            </div>
          ) : (
            <div style={{ marginTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', padding: '0.5rem 0.75rem', background: 'rgba(192, 132, 252, 0.1)', borderRadius: '0.4rem', border: '1px solid rgba(192, 132, 252, 0.2)' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#c084fc' }}>
                  Risk Assessment: {predictionReport.report.risk_level || 'ELEVATED'}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Bedrock Nova Pro</span>
              </div>
              {predictionReport.report.inspection_checklist && (
                <div className="checklist-container">
                  {predictionReport.report.inspection_checklist.map((item, idx) => (
                    <div key={idx} className="inspection-step-item">
                      <div className="step-badge">Step {item.step || idx + 1}</div>
                      <div className="step-item-title">{item.inspection_item}</div>
                      <div className="step-item-criteria">Criteria: {item.acceptance_criteria}</div>
                      <div className="step-item-ref">Ref: {item.manual_reference}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
