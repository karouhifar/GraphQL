import express from 'express';
import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList } from 'graphql';
import { graphqlHTTP } from 'express-graphql';

import userData from './MOCKDATA.json';
import { resolve } from 'path';

const app = express();
const port = 8080; // default port to listen

const UserQuery : GraphQLObjectType = new GraphQLObjectType({
    name: "user",
    fields: () => ({
       id : {type: GraphQLInt},
       firstName : {type: GraphQLString},
       lastName : {type: GraphQLString},
       email : {type: GraphQLString},
       password : {type: GraphQLString},
    })
});

const RootQuery : GraphQLObjectType = new GraphQLObjectType({
    name: "RootQuery",
    fields: {
        getAllUser : {type: new GraphQLList(UserQuery),
        args : { id : { type : GraphQLInt}},
        resolve(parent, args) {
            return userData;
         }
        }
    }
});
const Mutation : GraphQLObjectType = new GraphQLObjectType({
    name: "MutationQuery",
    fields: {
        createUser : {type: UserQuery,
        args : {  
        firstName : {type: GraphQLString},
        lastName : {type: GraphQLString},
        email : {type: GraphQLString},
        password : {type: GraphQLString}
        },
        resolve(parent, args) {
             userData.push(
                {
                id:userData.length+1, 
                firstName: args.firstName,
                lastName: args.lastName,
                email: args.email,
                password: args.password
            });
            return args;
         }
        }
    }
});

class SchemaData {
    private schemaData : GraphQLSchema = new GraphQLSchema({query: RootQuery, mutation: Mutation});
    constructor(){}

    set data(data : any){
        this.schemaData = data;
    }
    get schema(){
        return this.schemaData;
    }
}
const data = new SchemaData();
const {schema} = data;
// Starting of GraphQL API Route
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

// define a route handler for the default home page
app.get( "/", ( req, res  ) => {
    res.send( "Health check : " + res.statusCode);
});

// start the Express server
app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );