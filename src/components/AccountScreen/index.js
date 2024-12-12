import React from "react";
import { gql, useQuery } from "@apollo/client";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./AccountScreen.module.css";
import Logo from "../../assets/img/Logo.svg";
import FetchLoader from "../../assets/img/FetchLoader.gif";

export const GET_DATA = gql`query GetUser {user(id: 2) {id, email, firstName, lastName}}`;

const AccountScreen = () => {
  const { t, i18n } = useTranslation();
  const { data, loading, error } = useQuery(GET_DATA);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const logOut = () => {
    logout();
    navigate("/login");
  };

  const changeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div className={styles.accountContainer}>
      <header className={styles.accountHeader}>
        <div className={styles.logo}>
          <a href="/">
            <img src={Logo} alt="Logo" />
          </a>
        </div>
        <div className={styles.headerRight}>
          <select
            aria-label="Language Selector"
            className={styles.languageSelect}
            value={i18n.lng}
            onChange={changeLanguage}
          >
            <option value="en">{t("en")}</option>
            <option value="de">{t("de")}</option>
            <option value="es">{t("es")}</option>
          </select>
        </div>
      </header>

      <main className={styles.accountBody}>
        <h1>{t("pageTitle")}</h1>

        {loading && (
          <div className={styles.loadingContainer}>
            <img
              src={FetchLoader}
              alt="fetching data"
              className={styles.fetchLoader}
            />
          </div>
        )}

        {error && <p className={styles?.error}>{t("fetchErr")}</p>}

        {!loading && !error && data && (
          <>
            <p className={styles.userInfo}>
              {data?.user?.firstName + " " + data?.user?.lastName}
            </p>
            <p className={styles.userInfo}>{data?.user?.email}</p>
          </>
        )}
        <button className={styles.logOutBtn} onClick={logOut}>
          {t("logout")}
        </button>
      </main>
    </div>
  );
};

export default AccountScreen;
