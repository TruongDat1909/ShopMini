
import { useState } from "react";

import Header from "./components/Header";
import Banner from "./components/Banner";
import CategoryList from "./components/CategoryList";
import ProductList from "./components/ProductList";
import Footer from "./components/Footer";
import Cart from "./components/Cart";

import type { CartItem } from "./components/Cart";
import type { Product } from "./data/products";

import { products } from "./data/products";

import "./App.css";

function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = (product: Product) => {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.product.id === product.id
      );

      if (existingItem) {
        if (existingItem.quantity >= product.stock) {
          return currentItems;
        }

        return currentItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      if (product.stock <= 0) {
        return currentItems;
      }

      return [...currentItems, { product, quantity: 1 }];
    });
  };

  // Cập nhật số lượng sản phẩm
  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      setCartItems((items) =>
        items.filter((item) => item.product.id !== id)
      );
      return;
    }

    setCartItems((items) =>
      items.map((item) =>
        item.product.id === id
          ? {
              ...item,
              quantity: Math.min(quantity, item.product.stock),
            }
          : item
      )
    );
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = (id: number) => {
    setCartItems((items) =>
      items.filter((item) => item.product.id !== id)
    );
  };

  // Tổng số lượng sản phẩm trong giỏ
  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <>
      <Header
        cartCount={cartCount}
        onCartClick={() => setShowCart(true)}
        onHomeClick={() => setShowCart(false)}
      />

      {showCart ? (
        <Cart
          items={cartItems}
          onUpdateQuantity={updateQuantity}
          onRemove={removeFromCart}
          onContinueShopping={() => setShowCart(false)}
        />
      ) : (
        <main>
          <Banner />
          <CategoryList />
          <ProductList
            title="Sản phẩm nổi bật"
            items={products}
            onAddToCart={addToCart}
          />
        </main>
      )}

      <Footer />
    </>
  );
}

export default App;
