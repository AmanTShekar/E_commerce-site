// src/components/admin/OfferManager.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Edit, Trash2 } from "react-feather";
import toast from "react-hot-toast";
import { API_BASE } from "../../utils/config";

const OfferManager = () => {
  const [offers, setOffers] = useState([]);
  const [form, setForm] = useState({ title: "", discount: "" });
  const [editingId, setEditingId] = useState(null);

  const API_URL = `${API_BASE}/offers`;

  // Fetch offers from backend
  const fetchOffers = async () => {
    try {
      const res = await axios.get(API_URL);
      setOffers(res.data);
    } catch (err) {
      console.error("Error fetching offers:", err);
      toast.error("Failed to fetch offers");
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert discount to number
    const payload = { ...form, discount: parseFloat(form.discount) };

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, payload);
        toast.success("Offer updated successfully");
      } else {
        await axios.post(API_URL, payload);
        toast.success("Offer added successfully");
      }

      setForm({ title: "", discount: "" });
      setEditingId(null);
      fetchOffers();
    } catch (err) {
      console.error("Error submitting offer:", err);
      toast.error("Failed to submit offer");
    }
  };

  const handleEdit = (offer) => {
    setForm({ title: offer.title, discount: offer.discount });
    setEditingId(offer.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this offer?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      toast.success("Offer deleted successfully");
      fetchOffers();
    } catch (err) {
      console.error("Error deleting offer:", err);
      toast.error("Failed to delete offer");
    }
  };

  return (
    <div className="card shadow-lg rounded-4 mb-5">
      <div className="card-header bg-success text-white fw-bold rounded-top">
        Offer Management
      </div>

      <div className="card-body">
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="row g-3 align-items-center mb-4"
        >
          <div className="col-md-5">
            <input
              type="text"
              name="title"
              placeholder="Offer title"
              value={form.title}
              onChange={handleChange}
              className="form-control rounded-pill shadow-sm"
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="number"
              name="discount"
              placeholder="Discount (%)"
              value={form.discount}
              onChange={handleChange}
              className="form-control rounded-pill shadow-sm"
              required
            />
          </div>
          <div className="col-md-4 d-flex gap-2">
            <button
              type="submit"
              className="btn btn-success rounded-pill flex-fill shadow-sm"
            >
              {editingId ? "Update" : "Add"} Offer
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm({ title: "", discount: "" });
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
                <th>Title</th>
                <th>Discount</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {offers.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center py-4 text-muted">
                    No offers found.
                  </td>
                </tr>
              )}
              {offers.map((offer) => (
                <tr key={offer.id}>
                  <td>{offer.title}</td>
                  <td>{offer.discount}%</td>
                  <td className="text-center d-flex justify-content-center gap-2">
                    <button
                      onClick={() => handleEdit(offer)}
                      className="btn btn-warning btn-sm rounded-pill d-flex align-items-center gap-1"
                    >
                      <Edit size={16} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(offer.id)}
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

export default OfferManager;
