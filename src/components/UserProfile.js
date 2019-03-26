import React, { Component } from "react";
import "./../css/Navigation.css";
import Axios from "axios";

/**
 * UserProfile is used to retrieve the customer details and update the information
 * @author Rahul Das Adhikary, rahul.das.adhikary@gmail.com, +91-9880978662
 */
class UserProfile extends Component {
  /**
   * Construcor
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.state = {
      custname: "",
      custemail: "",
      custpassword: "",
      custday_phone: "",
      custeve_phone: "",
      custmob_phone: "",
      custaddress_1: "",
      custaddress_2: "",
      custcity: "",
      custcountry: "",
      custpostal_code: "",
      custregion: "",
      custshipping_region_id: 0,

      loading: false
    };
    this.getUserProfile = this.getUserProfile.bind(this);
  }

  /**
   * Generate the Customer details
   */
  getUserProfile() {
    let jwtToken = sessionStorage.getItem("jwtToken");

    if (!jwtToken || jwtToken === "") {
      alert("Please signin first to update the profile");
      return;
    }

    Axios.get("https://backendapi.turing.com/customer", {
      headers: {
        "user-key": sessionStorage.getItem("jwtToken")
      }
    })
      .then(json => {
        //console.log(json.data);
        this.setState({
          custname: !json.data.name ? "" : json.data.name,
          custemail: !json.data.email ? "" : json.data.email,
          custpassword: !json.data.password ? "" : json.data.password,
          custday_phone: !json.data.day_phone ? "" : json.data.day_phone,
          custeve_phone: !json.data.eve_phone ? "" : json.data.eve_phone,
          custmob_phone: !json.data.mob_phone ? "" : json.data.mob_phone,
          custaddress_1: !json.data.address_1 ? "" : json.data.address_1,
          custaddress_2: !json.data.address_2 ? "" : json.data.address_2,
          custcity: !json.data.city ? "" : json.data.city,
          custcountry: !json.data.country ? "" : json.data.country,
          custpostal_code: !json.data.postal_code ? "" : json.data.postal_code,
          custregion: !json.data.region ? "" : json.data.region,
          custshipping_region_id: !json.data.shipping_region_id
            ? ""
            : json.data.shipping_region_id
        });
      })
      .catch(e => {
        console.error("Failed to retrieve Customer data .", e);
      });
  }
  componentDidMount() {
    this.getUserProfile();
  }

  /**
   * This will update the customer information
   * TODO: NEED TO FINE-TUNE THE REQUEST PARAMETER, CURRENTLY NOT WORKING
   */

  updateCustomerData = event => {
    event.preventDefault();

    /*
    headers: {
        "user-key": sessionStorage.getItem("jwtToken")
      },
      data: {
        name: this.state.custname,
        email: this.state.custemail,
        password: this.state.custpassword,
        day_phone: this.state.custday_phone,
        eve_phone: this.state.custeve_phone,
        mob_phone: this.state.custmob_phone
      }
    */
    //TODO - Need to change the request param
    Axios.put("https://backendapi.turing.com/customer", {
      data: {
        name: this.state.custname,
        email: this.state.custemail,
        password: this.state.custpassword,
        day_phone: this.state.custday_phone,
        eve_phone: this.state.custeve_phone,
        mob_phone: this.state.custmob_phone
      }
    })
      .then(json => {
        //console.log(json.data);
      })
      .catch(e => {
        console.error("Failed to save Customer data .", e);
      });
  };

  /**
   * Used for form data binding
   */
  handleInputChange = event => {
    event.preventDefault();

    this.setState({
      [event.target.name]: event.target.value
    });
  };

