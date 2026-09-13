import { LucideIcon } from 'lucide-react';
import React from 'react';

interface AdminCardProps {
    title?: React.ReactNode;
    icon?: LucideIcon;
    tools?: React.ReactNode;
    headerAction?: React.ReactNode;
    children: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
    noPadding?: boolean;
}

export default function AdminCard({
    title,
    icon: Icon,
    tools,
    headerAction,
    children,
    footer,
    className = '',
    variant = 'primary',
    noPadding = false,
}: AdminCardProps) {
    const outlineVariants = {
        default: 'border-t-2 border-t-slate-400',
        primary: 'border-t-2 border-t-blue-600',
        success: 'border-t-2 border-t-emerald-600',
        warning: 'border-t-2 border-t-amber-500',
        danger: 'border-t-2 border-t-rose-600',
        info: 'border-t-2 border-t-cyan-500',
    };

    const actionElements = tools || headerAction;

    return (
        <div
            className={`overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 ${outlineVariants[variant]} ${className}`}
        >
            {(title || actionElements) && (
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-slate-100">
                        {Icon && <Icon size={18} className="text-slate-500 dark:text-slate-400" />}
                        <span>{title}</span>
                    </div>
                    {actionElements && <div className="flex items-center gap-2">{actionElements}</div>}
                </div>
            )}

            <div className={noPadding ? '' : 'p-5'}>{children}</div>

            {footer && <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-3 dark:border-slate-800 dark:bg-slate-800/40">{footer}</div>}
        </div>
    );
}
