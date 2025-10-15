import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/profile.css';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function Profile() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmail(user.email);
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
        setEmail('');
      }
    });

    return () => unsubscribe(); // очистка подписки
  }, []);

  const handleLogout = () => {
    signOut(auth).then(() => {
      setLoggedIn(false);
      setEmail('');
      navigate('/');
    });
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
