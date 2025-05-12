import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EditTaskModal from "./EditTaskModal";
import api from "../api";

jest.mock("../api");

describe("EditTaskModal", () => {
  const mockOnSave = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = "";
  });

  test("renders edit task modal correctly", async () => {
    api.get.mockResolvedValue({
      data: { id: 1, title: "Task 1", description: "Desc 1" },
    });

    render(
      <EditTaskModal taskId={1} onSave={mockOnSave} onCancel={mockOnCancel} />
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Заголовок")).toHaveValue("Task 1");
    });

    await waitFor(() => {
      expect(screen.getByLabelText("Опис")).toHaveValue("Desc 1");
    });

    expect(screen.getByText("Редагувати задачу")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Зберегти" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Скасувати" })
    ).toBeInTheDocument();
  });

  test("calls onSave with updated task data", async () => {
    api.get.mockResolvedValue({
      data: { id: 1, title: "Task 1", description: "Desc 1" },
    });
    api.patch.mockResolvedValue({
      data: { id: 1, title: "Updated Task", description: "Updated Desc" },
    });

    render(
      <EditTaskModal taskId={1} onSave={mockOnSave} onCancel={mockOnCancel} />
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Заголовок")).toHaveValue("Task 1");
    });

    fireEvent.change(screen.getByLabelText("Заголовок"), {
      target: { value: "Updated Task" },
    });
    fireEvent.change(screen.getByLabelText("Опис"), {
      target: { value: "Updated Desc" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Зберегти" }));

    await waitFor(() => {
      expect(api.patch).toHaveBeenCalledWith("api/tasks/1/", {
        id: 1,
        title: "Updated Task",
        description: "Updated Desc",
      });
    });

    expect(mockOnSave).toHaveBeenCalledWith(1, {
      id: 1,
      title: "Updated Task",
      description: "Updated Desc",
    });
  });

  test("calls onCancel when cancel button is clicked", async () => {
    api.get.mockResolvedValue({
      data: { id: 1, title: "Task 1", description: "Desc 1" },
    });

    render(
      <EditTaskModal taskId={1} onSave={mockOnSave} onCancel={mockOnCancel} />
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Заголовок")).toHaveValue("Task 1");
    });

    fireEvent.click(screen.getByRole("button", { name: "Скасувати" }));

    expect(mockOnCancel).toHaveBeenCalled();
  });

  test("displays error when fetching task fails", async () => {
    api.get.mockRejectedValue(new Error("Fetch error"));

    jest.spyOn(console, "error").mockImplementation(() => {});

    render(
      <EditTaskModal taskId={1} onSave={mockOnSave} onCancel={mockOnCancel} />
    );

    await waitFor(() => {
      expect(
        screen.getByText("Не вдалося завантажити задачу. Спробуйте ще раз.")
      ).toBeInTheDocument();
    });

    console.error.mockRestore();
  });
});
