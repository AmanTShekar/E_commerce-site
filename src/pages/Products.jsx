import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import { API_BASE } from "../utils/config"; // API base

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("default");

  const dispatch = useDispatch();

  const addProduct = (product) => {
    dispatch(addCart(product));
  };

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch(`${API_BASE}/products`),
          fetch(`${API_BASE}/categories`),
        ]);

        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();

        setProducts(productsData);
        setCategories(["All", ...categoriesData.map((c) => c.name)]);
      } catch (err) {
        console.error("Failed to fetch products/categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter & sort
  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sort === "lowToHigh") return a.price - b.price;
    if (sort === "highToLow") return b.price - a.price;
    return 0;
  });

  if (loading) return <p className="text-center my-5">Loading products...</p>;

  return (
    <div className="container my-5 py-5">
      <h1 className="text-center mb-4 fw-bold display-5">Our Products</h1>
      <hr className="mb-5 w-25 mx-auto border-dark" />

      {/* Filter & Sort */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div className="btn-group flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`btn btn-outline-dark btn-lg ${
                selectedCategory === cat ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <div>
          <select
            className="form-select form-select-lg border-dark"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="default">Sort by: Default</option>
            <option value="lowToHigh">Price: Low to High</option>
            <option value="highToLow">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="row">
        {sortedProducts.length === 0 ? (
          <p className="text-center">No products available.</p>
        ) : (
          sortedProducts.map((product) => (
            <div key={product.id} className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <img
                  src={product.image}
                  className="card-img-top"
                  alt={product.title}
                  style={{ objectFit: "contain", height: "250px" }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{product.title}</h5>
                  <p className="card-text text-muted flex-grow-1">
                    {product.description.length > 60
                      ? product.description.substring(0, 60) + "..."
                      : product.description}
                  </p>
                  <h6 className="fw-bold mb-3">₹{product.price}</h6>
                  <button
                    className="btn btn-dark mt-auto"
                    onClick={() => addProduct(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
