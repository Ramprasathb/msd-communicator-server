export default `
  type DirectMessage {
    id: Int!
    message: String!
    sender: User!
    receiverId: Int!
    created_at: String!
  }
  type Query {
    getDirectMessages(teamId: Int!, receiverId: Int!): [DirectMessage!]!
  }
  type Mutation {
    createDirectMessage(receiverId: Int!, message: String!, teamId: Int!): Boolean!
  }
`;
