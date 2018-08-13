export default `
    type Team {
        id: Int!
        name: String!
        owner: Int!
        members: [User!]!
        channels: [Channel!]
    }

    type Query {
        getTeam(name: String!): Team
        ownedTeams: [Team!]
        memberOfTeams: [Team!]
    }

    type CreateTeamResponse {
        success: Boolean!
        team: Team
        errors: [Error!]
    }

    type PlainResponse {
        success: Boolean!
        errors: [Error!]
    }

    type Mutation {
        createTeam(name: String!): CreateTeamResponse!,
        addUserToTeam(email: String!, teamId: Int!) : PlainResponse!
    }
`;
