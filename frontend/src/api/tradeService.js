import api from './axiosConfig';

export const getTrades = () => api.get('/trades');
export const getTrade = (id) => api.get(`/trades/${id}`);
export const createTrade = (data) => api.post('/trades', data);
export const updateTradeStatus = (id, status) => api.put(`/trades/${id}`, { status });
export const deleteTrade = (id) => api.delete(`/trades/${id}`);