import { Container, Flex, Text, Button, HStack, useColorMode } from "@chakra-ui/react";
import { Link } from "react-router-dom";

import { PlusSquareIcon } from "@chakra-ui/icons";
import { IoMoon } from "react-icons/io5";
import {LuSun} from "react-icons/lu";
import logo from "../../assets/fonts/whiteCar.png";
import { Image } from "@chakra-ui/react"


const Navbar = () => {
  const {colorMode, toggleColorMode} = useColorMode();
  const isLight = colorMode === "light";

  return (
    <Container
      maxW="100%"
      position="fixed"
      top={0}
      left={0}
      zIndex={1000}
      bg="black"
      h="64px"
    >
      <Flex
        h="64px"
        alignItems="center"
        
        flexDir={{ base: "column", sm: "row" }}
        position="sticky"
      >
        <Text
          fontFamily="Trans"
          fontWeight="bold"
          fontSize="2xl"
          letterSpacing="wider"
          color="white"
        >
          <Link to={"/"}>ParkSpace</Link>
        </Text>
        
        <Image src={logo} boxSize="45px" ml={0} color={isLight ? "White" : "Black"}/>


        <HStack spacing={2} alignItems="center" ml="auto" mr={0}>
          <Link to="/">
            <Button color="white" bg="black" _hover={{color:"cyan.600"}} _active={{bg: "black", transform: "scale(0.97)"}}>
              <Text fontFamily="Trans" fontWeight="light">Home</Text>
            </Button>
          </Link>
          <Link>
            <Button color="white" bg="black" _hover={{color:"cyan.600"}} _active={{bg: "black", transform: "scale(0.97)"}}>
              <Text fontFamily="Trans" fontWeight="light">Support</Text>
            </Button>
          </Link>
          <Button color="white" bg="black" _hover={{color:"cyan.600"}} _active={{bg: "black", transform: "scale(0.97)"}}>
            <Text fontFamily="Trans" fontWeight="light">Contact</Text>
          </Button>
          <Link to="/signup">
            <Button color="white" bg="black" _hover={{color:"cyan.600"}} _active={{bg: "black", transform: "scale(0.97)"}}>
              <Text fontFamily="Trans" fontWeight="light">Sign-up/Login</Text>
            </Button>
          </Link>
        </HStack>
      </Flex>
    </Container>
  );
};

export default Navbar;

