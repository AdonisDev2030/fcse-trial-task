import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginScreen from "./components/LoginScreen";
import AccountScreen from "./components/AccountScreen";
import { ApolloProvider } from "@apollo/client";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { client } from "./client";
import "react-toastify/dist/ReactToastify.css";
import "./i18n";

function App() {
  const PublicRoute = ({ children }) => {
    const { token } = useAuth();

    return !token ? children : <Navigate to="/account" replace />;
  };

  const PrivateRoute = ({ children }) => {
    const { token } = useAuth();

    return token ? children : <Navigate to="/login" replace />;
  };

  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginScreen />
                </PublicRoute>
              }
            />
            <Route
              path="/account"
              element={
                <PrivateRoute>
                  <AccountScreen />
                </PrivateRoute>
              }
            />
            <Route
              path="*"
              element={
                <Navigate
                  to={localStorage.getItem("token") ? "/account" : "login"}
                  replace
                />
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
