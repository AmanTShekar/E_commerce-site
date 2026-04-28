import React from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle2, ChevronRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import styles from './Profile.module.css'; // Reusing profile styles for consistency

const Orders: React.FC = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  };

  // Mock Orders Data
  const orders = [
    {
      id: 'NX-89231',
      date: 'Oct 24, 2026',
      total: 45000,
      status: 'Delivered',
      items: [
        { name: 'Studio Monitor Gen 3', image: 'https://images.unsplash.com/photo-1588333390623-0ef50d75a874?q=80&w=2070&auto=format&fit=crop' }
      ]
    },
    {
      id: 'NX-89012',
      date: 'Oct 12, 2026',
      total: 12500,
      status: 'In Transit',
      items: [
        { name: 'Mechanical Switch Set', image: 'https://images.unsplash.com/photo-1618335829737-2228ad3088c3?q=80&w=2070&auto=format&fit=crop' }
      ]
    }
  ];

  return (
    <div style={{ padding: '120px 20px', minHeight: '100vh', background: 'var(--color-bg)' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <motion.div {...fadeInUp} style={{ marginBottom: '40px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800 }}>Order History</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Track your studio deployments and equipment acquisitions.</p>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map(order => (
            <motion.div 
              key={order.id}
              {...fadeInUp}
              style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid var(--color-border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '16px' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Order ID</span>
                  <h4 style={{ fontWeight: 700 }}>{order.id}</h4>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Placed On</span>
                  <p style={{ fontWeight: 500 }}>{order.date}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Total</span>
                  <p style={{ fontWeight: 700 }}>₹{order.total.toLocaleString()}</p>
                </div>
                <div>
                  <span style={{ 
                    padding: '6px 12px', 
                    borderRadius: '50px', 
                    background: order.status === 'Delivered' ? '#e8f5e9' : '#fff3e0',
                    color: order.status === 'Delivered' ? '#2e7d32' : '#ef6c00',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    {order.status === 'Delivered' ? <CheckCircle2 size={14} /> : <Truck size={14} />}
                    {order.status}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                {order.items.map((item, index) => (
                  <div key={index} style={{ display: 'flex', gap: '15px', alignItems: 'center', flex: 1 }}>
                    <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover' }} />
                    <div>
                      <h5 style={{ fontWeight: 600 }}>{item.name}</h5>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Artisan Batch #102</span>
                    </div>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Button variant="secondary" size="sm">Track Order</Button>
                  <Button variant="ghost" size="sm">Details <ExternalLink size={14} /></Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {orders.length === 0 && (
          <EmptyState 
            type="orders"
            title="No deployments detected."
            message="Your studio history is currently clear. Start your first equipment acquisition from our curated marketplace."
          />
        )}
      </div>
    </div>
  );
};

export default Orders;
