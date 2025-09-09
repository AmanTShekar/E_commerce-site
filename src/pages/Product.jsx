import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Link, useParams } from "react-router-dom";
import Marquee from "react-fast-marquee";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import { API_BASE } from "../utils/config"; // ✅ API base

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSimilar, setLoadingSimilar] = useState(true);

  const dispatch = useDispatch();
  const addProduct = (item) => dispatch(addCart(item));

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setLoadingSimilar(true);
      try {
        const res = await fetch(`${API_BASE}/products`);
        const allProducts = await res.json();

        const selectedProduct = allProducts.find((p) => String(p.id) === id);
        setProduct(selectedProduct);
        setLoading(false);

        const similar = allProducts.filter(
          (p) => p.category === selectedProduct.category && String(p.id) !== id
        );
        setSimilarProducts(similar);
        setLoadingSimilar(false);
      } catch (err) {
        console.error("Failed to fetch product:", err);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p className="text-center my-5">Loading product...</p>;

  return (
    <div className="container my-5">
      {product && (
        <div className="row align-items-center">
          <div className="col-md-6 mb-4">
            <img
              src={product.image}
              alt={product.title}
              className="img-fluid"
              style={{ objectFit: "contain", maxHeight: "450px" }}
            />
          </div>
          <div className="col-md-6">
            <h5 className="text-secondary">{product.category}</h5>
            <h1 className="fw-bold">{product.title}</h1>
            <h3 className="text-success fw-bold my-4">₹{product.price}</h3>
            <p className="text-muted">{product.description}</p>
            <div className="d-flex gap-2 mt-3">
              <button className="btn btn-dark" onClick={() => addProduct(product)}>
                Add to Cart
              </button>
              <Link to="/cart" className="btn btn-outline-dark">
                Go to Cart
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="my-5">
        <h2 className="mb-3">You may also like</h2>
        <div className="d-flex gap-3 overflow-auto">
          {loadingSimilar
            ? "Loading similar products..."
            : similarProducts.map((item) => (
                <div
                  key={item.id}
                  className="card p-2"
                  style={{ minWidth: "220px", cursor: "pointer" }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "contain" }}
                  />
                  <div className="card-body text-center">
                    <h6 className="text-truncate">{item.title}</h6>
                    <p className="text-success fw-bold">₹{item.price}</p>
                    <div className="d-flex justify-content-center gap-2">
                      <Link to={`/product/${item.id}`} className="btn btn-sm btn-dark">
                        View
                      </Link>
                      <button
                        className="btn btn-sm btn-outline-dark"
                        onClick={() => addProduct(item)}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default Product;
