import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegisterModal from "./RegisterModal";
import axios from "axios";

// Mock axios
jest.mock("axios");

describe("RegisterModal", () => {
  const mockOnClose = jest.fn();
  const mockOnSwitchToLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = "";
  });

  test("renders register modal correctly", () => {
    render(
      <RegisterModal
        onClose={mockOnClose}
        onSwitchToLogin={mockOnSwitchToLogin}
      />
    );

    expect(screen.getByText("Реєстрація")).toBeInTheDocument();
    expect(screen.getByLabelText("Ім’я користувача")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Пароль")).toBeInTheDocument();
    expect(screen.getByLabelText("Стать")).toBeInTheDocument();
    expect(screen.getByLabelText("Дата народження")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /зареєструватися/i })
    ).toBeInTheDocument();
    expect(screen.getByText("Вже є акаунт? Увійти")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "" })).toHaveClass("btn-close");
  });

  test("handles successful registration", async () => {
    axios.post.mockResolvedValueOnce({ data: { success: true } });

    render(
      <RegisterModal
        onClose={mockOnClose}
        onSwitchToLogin={mockOnSwitchToLogin}
      />
    );

    fireEvent.change(screen.getByLabelText("Ім’я користувача"), {
      target: { value: "NewUser" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "newuser@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Пароль"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText("Стать"), {
      target: { value: "M" },
    });
    fireEvent.change(screen.getByLabelText("Дата народження"), {
      target: { value: "1990-01-01" },
    });

    fireEvent.click(screen.getByRole("button", { name: /зареєструватися/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "https://web-app-backend-m6hf.onrender.com/api/register/",
        expect.any(FormData),
        { headers: { "Content-Type": "multipart/form-data" } }
      );
    });
    await waitFor(() => {
      expect(mockOnSwitchToLogin).toHaveBeenCalled();
    });
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test("switches to login", () => {
    render(
      <RegisterModal
        onClose={mockOnClose}
        onSwitchToLogin={mockOnSwitchToLogin}
      />
    );

    fireEvent.click(screen.getByText("Вже є акаунт? Увійти"));

    expect(mockOnSwitchToLogin).toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });
});
