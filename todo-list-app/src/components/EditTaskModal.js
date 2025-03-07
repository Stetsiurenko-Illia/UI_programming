import React, { useState, useEffect } from "react";
import api from "../api";
import "bootstrap/dist/css/bootstrap.min.css";

function EditTaskModal({ taskId, onSave, onCancel }) {
  const [task, setTask] = useState({ title: "", description: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await api.get(`api/tasks/${taskId}/`);
        setTask(response.data);
      } catch (err) {
        setError("Не вдалося завантажити задачу. Спробуйте ще раз.");
        console.error("Помилка завантаження задачі:", err);
      }
    };
    fetchTask();
  }, [taskId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await api.patch(`api/tasks/${taskId}/`, task);
      onSave(taskId, task); 
    } catch (err) {
      setError("Не вдалося оновити задачу. Перевірте дані.");
      console.error("Помилка оновлення:", err);
    }
  };

  return (
    <div className="modal show" style={{ display: "block" }} tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Редагувати задачу</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onCancel}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Заголовок
              </label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                value={task.title}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Опис
              </label>
              <textarea
                className="form-control"
                id="description"
                name="description"
                value={task.description || ""}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
            >
              Скасувати
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
            >
              Зберегти
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditTaskModal;
