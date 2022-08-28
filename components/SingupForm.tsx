import { useFormik } from "formik";
import { GraphQLError } from "graphql";
import * as Yup from "yup";
import useAuth from "../hooks/auth";
import Modal from "./Modal";
import classes from "./SignupForm.module.css";

const SignupForm: React.FC = () => {
  const { signUp } = useAuth();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      email: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .max(15, "Must be 15 characters or less")
        .required("Required"),
      password: Yup.string()
        .max(15, "Must be 15 characters or less")
        .required("Required"),
      email: Yup.string().email("Invalid email address").required("Required"),
    }),
    onSubmit: async (values) => {
      await signUp({
        username: values.username,
        password: values.password,
      })
        .then((res: string | readonly GraphQLError[] | undefined) =>
          console.log("Login: ", res)
        )
        .catch((e: readonly GraphQLError[] | undefined) =>
          console.log("Login error: ", e)
        );
    },
  });

  return (
    <Modal>
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
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            value={formik.values.email}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          ></input>
          {formik.errors.email && formik.touched.email ? (
            <p>{formik.errors.email}</p>
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
        <button className={classes.submitButton} type="submit">
          Create User
        </button>
      </form>
    </Modal>
  );
};

export default SignupForm;
