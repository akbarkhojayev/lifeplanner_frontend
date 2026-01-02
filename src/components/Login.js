import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoadingButton } from './Loaders';
import { User, Lock, LogIn } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, token } = useAuth();

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);
    
    if (!result.success) {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="login-container">
      <form className="login-form glass-effect" onSubmit={handleSubmit}>
        <h1 className="login-title">Odatlar Kalendari</h1>
        <p className="text-center" style={{ opacity: 0.8, marginBottom: '30px' }}>
          Har bir odat uchun qiliq taraqqiyoti va odatlarni
        </p>
        
        {error && (
          <div className="error">
            {error}
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="username">
            <User size={16} style={{ display: 'inline', marginRight: '8px' }} />
            Foydalanuvchi nomi
          </label>
          <input
            type="text"
            id="username"
            className="input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Foydalanuvchi nomingizni kiriting"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">
            <Lock size={16} style={{ display: 'inline', marginRight: '8px' }} />
            Parol
          </label>
          <input
            type="password"
            id="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Parolingizni kiriting"
            required
          />
        </div>
        
        <div className="form-actions">
          <LoadingButton
            type="submit" 
            className="btn btn-primary"
            loading={loading}
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <LogIn size={16} />
            Kirish
          </LoadingButton>
        </div>
        
        <div className="text-center" style={{ marginTop: '20px' }}>
          <p style={{ fontSize: '14px', opacity: '0.8' }}>
            Demo uchun: admin / admin
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;