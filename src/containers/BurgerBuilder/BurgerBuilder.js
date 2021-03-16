import React, { Component } from "react";
import Aux from "../../hoc/Aux";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import axios from "../../axios-orders";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler";

const INGREDIENTS_PRICE = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7,
};

class BurgerBuilder extends Component {
  state = {
    ingredients: null,
    totalPrice: 4,
    purchaseable: false,
    purchasing: false,
    loading: false,
    error: false,
  };

  componentDidMount() {
    axios
      .get(
        "https://burger-builder-93259-default-rtdb.firebaseio.com/ingredients.json"
      )
      .then((response) => {
        this.setState({
          ingredients: response.data,
        });
      })
      .catch((error) => {
        this.setState({
          error: true,
        });
      });
  }

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
    const queryParams = []

    for(let i in this.state.ingredients){
      queryParams.push(encodeURIComponent(i)+'='+encodeURIComponent(this.state.ingredients[i]))
    }

    queryParams.push('price='+this.state.totalPrice)
    const querystring= queryParams.join('&')
    this.props.history.push({
      pathname: "/checkout",
      search: "?"+querystring,
    });
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

    let orderSummary = null;

    if (this.state.loading) {
      orderSummary = <Spinner />;
    }
    let burger = this.state.error ? (
      <p>Ingredients can't not be loaded !</p>
    ) : (
      <Spinner />
    );

    if (this.state.ingredients) {
      burger = (
        <Aux>
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
      orderSummary = (
        <OrderSummary
          ingredients={this.state.ingredients}
          purchaseCanceld={this.purchaseCancelHandler}
          purchaseContinued={this.purchaseContinueHandler}
          price={this.state.totalPrice.toFixed(2)}
        />
      );
    }

    return (
      <Aux>
        <Modal
          show={this.state.purchasing}
          modalClosed={this.purchaseCancelHandler}
        >
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    );
  }
}

export default withErrorHandler(BurgerBuilder, axios);
