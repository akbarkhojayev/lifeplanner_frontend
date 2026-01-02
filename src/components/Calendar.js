import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { uz } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { habitsAPI, habitLogsAPI } from '../services/api';
import { LoadingList, InlineLoader } from './Loaders';
import HabitLogModal from './HabitLogModal';
import HabitDetailModal from './HabitDetailModal';

const Calendar = ({ currentDate, onDateChange, onDataUpdate }) => {
  const [habits, setHabits] = useState([]);
  const [habitLogs, setHabitLogs] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [showLogModal, setShowLogModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [currentDate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [habitsResponse, logsResponse] = await Promise.all([
        habitsAPI.getActiveHabits(),
        habitLogsAPI.getMonthlyLogs()
      ]);
      
      setHabits(habitsResponse.data);
      setHabitLogs(logsResponse.data);
    } catch (error) {
      console.error('Ma\'lumotlarni olishda xatolik:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    onDateChange(newDate);
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getHabitLogForDate = (habit, date) => {
    return habitLogs.find(log => 
      log.habit === habit.id && 
      isSameDay(new Date(log.date), date)
    );
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'completed':
        return 'completed';
      case 'partial':
        return 'partial';
      case 'not_done':
        return 'not-done';
      default:
        return 'future';
    }
  };

  const handleDayClick = (date, habit) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    
    // Faqat bugun uchun tahrirlash mumkin
    if (selectedDate.getTime() !== today.getTime()) {
      if (selectedDate.getTime() > today.getTime()) {
        alert('Kelajak kunlar uchun ma\'lumot kiritish mumkin emas.');
      } else {
        alert('O\'tgan kunlar uchun ma\'lumotlarni tahrirlash mumkin emas. Faqat bugun uchun tahrirlash mumkin.');
      }
      return;
    }
    
    setSelectedDate(date);
    setSelectedHabit(habit);
    setShowLogModal(true);
  };

  const handleHabitNameClick = (habit) => {
    setSelectedHabit(habit);
    setShowDetailModal(true);
  };

  const handleLogUpdate = () => {
    setShowLogModal(false);
    fetchData();
    onDataUpdate();
  };

  const handleHabitUpdated = () => {
    fetchData();
    onDataUpdate();
  };

  const handleHabitDeleted = () => {
    fetchData();
    onDataUpdate();
  };

  if (loading) {
    return (
      <div className="calendar-container">
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <InlineLoader text="Kalendar yuklanmoqda..." />
        </div>
        <LoadingList items={3} />
      </div>
    );
  }

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={() => navigateMonth(-1)} className="nav-button">
          <ChevronLeft size={16} />
        </button>
        <h2 className="calendar-month">
          {format(currentDate, 'MMMM yyyy', { locale: uz })}
        </h2>
        <button onClick={() => navigateMonth(1)} className="nav-button">
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="legend">
        <span className="legend-item">
          <span className="legend-dot completed"></span>
          Mukammal
        </span>
        <span className="legend-item">
          <span className="legend-dot partial"></span>
          O'rtacha
        </span>
        <span className="legend-item">
          <span className="legend-dot not-done"></span>
          Bajarilmagan
        </span>
      </div>

      <div>
        {habits.length === 0 ? (
          <div className="no-habits">
            <p>Hali odatlar qo'shilmagan. Birinchi odatingizni qo'shing!</p>
          </div>
        ) : (
          habits.map(habit => (
            <div key={habit.id} className="habit-row">
              <div className="habit-info">
                <span 
                  className="habit-name"
                  onClick={() => handleHabitNameClick(habit)}
                  style={{ cursor: 'pointer' }}
                >
                  {habit.name}
                </span>
                <span className="habit-streak">{habit.current_streak} kun</span>
              </div>
              
              <div className="calendar-grid">
                {monthDays.map(day => {
                  const log = getHabitLogForDate(habit, day);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  
                  const dayDate = new Date(day);
                  dayDate.setHours(0, 0, 0, 0);
                  
                  const habitCreatedDate = new Date(habit.created_at);
                  habitCreatedDate.setHours(0, 0, 0, 0);
                  
                  const isToday = dayDate.getTime() === today.getTime();
                  const isFuture = dayDate.getTime() > today.getTime();
                  const isBeforeHabitCreated = dayDate.getTime() < habitCreatedDate.getTime();
                  
                  // Faqat bugun uchun tahrirlash mumkin
                  const canEdit = isToday && !isBeforeHabitCreated;
                  
                  let status = 'future';
                  if (!isFuture && !isBeforeHabitCreated) {
                    status = log?.status || 'not_done';
                  }
                  
                  const canClick = canEdit;
                  
                  return (
                    <div
                      key={day.toISOString()}
                      className={`calendar-day ${getStatusClass(status)} ${isToday ? 'today' : ''} ${!canClick ? 'disabled' : ''}`}
                      onClick={() => canClick && handleDayClick(day, habit)}
                    >
                      {format(day, 'd')}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {showLogModal && (
        <HabitLogModal
          habit={selectedHabit}
          date={selectedDate}
          onClose={() => setShowLogModal(false)}
          onUpdate={handleLogUpdate}
        />
      )}

      {showDetailModal && (
        <HabitDetailModal
          habit={selectedHabit}
          onClose={() => setShowDetailModal(false)}
          onHabitUpdated={handleHabitUpdated}
          onHabitDeleted={handleHabitDeleted}
        />
      )}
    </div>
  );
};

export default Calendar;