export default `
    type ChannelMessage {
        id: Int!
        message: String!
        member: User!
        channel: Channel!
        created_at: String!
    }

    type ChannelMessageResponse {
        success: Boolean!
        errors: [Error!]
        message: ChannelMessage
    }

    type Mutation {
        createChannelMessage(channelId: Int!, message: String!): ChannelMessageResponse!
    }

    type Query {
        getMessages(channelId: Int!): [ChannelMessage!]
    }

    type Subscription {
        newChannelMessage(channelId: Int!): ChannelMessage!
    }
`;
