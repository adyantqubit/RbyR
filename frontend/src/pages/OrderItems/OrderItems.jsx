/**Code added by Unnati on 10-01-2025
 * Reason-Added order item page
 */

import React, { useContext, useEffect, useState } from "react";
import { getOrderItems,checkProductAvailability } from "../../Api/services";
import styles from "./OrderItems.module.css";
import config from "../../Api/config";
import { DateFormatter } from "../../utils/DateFormat";
import { useNavigate,Link } from "react-router-dom";
import { GlobalContext } from "../../context/Context";

const OrderItems = () => {
  const navigate = useNavigate();
  // Added by - Ashlekh on 07-02-2025
  // Reason - To import user variable from context
  const { user } = useContext(GlobalContext);
  // End of code - Ashlekh on 07-02-2025
  // Reason - To import user variable from context
   const [unavailableProduct,setUnavailableProduct]=useState(
      {
        productId:"",
        color:"",
   
      }
    )
  const [groupedOrders, setGroupedOrders] = useState({});
  const handleViewOrder = (order) => {
    navigate(`/orderdetail/${order.id}`, { state: { order } });
  };
  useEffect(() => {
    const fetchOrderItems = async () => {
      try {
        // Code changed by - Ashlekh on 07-02-2025
        // Reason - To send user.id in backend. In backend we will filter Order details using user id
        // const data = await getOrderItems();
        const data = await getOrderItems(user.id);
        // End of code - Ashlekh on 07-02-2025
        // Reason - To send user.id in backend. In backend we will filter Order details using user id
        const groupedOrders = data.orders.reduce((acc, order) => {
          acc[order.order_id] = {
            order: order,
            items: [],
          };
          return acc;
        }, {});

        data.order_items.forEach((item) => {
          const { order_id } = item;
          if (groupedOrders[order_id]) {
            groupedOrders[order_id].items.push(item);
          }
        });
        setGroupedOrders(groupedOrders);
      } catch (error) {
        console.error("Error fetching order items:", error.message);
      }
    };

    fetchOrderItems();
  // }, []);
  }, [user.id]);
const handleCheckProductAvailability = async (product_id,color,product)=>{
    const response = await checkProductAvailability(product_id,color);
    if (response?.is_product_available==false){
        setUnavailableProduct((prevState) => ({
          ...prevState,
          productId:product_id,
          color:color,
        }))
    }else{
      setUnavailableProduct((prevState) => ({
        ...prevState,
        productId:"",
        color:"",
      }))
      navigate(`/productdetail/${product_id ? product_id  : product  }`,{state:color})
    }
  }
  return (
    <div className={styles.container}>
      {Object.entries(groupedOrders).map(([orderId, { order, items }]) => (
        <div key={orderId} className={styles.card}>
          <div className={styles.orderHeader}>
            <div className={styles.orderPlaced}>
              <p>
                <strong>Order Placed:</strong>
                {DateFormatter(order.date) || "N/A"}
              </p>
              <p>
                <strong>Total:</strong> ₹{order.grand_total}
              </p>
            </div>
            <div className={styles.orderDetail}>
              <p>
                <strong>Order ID:</strong> {orderId}
              </p>
              <p>
                <strong>Payment Status:</strong> {order.payment_status}
              </p>
            </div>
          </div>

          <div className={styles.items}>
            {items.map((item) => (
              <div key={item.id} className={styles.item}>
                {item.is_active ? (
                  <Link
                    to={`/productdetail/${
                      item.product_id ? item.product_id : item.product
                    }`}
                    state={item.color}
                  >
                    <img
                      src={`${config.baseURL}${item.product_image1}`}
                      alt={item.product_name}
                      className={styles.itemImage}
                      onClick={(e) => {
                        handleCheckProductAvailability(
                          item.product_id,
                          item.color,
                          item.product
                        );
                      }}
                    />
                  </Link>
                ) : (
                  <img
                    onClick={(e) => {
                      handleCheckProductAvailability(
                        item.product_id,
                        item.color,
                        item.product
                      );
                    }}
                    src={`${config.baseURL}${item.product_image1}`}
                    alt={item.product_name}
                    className={styles.itemImage}
                  />
                )}

                <div className={styles.itemDetails}>
                  <p>{item.product_name}</p>
                  <p className={styles.notAvailableMessage}>
                                                {item.product_id==unavailableProduct.productId && item.color==unavailableProduct.color
                                                  ? "This product is not available"
                                                  : ""}
                                              </p>
                  <p>
                    <strong>Item Total:</strong> ₹{item.total_amount}
                  </p>
                  <p className={styles.greenStatus}> {item.item_status}</p>
                </div>
              </div>
            ))}
          </div>
          <button
            className={styles.orderDetailButton}
            onClick={() => handleViewOrder(order)}
          >
            View Order Details
          </button>
        </div>
      ))}
    </div>
  );
};

export default OrderItems;
/*End of code addition by Unnati on 10-01-2025
 * Reason-Added order item page
 */