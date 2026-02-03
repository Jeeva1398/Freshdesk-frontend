import api from '../api';

export const login = async (credentials) => {
    const response = await api.post('/user/login', credentials);
    return response.data;
};

export const signup = async (userData) => {
    const response = await api.post('/user/signup', userData);
    return response.data;
};

export const getProfile = async () => {
    const response = await api.get('/user');
    return response.data;
};

export const updateProfile = async (id, data) => {
    const response = await api.put(`/user/${id}`, data);
    return response.data;
};
