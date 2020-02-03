import React from "react";
import { Router, Switch, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import GoogleMap from "./components/Map/GoogleMap";
import DroneInfo from "./components/DroneInfo/DroneInfo";
import droneIcon from "./assets/droneIcon.png";
import db from "./firebaseConfig";
import "./App.css";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      userEmail: "",
      userPass: "",
      isAuth: true
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    var usersRef = db.collection("users");
    if (this.state.userEmail != undefined && this.state.userEmail != "") {
      var matches = usersRef.doc(this.state.userEmail);
      if (matches != undefined) {
        matches.get().then(doc => {
          if (
            doc.data() != undefined &&
            doc.data().Password === this.state.userPass
          ) {
            this.setState({ isAuth: true });
          }
        });
      }
    }
  }

  handleEmailChange = event => {
    this.setState({ userEmail: event.target.value });
  };

  handlePassChange = event => {
    this.setState({ userPass: event.target.value });
  };

  render() {
    if (this.state.isAuth) {
      return (
        <div className="App">
          <link
            href="https://fonts.googleapis.com/css?family=Nunito&display=swap"
            rel="stylesheet"
          />
          <Navbar></Navbar>
          <Switch>
            <Route path="/" exact component={GoogleMap}></Route>
            <Route
              path="/droneinfo"
              render={() => <DroneInfo droneId={3} />}
            ></Route>
          </Switch>
        </div>
      );
    } else {
      return (
        <div className="App">
          <form className="base-container" onSubmit={this.handleSubmit}>
            <img className="logo" src={droneIcon} alt="Drone" />
            <div className="form">
              <div className="form-group">
                <input
                  type="text"
                  name="email"
                  placeholder="Email"
                  onChange={this.handleEmailChange}
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={this.handlePassChange}
                />
              </div>
            </div>
            <div className="footer">
              <button type="button" className="btn" onClick={this.handleSubmit}>
                Login
              </button>
            </div>
          </form>
        </div>
      );
    }
  }
}

export default App;
