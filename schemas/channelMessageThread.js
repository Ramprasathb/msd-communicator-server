export default `
  type ChannelMessageThread {
    id: Int!
    message: String!
    sender: User!
    message_id: Int!
    created_at: String!
  }

  type Mutation {
    createChannelMessageThread(messageId: Int!, message: String!): Boolean!
  }
`;
