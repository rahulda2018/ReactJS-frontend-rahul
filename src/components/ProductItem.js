import React, { Component } from "react";
import Axios from "axios";
import Cart from "./Cart";
import ReactDOM from "react-dom";
import StarRatingComponent from "react-star-rating-component";

import "./../css/Navigation.css";

/**
 * THis class Product Item div under the product page
 */
class ProductItem extends Component {
  /**
   * Constructor to pass the product item object
   * @param {*} props item object
   */
  constructor(props) {
    super(props);
    this.state = {
      item: props.item
    };
  }

  /**
   * This will be called when 'Add to Cart' is clicked against an item and the
   * item will be added to Cart and quick view will be displayed on the rght panel
   */
  addToCart = (cartattributes, prodquantity, item) => e => {
    for (let v of global.cartItemsArr) {
      if (v.name === item.name) {
        alert("Item already exists in the Cart...");

        return;
      }
    }

    let finalprice =
      item.discounted_price === "0.00"
        ? parseFloat(item.price)
        : parseFloat(item.discounted_price);

    let cartItem = {
      item_id: item.product_id,
      name: item.name,
      attributes: cartattributes,
      price: finalprice,
      quantity: prodquantity,
      subtotal: finalprice,
      thumbnail: item.thumbnail
    };

    //Adding to shopping cart at the back end
    let cartId = sessionStorage.getItem("shopping-cart-id");
    Axios.post(`https://backendapi.turing.com/shoppingcart/add`, {
      cart_id: cartId,
      product_id: item.product_id,
      attributes: item.thumbnail
    })
      .then(res => {
        //console.log(res.data);
        //Placeholder for UI update
        global.cartItemsArr.push(cartItem);
        var div = document.createElement("div");
        ReactDOM.render(<Cart key={cartItem.item_id} item={cartItem} />, div);
        document.getElementById("cartPane").childNodes[0].remove();
        document.getElementById("cartPane").appendChild(div);
      })
      .catch(e => {
        console.error("Failed to add to cart user:", e);
        alert("Failed to add to cart user:");
        return;
      });
  };

  /**
   * Default component render
   */

  render() {
    let thePrice = "";
    let item = this.state.item;
    if (!item || item === undefined) {
      return <div />;
    } else {
      if (item.discounted_price === "0.00") {
        //No Discount
        thePrice = (
          <div>
            <div>
              <b className="textcol_orange">
                <small>Price : </small>
              </b>
              <small>
                <b className="textcol_maroon">&#36; {item.price}</b>{" "}
              </small>
            </div>
            <div>
              <small>
                <i>No Discount</i>
              </small>
            </div>
          </div>
        );
      } else {
        //Discounted Price
        thePrice = (
          <div>
            <div>
              <b className="textcol_orange">
                <small>Price: </small>
              </b>
              <small>
                <b className="textcol_maroon">&#36; {item.discounted_price}</b>
              </small>{" "}
              {"    "}
            </div>
            <div>
              <small
                style={{
                  textDecorationLine: "line-through"
                }}
              >
                <b>M.R.P.</b> &#36;{item.price}
              </small>
            </div>
          </div>
        );
      }

      return (
        //creating item panel or div
        <div className="prod-item " key={item.product_id}>
          <div className="column">
            <img
              alt="/"
              align="center"
              src={require(`./../images/products/${item.thumbnail}`)}
            />
            <p>
              <small>
                <b className="textcol_orange">Quantity</b>(1 to 5):{" "}
                <input
                  className="form_num"
                  type="number"
                  name="quantity"
                  min="0"
                  max="5"
                  defaultValue="1"
                  border-radius="12px"
                />
              </small>
            </p>
            <p>
              <small>
                <b className="textcol_orange">Size: </b> &nbsp;&nbsp;
                <select name="size">
                  <option value="XL">Extra Large</option>
                  <option value="L">Large</option>
                  <option value="M">Midium</option>
                  <option value="S">Small</option>
                  <option value="XS">Extra Small</option>
                </select>
              </small>
            </p>
            {thePrice}
          </div>
          <div className="column">
            <b>{item.name}</b>
            <div>
              <StarRatingComponent name={item.name} startCount={5} />
            </div>
            <p>
              <small>{item.description}</small>
            </p>

            <p>
              <button
                className="prod_button"
                key={item.name}
                price={item.discounted_price}
                onClick={this.addToCart("LG red", 1, item)}
              >
                <b>Add To Cart</b>
              </button>
              {"    "}
              <button className="prod_button">
                <b>Buy Now</b>
              </button>
            </p>
          </div>
        </div>
      );
    }
  }
}

export default ProductItem;
