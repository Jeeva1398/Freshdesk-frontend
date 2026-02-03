import { useState, useEffect } from 'react';
import { Layout, Button, Avatar, Dropdown, Typography, Tabs } from 'antd';
import {
    LogoutOutlined,
    UserOutlined,
    SettingOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import TicketTable from '../components/TicketTable';
import HubSpotContacts from '../components/HubSpotContacts';
import ProfileSettings from '../components/ProfileSettings';
import { ArrowLeftOutlined } from '@ant-design/icons';
import logo from '../assets/logo.png';

const { Header, Content } = Layout;
const { Text, Title } = Typography;

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [activeView, setActiveView] = useState('dashboard');
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const profileMenu = {
        items: [
            {
                key: 'settings',
                label: 'Profile Settings',
                icon: <SettingOutlined />,
                onClick: () => setActiveView('settings')
            },
            {
                type: 'divider',
            },
            {
                key: 'logout',
                label: 'Sign Out',
                icon: <LogoutOutlined />,
                danger: true,
                onClick: handleLogout,
            },
        ],
    };

    const items = [
        {
            key: '1',
            label: 'Freshdesk Tickets',
            children: (
                <div className="fade-in bg-white rounded-3xl p-1 shadow-sm border border-slate-200">
                    <TicketTable />
                </div>
            ),
        },
        {
            key: '2',
            label: 'HubSpot Contacts',
            children: (
                <div className="fade-in bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                    <HubSpotContacts />
                </div>
            ),
        },
    ];

    return (
        <Layout className="min-h-screen bg-slate-50">
            <Header className="!bg-white h-20 flex items-center px-8 border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                <div className="flex items-center">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mr-3">
                        <img src={logo} alt="Logo" className="w-full h-full object-contain" />
                    </div>
                    <div>
                        <Text className="text-slate-900 font-bold text-[10px] uppercase tracking-[0.2em]">Freshdesk Sync</Text>
                    </div>
                </div>

                <div className="ml-auto flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                        <div className="text-slate-900 font-bold text-sm leading-tight">{user?.firstName} {user?.lastName}</div>
                        <div className="text-slate-400 text-xs">{user?.email}</div>
                    </div>
                    <Dropdown menu={profileMenu} placement="bottomRight" arrow>
                        <Avatar
                            size={44}
                            className="bg-slate-900 cursor-pointer hover:scale-105 transition-transform border-2 border-white shadow-sm"
                            icon={<UserOutlined />}
                        />
                    </Dropdown>
                </div>
            </Header>

            <Content className="p-8 overflow-auto">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-10 fade-in flex justify-between items-end border-b border-slate-200 pb-8">
                        <div>
                            {activeView === 'settings' && (
                                <Button
                                    icon={<ArrowLeftOutlined />}
                                    className="mb-4 flex items-center gap-2 text-slate-500 hover:text-slate-900 border-none shadow-none bg-transparent p-0"
                                    onClick={() => setActiveView('dashboard')}
                                >
                                    Back to Dashboard
                                </Button>
                            )}
                            <Title level={2} className="!text-slate-900 !font-black !m-0 tracking-tight">
                                {activeView === 'dashboard' ? 'Dashboard' : 'Integration Settings'}
                            </Title>
                            <Text className="text-slate-500 text-lg">
                                {activeView === 'dashboard'
                                    ? 'Manage tickets and sync CRM contacts'
                                    : 'Configure your profile and third-party integrations'}
                            </Text>
                        </div>
                    </div>

                    {activeView === 'dashboard' ? (
                        <Tabs defaultActiveKey="1" items={items} size="large" className="custom-tabs" />
                    ) : (
                        <ProfileSettings onUpdate={(updatedUser) => setUser(updatedUser)} />
                    )}
                </div>
            </Content>
        </Layout>
    );
};

export default Dashboard;
