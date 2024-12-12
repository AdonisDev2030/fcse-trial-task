import React, { useState } from "react";
import styles from "./LoginScreen.module.css";
import Logo from "../../assets/img/Logo.svg";
import { gql, useMutation } from "@apollo/client";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(input: { identifier: $email, password: $password }) {
      jwt
    }
  }
`;

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [login, { loading }] = useMutation(LOGIN_MUTATION);
  const { login: loginUser } = useAuth();
  const navigate = useNavigate();

  const showToast = (message, type = "error") => {
    const options = {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    };

    type === "success"
      ? toast.success(message, options)
      : toast.error(message, options);
  };

  const submitForm = async (e) => {
    e.preventDefault();

    if (!email) {
      showToast("Email is required.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      showToast("Please enter a valid email address.");
      return;
    }

    if (!password) {
      showToast("Password is required.");
      return;
    }

    try {
      const { data } = await login({ variables: { email, password } });
      const jwt = data?.login?.jwt;

      if (jwt) {
        loginUser(jwt);
        navigate("/account");
        showToast("Login successful!", "success");
      } else {
        showToast("Login failed. Please try again.");
      }
    } catch (error) {
      showToast("Incorrect email or password. Please try again.");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.leftPanel}>
        <h1>Welcome to</h1>
        <div className={styles.logo}>
          <img src={Logo} alt="Freshcells logo" />
        </div>
        <p>
          Access innovative tools, expert solutions, and seamless digital
          experiences designed for your success!
        </p>
      </div>

      <div className={styles.rightPanel}>
        <h2>Login to Freshcells</h2>
        <form className={styles.form} onSubmit={submitForm}>
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />

          <button className={styles.signInBtn} type="submit" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
          <button
            className={styles.signUpBtn}
            type="button"
            disabled={loading}
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LoginScreen;
