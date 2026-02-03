import { Input, Button } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, GlobalOutlined, KeyOutlined, UserAddOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { signup } from '../services/userService';

const Signup = () => {
    const navigate = useNavigate();

    const validationSchema = Yup.object().shape({
        firstName: Yup.string().required('Required'),
        lastName: Yup.string().required('Required'),
        email: Yup.string().email('Invalid email').required('Required'),
        password: Yup.string().min(6, 'Min 6 chars').required('Required'),
        freshdeskDomain: Yup.string().required('Required'),
        freshdeskApiKey: Yup.string().required('Required'),
    });

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            freshdeskDomain: '',
            freshdeskApiKey: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const data = await signup(values);
                localStorage.setItem('token', data.tokens);
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/dashboard');
            } catch (error) {
                console.error(error.response?.data?.message || 'Signup failed');
            }
        },
    });

    return (
        <div className="min-h-screen w-full auth-bg flex items-center justify-center p-6 py-12">
            <div className="bg-white w-full max-w-2xl p-10 rounded-3xl shadow-xl border border-slate-200 fade-in">
                <div className="mb-10 text-center">
                    <div className="inline-block p-4 rounded-2xl bg-slate-100 mb-4 border border-slate-200">
                        <UserAddOutlined className="text-3xl text-slate-900" />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                        Start Freshdesk Sync
                    </h1>
                    <p className="text-slate-500 mt-2 text-lg">Connect your support stack today</p>
                </div>

                <form onSubmit={formik.handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider text-[11px]">First Name</label>
                            <Input
                                name="firstName"
                                size="large"
                                prefix={<UserOutlined className="text-slate-400" />}
                                placeholder="John"
                                className="bg-slate-50 border-slate-200 text-slate-900 h-12"
                                value={formik.values.firstName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider text-[11px]">Last Name</label>
                            <Input
                                name="lastName"
                                size="large"
                                prefix={<UserOutlined className="text-slate-400" />}
                                placeholder="Doe"
                                className="bg-slate-50 border-slate-200 text-slate-900 h-12 px-4"
                                value={formik.values.lastName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider text-[11px]">Work Email</label>
                        <Input
                            name="email"
                            size="large"
                            autoComplete="email"
                            prefix={<MailOutlined className="text-slate-400" />}
                            placeholder="john@example.com"
                            className="bg-slate-50 border-slate-200 text-slate-900 h-12"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider text-[11px]">Password</label>
                        <Input.Password
                            name="password"
                            size="large"
                            autoComplete="new-password"
                            prefix={<LockOutlined className="text-slate-400" />}
                            placeholder="Min 6 characters"
                            className="bg-slate-50 border-slate-200 text-slate-900 h-12"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>

                    <div className="pt-6 border-t border-slate-100 space-y-6">
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">Freshdesk Setup</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider text-[11px]">Domain</label>
                                <Input
                                    name="freshdeskDomain"
                                    size="large"
                                    prefix={<GlobalOutlined className="text-slate-400" />}
                                    placeholder="your-company"
                                    addonAfter={<span className="text-slate-500 font-mono text-xs">.freshdesk.com</span>}
                                    className="bg-slate-50"
                                    value={formik.values.freshdeskDomain}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider text-[11px]">API Key</label>
                                <Input.Password
                                    name="freshdeskApiKey"
                                    size="large"
                                    prefix={<KeyOutlined className="text-slate-400" />}
                                    placeholder="your_api_key"
                                    className="bg-slate-50 border-slate-200 text-slate-900 h-12"
                                    value={formik.values.freshdeskApiKey}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                        </div>
                    </div>

                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        loading={formik.isSubmitting}
                        className="w-full h-14 text-lg font-bold rounded-xl bg-slate-900 border-none hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 mt-8"
                    >
                        Create Your Account
                    </Button>
                </form>

                <div className="mt-10 text-center text-slate-500 pt-8 border-t border-slate-100">
                    Already have an account?{' '}
                    <Link to="/login" className="text-slate-900 font-bold hover:underline transition-colors">
                        Sign in instead
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
