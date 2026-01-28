import { AxiosIntance } from '../../context/axiosintance';

const API_BASE = '/api/v1/users';


export const loginUser = async (email, password) => {
  const response = await AxiosIntance.post(`${API_BASE}/login`, {
    email,
    password,
  });
  return response;
};


export const registerUser = async (name, username, email, password, avatar) => {
  const formData = new FormData();
  formData.append('name', name);
  formData.append('username', username);
  formData.append('email', email);
  formData.append('password', password);
  if (avatar) {
    formData.append('avatar', avatar);
  }

  const response = await AxiosIntance.post(`${API_BASE}/register`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response;
};


export const logoutUser = async () => {
  const response = await AxiosIntance.post(`${API_BASE}/logout`);
  return response;
};


export const refreshAccessToken = async () => {
  const response = await AxiosIntance.post(`${API_BASE}/refresh-token`);
  return response;
};

 
export const getCurrentUser = async () => {
  const response = await AxiosIntance.get(`${API_BASE}/me`);
  return response;
};
