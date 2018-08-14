export default `
    type ChannelMessage {
        id: Int!
        message: String!
        user: User!
        channel: Channel!
        created_at: String!
        reply: [ChannelMessageThread!]
    }

    type Mutation {
        createChannelMessage(channelId: Int!, message: String!): Boolean!
    }

    type Query {
        getMessages(channelId: Int!): [ChannelMessage!]
    }

    type Subscription {
        newChannelMessage(channelId: Int!): Int!
    }
`;
