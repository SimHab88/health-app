import React, { useState, useContext, createContext, ReactNode } from "react";
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  HttpLink,
  gql,
  NormalizedCacheObject,
} from "@apollo/client";
import { GraphQLError } from "graphql";

interface ContextType {
  setAuthToken: React.Dispatch<React.SetStateAction<null>>;
  isSignedIn: () => boolean;
  signIn: ({
    // eslint-disable-next-line no-unused-vars
    username,
    // eslint-disable-next-line no-unused-vars
    password,
  }: {
    username: string;
    password: string;
  }) => Promise<void>;
  signUp: ({
    // eslint-disable-next-line no-unused-vars
    username,
    // eslint-disable-next-line no-unused-vars
    password,
  }: {
    username: string;
    password: string;
  }) => Promise<readonly GraphQLError[] | string | undefined>;
  signOut: () => void;
  createApolloClient: () => ApolloClient<NormalizedCacheObject>;
}
const authContext = createContext<ContextType>({} as ContextType);

interface PropsType {
  children: ReactNode;
}

export const AuthProvider: React.FC<PropsType> = ({ children }) => {
  const auth = useProvideAuth();
  return (
    <authContext.Provider value={auth}>
      <ApolloProvider client={auth.createApolloClient()}>
        {children}
      </ApolloProvider>
    </authContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(authContext);
};

function useProvideAuth() {
  const [authToken, setAuthToken] = useState(null);

  const isSignedIn = () => {
    if (authToken) {
      return true;
    } else {
      return false;
    }
  };

  const getAuthHeaders = () => {
    if (!authToken)
      return {
        contentType: "application/json",
        type: "POST",
      };

    return {
      authorization: `Bearer ${authToken}`,
      contentType: "application/json",
      type: "POST",
    };
  };

  const createApolloClient = () => {
    const link = new HttpLink({
      uri: "http://localhost:3000/api/graphql",
      headers: getAuthHeaders(),
    });

    return new ApolloClient({
      link,
      cache: new InMemoryCache(),
    });
  };

  const signIn = async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    const client = createApolloClient();
    const LoginMutation = gql`
      mutation ($username: String!, $password: String!) {
        signIn(username: $username, password: $password)
      }
    `;

    const result = await client.mutate({
      mutation: LoginMutation,
      variables: { username, password },
    });
    console.log("signin: ", result);

    if (result?.data?.signIn) {
      setAuthToken(result.data.signIn);
    }
  };

  const signUp = async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }): Promise<string | readonly GraphQLError[] | undefined> => {
    const client = createApolloClient();
    const SignUpMutation = gql`
      mutation ($username: String!, $password: String!) {
        signUp(username: $username, password: $password)
      }
    `;

    const result = await client.mutate({
      mutation: SignUpMutation,
      variables: { username, password },
    });

    if (result?.data?.signUp) {
      setAuthToken(result.data.signUp);
      return "Account created successfully";
    }

    return result.errors;
  };

  const signOut = () => {
    setAuthToken(null);
  };

  return {
    signUp,
    setAuthToken,
    isSignedIn,
    signIn,
    signOut,
    createApolloClient,
  };
}

export default useAuth;
