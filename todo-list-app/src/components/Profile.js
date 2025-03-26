import React, { useState, useEffect } from "react";
import api from "../api";
import "bootstrap/dist/css/bootstrap.min.css";

function Profile() {
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    gender: "",
    birth_date: "",
    avatar: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const BASE_URL = "https://web-app-backend-m6hf.onrender.com";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("api/profile/");
        setProfile(response.data);
        setLoading(false);
      } catch (err) {
        setError("Не вдалося завантажити профіль");
        setLoading(false);
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleAvatarChange = (e) => {
    setAvatarFile(e.target.files[0]);
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("username", profile.username);
      formData.append("email", profile.email);
      formData.append("gender", profile.gender);
      formData.append("birth_date", profile.birth_date);
      if (avatarFile) formData.append("avatar", avatarFile);

      const response = await api.put("api/profile/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setProfile(response.data);
      setAvatarFile(null);
      setEditMode(false);
    } catch (err) {
      setError("Не вдалося оновити профіль");
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="container mt-5 text-center">
        <h1>Мій профіль</h1>
        <p>Завантаження...</p>
      </div>
    );
  if (error)
    return (
      <div className="container mt-5 text-center">
        <h1>Мій профіль</h1>
        <div className="alert alert-danger">{error}</div>
      </div>
    );

  return (
    <div className=" h-100 container mt-5">
      <h1 className="text-center mb-4">Мій профіль</h1>
      <div className="row">
        <div className="col-md-4 text-center">
          <img
            src={
              profile.avatar
                ? `${BASE_URL}${profile.avatar}?t=${new Date().getTime()}`
                : "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
            }
            alt="Аватар користувача"
            className="img-fluid rounded-circle mb-3"
            style={{ maxWidth: "150px" }}
          />
          {editMode && (
            <div className="mb-3">
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </div>
          )}
        </div>
        <div className="col-md-8">
          {editMode ? (
            <div className="card p-4">
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Ім’я користувача
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  name="username"
                  value={profile.username}
                  onChange={handleInputChange}
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
                  name="email"
                  value={profile.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="gender" className="form-label">
                  Стать
                </label>
                <select
                  className="form-select"
                  id="gender"
                  name="gender"
                  value={profile.gender}
                  onChange={handleInputChange}
                >
                  <option value="">Оберіть стать</option>
                  <option value="M">Чоловік</option>
                  <option value="F">Жінка</option>
                  <option value="O">Інше</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="birth_date" className="form-label">
                  Дата народження
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="birth_date"
                  name="birth_date"
                  value={profile.birth_date}
                  onChange={handleInputChange}
                />
              </div>
              <button className="btn btn-primary" onClick={handleSave}>
                Зберегти
              </button>
              <button
                className="btn btn-secondary ms-2"
                onClick={() => setEditMode(false)}
              >
                Скасувати
              </button>
            </div>
          ) : (
            <div className="card p-4">
              <p>
                <strong>Ім’я користувача:</strong> {profile.username}
              </p>
              <p>
                <strong>Email:</strong> {profile.email}
              </p>
              <p>
                <strong>Стать:</strong>{" "}
                {profile.gender === "M"
                  ? "Чоловік"
                  : profile.gender === "F"
                  ? "Жінка"
                  : "Інше"}
              </p>
              <p>
                <strong>Дата народження:</strong> {profile.birth_date}
              </p>
              <button
                className="btn btn-primary"
                onClick={() => setEditMode(true)}
              >
                Редагувати
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
