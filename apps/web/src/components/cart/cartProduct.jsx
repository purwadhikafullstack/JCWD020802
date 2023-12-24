import { FaPlus } from 'react-icons/fa6';
import { FaMinus } from 'react-icons/fa6';
import { FaRegTrashCan } from 'react-icons/fa6';
import { IoIosHeartEmpty } from 'react-icons/io';
// import { IoIosHeart } from 'react-icons/io';

const product = [
  {
    id: 1,
    name: 'Kursi',
    img: 'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-1.jpg',
    price: 50.0,
    quantity: 1,
  },
  {
    id: 2,
    name: 'Meja',
    img: 'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-1.jpg',
    price: 50.0,
    quantity: 1,
  },
  {
    id: 2,
    name: 'Meja',
    img: 'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-1.jpg',
    price: 50.0,
    quantity: 5,
  },
  {
    id: 2,
    name: 'Meja',
    img: 'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-1.jpg',
    price: 50.0,
    quantity: 5,
  },
  {
    id: 2,
    name: 'Meja',
    img: 'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-1.jpg',
    price: 50.0,
    quantity: 5,
  },
];

const CartProduct = () => {
  return (
    <div className="flex-1">
      {product.map((item) => {
        return (
          <div key={item.id} className="flex gap-5 my-2 border-y-2 py-2">
            <img
              className="rounded-lg h-auto w-32 "
              src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-1.jpg"
              alt=""
            />
            <div className="flex flex-col justify-between flex-1">
              <div>
                <h3 className="text-gray-800">Kursi Belajar</h3>
                <p className="font-bold">Rp50.000</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex border-2 justify-between rounded-lg px-2 py-1 items-center w-24 border-[#49A923]">
                  <p className="hover:bg-[#F6FEF6] p-1 rounded-full cursor-pointer">
                    <FaMinus size="15" color="#49A923" />
                  </p>
                  <p className="text-md ">1</p>
                  <p className="hover:bg-[#F6FEF6] p-1 rounded-full cursor-pointer">
                    <FaPlus size="15" color="#49A923" />
                  </p>
                </div>
                <p className="cursor-pointer text-gray-500 hover:text-red-400">
                  <FaRegTrashCan size="20" />
                </p>
                <p className="text-gray-500">
                  <IoIosHeartEmpty size="25" />
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CartProduct;
