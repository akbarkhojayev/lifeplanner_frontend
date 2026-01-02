import React, { useState } from 'react';
import { habitsAPI } from '../services/api';
import { X, Save } from 'lucide-react';
import Portal from './Portal';

const EditHabitModal = ({ habit, onClose, onHabitUpdated }) => {
  const [name, setName] = useState(habit.name);
  const [description, setDescription] = useState(habit.description || '');
  const [isActive, setIsActive] = useState(habit.is_active);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Odat nomi kiritilishi shart');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await habitsAPI.updateHabit(habit.id, {
        name: name.trim(),
        description: description.trim(),
        is_active: isActive
      });
      
      onHabitUpdated();
    } catch (error) {
      console.error('Odatni yangilashda xatolik:', error);
      setError(error.response?.data?.detail || 'Odatni yangilashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Portal>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600' }}>Odatni tahrirlash</h2>
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
              <X size={20} />
            </button>
          </div>

          {error && (
            <div className="error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Odat nomi *</label>
              <input
                type="text"
                id="name"
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masalan: Kitob o'qish"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Tavsif</label>
              <textarea
                id="description"
                className="input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Odat haqida qo'shimcha ma'lumot..."
                rows="3"
                style={{ resize: 'vertical', minHeight: '80px' }}
              />
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  style={{ 
                    width: '18px', 
                    height: '18px',
                    accentColor: '#10b981'
                  }}
                />
                Faol odat
              </label>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '25px' }}>
              <button
                type="button"
                className="btn btn-danger"
                onClick={onClose}
                disabled={loading}
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                className="btn btn-success"
                disabled={loading}
              >
                {loading ? (
                  <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
                ) : (
                  <>
                    <Save size={16} />
                    Saqlash
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Portal>
  );
};

export default EditHabitModal;