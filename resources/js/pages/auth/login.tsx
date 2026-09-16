import { Head, Link, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    CheckCircle2,
    Eye,
    EyeOff,
    LoaderCircle,
    Lock,
    Mail,
} from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface LoginForm {
    email: string;
    password: string;
    remember: boolean;
    [key: string]: any;
}

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#e9ecef] px-4 py-8 font-sans text-slate-800 antialiased selection:bg-[#007bff] selection:text-white dark:bg-[#454d55] dark:text-slate-100">
            <Head title="Sign In • Skyline Heights AdminLTE" />

            {/* AdminLTE 3 Login Box */}
            <div className="w-full max-w-[400px]">
                {/* AdminLTE 3 Card with Primary Outline */}
                <div className="overflow-hidden rounded-[4px] border border-[#dee2e6] border-t-[3px] border-t-[#007bff] bg-white shadow-[0_0_1px_rgba(0,0,0,0.125),0_1px_3px_rgba(0,0,0,0.2)] dark:border-slate-700 dark:bg-[#343a40]">
                    {/* Card Header with Brand / Logo */}
                    <div className="border-b border-[#dee2e6]/80 bg-white px-6 pt-5 pb-4 text-center dark:border-slate-700/80 dark:bg-[#343a40]">
                        <Link href="/" className="inline-flex items-center justify-center gap-2.5 transition-opacity hover:opacity-95">
                            <div className="flex size-9 items-center justify-center rounded bg-[#007bff] text-base font-black text-white shadow-sm">
                                S
                            </div>
                            <div className="text-left leading-none">
                                <span className="block text-2xl font-light tracking-tight text-slate-800 dark:text-white">
                                    <b>SKYLINE</b> <span className="text-slate-500 dark:text-slate-300">LTE</span>
                                </span>
                                <span className="block text-[10px] font-semibold tracking-wider text-[#007bff] uppercase">
                                    House Rental Management
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 sm:p-7">
                        <p className="mb-5 text-center text-sm font-normal text-slate-600 dark:text-slate-300">
                            Sign in to start your session
                        </p>

                        {/* Status alert message */}
                        {status && (
                            <div className="mb-4 flex items-center gap-2 rounded-[3px] border border-[#c3e6cb] bg-[#d4edda] px-3.5 py-2.5 text-xs font-medium text-[#155724] dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                                <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                                <span>{status}</span>
                            </div>
                        )}

                        {/* General Auth / Validation Alert if any */}
                        {Object.keys(errors).length > 0 && !errors.email && !errors.password && (
                            <div className="mb-4 flex items-center gap-2 rounded-[3px] border border-[#f5c6cb] bg-[#f8d7da] px-3.5 py-2.5 text-xs font-medium text-[#721c24] dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
                                <AlertCircle className="size-4 shrink-0 text-rose-600 dark:text-rose-400" />
                                <span>Please check your login credentials and try again.</span>
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-4">
                            {/* Email Input Group */}
                            <div>
                                <div className="relative flex w-full items-stretch">
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="Email"
                                        className={`flex-1 min-w-0 rounded-l-[4px] border border-r-0 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:z-10 focus:border-[#80bdff] focus:ring-0 focus:outline-none dark:bg-[#3b434a] dark:text-white dark:placeholder:text-slate-400 ${
                                            errors.email ? 'border-[#dc3545]' : 'border-[#ced4da] dark:border-slate-600'
                                        }`}
                                    />
                                    <div
                                        className={`flex items-center rounded-r-[4px] border border-l-0 bg-transparent px-3 text-slate-400 dark:text-slate-400 ${
                                            errors.email ? 'border-[#dc3545] text-[#dc3545]' : 'border-[#ced4da] dark:border-slate-600'
                                        }`}
                                    >
                                        <Mail className="size-4" />
                                    </div>
                                </div>
                                {errors.email && (
                                    <p className="mt-1 flex items-center gap-1 text-xs font-medium text-[#dc3545]">
                                        <span>{errors.email}</span>
                                    </p>
                                )}
                            </div>

                            {/* Password Input Group */}
                            <div>
                                <div className="relative flex w-full items-stretch">
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Password"
                                        className={`flex-1 min-w-0 rounded-l-[4px] border border-r-0 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:z-10 focus:border-[#80bdff] focus:ring-0 focus:outline-none dark:bg-[#3b434a] dark:text-white dark:placeholder:text-slate-400 ${
                                            errors.password ? 'border-[#dc3545]' : 'border-[#ced4da] dark:border-slate-600'
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        tabIndex={-1}
                                        onClick={() => setShowPassword(!showPassword)}
                                        title={showPassword ? 'Hide password' : 'Show password'}
                                        className={`flex cursor-pointer items-center rounded-r-[4px] border border-l-0 bg-transparent px-3 text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200 ${
                                            errors.password ? 'border-[#dc3545] text-[#dc3545]' : 'border-[#ced4da] dark:border-slate-600'
                                        }`}
                                    >
                                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-1 flex items-center gap-1 text-xs font-medium text-[#dc3545]">
                                        <span>{errors.password}</span>
                                    </p>
                                )}
                            </div>

                            {/* Remember Me & Sign In Button (Classic AdminLTE Row) */}
                            <div className="flex items-center justify-between gap-3 pt-1">
                                <label className="flex cursor-pointer select-none items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="remember"
                                        name="remember"
                                        tabIndex={3}
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="size-4 cursor-pointer rounded-[2px] border-[#ced4da] text-[#007bff] focus:ring-2 focus:ring-[#007bff]/30"
                                    />
                                    <span className="text-sm font-normal text-slate-700 dark:text-slate-300">
                                        Remember Me
                                    </span>
                                </label>

                                <button
                                    type="submit"
                                    tabIndex={4}
                                    disabled={processing}
                                    className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-[4px] bg-[#007bff] px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#0069d9] active:bg-[#0062cc] disabled:opacity-65"
                                >
                                    {processing && <LoaderCircle className="size-4 animate-spin" />}
                                    <span>Sign In</span>
                                </button>
                            </div>
                        </form>

                        {/* Navigation Links */}
                        {canResetPassword && (
                            <div className="mt-5 text-sm">
                                <p className="mb-0">
                                    <Link
                                        href={route('password.request')}
                                        tabIndex={5}
                                        className="text-[#007bff] transition-colors hover:text-[#0056b3] hover:underline"
                                    >
                                        I forgot my password
                                    </Link>
                                </p>
                            </div>
                        )}

                        {/* Back to Live Website Link */}
                        <div className="mt-5 border-t border-[#dee2e6] pt-4 text-center dark:border-slate-700/70">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-1.5 text-xs text-slate-500 transition hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                            >
                                <ArrowLeft className="size-3.5" />
                                <span>Return to Public Showcase Website</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Footer Notes in AdminLTE 3 style */}
                <div className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
                    <p>
                        <strong>Skyline Heights Residency</strong> • AdminLTE 3 Portal
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">
                        Copyright &copy; {new Date().getFullYear()} All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}
