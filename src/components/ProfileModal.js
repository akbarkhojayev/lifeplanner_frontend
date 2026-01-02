import React, { useState, useEffect } from 'react';
import { X, User, Lock, Save, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { profileAPI } from '../services/api';
import { LoadingButton, InlineLoader } from './Loaders';
import Portal from './Portal';

const ProfileModal = ({ onClose }) => {
  const { updateUser, updateBackgroundImage } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [backgroundUploading, setBackgroundUploading] = useState(false);

  // Profil ma'lumotlari
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    background_image_url: null
  });

  // Parol o'zgartirish
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Profil ma'lumotlarini yuklash
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await profileAPI.getProfile();
        const userData = response.data;
        setProfileData({
          username: userData.username || '',
          email: userData.email || '',
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          background_image_url: userData.background_image_url || null
        });
      } catch (error) {
        console.error('Profil ma\'lumotlarini olishda xatolik:', error);
        setError('Profil ma\'lumotlarini olishda xatolik yuz berdi');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await profileAPI.updateProfile({
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        email: profileData.email
      });

      if (response.data.success) {
        setSuccess('Profil muvaffaqiyatli yangilandi');
        if (updateUser) {
          updateUser(response.data.user);
        }
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.data.message || 'Profilni yangilashda xatolik yuz berdi');
      }
    } catch (error) {
      console.error('Profilni yangilashda xatolik:', error);
      setError(error.response?.data?.message || 'Profilni yangilashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (passwordData.new_password !== passwordData.confirm_password) {
      setError('Yangi parollar mos kelmaydi');
      setLoading(false);
      return;
    }

    if (passwordData.new_password.length < 8) {
      setError('Yangi parol kamida 8 ta belgidan iborat bo\'lishi kerak');
      setLoading(false);
      return;
    }

    try {
      const response = await profileAPI.changePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
        confirm_password: passwordData.confirm_password
      });

      if (response.data.success) {
        setPasswordData({
          current_password: '',
          new_password: '',
          confirm_password: ''
        });
        setSuccess('Parol muvaffaqiyatli o\'zgartirildi');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.data.message || 'Parolni o\'zgartirishda xatolik yuz berdi');
      }
    } catch (error) {
      console.error('Parolni o\'zgartirishda xatolik:', error);
      setError(error.response?.data?.message || 'Parolni o\'zgartirishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleBackgroundImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Rasm hajmi 5MB dan oshmasligi kerak');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Faqat JPEG, PNG va WebP formatdagi rasmlar qabul qilinadi');
      return;
    }

    setBackgroundUploading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('background_image', file);

      const response = await profileAPI.uploadBackgroundImage(formData);
      
      if (response.data.success) {
        setProfileData(prev => ({
          ...prev,
          background_image_url: response.data.background_image_url
        }));
        setSuccess('Orqa fon rasmi muvaffaqiyatli yuklandi');
        
        // Background ni yangilash
        updateBackgroundImage(response.data.background_image_url);
        
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.data.message || 'Rasm yuklashda xatolik yuz berdi');
      }
    } catch (error) {
      console.error('Background image yuklashda xatolik:', error);
      setError(error.response?.data?.message || 'Rasm yuklashda xatolik yuz berdi');
    } finally {
      setBackgroundUploading(false);
    }
  };

  const handleDeleteBackgroundImage = async () => {
    setBackgroundUploading(true);
    setError('');
    setSuccess('');

    try {
      const response = await profileAPI.deleteBackgroundImage();
      
      if (response.data.success) {
        setProfileData(prev => ({
          ...prev,
          background_image_url: null
        }));
        setSuccess('Orqa fon rasmi o\'chirildi');
        
        // Background ni o'chirish
        updateBackgroundImage(null);
        
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.data.message || 'Rasm o\'chirishda xatolik yuz berdi');
      }
    } catch (error) {
      console.error('Background image o\'chirishda xatolik:', error);
      setError(error.response?.data?.message || 'Rasm o\'chirishda xatolik yuz berdi');
    } finally {
      setBackgroundUploading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <Portal>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '600' }}>Profil sozlamalari</h2>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '5px' }}>
              <X size={24} />
            </button>
          </div>

          <div style={{ display: 'flex', marginBottom: '25px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <button className={`profile-tab ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
              <User size={16} />
              Profil
            </button>
            <button className={`profile-tab ${activeTab === 'background' ? 'active' : ''}`} onClick={() => setActiveTab('background')}>
              <User size={16} />
              Orqa fon
            </button>
            <button className={`profile-tab ${activeTab === 'password' ? 'active' : ''}`} onClick={() => setActiveTab('password')}>
              <Lock size={16} />
              Parol
            </button>
          </div>

          {error && <div className="error" style={{ marginBottom: '20px' }}>{error}</div>}
          {success && <div className="success" style={{ marginBottom: '20px' }}>{success}</div>}
          {loading && !error && !success && (
            <div style={{ marginBottom: '20px' }}>
              <InlineLoader text="Ma'lumotlar yuklanmoqda..." />
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit}>
              <div className="form-group">
                <label htmlFor="username">Foydalanuvchi nomi</label>
                <input
                  type="text"
                  id="username"
                  className="input"
                  value={profileData.username}
                  disabled
                  style={{ opacity: 0.6, cursor: 'not-allowed' }}
                />
                <small style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px' }}>
                  Foydalanuvchi nomini o'zgartirib bo'lmaydi
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  className="input"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group">
                  <label htmlFor="first_name">Ism</label>
                  <input
                    type="text"
                    id="first_name"
                    className="input"
                    value={profileData.first_name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, first_name: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="last_name">Familiya</label>
                  <input
                    type="text"
                    id="last_name"
                    className="input"
                    value={profileData.last_name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, last_name: e.target.value }))}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '25px' }}>
                <LoadingButton
                  type="submit"
                  className="btn btn-success"
                  loading={loading}
                  disabled={loading}
                >
                  <Save size={16} />
                  Saqlash
                </LoadingButton>
              </div>
            </form>
          )}

          {/* Background Tab */}
          {activeTab === 'background' && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '10px' }}>Joriy orqa fon</h3>
                {profileData.background_image_url ? (
                  <div style={{ 
                    width: '100%', 
                    height: '150px', 
                    backgroundImage: `url(${profileData.background_image_url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    marginBottom: '15px'
                  }}></div>
                ) : (
                  <div style={{ 
                    width: '100%', 
                    height: '150px', 
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    border: '1px dashed rgba(255, 255, 255, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '15px',
                    color: 'rgba(255, 255, 255, 0.6)'
                  }}>
                    Orqa fon rasmi yo'q
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="background-upload">Yangi orqa fon yuklash</label>
                <input
                  type="file"
                  id="background-upload"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleBackgroundImageUpload}
                  disabled={backgroundUploading}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '6px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white'
                  }}
                />
                <small style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px', display: 'block', marginTop: '5px' }}>
                  Maksimal hajm: 5MB. Qo'llab-quvvatlanadigan formatlar: JPEG, PNG, WebP
                </small>
              </div>

              {profileData.background_image_url && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                  <LoadingButton
                    type="button"
                    className="btn btn-danger"
                    loading={backgroundUploading}
                    disabled={backgroundUploading}
                    onClick={handleDeleteBackgroundImage}
                  >
                    Orqa fonni o'chirish
                  </LoadingButton>
                </div>
              )}
            </div>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label htmlFor="current_password">Joriy parol</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    id="current_password"
                    className="input"
                    value={passwordData.current_password}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, current_password: e.target.value }))}
                    required
                    style={{ paddingRight: '45px' }}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'rgba(255, 255, 255, 0.7)',
                      cursor: 'pointer'
                    }}
                  >
                    {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="new_password">Yangi parol</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    id="new_password"
                    className="input"
                    value={passwordData.new_password}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, new_password: e.target.value }))}
                    required
                    style={{ paddingRight: '45px' }}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'rgba(255, 255, 255, 0.7)',
                      cursor: 'pointer'
                    }}
                  >
                    {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirm_password">Yangi parolni tasdiqlash</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    id="confirm_password"
                    className="input"
                    value={passwordData.confirm_password}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirm_password: e.target.value }))}
                    required
                    style={{ paddingRight: '45px' }}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'rgba(255, 255, 255, 0.7)',
                      cursor: 'pointer'
                    }}
                  >
                    {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '25px' }}>
                <LoadingButton
                  type="submit"
                  className="btn btn-success"
                  loading={loading}
                  disabled={loading}
                >
                  <Save size={16} />
                  Parolni o'zgartirish
                </LoadingButton>
              </div>
            </form>
          )}
        </div>
      </div>
    </Portal>
  );
};

export default ProfileModal;