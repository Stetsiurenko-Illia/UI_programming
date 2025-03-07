import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function RegisterModal({ onClose, onSwitchToLogin }) {
  const [username, setUsername] = useState(""); // Змінено "name" на "username"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // Додано пароль
  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    try {
      const response = await axios.post(
        "https://wep-app.onrender.com/api/register/",
        {
          username,
          email,
          password,
          gender,
          birth_date: birthDate,
          // "avatar" опціональний, поки не додаємо
        }
      );
      console.log("Успішна реєстрація:", response.data);
      onSwitchToLogin(); // Перемикаємо на "Вхід" після реєстрації
    } catch (err) {
      setError("Помилка реєстрації");
      console.error(err);
    }
  };

  return (
    <div
      className="modal d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Реєстрація</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Ім’я користувача
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Пароль
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="gender" className="form-label">
                Стать
              </label>
              <select
                className="form-select"
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">Оберіть стать</option>
                <option value="male">Чоловік</option>
                <option value="female">Жінка</option>
                <option value="other">Інше</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="birthDate" className="form-label">
                Дата народження
              </label>
              <input
                type="date"
                className="form-control"
                id="birthDate"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-primary" onClick={handleRegister}>
              Зареєструватися
            </button>
            <button className="btn btn-link" onClick={onSwitchToLogin}>
              Вже є акаунт? Увійти
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterModal;
