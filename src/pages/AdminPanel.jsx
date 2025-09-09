// src/pages/AdminPanel.tsx
import React from "react";
import { Package, Layers, Tag, ShoppingCart } from "lucide-react";
import ProductManager from "../components/admin/ProductManager";
import CategoryManager from "../components/admin/CategoryManager";
import OfferManager from "../components/admin/OfferManager";
import OrderManager from "../components/admin/OrderManager";

const AdminPanel: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 px-6 py-12">
      {/* Page Title */}
      <h1 className="text-5xl font-extrabold text-gray-900 mb-12 text-center tracking-tight drop-shadow-lg animate-fade-in">
        Admin Dashboard
      </h1>

      {/* Dashboard Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
        {/* Product Management */}
        <section className="p-6 bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-gray-200 hover:shadow-2xl hover:-translate-y-2 transform transition-all duration-300">
          <div className="flex items-center gap-3 mb-5">
            <Package className="text-blue-600 w-8 h-8" />
            <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-blue-500 pl-3">
              Product Management
            </h2>
          </div>
          <ProductManager />
        </section>

        {/* Category Management */}
        <section className="p-6 bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-gray-200 hover:shadow-2xl hover:-translate-y-2 transform transition-all duration-300">
          <div className="flex items-center gap-3 mb-5">
            <Layers className="text-green-600 w-8 h-8" />
            <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-green-500 pl-3">
              Category Management
            </h2>
          </div>
          <CategoryManager />
        </section>

        {/* Offer Management */}
        <section className="p-6 bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-gray-200 hover:shadow-2xl hover:-translate-y-2 transform transition-all duration-300">
          <div className="flex items-center gap-3 mb-5">
            <Tag className="text-purple-600 w-8 h-8" />
            <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-purple-500 pl-3">
              Offer Management
            </h2>
          </div>
          <OfferManager />
        </section>

        {/* Order Management */}
        <section className="p-6 bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-gray-200 hover:shadow-2xl hover:-translate-y-2 transform transition-all duration-300">
          <div className="flex items-center gap-3 mb-5">
            <ShoppingCart className="text-red-600 w-8 h-8" />
            <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-red-500 pl-3">
              Order Management
            </h2>
          </div>
          <OrderManager />
        </section>
      </div>
    </div>
  );
};

export default AdminPanel;
