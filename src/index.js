const { ApolloServer } = require("apollo-server");
const fs = require("fs");
const path = require("path");
const customers = require("./sampleData");

const resolvers = {
  Query: {
    checkingAccount: (parent, args) => {
      if (args.checkingAccountNumber) {
        const customer = customers.filter((customer) => {
          return customer.checkingAccountNumber === args.checkingAccountNumber;
        });
        return customer;
      }
      return customers;
    },
  },

  CheckingAccount: {
    transactions: (parent, args) => {
      if (args.merchant) {
        const transactionsList = [];
        const merchant = args.merchant;

        for (const customer in customers) {
          for (const transaction in customers[customer].transactions) {
            if (
              customers[customer].transactions[transaction].merchant ===
              merchant
            ) {
              transactionsList.push(
                customers[customer].transactions[transaction]
              );
            }
          }
        }
        return transactionsList;
      }
      return customers[0].transactions;
    },
  },
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
  resolvers,
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
