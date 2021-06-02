import React, { Component } from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";

import { Button } from "reactstrap";
import Preloader from "./Preloader";

export default class RepoPage extends Component {
  render() {
    console.log(this.props);
    const QUERY = gql`
      query {
        repository(name: "${this.props.name}", owner: "${this.props.owner}") {
          createdAt
          updatedAt
          issues {
            totalCount
          }
          languages(first: 10) {
            totalCount
            edges {
              size
              node {
                color
                name
              }
            }
          }
          forkCount
        }
      }
    `;
    return (
      <div>
        <Query query={QUERY}>
          {({ loading, error, data }) => {
            if (loading) return <Preloader />;
            if (error) return <p align="center">Error! {error.message}</p>;
            return (
              <div align="center" className="page">
                <Button
                  className="close"
                  align="rigth"
                  onClick={() =>
                    this.props.set(this.props.name, this.props.owner, false)
                  }
                >
                  x
                </Button>
                <br />
                <div>Создан: {data.repository.createdAt}</div>
                <div>Изменён: {data.repository.updatedAt}</div>
                <div>Issues count: {data.repository.issues.totalCount}</div>
                <div>Количество форков: {data.repository.forkCount}</div>
                <div>
                  Используемые языки:
                  <ul>
                    {data.repository.languages.edges.map((data, key) => {
                      return (
                        <li
                          align="left"
                          key={key}
                          style={{
                            color: data.node.color
                          }}
                        >
                          <div>{data.node.name}</div> Количество строк кода:{" "}
                          {data.size}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            );
          }}
        </Query>
      </div>
    );
  }
}
