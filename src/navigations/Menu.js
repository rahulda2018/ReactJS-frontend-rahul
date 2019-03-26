import React, { Component } from "react";
import Axios from "axios";
import Products from "../components/Products";
import ReactDOM from "react-dom";
import { NavLink } from "react-router-dom";

import "./../css/Menu.css";

/**
 * Menu class to generate the Menu 2 levels and links
 * Upper Menu - Page navigation
 * Lower Menu - Department and Search filter
 *
 * @author Rahul Das Adhikary, rahul.das.adhikary@gmail.com, +91-9880978662
 */
class Menu extends Component {
  /**
   * Constructor
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: false
    };

    this.getData = this.getData.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  /**
   * Retrieves the department list in the Lower Menu panel
   */

  getData() {
    Axios.get(`https://backendapi.turing.com/departments`)
      .then(json => {
        //console.log(json.data);
        this.setState({
          data: json.data,
          loading: false
        });
      })
      .catch(e => {
        console.error("Failed to retrieve department list", e);
        this.setState({
          data: [],
          loading: false
        });
      });
  }

  /**
   * Sets the department and generate the poduct list according to the department selection
   * Corresponding Category list(Left panel) also gets populated after this action
   */
  setDepartments = dept_id => e => {
    global.selectedDept = dept_id;
    global.selectedCategory = 0;
    global.searchQuery = "";
    var div = document.createElement("div");
    ReactDOM.render(<Products />, div);
    document.getElementById("productPanel").childNodes[0].remove();
    document.getElementById("productPanel").appendChild(div);
  };

  /**
   * THis will generate the search result
   * @param query Search query for a product item
   */
  search = query => e => {
    var serchquery = document.getElementById("searchquery").value;
    if (serchquery === "") {
      alert("Please enter your search item");
    }
    global.selectedDept = 0;
    global.selectedCategory = 0;
    global.searchQuery = serchquery;
    global.searchQuery_hold = serchquery;
    var div = document.createElement("div");
    ReactDOM.render(<Products />, div);
    document.getElementById("productPanel").childNodes[0].remove();
    document.getElementById("productPanel").appendChild(div);

    document.getElementById("searchquery").value = "";
    global.searchQuery = "";
  };

  /**
   * THis will update global selected Department value and
   * populate the product list accordingly
   */
  updateGlobalvalues = dept_id => e => {
    global.selectedDept = dept_id;
    global.searchQuery = "";

    var div = document.createElement("div");
    ReactDOM.render(<Products />, div);
    document.getElementById("productPanel").childNodes[0].remove();
    document.getElementById("productPanel").appendChild(div);
  };

  /**
   * Default component renderer
   */
  render() {
    if (this.state.loading) {
      return <p>Loading..</p>;
    }

    let signInOut = "Sign In";
    let userLabel = "User";
    let jwtToken = sessionStorage.getItem("jwtToken");
    let userName = sessionStorage.getItem("loggedInUser");

    //Updating User label
    if (!jwtToken || jwtToken === "") {
      signInOut = "Sign In";
      userName = "User";
    } else {
      signInOut = "Sign Out";
      userName = userLabel;
    }
    //NavLink to create the Menus
    let links = [
      <NavLink
        key="home"
        className="menu__link"
        to="/home"
        exact
        activeClassName={"menu__link menu__link--active"}
        onClick={this.updateGlobalvalues(0)}
      >
        <i className="fa fa-home" />
        <small>
          <b>&nbsp;Home</b>
        </small>
      </NavLink>,
      <NavLink
        className="menu__link"
        to="/order"
        exact
        activeClassName={"menu__link menu__link--active"}
      >
        <small>
          <b>Order</b>
        </small>
      </NavLink>,
      <NavLink
        className="menu__link"
        to="/about"
        exact
        activeClassName={"menu__link menu__link--active"}
      >
        <small>
          <b>About</b>
        </small>
      </NavLink>,
      <NavLink
        className="menu__link"
        to="/contact"
        exact
        activeClassName={"menu__link menu__link--active"}
      >
        <i className="fa fa-support" />
        <small>
          <b>&nbsp;Contact Us</b>
        </small>
      </NavLink>,
      <NavLink
        className="menu__link"
        to="/profile"
        exact
        activeClassName="menu__link menu__link--active"
      >
        <small>
          {" "}
          <b>Hello !! </b>
          <i className="fa fa-user" />
          &nbsp;{" "}
          <b id="usernamemenu">
            <small>{userName}</small>
          </b>
        </small>
      </NavLink>,
      <NavLink
        className="menu__link"
        to="/signIn"
        exact
        activeClassName="menu__link menu__link--active"
      >
        <i className="fa fa-user" />
        <small>
          &nbsp;
          <b id="signinplaceholder">{signInOut}</b>
        </small>
      </NavLink>
    ];

    //Rendering the Upper Menu
    let linksMenu = links.map((link, index) => {
      return (
        <li key={index} className="menu__list-item">
          {link}
        </li>
      );
    });

    //Rendering Lower Menu whicg is department List
    let linksSubmenu = this.state.data.map((dept, index) => {
      let toParam = `/${dept.name}`;
      return (
        <li key={dept.department_id} className="submenu__list-item">
          <NavLink
            key={dept.department_id}
            className="submenu__link"
            to={toParam}
            exact
            strict
            activeClassName={"submenu__link submenu__link--active"}
            onClick={this.setDepartments(dept.department_id)}
          >
            <b>
              <small>{dept.name}</small>
            </b>
          </NavLink>
        </li>
      );
    });

    // Rendering the menu
    return (
      <div>
        <nav className="menu">
          <h1
            style={{
              backgroundImage: "url(" + this.props.logo + ")"
            }}
            className="menu__logo"
          >
            TShirt Shop
          </h1>

          <div className="menu__right">
            <ul className="menu__list">{linksMenu}</ul>
          </div>
        </nav>
        <nav className="submenu">
          <ul>
            <small>
              <li key="dept-label" className="submenu__list-item">
                {" "}
                <b className="textcol_white">Departments :</b>
              </li>
              <li key="all" className="submenu__list-item">
                <NavLink
                  key="all"
                  className="submenu__link"
                  to="/all"
                  exact
                  activeClassName={"submenu__link submenu__link--active"}
                  onClick={this.setDepartments(0)}
                >
                  <b>
                    <small>All</small>
                  </b>
                </NavLink>
              </li>
              {linksSubmenu}
            </small>
          </ul>

          <div className="menu__right">
            <ul className="menu__list">
              <li className="submenu__list-item">
                <input
                  type="text"
                  className="category-text"
                  id="searchquery"
                  placeholder="Search products...."
                  name="search"
                />
                <button onClick={this.search("")} className="search_button">
                  <i className="fa fa-search" />
                  <b> Search</b>
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    );
  }
}

export default Menu;
