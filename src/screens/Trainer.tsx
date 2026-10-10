import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import styles from './Trainer.module.css';

const Trainer: React.FC = () => {
  const [mode, setMode] = useState<'TRAINER' | 'GUEST' | 'EXAM'>('TRAINER');
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages([...messages, { role: 'user', content: input }]);
    setInput('');

    setTimeout(() => {
      const responses: Record<string, string> = {
        'TRAINER': 'Начни с самого вероятного фактора: что бы ты изменил первым — помол, дозу или выход?',
        'GUEST': 'Вот несколько советов по вашему вопросу...',
        'EXAM': 'Пожалуйста, ответьте на этот вопрос без помощи.',
      };
      setMessages((prev) => [
        ...prev,
        { role: 'trainer', content: responses[mode] },
      ]);
    }, 500);
  };

  return (
    <div className={styles.trainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Тренер</h1>
      </div>

      <div className={styles.modeSelector}>
        {['TRAINER', 'GUEST', 'EXAM'].map((m) => (
          <Button
            key={m}
            variant={mode === m ? 'primary' : 'secondary'}
            size="small"
            onClick={() => setMode(m as typeof mode)}
          >
            {m === 'TRAINER' ? '💪 Тренер' : m === 'GUEST' ? '👥 Гость' : '📝 Экзамен'}
          </Button>
        ))}
      </div>

      <div className={styles.messagesContainer}>
        {messages.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.icon}>🤖</p>
            <p className={styles.text}>
              {mode === 'TRAINER'
                ? 'Задай мне вопрос о кофе'
                : mode === 'GUEST'
                  ? 'Я помогу тебе, но не буду давать прямые ответы'
                  : 'Экзаменационный режим. Показывай свои знания!'}
            </p>
          </div>
        ) : (
          <div className={styles.messages}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`${styles.message} ${styles[msg.role]}`}
              >
                <Card>
                  <p>{msg.content}</p>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={handleSendMessage} className={styles.inputForm}>
        <Input
          placeholder="Введи свой вопрос..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          fullWidth
        />
        <Button type="submit" variant="primary">Отправить</Button>
      </form>
    </div>
  );
};

export default Trainer;
