export default `
  type DirectMessageThread {
    id: Int!
    message: String!
    sender: User!
    message_id: Int!
    created_at: String!
  }

  type Mutation {
    createDirectMessageThread(messageId: Int!, message: String!): Boolean!
  }
`;
