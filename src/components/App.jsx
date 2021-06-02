import React, { Component } from "react";
import PubRepos from "./PubRepos";
import UserRepos from "./UserRepos";

import { Button } from "reactstrap";
import RepoPage from "./RepoPage";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userRepos: true,
      owner: "",
      name: "",
      isPage: false
    };
  }

  setIsPage(o, n, i) {
    this.setState(() => ({
      owner: o,
      name: n,
      isPage: i
    }));
  }

  render() {
    return (
      <React.Fragment>
        <div className="header">
          <br />
          <div align="center">
            <Button
              color="info"
              className="pub"
              onClick={() => {
                this.setState(() => ({ userRepos: false }));
              }}
            >
              Публичные репозитории
            </Button>
            <Button
              color="info"
              className="user"
              onClick={() => {
                this.setState(() => ({ userRepos: true }));
              }}
            >
              Ваши репозитории
            </Button>
            <Button
              className="exit"
              color="danger"
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
            >
              Выйти
            </Button>
          </div>
        </div>
        {this.state.userRepos ? (
          <UserRepos set={(o, n, i) => this.setIsPage(o, n, i)} />
        ) : (
          <PubRepos set={(o, n, i) => this.setIsPage(o, n, i)} />
        )}
        {this.state.isPage && (
          <RepoPage
            name={this.state.name}
            owner={this.state.owner}
            set={(o, n, i) => this.setIsPage(o, n, i)}
          />
        )}
      </React.Fragment>
    );
  }
}

export default App;
