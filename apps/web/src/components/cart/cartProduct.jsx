import { Button, Typography } from '@material-tailwind/react';
import { FaPlus } from 'react-icons/fa6';
import { FaMinus } from 'react-icons/fa6';
import { FaRegTrashCan } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

export function CartProduct ({ cart, handleIncrement, handleDecrement, handleDelete }) {
  return (
    <div className="flex-1">
      {cart?.map((item) => {
        return (
          <div key={item.id} className="flex gap-5 my-2 border-y-2 py-2">
            <img
              className="rounded-lg h-auto w-32 "
              src={`${import.meta.env.VITE_LOCAL_HOST}${item.Product.productMainPicture}`}
              alt="Product Image"
            />
            <div className="flex flex-col justify-between flex-1">
              <div>
                <Typography variant='h6' className="text-gray-800">{item?.Product?.productName}</Typography>
                <Typography className="font-bold">
                  {item?.Product?.productPrice.toLocaleString('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                  })}
                </Typography>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex border-2 justify-between rounded-lg px-2 py-1 items-center w-24 border-[#49A923]">
                  <div
                    className="hover:bg-[#F6FEF6] p-1 rounded-full cursor-pointer"
                    onClick={() => handleDecrement(item.id)}
                  >
                    <FaMinus size="15" color="#49A923" />
                  </div>
                  <Typography variant='small' className="font-bold">{item?.quantity}</Typography>
                  <div
                    className="hover:bg-[#F6FEF6] p-1 rounded-full cursor-pointer"
                    onClick={() => handleIncrement(item.id)}
                  >
                    <FaPlus size="15" color="#49A923" />
                  </div>
                </div>
                <div
                  className="cursor-pointer text-gray-500 hover:text-red-400"
                  onClick={() => handleDelete(item.id)}
                >
                  <FaRegTrashCan size="20" />
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <Link to="/products">
        <Button color='green'>
          Continue Shopping
        </Button>
      </Link>
    </div>
  );
};