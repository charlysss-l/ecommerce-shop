import { createContext, useState, useEffect } from 'react';

export const CustomerContext = createContext();

export function CustomerProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    const storedCart = localStorage.getItem('cart');

    if (storedFavorites) setFavorites(JSON.parse(storedFavorites));
    if (storedCart) setCart(JSON.parse(storedCart));
  }, []);

  // Save to localStorage whenever favorites or cart change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToFavorites = (product) => {
    if (!favorites.find(p => p._id === product._id)) {
      setFavorites([...favorites, product]);
    }
  };

  const addToCart = (product) => {
    if (!cart.find(p => p._id === product._id)) {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  return (
    <CustomerContext.Provider value={{ favorites, addToFavorites, cart, addToCart }}>
      {children}
    </CustomerContext.Provider>
  );
}
