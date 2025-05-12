import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginModal from "./LoginModal";
import axios from "axios";

// Mock axios
jest.mock("axios");

describe("LoginModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = "";
  });

  test("renders login modal with initial state", () => {
    const mockOnClose = jest.fn();
    const mockOnLoginSuccess = jest.fn();
    const mockOnSwitchToRegister = jest.fn();

    render(
      <LoginModal
        onClose={mockOnClose}
        onLoginSuccess={mockOnLoginSuccess}
        onSwitchToRegister={mockOnSwitchToRegister}
      />
    );

    expect(screen.getByText("Увійти до системи")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Пароль")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /увійти/i })).toBeInTheDocument();
    expect(
      screen.getByText("Немає акаунта? Зареєструватися")
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Неправильний email або пароль")
    ).not.toBeInTheDocument();
  });

  test("handles successful login", async () => {
    const mockOnClose = jest.fn();
    const mockOnLoginSuccess = jest.fn();
    const mockOnSwitchToRegister = jest.fn();

    axios.post.mockResolvedValueOnce({
      data: {
        access: "mock-access-token",
        refresh: "mock-refresh-token",
      },
    });

    render(
      <LoginModal
        onClose={mockOnClose}
        onLoginSuccess={mockOnLoginSuccess}
        onSwitchToRegister={mockOnSwitchToRegister}
      />
    );

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Пароль"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /увійти/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "https://web-app-backend-m6hf.onrender.com/api/login/",
        {
          email: "test@example.com",
          password: "password123",
        }
      );
    });
    await waitFor(() => {
      expect(localStorage.getItem("accessToken")).toBe("mock-access-token");
    });
    await waitFor(() => {
      expect(localStorage.getItem("refreshToken")).toBe("mock-refresh-token");
    });
    await waitFor(() => {
      expect(mockOnLoginSuccess).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  test("handles login failure", async () => {
    const mockOnClose = jest.fn();
    const mockOnLoginSuccess = jest.fn();
    const mockOnSwitchToRegister = jest.fn();

    axios.post.mockRejectedValueOnce(new Error("Invalid credentials"));

    render(
      <LoginModal
        onClose={mockOnClose}
        onLoginSuccess={mockOnLoginSuccess}
        onSwitchToRegister={mockOnSwitchToRegister}
      />
    );

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Пароль"), {
      target: { value: "wrongpassword" },
    });
    fireEvent.click(screen.getByRole("button", { name: /увійти/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Неправильний email або пароль")
      ).toBeInTheDocument();
    });
    expect(mockOnLoginSuccess).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test("switches to register", () => {
    const mockOnClose = jest.fn();
    const mockOnLoginSuccess = jest.fn();
    const mockOnSwitchToRegister = jest.fn();

    render(
      <LoginModal
        onClose={mockOnClose}
        onLoginSuccess={mockOnLoginSuccess}
        onSwitchToRegister={mockOnSwitchToRegister}
      />
    );

    fireEvent.click(screen.getByText("Немає акаунта? Зареєструватися"));

    expect(mockOnSwitchToRegister).toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test("closes modal", () => {
    const mockOnClose = jest.fn();
    const mockOnLoginSuccess = jest.fn();
    const mockOnSwitchToRegister = jest.fn();

    render(
      <LoginModal
        onClose={mockOnClose}
        onLoginSuccess={mockOnLoginSuccess}
        onSwitchToRegister={mockOnSwitchToRegister}
      />
    );

    const closeButton = screen
      .getAllByRole("button")
      .find((button) => button.className.includes("btn-close"));
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });
});
