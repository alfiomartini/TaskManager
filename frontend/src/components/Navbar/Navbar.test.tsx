import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import Navbar from "./Navbar";

// Mock react-router-dom
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    BrowserRouter: ({ children }) => <div>{children}</div>,
    useNavigate: () => vi.fn(),
  };
});

describe("Navbar Component", () => {
  const renderNavbar = () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
  };

  it("renders Navbar component", () => {
    renderNavbar();
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("contains link to /tasks", () => {
    renderNavbar();
    expect(screen.getByText("Tasks")).toBeInTheDocument();
    expect(screen.getByText("Tasks").closest("a")).toHaveAttribute(
      "href",
      "/tasks"
    );
  });

  it("contains link to /signin", () => {
    renderNavbar();
    expect(screen.getByText("Sign In")).toBeInTheDocument();
    expect(screen.getByText("Sign In").closest("a")).toHaveAttribute(
      "href",
      "/signin"
    );
  });

  it("contains link to /signup", () => {
    renderNavbar();
    expect(screen.getByText("Sign Up")).toBeInTheDocument();
    expect(screen.getByText("Sign Up").closest("a")).toHaveAttribute(
      "href",
      "/signup"
    );
  });

  it("handles logout correctly", () => {
    renderNavbar();
    const logoutLink = screen.getByText("Logout");

    // Mock localStorage
    const removeItemSpy = vi.spyOn(Storage.prototype, "removeItem");
    const navigateSpy = vi.fn();
    vi.mock("react-router-dom", async () => {
      const actual = await vi.importActual("react-router-dom");
      return {
        ...actual,
        useNavigate: () => navigateSpy,
      };
    });

    fireEvent.click(logoutLink);

    expect(removeItemSpy).toHaveBeenCalledWith("token");
    expect(navigateSpy).toHaveBeenCalledWith("/signin");
  });
});
