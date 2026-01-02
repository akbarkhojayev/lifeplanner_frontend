import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from './Calendar';
import AddHabitModal from './AddHabitModal';
import ProfileDropdown from './ProfileDropdown';
import { PageLoader } from './Loaders';
import { dashboardAPI } from '../services/api';
import { Plus, Calendar as CalendarIcon, BarChart3 } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchDashboardData();
    createMissingLogs();
  }, []);

  const fetchDashboardData = async () => {
    try {
      await dashboardAPI.getDashboard();
    } catch (error) {
      console.error('Dashboard ma\'lumotlarini olishda xatolik:', error);
    } finally {
      setLoading(false);
    }
  };

  const createMissingLogs = async () => {
    try {
      await dashboardAPI.createMissingLogs();
    } catch (error) {
      console.error('Etishmayotgan loglarni yaratishda xatolik:', error);
    }
  };

  const handleHabitAdded = () => {
    setShowAddHabit(false);
    setRefreshKey(prev => prev + 1); // Calendar ni yangilash uchun
    fetchDashboardData();
  };

  if (loading) {
    return <PageLoader message="Dashboard yuklanmoqda..." />;
  }

  return (
    <div className="container">
      <header className="header">
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '4px' }}>
            Odatlar Kalendari
          </h1>
          <p className="header-subtitle" style={{ fontSize: '13px', opacity: 0.7 }}>
            Har bir odat uchun kunlik taraqqiyot
          </p>
        </div>
        <div className="user-info">
          <ProfileDropdown />
        </div>
      </header>

      {/* Single Calendar Container */}
      <div className="single-calendar-container">
        <div className="calendar-title">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CalendarIcon size={20} />
            <span>Odatlar Kalendari</span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              className="btn btn-secondary"
              onClick={() => navigate('/statistics')}
              style={{ padding: '8px 16px', fontSize: '13px' }}
            >
              <BarChart3 size={14} />
              Statistika
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => setShowAddHabit(true)}
              style={{ padding: '8px 16px', fontSize: '13px' }}
            >
              <Plus size={14} />
              Odat qo'shish
            </button>
          </div>
        </div>
        
        <Calendar 
          key={refreshKey}
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          onDataUpdate={fetchDashboardData}
        />
      </div>

      {showAddHabit && (
        <AddHabitModal
          onClose={() => setShowAddHabit(false)}
          onHabitAdded={handleHabitAdded}
        />
      )}
    </div>
  );
};

export default Dashboard;