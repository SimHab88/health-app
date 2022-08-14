import { Neo4jGraphQL } from "@neo4j/graphql";
import { OGM } from "@neo4j/graphql-ogm";
// import { Neo4jGraphQLAuthJWTPlugin } from "@neo4j/graphql-plugin-auth";
import { ApolloServer } from "apollo-server-micro";
import { driver as _driver, auth as _auth } from "neo4j-driver";
import jwt from "jsonwebtoken";
import { compareSync, hashSync } from "bcrypt";

const driver = _driver(
  process.env.NEO4J_URI,
  _auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const typeDefs = `
    type User {
        id: ID @id
        username: String!
        password: String! @private
    }

    type Mutation {
        signUp(username: String!, password: String!): String! ### JWT
        signIn(username: String!, password: String!): String! ### JWT
    }
`;

const ogm = new OGM({ typeDefs, driver });
const User = ogm.model("User");

const resolvers = {
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
      return jwt.sign({ id, username }, process.env.JWT_SECRET);
    },
    signIn: async (_source, { username, password }) => {
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
      return jwt.sign({ id, username }, process.env.JWT_SECRET);
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
      // auth: new Neo4jGraphQLAuthJWTPlugin({
      //   secret: "secret",
      // }),
    },
  });

  await ogm.init();
  const apolloServer = new ApolloServer({
    schema: await neoSchema.getSchema(),
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
