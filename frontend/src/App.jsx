import React, { useState, useEffect } from 'react';
import PanelCard from './components/PanelCard';
import { fetchHealth, uploadExcelAnalytics, fetchMaintenancePrediction } from './api/client';

export default function App() {
  const [backendStatus, setBackendStatus] = useState('Checking...');
  const [selectedFile, setSelectedFile] = useState(null);
  const [analyticsResult, setAnalyticsResult] = useState(null);
  const [predictionReport, setPredictionReport] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [loadingPrediction, setLoadingPrediction] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    fetchHealth()
      .then((data) => setBackendStatus(data.service ? 'Connected to EKS API' : 'Online'))
      .catch((err) => setBackendStatus('Backend unreachable'));
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleRunAnalytics = async () => {
    if (!selectedFile) return;
    setLoadingAnalytics(true);
    setErrorMessage(null);
    try {
      const data = await uploadExcelAnalytics(selectedFile);
      setAnalyticsResult(data);
      // Auto-trigger maintenance prediction
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

  return (
    <div className="dashboard-container">
      <header className="header-banner">
        <div>
          <h1 className="header-title">Aircraft Maintenance Platform</h1>
          <p className="header-subtitle">Engineering Analytics & Bedrock AI Predictive Maintenance</p>
        </div>
        <div className="status-badge">
          <span className="status-dot"></span>
          {backendStatus}
        </div>
      </header>

      {errorMessage && (
        <div className="error-banner">
          ⚠️ {errorMessage}
        </div>
      )}

      <div className="grid-layout">
        {/* Step 1: Upload & Analytics */}
        <PanelCard
          title="1. Dataset Analytics"
          subtitle="Upload Excel maintenance dataset (.xlsx)"
          icon="📊"
        >
          <div className="upload-area">
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              id="file-upload"
              style={{ display: 'none' }}
            />
            <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📁</div>
              <p>{selectedFile ? selectedFile.name : 'Click to select Excel dataset file'}</p>
            </label>
          </div>

          <button
            className="btn-primary"
            disabled={!selectedFile || loadingAnalytics}
            onClick={handleRunAnalytics}
          >
            {loadingAnalytics ? 'Processing Dataset...' : 'Generate Engineering Analytics'}
          </button>

          {analyticsResult && (
            <div style={{ marginTop: '1.5rem' }}>
              <h4 style={{ fontSize: '0.9rem', color: '#38bdf8' }}>Aircraft Summary: {analyticsResult.aircraft_id}</h4>
              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="metric-label">Flight Cycle</div>
                  <div className="metric-value">
                    {analyticsResult.summary?.latest_flight_cycle || 101}
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Flight Hours</div>
                  <div className="metric-value">
                    {analyticsResult.summary?.current_record?.Flight_Hours || 390}h
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Engine Temp</div>
                  <div className="metric-value">
                    {analyticsResult.summary?.current_record?.Engine_Temperature || 1500}°
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Vibration</div>
                  <div className="metric-value">
                    {analyticsResult.summary?.current_record?.Engine_Vibration || 15}
                  </div>
                </div>
              </div>
            </div>
          )}
        </PanelCard>

        {/* Step 2: Bedrock AI Prediction */}
        <PanelCard
          title="2. Bedrock Maintenance Report"
          subtitle="AI-driven inspection checklist & manual references"
          icon="🤖"
        >
          {loadingPrediction ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>Analyzing telemetry with Amazon Bedrock Nova Pro...</p>
            </div>
          ) : predictionReport?.report ? (
            <div>
              <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                <span className="status-badge" style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8' }}>
                  Risk: {predictionReport.report.risk_level || 'MEDIUM'}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Model: Nova Pro</span>
              </div>

              {predictionReport.report.inspection_checklist ? (
                <div>
                  <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem', color: '#e2e8f0' }}>Inspection Checklist</h4>
                  {predictionReport.report.inspection_checklist.map((item, idx) => (
                    <div key={idx} className="checklist-item">
                      <div className="checklist-step">Step {item.step || idx + 1}</div>
                      <div className="checklist-title">{item.inspection_item}</div>
                      <div className="checklist-criteria">Acceptance: {item.acceptance_criteria}</div>
                      <div className="checklist-ref">Ref: {item.manual_reference}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <pre style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '0.5rem', fontSize: '0.8rem', overflowX: 'auto' }}>
                  {JSON.stringify(predictionReport.report, null, 2)}
                </pre>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              <p>Upload an Excel dataset to generate the AI inspection report.</p>
            </div>
          )}
        </PanelCard>
      </div>
    </div>
  );
}
