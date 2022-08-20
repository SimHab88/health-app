import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import classes from "./MainNavigation.module.css";
import { AiOutlineLogin } from "react-icons/ai";

const MainNavigation: NextPage = () => {
  const [isHamburgerActive, setHamburgerActive] = useState(false);
  const router = useRouter();
  console.log(router.asPath);
  return (
    <nav>
      <div className={classes.container}>
        <h1 className={classes.navTitle}>Home</h1>
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
        <Link href="/signup">
          <AiOutlineLogin
            size="30"
            style={{ color: "#fff", cursor: "pointer" }}
          ></AiOutlineLogin>
        </Link>
      </div>
    </nav>
  );
};

export default MainNavigation;
