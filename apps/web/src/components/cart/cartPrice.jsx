import { useEffect, useState } from "react";
import SelectAddressButton from "./selectAddressButton";
import { Button, Card, CardBody, Typography } from "@material-tailwind/react";
import { Axios } from "../../lib/api";
import { toast } from "react-toastify";
import Select from 'react-select';
import axios from "axios";

const CartPrice = ({ price, quantity, weight }) => {
  const token = localStorage.getItem('token');
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [warehouses, setWarehouses] = useState(null)
  const [selectedDestination, setSelectedDestination] = useState(null)
  const [selectedCourier, setSelectedCourier] = useState(null)
  const [services, setServices] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [totalPrice, setTotalPrice] = useState(null);
  
  const courierOptions = [
    { label: "JNE", value: "jne" },
    { label: "POS Indonesia", value: "pos" },
    { label: "TIKI", value: "tiki" },
  ];

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
      const distance = calculateDistance(
        originLat,
        originLon,
        destination.latitude,
        destination.longtitude
      );

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestDestination = destination;
      }
    }

    return nearestDestination;
  }

  useEffect(() => {
    if (selectedAddress) {
      const nearestDestination = findNearestDestination(
        warehouses,
        selectedAddress.latitude,
        selectedAddress.longtitude
      );
      setSelectedDestination(nearestDestination);
    }
  }, [selectedAddress]);

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
  };

  const getServices = async () => {
    const apiKey = import.meta.env.RAJAONGKIR_API;

    const config = {
      headers: {
        "key": "1c0a173111985e49ddd6d798c4c7ec9f",
        "content-type": "application/x-www-form-urlencoded"
      },
    };

    const requestBody = {
      origin: selectedAddress.CityId,
      destination: selectedDestination.CityId,
      weight: weight,
      courier: selectedCourier.value,
    };

    try {
      const response = await Axios.post(
        "rajaongkir/cost",
        requestBody,
        config
      );

      setServices(response.data.rajaongkir.results[0]);
    } catch (error) {
      toast.error("Failed calculating shipping cost!");
    }
  };

  useEffect(() => {
    getServices()
  }, [selectedCourier])

  const handleSelectService = (service) => {
    setSelectedService(service);
  };

  useEffect(() => {
    if (selectedService) {
      const newTotalPrice = price + selectedService.value;
      console.log(newTotalPrice);
      setTotalPrice(newTotalPrice);
    }
  }, [selectedService]);

  console.log(selectedService);
  console.log(totalPrice);

  
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
      <div className="flex flex-col mt-4">
        <Typography variant="h6">Select Courier:</Typography>
        <Select
          placeholder="Courier..."
          options={courierOptions}
          value={selectedCourier}
          onChange={(value) => setSelectedCourier(value)}
          isClearable
        />
        {services && (
        <div className="flex flex-col mt-4">
          <Typography variant="h6">Select Service:</Typography>
          <Select
            placeholder="Service..."
            options={services.costs.map((service) => ({
              label: `${service.service} - ${service.cost[0].value.toLocaleString('id-ID', {
                style: 'currency',
                currency: 'IDR',
              })} - ETA: ${service.cost[0].etd}`,
              value: service.cost[0].value,
            }))}
            onChange={(value) => handleSelectService(value)}
          />
        </div>
      )}
      </div>
      <div className="flex justify-between font-bold border-t-2 py-2 my-2">
        <p>Total Price </p>
        <p>
          {totalPrice?.toLocaleString('id-ID', {
            style: 'currency',
            currency: 'IDR',
          })}
        </p>
      </div>
      <Button className="w-full">
        Checkout
      </Button>
    </div>
  );
};

export default CartPrice;
