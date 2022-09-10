import { useFormik } from "formik";
import Link from "next/link";
import { Dispatch, SetStateAction, useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { ClipLoader } from "react-spinners";
import * as Yup from "yup";
import useAuth from "../hooks/auth";
import classes from "./SigninForm.module.css";
interface Props {
  loginCallback: Dispatch<SetStateAction<boolean>>;
}

const SignupForm: React.FC<Props> = ({ loginCallback }) => {
  const { signIn, signOut } = useAuth();
  const [signingIn, setSigningIn] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .max(15, "Must be 15 characters or less")
        .required("Required"),
      password: Yup.string()
        .max(15, "Must be 15 characters or less")
        .required("Required"),
    }),
    onSubmit: async (values) => {
      setLoginMessage("");
      setSigningIn(true);
      setTimeout(() => console.log(""), 3000);
      await signIn({
        username: values.username,
        password: values.password,
      })
        .then((res) => {
          console.log("Login: ", res);
          loginCallback(false);
        })
        .catch((e) => {
          setLoginMessage(e.message);
          signOut();
        });
      setSigningIn(false);
    },
  });

  return (
    <div
      style={{
        position: "absolute",
        backgroundColor: "transparent",
        direction: "ltr",
      }}
    >
      <AiOutlineCloseCircle
        onClick={() => loginCallback(false)}
        size="30"
        style={{
          position: "absolute",
          top: "8px",
          right: " 8px",
          cursor: "pointer",
        }}
      ></AiOutlineCloseCircle>
      <form className={classes.form} onSubmit={formik.handleSubmit}>
        <div className={classes.inputContainer}>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          ></input>
          {formik.errors.username && formik.touched.username ? (
            <p>{formik.errors.username}</p>
          ) : null}
        </div>
        <div className={classes.inputContainer} style={{ paddingTop: "0px" }}>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            value={formik.values.password}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          ></input>
          {formik.errors.password && formik.touched.password ? (
            <p>{formik.errors.password}</p>
          ) : null}
        </div>
        {loginMessage && <p style={{ color: "red" }}>{loginMessage}</p>}
        <div>
          <button
            className={`${classes.submitButton} ${
              signingIn ? classes.signingIn : ""
            }`}
            type="submit"
          >
            Login
          </button>{" "}
          <Link href="/signup">
            <button
              onClick={() => loginCallback(false)}
              className={classes.submitButton}
            >
              Signup
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
