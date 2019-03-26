import React, { Component } from "react";
import Axios from "axios";

import "./../css/Navigation.css";

/**
 * THis class provides the Cart item details, user can remove item,
 * clear the Cart and make the initiate the payment from this panel
 */
class Prepayment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
    this.generateShoppingCart = this.generateShoppingCart.bind(this);
  }
  /**
   * This will be called while user has decided to check out and make the payment
   */
  checkout = () => e => {
    alert("Incomplete: Time Constraint :-) ");
    return;
  };

  /**
   * THis function will be called when Clear Cart button is clicked and this will clear the Cart
   */
  clearCart = item => e => {
    let cartId = sessionStorage.getItem("shopping-cart-id");
    Axios.delete(`https://backendapi.turing.com/shoppingcart/empty/${cartId}/`)
      .then(json => {
        this.generateShoppingCart();
      })
      .catch(e => {
        console.error("Failed to clear Cart..", e);
        alert("Failed to clear Cart..");
        return;
      });
  };
  /**
   * This will remove a particular item from the Cart,
   * which is selected by clicking he '*Remove' button
   *
   * @param item Item to be passed for removal from Cart
   */
  removeItem = item => e => {
    Axios.delete(
      `https://backendapi.turing.com/shoppingcart/removeProduct/${item.item_id}`
    )
      .then(json => {
        this.generateShoppingCart();
      })
      .catch(e => {
        console.error("Failed to remove Item from Cart..", item.name);
        alert("Failed to remove Item from Cart.");
        return;
      });
  };

  /**
   * This will be called to initialize the values at the beginning
   */
  componentDidMount() {
    this.generateShoppingCart();
  }

  /**
   * This will generate the Cart from the backend API.
   *
   * If the Cart Cart-Id has not been generated yet, this will generate the Cart-Id,
   * otherwise this will use the Cart-Id to fetch the Cart items
   */
  generateShoppingCart() {
    this.setState({
      loading: true
    });
    let cartId = sessionStorage.getItem("shopping-cart-id");

    // If the Cart Cart id has not been generated yet, this will generate the Cart-Id,
    // Otherwise this will use the Cart-Id to fetch the Cart items
    if (!cartId || cartId === "") {
      let url = "https://backendapi.turing.com/shoppingcart/generateUniqueId";
      Axios.get(url)
        .then(json => {
          //console.log(json.data);
          cartId = json.data.cart_id;
          sessionStorage.setItem("shopping-cart-id", cartId);
          this.setState({
            loading: false
          });
        })
        .catch(e => {
          console.error("Failed to generate Cart Id..", e);
          this.setState({
            loading: false
          });
        });
    } else {
      //Generating Cart Items using Cart-Id
      let url = `https://backendapi.turing.com/shoppingcart/${cartId}`;
      Axios.get(url)
        .then(json => {
          //console.log(json.data);
          global.cartItemsArr = json.data;
          this.setState({
            loading: false
          });
        })
        .catch(e => {
          console.error("Failed to generate Cart..", e);
          this.setState({
            loading: false
          });
        });
    }
  }

  /**
   * Default component renderer
   */
  render() {
    if (this.state.loading) {
      return <h3 className="textcol_orange">Loading.....</h3>;
    }
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
        <tr key={item.item_id}>
          <td>
            <div className="row">
              <img
                key={item.item_id}
                alt="/"
                width="50px;"
                height="50px;"
                align="center"
                src={require(`./../images/products/${cartthumbnail}`)}
              />
              &nbsp;&nbsp;&nbsp;
              <small>
                <b>{item.name}</b>
              </small>
            </div>
          </td>
          <td>
            <small>XL</small>
          </td>
          <td>
            <input
              className="textc"
              type="number"
              name="quantity"
              min="0"
              max="5"
              defaultValue="1"
            />
          </td>
          <td className="textcol_maroon">
            <b>
              <small> &#36; {item.price}</small>
            </b>
          </td>
          <td>
            <button className="remove_button" onClick={this.removeItem(item)}>
              <i className="fa fa-remove" />
              <b>
                <small>&nbsp;Remove</small>
              </b>
            </button>
          </td>
        </tr>
      );
    });

    //Checking whethere Cart is empty or not
    let cartItemsEmpty = <p />;
    if (parseInt(quantity) === 0) {
      cartItemsEmpty = <p className="textcol_maroon"> Your Cart is empty</p>;
    }

    return (
      <div align="center">
        <p className="textcol_orange">
          <i className="fa fa-shopping-cart" />
          &nbsp;
          <b>Cart Details - {quantity} Item(s)</b>
        </p>
        <p className="textcol_maroon">
          <small>
            <b>Subtotal (&#36; {subtotal.toFixed(2)})</b>
          </small>
        </p>
        <table align="center" className="w3-table w3-bordered table_payment">
          <tbody>
            <tr color="lightgray">
              <th>Item</th>
              <th>Size</th>
              <th>Quantity</th>
              <th>Price</th>
              <th className="textcol_maroon">
                <i className="fa fa-remove" />
                Remove Item
              </th>
            </tr>

            {cartItemsArr}
          </tbody>
        </table>
        {cartItemsEmpty}
        <p>
          <button className="button" onClick={this.checkout()}>
            <b>Checkout</b>
          </button>
          <button className="button" onClick={this.clearCart()}>
            <b>Clear Cart</b>
          </button>
        </p>
      </div>
    );
  }
}

export default Prepayment;
