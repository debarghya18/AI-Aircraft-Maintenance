const API_BASE = import.meta.env.VITE_API_URL || 'http://adc8913416fe54367b4614a3d695d165-1582974554.us-east-1.elb.amazonaws.com';

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/testing/health`);
  if (!res.ok) throw new Error('Health check failed');
  return res.json();
}

export async function uploadExcelAnalytics(file) {
  const formData = new FormData();
  formData.append('excel_file', file);

  const res = await fetch(`${API_BASE}/aircraft/analytics`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to generate analytics');
  }

  return res.json();
}

export async function fetchMaintenancePrediction(analyticsPayload) {
  const res = await fetch(`${API_BASE}/aircraft/maintenance-prediction`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(analyticsPayload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Maintenance prediction request failed');
  }

  return res.json();
}
