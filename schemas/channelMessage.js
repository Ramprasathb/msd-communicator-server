export default `
    type ChannelMessage {
        id: Int!
        text: String!
        user: User!
        channel: Channel!
    }

    type Mutation {
        createChannelMessage(channelId: Int!, message: String!): Boolean!
    }
`;
