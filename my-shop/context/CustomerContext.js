// context/CustomerContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const CustomerContext = createContext();

export function CustomerProvider({ children, userId }) {
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // --- Fetch Cart from DB ---
  const fetchCart = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`/api/cart?userId=${userId}`);
      const json = await res.json();
      if (json.success) setCart(json.data.items || []);
    } catch (err) {
      console.error(err);
    }
  };

  // --- Fetch Favorites from DB ---
  const fetchFavorites = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`/api/favorites?userId=${userId}`);
      const json = await res.json();
      if (json.success) setFavorites(json.data.products || []);
    } catch (err) {
      console.error(err);
    }
  };

  // --- Add Product to Cart ---
  const addToCart = async (product) => {
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId: product._id, quantity: 1 }),
      });
      const json = await res.json();
      if (json.success) fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  // --- Update Cart Quantity ---
  const updateCartQuantity = async (productId, quantity) => {
    try {
      const res = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId, quantity }),
      });
      const json = await res.json();
      if (json.success) fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  // --- Remove from Cart ---
  const removeFromCart = async (productId) => {
    try {
      const res = await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId }),
      });
      const json = await res.json();
      if (json.success) fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  // --- Add Product to Favorites ---
  const addToFavorites = async (product) => {
    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId: product._id }),
      });
      const json = await res.json();
      if (json.success) fetchFavorites();
    } catch (err) {
      console.error(err);
    }
  };

  // --- Remove Product from Favorites ---
  const removeFromFavorites = async (productId) => {
    try {
      const res = await fetch('/api/favorites', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId }),
      });
      const json = await res.json();
      if (json.success) fetchFavorites();
    } catch (err) {
      console.error(err);
    }
  };

  // --- Fetch cart and favorites on mount / userId change ---
  useEffect(() => {
    if (userId) {
      fetchCart();
      fetchFavorites();
    }
  }, [userId]);

  return (
    <CustomerContext.Provider
      value={{
        cart,
        favorites,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        addToFavorites,
        removeFromFavorites,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}

// --- Hook to use context ---
export const useCustomer = () => useContext(CustomerContext);
