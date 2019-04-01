import React, { Component } from "react";
import Axios from "axios";
import Categories from "./Categories";
import ProductItem from "./ProductItem";
import Cart from "./Cart";

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
    global.item_per_page = 16;
    this.state = {
      page: 1,
      prevPage: 1,
      nextPage: 1,
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

    let url = `https://backendapi.turing.com/products?page=${page}&limit=${
      global.item_per_page
    }`;

    if (selectedCat === 0 && selectedDep === 0) {
      if (global.searchQuery != null && global.searchQuery !== "") {
        url = `https://backendapi.turing.com/products/search?query_string='${query}'&page=${page}&limit=${
          global.item_per_page
        }`;
      } else {
        url = `https://backendapi.turing.com/products?page=${page}&limit=${
          global.item_per_page
        }`;
      }
    } else if (selectedCat !== 0) {
      url = `https://backendapi.turing.com/products/inCategory/${selectedCat}?page=${page}&limit=${
        global.item_per_page
      }`;
    } else if (selectedCat === 0 && selectedDep !== 0) {
      url = `https://backendapi.turing.com/products/inDepartment/${selectedDep}?page=${page}&limit=${
        global.item_per_page
      }`;
    }

    //console.log(`Product URL: ${url} `);
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
        console.error("Failed to retrieve product information..", e);
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
   * Default component rendered
   */
  render() {
    if (this.state.loading) {
      return <h3 className="textcol_orange">Loading.....</h3>;
    }

    //Counting the number of pages can be fetched
    let theCount = [];
    let item_per_page = 16;
    let counter = parseInt(this.state.count / item_per_page);
    let mod = parseInt(this.state.count % item_per_page) === 0 ? 0 : 1;

    counter = counter + mod;

    //Pagination - PrevPage value
    const prevPage =
      parseInt(this.state.page) === 1 ? 1 : parseInt(this.state.page) - 1;
    //Pagination - NextPage value
    const nextPage =
      parseInt(this.state.page) === counter
        ? counter
        : parseInt(this.state.page) + 1;

    // Creatinf Pagination buttons
    if (counter > 1) {
      //Prev button
      if (counter > 1) {
        theCount.push(
          <PageIdComponent
            key={-1}
            name={" << "}
            value={1}
            page={this.state.page}
            onClick={this.clickNextPrev}
          />
        );
        theCount.push(
          <PageIdComponent
            key={0}
            name={" < "}
            value={prevPage}
            page={this.state.page}
            onClick={this.clickNextPrev}
          />
        );
      }

      for (var i = 1; i <= counter; i++) {
        theCount.push(
          <PageIdComponent
            key={i}
            name={i}
            value={i}
            page={this.state.page}
            onClick={this.clickNextPrev}
          />
        );
      }
      if (counter > 1) {
        theCount.push(
          <PageIdComponent
            key={counter + 1}
            name={" > "}
            value={nextPage}
            page={this.state.page}
            onClick={this.clickNextPrev}
          />
        );
        theCount.push(
          <PageIdComponent
            key={counter + 2}
            name={" >> "}
            value={counter}
            page={this.state.page}
            onClick={this.clickNextPrev}
          />
        );
      }
    }

    let theData = [];
    let index = 0;
    let keyIndex = 0;

    while (index < item_per_page) {
      theData.push(
        <div className="column100" key={index}>
          <ProductItem key={keyIndex++} item={this.state.data[index++]} />

          <ProductItem key={keyIndex++} item={this.state.data[index++]} />
        </div>
      );
    }

    //this holds the Product items list
    // THis holds the message if the search result is empty
    if (this.state.data.length !== undefined && this.state.data.length === 0) {
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
  var class_name =
    parseInt(props.page) === parseInt(props.name)
      ? "pagebutton_selected"
      : "pagebutton";

  return (
    <button className={class_name} onClick={props.onClick} value={props.value}>
      {props.name}
    </button>
  );
};

export default Products;
