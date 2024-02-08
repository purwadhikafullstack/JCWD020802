import { useEffect, useState } from "react";
import SelectAddressButton from "./selectAddressButton";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { Axios } from "../../lib/api";
import { toast } from "react-toastify";

const CartPrice = ({ price, quantity, weight }) => {
  const token = localStorage.getItem('token');
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [warehouses, setWarehouses] = useState(null)
  const [selectedDestination, setSelectedDestination] = useState(null)
  const [lat, setLat] = useState(null)
  const [long, setLong] = useState(null)

  const getWarehouse = async () => {
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    }
    try {
      const result = await Axios.get("warehouses", config)
      setWarehouses(result.data)
      toast.success("Success getting warehouse data!")
    } catch (error) {
      toast.error("Failed getting warehouse data!")
    }
  }

  useEffect(() => {
    getWarehouse()
  }, [token])

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;

    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;


    return distance;
  }

  const findNearestDestination = (destinations, originLat, originLon) => {
    let nearestDistance = Infinity;
    let nearestDestination = null;;

    for (const destination of destinations) {
      console.log(originLat);
      console.log(originLon);
      const distance = calculateDistance(
        originLat,
        originLon,
        destination.latitude,
        destination.longtitude
      );

      console.log(distance);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestDestination = destination;
      }
    }

    return nearestDestination;
  }

  useEffect(() => {
    console.log(selectedAddress);
    console.log(warehouses);
    if (selectedAddress) {
      const nearestDestination = findNearestDestination(
        warehouses,
        selectedAddress.latitude,
        selectedAddress.longtitude
      );
      console.log(nearestDestination);
      setSelectedDestination(nearestDestination);
    }
  }, [selectedAddress]);

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    setLat(address.latitude)
    setLong(address.longtitude)
    // findNearestDestination(warehouses, selectedAddress.latitude, selectedAddress.longitude);
  };
  
  console.log(selectedDestination);

  
  return (
    <div className="lg:w-80 lg:border-2 rounded-lg lg:p-5 h-full lg:shadow-md lg:sticky lg:top-[120px]">
      <Typography variant="h5" className="mb-2">Order Summary</Typography>
      <div className="flex flex-col gap-1">
        <div className="flex justify-between">
          <Typography variant="paragraph" className="font-bold">
            Items ({quantity})
          </Typography>
          <Typography variant="paragraph" className="font-normal">
            {price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
          </Typography>
        </div>
        <div className="flex justify-between">
          <Typography variant="paragraph" className="font-bold">Total Weight</Typography>
          <Typography variant="paragraph" className="font-normal">
            { weight / 1000 } Kg
          </Typography>
        </div>
      </div>
      <SelectAddressButton onSelectAddress={handleSelectAddress} />
      {selectedAddress && (
        <div className="flex flex-col mt-4">
          <Card className="w-full">
          <Typography variant="h6">Selected Address:</Typography>
            <CardBody>
              <Typography variant="h6">
                {selectedAddress.label}
              </Typography>
              <Typography variant="lead" className="text-base">
                {selectedAddress.City.Province.province}, {selectedAddress.City.city_name}
              </Typography>
            </CardBody>
          </Card>
        </div>
      )}
      <div className="flex justify-between font-bold border-t-2 py-2 my-2">
        <p>Total Price </p>
        <p>
          {price.toLocaleString('id-ID', {
            style: 'currency',
            currency: 'IDR',
          })}
        </p>
      </div>
      <button
        className="select-none w-full rounded-lg bg-green-500 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-green-500/20 transition-all hover:shadow-lg hover:shadow-green-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        type="button"
      >
        checkout
      </button>
    </div>
  );
};

export default CartPrice;
