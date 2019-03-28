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

    //console.log(`Get Customer - ${jwtToken}`);
    if (!jwtToken || jwtToken === "") {
      alert("Please signin first to update the profile");
      return;
    }

    Axios.get("https://backendapi.turing.com/customer", {
      headers: {
        "user-key": jwtToken
      }
    })
      .then(json => {
        //console.log(json.data);
        this.setState({
          custname: !json.data.name ? "" : json.data.name,
          custemail: !json.data.email ? "" : json.data.email,
          custpassword: "", //!json.data.password ? "" : json.data.password,
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
        let errMesg = e.response.data.error.message;
        console.error("Failed to retrieve customer", errMesg);
      });
  }
  componentDidMount() {
    this.getUserProfile();
  }

  /**
   * This will update the customer information
   *
   */

  updateCustomerData = event => {
    event.preventDefault();

    let jwtToken = sessionStorage.getItem("jwtToken");
    //console.log(`Put Customer - ${jwtToken}`);

    Axios.put(
      "https://backendapi.turing.com/customer",
      {
        name: this.state.custname,
        email: this.state.custemail,
        password: this.state.custpassword,
        day_phone: this.state.custday_phone,
        eve_phone: this.state.custeve_phone,
        mob_phone: this.state.custmob_phone
      },
      {
        headers: {
          "user-key": jwtToken
        }
      }
    )
      .then(json => {
        console.log(`Successfull ${json.data}`);
        sessionStorage.setItem("loggedInUser", this.state.custname);
        document.getElementById("usernamemenu").innerText = this.state.custname;

        Axios.put(
          "https://backendapi.turing.com/customers/address",
          {
            address_1: this.state.custaddress_1,
            address_2: this.state.custaddress_2,
            city: this.state.custcity,
            country: this.state.custcountry,
            postal_code: this.state.custpostal_code,
            region: this.state.custregion,
            shipping_region_id: this.state.custshipping_region_id
          },
          {
            headers: {
              "user-key": jwtToken
            }
          }
        )
          .then(json => {
            alert("Successfully updated Customer profile and address");
          })
          .catch(e => {
            //console.error("Failed to save Customer data .", e);
            let errMesg = e.response.data.error.message;
            console.error("Failed to update customer address", errMesg);
            alert(`Failed to update customer address: ${errMesg}`);
          });
      })
      .catch(e => {
        //console.error("Failed to save Customer data .", e);
        let errMesg = e.response.data.error.message;
        console.error("Failed to update customer profile", errMesg);
        alert(`Failed to update customer profile: ${errMesg}`);
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

  handleAddressChange = event => {
    event.preventDefault();
    console.log(`Value: ${event.target.value}`);
    document.getElementById("address_table");
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
      <div align="menu__list">
        <small>
          <p />
          <div className="form_div">
            <h3 className="textcol_orange">
              <small>Customer Profile </small>
            </h3>
            <table align="center">
              <tbody>
                <tr>
                  <td className="form_textlabel">
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
                      className="form_text"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="form_textlabel">
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
                      className="form_text"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="form_textlabel">Password:</td>
                  <td>
                    <input
                      type="password"
                      name="custpassword"
                      value={custpassword}
                      placeholder="Password"
                      onChange={this.handleInputChange}
                      className="form_text"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="form_textlabel">Day Phone:</td>
                  <td alight="left">
                    <input
                      type="text"
                      name="custday_phone"
                      value={custday_phone}
                      placeholder="Day phone"
                      onChange={this.handleInputChange}
                      className="form_text"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="form_textlabel">Evening Phone:</td>
                  <td>
                    <input
                      type="text"
                      name="custeve_phone"
                      value={custeve_phone}
                      placeholder="Evening phone"
                      onChange={this.handleInputChange}
                      className="form_text"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="form_textlabel">Mobile Phone:</td>
                  <td alight="left">
                    <input
                      type="text"
                      name="custmob_phone"
                      value={custmob_phone}
                      placeholder="Day phone"
                      onChange={this.handleInputChange}
                      className="form_text"
                    />
                  </td>
                </tr>
                <tr>
                  <td>&nbsp;</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>&nbsp;</p>

          <div className="form_div">
            <h3 className="textcol_orange">
              <small>Customer Address </small>
            </h3>
            <table align="center" id="address_table">
              <tbody>
                <tr>
                  <td className="form_textlabel_long">
                    Address 1<i className="required" />:
                  </td>
                  <td alight="left">
                    <input
                      type="text"
                      name="custaddress_1"
                      value={custaddress_1}
                      placeholder="Address 1"
                      onChange={this.handleInputChange}
                      className="form_text_long"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="form_textlabel_long">Address 2:</td>
                  <td alight="left">
                    <input
                      type="text"
                      name="custaddress_2"
                      value={custaddress_2}
                      placeholder="Address 2"
                      onChange={this.handleInputChange}
                      className="form_text_long"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="form_textlabel_long">
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
                      className="form_text_small"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="form_textlabel_long">
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
                      className="form_text_small"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="form_textlabel_long">
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
                      className="form_text_small"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="form_textlabel_long">
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
                      className="form_text_small"
                    />
                  </td>
                </tr>

                <tr>
                  <td className="form_textlabel_long">
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
                      className="form_text_small"
                    />
                  </td>
                </tr>
                <tr>
                  <td>&nbsp;</td>
                </tr>
              </tbody>
            </table>
          </div>
        </small>
        <p />

        <div align="center">
          <button
            id="save_button"
            className="button_login"
            onClick={this.updateCustomerData}
          >
            <b>Update</b>
          </button>
        </div>
      </div>
    );
  }
}

export default UserProfile;
