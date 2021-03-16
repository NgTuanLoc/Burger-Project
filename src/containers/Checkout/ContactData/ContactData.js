import React, { Component } from "react";
import classes from "./ContactData.css";
import Button from "../../../components/UI/Button/Button";
import axios from '../../../axios-orders'

class ContactData extends Component {
  state = {
    name: "",
    email: "",
    address: {
      street: "",
      postalCode: "",
    },
    loading: false
  };

  orderHandler = (event) => {
    event.preventDefault();
    this.setState({
      loading: true,
    });
    const order = {
      ingredients: this.props.ingredients,
      price: this.props.totalPrice,
      customer: {
        name: "NgTuanLoc",
        age: 21,
        address: "82 PHC p12 q5",
      },
    };
    axios
      .post("/orders.json", order)
      .then((response) => {
        this.setState({
          loading: false,
          purchasing: false,
        });
        this.props.history.push('/')
        console.log(response);
      })
      .catch((error) => {
        this.setState({
          loading: false,
          purchasing: false,
        });
        console.log(error);
      });
  };

  render() {
    return (
      <div className={classes.ContactData}>
        <h4>Enter Your Contact Data</h4>
        <form>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            className={classes.Input}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className={classes.Input}
          />
          <input
            type="text"
            name="street"
            placeholder="Street"
            className={classes.Input}
          />
          <input
            type="text"
            name="postal"
            placeholder="Postal Code"
            className={classes.Input}
          />
          <Button btnType="Success" clicked={this.orderHandler}>
            Order
          </Button>
        </form>
      </div>
    );
  }
}

export default ContactData;
