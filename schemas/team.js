export default `
    type Team {
        owner: User!
        members: [User!]!
        channels: [Channel!]!
    }

    type Query {
        getTeam(name: String!): Team
    }

    type Mutation {
        createTeam(name: String!): Boolean!
    }
`;
