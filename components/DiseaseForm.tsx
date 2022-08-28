import classes from "./DiseaseForm.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { IoIosAddCircle, IoMdRemoveCircle } from "react-icons/io";
import { useState } from "react";
import { motion } from "framer-motion";
import useAuth from "../hooks/auth";
import { gql } from "@apollo/client";

const DiseaseForm = () => {
  const { createApolloClient } = useAuth();
  const client = createApolloClient();

  const [symptoms, setSymptoms] = useState([""]);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      disease: "",
      symptom: symptoms,
    },
    validationSchema: Yup.object({
      disease: Yup.string().required("Name of Disease is required"),
      symptom: Yup.array().min(1, "You must add at least one symptom"),
    }),
    onSubmit: async (values) => {
      const createDiseaseMutation = gql`
        mutation ($disease: String!, $symptoms: DiseaseSymptomsFieldInput) {
          createDiseases(input: { name: $disease, symptoms: $symptoms }) {
            diseases {
              name
              symptoms {
                name
              }
            }
          }
        }
      `;

      const result = await client.mutate({
        mutation: createDiseaseMutation,
        variables: {
          disease: values.disease,
          symptoms: {
            create: values.symptom.map((s) => {
              return {
                node: {
                  name: s,
                },
              };
            }),
          },
        },
      });

      console.log("result: ", result);
    },
  });

  return (
    <form className={`${classes.form} `} onSubmit={formik.handleSubmit}>
      <div className={classes.inputContainer}>
        <input
          id="disease"
          name="disease"
          type="text"
          placeholder="Disease"
          value={formik.values.disease}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        ></input>
        {formik.errors.disease && formik.touched.disease ? (
          <p>{formik.errors.disease}</p>
        ) : null}
      </div>
      {formik.initialValues.symptom.map((s, i) => (
        <motion.div
          key={`symptom.${i}`}
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className={`${classes.inputContainerSymptom} ${classes.inputContainer}`}
        >
          <input
            id={`symptom.${i}`}
            name={`symptom.${i}`}
            type="text"
            placeholder={`Symptom ${i}`}
            value={formik.values.symptom[i]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          ></input>
          {i !== 0 && (
            <div>
              <IoMdRemoveCircle
                onClick={() => {
                  setSymptoms(
                    formik.values.symptom.filter((items, idx) => idx !== i)
                  );
                }}
                className={classes.removeButton}
                size="30"
              ></IoMdRemoveCircle>
            </div>
          )}

          {i === 0 && formik.errors.symptom && formik.touched.symptom ? (
            <p>{formik.errors.symptom}</p>
          ) : null}
        </motion.div>
      ))}
      <div style={{ display: "block", textAlign: "center" }}>
        <IoIosAddCircle
          onClick={() => setSymptoms([...formik.values.symptom, ""])}
          className={classes.addButton}
          size="50"
        ></IoIosAddCircle>
        <p>Add Symptom</p>
      </div>
      <button className={classes.createButton} type="submit">
        Create Disease
      </button>
    </form>
  );
};

export default DiseaseForm;
