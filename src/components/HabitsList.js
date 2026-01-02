import React, { useState, useEffect } from 'react';
import { habitsAPI } from '../services/api';
import { Edit, Trash2, BarChart3, Play, Pause } from 'lucide-react';
import EditHabitModal from './EditHabitModal';
import HabitStatsModal from './HabitStatsModal';

const HabitsList = ({ onDataUpdate }) => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingHabit, setEditingHabit] = useState(null);
  const [statsHabit, setStatsHabit] = useState(null);

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const response = await habitsAPI.getHabits();
      setHabits(response.data);
    } catch (error) {
      console.error('Odatlarni olishda xatolik:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (habit) => {
    try {
      await habitsAPI.updateHabit(habit.id, {
        is_active: !habit.is_active
      });
      fetchHabits();
      onDataUpdate();
    } catch (error) {
      console.error('Odat holatini o\'zgartirishda xatolik:', error);
    }
  };

  const handleDelete = async (habit) => {
    if (window.confirm(`"${habit.name}" odatini o'chirishni xohlaysizmi?`)) {
      try {
        await habitsAPI.deleteHabit(habit.id);
        fetchHabits();
        onDataUpdate();
      } catch (error) {
        console.error('Odatni o\'chirishda xatolik:', error);
      }
    }
  };

  const handleEdit = (habit) => {
    setEditingHabit(habit);
  };

  const handleShowStats = (habit) => {
    setStatsHabit(habit);
  };

  const handleHabitUpdated = () => {
    setEditingHabit(null);
    fetchHabits();
    onDataUpdate();
  };

  if (loading) {
    return (
      <div className="habits-section">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="habits-section">
      <h3 className="section-title">Odatlar</h3>
      
      {habits.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px', opacity: 0.7 }}>
          <p>Hali odatlar qo'shilmagan</p>
        </div>
      ) : (
        <div className="habits-list">
          {habits.map(habit => (
            <div key={habit.id} className="habit-item">
              <div className="habit-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="habit-name">{habit.name}</span>
                  {!habit.is_active && (
                    <span style={{
                      fontSize: '12px',
                      padding: '2px 8px',
                      background: 'rgba(239, 68, 68, 0.2)',
                      border: '1px solid rgba(239, 68, 68, 0.5)',
                      borderRadius: '12px'
                    }}>
                      Nofaol
                    </span>
                  )}
                </div>
                <div className="habit-actions">
                  <button
                    className={`btn ${habit.is_active ? 'btn-warning' : 'btn-success'}`}
                    onClick={() => handleToggleActive(habit)}
                    style={{ padding: '6px 8px' }}
                    title={habit.is_active ? 'To\'xtatish' : 'Faollashtirish'}
                  >
                    {habit.is_active ? <Pause size={14} /> : <Play size={14} />}
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleShowStats(habit)}
                    style={{ padding: '6px 8px' }}
                    title="Statistika"
                  >
                    <BarChart3 size={14} />
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleEdit(habit)}
                    style={{ padding: '6px 8px' }}
                    title="Tahrirlash"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(habit)}
                    style={{ padding: '6px 8px' }}
                    title="O'chirish"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              
              {habit.description && (
                <div className="habit-description">
                  {habit.description}
                </div>
              )}
              
              <div className="habit-progress">
                <span>Hozirgi streak: {habit.current_streak} kun</span>
                <span className="streak-badge">
                  🔥 {habit.current_streak}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingHabit && (
        <EditHabitModal
          habit={editingHabit}
          onClose={() => setEditingHabit(null)}
          onHabitUpdated={handleHabitUpdated}
        />
      )}

      {statsHabit && (
        <HabitStatsModal
          habit={statsHabit}
          onClose={() => setStatsHabit(null)}
        />
      )}
    </div>
  );
};

export default HabitsList;