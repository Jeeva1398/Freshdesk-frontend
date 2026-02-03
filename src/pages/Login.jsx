import { Input, Button } from 'antd';
import { MailOutlined, LockOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { login } from '../services/userService';

const Login = () => {
    const navigate = useNavigate();

    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email').required('Email is required'),
        password: Yup.string().required('Password is required'),
    });

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const data = await login(values);
                localStorage.setItem('token', data.tokens);
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/dashboard');
            } catch (error) {
                console.error(error.response?.data?.message || 'Login failed');
            }
        },
    });

    return (
        <div className="min-h-screen w-full auth-bg flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg p-10 rounded-3xl shadow-xl border border-slate-200 fade-in">
                <div className="mb-10 text-center">
                    <div className="inline-block p-4 rounded-2xl bg-slate-100 mb-4 border border-slate-200">
                        <LockOutlined className="text-3xl text-slate-900" />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                        Welcome Back
                    </h1>
                    <p className="text-slate-500 mt-2 text-lg">Sign in to manage your tickets</p>
                </div>

                <form onSubmit={formik.handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider text-[11px]">Email Address</label>
                        <Input
                            name="email"
                            size="large"
                            autoComplete="email"
                            prefix={<MailOutlined className="text-slate-400" />}
                            placeholder="name@company.com"
                            className="bg-slate-50 border-slate-200 text-slate-900 h-12"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            status={formik.touched.email && formik.errors.email ? 'error' : ''}
                        />
                        {formik.touched.email && formik.errors.email && (
                            <div className="text-red-600 text-xs mt-2 font-medium bg-red-50 p-2 rounded-lg border border-red-100 italic">
                                {formik.errors.email}
                            </div>
                        )}
                    </div>

                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider text-[11px]">Password</label>
                            <a href="#" className="text-slate-900 text-xs font-bold hover:underline">Forgot?</a>
                        </div>
                        <Input.Password
                            name="password"
                            size="large"
                            autoComplete="current-password"
                            prefix={<LockOutlined className="text-slate-400" />}
                            placeholder="••••••••"
                            className="bg-slate-50 border-slate-200 text-slate-900 h-12"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            status={formik.touched.password && formik.errors.password ? 'error' : ''}
                        />
                        {formik.touched.password && formik.errors.password && (
                            <div className="text-red-600 text-xs mt-2 font-medium bg-red-50 p-2 rounded-lg border border-red-100 italic">
                                {formik.errors.password}
                            </div>
                        )}
                    </div>

                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        loading={formik.isSubmitting}
                        className="w-full h-14 text-lg font-bold rounded-xl bg-slate-900 border-none hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 mt-4"
                        icon={<ArrowRightOutlined />}
                        iconPosition="end"
                    >
                        Sign In
                    </Button>
                </form>

                <div className="mt-10 text-center text-slate-500 pt-8 border-t border-slate-100">
                    New to the hub?{' '}
                    <Link to="/signup" className="text-slate-900 font-bold hover:underline">
                        Create an account
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
