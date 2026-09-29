import React from 'react';
import { useAegis } from '../../context/AegisContext';
import {
  Menu,
  Search,
  Bell,
  ShieldCheck,
  ChevronRight,
  Sun,
  Moon,
} from 'lucide-react';

interface SecureMonHeaderProps {
  onToggleSidebar?: () => void;
}

export const SecureMonHeader: React.FC<SecureMonHeaderProps> = ({ onToggleSidebar }) => {
  const { setCommandPaletteOpen, currentAssessment, findings, setActiveView, theme, toggleTheme } = useAegis();
  const urgentAlertsCount = findings.filter((f) => f.severity === 'CRITICAL' || f.severity === 'HIGH').length;

  return (
    <header className="h-16 bg-topbar border-b border-line sticky top-0 z-30 px-6 flex items-center justify-between gap-4 select-none transition-colors">
      {/* Left: Hamburger & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-subtle transition-colors"
          title="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span
            onClick={() => setActiveView('dashboard')}
            className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            Security Platform
          </span>
          <span className="text-slate-300 dark:text-slate-600">/</span>
          <span className="text-slate-900 dark:text-slate-100 font-semibold truncate max-w-[280px]">
            {currentAssessment?.name || 'World Monitor Assessment'}
          </span>
        </div>
      </div>

      {/* Right: Search, Theme Toggle, Notification Bell, Authorized Environment Badge, Avatar */}
      <div className="flex items-center gap-3.5">
        {/* Search Input Box */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="hidden sm:flex items-center justify-between gap-3 w-64 md:w-80 px-3.5 py-1.5 rounded-full bg-subtle hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-line text-xs text-slate-400 dark:text-slate-500 transition-all text-left shadow-2xs"
        >
          <div className="flex items-center gap-2 truncate">
            <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
            <span className="truncate">Search assets, findings, components...</span>
          </div>
          <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-card text-slate-500 dark:text-slate-400 border border-line shrink-0 shadow-2xs">
            ⌘ K
          </kbd>
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-subtle text-slate-600 dark:text-slate-300 transition-colors"
          title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Notification Bell with Badge */}
        <div className="relative">
          <button
            onClick={() => setActiveView('findings')}
            className="p-2 rounded-full hover:bg-subtle text-slate-600 dark:text-slate-300 transition-colors relative"
            title={`${urgentAlertsCount} Urgent Findings`}
          >
            <Bell className="w-4 h-4" />
            {urgentAlertsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-rose-500 text-[9px] font-bold text-white flex items-center justify-center border-2 border-card">
                {urgentAlertsCount}
              </span>
            )}
          </button>
        </div>

        {/* Authorized Environment Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/60 text-emerald-700 dark:text-emerald-400 text-xs font-bold tracking-tight shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span className="hidden sm:inline">AUTHORIZED ENVIRONMENT</span>
        </div>

        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full bg-slate-700 text-white font-bold text-xs flex items-center justify-center shadow-xs cursor-pointer hover:ring-2 hover:ring-teal-500 transition-all">
          AS
        </div>
      </div>
    </header>
  );
};
