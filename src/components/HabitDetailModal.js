import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { uz } from 'date-fns/locale';
import { habitsAPI, habitLogsAPI } from '../services/api';
import { X, Edit, Trash2, BarChart3, Calendar, MessageSquare, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import Portal from './Portal';
import EditHabitModal from './EditHabitModal';
import HabitStatsModal from './HabitStatsModal';

const HabitDetailModal = ({ habit, onClose, onHabitUpdated, onHabitDeleted }) => {
  const [habitLogs, setHabitLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchHabitLogs = async () => {
      try {
        setLoading(true);
        const response = await habitLogsAPI.getHabitLogs({ habit_id: habit.id });
        // Faqat izoh bor bo'lgan loglarni olish
        const logsWithNotes = response.data.filter(log => log.notes && log.notes.trim());
        setHabitLogs(logsWithNotes);
      } catch (error) {
        console.error('Odat loglarini olishda xatolik:', error);
        setError('Ma\'lumotlarni olishda xatolik yuz berdi');
      } finally {
        setLoading(false);
      }
    };

    fetchHabitLogs();
  }, [habit]);

  const handleDeleteHabit = async () => {
    try {
      await habitsAPI.deleteHabit(habit.id);
      onHabitDeleted();
      onClose();
    } catch (error) {
      console.error('Odatni o\'chirishda xatolik:', error);
      setError('Odatni o\'chirishda xatolik yuz berdi');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} style={{ color: '#10b981' }} />;
      case 'partial':
        return <AlertCircle size={16} style={{ color: '#f59e0b' }} />;
      case 'not_done':
        return <XCircle size={16} style={{ color: '#ef4444' }} />;
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'To\'liq bajarildi';
      case 'partial':
        return 'Yarim bajarildi';
      case 'not_done':
        return 'Bajarilmagan';
      default:
        return '';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#10b981';
      case 'partial':
        return '#f59e0b';
      case 'not_done':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <Portal>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px' }}>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px', lineHeight: '1.2' }}>
                {habit.name}
              </h2>
              {habit.description && (
                <p style={{ opacity: 0.8, fontSize: '14px', marginBottom: '12px' }}>
                  {habit.description}
                </p>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '13px' }}>
                <span style={{ 
                  background: habit.is_active ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  color: habit.is_active ? '#10b981' : '#ef4444',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {habit.is_active ? 'Faol' : 'Nofaol'}
                </span>
                <span style={{ opacity: 0.7 }}>
                  <Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  {format(new Date(habit.created_at), 'dd MMM yyyy', { locale: uz })} dan boshlab
                </span>
                <span style={{ color: '#10b981', fontWeight: '600' }}>
                  🔥 {habit.current_streak} kun streak
                </span>
              </div>
            </div>
            <button 
              onClick={onClose}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: 'white', 
                cursor: 'pointer',
                padding: '5px',
                marginLeft: '15px'
              }}
            >
              <X size={24} />
            </button>
          </div>

          {error && (
            <div className="error" style={{ marginBottom: '20px' }}>
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', flexWrap: 'wrap' }}>
            <button 
              className="btn btn-primary"
              onClick={() => setShowStatsModal(true)}
              style={{ fontSize: '13px', padding: '8px 12px' }}
            >
              <BarChart3 size={16} />
              Statistika
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => setShowEditModal(true)}
              style={{ fontSize: '13px', padding: '8px 12px' }}
            >
              <Edit size={16} />
              Tahrirlash
            </button>
            <button 
              className="btn btn-danger"
              onClick={() => setShowDeleteConfirm(true)}
              style={{ fontSize: '13px', padding: '8px 12px' }}
            >
              <Trash2 size={16} />
              O'chirish
            </button>
          </div>

          {/* Notes Section */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              marginBottom: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <MessageSquare size={18} />
              Izohlar ({habitLogs.length})
            </h3>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div className="spinner" style={{ width: '24px', height: '24px' }}></div>
              </div>
            ) : habitLogs.length === 0 ? (
              <p style={{ opacity: 0.7, textAlign: 'center', padding: '20px', fontSize: '14px' }}>
                Hali hech qanday izoh yozilmagan
              </p>
            ) : (
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {habitLogs.map((log, index) => (
                  <div 
                    key={log.id}
                    style={{
                      padding: '15px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '8px',
                      marginBottom: index < habitLogs.length - 1 ? '10px' : '0'
                    }}
                  >
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: '8px'
                    }}>
                      <div style={{ 
                        fontSize: '13px', 
                        fontWeight: '600',
                        opacity: 0.9
                      }}>
                        {format(new Date(log.date), 'dd MMMM yyyy', { locale: uz })}
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px',
                        fontSize: '12px',
                        color: getStatusColor(log.status)
                      }}>
                        {getStatusIcon(log.status)}
                        {getStatusText(log.status)}
                      </div>
                    </div>
                    <p style={{ 
                      fontSize: '14px', 
                      lineHeight: '1.4',
                      margin: 0,
                      opacity: 0.9
                    }}>
                      {log.notes}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Delete Confirmation */}
          {showDeleteConfirm && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '10px',
              padding: '15px',
              marginBottom: '20px'
            }}>
              <p style={{ marginBottom: '15px', fontSize: '14px' }}>
                ⚠️ Bu odatni o'chirishni xohlaysizmi? Bu amal qaytarilmaydi va barcha ma'lumotlar yo'qoladi.
              </p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button 
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteConfirm(false)}
                  style={{ fontSize: '13px', padding: '6px 12px' }}
                >
                  Bekor qilish
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={handleDeleteHabit}
                  style={{ fontSize: '13px', padding: '6px 12px' }}
                >
                  Ha, o'chirish
                </button>
              </div>
            </div>
          )}

          {/* Close Button */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button className="btn btn-secondary" onClick={onClose}>
              Yopish
            </button>
          </div>
        </div>
      </div>

      {/* Sub-modals */}
      {showEditModal && (
        <EditHabitModal
          habit={habit}
          onClose={() => setShowEditModal(false)}
          onHabitUpdated={() => {
            setShowEditModal(false);
            onHabitUpdated();
          }}
        />
      )}

      {showStatsModal && (
        <HabitStatsModal
          habit={habit}
          onClose={() => setShowStatsModal(false)}
        />
      )}
    </Portal>
  );
};

export default HabitDetailModal;