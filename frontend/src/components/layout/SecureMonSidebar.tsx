import React from 'react';
import { useAegis, ViewType } from '../../context/AegisContext';
import {
  Shield,
  LayoutDashboard,
  ClipboardList,
  Boxes,
  AlertTriangle,
  FolderLock,
  Flame,
  Wrench,
  RotateCcw,
  BarChart3,
  Sparkles,
  ScrollText,
  Settings,
} from 'lucide-react';

interface SecureMonSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const SecureMonSidebar: React.FC<SecureMonSidebarProps> = ({ isOpen = true }) => {
  const { activeView, setActiveView } = useAegis();

  interface NavItem {
    id: ViewType;
    label: string;
    icon: React.ReactNode;
  }

  interface NavGroup {
    title: string;
    items: NavItem[];
  }

  const navGroups: NavGroup[] = [
    {
      title: 'OVERVIEW',
      items: [
        { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
        { id: 'running', label: 'Assessments', icon: <ClipboardList className="w-4 h-4" /> },
        { id: 'assets', label: 'Assets', icon: <Boxes className="w-4 h-4" /> },
        { id: 'findings', label: 'Findings', icon: <AlertTriangle className="w-4 h-4" /> },
      ],
    },
    {
      title: 'SECURITY OPERATIONS',
      items: [
        { id: 'scope', label: 'Evidence', icon: <FolderLock className="w-4 h-4" /> },
        { id: 'risk', label: 'Risk Intelligence', icon: <Flame className="w-4 h-4" /> },
        { id: 'remediation', label: 'Remediation', icon: <Wrench className="w-4 h-4" /> },
        { id: 'retest', label: 'Retesting', icon: <RotateCcw className="w-4 h-4" /> },
      ],
    },
    {
      title: 'REPORTING',
      items: [
        { id: 'reports', label: 'Reports', icon: <BarChart3 className="w-4 h-4" /> },
        { id: 'ai', label: 'AI Security Assistant', icon: <Sparkles className="w-4 h-4" /> },
        { id: 'audit', label: 'Audit Logs', icon: <ScrollText className="w-4 h-4" /> },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
      ],
    },
  ];

  return (
    <aside
      className={`w-64 bg-sidebar border-r border-line flex flex-col shrink-0 min-h-screen select-none transition-all duration-200 ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-line">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-400 flex items-center justify-center text-white shadow-sm shadow-teal-500/25">
          <Shield className="w-5 h-5 stroke-[2.2]" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-[17px] font-extrabold tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
            Secure<span className="text-teal-600 dark:text-teal-400">Mon</span>
          </h1>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium leading-tight mt-0.5">
            Security Assessment & Vulnerability Intelligence
          </p>
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 py-4 px-3 space-y-6 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.title} className="space-y-1">
            <div className="px-3 pb-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider">
              {group.title}
            </div>
            {group.items.map((item) => {
              const isActive =
                activeView === item.id ||
                (item.id === 'overview' && activeView === 'dashboard');

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all ${
                    isActive
                      ? 'bg-nav-active text-teal-800 dark:text-teal-300 font-semibold border-l-3 border-teal-600 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-subtle font-medium'
                  }`}
                >
                  <span
                    className={`${
                      isActive ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom Profile / Quick Info */}
      <div className="p-3 border-t border-line bg-subtle flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-[11px] flex items-center justify-center">
            AS
          </div>
          <div className="flex flex-col text-[11px] leading-tight">
            <span className="font-semibold text-slate-800 dark:text-slate-200">Analyst Session</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">NTRO · SIH 2026</span>
          </div>
        </div>
        <div className="w-2 h-2 rounded-full bg-emerald-500" title="Connected" />
      </div>
    </aside>
  );
};
