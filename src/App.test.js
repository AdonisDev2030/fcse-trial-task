import React from "react";
import { render, screen, cleanup } from "./test-utils";
import App from "./App";

jest.mock("./components/AccountScreen", () => () => (
  <div>Account Information</div>
));
jest.mock("./components/LoginScreen", () => () => <div>Login</div>);

beforeEach(() => {
  localStorage.clear();
});

describe("App Component", () => {
  test("redirects to /login when not authenticated and accessing /account", () => {
    render(<App />, { route: "/account" });

    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });

  test("redirects to /account when authenticated and accessing /login", () => {
    localStorage.setItem("token", "test-token");

    render(<App />, { route: "/login" });

    expect(screen.getByText(/Account Information/i)).toBeInTheDocument();
  });

  test("redirects to appropriate page based on authentication status when accessing unknown route", () => {
    render(<App />, { route: "/unknown" });

    expect(screen.getByText(/Login/i)).toBeInTheDocument();

    cleanup();
    localStorage.setItem("token", "test-token");

    render(<App />, { route: "/unknown" });

    expect(screen.getByText(/Account Information/i)).toBeInTheDocument();
  });
});
