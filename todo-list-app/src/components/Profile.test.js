import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Profile from "./Profile";
import api from "../api";

// Mock api
jest.mock("../api");

describe("Profile", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = "";
    // Mock localStorage (if needed for token authentication)
    Storage.prototype.getItem = jest.fn(() => "mock-token");
  });

  test("renders profile with initial data", async () => {
    api.get.mockResolvedValueOnce({
      data: {
        username: "TestUser",
        email: "test@example.com",
        gender: "M",
        birth_date: "1990-01-01",
        avatar: "/default-avatar.jpg",
      },
    });

    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText("Мій профіль")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.getByText("Ім’я користувача:", { exact: false })
      ).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.getByText("TestUser", { exact: false })
      ).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText("Email:", { exact: false })).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.getByText("test@example.com", { exact: false })
      ).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText("Стать:", { exact: false })).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText("Чоловік", { exact: false })).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.getByText("Дата народження:", { exact: false })
      ).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.getByText("1990-01-01", { exact: false })
      ).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /редагувати/i })
      ).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByAltText("Аватар користувача").src).toContain(
        "/default-avatar.jpg"
      );
    });
  });
});
