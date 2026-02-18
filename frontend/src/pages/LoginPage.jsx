import { useState } from "react";
import {
  Box,
  Input,
  Button,
  Heading,
  VStack,
  Divider,
  Text,
  HStack,
  Image
} from "@chakra-ui/react";

import { auth, googleProvider, appleProvider } from "../firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

import googleLogo from "../assets/fonts/googleLogo.webp";
import appleLogo from "../assets/fonts/appleLogo.png";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, pw);
      alert("Logged in!");
    } catch (err) {
      alert(err.message);
    }
  };

  const loginGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      alert("Logged in with Google!");
    } catch (err) {
      alert(err.message);
    }
  };

  const loginApple = async () => {
    try {
      await signInWithPopup(auth, appleProvider);
      alert("Logged in with Apple!");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      bg="black"
      minH="100vh"
    >
      <VStack
        p={8}
        bg="white"
        borderRadius="lg"
        spacing={4}
        width="350px"
      >
        <Heading color="black" size="lg" fontFamily="trans" fontWeight="bold">
          Login
        </Heading>

        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          bg="white"
          borderRadius="md"
        />

        <Input
          type="password"
          placeholder="Password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          bg="white"
          borderRadius="md"
        />

        <Button
          bgColor="cyan.700"
          width="100%"
          borderRadius="full"
          onClick={login}
          _hover={{ boxShadow:"dark-lg"}}
          fontFamily="trans"
          fontWeight="lightbold"
          textColor="white"
        >
          Login
        </Button>

        <Divider borderColor="gray.500" />

        <Button
          width="100%"
          bg="black"
          textColor="white"
          borderRadius="full"
          onClick={loginGoogle}
          leftIcon={<Image src={googleLogo} boxSize="17px" />}
          _hover={{ boxShadow:"dark-lg"}}
          fontFamily="trans"
          fontWeight="lightbold"
        >
          Continue with Google
        </Button>

        <Button
          width="100%"
          bg="black"
          textColor="white"
          borderRadius="full"
          onClick={loginApple}
          leftIcon={<Image src={appleLogo} boxSize="16px" />}
          _hover={{ boxShadow:"dark-lg" }}
          fontFamily="trans"
          fontWeight="lightbold"
        >
          Continue with Apple
        </Button>

        <HStack pt={3}>
          <Text color="black" fontSize="sm">Don't have an account?</Text>
          <Link to="/signup">
            <Text color="purple.800" fontSize="sm" _hover={{ textDecoration: "underline" }}>
              Sign up
            </Text>
          </Link>
        </HStack>
      </VStack>
    </Box>
  );
};

export default LoginPage;
