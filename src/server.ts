import express from 'express';
import cors from 'cors';
import compression from 'compression';
//no lo vamos a usar con express-graphql
import { ApolloServer, gql } from 'apollo-server-express';

import schema from './schemas';
import { createServer } from 'http';
import environments from './config/environments';
import Database from './config/database';

if(process.env.NODE_ENV!=='production'){
    const envs=environments;
    //console.log(envs);
}


async function init(){

    const database=new Database();
    const db=await database.init();

const context:any=async ({req,connection}:any)=>{
    const token=req?req.headers.authorization:connection.authorization;
    return {db,token};
}


const server = new ApolloServer({ schema,context,introspection:true });
const app=express();
const PORT=process.env.PORT || 5300;

server.applyMiddleware({ app });

app.use(cors({origin:true,credentials:true}));
app.use(compression());


const httpServer=createServer(app);

httpServer.listen(PORT,()=>{
    console.log(`Now browse to http://localhost:${PORT}${server.graphqlPath}`);
});

}

init();




