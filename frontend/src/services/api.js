import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

export const getChannels = async () => {
  const res = await api.get('/channels');
  return res.data;
};

export const getChannelById = async (id) => {
  const res = await api.get(`/channels/${id}`);
  return res.data;
};

export const syncChannelVideos = async (id) => {
  const res = await api.post(`/channels/${id}/sync`);
  return res.data;
};

export const getChannelVideos = async (id, params = {}) => {
  const res = await api.get(`/channels/${id}/videos`, { params });
  return res.data;
};

export const getGoogleAuthUrl = async () => {
  const res = await api.get('/auth/google/url');
  return res.data.url;
};

export const importChannelByUrlOrHandle = async (urlOrHandle) => {
  const res = await api.post('/channels/import', { urlOrHandle });
  return res.data;
};

export const disconnectChannel = async (id) => {
  const res = await api.delete(`/channels/${id}`);
  return res.data;
};

export default api;
