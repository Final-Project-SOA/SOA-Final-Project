const { gql } = require('apollo-server-express');

const patientClient = require('../grpc/patientClient');

const typeDefs = gql`

    type Patient {
        id: ID
        name: String
        age: Int
        disease: String
    }

    type Query {
        patients: [Patient]
    }

`;

const resolvers = {

    Query: {

        patients: async () => {

            return new Promise((resolve, reject) => {

                patientClient.GetPatients({}, (error, response) => {

                    if (error) {

                        console.log(error);

                        reject(error);

                        return;
                    }

                    resolve(response.patients);

                });

            });

        }

    }

};

module.exports = { typeDefs, resolvers };