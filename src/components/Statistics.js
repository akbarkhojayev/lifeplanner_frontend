import React from 'react';
import { TrendingUp, Target, Calendar, Award } from 'lucide-react';

const Statistics = ({ data }) => {
  if (!data) {
    return (
      <div className="stats-section">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      icon: <Target size={20} />,
      label: 'Jami odatlar',
      value: data.total_habits,
      color: '#3b82f6'
    },
    {
      icon: <TrendingUp size={20} />,
      label: 'Faol odatlar',
      value: data.active_habits,
      color: '#10b981'
    },
    {
      icon: <Calendar size={20} />,
      label: 'Bugungi natija',
      value: `${data.today_completion_rate}%`,
      color: '#f59e0b'
    },
    {
      icon: <Award size={20} />,
      label: 'Haftalik natija',
      value: `${data.weekly_completion_rate}%`,
      color: '#8b5cf6'
    }
  ];

  return (
    <div className="stats-section">
      <h3 className="section-title">Statistika</h3>
      
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div style={{ color: stat.color, marginBottom: '8px' }}>
              {stat.icon}
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {data.best_streaks && data.best_streaks.length > 0 && (
        <div style={{ marginTop: '25px' }}>
          <h4 style={{ marginBottom: '15px', fontSize: '16px', fontWeight: '600' }}>
            Eng yaxshi natijalar
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {data.best_streaks.slice(0, 3).map((streak, index) => (
              <div 
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 15px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <span style={{ fontSize: '14px' }}>{streak.habit_name}</span>
                <span className="streak-badge">
                  🔥 {streak.current_streak}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: '25px' }}>
        <div style={{
          padding: '15px',
          background: 'rgba(34, 197, 94, 0.1)',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '5px' }}>
            Bugun bajarildi
          </div>
          <div style={{ fontSize: '18px', fontWeight: '600' }}>
            {data.today_completed} / {data.today_total}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;