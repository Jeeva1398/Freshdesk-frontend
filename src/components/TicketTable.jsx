import { useEffect, useState } from 'react';
import { Table, Tag, Button, Typography } from 'antd';
import { EyeOutlined, SyncOutlined } from '@ant-design/icons';
import { getTickets } from '../services/freshdeskService';
import TicketDetails from './TicketDetails';

const { Text } = Typography;

const TicketTable = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedTicketId, setSelectedTicketId] = useState(null);
    const [drawerVisible, setDrawerVisible] = useState(false);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const data = await getTickets();
            setTickets(data);
        } catch (error) {
            if (error.response?.status === 400) {
                console.warn('Please configure Freshdesk settings first');
            } else {
                console.error('Failed to fetch tickets');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const statusColors = {
        2: { label: 'Open', color: 'blue', bg: '#f0f9ff', text: '#0369a1' },
        3: { label: 'Pending', color: 'orange', bg: '#fff7ed', text: '#c2410c' },
        4: { label: 'Resolved', color: 'green', bg: '#f0fdf4', text: '#15803d' },
        5: { label: 'Closed', color: 'gray', bg: '#f8fafc', text: '#475569' },
    };

    const priorityColors = {
        1: { label: 'Low', color: 'default' },
        2: { label: 'Medium', color: 'cyan' },
        3: { label: 'High', color: 'red' },
        4: { label: 'Urgent', color: 'magenta' },
    };

    const columns = [
        {
            title: 'Subject',
            dataIndex: 'subject',
            key: 'subject',
            render: (text) => (
                <div className="max-w-md py-1">
                    <Text className="text-slate-900 font-bold block truncate text-sm">{text}</Text>
                    <Text className="text-slate-400 text-[11px] font-medium">Auto-synced from Freshdesk</Text>
                </div>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const config = statusColors[status] || { label: 'Unknown', color: 'default', bg: '#f1f5f9', text: '#64748b' };
                return (
                    <Tag
                        className="px-4 py-1 rounded-full font-black border-none text-[10px]"
                        style={{ backgroundColor: config.bg, color: config.text }}
                    >
                        {config.label.toUpperCase()}
                    </Tag>
                );
            },
        },
        {
            title: 'Priority',
            dataIndex: 'priority',
            key: 'priority',
            render: (priority) => {
                const config = priorityColors[priority] || { label: 'Normal', color: 'default' };
                return <Tag color={config.color} className="rounded-md px-2 font-bold text-[10px]">{config.label.toUpperCase()}</Tag>;
            },
        },
        {
            title: 'Actions',
            key: 'action',
            width: 120,
            render: (_, record) => (
                <Button
                    type="primary"
                    ghost
                    icon={<EyeOutlined />}
                    size="small"
                    className="!bg-white flex items-center gap-1 border-slate-200 text-slate-900 font-bold hover:bg-slate-50"
                    onClick={() => {
                        setSelectedTicketId(record.id);
                        setDrawerVisible(true);
                    }}
                >
                    VIEW
                </Button>
            ),
        },
    ];

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center px-6 py-4 bg-slate-50 border-b border-slate-100 rounded-t-3xl">
                <div className="flex gap-2">
                    <Button
                        icon={<SyncOutlined />}
                        size="small"
                        onClick={fetchTickets}
                        loading={loading}
                        className="text-slate-600 font-bold border-slate-200"
                    >
                        REFRESH
                    </Button>
                </div>
                <Text className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">{tickets.length} RECORDS FOUND</Text>
            </div>

            <div className="px-2 pb-2 premium-table">
                <Table
                    columns={columns}
                    dataSource={tickets}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: false,
                        className: "mt-6 mb-2 px-4"
                    }}
                />
            </div>

            <TicketDetails
                ticketId={selectedTicketId}
                visible={drawerVisible}
                onClose={() => setDrawerVisible(false)}
            />
        </div>
    );
};

export default TicketTable;
