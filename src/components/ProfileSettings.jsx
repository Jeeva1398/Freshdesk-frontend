import { useEffect, useState } from 'react';
import { Input, Button, Card, Divider, Typography } from 'antd';
import { KeyOutlined, SafetyCertificateOutlined, CloudSyncOutlined } from '@ant-design/icons';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { getProfile, updateProfile } from '../services/userService';
import { decrypted_request } from '../utils/decrypt';

const { Text, Title } = Typography;

const ProfileSettings = ({ onUpdate }) => {
    const [loading, setLoading] = useState(false);

    const validationSchema = Yup.object().shape({
        firstName: Yup.string().required('First Name is required'),
        lastName: Yup.string().required('Last Name is required'),
        freshdeskDomain: Yup.string().required('Required'),
        freshdeskApiKey: Yup.string().required('Required'),
    });

    const formik = useFormik({
        initialValues: {
            _id: '',
            firstName: '',
            lastName: '',
            freshdeskDomain: '',
            freshdeskApiKey: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const { _id, ...updateData } = values;
                await updateProfile(_id, updateData);
                const storedUser = JSON.parse(localStorage.getItem('user'));
                const updatedUser = { ...storedUser, ...updateData };
                localStorage.setItem('user', JSON.stringify(updatedUser));

                if (onUpdate) {
                    onUpdate(updatedUser);
                }
            } catch (error) {
                console.error('Failed to sync settings');
            } finally {
                setLoading(false);
            }
        },
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await getProfile();
                console.log(data);
                let decryptedApiKey = '';
                if (data.freshdeskApiKey) {
                    try {
                        const decrypted = decrypted_request(data.freshdeskApiKey);
                        decryptedApiKey = JSON.parse(decrypted);
                    } catch (e) {
                        console.error('Decryption failed', e);
                    }
                }
                console.log(decryptedApiKey);
                formik.setValues({
                    _id: data._id,
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    freshdeskApiKey: decryptedApiKey || '',
                    freshdeskDomain: data.freshdeskDomain || '',
                });
            } catch (error) {
                console.error('Failed to load profile');
            }
        };
        fetchUser();
    }, []);

    return (
        <div className="max-w-4xl mx-auto space-y-10 fade-in py-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-1">
                    <div className="sticky top-28">
                        <Title level={3} className="!text-slate-900 !m-0 !font-black tracking-tight">Ecosystem Sync</Title>
                        <Text className="text-slate-500 block mt-4 text-base leading-relaxed">
                            Connect your tools to enable real-time visibility across your organization.
                        </Text>

                        <div className="mt-10 space-y-4">
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                                <div className="p-2 bg-slate-100 rounded-lg">
                                    <SafetyCertificateOutlined className="text-slate-600 text-lg" />
                                </div>
                                <Text className="text-slate-700 text-[10px] font-black uppercase tracking-wider">Secure Transfer</Text>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                                <div className="p-2 bg-green-50 rounded-lg">
                                    <CloudSyncOutlined className="text-green-600 text-lg" />
                                </div>
                                <Text className="text-slate-700 text-[10px] font-black uppercase tracking-wider">Live Refresh</Text>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <form onSubmit={formik.handleSubmit} className="space-y-8">
                        <Card className="!bg-white !border-slate-200 !rounded-3xl shadow-sm hover:shadow-md transition-shadow p-6">
                            <Divider orientation="left" className="!m-0 !border-slate-100">
                                <Text className="text-slate-900 font-black text-[10px] uppercase tracking-[0.2em]">Profile Settings</Text>
                            </Divider>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">First Name</label>
                                    <Input
                                        name="firstName"
                                        size="large"
                                        placeholder="First Name"
                                        className="h-12"
                                        value={formik.values.firstName}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        status={formik.touched.firstName && formik.errors.firstName ? 'error' : ''}
                                    />
                                    {formik.touched.firstName && formik.errors.firstName && (
                                        <div className="text-red-600 text-[11px] mt-2 font-bold">{formik.errors.firstName}</div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Last Name</label>
                                    <Input
                                        name="lastName"
                                        size="large"
                                        placeholder="Last Name"
                                        className="h-12"
                                        value={formik.values.lastName}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        status={formik.touched.lastName && formik.errors.lastName ? 'error' : ''}
                                    />
                                    {formik.touched.lastName && formik.errors.lastName && (
                                        <div className="text-red-600 text-[11px] mt-2 font-bold">{formik.errors.lastName}</div>
                                    )}
                                </div>
                            </div>
                        </Card>
                        <Card className="!bg-white !border-slate-200 !rounded-3xl shadow-sm hover:shadow-md transition-shadow p-4">
                            <Divider orientation="left" className="!m-0 !border-slate-100">
                                <Text className="text-slate-900 font-black text-[10px] uppercase tracking-[0.2em]">Freshdesk Instance</Text>
                            </Divider>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Domain Prefix (your-company)</label>
                                    <Input
                                        name="freshdeskDomain"
                                        size="large"
                                        placeholder="your-company"
                                        suffix={<span className="text-slate-400 text-[10px] font-mono">.freshdesk.com</span>}
                                        className="h-12"
                                        value={formik.values.freshdeskDomain}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        status={formik.touched.freshdeskDomain && formik.errors.freshdeskDomain ? 'error' : ''}
                                    />
                                    {formik.touched.freshdeskDomain && formik.errors.freshdeskDomain && (
                                        <div className="text-red-600 text-[11px] mt-2 font-bold">{formik.errors.freshdeskDomain}</div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">API Secret</label>
                                    <Input.Password
                                        name="freshdeskApiKey"
                                        size="large"
                                        prefix={<KeyOutlined className="text-slate-400" />}
                                        placeholder="your_key"
                                        className="h-12"
                                        value={formik.values.freshdeskApiKey}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        status={formik.touched.freshdeskApiKey && formik.errors.freshdeskApiKey ? 'error' : ''}
                                    />
                                    {formik.touched.freshdeskApiKey && formik.errors.freshdeskApiKey && (
                                        <div className="text-red-600 text-[11px] mt-2 font-bold">{formik.errors.freshdeskApiKey}</div>
                                    )}
                                </div>
                            </div>
                        </Card>


                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            loading={loading}
                            className="w-full h-16 text-lg font-black rounded-2xl bg-slate-900 border-none hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 mt-4 uppercase tracking-widest"
                        >
                            Sync Configurations
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;
