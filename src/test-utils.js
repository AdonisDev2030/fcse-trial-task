import React from "react";
import { render as rtlRender } from "@testing-library/react";
import { AuthProvider } from "./context/AuthContext";
import { MockedProvider } from "@apollo/client/testing"; // Use MockedProvider instead of ApolloProvider

function render(ui, { mocks = [], ...renderOptions } = {}) {
  return rtlRender(
    <MockedProvider mocks={mocks} addTypename={false}>
      <AuthProvider>{ui}</AuthProvider>
    </MockedProvider>,
    renderOptions
  );
}

export * from "@testing-library/react";
export { render };