  /**
   * Default component renderer
   */
  render() {
    const { custname } = this.state;
    const { custemail } = this.state;
    const { custpassword } = this.state;
    const { custday_phone } = this.state;
    const { custeve_phone } = this.state;
    const { custmob_phone } = this.state;
    const { custaddress_1 } = this.state;
    const { custaddress_2 } = this.state;
    const { custcity } = this.state;
    const { custcountry } = this.state;
    const { custpostal_code } = this.state;
    const { custregion } = this.state;
    const { custshipping_region_id } = this.state;

    return (
      <div align="center">
        <h3 className="textcol_orange">
          Customer Profile (Under Construction){" "}
        </h3>
        <small>
          <table>
            <tbody>
              <tr>
                <td alight="right">
                  Full name
                  <i className="required" />:
                </td>
                <td alight="left">
                  <input
                    type="text"
                    name="custname"
                    value={custname}
                    placeholder="Full name"
                    onChange={this.handleInputChange}
                  />
                </td>
              </tr>
              <tr>
                <td alight="right">
                  Email
                  <i className="required" />:
                </td>
                <td>
                  <input
                    type="text"
                    name="custemail"
                    value={custemail}
                    placeholder="Email address"
                    onChange={this.handleInputChange}
                  />
                </td>
              </tr>
              <tr>
                <td alight="right">Password:</td>
                <td>
                  <input
                    type="password"
                    name="custpassword"
                    value={custpassword}
                    placeholder="Password"
                    onChange={this.handleInputChange}
                  />
                </td>
              </tr>
              <tr>
                <td alight="right">Day Phone:</td>
                <td alight="left">
                  <input
                    type="text"
                    name="custday_phone"
                    value={custday_phone}
                    placeholder="Day phone"
                    onChange={this.handleInputChange}
                  />
                </td>
              </tr>
              <tr>
                <td alight="right">Evening Phone:</td>
                <td alight="left">
                  <input
                    type="text"
                    name="custeve_phone"
                    value={custeve_phone}
                    placeholder="Evening phone"
                    onChange={this.handleInputChange}
                  />
                </td>
              </tr>
              <tr>
                <td alight="right">Mobile Phone:</td>
                <td alight="left">
                  <input
                    type="text"
                    name="custmob_phone"
                    value={custmob_phone}
                    placeholder="Day phone"
                    onChange={this.handleInputChange}
                  />
                </td>
              </tr>
              <tr>
                <td alight="right">
                  Address 1<i className="required" />:
                </td>
                <td alight="left">
                  <input
                    type="text"
                    name="custaddress_1"
                    value={custaddress_1}
                    placeholder="Address 1"
                    onChange={this.handleInputChange}
                  />
                </td>
              </tr>
              <tr>
                <td alight="right">Address 2:</td>
                <td alight="left">
                  <input
                    type="text"
                    name="custaddress_2"
                    value={custaddress_2}
                    placeholder="Address 2"
                    onChange={this.handleInputChange}
                  />
                </td>
              </tr>
              <tr>
                <td alight="right">
                  City
                  <i className="required" />:
                </td>
                <td alight="left">
                  <input
                    type="text"
                    name="custcity"
                    value={custcity}
                    placeholder="City"
                    onChange={this.handleInputChange}
                  />
                </td>
              </tr>
              <tr>
                <td alight="right">
                  Region
                  <i className="required" />:
                </td>
                <td alight="left">
                  <input
                    type="text"
                    name="custregion"
                    value={custregion}
                    placeholder="Region"
                    onChange={this.handleInputChange}
                  />
                </td>
              </tr>
              <tr>
                <td alight="right">
                  Postal Code
                  <i className="required" />:
                </td>
                <td alight="left">
                  <input
                    type="text"
                    name="custpostal_code"
                    value={custpostal_code}
                    placeholder="Postal Code:"
                    onChange={this.handleInputChange}
                  />
                </td>
              </tr>
              <tr>
                <td alight="right">
                  Country
                  <i className="required" />:
                </td>
                <td alight="left">
                  <input
                    type="text"
                    name="custcountry"
                    value={custcountry}
                    placeholder="Country:"
                    onChange={this.handleInputChange}
                  />
                </td>
              </tr>

              <tr>
                <td alight="right">
                  Shipping Region
                  <i className="required" />:
                </td>
                <td alight="left">
                  <input
                    type="number"
                    name="custshipping_region_id"
                    value={custshipping_region_id}
                    placeholder="Shipping Region"
                    onChange={this.handleInputChange}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </small>
        <p />

        <div align="center">
          <button className="button_login" onClick={this.updateCustomerData}>
            <b>Update</b>
          </button>
        </div>
      </div>
    );
  }
}

export default UserProfile;
