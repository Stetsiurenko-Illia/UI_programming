import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Tasks from "./Tasks";
import api from "../api";

// Mock api
jest.mock("../api");

describe("Tasks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = "";
    // Mock localStorage to return null, disabling WebSocket
    Storage.prototype.getItem = jest.fn(() => null);
  });

  test("renders error state with no tasks", async () => {
    api.get
      .mockResolvedValueOnce({ data: [] }) // Mock empty tasks
      .mockResolvedValueOnce({ data: [] }); // Mock empty shared tasks

    render(<Tasks />);

    await waitFor(() => {
      expect(screen.getByText("Мої справи")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.getByText("Токен авторизації відсутній. Увійдіть у систему.")
      ).toBeInTheDocument();
    });
  });

  test("renders tasks and shared tasks", async () => {
    api.get
      .mockResolvedValueOnce({
        data: [
          {
            id: 1,
            title: "Task 1",
            description: "Description 1",
            completed: false,
          },
          {
            id: 2,
            title: "Task 2",
            description: "Description 2",
            completed: true,
          },
        ],
      }) // Mock tasks
      .mockResolvedValueOnce({
        data: [
          {
            id: 3,
            title: "Shared Task",
            description: "Shared Desc",
            shared_by: "User1",
          },
        ],
      }); // Mock shared tasks

    render(<Tasks />);

    await waitFor(() => {
      expect(screen.getByText("Task 1")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText("Description 1")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText("Task 2")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText("Description 2")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText("Shared Task")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText("(від User1)")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText("Shared Desc")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.getByText("Токен авторизації відсутній. Увійдіть у систему.")
      ).toBeInTheDocument();
    });
  });
});
