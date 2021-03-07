import React, { Component } from "react";
import Aux from "../../hoc/Aux";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";

const INGREDIENTS_PRICE = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7,
};

class BurgerBuilder extends Component {
  state = {
    ingredients: {
      salad: 0,
      bacon: 0,
      meat: 0,
      cheese: 0,
    },
    totalPrice: 4,
    purchaseable: false,
    purchasing: false,
  };

  purchaseHandler = () => {
    this.setState({
      purchasing: true,
    });
  };

  purchaseableHandler(ingredients) {
    const sum = Object.keys(ingredients)
      .map((igKey) => {
        return ingredients[igKey];
      })
      .reduce((sum, el) => sum + el, 0);
    this.setState({
      purchaseable: sum > 0,
    });
  }

  purchaseCancelHandler = () => {
    this.setState({
      purchasing: false,
    });
  };

  purchaseContinueHandler = () => {
    alert("You click Continue !!!");
  };

  addIngredientHandler = (type) => {
    const currentCount = this.state.ingredients[type];
    const updatedCount = currentCount + 1;
    const updatedIngredient = {
      ...this.state.ingredients,
    };
    updatedIngredient[type] = updatedCount;

    const additionalPrice = INGREDIENTS_PRICE[type];
    const currentPrice = this.state.totalPrice;
    const updatedPrice = currentPrice + additionalPrice;

    this.setState({
      ingredients: updatedIngredient,
      totalPrice: updatedPrice,
    });

    this.purchaseableHandler(updatedIngredient);
  };

  removeIngredientHandler = (type) => {
    const currentCount = this.state.ingredients[type];

    if (currentCount <= 0) {
      return;
    }
    const updatedCount = currentCount - 1;
    const updatedIngredient = {
      ...this.state.ingredients,
    };
    updatedIngredient[type] = updatedCount;

    const deductionalPrice = INGREDIENTS_PRICE[type];
    const currentPrice = this.state.totalPrice;
    const updatedPrice = currentPrice - deductionalPrice;

    this.setState({
      ingredients: updatedIngredient,
      totalPrice: updatedPrice,
    });

    this.purchaseableHandler(updatedIngredient);
  };

  render() {
    const disabledInfo = { ...this.state.ingredients };

    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }
    return (
      <Aux>
        <Modal
          show={this.state.purchasing}
          modalClosed={this.purchaseCancelHandler}
        >
          <OrderSummary
            ingredients={this.state.ingredients}
            purchaseCanceld={this.purchaseCancelHandler}
            purchaseContinued={this.purchaseContinueHandler}
            price={this.state.totalPrice.toFixed(2)}
          />
        </Modal>
        <Burger ingredients={this.state.ingredients} />
        <BuildControls
          ingredientsAdded={this.addIngredientHandler}
          ingredientsRemoved={this.removeIngredientHandler}
          disabled={disabledInfo}
          price={this.state.totalPrice.toFixed(2)}
          purchaseable={this.state.purchaseable}
          ordered={this.purchaseHandler}
        />
      </Aux>
    );
  }
}

export default BurgerBuilder;
