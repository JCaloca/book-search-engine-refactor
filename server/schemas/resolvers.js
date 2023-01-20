const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      // if request context has a valid user object return userData
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id }).select(
          '-_v -password'
        );
        return userData;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },

  Mutation: {
    // Create a new user
    addUser: async (parent, { username, email, password }) => {
      // args: username, email, password to create user's login info
      const user = await User.create({ username, email, password });

      if (!user) {
        throw new AuthenticationError('Something went wrong!');
      }
      // sign JWT with user's info and return
      const token = signToken(user);
      return { token, user };
    },
    // Find a user by their email
    loginUser: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      // if not the correct email address throw error
      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }
      // check to see if password matches db password
      const correctPw = await user.isCorrectPassword(password);
      // if not correct password throw error
      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { token, user };
    },
    saveBook: async (parent, { book }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: book } },
          { new: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        // find user and remove book from their savedBooks array
        const updatedUser = User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId: bookId } } },
          { new: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },
};

module.exports = resolvers;
