import React from "react";

const ContactPage = () => {
  return (
    <div className="container my-5 py-5">
      <h1 className="text-center mb-3 fw-bold">Contact Us</h1>
      <hr className="mb-5" />

      <div className="row justify-content-center">
        <div
          className="col-md-6 col-sm-10 p-4"
          style={{
            background: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(15px)",
            borderRadius: "16px",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
            border: "1px solid rgba(255, 255, 255, 0.18)",
          }}
        >
          <form>
            <div className="mb-3">
              <label htmlFor="name" className="form-label fw-semibold">
                Name
              </label>
              <input
                type="text"
                className="form-control rounded-pill px-4 py-2"
                id="name"
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-semibold">
                Email
              </label>
              <input
                type="email"
                className="form-control rounded-pill px-4 py-2"
                id="email"
                placeholder="name@example.com"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="message" className="form-label fw-semibold">
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                className="form-control rounded-3 px-3 py-2"
                placeholder="Enter your message"
                required
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="btn btn-dark btn-lg rounded-pill px-5"
                disabled
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
