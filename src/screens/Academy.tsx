import React from 'react';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import Badge from '../components/Badge';
import styles from './Academy.module.css';

interface AcademyProps {
}

const Academy: React.FC<AcademyProps> = ({}) => {
  const profile = {
    currentLevel: 'JUNIOR' as const,
    totalProgress: 31,
    currentStreak: 7,
    totalLessonsCompleted: 8,
    totalTestsPassed: 3,
    totalBrewLogsRecorded: 15,
  };

  const skills = [
    { id: '1', name: 'Espresso', level: 'PRACTICING', progress: 45 },
    { id: '2', name: 'Milk', level: 'LEARNING', progress: 30 },
    { id: '3', name: 'Filter', level: 'LEARNING', progress: 25 },
    { id: '4', name: 'Service', level: 'COMPETENT', progress: 65 },
    { id: '5', name: 'Sensory', level: 'LEARNING', progress: 20 },
    { id: '6', name: 'Coffee Knowledge', level: 'PRACTICING', progress: 50 },
  ];

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '🌅 Доброе утро';
    if (hour < 18) return '☀️ Добрый день';
    return '🌙 Добрый вечер';
  };

  return (
    <div className={styles.academy}>
      <div className={styles.header}>
        <h1 className={styles.greeting}>{greeting()}</h1>
      </div>

      <Card className={styles.levelCard}>
        <div className={styles.levelContent}>
          <div>
            <h2 className={styles.levelTitle}>{profile.currentLevel}</h2>
          </div>
          <div className={styles.progressSection}>
            <ProgressBar value={profile.totalProgress} showLabel={false} />
          </div>
        </div>
      </Card>

      <div className={styles.statsGrid}>
        <Card>
          <div className={styles.stat}>
            <span className={styles.statIcon}>🔥</span>
            <div>
              <p className={styles.statValue}>{profile.currentStreak} дней</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className={styles.stat}>
            <span className={styles.statIcon}>📚</span>
            <div>
              <p className={styles.statValue}>{profile.totalLessonsCompleted}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className={styles.stat}>
            <span className={styles.statIcon}>✓</span>
            <div>
              <p className={styles.statValue}>{profile.totalTestsPassed}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className={styles.stat}>
            <span className={styles.statIcon}>☕</span>
            <div>
              <p className={styles.statValue}>{profile.totalBrewLogsRecorded}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Навыки</h3>
        <div className={styles.skillsGrid}>
          {skills.map((skill) => (
            <Card key={skill.id}>
              <div className={styles.skillCard}>
                <p className={styles.skillName}>{skill.name}</p>
                <Badge variant="secondary">{skill.level}</Badge>
                <ProgressBar value={skill.progress} size="small" showLabel={false} />
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Следующие уровни</h3>
        <div className={styles.levelsGrid}>
          {['SKILLED', 'PRO'].map((level) => (
            <Card key={level} interactive>
              <div className={styles.levelCard2}>
                <h4>{level}</h4>
                <p className={styles.hint}>Завершите текущий уровень</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Academy;