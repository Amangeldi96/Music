import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/profile.css';

export default function Profile() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const savedEmail = localStorage.getItem('loggedEmail');

    if (isLoggedIn === 'true' && savedEmail) {
      setEmail(savedEmail);
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('loggedEmail');

    // 🔄 Обновляем страницу, чтобы Menu.jsx тоже сбросился
    navigate('/');
    window.location.reload();
  };

  if (!loggedIn) {
    return <p style={{ padding: '20px' }}>Вы не вошли в систему.</p>;
  }

  return (
    <div className="profile-container">
      <h2>Мой профиль</h2>
      <p><strong>Email:</strong> {email}</p>
      <button className="logout-btn" onClick={handleLogout}>Выйти</button>
    </div>
  );
}