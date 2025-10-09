// DeliveryBoyTracking.jsx
import React, { useEffect, useRef, useState } from "react";
import scooter from "../assets/scooter.png";
import home from "../assets/home.png";
import "leaflet/dist/leaflet.css";
import Leaf from "leaflet";
import "leaflet-routing-machine";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

const deliveryBoyIcon = new Leaf.Icon({
  iconUrl: scooter,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});
const customerIcon = new Leaf.Icon({
  iconUrl: home,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

// NEW: routing helper that fetches route, draws polyline, then removes LRM UI
const Routing = ({ from, to }) => {
  const map = useMap();
  const routeLayerRef = useRef(null);

  useEffect(() => {
    if (!map || !from || !to) return;

    // cleanup previous line if any
    if (routeLayerRef.current) {
      try {
        map.removeLayer(routeLayerRef.current);
      } catch (e) {}
      routeLayerRef.current = null;
    }

    // create control to compute route (we'll remove it after route is found)
    let routingControl = Leaf.Routing.control({
      waypoints: [Leaf.latLng(from.lat, from.lon), Leaf.latLng(to.lat, to.lon)],
      lineOptions: { styles: [{ color: "#32CD32", weight: 5 }] },
      addWaypoints: false,
      createMarker: () => null, // we don't want LRM markers
      draggableWaypoints: false,
      routeWhileDragging: false,
      show: false, // may or may not be honored depending on version; we remove control anyway
    }).addTo(map);

    const onRoutes = (e) => {
      try {
        // LRM returns coordinates as objects with lat/lng
        const coords = e.routes[0].coordinates.map((c) => [c.lat, c.lng]);
        const routeLine = Leaf.polyline(coords, {
          color: "#32CD32",
          weight: 5,
          opacity: 0.95,
          smoothFactor: 1,
        }).addTo(map);

        routeLayerRef.current = routeLine;

        // optionally fit the map to route (comment if you don't want auto-fit)
        try {
          map.fitBounds(routeLine.getBounds(), { padding: [60, 60] });
        } catch (e) {}
      } catch (err) {
        console.error("Error drawing route:", err);
      } finally {
        // remove the routing control (this removes the UI and frees pointer events)
        if (routingControl) {
          try {
            map.removeControl(routingControl);
          } catch (e) {}
          routingControl = null;
        }
      }
    };

    routingControl.on("routesfound", onRoutes);

    // cleanup on unmount / dependency change
    return () => {
      if (routingControl) {
        try {
          map.removeControl(routingControl);
        } catch (e) {}
        routingControl = null;
      }
      if (routeLayerRef.current) {
        try {
          map.removeLayer(routeLayerRef.current);
        } catch (e) {}
        routeLayerRef.current = null;
      }
    };
  }, [map, from.lat, from.lon, to.lat, to.lon]);

  return null;
};

const DeliveryBoyTracking = ({ data }) => {
  const [riderLocation, setRiderLocation] = useState({
    lat: data.deliveryBoyLocation.lat,
    lon: data.deliveryBoyLocation.lon,
  });

  // if you update riderLocation externally (socket), update setRiderLocation(...)
  const customerLat = data.customerLocation.lat;
  const customerLon = data.customerLocation.lon;
  const center = [riderLocation.lat, riderLocation.lon];

  return (
    <div className="w-full h-[400px] mt-3 rounded-xl overflow-hidden shadow-md">
      <MapContainer className="w-full h-full" center={center} zoom={16}>
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker
          position={[riderLocation.lat, riderLocation.lon]}
          icon={deliveryBoyIcon}
        >
          <Popup>ChopNow Rider (Live)</Popup>
        </Marker>

        <Marker position={[customerLat, customerLon]} icon={customerIcon}>
          <Popup>Awaiting Customer</Popup>
        </Marker>

        {/* Draw route without leaving LRM UI */}
        <Routing
          from={{ lat: riderLocation.lat, lon: riderLocation.lon }}
          to={{ lat: customerLat, lon: customerLon }}
        />
      </MapContainer>
    </div>
  );
};

export default DeliveryBoyTracking;
