import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { addCart, delCart } from "../redux/action";
import { Link } from "react-router-dom";

const Cart = () => {
  const cartItems = useSelector((state) => state.handleCart);
  const dispatch = useDispatch();

  const EmptyCart = () => (
    <div className="text-center py-5">
      <h4 className="display-5 mb-4">Your cart is empty</h4>
      <Link to="/" className="btn btn-outline-dark btn-lg">
        <i className="fa fa-arrow-left me-2"></i> Continue Shopping
      </Link>
    </div>
  );

  const ShowCart = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);
    const shipping = 30.0;

    return (
      <div className="row g-4">
        {/* Item List */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-dark text-white">
              <h5 className="mb-0">Item List</h5>
            </div>
            <div className="card-body">
              {cartItems.map((item) => (
                <div key={item.id} className="d-flex align-items-center mb-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    width={100}
                    height={75}
                    className="rounded shadow-sm me-3"
                  />
                  <div className="flex-grow-1">
                    <p className="mb-1 fw-semibold">{item.title}</p>
                    <div className="d-flex align-items-center mt-2">
                      <button
                        className="btn btn-outline-secondary btn-sm px-3"
                        onClick={() => dispatch(delCart(item))}
                      >
                        <i className="fas fa-minus"></i>
                      </button>
                      <span className="mx-3 fw-bold">{item.qty}</span>
                      <button
                        className="btn btn-outline-secondary btn-sm px-3"
                        onClick={() => dispatch(addCart(item))}
                      >
                        <i className="fas fa-plus"></i>
                      </button>
                    </div>
                  </div>
                  <div className="text-end fw-semibold">
                    ₹{Math.round(item.price * item.qty)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-dark text-white">
              <h5 className="mb-0">Order Summary</h5>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush mb-3">
                <li className="list-group-item d-flex justify-content-between">
                  Products ({totalItems}) <span>₹{Math.round(subtotal)}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  Shipping <span>₹{shipping}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between fw-bold">
                  Total <span>₹{Math.round(subtotal + shipping)}</span>
                </li>
              </ul>
              <Link to="/checkout" className="btn btn-dark btn-lg w-100">
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Cart</h1>
      <hr className="mb-5" />
      {cartItems.length > 0 ? <ShowCart /> : <EmptyCart />}
    </div>
  );
};

export default Cart;
