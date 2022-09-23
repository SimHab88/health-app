import { gql } from "apollo-server-micro";

export const createDiseaseMutation = gql`
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

export const authQuery = gql`
  query {
    myId
  }
`;

export const getSuggestionsMutation = gql`
  query ($str: String!) {
    diseases(where: { name_STARTS_WITH: $str }) {
      name
    }
  }
`;
