// src/components/Map/SearchBar.jsx
import { useState, useRef } from "react";
import {
  Box,
  InputGroup,
  Input,
  InputRightElement,
  IconButton,
  useColorMode,
  useOutsideClick
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

// Debounce helper
const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

const SearchBar = ({ mapRef, markerRef, onLocationSelect }) => {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const { colorMode } = useColorMode();
  const isLight = colorMode === "light";
  const wrapperRef = useRef();

  useOutsideClick({
    ref: wrapperRef,
    handler: () => setSuggestions([]),
  })

  // Fetch autocomplete suggestions
  const fetchSuggestions = async (query) => {
    if (!query) return setSuggestions([]);
    try {
      const res = await fetch(
        `https://api.maptiler.com/geocoding/${encodeURIComponent(
          query
        )}.json?key=3qmP77FuAdzQmcKW3tzU&limit=5`
      );
      const data = await res.json();
      if (data.features) setSuggestions(data.features);
    } catch (err) {
      console.error(err);
    }
  };

  const debouncedFetch = debounce(fetchSuggestions, 300);

  const handleSearch = async (location) => {
    setSuggestions([]);
    setSearch(location.place_name || location);

    const [lng, lat] = location.geometry?.coordinates || [null, null];
    if (lng && lat && mapRef.current && markerRef.current) {
      markerRef.current.setLngLat([lng, lat]);
      mapRef.current.flyTo({ center: [lng, lat], zoom: 13 });
    }

    if (lng && lat && mapRef.current && markerRef.current) {
      markerRef.current.setLngLat([lng, lat]);
      mapRef.current.flyTo({ center: [lng, lat], zoom: 13 });

      // 🧭 Notify HomePage that the user moved to a new location
      if (onLocationSelect) onLocationSelect({ lat, lng });
    }
  };

  return (
    <Box ref={wrapperRef} height="40px" width="40%">
      <InputGroup
        bg="white"
        boxShadow="dark-lg"
        height="100%"
        borderRadius="full"
        overflow="hidden"
      >
        <Input
          placeholder="Search Parking..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            debouncedFetch(e.target.value);
          }}
          border="none"
          _placeholder={{ color: isLight ? "black" : "white"}}
          _focus={{ boxShadow: "none" }}
          onKeyDown={(e) => e.key === "Enter" && handleSearch({ place_name: search })}
        />
        <InputRightElement>
          <IconButton
            aria-label="Search"
            icon={<SearchIcon />}
            bg="transparent"
            _hover={{ bg: "transparent" }}
            onClick={() => handleSearch({ place_name: search })}
          />
        </InputRightElement>
      </InputGroup>

      {/* Suggestions dropdown */}
      {suggestions.length > 0 && (
        <Box
          position="absolute"
          width="40%"
          bg="white"
          boxShadow="2xl"
          zIndex="20"
          borderRadius="2xl"
          mt="5px"
        >
          {suggestions.map((s, i) => (
            <Box
              key={i}
              p={2}
              cursor="pointer"
              _hover={{ bg:"gray.400"}}

              // 🎯 Preserve rounded corners
              borderTopRadius={i === 0 ? "2xl" : "0"}                      
              borderBottomRadius={i === suggestions.length - 1 ? "2xl" : "0"}
              onClick={() => handleSearch(s)}
            >
              {s.place_name}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default SearchBar;
