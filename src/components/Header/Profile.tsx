import { Box, Flex, Text, Avatar } from "@chakra-ui/react";

export function Profile() {
  return (
    <Flex align="center">
      <Box mr="4" textAlign="right">
        <Text>Lucas</Text>
        <Text color="gray.300" fontSize="small">
          Email
        </Text>
      </Box>

      <Avatar size="md" name="Lucas" src="https://github.com/locrz.png" />
    </Flex>
  );
}
