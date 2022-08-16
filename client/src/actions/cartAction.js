export const cartAction =
  (pizza, quantity, varient) => (dispatch, getState) => {
    var cartItem = {
      name: pizza.name,
      _id: pizza._id,
      image: pizza.image,
      varient: varient,
      quantity: Number(quantity),
      prices: pizza.prices,
      price: pizza.prices[0][quantity] * varient,
    };
    if (cartItem.quantity > 10) {
      alert("Maximum quantity is 10");
      return;
    }
    if (cartItem.quantity <= 0) {
      alert("Minimum quantity is 1");
    } else {
      dispatch({ type: "ADD_TO_CART", payload: cartItem });
      localStorage.setItem(
        "cartItems",
        JSON.stringify(getState().cartReducer.cartItems)
      );
    }
  };

export const deleteFromCart = (pizza) => (dispatch, getState) => {
  dispatch({ type: "DELETE_FROM_CART", payload: pizza });
  localStorage.setItem(
    "cartItems",
    JSON.stringify(getState().cartReducer.cartItems)
  );
};