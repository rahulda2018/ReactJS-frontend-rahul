import React, { Component } from "react";
import Axios from "axios";
import Categories from "./Categories";
import Cart from "./Cart";
import ReactDOM from "react-dom";

import "./../css/Navigation.css";

/**
 * This class will generate the data related to products. Mainly this gets generated and created  the Data at the Center of the product list.
 *
 * - Pagination is supported (12 items per page)
 * - Search is supported
 * - Department and Category Filter is supported
 * @author Rahul Das Adhikary, rahul.das.adhikary@gmail.com, +91-9880978662
 */
class Products extends Component {
  _isMounted = false;

  /**
   * Constructor To create Product component
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      data: [],
      count: 0,
      loading: false
    };

    this.getData = this.getData.bind(this);
    this.clickNextPrev = this.clickNextPrev.bind(this);
  }
  /**
   * This will be called while Component mounted
   */
  componentDidMount() {
    this._isMounted = true;
    this.generateShoppingCart();
    this.getData();
  }

  /**
   * This will be called while Component unmounted
   */
  componentWillUnmount() {
    this._isMounted = false;
  }

  /**
   * Generate the quick view of the shopping cart on the right side panel.
   * This will generate the Cart from the backend API.
   *
   * If the Cart Cart-id has not been generated yet, this will generate the Cart-Id,
   * otherwise this will use the Cart-Id to fetch the Cart items
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
   * THis will generate the product resultsdepending on deperment or
   * category filter or the search filteror All items
   */
  getData() {
    const { page } = this.state;
    this.setState({
      data: [],
      count: 0,
      loading: true
    });

    let selectedCat = parseInt(global.selectedCategory);
    let selectedDep = parseInt(global.selectedDept);
    let query = global.searchQuery;

    let url = `https://backendapi.turing.com/products?page=${page}&limit=12`;

    if (selectedCat === 0 && selectedDep === 0) {
      if (global.searchQuery != null && global.searchQuery !== "") {
        url = `https://backendapi.turing.com/products/search?query_string='${query}'&page=${page}&limit=12`;
      } else {
        url = `https://backendapi.turing.com/products?page=${page}&limit=12`;
      }
    } else if (selectedCat !== 0) {
      url = `https://backendapi.turing.com/products/inCategory/${selectedCat}?page=${page}&limit=12`;
    } else if (selectedCat === 0 && selectedDep !== 0) {
      url = `https://backendapi.turing.com/products/inDepartment/${selectedDep}?page=${page}&limit=12`;
    }

    Axios.get(url)
      .then(json => {
        //console.log(json.data);
        let countN = json.data.count;
        if (selectedDep !== 0 && selectedCat === 0) {
          countN = json.data.count.count;
        }

        this.setState({
          data: json.data.rows,
          count: countN,
          loading: false
        });
      })
      .catch(e => {
        console.error("Failed to retrieve product informatio..", e);
        this.setState({
          data: [],
          count: 0,
          loading: false
        });
      });
  }

  /**
   * This function is clicked when next page is clicked or particular
   * page is clicked thriugh pane number below
   * @param {*} e current even
   */
  clickNextPrev(e) {
    const page = e.target.value;

    this.setState(
      {
        page
      },
      () => {
        this.getData();
      }
    );
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
   * Default component rendered
   */
  render() {
    if (this.state.loading) {
      return <h3 className="textcol_orange">Loading.....</h3>;
    }

    //Counting the number of pages can be fetched
    let theCount = [];
    let counter = parseInt(this.state.count / 12);
    let mod = parseInt(this.state.count % 12) === 0 ? 0 : 1;

    counter = counter + mod;
    // Creatinf Pagination buttons
    for (var i = 1; i <= counter; i++) {
      theCount.push(
        <PageIdComponent key={i} name={i} onClick={this.clickNextPrev} />
      );
    }

    //this holds the Product items list
    let theData = this.state.data.map((item, index) => {
      //Generating the actual price comparing with discounted price
      let thePrice = "";
      if (item.discounted_price === "0.00") {
        //No Discount
        thePrice = (
          <div>
            <b className="textcol_orange">
              <small>Price : </small>
            </b>
            <small>
              <b className="textcol_maroon">&#36; {item.price}</b>{" "}
            </small>
            {"   "}
            <small>No Discount </small>
          </div>
        );
      } else {
        //Discounted Price
        thePrice = (
          <div>
            <b className="textcol_orange">
              <small>Price : </small>
            </b>
            <b className="textcol_maroon">&#36; {item.discounted_price}</b>{" "}
            {"    "}
            <small
              style={{
                textDecorationLine: "line-through"
              }}
            >
              {"    "} &#36; {item.price}
            </small>
          </div>
        );
      }
      return (
        <div className="prod-item" key={item.product_id}>
          <div className="column">
            <img
              alt="/"
              width="70%"
              align="center"
              src={require(`./../images/products/${item.thumbnail}`)}
            />
          </div>
          <div className="column">
            <b>{item.name}</b>
            <p>
              <small>{item.description}</small>
            </p>
            <p>
              <small>
                <b>Size: </b>{" "}
              </small>
              <input type="radio" name="size" id="size" value="XL" />
              <small> Extra Large </small>
              <input type="radio" name="size" value="L" />
              <small> Large </small>
              <input type="radio" name="size" value="M" />
              <small> Medium </small>
              <input type="radio" name="size" value="S" />
              <small> Small </small>
            </p>
            <p>
              <small>
                <b>Quantity</b>(1 to 5):{" "}
              </small>
              <b>
                <input
                  className="textc"
                  type="number"
                  name="quantity"
                  min="0"
                  max="5"
                  defaultValue="1"
                />
              </b>
            </p>
            {thePrice}
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
    });

    // THis holds the message if the search result is empty
    if (theData.length !== undefined && theData.length === 0) {
      theData = (
        <div>
          <h3 className="textcol_orange">Search Result</h3>
          <p className="textcol_maroon">
            No results found for{" "}
            <b className="textcol_orange">{global.searchQuery_hold}</b>.
          </p>
          <p className="textcol_maroon">
            Please try with more appropriate keyword that matches with
            products...
          </p>
        </div>
      );
    }

    return (
      <div>
        <div className="row">
          <div id="categoryPanel1" className="column1" align="left">
            <div id="categoryPanel">
              <Categories />
            </div>
          </div>
          <div className="column2">{theData}</div>
          <div className="column3" align="left" id="cartPane">
            <Cart key="0" item={[]} />
          </div>
        </div>
        <div className="footer">{theCount}</div>
      </div>
    );
  }
}

/**
 * Constant for Pagination button
 * @param {*} props The value and click handle will be passed while creating
 */
const PageIdComponent = props => {
  return (
    <button className="pagebutton" onClick={props.onClick} value={props.name}>
      {props.name}
    </button>
  );
};

export default Products;
