import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './css/regstr.css';
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function Regstr() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = () => {
    if (!email || !password || !repeatPassword) {
      setMessage('❌ Заполните все поля');
      return;
    }

    if (password !== repeatPassword) {
      setMessage('❌ Пароли не совпадают');
      return;
    }

    if (password.length < 6) {
      setMessage('❌ Пароль должен быть минимум 6 символов');
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        setMessage('✅ Регистрация прошла успешно!');
        setEmail('');
        setPassword('');
        setRepeatPassword('');
        navigate('/profile');
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          setMessage('❌ Этот email уже зарегистрирован');
        } else if (error.code === 'auth/invalid-email') {
          setMessage('❌ Неверный формат email');
        } else if (error.code === 'auth/weak-password') {
          setMessage('❌ Пароль слишком слабый (минимум 6 символов)');
        } else {
          setMessage(`❌ Ошибка: ${error.message}`);
        }
      });
  };

  return (
    <div className="block-chek">
      <h1 className="h1">Регистрация</h1>
      <p className="p1">Music.kg</p>

      <input
        className="input"
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /> <br />

      <input
        className="input"
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /> <br />

      <input
        className="input"
        type="password"
        placeholder="Повторите пароль"
        value={repeatPassword}
        onChange={(e) => setRepeatPassword(e.target.value)}
      /> <br />

      <button className="vx" onClick={handleRegister}>Регистрация</button>

      {message && <p className="reg-message">{message}</p>}
    </div>
  );
}
