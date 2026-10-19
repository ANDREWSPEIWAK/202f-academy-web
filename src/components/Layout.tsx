import React from 'react';
import { cn } from '../lib/utils';
import { useAuthStore } from '../store/authStore';
import Logo202 from './Logo202';
import { ProgressRing } from './app-ui';

export type NavSection =
  | 'home'
  | 'path'
  | 'tests'
  | 'shift'
  | 'more'
  | 'library'
  | 'trainer'
  | 'practice'
  | 'profile'
  | 'discipline'
  | 'wheel'
  | 'admin'
  | 'skills'
  | 'training'
  | 'journal'
  | 'certification'
  | 'academy';

export type TabId = 'path' | 'ttk' | 'tests' | 'shift' | 'discipline' | 'library' | 'wheel' | 'profile';

const TAB_MAP: Record<TabId, NavSection[]> = {
  path: ['path', 'home', 'academy'],
  ttk: ['library', 'trainer', 'practice'],
  tests: ['tests'],
  shift: ['shift'],
  discipline: ['discipline'],
  library: ['library'],
  wheel: ['wheel'],
  profile: ['profile', 'skills', 'journal', 'certification', 'admin', 'training', 'more'],
};

const TABS: { id: TabId; label: string; sections: NavSection[] }[] = [
  { id: 'path', label: 'Путь', sections: TAB_MAP.path },
  { id: 'ttk', label: 'ТТК', sections: TAB_MAP.ttk },
  { id: 'tests', label: 'Тесты', sections: TAB_MAP.tests },
  { id: 'shift', label: 'Смена', sections: TAB_MAP.shift },
  { id: 'discipline', label: 'Дисциплина', sections: TAB_MAP.discipline },
  { id: 'library', label: 'Методики', sections: TAB_MAP.library },
  { id: 'wheel', label: 'Вкусы', sections: TAB_MAP.wheel },
  { id: 'profile', label: 'Профиль', sections: TAB_MAP.profile },
];

function sectionToTab(section: NavSection): TabId {
  for (const tab of TABS) {
    if (tab.sections.includes(section)) return tab.id;
  }
  return 'path';
}

const ICONS: Record<TabId, React.ReactNode> = {
  path: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 20h5v-5h5v-5h5V5" />
    </svg>
  ),
  ttk: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12.5 2.5 2.5L16 9.5" />
    </svg>
  ),
  tests: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26" />
    </svg>
  ),
  shift: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  ),
  discipline: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  library: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  wheel: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2v20" />
      <path d="M2 12h20" />
    </svg>
  ),
  profile: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
};

interface LayoutProps {
  activeSection: NavSection;
  onNavigate: (section: NavSection) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ activeSection, onNavigate, children }) => {
  const user = useAuthStore((s) => s.user);
  const activeTab = sectionToTab(activeSection);

  const sidebarButton = (active: boolean) =>
    cn(
      'w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all border',
      active
        ? 'bg-[#4fbbbc] text-[#000000] shadow-[0_0_20px_rgba(79,187,188,0.35)]'
        : 'text-[#c9c0a6] hover:bg-[#263030] hover:border-[#33403f] border-transparent'
    );

  const mobileButton = (active: boolean) =>
    cn(
      'flex flex-col items-center justify-center gap-1 px-2 py-2 text-xs transition-colors',
      active ? 'text-[#4fbbbc]' : 'text-[#6b6b5c] hover:text-[#c9c0a6]'
    );

  return (
    <div className="bg-[#161c1c] text-[#e2dac2] min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-60 flex-col border-r border-[#33403f] bg-[#161c1c]/95 backdrop-blur">
        <div className="p-6 flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <Logo202 size={30} />
            <span className="font-display text-xl font-bold tracking-tighter">
              <span className="text-[#f39120]">202</span><span className="text-[#4fbbbc]">f Academy</span>
            </span>
          </div>
          <nav className="flex-1 flex-col gap-1">
            {TABS.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onNavigate(tab.sections[0])}
                  className={sidebarButton(active)}
                >
                  {ICONS[tab.id]}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
          <div className="mt-auto p-4 rounded-3xl border border-[#33403f] bg-[#1a2121]">
            <p className="text-xs text-[#6b6b5c] mb-2">Синхронизация</p>
            <div className="flex items-center justify-between gap-3">
              <ProgressRing value={66} size={44} stroke={5} color="#4FBBBC">
                66%
              </ProgressRing>
              <span className="text-xs font-mono2 text-[#4fbbbc]">synced</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="lg:hidden sticky top-0 z-40 bg-[#161c1c]/90 backdrop-blur-md border-b border-[#33403f]">
        <div className="flex items-center justify-between px-4 py-3.5">
          <div className="flex items-center gap-3">
            <Logo202 size={26} />
            <span className="font-display text-lg font-bold tracking-tighter">
              <span className="text-[#f39120]">202</span><span className="text-[#4fbbbc]">f Academy</span>
            </span>
          </div>
          {user && (
            <span className="px-2 py-1 rounded-full bg-[#263030] text-[10px] font-medium border border-[#33403f]">
              {user.name}
            </span>
          )}
        </div>
      </header>

      <main className="pb-20 lg:pb-0 overflow-y-auto">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#161c1c]/90 backdrop-blur-md border-t border-[#33403f]">
        <div className="grid grid-cols-8 px-2 py-3">
          {TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onNavigate(tab.sections[0])}
                className={mobileButton(active)}
              >
                {ICONS[tab.id]}
                <span className={active ? 'font-bold' : ''}>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;