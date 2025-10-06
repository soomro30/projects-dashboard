import usersConfig from '../config/users.json';
import boardAccessConfig from '../config/boardAccess.json';

// Simple authentication
const CREDENTIALS = {
  'admin': {
    password: 'imkan2025',
    role: 'admin',
    name: 'Administrator'
  },
  'adcg.board': {
    password: 'adcg2025',
    role: 'board',
    name: 'ADCG Board User'
  }
};

export const authenticateUser = (username, password) => {
  const user = CREDENTIALS[username];

  if (user && user.password === password) {
    return {
      username,
      role: user.role,
      name: user.name,
      success: true
    };
  }

  return {
    success: false,
    error: 'Invalid username or password'
  };
};

export const getUserRole = (username) => {
  const user = CREDENTIALS[username];
  return user ? user.role : null;
};

export const getAllowedProjects = (role) => {
  if (role === 'board') {
    return boardAccessConfig.allowedProjects;
  }
  return null; // null means all projects (admin/full access)
};

export const isProjectAllowed = (projectId, role) => {
  const allowedProjects = getAllowedProjects(role);

  if (allowedProjects === null) {
    return true; // Full access
  }

  return allowedProjects.includes(projectId);
};

export const filterProjectsByRole = (projects, role) => {
  const allowedProjects = getAllowedProjects(role);

  if (allowedProjects === null) {
    return projects; // Return all projects for full access
  }

  return projects.filter(project => allowedProjects.includes(project.projectId));
};

export const saveAuthToken = (userData) => {
  localStorage.setItem('authUser', JSON.stringify(userData));
};

export const getAuthToken = () => {
  const userData = localStorage.getItem('authUser');
  return userData ? JSON.parse(userData) : null;
};

export const clearAuthToken = () => {
  localStorage.removeItem('authUser');
};

export const isAuthenticated = () => {
  return getAuthToken() !== null;
};
