import React, { useEffect, useState } from "react";
import './css/menu.css';
import './css/popup.css';
import { NavLink, useNavigate } from "react-router-dom";
import login from './img/Frame.svg';

export default function Menu() {
  const navigate = useNavigate();

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  // Проверка входа при загрузке
  useEffect(() => {
    const checkbox = document.getElementById("p1");
    if (checkbox) checkbox.checked = false;

    const loginFlag = localStorage.getItem('isLoggedIn');
    const savedEmail = localStorage.getItem('loggedEmail');
    if (loginFlag === 'true' && savedEmail) {
      setIsLoggedIn(true);
      setUserEmail(savedEmail);
    }
  }, []);

  // Обработка входа
  const handleLogin = () => {
    const savedEmail = localStorage.getItem('regEmail');
    const savedPassword = localStorage.getItem('regPassword');

    if (!savedEmail || !savedPassword) {
      setLoginMessage('❌ Вы не зарегистрированы');
      return;
    }

    if (loginEmail === savedEmail && loginPassword === savedPassword) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('loggedEmail', loginEmail);
      setIsLoggedIn(true);
      setUserEmail(loginEmail);
      setLoginMessage('✅ Вход выполнен');

      // 🔄 Перезагрузка страницы после входа
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } else {
      setLoginMessage('❌ Неверный email или пароль');
    }
  };

  // Обработка выхода
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('loggedEmail');

    const checkbox = document.getElementById("p1");
    if (checkbox) checkbox.checked = false;

    setIsLoggedIn(false);
    setUserEmail('');
    setLoginEmail('');
    setLoginPassword('');
    setLoginMessage('');

    // 🔄 Перезагрузка страницы после выхода
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
                    placeholder="Email или телефон"
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