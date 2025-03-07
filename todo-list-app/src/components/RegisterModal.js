import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function RegisterModal({ onClose, onSwitchToLogin }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username.trim() || !email.trim() || !password.trim()) {
      setError(
        "Заповніть усі обов’язкові поля: ім’я користувача, email та пароль."
      );
      return;
    }

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      if (gender) formData.append("gender", gender); 
      if (birthDate) formData.append("birth_date", birthDate);

      const response = await axios.post(
        "https://wep-app.onrender.com/api/register/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Успішна реєстрація:", response.data);
      onSwitchToLogin();
    } catch (err) {
      console.error("Помилка реєстрації:", err.response?.data || err.message);
      setError(
        err.response?.data?.email?.[0] ||
          err.response?.data?.username?.[0] ||
          err.response?.data?.password?.[0] || 
          err.response?.data?.non_field_errors?.[0] ||
          "Не вдалося зареєструватися. Перевірте дані."
      );
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
            <form onSubmit={handleRegister}>
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
                  required
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
                  required
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
                  required
                  minLength="6" 
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
                  <option value="M">Чоловік</option>
                  <option value="F">Жінка</option>
                  <option value="O">Інше</option>
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
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">
                  Зареєструватися
                </button>
                <button
                  type="button"
                  className="btn btn-link"
                  onClick={onSwitchToLogin}
                >
                  Вже є акаунт? Увійти
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterModal;
