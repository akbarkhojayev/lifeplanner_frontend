import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { uz } from 'date-fns/locale';
import { habitLogsAPI } from '../services/api';
import { X, Save, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import Portal from './Portal';

const HabitLogModal = ({ habit, date, onClose, onUpdate }) => {
  const [status, setStatus] = useState('not_done');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [existingLog, setExistingLog] = useState(null);

  // Faqat bugun uchun tahrirlash imkoniyatini tekshirish
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selectedDate = new Date(date);
  selectedDate.setHours(0, 0, 0, 0);
  
  const isReadOnly = selectedDate.getTime() !== today.getTime();

  useEffect(() => {
    fetchExistingLog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [habit, date]);

  const fetchExistingLog = async () => {
    try {
      const response = await habitLogsAPI.getHabitLogs({
        habit_id: habit.id,
        date: format(date, 'yyyy-MM-dd')
      });
      
      if (response.data.length > 0) {
        const log = response.data[0];
        setExistingLog(log);
        setStatus(log.status);
        setNotes(log.notes || '');
      }
    } catch (error) {
      console.error('Mavjud logni olishda xatolik:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const logData = {
        habit: habit.id,
        date: format(date, 'yyyy-MM-dd'),
        status,
        notes: notes.trim()
      };

      if (existingLog) {
        await habitLogsAPI.updateHabitLog(existingLog.id, logData);
      } else {
        await habitLogsAPI.createHabitLog(logData);
      }
      
      onUpdate();
    } catch (error) {
      console.error('Logni saqlashda xatolik:', error);
      setError(error.response?.data?.detail || 'Logni saqlashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    {
      value: 'completed',
      label: "To'liq bajarildi",
      icon: <CheckCircle size={20} />,
      color: '#10b981',
      description: '100% - Maqsadga to\'liq erishildi'
    },
    {
      value: 'partial',
      label: 'Yarim bajarildi',
      icon: <AlertCircle size={20} />,
      color: '#f59e0b',
      description: '50% - Qisman bajarildi'
    },
    {
      value: 'not_done',
      label: 'Bajarilmagan',
      icon: <XCircle size={20} />,
      color: '#ef4444',
      description: '0% - Bajarilmadi'
    }
  ];

  return (
    <Portal>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '5px' }}>
                {habit.name}
                {isReadOnly && <span style={{ fontSize: '14px', color: '#fbbf24', marginLeft: '10px' }}>🔒 Faqat ko'rish</span>}
              </h2>
              <p style={{ opacity: 0.8, fontSize: '14px' }}>
                {format(date, 'dd MMMM yyyy', { locale: uz })}
                {isReadOnly && (
                  <span style={{ color: '#fbbf24', marginLeft: '10px' }}>
                    {selectedDate.getTime() > today.getTime() 
                      ? '(Kelajak kun - tahrirlash mumkin emas)'
                      : '(O\'tgan kun - tahrirlash mumkin emas)'
                    }
                  </span>
                )}
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
              <label>Holat</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                {statusOptions.map(option => (
                  <label
                    key={option.value}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '15px',
                      border: `2px solid ${status === option.value ? option.color : 'rgba(255, 255, 255, 0.2)'}`,
                      borderRadius: '10px',
                      cursor: isReadOnly ? 'not-allowed' : 'pointer',
                      background: status === option.value ? `${option.color}20` : 'rgba(255, 255, 255, 0.05)',
                      transition: 'all 0.3s ease',
                      opacity: isReadOnly ? 0.6 : 1
                    }}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={option.value}
                      checked={status === option.value}
                      onChange={(e) => !isReadOnly && setStatus(e.target.value)}
                      disabled={isReadOnly}
                      style={{ display: 'none' }}
                    />
                    <div style={{ color: option.color }}>
                      {option.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', marginBottom: '2px' }}>
                        {option.label}
                      </div>
                      <div style={{ fontSize: '12px', opacity: 0.8 }}>
                        {option.description}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="notes">Izohlar</label>
              <textarea
                id="notes"
                className="input"
                value={notes}
                onChange={(e) => !isReadOnly && setNotes(e.target.value)}
                placeholder={isReadOnly ? "Bu kun uchun tahrirlash mumkin emas" : "Bugun qanday o'tdi? Qiyinchiliklar yoki muvaffaqiyatlar..."}
                rows="3"
                style={{ resize: 'vertical', minHeight: '80px', opacity: isReadOnly ? 0.6 : 1 }}
                readOnly={isReadOnly}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '25px' }}>
              <button
                type="button"
                className="btn btn-danger"
                onClick={onClose}
                disabled={loading}
              >
                {isReadOnly ? 'Yopish' : 'Bekor qilish'}
              </button>
              {!isReadOnly && (
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
              )}
            </div>
          </form>
        </div>
      </div>
    </Portal>
  );
};

export default HabitLogModal;