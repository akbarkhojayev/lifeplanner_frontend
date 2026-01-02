import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { uz } from 'date-fns/locale';
import { ArrowLeft, Calendar, TrendingUp, CheckCircle, Clock, XCircle, BarChart3, List } from 'lucide-react';
import { habitsAPI, habitLogsAPI } from '../services/api';
import { PageLoader } from './Loaders';

// Chart.js ni registratsiya qilish
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StatisticsPage = ({ onBack }) => {
  const [loading, setLoading] = useState(true);
  const [habits, setHabits] = useState([]);
  const [habitLogs, setHabitLogs] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [chartData, setChartData] = useState(null);

  // Ranglar palitasi
  const colors = [
    '#3B82F6', // Blue
    '#EF4444', // Red
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#8B5CF6', // Purple
    '#F97316', // Orange
    '#06B6D4', // Cyan
    '#84CC16', // Lime
    '#EC4899', // Pink
    '#6B7280', // Gray
    '#14B8A6', // Teal
    '#F43F5E', // Rose
  ];

  useEffect(() => {
    fetchData();
  }, [currentMonth]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Odatlarni olish
      const habitsResponse = await habitsAPI.getHabits();
      const activeHabits = habitsResponse.data.filter(habit => habit.is_active);
      setHabits(activeHabits);

      // Oy boshi va oxiri
      const monthStart = startOfMonth(currentMonth);
      const monthEnd = endOfMonth(currentMonth);

      // Oy davomidagi barcha kunlar
      const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

      // Har bir odat uchun loglarni olish
      const allLogs = [];
      for (const habit of activeHabits) {
        const logsResponse = await habitLogsAPI.getHabitLogs({
          habit_id: habit.id
        });
        
        // Faqat joriy oy loglarini filtrlash
        const monthLogs = logsResponse.data.filter(log => {
          const logDate = new Date(log.date);
          return logDate >= monthStart && logDate <= monthEnd;
        });

        allLogs.push(...monthLogs.map(log => ({ ...log, habitName: habit.name })));
      }

      setHabitLogs(allLogs);

      // Grafik ma'lumotlarini tayyorlash
      prepareChartData(activeHabits, allLogs, daysInMonth);

    } catch (error) {
      console.error('Statistika ma\'lumotlarini olishda xatolik:', error);
    } finally {
      setLoading(false);
    }
  };

  const prepareChartData = (habits, logs, daysInMonth) => {
    // X o'qi uchun kunlar
    const labels = daysInMonth.map(day => format(day, 'd'));

    // Har bir kun uchun turli statusdagi odatlar sonini hisoblash
    const completedData = daysInMonth.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const dayLogs = logs.filter(log => log.date === dayStr);
      return dayLogs.filter(log => log.status === 'completed').length;
    });

    const partialData = daysInMonth.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const dayLogs = logs.filter(log => log.date === dayStr);
      return dayLogs.filter(log => log.status === 'partial').length;
    });

    const notDoneData = daysInMonth.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const dayLogs = logs.filter(log => log.date === dayStr);
      return dayLogs.filter(log => log.status === 'not_done').length;
    });

    // Uchta dataset yaratish
    const datasets = [
      {
        label: 'To\'liq bajarilgan',
        data: completedData,
        borderColor: '#10B981',
        backgroundColor: '#10B98130',
        borderWidth: 4,
        pointRadius: 6,
        pointHoverRadius: 8,
        tension: 0.4,
        fill: false,
        pointBackgroundColor: '#10B981',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
      },
      {
        label: 'Qisman bajarilgan',
        data: partialData,
        borderColor: '#F59E0B',
        backgroundColor: '#F59E0B30',
        borderWidth: 4,
        pointRadius: 6,
        pointHoverRadius: 8,
        tension: 0.4,
        fill: false,
        pointBackgroundColor: '#F59E0B',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
      },
      {
        label: 'Bajarilmagan',
        data: notDoneData,
        borderColor: '#EF4444',
        backgroundColor: '#EF444430',
        borderWidth: 4,
        pointRadius: 6,
        pointHoverRadius: 8,
        tension: 0.4,
        fill: false,
        pointBackgroundColor: '#EF4444',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
      }
    ];

    setChartData({
      labels,
      datasets
    });
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 2.5, // Grafik nisbatini o'zgartirish
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'white',
          font: {
            size: 14
          },
          usePointStyle: true,
          padding: 25
        }
      },
      title: {
        display: true,
        text: `${format(currentMonth, 'MMMM yyyy', { locale: uz })} - Odatlar Holati bo'yicha Statistika`,
        color: 'white',
        font: {
          size: 20,
          weight: 'bold'
        },
        padding: 25
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        titleFont: {
          size: 14
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          label: function(context) {
            const value = context.parsed.y;
            const status = context.dataset.label;
            return `${status}: ${value} ta odat`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Oy kunlari',
          color: 'white',
          font: {
            size: 16,
            weight: '600'
          }
        },
        ticks: {
          color: 'white',
          font: {
            size: 12
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          lineWidth: 1
        }
      },
      y: {
        title: {
          display: true,
          text: 'Odatlar soni',
          color: 'white',
          font: {
            size: 16,
            weight: '600'
          }
        },
        min: 0,
        max: Math.max(habits.length + 2, 5), // Dinamik maksimal qiymat
        ticks: {
          color: 'white',
          stepSize: 1,
          font: {
            size: 12
          },
          callback: function(value) {
            // Faqat butun sonlarni ko'rsatish
            if (Number.isInteger(value)) {
              return value;
            }
            return '';
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          lineWidth: 1
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    elements: {
      point: {
        radius: 5,
        hoverRadius: 8,
        borderWidth: 2
      },
      line: {
        borderWidth: 3,
        tension: 0.4
      }
    }
  };

  const changeMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  if (loading) {
    return <PageLoader message="Statistika yuklanmoqda..." />;
  }

  return (
    <div className="container">
      {/* Header */}
      <div className="header" style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button 
            onClick={onBack}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              padding: '12px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.15)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.transform = 'translateY(0px)';
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 style={{ 
              fontSize: '32px', 
              fontWeight: '700', 
              marginBottom: '8px',
              background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <BarChart3 size={32} style={{ color: '#60A5FA' }} />
              Statistika Tahlili
            </h1>
            <p style={{ 
              fontSize: '16px', 
              opacity: 0.8,
              color: 'rgba(255, 255, 255, 0.7)'
            }}>
              Odatlaringizning oylik progressi va trend tahlili
            </p>
          </div>
        </div>
      </div>

      {/* Oy tanlash */}
      <div style={{ 
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '20px',
        padding: '30px',
        marginBottom: '40px',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => changeMonth(-1)}
            style={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.2) 100%)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '12px',
              padding: '12px 20px',
              color: 'white',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              fontSize: '14px',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(37, 99, 235, 0.3) 100%)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.2) 100%)';
              e.target.style.transform = 'translateY(0px)';
            }}
          >
            ← Oldingi oy
          </button>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '15px',
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '15px 25px',
            borderRadius: '15px',
            backdropFilter: 'blur(10px)'
          }}>
            <Calendar size={24} style={{ color: '#60A5FA' }} />
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: '700', 
              color: 'white',
              margin: 0
            }}>
              {format(currentMonth, 'MMMM yyyy', { locale: uz })}
            </h2>
          </div>
          
          <button
            onClick={() => changeMonth(1)}
            style={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.2) 100%)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '12px',
              padding: '12px 20px',
              color: 'white',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              fontSize: '14px',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(37, 99, 235, 0.3) 100%)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.2) 100%)';
              e.target.style.transform = 'translateY(0px)';
            }}
          >
            Keyingi oy →
          </button>
        </div>
      </div>

      {/* Grafik */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '25px',
        padding: '40px',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        minHeight: '700px',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: '40px'
      }}>
        {/* Dekorativ elementlar */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%)',
          borderRadius: '50%',
          filter: 'blur(40px)'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-30px',
          left: '-30px',
          width: '150px',
          height: '150px',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)',
          borderRadius: '50%',
          filter: 'blur(30px)'
        }}></div>
        
        {chartData && chartData.datasets.length > 0 ? (
          <div style={{ height: '620px', position: 'relative', zIndex: 1 }}>
            <Line data={chartData} options={chartOptions} />
          </div>
        ) : (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '600px',
            color: 'rgba(255, 255, 255, 0.7)',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{ 
              background: 'rgba(96, 165, 250, 0.2)',
              borderRadius: '50%',
              padding: '30px',
              marginBottom: '25px',
              border: '2px solid rgba(96, 165, 250, 0.3)'
            }}>
              <BarChart3 size={60} style={{ color: '#60A5FA' }} />
            </div>
            <h3 style={{ 
              fontSize: '24px', 
              marginBottom: '15px',
              fontWeight: '600',
              textAlign: 'center'
            }}>Ma'lumot topilmadi</h3>
            <p style={{ 
              fontSize: '16px', 
              textAlign: 'center',
              opacity: 0.8,
              maxWidth: '400px',
              lineHeight: '1.5'
            }}>
              Bu oy uchun faol odatlar yoki loglar mavjud emas. Odatlaringizni kuzatishni boshlang!
            </p>
          </div>
        )}
      </div>

      {/* Statistika kartlari */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
        gap: '25px', 
        marginBottom: '40px' 
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.15) 100%)',
          borderRadius: '20px',
          padding: '25px',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          textAlign: 'center',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(16, 185, 129, 0.1)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(16, 185, 129, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0px)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(16, 185, 129, 0.1)';
        }}
        >
          <div style={{ 
            background: 'rgba(16, 185, 129, 0.2)',
            borderRadius: '15px',
            padding: '15px',
            display: 'inline-block',
            marginBottom: '15px'
          }}>
            <CheckCircle size={28} style={{ color: '#10B981' }} />
          </div>
          <div style={{ 
            fontSize: '32px', 
            fontWeight: '800', 
            color: 'white', 
            marginBottom: '8px',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            {habitLogs.filter(log => log.status === 'completed').length}
          </div>
          <div style={{ 
            fontSize: '16px', 
            color: 'rgba(255, 255, 255, 0.8)',
            fontWeight: '500'
          }}>
            To'liq bajarilgan
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.15) 100%)',
          borderRadius: '20px',
          padding: '25px',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          textAlign: 'center',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(59, 130, 246, 0.1)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(59, 130, 246, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0px)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(59, 130, 246, 0.1)';
        }}
        >
          <div style={{ 
            background: 'rgba(59, 130, 246, 0.2)',
            borderRadius: '15px',
            padding: '15px',
            display: 'inline-block',
            marginBottom: '15px'
          }}>
            <TrendingUp size={28} style={{ color: '#3B82F6' }} />
          </div>
          <div style={{ 
            fontSize: '32px', 
            fontWeight: '800', 
            color: 'white', 
            marginBottom: '8px',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            {habits.length}
          </div>
          <div style={{ 
            fontSize: '16px', 
            color: 'rgba(255, 255, 255, 0.8)',
            fontWeight: '500'
          }}>
            Faol odatlar
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.15) 100%)',
          borderRadius: '20px',
          padding: '25px',
          border: '1px solid rgba(245, 158, 11, 0.2)',
          textAlign: 'center',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(245, 158, 11, 0.1)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(245, 158, 11, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0px)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(245, 158, 11, 0.1)';
        }}
        >
          <div style={{ 
            background: 'rgba(245, 158, 11, 0.2)',
            borderRadius: '15px',
            padding: '15px',
            display: 'inline-block',
            marginBottom: '15px'
          }}>
            <Clock size={28} style={{ color: '#F59E0B' }} />
          </div>
          <div style={{ 
            fontSize: '32px', 
            fontWeight: '800', 
            color: 'white', 
            marginBottom: '8px',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            {habitLogs.filter(log => log.status === 'partial').length}
          </div>
          <div style={{ 
            fontSize: '16px', 
            color: 'rgba(255, 255, 255, 0.8)',
            fontWeight: '500'
          }}>
            Qisman bajarilgan
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.15) 100%)',
          borderRadius: '20px',
          padding: '25px',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          textAlign: 'center',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(239, 68, 68, 0.1)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(239, 68, 68, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0px)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(239, 68, 68, 0.1)';
        }}
        >
          <div style={{ 
            background: 'rgba(239, 68, 68, 0.2)',
            borderRadius: '15px',
            padding: '15px',
            display: 'inline-block',
            marginBottom: '15px'
          }}>
            <XCircle size={28} style={{ color: '#EF4444' }} />
          </div>
          <div style={{ 
            fontSize: '32px', 
            fontWeight: '800', 
            color: 'white', 
            marginBottom: '8px',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            {habitLogs.filter(log => log.status === 'not_done').length}
          </div>
          <div style={{ 
            fontSize: '16px', 
            color: 'rgba(255, 255, 255, 0.8)',
            fontWeight: '500'
          }}>
            Bajarilmagan
          </div>
        </div>
      </div>

      {/* Odatlar ro'yxati */}
      {habits.length > 0 && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '20px',
          padding: '30px',
          marginTop: '40px',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
        }}>
          <h3 style={{ 
            fontSize: '22px', 
            fontWeight: '700', 
            color: 'white', 
            marginBottom: '25px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '10px',
              padding: '8px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <List size={20} style={{ color: 'white' }} />
            </div>
            Kuzatilayotgan odatlar
          </h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '20px' 
          }}>
            {habits.map((habit, index) => (
              <div key={habit.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                padding: '18px',
                background: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '15px',
                border: `1px solid ${colors[index % colors.length]}30`,
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 8px 25px ${colors[index % colors.length]}20`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0px)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                <div style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: colors[index % colors.length],
                  boxShadow: `0 0 10px ${colors[index % colors.length]}50`,
                  flexShrink: 0
                }}></div>
                <span style={{ 
                  color: 'white', 
                  fontSize: '16px',
                  fontWeight: '500',
                  flex: 1
                }}>{habit.name}</span>
                <div style={{
                  background: `${colors[index % colors.length]}20`,
                  color: colors[index % colors.length],
                  padding: '4px 8px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  #{index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatisticsPage;