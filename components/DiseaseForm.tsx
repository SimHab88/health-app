import classes from "./DiseaseForm.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { IoIosAddCircle, IoMdRemoveCircle } from "react-icons/io";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import useAuth from "../hooks/auth";
import { gql } from "@apollo/client";
import clsx from "classnames";
import { authQuery, createDiseaseMutation } from "../graphql/crud";

const DiseaseForm = () => {
  const { createApolloClient } = useAuth();
  const client = createApolloClient();
  const [removeIdx, setRemoveIdx] = useState(-1);
  const [suggestions, setSuggestions] = useState<string[]>();

  const [symptoms, setSymptoms] = useState([""]);

  useEffect(() => {
    setTimeout(() => {
      setSymptoms(
        formik.values.symptom.filter((items, idx) => idx !== removeIdx)
      );
      setRemoveIdx(-1);
    }, 1000);
  }, [removeIdx]);

  const cslxSymptomInput = useCallback(
    (idx: number): string => {
      return clsx({
        [classes.remove]: removeIdx === idx,
        [classes.inputContainer]: true,
      });
    },
    [removeIdx]
  );
  const cslxForm = useCallback((): string => {
    return clsx({
      [classes.transition]: removeIdx !== -1,
      [classes.form]: removeIdx === -1,
    });
  }, [removeIdx]);

  const handleDiseaseInput = async (input: ChangeEvent<HTMLInputElement>) => {
    const createDiseaseMutation = gql`
      query ($str: String!) {
        diseases(where: { name_STARTS_WITH: $str }) {
          name
        }
      }
    `;

    if (input.currentTarget.value) {
      const result = await client.mutate({
        mutation: createDiseaseMutation,
        variables: {
          str: input.currentTarget?.value,
        },
      });

      setSuggestions(
        result?.data.diseases.map((d: { name: string }) => d.name)
      );

      console.log("res: ", result);
      console.log("suggestions: ", suggestions);
      console.log("input changes: ", input.currentTarget?.value);
    } else {
      setSuggestions([]);
    }
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

  return (
    <form className={cslxForm()} onSubmit={formik.handleSubmit}>
      <div className={classes.inputContainer}>
        <input
          id="disease"
          name="disease"
          type="text"
          placeholder="Disease"
          value={formik.values.disease}
          onChange={(e) => {
            handleDiseaseInput(e);
            formik.handleChange(e);
          }}
          onBlur={formik.handleBlur}
        ></input>
        {suggestions && suggestions?.length > 0 && (
          <div className={classes.suggestionContainer}>
            <ul>
              {suggestions?.map((s, i) => (
                // eslint-disable-next-line react/jsx-key
                <a href="">
                  <li key={i}>{s}</li>
                </a>
              ))}
            </ul>
          </div>
        )}
        {formik.errors.disease && formik.touched.disease ? (
          <p>{formik.errors.disease}</p>
        ) : null}
      </div>
      {formik.initialValues.symptom.map((s, i) => (
        <div key={`symptom.${i}`} className={cslxSymptomInput(i)}>
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

          {i === 0 && formik.errors.symptom && formik.touched.symptom ? (
            <p>{formik.errors.symptom}</p>
          ) : null}
        </div>
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
