// Central API Client for Professional Tools Mobile App
const DEV_API_URL = 'http://192.168.137.1:5000/api';

export const API_BASE_URL = DEV_API_URL;

export async function fetchApi(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(url, { ...options, headers });
    const data = await response.json();
    return { ok: response.ok, status: response.status, data };
  } catch (error) {
    console.log(`API Error [${endpoint}]:`, error.message);
    return { ok: false, status: 500, error: error.message };
  }
}

export function formatUZS(amount) {
  if (typeof amount !== 'number') return '0 so\'m';
  return `${amount.toLocaleString('uz-UZ')} so'm`;
}
