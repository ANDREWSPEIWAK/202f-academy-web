import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useI18nStore, useT, Lang } from '../i18n';
import Button from '../components/Button';
import Logo202 from '../components/Logo202';
import styles from './Landing.module.css';

const Landing: React.FC = () => {
  const t = useT();
  const lang = useI18nStore((s) => s.lang);
  const setLang = useI18nStore((s) => s.setLang);
  const { login, register, isLoading, error, clearError } = useAuthStore();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === 'signin') {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
    } catch {
      // ошибка остаётся в сторе и показывается под формой
    }
  };

  const switchMode = (next: 'signin' | 'signup') => {
    setMode(next);
    clearError();
  };

  return (
    <div className={styles.landing}>
      <div className={styles.langRow} role="group" aria-label="Language">
        {(['ru', 'en'] as Lang[]).map((l) => (
          <button
            key={l}
            type="button"
            className={`${styles.langBtn} ${lang === l ? styles.langActive : ''}`}
            onClick={() => setLang(l)}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      <div className={styles.hero}>
  <div className={styles.brandMark} aria-hidden="true">
  <Logo202 size={52} />
  </div>
        <h1 className={styles.title}>{t('landing.hero.title')}</h1>
        <p className={styles.subtitle}>{t('landing.hero.sub')}</p>
        <ul className={styles.points}>
          <li>Junior · Skilled · PRO — 15 ступеней</li>
          <li>Контрольные тесты · порог 85%</li>
          <li>Практика на станции по чек-листам</li>
        </ul>
      </div>

      <div className={styles.card}>
        <div className={styles.tabs} role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'signin'}
            className={`${styles.tab} ${mode === 'signin' ? styles.tabActive : ''}`}
            onClick={() => switchMode('signin')}
          >
            {t('landing.signin')}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'signup'}
            className={`${styles.tab} ${mode === 'signup' ? styles.tabActive : ''}`}
            onClick={() => switchMode('signup')}
          >
            {t('landing.signup')}
          </button>
        </div>

        <form className={styles.form} onSubmit={submit}>
          {mode === 'signup' && (
            <label className={styles.field}>
              <span className={styles.fieldLabel}>{t('landing.name')}</span>
              <input
                className={styles.input}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
              />
            </label>
          )}
          <label className={styles.field}>
            <span className={styles.fieldLabel}>{t('landing.email')}</span>
            <input
              className={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </label>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>{t('landing.password')}</span>
            <input
              className={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              required
              minLength={6}
            />
          </label>

          {error && <p className={styles.error}>{t(error)}</p>}

          <Button type="submit" fullWidth disabled={isLoading}>
            {mode === 'signin' ? t('landing.login') : t('landing.register')}
          </Button>
        </form>

        <p className={styles.switch}>
          {mode === 'signin' ? t('landing.noAccount') : t('landing.haveAccount')}{' '}
          <button type="button" className={styles.switchBtn} onClick={() => switchMode(mode === 'signin' ? 'signup' : 'signin')}>
            {mode === 'signin' ? t('landing.signup') : t('landing.signin')}
          </button>
        </p>
        <p className={styles.demo}>{t('landing.demoAdmin')}</p>
      </div>
    </div>
  );
};

export default Landing;
