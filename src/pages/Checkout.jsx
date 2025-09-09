import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Checkout = () => {
  const cartItems = useSelector((state) => state.handleCart);

  const EmptyCart = () => (
    <div className="text-center py-5">
      <h4 className="display-5 mb-4">Your cart is empty</h4>
      <Link to="/" className="btn btn-outline-dark btn-lg">
        <i className="fa fa-arrow-left me-2"></i> Continue Shopping
      </Link>
    </div>
  );

  const ShowCheckout = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);
    const shipping = 30.0;

    return (
      <div className="row g-4">
        {/* Order Summary */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-dark text-white">
              <h5 className="mb-0">Order Summary</h5>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
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
            </div>
          </div>
        </div>

        {/* Billing Form */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-dark text-white">
              <h5 className="mb-0">Billing Address</h5>
            </div>
            <div className="card-body">
              <form className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">First Name</label>
                  <input type="text" className="form-control" placeholder="John" required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Last Name</label>
                  <input type="text" className="form-control" placeholder="Doe" required />
                </div>
                <div className="col-12">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" placeholder="you@example.com" required />
                </div>
                <div className="col-12">
                  <label className="form-label">Address</label>
                  <input type="text" className="form-control" placeholder="1234 Main St" required />
                </div>
                <div className="col-12">
                  <label className="form-label">Address 2 <span className="text-muted">(Optional)</span></label>
                  <input type="text" className="form-control" placeholder="Apartment or suite" />
                </div>
                <div className="col-md-5">
                  <label className="form-label">Country</label>
                  <select className="form-select" required>
                    <option value="">Choose...</option>
                    <option>India</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">State</label>
                  <select className="form-select" required>
                    <option value="">Choose...</option>
                    <option>Punjab</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Zip</label>
                  <input type="text" className="form-control" required />
                </div>

                <hr className="my-4" />

                <h5 className="mb-3">Payment</h5>
                <div className="col-md-6">
                  <label className="form-label">Name on Card</label>
                  <input type="text" className="form-control" placeholder="John Doe" required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Card Number</label>
                  <input type="text" className="form-control" placeholder="1234 5678 9012 3456" required />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Expiration</label>
                  <input type="text" className="form-control" placeholder="MM/YY" required />
                </div>
                <div className="col-md-3">
                  <label className="form-label">CVV</label>
                  <input type="text" className="form-control" placeholder="123" required />
                </div>

                <div className="col-12 mt-4">
                  <button className="btn btn-dark w-100 btn-lg" type="submit" disabled>
                    Continue to Checkout
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Checkout</h1>
      <hr className="mb-5" />
      {cartItems.length ? <ShowCheckout /> : <EmptyCart />}
    </div>
  );
};

export default Checkout;
