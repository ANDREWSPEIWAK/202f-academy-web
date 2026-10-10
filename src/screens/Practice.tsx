import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import styles from './Practice.module.css';

const Practice: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'timer' | 'log' | 'calculator'>('timer');
  const [brewMethod, setBrewMethod] = useState('V60');
  const [timerActive, setTimerActive] = useState(false);
  const [timerValue, setTimerValue] = useState(0);

  const brewMethods = [
    { id: 'V60', name: 'V60', bloomTime: 35, targetTime: 165, targetWater: 300.6 },
    { id: 'KALITA', name: 'Kalita 185', bloomTime: 30, targetTime: 180, targetWater: 300 },
    { id: 'AEROPRESS', name: 'AeroPress', bloomTime: 0, targetTime: 180, targetWater: 200 },
    { id: 'ESPRESSO', name: 'Espresso', bloomTime: 0, targetTime: 27, targetWater: 36 },
  ];

  const currentMethod = brewMethods.find((m) => m.id === brewMethod);

  React.useEffect(() => {
    if (!timerActive) return;
    const interval = setInterval(() => {
      setTimerValue((v) => v + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className={styles.practice}>
      <div className={styles.header}>
        <h1 className={styles.title}>Практика</h1>
      </div>

      <div className={styles.tabs}>
        {['timer', 'log', 'calculator'].map((tab) => (
          <button
            key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles.active : ''}`}
            onClick={() => setActiveTab(tab as typeof activeTab)}
          >
            {tab === 'timer' ? '⏱ Таймер' : tab === 'log' ? '📋 Лог' : '🧮 Калькулятор'}
          </button>
        ))}
      </div>

      <div className={styles.content}>
        {activeTab === 'timer' && (
          <div className={styles.section}>
            <div className={styles.methodSelector}>
              {brewMethods.map((method) => (
                <Button
                  key={method.id}
                  variant={brewMethod === method.id ? 'primary' : 'secondary'}
                  size="small"
                  onClick={() => {
                    setBrewMethod(method.id);
                    setTimerValue(0);
                    setTimerActive(false);
                  }}
                >
                  {method.name}
                </Button>
              ))}
            </div>

            <Card>
              <div className={styles.timerCard}>
                <p className={styles.timerLabel}>Время заварки</p>
                <div className={styles.timerDisplay}>{formatTime(timerValue)}</div>
                <p className={styles.timerTarget}>
                  Цель: {formatTime(currentMethod?.targetTime || 0)}
                </p>

                {currentMethod?.bloomTime! > 0 && (
                  <div className={styles.bloomInfo}>
                    <p>Bloom: {currentMethod?.bloomTime}с</p>
                  </div>
                )}

                <div className={styles.timerControls}>
                  <Button
                    variant="primary"
                    onClick={() => setTimerActive(!timerActive)}
                  >
                    {timerActive ? '⏸ Пауза' : '▶ Старт'}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setTimerValue(0);
                      setTimerActive(false);
                    }}
                  >
                    🔄 Сброс
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'log' && (
          <div className={styles.section}>
            <Card>
              <div className={styles.logForm}>
                <h3>Запись заварки</h3>
                <div className={styles.formGroup}>
                  <Input label="Кофе" placeholder="Название кофе" />
                  <Input label="Происхождение" placeholder="Эфиопия, Кения..." />
                  <Input label="Доза (г)" type="number" defaultValue="18" />
                  <Input label="Вода (г)" type="number" defaultValue="300" />
                  <Input label="Соотношение" placeholder="1:16.7" />
                  <Input label="Время заварки (сек)" type="number" defaultValue="180" />
                  <Input label="TDS (%)" type="number" step="0.01" placeholder="1.35" />
                  <Input label="Extraction Yield (%)" type="number" step="0.1" placeholder="20" />
                  <Input label="Оценка (1-5)" type="number" min="1" max="5" />
                </div>
                <Button variant="primary" fullWidth>
                  💾 Сохранить запись
                </Button>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'calculator' && (
          <div className={styles.section}>
            <Card>
              <div className={styles.calculator}>
                <h3>Калькулятор отношения</h3>
                <div className={styles.formGroup}>
                  <Input label="Кофе (г)" type="number" defaultValue="18" />
                  <Input label="Соотношение" placeholder="1:16.7" />
                </div>
                <div className={styles.result}>
                  <p>Вода: <strong>300.6 г</strong></p>
                </div>
              </div>
            </Card>

            <Card>
              <div className={styles.calculator}>
                <h3>Калькулятор Extraction Yield</h3>
                <div className={styles.formGroup}>
                  <Input label="Доза (г)" type="number" defaultValue="18" />
                  <Input label="Вес напитка (г)" type="number" defaultValue="300" />
                  <Input label="TDS (%)" type="number" step="0.01" defaultValue="1.35" />
                </div>
                <div className={styles.result}>
                  <p>EY: <strong>22.5%</strong></p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Practice;
