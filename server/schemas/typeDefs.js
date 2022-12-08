const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID!
    username: String
    email: String
    password: String
    bookCount: Int
    savedBooks: [Book]
  }

  type Book {
    bookId: String
    authors: [String]
    description: String    
    title: String
    image: String
    link: String
    
  }
  
  type Auth {
    token: ID!
    username: User
  }
  
  input BookInfo {
    bookId: ID!
    authors: [String]
    desciption: String
    title: String
    image: String
    link: String
  }

  type Query {
    me: User
  }

  type: Mutation {
    login(email: String!, password: String!): Auth
    addUser(userName: String!, email: String!, password: String!): Auth
    saveBook(newBook: BookInput): User
    deleteBook(bookId: String!): User
  }
  `;

module.exports = typeDefs;
