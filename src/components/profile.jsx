import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/profile.css';
import { supabase } from '../SupabaseClient';

export default function Profile() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setEmail(session.user.email);
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    };

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setEmail(session.user.email);
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
        setEmail('');
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
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