import { useEffect, useState } from 'react';
import { CartPrice } from '../components/cart/cartPrice';
import { CartProduct } from '../components/cart/cartProduct';
import { Axios } from '../lib/api';
import { useDispatch, useSelector } from 'react-redux';
import { CartEmpty } from '../components/cart/cartEmpty';
import { Card } from '@material-tailwind/react';
import { setQuantity } from "../redux/cartSlice";
import { NavBar } from '../components/navbar/navbar';
import { Footer } from '../components/footer';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [price, setPrice] = useState(0);
  const [weight, setWeight] = useState(0);
  const dispatch = useDispatch()

  const user = useSelector((state) => state.user.value);
  const quantity = useSelector((state) => state.cart.quantityValue)

  const getData = async () => {
    try {
      const response = await Axios.get(`carts/${user?.id}`);
      const total = response?.data?.reduce(
        (acc, item) => {
          acc.totalPrice += item.Product.productPrice * item.quantity;
          acc.totalQuantity += item.quantity;
          acc.totalWeight += item.Product.productWeight
          return acc;
        },
        { totalPrice: 0, totalQuantity: 0, totalWeight: 0 },
      );

      const { totalPrice, totalQuantity, totalWeight } = total;

      dispatch(setQuantity(totalQuantity));
      setPrice(totalPrice);
      setCart(response?.data);
      setWeight(totalWeight)
    } catch (error) {
    }
  };

  const handleIncrement = async (id) => {
    try {
      await Axios.patch(`/carts/increment/${id}`);
      getData();
    } catch (error) {
    }
  };

  const handleDecrement = async (id) => {
    try {
      await Axios.patch(`/carts/decrement/${id}`);
      getData();
    } catch (error) {
    }
  };

  const handleDelete = async (id) => {
    try {
      await Axios.delete(`/carts/${id}`);
      getData();
    } catch (error) {
    }
  };

  useEffect(() => {
    getData();
  }, [user]);

  return (
    <div className="flex flex-col justify-between h-screen">
      <div className='bg-gray-100'>
        <NavBar />
        <div className="mx-auto h-full pt-2 px-0 lg:px-2 w-full bg-white md:w-4/5 lg:w-3/4">
          <Card className="h-full py-4 px-4">
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
                  <CartPrice price={price} quantity={quantity} weight={weight} />
                </>
              ) : (
                <CartEmpty />
              )}
            </div>
          </Card>
        </div>
      </div>
      <Footer />      
    </div>
  );
};

export default Cart;
