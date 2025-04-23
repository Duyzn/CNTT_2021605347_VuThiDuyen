import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [cartCount, setCartCount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartInfo();
  }, [cartItems]);

  const addToCart = (product, quantity, toppings = []) => {
    console.log('Adding to cart:', product);
    
    const existingItem = cartItems.find(item => 
      item.productId === product.id && 
      JSON.stringify(item.toppings) === JSON.stringify(toppings)
    );

    if (existingItem) {
      const updatedItems = cartItems.map(item =>
        (item.productId === product.id && 
         JSON.stringify(item.toppings) === JSON.stringify(toppings))
          ? {...item, quantity: item.quantity + quantity} 
          : item
      );
      setCartItems(updatedItems);
    } else {
      setCartItems([...cartItems, {
        productId: product.id,
        name: product.name,
        price: product.price,
        image_name: product.image_name,
        quantity: quantity,
        toppings: toppings
      }]);
    }
  };

  const updateCartInfo = () => {
    const newCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    const newTotal = cartItems.reduce((total, item) => {
      const itemTotal = parseFloat(item.price || 0) * item.quantity;
      const toppingTotal = Array.isArray(item.toppings) 
        ? item.toppings.reduce((t, top) => t + parseFloat(top.price_adjustment || 0), 0) 
        : 0;
      return total + itemTotal + (toppingTotal * item.quantity);
    }, 0);

    setCartCount(newCount);
    setTotalAmount(newTotal);
  };

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    setCartItems(cartItems.map(item => 
      item.productId === productId 
        ? {...item, quantity: newQuantity}
        : item
    ));
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      cartCount, 
      totalAmount, 
      addToCart,
      removeFromCart,
      updateQuantity,
      setCartItems 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);