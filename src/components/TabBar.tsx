import React from 'react';
import './TabBar.module.css';

interface TabBarProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
}

const TabBar: React.FC<TabBarProps> = ({ activeTab, onTabPress }) => {
  const tabs: string[] = ['home', 'learning', 'recipes', 'tests', 'profile'];
  
  // Icon placeholders - in a real app, these would be actual icons
  const TAB_ICONS: Record<string, string> = {
    home: '🏠',
    learning: '📚',
    recipes: '📖',
    tests: '📝',
    profile: '👤',
  };

  return (
    <nav className="tabBar">
      <div className="tabBarContainer">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`${"tab"} ${tab === activeTab ? "activeTab" : ""}`}
            onClick={() => onTabPress(tab)}
            aria-label={tab}
          >
            <div className="tabIcon">
              {TAB_ICONS[tab]}
            </div>
            {/* Spec says no labels, so we omit them */}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default TabBar;
