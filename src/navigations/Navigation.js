import React, { Component } from "react";
import "./Navigation.css";
import Menu from "./Menu";
import logo from "./logo.png";
import { BrowserRouter as Router, Link } from "react-router-dom";
import Route from "react-router-dom/Route";

/**
 * TODO, This class needs to be removed, kepping it for the reference
 * Navigation menu that is repsposible for populating Menu
 *
 * @author Rahul Das Adhikary, rahul.das.adhikary@gmail.com, +91-9880978662
 */
class Navigation extends Component {
  state = {};
  render() {
    let links = [
      { label: "Home", link: "#home", active: true },
      { label: "About", link: "#about" },
      { label: "Portfolio", link: "#portfolio" },
      { label: "Contact Us", link: "#contact-us" }
    ];

    let menu = <Menu links={links} logo={logo} />;

    return (
      <Router>
        <Route
          path="/"
          render={() => {
            return (
              <div>
                <div class="header">
                  <h1>Assignment</h1>
                  <p>Resize the browser window to see the responsive effect.</p>
                </div>
                <div className="container center">{menu}</div>

                <div class="row">
                  <div class="column1">
                    <h2>Column</h2>
                    <p>Left Nav Pane</p>
                  </div>
                  <div class="column2">
                    <h2>Column</h2>
                    <p>{menu.props.label} is selected</p>
                  </div>
                  <div class="column3">
                    <h2>Column</h2>
                    <p>Add Pane</p>
                  </div>
                </div>
                <div class="footer">
                  <p>Footer</p>
                </div>
              </div>
            );
          }}
        />
        <Route
          path="/about"
          render={() => {
            return <h1>About Called</h1>;
          }}
        />
      </Router>
    );
  }
}

export default Navigation;
