import React, { Component } from "react";

import { Query } from "react-apollo";
import gql from "graphql-tag";

import { Button } from "reactstrap";

import Preloader from "./Preloader";

class PubRepos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDefault: true,
      isSearch: false,
      searchText: "*",
      cursor: "$afterCursor",
      queryValue: "Search($afterCursor: String)",
      page: "after: "
    };
  }
  searchButton() {
    this.setState(() => {
      return {
        isDefault: false,
        isSearch: true,
        searchText: document.getElementById("searchInput").value
      };
    });
  }

  nextPage(cursor) {
    let temp = cursor.toString();
    this.setState(() => {
      return {
        cursor: '"' + temp + '"',
        queryValue: "Search",
        page: "after: "
      };
    });
  }

  prevPage(cursor) {
    let temp = cursor.toString();
    this.setState(() => {
      return {
        cursor: '"' + temp + '"',
        queryValue: "Search",
        page: "before: "
      };
    });
  }

  render() {
    const DEFAULT_QUERY = gql`
    query ${this.state.queryValue}{
      search(query: "is:public", type: REPOSITORY, ${this.state.page +
        this.state.cursor}, first: 10) {
    repositoryCount
    pageInfo {
      endCursor
      startCursor
      hasNextPage
      hasPreviousPage
    }
    nodes {
      ... on Repository {
        id
        name
        owner {
          login
          avatarUrl(size: 10)
          url
        }
      }
    }
  }
}
  `;
    let queryText = this.state.searchText;
    const SEARCH_QUERY = gql`
    query ${this.state.queryValue}{
      search(query: "${queryText}", type: REPOSITORY, ${this.state.page +
      this.state.cursor}, first: 10) {
      repositoryCount
      pageInfo {
        endCursor
        startCursor
        hasNextPage
        hasPreviousPage
      }
      nodes {
        ... on Repository {
        id
        name
        owner {
          login
          avatarUrl(size: 10)
          url
        }
      }
    }
  }
}
  `;
    return (
      <Query query={this.state.isDefault ? DEFAULT_QUERY : SEARCH_QUERY}>
        {({ loading, error, data }) => {
          if (loading) return <Preloader />;
          if (error) return alert(error.massage);
          const prs = data.search;
          if (!this.state.isPage) {
            return (
              <div align="center" className="reposes">
                <input id="searchInput" />
                <Button color="success" onClick={() => this.searchButton()}>
                  Поиск
                </Button>
                <br />
                {data.search.repositoryCount} результатов
                {prs.nodes.map((data, key) => {
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
                      <i>{data.owner.login}</i>
                      <h1 align="right">{data.name}</h1>
                    </div>
                  );
                })}
                {prs.pageInfo.hasPreviousPage && (
                  <Button
                    onClick={() => this.prevPage(prs.pageInfo.startCursor)}
                  >
                    Prev
                  </Button>
                )}
                <Button onClick={() => this.nextPage(prs.pageInfo.endCursor)}>
                  Next
                </Button>
              </div>
            );
          }
        }}
      </Query>
    );
  }
}

export default PubRepos;
