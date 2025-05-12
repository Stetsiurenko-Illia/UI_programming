import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import About from "./About";
import api from "../api";

jest.mock("../api");

describe("About", () => {
  const mockAboutData = {
    logo: "https://example.com/logo.png",
    description: "A simple To-Do List app.",
    features: ["Create tasks", "Share tasks", "Manage profile"],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    api.get.mockResolvedValue({ data: mockAboutData });
  });

  test("renders loading state", () => {
    render(<About />);
    expect(screen.getByText("Завантаження...")).toBeInTheDocument();
  });

  test("renders about data correctly", async () => {
    render(<About />);

    await waitFor(() => {
      expect(screen.getByText("Про додаток")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByRole("img", { name: /Логотип додатку/i })
      ).toHaveAttribute("src", mockAboutData.logo);
    });

    await waitFor(() => {
      expect(screen.getByText(mockAboutData.description)).toBeInTheDocument();
      mockAboutData.features.forEach((feature) => {
        expect(screen.getByText(feature)).toBeInTheDocument();
      });
    });
  });

  test("displays error state", async () => {
    api.get.mockRejectedValue(new Error("Failed to fetch"));

    render(<About />);

    await waitFor(() => {
      expect(
        screen.getByText("Не вдалося завантажити інформацію про додаток")
      ).toBeInTheDocument();
    });
  });

  test("handles logo load error", async () => {
    render(<About />);

    await waitFor(() => {
      expect(
        screen.getByRole("img", { name: /Логотип додатку/i })
      ).toBeInTheDocument();
    });

    const img = screen.getByRole("img", { name: /Логотип додатку/i });
    fireEvent.error(img);

    expect(img).toHaveAttribute("src", "https://picsum.photos/150");
  });

  test("renders without features", async () => {
    api.get.mockResolvedValue({ data: { ...mockAboutData, features: [] } });

    render(<About />);

    await waitFor(() => {
      expect(
        screen.queryByText("Що ви можете зробити:")
      ).not.toBeInTheDocument();
    });
  });
});
