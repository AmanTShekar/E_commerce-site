// src/components/admin/ProductManager.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Edit, Trash2 } from "react-feather";
import toast from "react-hot-toast";
import { API_BASE } from "../../utils/config"; // use API_BASE

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", categoryId: "", offerId: "" });
  const [editingId, setEditingId] = useState(null);

  const PRODUCT_API = `${API_BASE}/products`;
  const CATEGORY_API = `${API_BASE}/categories`;

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await axios.get(PRODUCT_API);
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      toast.error("Failed to fetch products");
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get(CATEGORY_API);
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      toast.error("Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...form,
        price: parseFloat(form.price),
        categoryId: parseInt(form.categoryId),
        offerId: form.offerId ? parseInt(form.offerId) : null,
      };

      if (editingId) {
        await axios.put(`${PRODUCT_API}/${editingId}`, productData);
        toast.success("Product updated successfully");
      } else {
        await axios.post(PRODUCT_API, productData);
        toast.success("Product added successfully");
      }

      setForm({ name: "", price: "", categoryId: "", offerId: "" });
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      console.error("Error submitting product:", err);
      toast.error("Failed to submit product");
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      price: product.price,
      categoryId: product.categoryId,
      offerId: product.offerId || "",
    });
    setEditingId(product.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(`${PRODUCT_API}/${id}`);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      toast.error("Failed to delete product");
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : "Unknown";
  };

  return (
    <div className="card shadow-lg rounded-4 mb-5">
      <div className="card-header bg-primary text-white fw-bold rounded-top">
        Product Management
      </div>

      <div className="card-body">
        {/* Form */}
        <form onSubmit={handleSubmit} className="row g-3 align-items-center mb-4">
          <div className="col-md-3">
            <input
              type="text"
              name="name"
              placeholder="Product name"
              value={form.name}
              onChange={handleChange}
              className="form-control rounded-pill shadow-sm"
              required
            />
          </div>
          <div className="col-md-2">
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              className="form-control rounded-pill shadow-sm"
              required
            />
          </div>
          <div className="col-md-3">
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              className="form-select rounded-pill shadow-sm"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <input
              type="number"
              name="offerId"
              placeholder="Offer ID (optional)"
              value={form.offerId}
              onChange={handleChange}
              className="form-control rounded-pill shadow-sm"
            />
          </div>
          <div className="col-md-2 d-flex gap-2">
            <button type="submit" className="btn btn-success rounded-pill flex-fill shadow-sm">
              {editingId ? "Update" : "Add"} Product
            </button>
            {editingId && (
              <button
                type="button"
                className="btn btn-secondary rounded-pill flex-fill shadow-sm"
                onClick={() => setForm({ name: "", price: "", categoryId: "", offerId: "" })}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Table */}
        <div className="table-responsive rounded-3 shadow-sm">
          <table className="table table-hover table-striped align-middle mb-0">
            <thead className="table-dark text-uppercase">
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Offer ID</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-muted">
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>₹{p.price}</td>
                    <td>{getCategoryName(p.categoryId)}</td>
                    <td>{p.offerId || "—"}</td>
                    <td className="text-center d-flex justify-content-center gap-2">
                      <button
                        onClick={() => handleEdit(p)}
                        className="btn btn-warning btn-sm rounded-pill d-flex align-items-center gap-1"
                      >
                        <Edit size={14} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="btn btn-danger btn-sm rounded-pill d-flex align-items-center gap-1"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductManager;
