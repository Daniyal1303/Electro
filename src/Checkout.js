import { useEffect, useState, useCallback, useMemo } from "react";
import styles from "./Checkout.module.css";
import { LoadingIcon } from "./Icons";
import { getProducts } from "./dataService";

// You are provided with an incomplete <Checkout /> component.
// You are not allowed to add any additional HTML elements.
// You are not allowed to use refs.

// Demo video - You can view how the completed functionality should look at: https://drive.google.com/file/d/1o2Rz5HBOPOEp9DlvE9FWnLJoW9KUp5-C/view?usp=sharing

// Once the <Checkout /> component is mounted, load the products using the getProducts function.
// Once all the data is successfully loaded, hide the loading icon.
// Render each product object as a <Product/> component, passing in the necessary props.
// Implement the following functionality:
//  - The add and remove buttons should adjust the ordered quantity of each product
//  - The add and remove buttons should be enabled/disabled to ensure that the ordered quantity can’t be negative and can’t exceed the available count for that product.
//  - The total shown for each product should be calculated based on the ordered quantity and the price
//  - The total in the order summary should be calculated
//  - For orders over $1000, apply a 10% discount to the order. Display the discount text only if a discount has been applied.
//  - The total should reflect any discount that has been applied
//  - All dollar amounts should be displayed to 2 decimal places

const Product = ({
  id,
  name,
  availableCount,
  price,
  orderedQuantity,
  total,
}) => {
  return (
    <tr>
      <td>{id}</td>
      <td>{name}</td>
      <td>{availableCount}</td>
      <td>${price}</td>
      <td>{orderedQuantity}</td>
      <td>${total}</td>
      <td>
        <button className={styles.actionButton}>+</button>
        <button className={styles.actionButton}>-</button>
      </td>
    </tr>
  );
};

const Checkout = () => {
  const [products, setProducts] = useState([]);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    getProducts()
      .then((data) => {
        const productsWithQuantity = data.map((product) => ({
          ...product,
          quantity: 0,
        }));
        setProducts(productsWithQuantity);
      })
      .catch((error) => console.log(error));
  }, []);

  const updateQuantity = useCallback(
    (productId, updatedParameter) => {
      const index = products.findIndex((product) => product.id === productId);
      // console.log("=======product", index);

      const updatedProduct = {
        ...products[index],
        quantity:
          updatedParameter === "increase"
            ? products[index].quantity + 1
            : products[index].quantity - 1,
      };

      const updatedProducts = [...products];
      updatedProducts[index] = updatedProduct;
      // console.log("updated quantity======", updatedProducts);
      setProducts(updatedProducts);
    },
    [products]
  );

  const totalAmount = () => {
    if (products.length) {
      const amount = products.reduce(
        (total, currentValue) =>
          (total = total + currentValue.quantity * currentValue.price),
        0
      );

      return amount.toFixed(2);
    }
  };

  useMemo(() => {
    if (totalAmount() > 1000) {
      const discountedAmount = (totalAmount() * 0.1).toFixed(2);
      setDiscount(discountedAmount);
    }
  }, [products]);

  // console.log("products=======", products);
  return (
    <div>
      <header className={styles.header}>
        <h1>Electro World</h1>
      </header>
      <main>
        {!products.length && <LoadingIcon />}
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Name</th>
              <th># Available</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {/* Products should be rendered here */}
            {products.map((product) => (
              <tr key={product.id}>
                <th>{product.id}</th>
                <th>{product.name}</th>
                <th>{product.availableCount}</th>
                <th>{`$ ${product.price}`}</th>
                <th>{product.quantity}</th>
                <th>{`$ ${(product.price * product.quantity).toFixed(2)}`}</th>
                <th>
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={
                      product.quantity === product.availableCount ? true : false
                    }
                    onClick={() => updateQuantity(product.id, "increase")}
                  >
                    +
                  </button>
                </th>
                <th>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    disabled={product.quantity === 0 ? true : false}
                    onClick={() => updateQuantity(product.id, "decrease")}
                  >
                    -
                  </button>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
        <h2>Order summary</h2>
        <p>Discount: $ {discount} </p>
        <p>Total: $ {totalAmount()} </p>
      </main>
    </div>
  );
};

export default Checkout;
