export default `

    type Channel {
        id: Int!
        name: String!
        public: Boolean!
        messages: [ChannelMessage!]!
        users: [User!]!
    }

    type CreateChannelResponse {
        success: Boolean!
        channel: Channel
        errors: [Error!]
    }

    type Mutation {
        createChannel(name: String!, teamId: Int!, public: Boolean=true): CreateChannelResponse!
    }
`;
