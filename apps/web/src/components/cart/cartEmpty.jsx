import { Link } from 'react-router-dom';

const CartEmpty = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-5 flex-1">
      <img
        src="https://media.discordapp.net/attachments/994265230987243552/1188448533884448829/Empty-rafiki.png?ex=659a8ff2&is=65881af2&hm=cdb222bd68694bc20c2f7ef45ecb03fa22276c50c4290a1ddd039bc486c19f50&=&format=webp&quality=lossless&width=889&height=889"
        alt=""
        className="w-64 h-auto"
      />
      <p className="font-bold text-xl">Whoops! Your cart is empty</p>
      <Link
        to="/"
        className="select-none rounded-lg bg-green-500 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-green-500/20 transition-all hover:shadow-lg hover:shadow-green-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        type="button"
      >
        start shopping
      </Link>
    </div>
  );
};

export default CartEmpty;
