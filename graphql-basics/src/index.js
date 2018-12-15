import { GraphQLServer } from "graphql-yoga";

// * demo data
const users = [
  {
    id: "1",
    name: "Tom",
    email: "tommy@tom.com",
    age: 23
  },
  {
    id: "2",
    name: "Mike",
    email: "Mike@tom.com",
    age: 23
  },
  {
    id: "3",
    name: "Jude",
    email: "Jude@tom.com",
    age: 53
  }
];

const posts = [
  {
    id: "123fs",
    title: "A day at the office",
    body: "Something happened",
    published: true,
    author: "1"
  },
  {
    id: "123esd",
    title: "A day at the shops",
    body: "Something did not happen happened",
    published: true,
    author: "2"
  },
  {
    id: "1234sf",
    title: "A day at the home",
    body: "Something happened",
    published: false,
    author: "2"
  }
];

const comments = [
  {
    id: "1211",
    text: "I am at the beach",
    author: "1",
    post: "123fs"
  },
  {
    id: "1212",
    text: "Where am I?",
    author: "2",
    post: "1234sf"
  },
  {
    id: "1213",
    text: "Headache much",
    author: "1",
    post: "1234sf"
  },
  {
    id: "1214",
    text: "Is it tuesday already?",
    author: "3",
    post: "123esd"
  }
];

// * Type definitions (schema)
const typeDefs = `
      type Query {
        users(query:String):  [User!]!
        posts(query:String): [Post!]!
        me:User!
        post: Post!
        comments: [Comment!]!

      }
      type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
      }

      type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
      }

      type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
      }
  `;

// * Resolvers
const resolvers = {
  Query: {
    comments(parent, args, ctx, info) {
      return comments;
    },
    posts(parent, args, ctx, info) {
      if (!args.query) {
        return posts;
      }
      return posts.filter(post => {
        const isTitleMatch = post.title
          .toLowerCase()
          .includes(args.query.toLowerCase());
        const isBodyMatch = post.body
          .toLowerCase()
          .includes(args.query.toLowerCase());
        return isBodyMatch || isTitleMatch;
      });
    },
    users(parent, args, ctx, info) {
      console.log(args);
      if (!args.query) {
        return users;
      }
      return users.filter(user => {
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      });
    },
    me() {
      return {
        id: "123089",
        name: "Tom",
        email: "tom@tom.com"
      };
    },
    post() {
      return {
        id: "1231sdf2",
        title: "Why I find small things scary",
        body: "This is quite the tale...",
        published: true
      };
    }
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find(user => {
        //* find for single users
        return user.id === parent.author;
      });
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => {
        //* filter for arrays
        return comment.post === parent.id;
      });
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter(post => {
        //* filter for arrays
        return post.author === parent.id;
      });
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => {
        return comment.id === parent.author;
      });
    }
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find(user => {
        return user.id === parent.author;
      });
    },
    post(parent, args, ctx, info) {
      return posts.find(post => {
        return post.id === parent.post;
      });
    }
  }
};

const newServer = new GraphQLServer({
  typeDefs,
  resolvers
});

newServer.start(() => {
  console.log("The server is running...");
});
