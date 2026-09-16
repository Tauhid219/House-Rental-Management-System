import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppearance } from '@/hooks/use-appearance';
import { Check, Monitor, Moon, Sun } from 'lucide-react';
import { HTMLAttributes } from 'react';

export default function AppearanceToggleDropdown({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
    const { appearance, updateAppearance } = useAppearance();

    const getCurrentIcon = () => {
        switch (appearance) {
            case 'dark':
                return <Moon className="size-4 text-blue-400" />;
            case 'light':
                return <Sun className="size-4 text-amber-500" />;
            default:
                return <Monitor className="size-4 text-slate-600 dark:text-slate-300" />;
        }
    };

    return (
        <div className={className} {...props}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative size-8.5 rounded-full text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-1 focus-visible:ring-blue-500 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                        title={`Theme: ${appearance.charAt(0).toUpperCase() + appearance.slice(1)}`}
                    >
                        {getCurrentIcon()}
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36 min-w-36 py-1">
                    <DropdownMenuLabel className="px-2.5 py-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                        Theme
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="my-1" />

                    <DropdownMenuItem
                        onClick={() => updateAppearance('light')}
                        className={`flex cursor-pointer items-center justify-between px-2.5 py-1.5 text-xs ${
                            appearance === 'light'
                                ? 'bg-blue-50 font-semibold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
                                : 'text-slate-700 dark:text-slate-200'
                        }`}
                    >
                        <span className="flex items-center gap-2">
                            <Sun className="size-4 text-amber-500" />
                            <span>Light</span>
                        </span>
                        {appearance === 'light' && <Check className="size-3.5 text-blue-600 dark:text-blue-400" />}
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={() => updateAppearance('dark')}
                        className={`flex cursor-pointer items-center justify-between px-2.5 py-1.5 text-xs ${
                            appearance === 'dark'
                                ? 'bg-blue-50 font-semibold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
                                : 'text-slate-700 dark:text-slate-200'
                        }`}
                    >
                        <span className="flex items-center gap-2">
                            <Moon className="size-4 text-blue-400" />
                            <span>Dark</span>
                        </span>
                        {appearance === 'dark' && <Check className="size-3.5 text-blue-600 dark:text-blue-400" />}
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={() => updateAppearance('system')}
                        className={`flex cursor-pointer items-center justify-between px-2.5 py-1.5 text-xs ${
                            appearance === 'system'
                                ? 'bg-blue-50 font-semibold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
                                : 'text-slate-700 dark:text-slate-200'
                        }`}
                    >
                        <span className="flex items-center gap-2">
                            <Monitor className="size-4 text-slate-500 dark:text-slate-400" />
                            <span>System</span>
                        </span>
                        {appearance === 'system' && <Check className="size-3.5 text-blue-600 dark:text-blue-400" />}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
