import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import "bootstrap/dist/css/bootstrap.min.css";

function Header({ onLogout }) {
  const [logo, setLogo] = useState("https://via.placeholder.com/40");

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await api.get("api/about/");
        setLogo(response.data.logo);
      } catch (err) {
        console.error("Не вдалося завантажити логотип:", err);
      }
    };
    fetchLogo();
  }, []);

  return (
    <nav className="navbar navbar-expand-md navbar-light bg-light fixed-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center me-3" to="/">
          <img
            src={logo}
            alt="Логотип"
            style={{ height: "40px", marginRight: "10px" }}
            onError={(e) => (e.target.src = "https://via.placeholder.com/30")}
          />
          <span className="d-none d-md-inline">To-do List</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav w-100 nav-fill me-3">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Головна
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">
                Про додаток
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/tasks">
                Завдання
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/profile">
                Профіль
              </Link>
            </li>
          </ul>
          <ul className="navbar-nav ms-auto nav-fill">
            <li className="nav-item">
              <button className="btn btn-danger btn-sm" onClick={onLogout}>
                Вийти
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
