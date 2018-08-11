export default `
    type Team {
        id: Int!
        name: String!
        owner: User!
        members: [User!]!
        channels: [Channel!]
    }

    type Query {
        getTeam(name: String!): Team
        allTeams: [Team!]
    }

    type CreateTeamResponse {
        success: Boolean!
        team: Team
        errors: [Error!]
    }

    type Mutation {
        createTeam(name: String!): CreateTeamResponse!
    }
`;
