import { Box, Flex, Text} from "@chakra-ui/react";
import { useRef, useState, useEffect } from "react";
import MapComponent from "../components/Map/MapComponent";
import SearchBar from "../components/Map/MapSearchBar";

const HomePage = () => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [location, setLocation] = useState({ lat: 40.7128, lng: -74.006 });

  function handleLocationSelect({ lat, lng }) {
    // 1) update app state -> drives filtering & overlay re-render
    setLocation({ lat, lng });

    // 2) move the red pin so the visual matches the state
    if (markerRef.current) markerRef.current.setLngLat([lng, lat]);

    // 3) glide map
    if (mapRef.current) mapRef.current.flyTo({
      center: [lng, lat],
      zoom: 13,
      speed: 0.6,      // lower is slower
      curve: 1.5,      // smooth motion
      easing: (t) => t // linear easing
    });
  }


  // Get user location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => console.error(err)
    );
  }, []);

  return (
    <Box position="relative" height="100vh">

      {/* --- SEARCH BAR FLOATING OVER MAP --- */}
      <Box
        position="absolute"
        top="80px"                     // BELOW NAVBAR
        width="100%"
        zIndex="1000"                  // ABOVE EVERYTHING
        display="flex"
        justifyContent="center"
        pt={4}
      >
        <SearchBar
          mapRef={mapRef}
          markerRef={markerRef}
          onLocationSelect={handleLocationSelect}
        />
      </Box>

      {/* --- MAP --- */}
      <Box
        position="absolute"
        top="64px"                     // NAVBAR HEIGHT
        bottom="0"
        left="0"
        right="0"
        zIndex="1"                     // BELOW SEARCH
        p={4}
      >
        <MapComponent
          location={location}
          mapRef={mapRef}
          markerRef={markerRef}
        />
      </Box>

    </Box>
  );

};

export default HomePage;
