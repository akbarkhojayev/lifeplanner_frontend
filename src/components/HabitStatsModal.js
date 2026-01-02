import React, { useState, useEffect } from 'react';
import { habitsAPI } from '../services/api';
import { X, TrendingUp, Target, Calendar, Award, BarChart3 } from 'lucide-react';
import Portal from './Portal';

const HabitStatsModal = ({ habit, onClose }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [habit]);

  const fetchStats = async () => {
    try {
      const response = await habitsAPI.getHabitStatistics(habit.id);
      setStats(response.data);
    } catch (error) {
      console.error('Statistikani olishda xatolik:', error);
      setError('Statistikani olishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Portal>
        <div className="modal-overlay" onClick={onClose}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="loading">
              <div className="spinner"></div>
            </div>
          </div>
        </div>
      </Portal>
    );
  }

  if (error) {
    return (
      <Portal>
        <div className="modal-overlay" onClick={onClose}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="error">{error}</div>
            <button className="btn btn-primary" onClick={onClose}>Yopish</button>
          </div>
        </div>
      </Portal>
    );
  }

  const progressStats = [
    {
      icon: <Target size={24} />,
      label: 'Jami loglar',
      value: stats.total_logs,
      color: '#3b82f6'
    },
    {
      icon: <Award size={24} />,
      label: 'Bajarilgan',
      value: stats.completed_logs,
      color: '#10b981'
    },
    {
      icon: <BarChart3 size={24} />,
      label: 'Yarim bajarilgan',
      value: stats.partial_logs,
      color: '#f59e0b'
    },
    {
      icon: <TrendingUp size={24} />,
      label: 'Hozirgi streak',
      value: `${stats.current_streak} kun`,
      color: '#8b5cf6'
    }
  ];

  return (
    <Portal>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '5px' }}>
                {stats.habit_name} statistikasi
              </h2>
              <p style={{ opacity: 0.8, fontSize: '14px' }}>
                Umumiy ko'rsatkichlar va taraqqiyot
              </p>
            </div>
            <button 
              onClick={onClose}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: 'white', 
                cursor: 'pointer',
                padding: '5px'
              }}
            >
              <X size={24} />
            </button>
          </div>

          <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', marginBottom: '25px' }}>
            {progressStats.map((stat, index) => (
              <div key={index} className="stat-card" style={{ padding: '20px' }}>
                <div style={{ color: stat.color, marginBottom: '10px' }}>
                  {stat.icon}
                </div>
                <div className="stat-value" style={{ fontSize: '28px' }}>{stat.value}</div>
                <div className="stat-label" style={{ fontSize: '14px' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
            <div style={{
              padding: '20px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981', marginBottom: '5px' }}>
                {stats.completion_rate}%
              </div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>
                Umumiy bajarilish foizi
              </div>
            </div>

            <div style={{
              padding: '20px',
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '5px' }}>
                {stats.weekly_completion_rate}%
              </div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>
                Haftalik bajarilish foizi
              </div>
            </div>
          </div>

          <div style={{
            padding: '20px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            marginBottom: '25px'
          }}>
            <h4 style={{ marginBottom: '15px', fontSize: '16px', fontWeight: '600' }}>
              <Calendar size={18} style={{ display: 'inline', marginRight: '8px' }} />
              Haftalik hisobot
            </h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '14px', opacity: 0.8 }}>Oxirgi 7 kun ichida</div>
                <div style={{ fontSize: '18px', fontWeight: '600' }}>
                  {stats.weekly_completed} / {stats.weekly_total} bajarildi
                </div>
              </div>
              <div className="streak-badge" style={{ fontSize: '14px', padding: '8px 12px' }}>
                🔥 {stats.current_streak} kun streak
              </div>
            </div>
          </div>

          {stats.partial_rate > 0 && (
            <div style={{
              padding: '15px',
              background: 'rgba(251, 191, 36, 0.1)',
              border: '1px solid rgba(251, 191, 36, 0.3)',
              borderRadius: '10px',
              marginBottom: '20px'
            }}>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>
                💡 Maslahat: {stats.partial_rate}% vaqtlarda yarim bajarilgan. 
                To'liq bajarilish uchun rejani qayta ko'rib chiqing.
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={onClose}>
              Yopish
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default HabitStatsModal;