import React, { use, useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoLocationSharp, IoSearchOutline } from "react-icons/io5";
import { TbCurrentLocation } from "react-icons/tb";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { useDispatch, useSelector } from "react-redux";
import "leaflet/dist/leaflet.css";
import { setAddress, setLocation } from "../redux/mapSlice";
import axios from "axios";
import { MdDeliveryDining } from "react-icons/md";
import { FaCreditCard } from "react-icons/fa";
import { FaMobileScreenButton } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";

function RecenterMap({ location }) {
  if (location.lat && location.lon) {
    const map = useMap();
    map.setView([location.lat, location.lon], 16, { animate: true });
  }
  return null;
}

const CheckOut = () => {
  //Fetching apikey from env
  const apikey = import.meta.env.VITE_GEOAPIKEY;

  //Destructuring from map slice
  const { location, address } = useSelector((state) => state.map);
  //Destructuring from user slice
  const { cartItems, totalAmount } = useSelector((state) => state.user);

  //USESTATE VARIABLE
  const [addressInput, setAddressInput] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");

  //USEDISPATCH
  const dispatch = useDispatch();

  //NAVIGATOR
  const navigate = useNavigate();

  //Delivery Fee Variable
  const deliveryFee = totalAmount > 5000 ? 0 : 3000;
  const amountWithDeliveryFee = totalAmount + deliveryFee;

  const onDragEnd = (e) => {
    const { lat, lng } = e.target._latlng;
    dispatch(setLocation({ lat, lon: lng }));
    getAddressByLatLng(lat, lng);
  };

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      dispatch(setLocation({ lat: latitude, lon: longitude }));

      getAddressByLatLng(latitude, longitude);
    });
  };

  const getAddressByLatLng = async (lat, lng) => {
    try {
      //Fetching data from geoafify docs
      const result = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${apikey}`
      );
      dispatch(setAddress(result?.data?.results[0].address_line2));
    } catch (error) {
      console.log(error);
    }
  };

  const getLatLngByAddress = async () => {
    try {
      const result = await axios.get(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
          addressInput
        )}&apiKey=${apikey}`
      );
      const { lat, lon } = result.data.features[0].properties;
      dispatch(setLocation({ lat, lon }));
    } catch (error) {
      console.log(error);
    }
  };

  //This will handle customer orders
  const placeOrderHandler = async () => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/order/place-order`,
        {
          paymentMethod,
          deliveryAddress: {
            text: addressInput,
            latitude: location.lat,
            longitude: location.lon,
          },
          totalAmount,
          cartItems,
        },
        { withCredentials: true }
      );
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setAddressInput(address);
  }, [address]);

  return (
    <div className="min-h-screen bg-[#fff9f6] flex items-center justify-center p-6">
      <div className="absolute top-[20px] left-[20px] z-[10] ">
        <IoIosArrowRoundBack
          size={35}
          className="text-[#32CD32] cursor-pointer"
          onClick={() => navigate("/")}
        />
      </div>
      <div className="w-full max-w-[900px] bg-white rounded-2xl shadow-xl p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">CheckOut</h1>

        {/* LIVE MAP SECTION */}
        <section>
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <IoLocationSharp className="text-[#32CD32]" /> Delivery Location
          </h2>

          <div className="flex gap-2 mb-2">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded-lg p-2 tex-sm focus:outline-none focus:ring-2
                focus:ring-[#32CD32] w-full"
              placeholder="Enter Your Delivery Address..."
              onChange={(e) => setAddressInput(e.target.value)}
              value={addressInput}
            />
            <button
              className="bg-[#32CD32] hover:bg-[#32CD32] text-white px-3 py-2 rounded-lg flex
            items-center justify-center cursor-pointer"
              onClick={getLatLngByAddress}
            >
              <IoSearchOutline size={17} />
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center
            justify-center cursor-pointer"
              onClick={getCurrentLocation}
            >
              <TbCurrentLocation size={17} />
            </button>
          </div>

          <div className="rounded-xl border border-gray-400 overflow-hidden">
            <div className="h-94 w-full flex items-center justify-center">
              <MapContainer
                className={`w-full h-full `}
                center={[location?.lat, location?.lon]}
                zoom={16}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <RecenterMap location={location} />
                <Marker
                  position={[location?.lat, location?.lon]}
                  draggable
                  eventHandlers={{ dragend: onDragEnd }}
                />
              </MapContainer>
            </div>
          </div>
        </section>

        {/* PAYMENT METHOD SECTION */}
        <section>
          <h2 className="text-lg font-semibold mb-3 text-gray-800">
            Payment Method
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* CASH ON DELIVERY */}
            <div
              className={`flex items-center cursor-pointer gap-3 rounded-xl border p-4 text-left transition
            ${
              paymentMethod === "cod"
                ? "border-[#32CD32] bg-green-50 shadow"
                : "border-gray-200 hover:border-gray-300"
            }`}
              onClick={() => setPaymentMethod("cod")}
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <MdDeliveryDining className="text-xl text-green-600" />
              </span>
              <div>
                <p className="text-gray-800 font-medium">Cash On Delivery</p>
                <p className="text-gray-500 text-xs">
                  Pay When Your Food Arrives
                </p>
              </div>
            </div>

            {/* ONLINE PAYMENT */}
            <div
              className={`flex items-center cursor-pointer gap-3 rounded-xl border p-4 text-left transition
            ${
              paymentMethod === "online"
                ? "border-[#32CD32] bg-green-50 shadow"
                : "border-gray-200 hover:border-gray-300"
            }`}
              onClick={() => setPaymentMethod("online")}
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                <FaMobileScreenButton className="text-purple-700 text-lg" />
              </span>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <FaCreditCard className="text-blue-700 text-lg" />
              </span>
              <div>
                <p className="font-medium text-gray-800">
                  UPI / Credit / Debit Card
                </p>
                <p className="text-xs text-gray-500">Pay Securely Online</p>
              </div>
            </div>
          </div>
        </section>

        {/* TOTAL PRICE CHECKOUT SECTION */}
        <section>
          <h2 className="text-lg font-semibold mb-3 text-gray-800">
            Order Summary
          </h2>
          <div className="rounded-xl border border-gray-300 bg-gray-50 p-4 space-y-2 ">
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="flex justify-between text-sm text-gray-700"
              >
                <span>
                  {item.name} X {item.quantity}
                </span>
                <span>₦ {item.price * item.quantity}</span>
              </div>
            ))}
            <hr className="border-gray-300 my-2" />
            <div className="flex justify-between font-medium text-gray-800">
              <span>SubTotal</span>
              <span>₦ {totalAmount}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Delivery Fee</span>
              <span>₦ {deliveryFee === 0 ? "free" : deliveryFee}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-[#32CD32] pt-2">
              <span>Total Amount</span>
              <span>₦ {amountWithDeliveryFee}</span>
            </div>
          </div>
        </section>
        <button
          onClick={placeOrderHandler}
          className="w-full bg-[#32CD32] hover:bg-[#2ab12a] text-white py-3 rounded-xl font-semibold
        cursor-pointer"
        >
          {paymentMethod === "cod" ? "Place Order" : "Pay and Place Order"}
        </button>
      </div>
    </div>
  );
};

export default CheckOut;
