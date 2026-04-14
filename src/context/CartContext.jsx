import { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

const initialState = {
  cartItems: [],
  wishlistItems: [],
  cartCount: 0,
  wishlistCount: 0,
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existing = state.cartItems.find(item => item.id === action.payload.id);
      let newCartItems;
      if (existing) {
        newCartItems = state.cartItems.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
            : item
        );
      } else {
        newCartItems = [...state.cartItems, { ...action.payload, quantity: action.payload.quantity || 1 }];
      }
      return {
        ...state,
        cartItems: newCartItems,
        cartCount: newCartItems.reduce((sum, item) => sum + item.quantity, 0),
      };
    }
    case 'TOGGLE_WISHLIST': {
      const exists = state.wishlistItems.find(item => item.id === action.payload.id);
      let newWishlist;
      if (exists) {
        newWishlist = state.wishlistItems.filter(item => item.id !== action.payload.id);
      } else {
        newWishlist = [...state.wishlistItems, action.payload];
      }
      return {
        ...state,
        wishlistItems: newWishlist,
        wishlistCount: newWishlist.length,
      };
    }
    case 'REMOVE_FROM_CART': {
      const newCartItems = state.cartItems.filter(item => item.id !== action.payload.id);
      return {
        ...state,
        cartItems: newCartItems,
        cartCount: newCartItems.reduce((sum, item) => sum + item.quantity, 0),
      };
    }
    case 'UPDATE_QUANTITY': {
      const newCartItems = state.cartItems.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0);
      return {
        ...state,
        cartItems: newCartItems,
        cartCount: newCartItems.reduce((sum, item) => sum + item.quantity, 0),
      };
    }
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addToCart = (product, quantity = 1) => {
    dispatch({ type: 'ADD_TO_CART', payload: { ...product, quantity } });
  };

  const toggleWishlist = (product) => {
    dispatch({ type: 'TOGGLE_WISHLIST', payload: product });
  };

  const removeFromCart = (id) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { id } });
  };

  const updateQuantity = (id, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const isInWishlist = (id) => {
    return state.wishlistItems.some(item => item.id === id);
  };

  return (
    <CartContext.Provider value={{
      ...state,
      addToCart,
      removeFromCart,
      updateQuantity,
      toggleWishlist,
      isInWishlist,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
