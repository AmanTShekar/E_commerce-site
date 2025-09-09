import React from "react";

const Home = () => {
  return (
    <>
      {/* Google Font: Montserrat */}
      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap"
        rel="stylesheet"
      />

      <div
        className="hero position-relative d-flex align-items-center text-white"
        style={{
          height: "55vh",
          minHeight: "350px",
          backgroundImage: "url('./assets/main.png.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "brightness(0.65)",
        }}
      >
        <div
          className="container text-center text-md-start px-4 px-md-5"
          style={{ position: "relative", zIndex: 2 }}
        >
          <h1
            className="fw-bold mb-3"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "3rem",
              lineHeight: 1.1,
              textShadow: "2px 2px 12px rgba(0,0,0,0.7)",
            }}
          >
            Discover the <span style={{ color: "#FFD700" }}>Latest Trends</span>
          </h1>
          <p
            className="lead mb-0"
            style={{
              fontSize: "1.2rem",
              maxWidth: "500px",
              textShadow: "1px 1px 8px rgba(0,0,0,0.6)",
              color: "#f0f0f0",
            }}
          >
            Elevate your style with our new arrivals — handpicked to inspire and delight.
          </p>
        </div>

        {/* Overlay for better contrast */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6))",
            zIndex: 1,
          }}
        />
      </div>
    </>
  );
};

export default Home;
