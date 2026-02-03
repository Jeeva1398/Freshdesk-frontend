import { useEffect, useState } from 'react';
import { Drawer, Typography, Avatar, Spin, Divider, Tag, Card, Badge } from 'antd';
import {
    UserOutlined,
    MailOutlined,
    BankOutlined,
    ClockCircleOutlined,
    RocketOutlined,
    InfoCircleOutlined,
    MessageOutlined
} from '@ant-design/icons';
import { getTicketDetails, getTicketConversations } from '../services/freshdeskService';
import { searchContact } from '../services/hubspotService';

const { Text, Title } = Typography;

const TicketDetails = ({ ticketId, visible, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [ticketData, setTicketData] = useState(null);
    const [hubSpotData, setHubSpotData] = useState(null);

    useEffect(() => {
        if (visible && ticketId) {
            const fetchAllData = async () => {
                setLoading(true);
                try {
                    const ticket = await getTicketDetails(ticketId);
                    const conversations = await getTicketConversations(ticketId);

                    let hubspot = null;
                    if (ticket.requester_email || (ticket.requester && ticket.requester.email)) {
                        const email = ticket.requester_email || ticket.requester.email;
                        try {
                            hubspot = await searchContact(email);
                        } catch (e) {
                            console.log('HubSpot lookup failed or contact not found');
                        }
                    }

                    setData(conversations);
                    setTicketData(ticket);
                    setHubSpotData(hubspot);
                } catch (error) {
                    console.error('Failed to load deep details');
                } finally {
                    setLoading(false);
                }
            };
            fetchAllData();
        }
    }, [visible, ticketId]);


    return (
        <Drawer
            title={
                <div className="py-1">
                    <Text className="text-slate-900 font-black text-[10px] uppercase tracking-[0.2em] block mb-1">Detailed Context</Text>
                    <Title level={4} className="!text-slate-900 !m-0 !font-black truncate max-w-sm tracking-tight">
                        {ticketData?.subject || 'Syncing Metadata...'}
                    </Title>
                </div>
            }
            placement="right"
            onClose={onClose}
            open={visible}
            width={720}
            className="premium-drawer"
            styles={{
                header: { background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '24px 32px' },
                body: { background: '#f8fafc', padding: '32px' },
                mask: { backdropFilter: 'blur(8px)', backgroundColor: 'rgba(30, 41, 59, 0.4)' }
            }}
        >
            {loading ? (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                    <Spin size="large" />
                    <Text className="text-slate-400 font-bold animate-pulse text-xs uppercase tracking-widest">Hydrating data streams...</Text>
                </div>
            ) : ticketData ? (
                <div className="space-y-8 fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="!bg-white !border-slate-200 !rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4 mb-6">
                                <Avatar size={50} icon={<UserOutlined />} className="bg-slate-100 text-slate-500 border border-slate-200" />
                                <div>
                                    <Text className="text-slate-900 font-black text-md block leading-tight">{`${ticketData.requester?.first_name || ''} ${ticketData.requester?.last_name || ''}`.trim() || 'Ticket Requester'}</Text>
                                    <Text className="text-slate-500 text-xs font-medium">{ticketData.requester?.email || 'Identity unknown'}</Text>
                                </div>
                            </div>
                            <div className="space-y-3 pt-4 border-t border-slate-50">
                                <div className="flex items-center gap-3">
                                    <MailOutlined className="text-slate-400" />
                                    <Text className="text-slate-600 text-xs font-semibold">{ticketData.requester_email || 'N/A'}</Text>
                                </div>
                                <div className="flex items-center gap-3">
                                    <ClockCircleOutlined className="text-slate-400" />
                                    <Text className="text-slate-600 text-[11px] font-medium">Created {new Date(ticketData.created_at).toLocaleString()}</Text>
                                </div>
                            </div>
                        </Card>

                        <Card
                            className={`!rounded-2xl shadow-sm transition-all duration-300 ${hubSpotData ? '!bg-orange-50 !border-orange-200' : '!bg-white !border-slate-100 opacity-60'}`}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-9 h-9 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200">
                                    <RocketOutlined className="text-white text-md" />
                                </div>
                                <Text className="text-orange-700 font-black text-[10px] uppercase tracking-widest">HubSpot Insights</Text>
                            </div>

                            {hubSpotData ? (
                                <div className="space-y-4">
                                    <div>
                                        <Text className="text-orange-900/40 text-[9px] font-black uppercase block tracking-tighter">Lifecycle Stage</Text>
                                        <Tag className="!m-0 !mt-1 font-black border-none bg-orange-600 text-white rounded-md px-3 text-[10px]">
                                            {hubSpotData.properties?.lifecyclestage?.toUpperCase() || 'PROSPECT'}
                                        </Tag>
                                    </div>
                                    <div className="flex items-center gap-2 pt-2">
                                        <BankOutlined className="text-orange-600 text-xs" />
                                        <Text className="text-orange-900 font-bold text-xs">{hubSpotData.properties?.company || 'Private Entity'}</Text>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-20 flex items-center justify-center">
                                    <Text className="text-slate-400 text-[11px] font-bold italic">No CRM data available</Text>
                                </div>
                            )}
                        </Card>
                    </div>

                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 flex items-center gap-2">
                            <MessageOutlined className="text-slate-400" />
                            <Text className="text-slate-900 font-black text-[10px] uppercase tracking-[0.2em] whitespace-nowrap">Original Request</Text>
                        </div>
                        <div className="p-8">
                            <div
                                className="text-slate-700 text-base leading-relaxed ticket-body prose prose-slate"
                                dangerouslySetInnerHTML={{ __html: ticketData.description_html || ticketData.description }}
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-3 px-2">
                            <Text className="text-slate-900 font-black text-[10px] uppercase tracking-[0.3em] whitespace-nowrap">Communication Stream</Text>
                            <Badge count={data.length} className="!bg-slate-900 !h-5 !min-w-[20px] !text-[10px] !font-black" />
                            <Divider className="!bg-slate-200 !m-0 flex-1" />
                        </div>

                        <div className="space-y-8 pt-2">
                            {data.map((item, index) => (
                                <div key={index} className={`flex flex-col ${item.incoming ? 'items-start' : 'items-end'} fade-in`}>
                                    <div className={`flex items-center gap-2 mb-2 px-3`}>
                                        <Text className="text-slate-400 font-bold text-[9px] uppercase tracking-widest leading-none">
                                            {item.incoming ? 'Requester' : 'Support Agent'}
                                        </Text>
                                        <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                                        <Text className="text-slate-300 font-medium text-[9px]">{new Date(item.created_at).toLocaleTimeString()}</Text>
                                    </div>
                                    <div
                                        className={`max-w-[85%] p-5 rounded-2xl text-sm leading-relaxed shadow-sm border ${item.incoming
                                            ? 'bg-white border-slate-200 text-slate-700 rounded-tl-none'
                                            : 'bg-slate-900 border-slate-800 text-white rounded-tr-none shadow-slate-100'
                                            }`}
                                    >
                                        <div
                                            className="conversation-text"
                                            dangerouslySetInnerHTML={{ __html: item.body_html || item.body }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-12">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                        <InfoCircleOutlined className="text-slate-300 text-4xl" />
                    </div>
                    <Title level={4} className="!text-slate-900 !font-black !m-0">No Insights Found</Title>
                    <Text className="text-slate-400 mt-2">We couldn't initialize the data stream for this ticket.</Text>
                </div>
            )}
        </Drawer>
    );
};

export default TicketDetails;
