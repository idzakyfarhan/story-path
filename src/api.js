const API_BASE_URL = 'https://0b5ff8b0.uqcloud.net/api';
const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic3R1ZGVudCIsInVzZXJuYW1lIjoiczQ4Nzc3NDAifQ.ITytk4CZSTwqk1bu7h9kKGOtGRd4jYHo2bSN_I-YH4U'; // Ganti dengan token JWT Anda
const USERNAME = 's4877740'; // Ganti dengan username yang sesuai

async function apiRequest(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${JWT_TOKEN}`,
    },
  };

  if (method === 'POST' || method === 'PATCH') {
    options.headers['Prefer'] = 'return=representation';
  }

  if (body) {
    options.body = JSON.stringify({ ...body, username: USERNAME });
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

  if (response.status === 204 || response.status === 205) {
    return {};
  }

  if (!response.ok) {
    const errorResponse = await response.text();
    throw new Error(`HTTP error! status: ${response.status}, message: ${errorResponse || 'Unknown Error'}`);
  }

  return response.json();
}

export async function createLocation(location) {
  return apiRequest('/location', 'POST', location);
}

export async function getLocations() {
  return apiRequest('/location');
}

export async function getLocation(id) {
  return apiRequest(`/location?id=eq.${id}`);
}

export async function updateLocation(id, locationData) {
  return apiRequest(`/location?id=eq.${id}`, 'PATCH', locationData);
}

export async function deleteLocation(id) {
  return apiRequest(`/location?id=eq.${id}`, 'DELETE');
}

export async function createProject(project) {
  return apiRequest('/project', 'POST', project);
}

export async function getProjects() {
  return apiRequest('/project');
}

export async function getProject(id) {
  return apiRequest(`/project?id=eq.${id}`);
}

export async function updateProject(id, projectData) {
  return apiRequest(`/project?id=eq.${id}`, 'PATCH', projectData);
}

export async function deleteProject(id) {
  return apiRequest(`/project?id=eq.${id}`, 'DELETE');
}
