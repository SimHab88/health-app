import { useFormik } from "formik";
import * as Yup from "yup";
import Modal from "./Modal";

const SignupForm: React.FC = () => {
  
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .max(15, "Must be 15 characters or less")
        .required("Required"),
      lastName: Yup.string()
        .max(15, "Must be 15 characters or less")
        .required("Required"),
      email: Yup.string().email("Invalid email address").required("Required"),
    }),
    onSubmit: (values) => {
      console.log(values);
    },
  });

  console.log(formik.errors);
  return (
    <Modal link="/diseases">
      <form onSubmit={formik.handleSubmit}>
        <div className="input-container" style={{ paddingTop: "0px" }}>
          <input
            id="firstName"
            name="firstName"
            type="text"
            placeholder="First Name"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          ></input>
          {formik.errors.firstName && formik.touched.firstName && (
            <p>{formik.errors.firstName}</p>
          )}
        </div>
        <div className="input-container" style={{ paddingTop: "0px" }}>
          <input
            id="lastName"
            name="lastName"
            type="text"
            placeholder="Last Name"
            value={formik.values.lastName}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          ></input>
          {formik.errors.lastName && formik.touched.lastName && (
            <p>{formik.errors.lastName}</p>
          )}
        </div>
        <div className="input-container" style={{ paddingTop: "0px" }}>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            value={formik.values.email}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          ></input>
          {formik.errors.email && formik.touched.email && (
            <p>{formik.errors.email}</p>
          )}
        </div>
        <button type="submit">Submit</button>
      </form>
    </Modal>
  );
};

export default SignupForm;
