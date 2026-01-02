import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut, ChevronDown, Info, Code } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ProfileModal from './ProfileModal';

const ProfileDropdown = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const dropdownRef = useRef(null);

  // User display name ni hisoblash
  const getDisplayName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    } else if (user?.first_name) {
      return user.first_name;
    } else if (user?.username) {
      return user.username;
    }
    return 'Foydalanuvchi';
  };

  const getDisplayEmail = () => {
    return user?.email || 'email@example.com';
  };

  // Tashqarida bosganda yopish
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    setShowProfileModal(true);
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <>
      <div className="profile-dropdown" ref={dropdownRef}>
        <button 
          className="profile-button"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="profile-avatar">
            <User size={18} />
          </div>
          <span className="profile-username">{getDisplayName()}</span>
          <ChevronDown 
            size={16} 
            style={{ 
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease'
            }} 
          />
        </button>

        {isOpen && (
          <div className="profile-menu">
            <div className="profile-menu-header">
              <div className="profile-avatar-large">
                <User size={24} />
              </div>
              <div>
                <div className="profile-menu-name">{getDisplayName()}</div>
                <div className="profile-menu-email">{getDisplayEmail()}</div>
              </div>
            </div>
            
            <div className="profile-menu-divider"></div>
            
            <button className="profile-menu-item" onClick={handleProfileClick}>
              <Settings size={16} />
              <span>Profil sozlamalari</span>
            </button>
            
            <div className="profile-menu-divider"></div>
            
            <button className="profile-menu-item logout" onClick={handleLogout}>
              <LogOut size={16} />
              <span>Chiqish</span>
            </button>
          </div>
        )}
      </div>

      {showProfileModal && (
        <ProfileModal
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </>
  );
};

export default ProfileDropdown;