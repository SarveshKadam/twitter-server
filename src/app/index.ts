import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import bodyParser from 'body-parser';
import express from 'express';
import { User } from './user';


export async function initServer() {
    const app = express();
    app.use(bodyParser.json());
    const graphqlserver = new ApolloServer({
        typeDefs: `#graphql 
            ${User.types}
            type Query {
                ${User.queries}
            }
        `,
        resolvers: {
            Query: {
                ...User.resolvers.queries
            },
        },
    });
    await graphqlserver.start();

    app.use("/graphql", expressMiddleware(graphqlserver));

    return app;
}