import { Neo4jGraphQL } from "@neo4j/graphql";
import { OGM } from "@neo4j/graphql-ogm";
import { Neo4jGraphQLAuthJWTPlugin } from "@neo4j/graphql-plugin-auth";
import { ApolloServer } from "apollo-server-micro";
import { driver as _driver, auth as _auth } from "neo4j-driver";
import jwt from "jsonwebtoken";
import { compareSync, hashSync } from "bcrypt";
import { serialize } from "cookie";

const driver = _driver(
  process.env.NEO4J_URI,
  _auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const typeDefs = `
    type Movie {
      title: String! @unique
      year: Int
      plot: String
      actors: [Person!]! @relationship(type: "ACTED_IN", direction: IN)
    }

    type Person {
      name: String! @unique
      movies: [Movie!]! @relationship(type: "ACTED_IN", direction: OUT)
    }

    type Disease @auth(rules: [
    { operations: [CREATE], isAuthenticated: true, roles:["someDude"] }
]) {
      name: String! @unique
      symptoms: [Symptom!]! @relationship(type: "CAUSES", direction: OUT)
    }

    
    type Symptom {
      name: String! @unique
    }


    type User {
        id: ID @id
        username: String! 
        password: String! @private
        roles: String! @default(value: "someDude")
    }

    type Mutation {
        signUp(username: String!, password: String!): String! ### JWT
        signIn(username: String!, password: String!): String! ### JWT
    }

    type Query {
        myId: String!
    }
`;

//extend type Disease @auth(rules: [{ isAuthenticated: true, operations: [UPDATE, CREATE] }])
//@auth(rules: [{ isAuthenticated: true, operations:[CREATE] }])
const ogm = new OGM({ typeDefs, driver });
const User = ogm.model("User");

const resolvers = {
  Query: {
    myId: async (_, __, context) => {
      console.log("c: ", context.auth);

      return JSON.stringify(context.auth);
    },
  },
  Mutation: {
    signUp: async (_source, { username, password }) => {
      const [existing] = await User.find({
        where: {
          username,
        },
      });
      if (existing) {
        throw new Error(`User with username ${username} already exists!`);
      }
      password = hashSync(password, 10);
      const { users } = await User.create({
        input: [
          {
            username,
            password,
          },
        ],
      });
      const id = users[0].id;
      const roles = users[0].roles;
      return jwt.sign({ id, username, roles }, process.env.JWT_SECRET, {
        expiresIn: "5d",
      });
    },
    signIn: async (parent, { username, password }, { req, res }, info) => {
      const [user] = await User.find({
        where: {
          username,
        },
      });
      if (!user) {
        throw new Error(`User with username ${username} not found!`);
      }
      const correctPassword = compareSync(password, user.password);
      if (!correctPassword) {
        throw new Error(
          `Incorrect password for user with username ${username}!`
        );
      }
      const id = user.id;
      const roles = user.roles;

      const token = jwt.sign({ id, username, roles }, process.env.JWT_SECRET);
      res.setHeader(
        "Set-Cookie",
        serialize("token", `Bearer ${token}`, {
          path: "/",
          httpOnly: true,
          expiresIn: 60,
          secure: true,
        })
      );

      return token;
    },
  },
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://studio.apollographql.com"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  if (req.method === "OPTIONS") {
    res.end();
    return false;
  }

  const neoSchema = new Neo4jGraphQL({
    typeDefs,
    driver,
    resolvers,
    plugins: {
      auth: new Neo4jGraphQLAuthJWTPlugin({
        secret: process.env.JWT_SECRET,
      }),
    },
  });

  await ogm.init();
  const schema = await neoSchema.getSchema();
  await neoSchema.assertIndexesAndConstraints({ options: { create: true } });

  const apolloServer = new ApolloServer({
    schema: schema,
    context: ({ req, res }) => {
      console.log("req!!!!!: ", req.cookies);
      return {
        req,
        res,
      };
    },
  });

  await apolloServer.start();
  await apolloServer.createHandler({
    path: "/api/graphql",
  })(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
