const CartPrice = () => {
  return (
    <div className="lg:w-80 lg:border-2 rounded-lg lg:p-5 h-full lg:shadow-md lg:sticky lg:top-[120px]">
      <h3 className="font-bold text-md">Order Summary</h3>
      <div className="flex justify-between">
        <p>Items ( 3 ) </p>
        <p>Rp150.000</p>
      </div>
      <div className="flex justify-between">
        <p>Discount </p>
        <p>0</p>
      </div>
      <div className="flex justify-between font-bold border-t-2 py-2 my-2">
        <p>Total Price </p>
        <p>Rp450.000</p>
      </div>
      <button
        className="select-none w-full rounded-lg bg-green-500 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-green-500/20 transition-all hover:shadow-lg hover:shadow-green-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        type="button"
      >
        continue
      </button>
    </div>
  );
};

export default CartPrice;
