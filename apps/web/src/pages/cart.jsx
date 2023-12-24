import CartPrice from '../components/cart/cartPrice';
import CartProduct from '../components/cart/cartProduct';

const Cart = () => {
  return (
    <div className="px-5 py-5 sm:px-20 2xl:px-80">
      <h3 className="font-bold text-lg">Shopping Cart (3)</h3>
      <div className="flex flex-col lg:flex-row lg:justify-between lg:gap-10 relative">
        <CartProduct />
        <CartPrice />
      </div>
    </div>
  );
};

export default Cart;
