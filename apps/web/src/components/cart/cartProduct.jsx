import { FaPlus } from 'react-icons/fa6';
import { FaMinus } from 'react-icons/fa6';
import { FaRegTrashCan } from 'react-icons/fa6';
import { IoIosHeartEmpty } from 'react-icons/io';
import { Link } from 'react-router-dom';

const CartProduct = ({
  cart,
  handleIncrement,
  handleDecrement,
  handleDelete,
}) => {
  return (
    <div className="flex-1">
      {cart?.map((item) => {
        return (
          <div key={item.id} className="flex gap-5 my-2 border-y-2 py-2">
            <img
              className="rounded-lg h-auto w-32 "
              src="https://kemahasiswaan.ummuba.ac.id/wp-content/uploads/2021/04/chair-2@2x.jpg"
              alt=""
            />
            <div className="flex flex-col justify-between flex-1">
              <div>
                <h3 className="text-gray-800">{item?.Product?.productName}</h3>
                <p className="font-bold">
                  {item?.Product?.productPrice.toLocaleString('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                  })}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex border-2 justify-between rounded-lg px-2 py-1 items-center w-24 border-[#49A923]">
                  <p
                    className="hover:bg-[#F6FEF6] p-1 rounded-full cursor-pointer"
                    onClick={() => handleDecrement(item.id)}
                  >
                    <FaMinus size="15" color="#49A923" />
                  </p>
                  <p className="text-md ">{item?.quantity}</p>
                  <p
                    className="hover:bg-[#F6FEF6] p-1 rounded-full cursor-pointer"
                    onClick={() => handleIncrement(item.id)}
                  >
                    <FaPlus size="15" color="#49A923" />
                  </p>
                </div>
                <p
                  className="cursor-pointer text-gray-500 hover:text-red-400"
                  onClick={() => handleDelete(item.id)}
                >
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
      <p className="text-gray-600 pb-10">
        <Link to="/">Continue Shopping</Link>
      </p>
    </div>
  );
};

export default CartProduct;
