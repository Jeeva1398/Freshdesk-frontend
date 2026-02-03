import { useEffect, useState } from 'react';
import { Table, Button, Card, Result, Spin, Tag } from 'antd';
import { ApiOutlined, SyncOutlined } from '@ant-design/icons';
import { getHubSpotStatus, getContacts } from '../services/hubspotService';

const HubSpotContacts = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [loading, setLoading] = useState(true);
    const [contacts, setContacts] = useState([]);
    const [fetchingContacts, setFetchingContacts] = useState(false);

    useEffect(() => {
        checkStatus();
    }, []);

    const checkStatus = async () => {
        try {
            const status = await getHubSpotStatus();
            setIsConnected(status.connected);
            if (status.connected) {
                fetchContacts();
            }
        } catch (error) {
            console.error('Failed to check HubSpot status', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchContacts = async () => {
        setFetchingContacts(true);
        try {
            const data = await getContacts();
            setContacts(data);
        } catch (error) {
            console.error('Failed to fetch contacts');
        } finally {
            setFetchingContacts(false);
        }
    };

    const handleConnect = () => {


        const token = localStorage.getItem('token');
        window.location.href = `http://localhost:7005/v1/hubspot/connect?token=${token}`;
    };

    const columns = [
        {
            title: 'Name',
            key: 'name',
            render: (_, record) => (
                <div className="font-semibold">
                    {record.properties.firstname} {record.properties.lastname}
                </div>
            ),
        },
        {
            title: 'Email',
            dataIndex: ['properties', 'email'],
            key: 'email',
        },
        {
            title: 'Phone',
            dataIndex: ['properties', 'phone'],
            key: 'phone',
            render: (text) => text || <span className="text-gray-400">-</span>,
        },
        {
            title: 'Lifecycle Stage',
            dataIndex: ['properties', 'lifecyclestage'],
            key: 'stage',
            render: (text) => (
                <Tag color="geekblue" className="uppercase text-[10px] font-bold">
                    {text || 'UNKNOWN'}
                </Tag>
            ),
        },
    ];

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spin size="large" />
            </div>
        );
    }

    if (!isConnected) {
        return (
            <div className="flex justify-center mt-10">
                <Result
                    icon={<ApiOutlined className="text-orange-500" />}
                    title="Connect HubSpot to Sync Contacts"
                    subTitle="Link your HubSpot account to view and manage your CRM contacts directly from here."
                    extra={
                        <Button
                            type="primary"
                            size="large"
                            className="bg-[#ff7a59] hover:bg-[#ff8f73] border-none font-bold shadow-lg shadow-orange-200"
                            onClick={handleConnect}
                        >
                            Connect HubSpot
                        </Button>
                    }
                />
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                        <ApiOutlined className="text-xl" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 m-0">HubSpot Contacts</h2>
                        <p className="text-slate-500 text-sm m-0">
                            {contacts.length} contacts synced
                        </p>
                    </div>
                </div>
                <Button
                    icon={<SyncOutlined spin={fetchingContacts} />}
                    onClick={fetchContacts}
                >
                    Refresh
                </Button>
            </div>

            <Card className="shadow-sm border-slate-200" bodyStyle={{ padding: 0 }}>
                <Table
                    columns={columns}
                    dataSource={contacts}
                    rowKey="id"
                    loading={fetchingContacts}
                    pagination={{ pageSize: 10 }}
                />
            </Card>
        </div>
    );
};

export default HubSpotContacts;
