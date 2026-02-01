import { AxiosInstance } from "../../context/axiosInstance";

const API_BASE = '/api/v1/users';


export const loginUser = async (email, password) => {
  const response = await AxiosInstance.post(`${API_BASE}/login`, {
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

  const response = await AxiosInstance.post(`${API_BASE}/register`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response;
};


export const logoutUser = async () => {
  const response = await AxiosInstance.post(`${API_BASE}/logout`);
  return response;
};


export const refreshAccessToken = async () => {
  const response = await AxiosInstance.post(`${API_BASE}/refresh-token`);
  return response;
};

 
export const getCurrentUser = async () => {
  const response = await AxiosInstance.get(`${API_BASE}/me`);
  return response;
};

export const updateProfilePhoto = async (file) => {
  const formData = new FormData();
  formData.append('newImage', file);
  const response = await AxiosInstance.post(`${API_BASE}/update-profile-photo`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response;
};

export const deleteProfilePhoto = async () => {
  const response = await AxiosInstance.post(`${API_BASE}/delete-profile-photo`);
  return response;
};

export const updateProfileName = async (name) => {
  const response = await AxiosInstance.patch(`${API_BASE}/update-name`, { name });
  return response;
};
