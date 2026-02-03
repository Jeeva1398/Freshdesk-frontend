import api from '../api';

export const connectHubSpot = async () => {
    try {
        window.location.href = `${api.defaults.baseURL}/hubspot/connect?token=${localStorage.getItem('token')}`;
    } catch (error) {
        throw error;
    }
};

export const getHubSpotStatus = async () => {
    const response = await api.get('/hubspot/status');
    return response.data;
};

export const getContacts = async () => {
    const response = await api.get('/hubspot/contacts');
    return response.data;
};

export const searchContact = async (email) => {
    const response = await api.get('/hubspot/contact', {
        params: { email }
    });
    return response.data;
};