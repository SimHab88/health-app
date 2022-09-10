import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import classes from "./MainNavigation.module.css";
import { AiOutlineLogin, AiOutlineLogout, AiOutlineUser } from "react-icons/ai";
import SigninForm from "../SigninForm";
import useAuth from "../../hooks/auth";
import { motion } from "framer-motion";

const MainNavigation: NextPage = () => {
  const [renderLogin, setRenderLogin] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const { loginState, signOut } = useAuth();

  const [isHamburgerActive, setHamburgerActive] = useState(false);
  const router = useRouter();
  return (
    <div>
      <div className="overlay" onClick={() => setRenderLogin(false)}></div>
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
            <div className="dropdown" onClick={(e) => e.stopPropagation()}>
              <a
                onClick={() => {
                  setRenderLogin(!renderLogin);
                }}
              >
                {!loginState ? (
                  <AiOutlineLogin
                    size="30"
                    style={{
                      marginLeft: "10px",
                      color: "#fff",
                      cursor: "pointer",
                      backgroundColor: "var(--dark)",
                    }}
                  ></AiOutlineLogin>
                ) : (
                  <AiOutlineUser
                    size="30"
                    style={{
                      marginLeft: "10px",
                      color: "#fff",
                      cursor: "pointer",
                      backgroundColor: "var(--dark)",
                    }}
                  ></AiOutlineUser>
                )}
              </a>
              <a onClick={() => signOut()}>
                <AiOutlineLogout
                  size="30"
                  style={{
                    marginLeft: "10px",
                    color: "#fff",
                    cursor: "pointer",
                    backgroundColor: "var(--dark)",
                  }}
                ></AiOutlineLogout>
              </a>
              <div
                className={`dropdown-menu ${renderLogin ? "login-active" : ""}`}
                style={{ direction: "rtl", right: "0px", borderRadius: "10px" }}
              >
                {!loginState && (
                  <SigninForm loginCallback={setRenderLogin}></SigninForm>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default MainNavigation;
