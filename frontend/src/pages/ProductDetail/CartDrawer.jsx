import React from "react";
import "./CartDrawer.css"; // Use SCSS if desired

const CartDrawer = ({
  isOpen,
  cartItems,
  estimatedTotal,
  onClose,
  onIncrement,
  onDecrement,
  onRemove,
  onViewCart,
  onCheckout,
}) => (
  <div className={`drawer-overlay ${isOpen ? "open" : ""}`}>
    <div className="cart-drawer">
      <button className="close-btn" onClick={onClose}>&times;</button>
      <h2 className="drawer-title">MAIN CART</h2>
      <div className="cart-products">
        {cartItems?.map((item, idx) => (
          <div className="cart-item" key={idx}>
            <img src={item.image} alt="" className="cart-item-img" />
            <div className="cart-item-info">
              <div className="cart-item-name">{item.name}</div>
              <div className="cart-item-details">
                <span>Size: {item.size}</span>
                <span>₹{item.price.toLocaleString()}</span>
              </div>
              <div className="cart-qty-actions">
                <button onClick={() => onDecrement(idx)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => onIncrement(idx)}>+</button>
              </div>
            </div>
            <button className="cart-remove-btn" onClick={() => onRemove(idx)}>
              🗑️
            </button>
          </div>
        ))}
      </div>
      <div className="cart-total-section">
        <div className="cart-total-label">Estimated total</div>
        <div className="cart-total-value">₹{estimatedTotal?.toLocaleString()}</div>
        <div className="cart-total-note">Taxes, Discounts and shipping calculated at checkout</div>
      </div>
      <button className="checkout-btn" onClick={onCheckout}>CHECK OUT</button>
      <button className="view-cart-btn" onClick={onViewCart}>VIEW MY CART</button>
    </div>
  </div>
);

export default CartDrawer;
