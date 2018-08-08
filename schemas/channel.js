export default `

    type Channel {
        id: Int!
        name: String!
        public: Boolean!
        messages: [ChannelMessage!]!
        users: [User!]!
    }

    type Mutation {
        createChannel(name: String!, teamId: Int!, public: Boolean=false): Boolean!
    }
`;
