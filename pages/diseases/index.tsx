import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { gql } from "apollo-server-micro";
import type { NextPage } from "next";
import DiseaseForm from "../../components/DiseaseForm";
import jwt from "jsonwebtoken";

const Diseases: NextPage = () => {
  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}
    >
      <DiseaseForm></DiseaseForm>
    </div>
  );
};

export async function getStaticProps(context) {
  // const admin = {
  //   id: 1,
  //   username: "admin",
  //   roles: "admin",
  // };
  // const authToken = jwt.sign(admin, process.env.JWT_SECRET, {
  //   expiresIn: "5d",
  // });

  // const link = new HttpLink({
  //   uri: "http://localhost:3000/api/graphql",
  //   headers: {
  //     authorization: `Bearer ${authToken}`,
  //     contentType: "application/json",
  //     type: "POST",
  //   },
  // });

  // const client = new ApolloClient({
  //   link,
  //   cache: new InMemoryCache(),
  // });

  // const createDiseaseMutation = gql`
  //   mutation ($disease: String!, $symptoms: DiseaseSymptomsFieldInput) {
  //     createDiseases(input: { name: $disease, symptoms: $symptoms }) {
  //       diseases {
  //         name
  //         symptoms {
  //           name
  //         }
  //       }
  //     }
  //   }
  // `;

  // await client.mutate({
  //   mutation: createDiseaseMutation,
  //   variables: {
  //     disease: [],
  //     symptoms: {
  //       create: [].map((s) => {
  //         return {
  //           node: {
  //             name: s,
  //           },
  //         };
  //       }),
  //     },
  //   },
  // });

  return {
    props: {},
  };
}

export default Diseases;
