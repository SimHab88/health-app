import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import classes from "./MainNavigation.module.css";
import { AiOutlineLogin, AiOutlineLogout, AiOutlineUser } from "react-icons/ai";
import SigninForm from "../SigninForm";
import useAuth from "../../hooks/auth";
import clsx from "classnames";

const MainNavigation: NextPage = () => {
  const [loginPopup, toggleLoginPopup] = useState(false);
  const [userPopup, toggleUserPopup] = useState(false);
  const { loginState, signOut } = useAuth();
  const [isHamburgerActive, setHamburgerActive] = useState(false);

  useEffect(() => {
    if (loginPopup) toggleLoginPopup(!loginPopup);
    if (userPopup) toggleUserPopup(!userPopup);
  }, [loginState]);

  useEffect(() => {
    if (!loginPopup) return;
    function handleClick() {
      toggleLoginPopup(!loginPopup);
      toggleUserPopup(!userPopup);
    }
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [loginPopup]);

  console.log("render login: ", loginPopup);

  const clsxUserContainer = () => {
    return clsx({
      [classes.userContainer]: true,
      [classes.hideContainer]: !loginState,
    });
  };
  const clsxLoginContainer = () => {
    return clsx({
      [classes.loginContainer]: true,
      [classes.hideContainer]: loginState,
    });
  };

  const clsxLoginPopup = () => {
    return clsx({
      [classes.loginPopup]: true,
      [classes.popupClosed]: !loginPopup,
    });
  };

  const clsxUserPopup = () => {
    return clsx({
      [classes.userPopup]: true,
      [classes.popupClosed]: !userPopup,
    });
  };

  const router = useRouter();
  return (
    <div>
      <div className="overlay" onClick={() => toggleLoginPopup(false)}></div>
      <nav>
        <div className={classes.container}>
          <h1 className={classes.navTitle}>Home</h1>
          <button
            onClick={() => setHamburgerActive(!isHamburgerActive)}
            className={`${classes.hamburger} ${
              isHamburgerActive ? classes.isActive : ""
            }`}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <div className={classes.navigation}>
            <div
              className={`${classes.menu} ${
                isHamburgerActive ? classes.activeHamburgerDropdown : ""
              }`}
            >
              <Link href="/">
                <a>Home</a>
              </Link>
              <Link href="/">About</Link>
              <Link href="/diseases">
                <a
                  style={
                    router.asPath.includes("/diseases")
                      ? { backgroundColor: "var(--primary)" }
                      : {}
                  }
                >
                  Diseases
                </a>
              </Link>
              <Link href="/physicians">
                <a
                  style={
                    router.asPath.includes("/physicians")
                      ? { backgroundColor: "var(--primary)" }
                      : {}
                  }
                >
                  Physicians
                </a>
              </Link>
              <Link href="/">Contact</Link>
            </div>
          </div>
          <div className={classes.login}>
            <div onClick={(e) => e.stopPropagation()}>
              <a
                onClick={() => {
                  toggleLoginPopup(!loginPopup);
                }}
              >
                <div className={clsxLoginContainer()}>
                  <AiOutlineLogin
                    size="30"
                    style={{
                      marginLeft: "10px",
                      color: "#fff",
                      cursor: "pointer",
                      backgroundColor: "var(--dark)",
                    }}
                  ></AiOutlineLogin>
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className={clsxLoginPopup()}
                  >
                    <SigninForm
                      loginCallback={() => toggleLoginPopup(!loginPopup)}
                    ></SigninForm>
                  </div>
                </div>

                <div className={clsxUserContainer()}>
                  <AiOutlineUser
                    onClick={() => {
                      toggleUserPopup(!userPopup);
                    }}
                    size="30"
                    style={{
                      marginLeft: "10px",
                      color: "#fff",
                      cursor: "pointer",
                      backgroundColor: "var(--dark)",
                    }}
                  ></AiOutlineUser>
                  <div className={clsxUserPopup()}>
                    <a
                      onClick={() => {
                        signOut();
                      }}
                    >
                      <AiOutlineLogout
                        size="30"
                        style={{
                          marginLeft: "10px",
                          color: "black",
                          cursor: "pointer",
                        }}
                      ></AiOutlineLogout>
                    </a>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default MainNavigation;
