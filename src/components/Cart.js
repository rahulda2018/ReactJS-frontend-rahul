import React, { Component } from "react";
import Axios from "axios";
import PrePayment from "./PrePayment";
import ReactDOM from "react-dom";

import "./../css/Navigation.css";

/**
 * This class component will create the Cart panel on the right side of the application
 * @author Rahul Das Adhikary, rahul.das.adhikary@gmail.com, +91-9880978662
 */
class Cart extends Component {
  //Constructor
  constructor(props) {
    super(props);
    this.state = {
      cartItem: props.item,
      cartItemsArr: [],
      quantity: 0,
      subtotal: 0.0,
      loading: false
    };

    this.generateShoppingCart = this.generateShoppingCart.bind(this);
    this.clearCart = this.clearCart.bind(this);
  }

  componentDidMount() {
    this.generateShoppingCart();
  }

  /**
   * 'Clear Cart' button clicked event
   * @param item Product item passed through button click
   */
  clearCart = item => e => {
    this.setState({
      loading: true
    });
    let cartId = sessionStorage.getItem("shopping-cart-id");
    Axios.delete(`https://backendapi.turing.com/shoppingcart/empty/${cartId}/`)
      .then(json => {
        global.cartItemsArr = [];
        this.generateShoppingCart();
      })
      .catch(e => {
        console.error("Failed to clear Cart..", e);
        this.setState({
          loading: false
        });
      });
  };
  /**
   * THis function will generate the Shopping Cart items on the right side panel of the appliction
   */
  generateShoppingCart() {
    this.setState({
      loading: true
    });

    let quantity = 0;
    let subtotal = 0.0;
    let cartItemsArr = global.cartItemsArr.map(item => {
      quantity = quantity + parseInt(item.quantity);
      subtotal = subtotal + parseFloat(item.price);
      let cartthumbnail = item.thumbnail;
      if (typeof cartthumbnail === "undefined") {
        cartthumbnail = item.attributes;
      }

      return (
        <div className="prod-item-small" key={item.item_id}>
          <p>
            <img
              key={item.item_id}
              alt="/"
              width="60%"
              height="70px;"
              align="center"
              src={require(`./../images/products/${cartthumbnail}`)}
            />
          </p>
          <small>
            <b>
              {item.name} : &#36; {"  "}
              {item.price}
            </b>
          </small>
        </div>
      );
    });
    this.setState({
      quantity: quantity,
      subtotal: subtotal,
      cartItemsArr: cartItemsArr,
      loading: false
    });
  }

  /**
   * This to take the control to the Cart details panel
   */
  proceedToBuy = () => e => {
    var div = document.createElement("div");
    ReactDOM.render(<PrePayment />, div);
    document.getElementById("productPanel").childNodes[0].remove();
    document.getElementById("productPanel").appendChild(div);
  };

  render() {
    if (this.state.loading) {
      return <h3 className="textcol_orange">Loading.....</h3>;
    }

    /**
     * Cart Renderer
     */
    return (
      <div className="row">
        <div className="prod-item-small">
          <p className="textcol_orange">
            <i className="fa fa-shopping-cart" />
            &nbsp;
            <b>Cart </b>
            <b>{this.state.quantity} Item(s)</b>
          </p>
          <p className="textcol_maroon">
            <small>
              <b>Subtotal (&#36; {this.state.subtotal.toFixed(2)})</b>
            </small>
          </p>
          <p>
            <button className="prod_button" onClick={this.proceedToBuy()}>
              <b>Proceed to Buy</b>
            </button>

            <button className="prod_button" onClick={this.clearCart()}>
              <b>Clear Cart</b>
            </button>
          </p>
        </div>
        {this.state.cartItemsArr}
      </div>
    );
  }
}

export default Cart;
