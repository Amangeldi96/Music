import React, { useEffect, useState } from "react";
import './css/menu.css';
import './css/popup.css';
import { NavLink, useNavigate } from "react-router-dom";
import login from './img/Frame.svg';
import { supabase } from "../SupabaseClient";

export default function Menu() {
  const navigate = useNavigate();

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  // Проверка сессии при загрузке
  useEffect(() => {
    const checkbox = document.getElementById("p1");
    if (checkbox) checkbox.checked = false;

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsLoggedIn(true);
        setUserEmail(session.user.email);
      }
    };

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsLoggedIn(true);
        setUserEmail(session.user.email);
      } else {
        setIsLoggedIn(false);
        setUserEmail('');
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Обработка входа
  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });

    if (error) {
      setLoginMessage('❌ Неверный email или пароль');
    } else {
      setLoginMessage('✅ Вход выполнен');
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  // Обработка выхода
  const handleLogout = async () => {
    await supabase.auth.signOut();

    const checkbox = document.getElementById("p1");
    if (checkbox) checkbox.checked = false;

    setIsLoggedIn(false);
    setUserEmail('');
    setLoginEmail('');
    setLoginPassword('');
    setLoginMessage('');
    window.location.reload();
  };

  return (
    <div className="center">
      <div className="container">
        <h2 className="logo">Music</h2>
        <nav>
          <NavLink to="/">Главный</NavLink>
          <NavLink to="/Album">Альбом</NavLink>
          <NavLink to="/Genre">Жанр</NavLink>
        </nav>

        {/* Кнопка входа */}
        <input type="checkbox" className="hide" id="p1" />
        <label htmlFor="p1" className="button">
          <img src={login} alt="Вход" />
        </label>

        {/* Попап входа */}
        <div id="popup1" className="overlay">
          <div className="popup">
            <h2>{isLoggedIn ? 'Добро пожаловать!' : 'Войти'}</h2>
            <label htmlFor="p1" className="close">&times;</label>
            <div className="content-vxod">
              {!isLoggedIn ? (
                <>
                  <input
                    type="text"
                    placeholder="Email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  /> <br />
                  <input
                    type="password"
                    placeholder="Пароль"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  /> <br />
                  <button className="vxod" onClick={handleLogin}>Войти</button>
                  {loginMessage && <p className="login-message">{loginMessage}</p>}

                  <div className="b-block">
                    <div className="g-block">
                      <p className="text-b">У меня нет аккаунта</p>
                      <NavLink className="regs" to="/Regstr">Регистрация</NavLink>
                    </div>
                    <div className="g-block">
                      <label htmlFor="p1" className="button butn3">Забыл пароль</label>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <p><strong>Email:</strong> {userEmail}</p>
                  <NavLink
                    to="/profile"
                    className="profile-link"
                    onClick={() => {
                      const checkbox = document.getElementById("p1");
                      if (checkbox) checkbox.checked = false;
                    }}
                  >
                    Профиль
                  </NavLink>
                  <button className="logout-btn" onClick={handleLogout}>Выйти</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}