import { useEffect, useState } from 'react';
import CartPrice from '../components/cart/cartPrice';
import CartProduct from '../components/cart/cartProduct';
import { Axios } from '../lib/api';
import { useSelector } from 'react-redux';
import CartEmpty from '../components/cart/cartEmpty';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);

  const user = useSelector((state) => state.user.value);

  const getData = async () => {
    try {
      const response = await Axios.get(`carts/${user?.id}`);
      const total = response?.data?.reduce(
        (acc, item) => {
          acc.totalPrice += item.Product.productPrice * item.quantity;
          acc.totalQuantity += item.quantity;
          return acc;
        },
        { totalPrice: 0, totalQuantity: 0 },
      );

      const { totalPrice, totalQuantity } = total;

      setQuantity(totalQuantity);
      setPrice(totalPrice);
      setCart(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleIncrement = async (id) => {
    try {
      await Axios.patch(`/carts/increment/${id}`);
      getData();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDecrement = async (id) => {
    try {
      await Axios.patch(`/carts/decrement/${id}`);
      getData();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await Axios.delete(`/carts/${id}`);
      getData();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, [user]);

  return (
    <div className="px-5 py-5 sm:px-20 2xl:px-80 lg:pb-44">
      <h3 className={cart.length !== 0 ? 'font-bold text-lg' : 'hidden'}>
        Shopping Cart ({quantity})
      </h3>
      <div className="flex flex-col lg:flex-row lg:justify-between lg:gap-10 relative">
        {cart.length !== 0 ? (
          <>
            <CartProduct
              cart={cart}
              handleIncrement={handleIncrement}
              handleDecrement={handleDecrement}
              handleDelete={handleDelete}
            />
            <CartPrice price={price} quantity={quantity} />
          </>
        ) : (
          <CartEmpty />
        )}
      </div>
    </div>
  );
};

export default Cart;
