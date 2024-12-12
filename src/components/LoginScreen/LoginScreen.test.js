import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import LoginScreen, { LOGIN_MUTATION } from "../LoginScreen";
import { MemoryRouter } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

jest.mock("../../context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("LoginScreen Component", () => {
  const mockLogin = jest.fn();

  const renderComponent = (mocks = []) => {
    render(
      <MockedProvider mocks={mocks}>
        <MemoryRouter>
          <LoginScreen />
        </MemoryRouter>
      </MockedProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({
      login: mockLogin,
    });
  });

  test("renders the login form", () => {
    renderComponent();

    expect(screen.getByText("E-mail")).toBeInTheDocument();
    expect(screen.getByText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument();
  });

  test("shows validation errors when fields are empty", async () => {
    renderComponent();

    fireEvent.click(screen.getByRole("button", { name: "Sign In" }));

    expect(await screen.findByText("Email is required.")).toBeInTheDocument();
  });

  test("shows validation error for invalid email", async () => {
    renderComponent();

    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "testemail" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "KTKwXm2grV4wHzW" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Sign In" }));

    expect(
      await screen.findByText("Please enter a valid email address.")
    ).toBeInTheDocument();
  });

  test("submits form and logs in successfully", async () => {
    const mocks = [
      {
        request: {
          query: LOGIN_MUTATION,
          variables: {
            email: "test@freshcells.de",
            password: "KTKwXm2grV4wHzW",
          },
        },
        result: {
          data: {
            login: {
              jwt: "fake-jwt-token",
            },
          },
        },
      },
    ];

    renderComponent(mocks);

    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "test@freshcells.de" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "KTKwXm2grV4wHzW" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Sign In" }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("fake-jwt-token");
      expect(mockNavigate).toHaveBeenCalledWith("/account");
    });
  });

  test("displays server error when login fails", async () => {
    const mocks = [
      {
        request: {
          query: LOGIN_MUTATION,
          variables: {
            email: "test@freshcell.de",
            password: "KTKwXm2grV4wHW",
          },
        },
        error: new Error("Incorrect email or password"),
      },
    ];

    renderComponent(mocks);

    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "test@freshcell.de" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "KTKwXm2grV4wHW" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Sign In" }));

    expect(
      await screen.findByText("Incorrect email or password. Please try again.")
    ).toBeInTheDocument();
  });
});
