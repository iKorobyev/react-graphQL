import React, { Component } from "react";

import { Query } from "react-apollo";
import gql from "graphql-tag";

import Preloader from "./Preloader";
import { Button } from "reactstrap";

const QUERY = gql`
  query {
    viewer {
      id
      login
      repositories(first: 10) {
        nodes {
          name
          url
          owner {
            login
            avatarUrl
          }
        }
      }
    }
  }
`;

class UserRepo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      owner: "",
      name: "",
      isPage: false
    };
  }
  render() {
    return (
      <Query query={QUERY}>
        {({ loading, error, data }) => {
          if (loading) return <Preloader />;
          if (error)
            return (
              <p>
                Видимо, вы вели неверный токен{" "}
                <Button
                  color="primary"
                  onClick={() => {
                    localStorage.setItem("token", prompt("Введите токен", ""));
                    window.location.reload();
                  }}
                >
                  Ввести!
                </Button>
              </p>
            );
          const prs = data.viewer.repositories.nodes;
          if (!this.state.isPage) {
            return (
              <div align="center" className="reposes">
                <h4>{data.viewer.login}</h4>
                {prs.map((data, key) => {
                  return (
                    <div
                      className="repo"
                      key={key}
                      onClick={() =>
                        this.props.set(data.owner.login, data.name, true)
                      }
                    >
                      <img
                        src={data.owner.avatarUrl}
                        width="50px"
                        height="50px"
                        alt="img"
                        align="left"
                      />
                      <h1>{data.name}</h1>
                    </div>
                  );
                })}
              </div>
            );
          }
        }}
      </Query>
    );
  }
}

export default UserRepo;
