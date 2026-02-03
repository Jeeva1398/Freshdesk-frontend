import api from '../api';

export const getTickets = async () => {
    const response = await api.get('/freshdesk/tickets');
    return response.data;
};

export const getTicketDetails = async (id) => {
    const response = await api.get(`/freshdesk/tickets/${id}`);
    return response.data;
};

export const getTicketConversations = async (id) => {
    const response = await api.get(`/freshdesk/tickets/${id}/conversations`);
    return response.data;
};
