import { useEffect, useRef, useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { Input, Typography } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { setPosition } from "../../redux/positionSlice";
import { toast } from 'react-toastify';

export function PinLocation({ isMobile }) {
    const [searchLocation, setSearchLocation] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(true);
    const position = useSelector((state) => state.position.value);
    const dispatch = useDispatch();
    const mapRef = useRef(null)

    const findLocation = async () => {
        try {
            const response = await axios.get(
                `https://api.opencagedata.com/geocode/v1/json?q=${searchLocation}&countrycode=id&key=00e4f62e57e6487ea3db9807a275d3fe`
            );

            const result = response.data.results[0];
            if (result) {
                const { lat, lng } = result.geometry;
                dispatch(setPosition([lat, lng]))

                if (mapRef.current) {
                    mapRef.current.setView([lat, lng], 13);
                }
                setShowSuggestions(false);
            } else {
                toast,error("Location not found");
            }
        } catch (error) {
            toast.error("Error searching location");
        }
    };

    const fetchSuggestions = async () => {
        try {
            const response = await axios.get(
                `https://api.opencagedata.com/geocode/v1/json?q=${searchLocation}&countrycode=id&key=00e4f62e57e6487ea3db9807a275d3fe`
            );

            const results = response.data.results;
            if (results) {
                const newSuggestions = results.map((result) => ({
                    label: result.formatted,
                    lat: result.geometry.lat,
                    lng: result.geometry.lng,
                }));
                setSuggestions(newSuggestions);
            } else {
                setSuggestions([]);
            }
        } catch (error) {
            toast.error("Error fetching suggestions");
        }
    };

    const selectSuggestion = (selectedSuggestion) => {
        dispatch(setPosition([selectedSuggestion.lat, selectedSuggestion.lng]));
        setSearchLocation(selectedSuggestion.label);
        
        if (mapRef.current) {
            mapRef.current.setView([selectedSuggestion.lat, selectedSuggestion.lng], 13);
        }
        
        setSuggestions([]);
        setShowSuggestions(false);
    };

    const ClickHandler = () => {
        useMapEvents({
            click: (e) => { dispatch(setPosition([e.latlng.lat, e.latlng.lng])) },
        });
        return null;
    };

    useEffect(() => {
        if (searchLocation.trim() !== "") {
            fetchSuggestions(searchLocation);
        } else {
            setSuggestions([]);
        }
    }, [searchLocation])
    
    return (
        <>
            <div className="flex flex-col">
                <Typography variant="h5" color="blue-gray" className="mb-3 flex justify-center text-center">
                    Find & determine your delivery location pinpoint
                </Typography>
                <div className="flex gap-2 mb-5">
                    <Input
                        type="search"
                        placeholder="Search location"
                        className="!border !border-brown-300"
                        labelProps={{ className: "hidden"}}
                        value={searchLocation}
                        onChange={(e) => {
                            setSearchLocation(e.target.value);
                            setShowSuggestions(true);
                        }}
                        icon={ <FaSearch fontSize={"20px"} color="brown" onClick={findLocation} /> }
                    />
                </div>
                {showSuggestions && (
                    <ul>
                        {suggestions.map((suggestion, index) => (
                            <li key={index} onClick={() => selectSuggestion(suggestion)}>
                                {suggestion.label}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <MapContainer center={position} zoom={13} ref={mapRef} style={{ height: isMobile ? "250px" : "450px" }}>
                <TileLayer 
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position} />
                <ClickHandler />
            </MapContainer>
        </>
    )
}