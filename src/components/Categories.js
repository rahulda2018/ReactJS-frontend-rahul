import React, { Component } from "react";
import Axios from "axios";
import Products from "../components/Products";
import ReactDOM from "react-dom";

import "./../css/Navigation.css";
import "./../css/Menu.css";

/**
 * This class component will generate category list (all categories or
 * the categories under a specific department and generate UI
 * @author Rahul Das Adhikary, rahul.das.adhikary@gmail.com, +91-9880978662
 */
class Categories extends Component {
  _isMounted = false;

  /**
   * Constructor
   * @param {*} props the properties which are passed while calling the Component
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
  }

  /**
   * THis function will generate category list (all categories or
   * the categories under a specific department
   */
  getData() {
    //const { page } = this.state;
    this.setState({
      data: [],
      count: 0,
      loading: true
    });

    let selectedDep = parseInt(global.selectedDept);

    let url = `https://backendapi.turing.com/categories`;

    if (selectedDep !== 0) {
      url = `https://backendapi.turing.com/categories/inDepartment/${selectedDep}`;
    }

    //console.log("URL", url);
    Axios.get(url)
      .then(json => {
        //console.log("Category Data", json.data);
        let dataC = [];
        let countC = 0;

        if (selectedDep !== 0) {
          dataC = json.data;
        } else {
          dataC = json.data.rows;
          countC = json.data.count;
        }
        if (this._isMounted) {
          this.setState({
            data: dataC,
            count: countC,
            loading: false
          });
        }
      })
      .catch(e => {
        console.error("Failed to fetch category list..", e);
        if (this._isMounted) {
          this.setState({
            data: [],
            count: 0,
            loading: false
          });
        }
      });
  }

  /**
   * will be called to generte the component
   */
  componentDidMount() {
    this._isMounted = true;
    this.getData();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  /**
   * This will be called when a particular category will be selected from the left hand panel
   */
  setCategory = category => e => {
    global.selectedCategory = category.category_id;
    global.searchQuery = "";

    var div = document.createElement("div");
    ReactDOM.render(<Products />, div);
    document.getElementById("productPanel").childNodes[0].remove();
    document.getElementById("productPanel").appendChild(div);
  };

  /**
   * Default renderer
   */
  render() {
    if (this.state.loading) {
      return <h3 className="textcol_orange">Loading.....</h3>;
    }

    let theData = this.state.data.map(item => {
      return (
        <div key={item.category_id} align="left">
          <button
            key={item.category_id}
            className="category-button"
            onClick={this.setCategory(item)}
          >
            <small>
              <b>{item.name}</b>
            </small>
          </button>
        </div>
      );
    });

    return (
      <div>
        <div className="row" align="left">
          <p className="textcol_orange">
            <small>
              <b>Category</b>
            </small>
          </p>
        </div>
        {theData}
      </div>
    );
  }
}

export default Categories;
