export default `
    type User {
        id: Int!
        username: String!
        email: String!
        teams: [Team!]
    }

    type Query {
        getUser(id: Int!) : User!
        allUsers: [User!]!
    }

    type RegisterUserResponse {
        success: Boolean!,
        user: User,
        errors: [Error!]
    }

    type LoginUserResponse {
        success: Boolean!,
        token: String,
        refreshToken: String,
        errors: [Error!]
    }

    type Mutation {
        registerUser(username: String!, email: String!, password: String!): RegisterUserResponse!
        loginUser(email: String!, password: String!): LoginUserResponse!
    }
`;
