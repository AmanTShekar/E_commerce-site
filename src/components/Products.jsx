import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import { API_BASE } from "../utils/config"; // Use API_BASE
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Products = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("default");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const dispatch = useDispatch();

  const addProduct = (product) => {
    dispatch(addCart(product));
    toast.success("Added to cart");
  };

  // Fetch products and categories from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch(`${API_BASE}/products`),
          fetch(`${API_BASE}/categories`),
        ]);

        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();

        setData(productsData);
        setFilter(productsData);

        setCategories([
          "All",
          ...categoriesData.map((c) => c.name) // assuming backend sends {name: "Electronics"}
        ]);
      } catch (error) {
        console.error("Failed to fetch products/categories:", error);
        toast.error("Error loading products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products
  const filterProduct = (category) => {
    setSelectedCategory(category);
    const updated =
      category === "All"
        ? data
        : data.filter(
            (item) => item.category.toLowerCase() === category.toLowerCase()
          );
    setFilter(sortProducts(updated, sort));
  };

  // Sort products
  const sortProducts = (products, sortType) => {
    switch (sortType) {
      case "lowToHigh":
        return [...products].sort((a, b) => a.price - b.price);
      case "highToLow":
        return [...products].sort((a, b) => b.price - a.price);
      default:
        return products;
    }
  };

  const handleSortChange = (e) => {
    const selected = e.target.value;
    setSort(selected);
    setFilter(sortProducts(filter, selected));
  };

  // Skeleton loader
  const Loading = () => (
    <div className="row">
      {[...Array(6)].map((_, index) => (
        <div className="col-xl-4 col-lg-6 col-md-6 mb-5" key={index}>
          <Skeleton height={400} />
        </div>
      ))}
    </div>
  );

  // Render products
  const ShowProducts = () => (
    <>
      {/* Filter & Sort */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div className="btn-group flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`btn btn-outline-dark btn-lg px-3 py-2 mb-2 ${
                selectedCategory === cat ? "active" : ""
              }`}
              onClick={() => filterProduct(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <div>
          <select
            className="form-select form-select-lg border-dark"
            value={sort}
            onChange={handleSortChange}
            style={{ minWidth: "220px" }}
          >
            <option value="default">Sort by: Default</option>
            <option value="lowToHigh">Price: Low to High</option>
            <option value="highToLow">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="row">
        {filter.map((product) => (
          <div
            key={product.id}
            className="col-xl-4 col-lg-6 col-md-6 mb-5 d-flex align-items-stretch"
          >
            <div
              className="card shadow-sm border-0 rounded-4 w-100 hover-shadow"
              style={{ transition: "all 0.3s ease" }}
            >
              <div className="position-relative">
                <img
                  src={product.image}
                  alt={product.title}
                  className="card-img-top p-3 rounded-top-4"
                  style={{ height: "320px", objectFit: "contain" }}
                />
              </div>
              <div className="card-body d-flex flex-column">
                <h5 className="card-title fw-bold">{product.title}</h5>
                <p className="card-text text-muted flex-grow-1 fs-6">
                  {product.description?.substring(0, 90)}...
                </p>
                <div className="d-flex justify-content-between align-items-center mt-2">
                  <span className="fw-bold fs-5 text-success">
                    ₹{product.price}
                  </span>
                </div>
                <div className="mt-4 d-flex gap-2">
                  <Link
                    to={`/product/${product.id}`}
                    className="btn btn-outline-dark w-50 fw-bold"
                  >
                    View
                  </Link>
                  <button
                    className="btn btn-dark w-50 fw-bold"
                    onClick={() => addProduct(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div className="container my-5 py-3">
      <div className="text-center mb-5">
        <h1 className="fw-bold display-5">Shop Smart</h1>
        <hr className="w-25 mx-auto border-dark" />
        <p className="lead text-muted mt-3">
          Explore the latest gadgets, accessories, and offers curated just for you.
        </p>
      </div>
      {loading ? <Loading /> : <ShowProducts />}
    </div>
  );
};

export default Products;
