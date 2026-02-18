import { useEffect, useRef, useState } from "react";
import { Box, Text, VStack, Badge } from "@chakra-ui/react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const createPriceMarker = (price) => {
  // Outer container — controls anchoring & stacking
  const container = document.createElement("div");
  container.style.position = "relative";
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.alignItems = "center";
  container.style.transform = "translateY(-6px)"; // lifts circle so pointer aligns perfectly

  // ---- CIRCLE ----
  const bubble = document.createElement("div");
  bubble.style.width = "44px";
  bubble.style.height = "44px";
  bubble.style.borderRadius = "50%";
  bubble.style.background = "white";
  bubble.style.border = "4px solid #0E7490"; // border color
  bubble.style.color = "#0E7490";            // text color
  bubble.style.fontWeight = "700";
  bubble.style.fontSize = "16px";
  bubble.style.display = "flex";
  bubble.style.alignItems = "center";
  bubble.style.justifyContent = "center";
  bubble.style.boxShadow = "0 2px 6px rgba(0,0,0,0.25)";
  bubble.innerText = `$${price}`;

  // ---- POINTER ----
  const pointer = document.createElement("div");
  pointer.style.width = "0";
  pointer.style.height = "0";
  pointer.style.borderLeft = "7px solid transparent";
  pointer.style.borderRight = "7px solid transparent";
  pointer.style.borderTop = "10px solid #0E7490"; // same color as border
  pointer.style.marginTop = "-2px"; // overlaps naturally but visually perfect
  pointer.style.zIndex = "0";

  // assemble final marker
  container.appendChild(bubble);
  container.appendChild(pointer);

  return container;
};


const MapComponent = ({ location, mapRef, markerRef }) => {
  const mapContainer = useRef(null);
  const [listings, setListings] = useState([]);
  const purpleMarkersRef = useRef([]);

  //Distance in between
  function getDistanceMiles(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;

    const distanceKm = R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
    const distanceMiles = distanceKm * 0.621371; // Convert to miles
    return distanceMiles;
  }


  // ✅ Fetch listings
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/listings");
        const data = await res.json();

        if (data.success && Array.isArray(data.data)) {
          console.log("Fetched listings:", data.data);
          setListings(data.data);
        } else {
          console.warn("Unexpected API format:", data);
        }
      } catch (err) {
        console.error("Error fetching listings:", err);
      }
    };
    fetchListings();
  }, []);

  // ✅ Initialize map only once
  useEffect(() => {
    if (mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      center: [location.lng, location.lat],
      zoom: 13,
      style: "https://api.maptiler.com/maps/topo-v2/style.json?key=3qmP77FuAdzQmcKW3tzU",
    });

    map.addControl(new maplibregl.NavigationControl(), "bottom-right");

    // 📍 Red user marker (emoji pin)
    const el = document.createElement("div");
    el.textContent = "📍";
    el.style.fontSize = "32px";
    const userMarker = new maplibregl.Marker({ element: el })
      .setLngLat([location.lng, location.lat])
      .addTo(map);

    mapRef.current = map;
    markerRef.current = userMarker;

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, [mapRef, markerRef]);

  useEffect(() => {
    if (mapRef.current && markerRef.current && location) {
      markerRef.current.setLngLat([location.lng, location.lat]);
      mapRef.current.flyTo({ center: [location.lng, location.lat], zoom: 13 });
    }
  }, [location]);

  // ✅ Purple markers for listings
  useEffect(() => {
    if (!mapRef.current || listings.length === 0) return;

    // 1) clear old purple markers
    purpleMarkersRef.current.forEach((m) => m.remove());
    purpleMarkersRef.current = [];

    // 2) filter by distance (in miles) from *location* state
    const R = 6371;
    const toMiles = (km) => km * 0.621371;
    const getMiles = (lat1, lng1, lat2, lng2) => {
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lng2 - lng1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) ** 2;
      return toMiles(R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))));
    };

    const nearby = [];
    const RADIUS_MI = 5; // adjust radius

    listings.forEach((listing) => {
      const coords = listing.location?.coordinates; // [lng, lat]
      if (!coords || coords.length !== 2) return;

      const [lng, lat] = coords;
      const dist = getMiles(location.lat, location.lng, lat, lng);

      if (dist <= RADIUS_MI) {
        nearby.push({ ...listing, dist });

        // add purple marker
        const price = listing.price || 12; // fallback if no price yet

        const marker = new maplibregl.Marker({
          element: createPriceMarker(price),
          anchor: "bottom"
        })
          .setLngLat([lng, lat])
          .setPopup(
            new maplibregl.Popup().setHTML(`
              <strong>${listing.title || "Parking Spot"}</strong><br/>
              ${listing.address || ""}<br/>
              <small>${dist.toFixed(2)} miles away</small>
            `)
          )
          .addTo(mapRef.current);

          marker.getElement().style.cursor = "pointer";

          marker.getElement().addEventListener("click", () => {
            mapRef.current.flyTo({
              center: [lng, lat],
              zoom: 16,
              speed: 1.4,
              curve: 1.5,
            });

            marker.togglePopup();
          });
        
        purpleMarkersRef.current.push(marker);
      }
    });

    // update your overlay list
    // (if you render directly from `listings.map`, instead compute dist inline there using `location`)
    // If you prefer a state for nearby, keep it:
    // setNearby(nearby);

  }, [listings, location]);

  return (
    <Box position="relative" width="100%" height="100%">
      {/* Map */}
      <div
        ref={mapContainer}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "1rem",
          overflow: "hidden",
        }}
      />

      {/* ✅ Small overlay panel (non-breaking) */}
      <Box
        position="absolute"
        top="20px"
        left="20px"
        bg="black"
        borderRadius="lg"
        boxShadow="xl"
        p={3}
        maxH="70vh"
        overflowY="auto"
        width="280px"
        zIndex="10"
      >
        <Text fontWeight="bold" fontSize="lg" mb={2} color="white">
          Nearby Parking Spaces
        </Text>

        <VStack align="stretch" spacing={2} bg="black">
          {listings.filter(listing => {
            const coords = listing.location?.coordinates;
            if (!coords) return false;
            const [lng, lat] = coords;
            const miles = getDistanceMiles(location.lat, location.lng, lat, lng);
            return miles <= 1;
          }).length > 0 ? (
            listings.map((listing) => {
              const coords = listing.location?.coordinates;
              if (!coords) return null;
              const [lng, lat] = coords;

              const miles = getDistanceMiles(location.lat, location.lng, lat, lng);
              if (miles > 5) return null;

              return (
                <Box
                  key={listing._id}
                  p={2}
                  borderRadius="md"
                  _hover={{ bg: "gray.700", cursor: "pointer" }}
                  onClick={() =>
                    mapRef.current?.flyTo({ center: [lng, lat], zoom: 15 })
                  }
                >
                  <Text fontWeight="semibold" color="white">
                    {listing.title}
                  </Text>
                  <Text fontSize="sm" color="white">
                    {listing.address}
                  </Text>
                  <Text fontSize="xs" color="gray.400">
                    {miles.toFixed(2)} miles away
                  </Text>
                  <Badge colorScheme="purple" mt={1}>
                    View
                  </Badge>
                </Box>
              );
            })
          ) : (
            <Box
              p={3}
              textAlign="center"
            >
              <Text color="gray.400" fontStyle="italic">
                No nearby parking spaces available.
              </Text>
            </Box>
          )}
        </VStack>
      </Box>
    </Box>
  );
};

export default MapComponent;








