export const API_BASE = process.env.REACT_APP_API_BASE_URL;
export const PYTHON_BASE = process.env.REACT_APP_PYTHON_API_BASE_URL
export const API_ENDPOINTS = {
  AUTH: `${API_BASE}/auth`,
  USER: `${API_BASE}/users`,
  COMPANY: `${API_BASE}/company`,
};

export const PYTHON_ENDPOINT = {
  PYTHON: `${PYTHON_BASE}`
}