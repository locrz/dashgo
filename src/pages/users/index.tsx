import {
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  Icon,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useState } from "react";
import { RiAddLine, RiPencilLine } from "react-icons/ri";
import { Header } from "../../components/Header";
import { Pagination } from "../../components/Pagination";
import { Sidebar } from "../../components/Sidebar";
import { api } from "../../services/api";
import { queryClient } from "../../services/queryClient";
import { getUsers, User, useUsers } from "../../services/queryClient/useUsers";

interface UsersListProps {
  users: User[];
  totalCount: number;
}

export default function UsersList({ users, totalCount }: UsersListProps) {
  const [page, setPage] = useState(1);

  const { isLoading, isFetching, data, error } = useUsers(page, {
    initialData: { users, totalCount },
  });

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  async function handlePrefetch(id: string) {
    await queryClient.prefetchQuery(["user", id], async () => {
      const response = await api.get(`users/${id}`);
      return response.data;
    });
  }

  return (
    <Box>
      <Header />

      <Flex w="100%" my="6" maxWidth="1480" mx="auto" px={["4", "4", "6"]}>
        <Sidebar />

        <Box flex="1" borderRadius={8} bg="gray.800" p="8">
          <Flex mb="8" justify="space-between" align="center">
            <Heading size="lg" fontWeight="normal">
              Usuários
              {isFetching && !isLoading && (
                <Spinner size="sm" color="gray.400" ml="4" />
              )}
            </Heading>

            <Link href="/users/create" passHref>
              <Button
                as="a"
                size="sm"
                fontSize="sm"
                colorScheme="pink"
                leftIcon={<Icon as={RiAddLine} />}
              >
                Criar novo
              </Button>
            </Link>
          </Flex>

          {isLoading ? (
            <h1>Carregando</h1>
          ) : (
            <Table colorScheme="whiteAlpha">
              <Thead>
                <Tr>
                  <Th px={["4", "4", "6"]} color="gray.300" width="8">
                    <Checkbox colorScheme="pink" />
                  </Th>
                  <Th>Usuário</Th>
                  <Th>Data de cadastro</Th>
                  <Th width="8"></Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.users.map((user) => (
                  <Tr key={user.id}>
                    <Td px={["4", "4", "6"]}>
                      <Checkbox colorScheme="pink" />
                    </Td>
                    <Td>
                      <Box>
                        <ChakraLink
                          color="purple.400"
                          onMouseEnter={() => handlePrefetch(user.id)}
                        >
                          <Text fontWeight="bold">{user.name}</Text>
                        </ChakraLink>
                        <Text fontSize="sm" color="gray.300">
                          {user.email}
                        </Text>
                      </Box>
                    </Td>
                    {isWideVersion && <Td>{user.createdAt}</Td>}
                    {isWideVersion && (
                      <Td>
                        <Button
                          as="a"
                          size="sm"
                          fontSize="sm"
                          colorScheme="purple"
                          leftIcon={<Icon as={RiPencilLine} fontSize="16" />}
                        >
                          Editar
                        </Button>
                      </Td>
                    )}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}

          <Pagination
            totalCount={data.totalCount}
            onPageChange={setPage}
            currentPage={page}
          />
        </Box>
      </Flex>
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const { users } = await getUsers(1);

  return {
    props: {
      users,
      totalCount,
    },
  };
};
