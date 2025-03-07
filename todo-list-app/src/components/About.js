import React, { useState, useEffect } from "react";
import api from "../api";
import "bootstrap/dist/css/bootstrap.min.css";

function About() {
  const [aboutData, setAboutData] = useState({
    logo: "",
    description: "",
    features: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await api.get("api/about/");
        setAboutData(response.data);
        setLoading(false);
      } catch (err) {
        setError("Не вдалося завантажити інформацію про додаток");
        setLoading(false);
        console.error("Помилка завантаження даних:", err);
      }
    };
    fetchAboutData();
  }, []);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <h1>Про додаток</h1>
        <p>Завантаження...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5 text-center">
        <h1>Про додаток</h1>
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4 d-flex justify-content-center">Про додаток</h1>
      <div className="row">
        <div className="col-md-3 text-center mb-4 mb-md-0">
          {aboutData.logo && (
            <img
              src={aboutData.logo}
              alt="Логотип додатку"
              className="img-fluid"
              style={{ maxHeight: "150px" }}
              onError={(e) => {
                console.log("Помилка завантаження логотипу:", e.target.src);
                e.target.src = "https://picsum.photos/150";
              }}
            />
          )}
        </div>
        <div className="col-md-9">
          <p className="lead mb-4">
            <strong>To-Do List</strong> — ваш надійний помічник у щоденному
            плануванні!
          </p>
          <p>{aboutData.description}</p>
          <p className="mt-3">
            Наш додаток розроблений з урахуванням ваших потреб, пропонуючи
            інтуїтивно зрозумілий інтерфейс для управління завданнями. Незалежно
            від того, чи плануєте ви робочі проекти, чи просто хочете не забути
            про важливі справи, <strong>To-Do List</strong> допоможе вам
            залишатися на правильному шляху.
          </p>
          {aboutData.features && aboutData.features.length > 0 && (
            <>
              <h3 className="mt-4">Що ви можете зробити:</h3>
              <ul className="list-group list-group-flush mb-4">
                {aboutData.features.map((feature, index) => (
                  <li key={index} className="list-group-item">
                    {feature}
                  </li>
                ))}
              </ul>
            </>
          )}
          <p className="mt-4">
            Завдяки простоті використання та гнучкості, наш додаток підходить як
            для особистого, так і для командного планування. Починайте вже
            сьогодні і відчуйте переваги організованої роботи!
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
