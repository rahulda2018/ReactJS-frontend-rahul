import React, { Component } from "react";
import Menu from "./navigations/Menu";
import Products from "./components/Products";
import LogIn from "./components/LogIn";
import logo from "./images/images/tshirtshop.png";
import "./App.css";
import Axios from "axios";

import { BrowserRouter as Router, Route } from "react-router-dom";
import CustomerProfile from "./components/CustomerProfile";

/**
 * Main entry point of the Application
 */
class App extends Component {
  constructor() {
    super();
    global.cartItemsArr = [];
    global.selectedCategory = 0;
    global.selectedDept = 0;
    global.searchQuery = "";
  }

  /**
   * Used to generate Cart id or the cart items at the beginning
   */
  componentDidMount() {
    this.generateShoppingCart();
  }
  /**
   * THis will generate the shopping cart id, if already created,
   * then it will retrieve the cart items by passing the cart-is
   */
  generateShoppingCart() {
    let cartId = sessionStorage.getItem("shopping-cart-id");
    if (!cartId || cartId === "") {
      let url = "https://backendapi.turing.com/shoppingcart/generateUniqueId";
      Axios.get(url)
        .then(json => {
          //console.log(json.data);
          cartId = json.data.cart_id;
          sessionStorage.setItem("shopping-cart-id", cartId);
        })
        .catch(e => {
          console.error("Failed to generate Cart Id..", e);
        });
    } else {
      let url = `https://backendapi.turing.com/shoppingcart/${cartId}`;
      Axios.get(url)
        .then(json => {
          //console.log(json.data);
          global.cartItemsArr = json.data;
        })
        .catch(e => {
          console.error("Failed to generate Cart..", e);
        });
    }
  }

  /**
   * Application default renderer
   */
  render() {
    let menu = <Menu logo={logo} />;

    return (
      //Rendering Router or the Browser Router Routes
      <Router>
        <div className="App">
          <div className="container center">{menu}</div>
          <Route
            path={["/", "/home", "/all", "/Nature", "/Regional", "/Seasonal"]}
            exact
            strict
            render={() => {
              return (
                <div id="productPanel">
                  <Products />
                </div>
              );
            }}
          />

          <Route
            path="/order"
            exact
            strict
            render={() => {
              return <h1>Order Called</h1>;
            }}
          />
          <Route
            path="/contact"
            exact
            strict
            render={() => {
              return (
                <div>
                  <h3 className="textcol_orange">Rahul Das Adhikary</h3>
                  <p>Email: rahul.das.adhikary@gmail.com</p>
                  <p>Skype: rahul.das.adhikary</p>
                  <p>Phone: +91-9880978662</p>
                  <p>Bangaore, India</p>
                </div>
              );
            }}
          />

          <Route
            path="/about"
            exact
            render={() => {
              return (
                <div>
                  <h2>TShirt Shop</h2>
                  <img
                    alt="/"
                    width="500px"
                    height="250px"
                    align="center"
                    src={require("./images/images/tshirtshop.png")}
                  />
                  <p>
                    This demo is developed for technical assesment purpose..
                  </p>
                </div>
              );
            }}
          />
          <Route
            path="/profile"
            exact
            render={() => {
              return (
                <div id="productPanel">
                  <CustomerProfile />
                </div>
              );
            }}
          />
          <Route
            path="/signIn"
            exact
            render={() => {
              return (
                <div id="productPanel">
                  <LogIn />
                </div>
              );
            }}
          />
        </div>
      </Router>
    );
  }
}

export default App;
