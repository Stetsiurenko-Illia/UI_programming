import React, { useState, useEffect } from "react";
import api from "../api";
import "bootstrap/dist/css/bootstrap.min.css";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [sharedTasks, setSharedTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTask, setEditedTask] = useState({ title: "", description: "" });
  const [sharingTaskId, setSharingTaskId] = useState(null); 
  const [shareEmail, setShareEmail] = useState(""); 
  const [ws, setWs] = useState(null);

  // Ініціалізація WebSocket і завантаження завдань
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get("api/tasks/");
        setTasks(response.data);
        const sharedResponse = await api.get("api/shared-tasks/");
        setSharedTasks(sharedResponse.data);
        setLoading(false);
      } catch (err) {
        setError("Не вдалося завантажити завдання");
        setLoading(false);
        console.error(err);
      }
    };
    fetchTasks();

    // Налаштування WebSocket
    const token = localStorage.getItem("access_token"); 
    const socket = new WebSocket(
      `ws://localhost:8000/ws/tasks/?token=${token}`
    );
    setWs(socket);

    socket.onopen = () => console.log("WebSocket з'єднано");
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.action === "share_task") {
        const sharedTask = data.task;
        setSharedTasks((prev) => [
          ...prev,
          { ...sharedTask, shared_by: sharedTask.user },
        ]);
      }
    };
    socket.onerror = (err) => console.error("WebSocket помилка:", err);
    socket.onclose = () => console.log("WebSocket закрито");

    return () => socket.close();
  }, []);

  const handleAddTask = async () => {
    if (!title.trim() || !description.trim()) {
      setError("Заголовок і опис не можуть бути порожніми");
      return;
    }
    try {
      setError("");
      const response = await api.post("api/tasks/", {
        title,
        description,
        completed: false,
      });
      setTasks([...tasks, response.data]);
      setTitle("");
      setDescription("");
      if (ws) {
        ws.send(
          JSON.stringify({
            action: "create_task",
            title,
            description,
            completed: false,
          })
        );
      }
    } catch (err) {
      setError("Не вдалося додати завдання");
      console.error(err);
    }
  };

  const handleToggleComplete = async (taskId, currentStatus) => {
    try {
      const response = await api.put(`api/tasks/${taskId}/`, {
        completed: !currentStatus,
      });
      setTasks(
        tasks.map((task) =>
          task.id === taskId
            ? { ...task, completed: response.data.completed }
            : task
        )
      );
    } catch (err) {
      setError("Не вдалося оновити статус задачі");
      console.error(err);
    }
  };

  const handleEdit = (taskId) => {
    const taskToEdit = tasks.find((task) => task.id === taskId);
    if (taskToEdit) {
      setEditedTask({
        title: taskToEdit.title,
        description: taskToEdit.description,
      });
      setEditingTaskId(taskId);
    }
  };

  const handleSaveEdit = async () => {
    if (!editedTask.title.trim()) {
      setError("Заголовок не може бути порожнім");
      return;
    }
    try {
      setError("");
      const response = await api.put(`api/tasks/${editingTaskId}/`, editedTask);
      setTasks(
        tasks.map((task) => (task.id === editingTaskId ? response.data : task))
      );
      setEditingTaskId(null);
      setEditedTask({ title: "", description: "" });
    } catch (err) {
      setError("Не вдалося оновити задачу");
      console.error(err);
    }
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditedTask({ title: "", description: "" });
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await api.delete(`api/tasks/${taskId}/`);
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (err) {
      setError("Не вдалося видалити задачу");
      console.error(err);
    }
  };

  const handleShareClick = (taskId) => {
    setSharingTaskId(sharingTaskId === taskId ? null : taskId);
    setShareEmail("");
  };

  const handleShareSubmit = (taskId) => {
    if (!shareEmail.trim()) {
      setError("Введіть email");
      return;
    }
    if (ws) {
      ws.send(
        JSON.stringify({
          action: "share_task",
          task_id: taskId,
          email: shareEmail,
        })
      );
      setSharingTaskId(null);
      setShareEmail("");
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => a.completed - b.completed);

  if (loading)
    return (
      <div className="container mt-5 text-center">
        <h1>Мої справи</h1>
        <p>Завантаження...</p>
      </div>
    );
  if (error && !tasks.length)
    return (
      <div className="container mt-5 text-center">
        <h1>Мої справи</h1>
        <div className="alert alert-danger">{error}</div>
      </div>
    );

  return (
    <div className="h-100 container mt-5">
      <h1 className="text-center mb-4">Мої справи</h1>
      {error && <div className="alert alert-danger mb-4">{error}</div>}
      <div className="mb-4">
        <div className="input-group mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Заголовок"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="input-group mb-2">
          <textarea
            className="form-control"
            placeholder="Опис"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="mb-4 d-flex justify-content-end">
          <button className="btn btn-primary btn-sm" onClick={handleAddTask}>
            Додати
          </button>
        </div>
      </div>

      <h2>Мої завдання</h2>
      <ul className="list-group mb-4">
        {sortedTasks.length === 0 ? (
          <li className="list-group-item text-center">Немає задач</li>
        ) : (
          sortedTasks.map((task) => (
            <li key={task.id} className="list-group-item position-relative">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="d-flex align-items-center">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() =>
                      handleToggleComplete(task.id, task.completed)
                    }
                    className="me-2"
                  />
                  <strong>{task.title}</strong>
                </div>
                <div className="d-flex">
                  <button
                    className="btn btn-outline-warning btn-sm me-2"
                    onClick={() => handleEdit(task.id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                    </svg>
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm me-2"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M5.5 5.5A.5.5 0 0 1 6 5v6a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V5z" />
                      <path
                        fillRule="evenodd"
                        d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                      />
                    </svg>
                  </button>
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => handleShareClick(task.id)}
                  >
                    ➤
                  </button>
                </div>
              </div>
              <p className="mb-0 ms-4">{task.description}</p>
              {sharingTaskId === task.id && (
                <div className="mt-2 ms-4">
                  <div className="input-group">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Введіть email"
                      value={shareEmail}
                      onChange={(e) => setShareEmail(e.target.value)}
                    />
                    <button
                      className="btn btn-outline-success"
                      onClick={() => handleShareSubmit(task.id)}
                    >
                      ✈
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))
        )}
      </ul>

      <h2>Поширені завдання</h2>
      <ul className="list-group">
        {sharedTasks.length === 0 ? (
          <li className="list-group-item text-center">Немає поширених задач</li>
        ) : (
          sharedTasks.map((task) => (
            <li key={task.id} className="list-group-item">
              <strong>{task.title}</strong> (від {task.shared_by})
              <p className="mb-0 ms-4">{task.description}</p>
            </li>
          ))
        )}
      </ul>

      {editingTaskId && (
        <div className="modal show" style={{ display: "block" }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Редагувати задачу</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCancelEdit}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="mb-3">
                  <label htmlFor="edit-title" className="form-label">
                    Заголовок
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="edit-title"
                    value={editedTask.title}
                    onChange={(e) =>
                      setEditedTask({ ...editedTask, title: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="edit-description" className="form-label">
                    Опис
                  </label>
                  <textarea
                    className="form-control"
                    id="edit-description"
                    value={editedTask.description}
                    onChange={(e) =>
                      setEditedTask({
                        ...editedTask,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancelEdit}
                >
                  Скасувати
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveEdit}
                >
                  Зберегти
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tasks;
