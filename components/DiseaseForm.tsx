import classes from "./DiseaseForm.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { IoIosAddCircle, IoMdRemoveCircle } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import useAuth from "../hooks/auth";
import clsx from "classnames";
import {
  authQuery,
  createDiseaseMutation,
  getSuggestionsMutation,
} from "../graphql/crud";
import { AnimatePresence, motion } from "framer-motion";

const DiseaseForm = () => {
  const { createApolloClient } = useAuth();
  const client = createApolloClient();
  const [suggestions, setSuggestions] = useState<string[]>();
  const [symptoms, setSymptoms] = useState([""]);
  const [removeIdx, setRemoveIdx] = useState(-1);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const resetSuggestions = () => setSuggestions([]);
    document.addEventListener("click", resetSuggestions);
    return () => document.removeEventListener("click", resetSuggestions);
  }, []);

  const containerVariants = {
    hidden: {
      opacity: 0,
      x: "0",
      height: 0,
      width: 0,
    },
    visible: {
      height: "auto",
      width: "auto",
      opacity: 1,
      x: 0,
      transition: {
        type: "linear",
        duration: 0.5,
        delay: 0,
      },
    },
  };

  const getSuggestions = async (input: string) => {
    const result = await client.mutate({
      mutation: getSuggestionsMutation,
      variables: {
        str: input,
      },
    });

    if (result.data && result.data.diseases.length)
      setSuggestions(
        result?.data.diseases.map((d: { name: string }) => d.name)
      );

    console.log("res: ", result);
    console.log("suggestions: ", suggestions);
    console.log("input changes: ", input);
  };

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
      console.log("auth: ", await client.mutate({ mutation: authQuery }));
      const result = await client.mutate({
        mutation: createDiseaseMutation,
        variables: {
          disease: values.disease,
          symptoms: {
            connectOrCreate: values.symptom.map((s) => {
              return {
                where: { node: { name: s } },
                onCreate: {
                  node: {
                    name: s,
                  },
                },
              };
            }),
          },
        },
      });

      console.log("result: ", result);
    },
  });

  useEffect(() => {
    console.log("input: ", formik.values.disease);
    if (formik.values.disease) {
      getSuggestions(formik.values.disease);
    } else {
      setSuggestions([]);
    }
  }, [formik.values.disease]);

  return (
    <div className={classes.mainContainer}>
      <motion.form
        ref={formRef}
        animate={{
          maxHeight: "auto",
          height: "auto",
          transition: {
            type: "spring",
            duration: 1,
            delay: 0,
          },
        }}
        initial={{
          height: 0,
        }}
        className={classes.form}
        onSubmit={formik.handleSubmit}
      >
        <div
          tabIndex={0}
          onClick={(e) => e.stopPropagation()}
          className={classes.inputContainer}
        >
          <input
            id="disease"
            name="disease"
            type="text"
            placeholder="Disease"
            value={formik.values.disease}
            onChange={(e) => {
              formik.handleChange(e);
            }}
            onBlur={formik.handleBlur}
          ></input>
          {suggestions && suggestions?.length > 0 && (
            <div
              onClick={(e) => e.stopPropagation()}
              className={classes.suggestionContainer}
            >
              <ul>
                {suggestions?.map((s, i) => (
                  // eslint-disable-next-line react/jsx-key
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}
          {formik.errors.disease && formik.touched.disease ? (
            <p>{formik.errors.disease}</p>
          ) : null}
        </div>
        <AnimatePresence
          onExitComplete={() => {
            setSymptoms(
              formik.values.symptom.filter((items, idx) => idx !== removeIdx)
            );
            setRemoveIdx(-1);
          }}
        >
          {formik.initialValues.symptom.map(
            (s, i) =>
              i !== removeIdx && (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  key={`symptom.${i}`}
                  className={classes.inputContainer}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "left",
                      alignItems: "center",
                    }}
                  >
                    <input
                      key={`input.${i}`}
                      id={`symptom.${i}`}
                      name={`symptom.${i}`}
                      type="text"
                      placeholder={`Symptom ${i}`}
                      value={formik.values.symptom[i]}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    ></input>
                    {i !== 0 && (
                      <div key={`removeButton.${i}`}>
                        <IoMdRemoveCircle
                          onClick={() => {
                            setRemoveIdx(i);
                          }}
                          className={classes.removeButton}
                          size="30"
                        ></IoMdRemoveCircle>
                      </div>
                    )}
                  </div>
                  {i === 0 &&
                  formik.errors.symptom &&
                  formik.touched.symptom ? (
                    <p>{formik.errors.symptom}</p>
                  ) : null}
                </motion.div>
              )
          )}
        </AnimatePresence>

        <div
          className={clsx({
            [classes.changeSymptoms]: true,
          })}
        >
          <IoIosAddCircle
            onClick={() => setSymptoms([...formik.values.symptom, ""])}
            className={classes.addButton}
            size="50"
          ></IoIosAddCircle>
          <p>Add Symptom</p>
          <button className={classes.createButton} type="submit">
            Create Disease
          </button>
        </div>
      </motion.form>
      <div className={classes.canvas}>
        <p>Hello</p>
      </div>
    </div>
  );
};

export default DiseaseForm;
