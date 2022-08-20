import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import classes from "./MainNavigation.module.css";
import { AiOutlineLogin } from "react-icons/ai";
import SigninForm from "../SigninForm";

const MainNavigation: NextPage = () => {
  const [renderLogin, setRenderLogin] = useState(false);

  const [isHamburgerActive, setHamburgerActive] = useState(false);
  const router = useRouter();
  return (
    <div className="overlay" onClick={() => setRenderLogin(false)}>
      <nav>
        <div className={classes.container}>
          <h1 className={classes.navTitle}>Home</h1>
          <div>
            <div className={classes.menu}>
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
          </div>
          <div style={{ display: "flex" }}>
            <div className="dropdown" onClick={(e) => e.stopPropagation()}>
              <a
                className="link"
                onClick={() => {
                  setRenderLogin(!renderLogin);
                }}
              >
                <AiOutlineLogin
                  size="30"
                  style={{
                    marginLeft: "10px",
                    color: "#fff",
                    cursor: "pointer",
                    backgroundColor: "var(--dark)",
                  }}
                ></AiOutlineLogin>
              </a>
              <div
                className={`dropdown-menu ${renderLogin ? "login-active" : ""}`}
                style={{ direction: "rtl", right: "0px", borderRadius: "10px" }}
              >
                <SigninForm loginCallback={setRenderLogin}></SigninForm>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default MainNavigation;
