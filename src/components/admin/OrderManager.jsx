// src/components/admin/OrderManager.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2 } from "react-feather";
import toast from "react-hot-toast";
import { API_BASE } from "../../utils/config"; // use API_BASE

const OrderManager = () => {
  const [orders, setOrders] = useState([]);

  const API_URL = `${API_BASE}/orders`; // dynamic API base

  const fetchOrders = async () => {
    try {
      const res = await axios.get(API_URL);
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      toast.error("Failed to fetch orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await axios.patch(`${API_URL}/${id}`, { status });
      toast.success("Order status updated");
      fetchOrders();
    } catch (err) {
      console.error("Error updating order status:", err);
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      toast.success("Order deleted successfully");
      fetchOrders();
    } catch (err) {
      console.error("Error deleting order:", err);
      toast.error("Failed to delete order");
    }
  };

  return (
    <div className="card shadow-lg rounded-4 mb-5">
      <div className="card-header bg-info text-white fw-bold rounded-top">
        Order Management
      </div>

      <div className="card-body">
        <div className="table-responsive rounded-3 shadow-sm">
          <table className="table table-hover table-striped align-middle mb-0">
            <thead className="table-dark text-uppercase">
              <tr>
                <th>ID</th>
                <th>Product ID</th>
                <th>Quantity</th>
                <th>User</th>
                <th>Status</th>
                <th className="text-center">Update</th>
                <th className="text-center">Delete</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-muted">
                    No orders found.
                  </td>
                </tr>
              )}
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.product_id}</td>
                  <td>{order.quantity}</td>
                  <td>{order.user}</td>
                  <td>{order.status}</td>
                  <td>
                    <select
                      className="form-select form-select-sm"
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="text-center">
                    <button
                      onClick={() => handleDelete(order.id)}
                      className="btn btn-danger btn-sm rounded-pill d-flex align-items-center justify-content-center gap-1"
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

export default OrderManager;
