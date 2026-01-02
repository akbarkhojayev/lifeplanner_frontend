import React, { useState } from 'react';
import { habitsAPI } from '../services/api';
import { X, Plus } from 'lucide-react';
import { LoadingButton } from './Loaders';
import Portal from './Portal';

const AddHabitModal = ({ onClose, onHabitAdded }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
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
      await habitsAPI.createHabit({
        name: name.trim(),
        description: description.trim(),
        is_active: true
      });
      
      // Muvaffaqiyatli qo'shildi
      onHabitAdded();
      onClose(); // Modalni yopish
    } catch (error) {
      console.error('Odat yaratishda xatolik:', error);
      setError(error.response?.data?.detail || 'Odat yaratishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Portal>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600' }}>Yangi odat qo'shish</h2>
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

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '25px' }}>
              <button
                type="button"
                className="btn btn-danger"
                onClick={onClose}
                disabled={loading}
              >
                Bekor qilish
              </button>
              <LoadingButton
                type="submit"
                className="btn btn-success"
                loading={loading}
                disabled={loading}
              >
                <Plus size={16} />
                Qo'shish
              </LoadingButton>
            </div>
          </form>
        </div>
      </div>
    </Portal>
  );
};

export default AddHabitModal;