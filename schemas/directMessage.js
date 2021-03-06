export default `
  type DirectMessage {
    id: Int!
    message: String!
    sender: User!
    receiverId: Int!
    created_at: String!
    reply: [DirectMessageThread!]
  }
  type Query {
    getDirectMessages(teamId: Int!, receiverId: Int!): [DirectMessage!]!
  }
  type Mutation {
    createDirectMessage(receiverId: Int!, message: String!, teamId: Int!): Boolean!
  }
  type Subscription {
    newDirectMessage(teamId: Int!, userId: Int!, senderId: Int!): DirectMessage!
  }
`;
