import React from 'react';
import Card from '../components/Card';
import styles from './More.module.css';
import { NavSection } from '../components/Layout';
import { useT, useI18nStore, Lang } from '../i18n';
import { useAuthStore } from '../store/authStore';

interface MoreProps {
  onNavigate: (section: NavSection) => void;
}

const More: React.FC<MoreProps> = ({ onNavigate }) => {
  const t = useT();
  const lang = useI18nStore((s) => s.lang);
  const setLang = useI18nStore((s) => s.setLang);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const items: { id: NavSection; labelKey: string; desc: string; icon: React.ReactNode; adminOnly?: boolean }[] = [
    {
      id: 'profile',
      labelKey: 'nav.profile',
      desc: 'XP, ранги, история тестов',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c1.5-4 5-5.5 8-5.5s6.5 1.5 8 5.5" />
        </svg>
      ),
    },
    {
      id: 'library',
      labelKey: 'nav.library',
      desc: 'ТТК напитков и материалы',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h7v16H4z" />
          <path d="M13 4h7v16h-7z" />
        </svg>
      ),
    },
    {
      id: 'discipline',
      labelKey: 'nav.discipline',
      desc: 'Ежедневные стандарты станции',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 11.5 11 14l4-5" />
          <rect x="4" y="4" width="16" height="16" rx="3" />
        </svg>
      ),
    },
    {
      id: 'wheel',
      labelKey: 'nav.wheel',
      desc: 'Карта вкусов и ароматов',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3v18M3 12h18" />
        </svg>
      ),
    },
    {
      id: 'practice',
      labelKey: 'nav.practice',
      desc: 'Журнал проливов и тренировки',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="13" r="8" />
          <path d="M12 9v4l2.5 2.5" />
          <path d="M9 2h6" />
        </svg>
      ),
    },
    {
      id: 'trainer',
      labelKey: 'nav.trainer',
      desc: 'Разбор ошибок и наводящие вопросы',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3v18" />
          <path d="M5 8l7-5 7 5" />
          <path d="M5 16l7 5 7-5" />
        </svg>
      ),
    },
    {
      id: 'admin',
      labelKey: 'nav.admin',
      desc: 'Мониторинг, слабые места, назначения',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
        </svg>
      ),
      adminOnly: true,
    },
  ];

  const visible = items.filter((i) => !i.adminOnly || user?.role === 'admin');

  return (
    <div className={styles.more}>
      <h1 className={styles.title}>{t('more.title')}</h1>

      <div className={styles.list}>
        {visible.map((item) => (
          <Card key={item.id} interactive onClick={() => onNavigate(item.id)}>
            <div className={styles.item}>
              <span className={styles.itemIcon} aria-hidden="true">
                {item.icon}
              </span>
              <div className={styles.itemText}>
                <p className={styles.itemName}>{t(item.labelKey)}</p>
                <p className={styles.itemDesc}>{item.desc}</p>
              </div>
              <span className={styles.chevron} aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 6 6 6-6 6" />
                </svg>
              </span>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <p className={styles.sectionLabel}>{t('more.language')}</p>
        <div className={styles.langRow} role="group" aria-label={t('more.language')}>
          {(['ru', 'en'] as Lang[]).map((l) => (
            <button
              key={l}
              type="button"
              className={`${styles.langBtn} ${lang === l ? styles.langActive : ''}`}
              onClick={() => setLang(l)}
            >
              {l === 'ru' ? 'Русский' : 'English'}
            </button>
          ))}
        </div>
        <p className={styles.note}>{t('more.contentNote')}</p>
      </Card>

      <button type="button" className={styles.logout} onClick={logout}>
        {t('landing.logout')}
      </button>
    </div>
  );
};

export default More;
