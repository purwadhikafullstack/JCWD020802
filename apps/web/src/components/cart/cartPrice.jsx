import { useEffect, useState } from "react";
import { ChangeAddressButton } from "./changeAddressButton";
import { Button, Card, CardBody, Typography } from "@material-tailwind/react";
import { Axios } from "../../lib/api";
import { toast } from "react-toastify";
import Select from 'react-select';
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";

export function CartPrice({ price, quantity, weight }) {
  const token = localStorage.getItem('token');
  const user = useSelector((state) => state.user.value);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [warehouses, setWarehouses] = useState(null)
  const [selectedDestination, setSelectedDestination] = useState(null)
  const [selectedCourier, setSelectedCourier] = useState(null)
  const [services, setServices] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [totalPrice, setTotalPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const courierOptions = [
    { label: "JNE", value: "jne" },
    { label: "POS Indonesia", value: "pos" },
    { label: "TIKI", value: "tiki" },
  ];

  const getWarehouse = async () => {
    try {
      const result = await Axios.get("warehouses", { headers: { Authorization: `Bearer ${token}` } });
      setWarehouses(result.data);
    } catch (error) {
      toast.error("Failed getting warehouse data!");
    }
  };

  const getMainAddress = async () => {
    try {
      if (!selectedAddress) {
        const result = await Axios.get(`addresses/main/${user.id}`, { headers: { Authorization: `Bearer ${token}` } });
        setSelectedAddress(result.data);
      }
    } catch (error) {
      toast.error("Your account still doesn't have a shipping address!");
      toast.error("Please create a shipping address first!");
    }
  };

  useEffect(() => {
    getWarehouse(),
    getMainAddress()
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
      const distance = calculateDistance(originLat, originLon, destination?.latitude, destination?.longtitude);

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

  const handleSelectAddress = (address) => setSelectedAddress(address);

  const getServices = async () => {
    setLoading(true);
    const requestBody = {
      origin: selectedAddress.CityId,
      destination: selectedDestination.CityId,
      weight: weight,
      courier: selectedCourier.value
    };
    try {
      const response = await Axios.post("rajaongkir/cost", requestBody);
      setServices(response.data.rajaongkir.results[0]);
    } catch (error) {
      toast.error("Failed getting shipping cost!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getServices()
  }, [selectedCourier])

  const handleSelectService = (service) => setSelectedService(service);

  useEffect(() => {
    if (selectedService) {
      const newTotalPrice = price + selectedService.value;
      setTotalPrice(newTotalPrice);
    }
  }, [selectedService]);
  
  return (
    <div className="lg:w-80 lg:border-2 rounded-lg lg:p-5 h-full lg:shadow-md lg:sticky lg:top-[120px]">
      <Typography variant="h5" className="mb-2">Order Summary</Typography>
      <div className="flex flex-col gap-1">
        <div className="flex justify-between">
          <Typography variant="paragraph" className="font-bold">Items ({quantity})</Typography>
          <Typography variant="paragraph" className="font-normal">{price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</Typography>
        </div>
        <div className="flex justify-between">
          <Typography variant="paragraph" className="font-bold">Total Weight</Typography>
          <Typography variant="paragraph" className="font-normal">{ weight / 1000 } Kg</Typography>
        </div>
      </div>
      {selectedAddress && (
        <div className="flex flex-col mt-4">
          <Card className="w-full">
          <Typography variant="h6">Selected Address:</Typography>
            <CardBody>
              <Typography variant="h6">{selectedAddress.label}</Typography>
              <Typography variant="lead" className="text-base">{selectedAddress.City.Province.province}, {selectedAddress.City.city_name}</Typography>
            </CardBody>
          </Card>
        </div>
      )}
      <ChangeAddressButton onSelectAddress={handleSelectAddress} setSelectedCourier={setSelectedCourier} setServices={setServices} setSelectedService={setSelectedService} />
      <div className="flex flex-col mt-4">
        <Typography variant="h6">Select Courier:</Typography>
        <Select 
          placeholder="Courier..."
          options={courierOptions}
          value={selectedCourier}
          onChange={(value) => setSelectedCourier(value)}
          isClearable
        />
        {selectedCourier && (
          <div className="flex flex-col mt-4">
            <Typography variant="h6">Select Service:</Typography>
            {loading ? (
              <div className="flex justify-center items-center h-20">
                <ClipLoader color="#3B82F6" loading={loading} size={35} />
              </div> 
            ) : ( services && (
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
            ))}
          </div>
        )}
      </div>
      <div className="flex justify-between font-bold border-t-2 py-2 my-2">
        <Typography variant="paragraph" className="font-bold">Total Price </Typography>
        <Typography variant="paragraph" className="font-bold">{totalPrice?.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</Typography>
      </div>
      <Button className="w-full" color="green">Checkout</Button>
    </div>
  );
}