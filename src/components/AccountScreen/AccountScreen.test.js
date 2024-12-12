import React from "react";
import { fireEvent, render, screen, waitFor } from "../../test-utils";
import AccountScreen, { GET_DATA, GET_USER_QUERY } from "../AccountScreen";
import { MockedProvider } from "@apollo/client/testing";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../../context/AuthContext";
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n";

const mocks = [
  {
    request: {
      query: GET_DATA,
    },
    result: {
      data: {
        user: {
          id: "2",
          email: "test@freshcells.de",
          firstName: "FirstName",
          lastName: "LastName",
        },
      },
    },
  },
];

test("displays user information", async () => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <AuthProvider>
        <MemoryRouter>
          <I18nextProvider i18n={i18n}>
            <AccountScreen />
          </I18nextProvider>
        </MemoryRouter>
      </AuthProvider>
    </MockedProvider>
  );

  await waitFor(() => {
    expect(screen.getByText(/FirstName LastName/i)).toBeInTheDocument();
  });
});

test("handles loading state", () => {
  render(
    <MockedProvider mocks={[]} addTypename={false}>
      <AuthProvider>
        <MemoryRouter>
          <AccountScreen />
        </MemoryRouter>
      </AuthProvider>
    </MockedProvider>
  );

  expect(screen.getByAltText("fetching data")).toBeInTheDocument();
});

test("handles error state", async () => {
  const errorMocks = [
    {
      request: {
        query: GET_DATA,
      },
      error: new Error("An error occurred"),
    },
  ];

  render(
    <MockedProvider mocks={errorMocks} addTypename={false}>
      <AuthProvider>
        <MemoryRouter>
          <AccountScreen />
        </MemoryRouter>
      </AuthProvider>
    </MockedProvider>
  );

  await waitFor(() => {
    expect(
      screen.getByText(/Error fetching data. Please try again./i)
    ).toBeInTheDocument();
  });
});

test("switches language when a different option is selected", async () => {
  render(
    <MemoryRouter>
      <AccountScreen />
    </MemoryRouter>
  );

  const languageSelector = screen.getByLabelText("Language Selector");

  expect(languageSelector.value).toBe("en");

  fireEvent.change(languageSelector, { target: { value: "de" } });

  expect(languageSelector.value).toBe("de");

  expect(screen.getByText("Kontoinformationen")).toBeInTheDocument();
});
