// src/components/admin/CategoryManager.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Edit, Trash2 } from "react-feather";
import toast from "react-hot-toast";
import { API_BASE } from "../../utils/config"; // Use API_BASE

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "" });
  const [editingId, setEditingId] = useState(null);

  const API_URL = `${API_BASE}/categories`; // dynamic base URL

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      const res = await axios.get(API_URL);
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, form);
        toast.success("Category updated successfully");
      } else {
        await axios.post(API_URL, form);
        toast.success("Category added successfully");
      }
      setForm({ name: "" });
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      console.error("Error submitting category:", err);
      toast.error("Failed to submit category");
    }
  };

  const handleEdit = (cat) => {
    setForm({ name: cat.name });
    setEditingId(cat.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      toast.success("Category deleted successfully");
      fetchCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
      toast.error("Failed to delete category");
    }
  };

  return (
    <div className="card shadow-lg rounded-4 mb-5">
      <div className="card-header bg-primary text-white fw-bold rounded-top">
        Category Management
      </div>

      <div className="card-body">
        {/* Form */}
        <form onSubmit={handleSubmit} className="row g-3 align-items-center mb-4">
          <div className="col-md-8">
            <input
              type="text"
              name="name"
              placeholder="Enter category name"
              value={form.name}
              onChange={handleChange}
              className="form-control rounded-pill shadow-sm"
              required
            />
          </div>
          <div className="col-md-4 d-flex gap-2">
            <button type="submit" className="btn btn-success rounded-pill flex-fill shadow-sm">
              {editingId ? "Update" : "Add"} Category
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm({ name: "" });
                }}
                className="btn btn-secondary rounded-pill flex-fill shadow-sm"
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
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 && (
                <tr>
                  <td colSpan={2} className="text-center py-4 text-muted">
                    No categories found.
                  </td>
                </tr>
              )}
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td>{cat.name}</td>
                  <td className="text-center d-flex justify-content-center gap-2">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="btn btn-warning btn-sm rounded-pill d-flex align-items-center gap-1"
                    >
                      <Edit size={16} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="btn btn-danger btn-sm rounded-pill d-flex align-items-center gap-1"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;
