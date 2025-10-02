import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoLocationSharp, IoSearchOutline } from "react-icons/io5";
import { TbCurrentLocation } from "react-icons/tb";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { useSelector } from "react-redux";
import "leaflet/dist/leaflet.css";
import { setLocation } from "../redux/mapSlice";

function RecenterMap({location}){
  if (location.lat && location.lon) {
    const map = useMap()
    map.setView([location.lat, location.lon], 16, {animate: true})
  }
  return null
}

const CheckOut = () => {
  //Destructuring from map slice
  const { location, address } = useSelector((state) => state.map);

  const onDragEnd = (e) => {
    console.log(e.targer._latlng)
    const {lat, lng} = e.target._latlng
    dispatch(setLocation({lat, lon:lng}))
    const map = useMap()
    map.setView([lat, lng], 16, {animate: true})
  }

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
              value={address}
            />
            <button
              className="bg-[#32CD32] hover:bg-[#32CD32] text-white px-3 py-2 rounded-lg flex
            items-center justify-center cursor-pointer"
            >
              <IoSearchOutline size={17} />
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center
            justify-center cursor-pointer"
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
                  draggable eventHandlers={{ dragend: onDragEnd }}
                />
              </MapContainer>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CheckOut;
