import React, { useEffect, useState } from "react";
import axios from "axios";

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/offers")
      .then((res) => {
        setOffers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch offers:", err);
        setLoading(false);
      });
  }, []);

  return (
    <section className="text-center my-5">
      <h1 className="mb-5 fw-bold" style={{ fontSize: "2.5rem" }}>
        🔥 Current Offers
      </h1>

      <div className="d-flex flex-wrap justify-content-center gap-4">
        {loading ? (
          <p className="text-muted">Loading offers...</p>
        ) : offers.length === 0 ? (
          <p className="text-muted">No offers available right now.</p>
        ) : (
          offers.map((offer) => (
            <div
              key={offer.id}
              className="card shadow-lg border-0 rounded-4 p-3"
              style={{
                width: "300px",
                transition: "transform 0.3s, box-shadow 0.3s",
                cursor: "pointer",
                background: "#fefefe",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 5px 15px rgba(0,0,0,0.1)";
              }}
            >
              <div className="card-body text-start">
                <h5 className="card-title fw-bold">{offer.title}</h5>
                <p className="card-text text-muted">{offer.description}</p>
                <span
                  className="badge rounded-pill text-white fw-bold"
                  style={{
                    background: "linear-gradient(90deg, #4b6cb7, #182848)",
                    padding: "0.5rem 1rem",
                    fontSize: "0.9rem",
                  }}
                >
                  {offer.discount}% OFF
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default Offers;
