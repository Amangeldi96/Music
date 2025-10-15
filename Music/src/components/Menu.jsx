import React, { useEffect, useState } from "react";
import './css/menu.css';
import './css/popup.css';
import { NavLink, useNavigate } from "react-router-dom";
import login from './img/Frame.svg';
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

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

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserEmail(user.email);
      } else {
        setIsLoggedIn(false);
        setUserEmail('');
      }
    });

    return () => unsubscribe();
  }, []);

  // Обработка входа
  const handleLogin = () => {
    if (!loginEmail || !loginPassword) {
      setLoginMessage('❌ Заполните все поля');
      return;
    }

    signInWithEmailAndPassword(auth, loginEmail, loginPassword)
      .then(() => {
        setLoginMessage('✅ Вход выполнен');
        const checkbox = document.getElementById("p1");
        if (checkbox) checkbox.checked = false;
        setLoginEmail('');
        setLoginPassword('');
      })
      .catch((error) => {
        if (error.code === 'auth/user-not-found') {
          setLoginMessage('❌ Вы не зарегистрированы');
        } else if (error.code === 'auth/wrong-password') {
          setLoginMessage('❌ Неверный пароль');
        } else if (error.code === 'auth/invalid-email') {
          setLoginMessage('❌ Неверный формат email');
        } else {
          setLoginMessage(`❌ Ошибка: ${error.message}`);
        }
      });
  };

  // Обработка выхода
  const handleLogout = () => {
    signOut(auth).then(() => {
      const checkbox = document.getElementById("p1");
      if (checkbox) checkbox.checked = false;
      setLoginEmail('');
      setLoginPassword('');
      setLoginMessage('');
    });
  };

  return (
    <div className="center">
      <div className="container">
        <h2 className="logo">Music</h2>
        <nav>
          <NavLink to="/">Главный</NavLink>
          <NavLink to="/Album">Альбом</NavLink>
          <NavLink to="/Genre">Жанр</NavLink>
          {isLoggedIn && (
            <NavLink to="/profile" className="profile-direct">Профиль</NavLink>
          )}
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
