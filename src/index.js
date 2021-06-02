import React from "react";
import ReactDOM from "react-dom";

import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import apolloLogger from "apollo-link-logger";
import { ApolloLink } from "apollo-link";
import ApolloClient from "apollo-client";
import { ApolloProvider } from "react-apollo";

import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "reactstrap";

import "./styles.css";

import App from "./components/App";

function token() {
  localStorage.setItem("token", prompt("Ваш github token: ", ""));
  window.location.reload();
}

const httpLink = new HttpLink({
  uri: "https://api.github.com/graphql",
  headers: {
    authorization: "Bearer " + localStorage.getItem("token")
  }
});

const link = ApolloLink.from([apolloLogger, httpLink]);

const cache = new InMemoryCache({
  logger: console.log,
  loggerEnabled: false
});

const client = new ApolloClient({
  link,
  cache
});

ReactDOM.render(
  <ApolloProvider client={client}>
    {localStorage.getItem("token") == null ? (
      <Button color="primary" className="enter" onClick={() => token()}>
        Ввести GitToken
      </Button>
    ) : (
      <App />
    )}
  </ApolloProvider>,
  document.getElementById("root")
);
