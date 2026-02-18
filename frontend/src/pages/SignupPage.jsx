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
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

import googleLogo from "../assets/fonts/googleLogo.webp";
import appleLogo from "../assets/fonts/appleLogo.png";
import { Link } from "react-router-dom";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  const createAccount = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, pw);
      alert("Account created!");
    } catch (err) {
      alert(err.message);
    }
  };

  const signupGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      alert("Signed up with Google!");
    } catch (err) {
      alert(err.message);
    }
  };

  const signupApple = async () => {
    try {
      await signInWithPopup(auth, appleProvider);
      alert("Signed up with Apple!");
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
        <Heading color="black" size="lg" fontFamily="trans">
          Create Account
        </Heading>

        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          bg="white"
          borderRadius="md"
          _placeholder={{ color: "gray.600" }}
        />

        <Button
          width="100%"
          bgColor="cyan.700"
          borderRadius="full"
          onClick={createAccount}
          _hover={{ boxShadow:"dark-lg"}}
          fontFamily="trans"
          fontWeight="lightbold"
          textColor="white"
        >
          Sign Up
        </Button>

        <Divider borderColor="gray.500" />

        <Button
          width="100%"
          bg="black"
          textColor="white"
          borderRadius="full"
          onClick={signupGoogle}
          leftIcon={<Image src={googleLogo} boxSize="20px" />}
          _hover={{ boxShadow:"dark-lg"}}
          fontFamily="trans"
          fontWeight="lightbold"
        >
          Sign up with Google
        </Button>

        <Button
          width="100%"
          bg="black"
          textColor="white"
          borderRadius="full"
          onClick={signupApple}
          leftIcon={<Image src={appleLogo} boxSize="20px" />}
          _hover={{ boxShadow:"dark-lg"}}
          fontFamily="trans"
          fontWeight="lightbold"
        >
          Sign up with Apple
        </Button>

        <HStack pt={3}>
          <Text color="black" fontSize="sm">Already have an account?</Text>
          <Link to="/login">
            <Text color="purple.800" fontSize="sm" _hover={{ textDecoration: "underline" }}>
              Log in
            </Text>
          </Link>
        </HStack>
      </VStack>
    </Box>
  );
};

export default SignupPage;




