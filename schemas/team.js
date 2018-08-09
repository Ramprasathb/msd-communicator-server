export default `
    type Team {
        name: String!
        owner: User!
        members: [User!]!
        channels: [Channel!]!
    }

    type Query {
        getTeam(name: String!): Team
    }

    type CreateTeamResponse {
        success: Boolean!
        errors: [Error!]
    }

    type Mutation {
        createTeam(name: String!): CreateTeamResponse!
    }
`;
