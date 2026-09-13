import { Link } from '@inertiajs/react';
import { ArrowRight, LucideIcon } from 'lucide-react';

interface AdminSmallBoxProps {
    title?: string;
    label?: string;
    value: string | number;
    icon: LucideIcon;
    variant: 'info' | 'success' | 'warning' | 'danger' | 'primary';
    href?: string;
    link?: string;
    linkText?: string;
}

export default function AdminSmallBox({ title, label, value, icon: Icon, variant, href, link, linkText = 'More info' }: AdminSmallBoxProps) {
    const boxTitle = title || label || '';
    const destination = href || link || '';

    const variantStyles: Record<string, { bg: string; footerBg: string; iconColor: string }> = {
        primary: {
            bg: 'bg-blue-600 text-white',
            footerBg: 'bg-blue-700/80 hover:bg-blue-700 text-white',
            iconColor: 'text-white/20',
        },
        info: {
            bg: 'bg-cyan-600 text-white',
            footerBg: 'bg-cyan-700/80 hover:bg-cyan-700 text-white',
            iconColor: 'text-white/20',
        },
        success: {
            bg: 'bg-emerald-600 text-white',
            footerBg: 'bg-emerald-700/80 hover:bg-emerald-700 text-white',
            iconColor: 'text-white/20',
        },
        warning: {
            bg: 'bg-amber-500 text-slate-950',
            footerBg: 'bg-amber-600/80 hover:bg-amber-600 text-slate-950 font-medium',
            iconColor: 'text-black/15',
        },
        danger: {
            bg: 'bg-rose-600 text-white',
            footerBg: 'bg-rose-700/80 hover:bg-rose-700 text-white',
            iconColor: 'text-white/20',
        },
    };

    const style = variantStyles[variant] || variantStyles.info;

    return (
        <div className={`relative overflow-hidden rounded-md shadow-sm transition-all duration-200 hover:shadow-md ${style.bg}`}>
            <div className="p-5">
                <div className="flex items-baseline justify-between">
                    <div>
                        <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
                        <p className="mt-1 text-sm font-medium tracking-wide uppercase opacity-90">{boxTitle}</p>
                    </div>
                </div>
            </div>

            {/* Background Watermark Icon */}
            <div
                className={`pointer-events-none absolute -right-2 -bottom-2 ${style.iconColor} transition-transform duration-300 group-hover:scale-110`}
            >
                <Icon size={84} strokeWidth={1.5} />
            </div>

            {/* Footer Link */}
            {destination ? (
                <Link
                    href={destination}
                    className={`flex items-center justify-center gap-1.5 py-1.5 text-xs tracking-wide transition-colors ${style.footerBg}`}
                >
                    <span>{linkText}</span>
                    <ArrowRight size={14} />
                </Link>
            ) : null}
        </div>
    );
}
