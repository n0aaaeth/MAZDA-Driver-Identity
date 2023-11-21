import { Box, Spinner, Text } from '@chakra-ui/react';

export const Loading = ({ isLoading, message }: any) => {
  if (!isLoading) return null;

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bg="rgba(0, 0, 0, 0.5)" 
      zIndex="overlay"
    >
       <Box
        p="4"
        bg="white"
        borderRadius="md"
        boxShadow="lg"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="black"
          size="xl"
        />
        {message && <Text mt="4" textAlign="center">{message}</Text>}
      </Box>
    </Box>
  );
};
