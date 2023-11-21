import { useEffect, useState } from "react";
import { Message } from "../../types/taskStatus";
import { LocalStorage } from "../../session/storage/local-storage";
import { StorageKeys } from "../../session/storage/storage-keys";
import { TempKey } from "../../session/TempKey";
import {
  Box,
  Button,
  Center,
  Flex,
  Link,
  Switch,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { userStateAtom } from "../../store/useState";
import { useRecoilValue } from "recoil";
import { myCarAbi } from "../../abi/myCarAbi";
import { useNavigate } from "react-router-dom";
import { mintMyCarNFT } from "../../services/mintMyCar";
import { fetchGelatoRelayStatus } from "../../services/fetchGelatoRelayStatus";
import { createContractInstance } from "../../util/createContractInstance";
import { createTBA } from "../../services/createTBA";
import { getTBA } from "../../services/getTBA";
import { Loading } from "../Loading/Loading";
import { mintColorNFT } from "../../services/mintColor";
import { setAsset } from "../../services/setAsset";
import { isAssetSet } from "../../services/getIsAsset";
import { config } from "../../config/config";
import { createSessionKeys } from "../../services/createSessionKeys";
import { signLessTx } from "../../services/signLessTx";
import { getSessionKey } from "../../services/getSessionKey";

const MyPage = () => {
  const userState = useRecoilValue(userStateAtom);
  const [tba, setTba] = useState("");
  const [tokenMintedId, setTokenMintedId] = useState(0);
  const navigate = useNavigate();

  const [isSessionActive, setIsSessionActive] = useState(false);
  const toast = useToast();

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<Message>({
    header: "Loading",
    body: undefined,
    taskId: undefined,
  });

  const handleDriverMode = () => {
    setIsSessionActive(true);
  };

  const handleNoDriverMode = () => {
    setIsSessionActive(false);
  };

  const handleLogout = async () => {
    setLoading(true);
    await userState.web3auth?.logout();
    setLoading(false);
    navigate("/");
  };

  const onMintAction = async (action: number) => {
    switch (action) {
      case 0:
        handleMintMyCarNFT();
        break;

      default:
        setLoading(false);
        break;
    }
  };

  const handleMintMyCarNFT = async () => {
    setLoading(true);
    setMessage({
      header: "MyCarのMint中...",
      body: undefined,
      taskId: undefined,
    });

    const response = await mintMyCarNFT({
      userState: userState
    });

    const listenForTokenMinted = async () => {
      try {
        const myCarContract = await createContractInstance(
          config.myCarAddress,
          myCarAbi,
          userState.provider!
        );
        myCarContract.once(
          myCarContract.filters.TokenMinted(),
          (to, tokenId ) => {
            console.log(
              `Token with ID ${tokenId.toString()} was minted to address ${to}`
            );
            const tokenIdNumber = tokenId.toString();
            console.log(tokenIdNumber);
            setTokenMintedId(tokenIdNumber);
            toast({
              title: "Task succeeded",
              description: `Minted Token ID :${tokenIdNumber}`,
              status: "success",
              duration: 5000,
              isClosable: true,
            });
          }
        );
      } catch (error) {
        console.error(
          "Failed to set up listener for TokenMinted event:",
          error
        );
      }
    };

    fetchGelatoRelayStatus(response)
      .then(async (status) => {
        console.log("Task succeeded:", status);
        listenForTokenMinted();
      })
      .catch((error) => {
        console.error("Task failed:", error);
        toast({
          title: "Task failed",
          description: `${error}`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
    setLoading(false);
  };

  const handleCreateTBA = async () => {
    setLoading(true);
    setMessage({
      header: "TBAの生成中...",
      body: undefined,
      taskId: undefined,
    });
    const response = await createTBA({
      userState: userState,
      userHoldTokenId: Number(tokenMintedId),
    });

    setMessage({
      header: "TBAの確認中...",
      body: undefined,
      taskId: undefined,
    });

    fetchGelatoRelayStatus(response)
      .then(async (status) => {
        console.log("Task succeeded:", status);
        const tba = await getTBA({
          userState: userState,
          userHoldTokenId: Number(tokenMintedId),
        });
        setTba(tba);
        toast({
          title: "Task succeeded",
          description: `${tba}`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      })
      .catch((error) => {
        console.error("Task failed:", error);
        toast({
          title: "Task failed",
          description: `${error}`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
    setLoading(false);
  };

  const handleMintColorNFT = async () => {
    setLoading(true);
    setMessage({
      header: "TBAにColorNFTのミント中...",
      body: undefined,
      taskId: undefined,
    });

    const response = await mintColorNFT({
      userState: userState,
      to: tba,
      tokenId: 1,
      amount: 1,
    });

    fetchGelatoRelayStatus(response)
      .then(async (status) => {
        console.log("Task succeeded:", status);
        toast({
          title: "Task succeeded",
          description: `Minted Token ID : 1`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      })
      .catch((error) => {
        console.error("Task failed:", error);
        toast({
          title: "Task failed",
          description: `${error}`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
    setLoading(false);
  };

  const handleSetAssetNFT = async () => {
    setLoading(true);
    setMessage({
      header: "TBAにColorNFTを装着中...",
      body: undefined,
      taskId: undefined,
    });

    const response = await setAsset({
      userState: userState,
      tba: tba,
      tokenId: 1,
      state: true,
    });

    fetchGelatoRelayStatus(response)
      .then(async (status) => {
        console.log("Task succeeded:", status);
        toast({
          title: "Task succeeded",
          description: `${status}`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      })
      .catch((error) => {
        console.error("Task failed:", error);
        toast({
          title: "Task failed",
          description: `${error}`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
    setLoading(false);
  };

  const handleIsAsset = async () => {
    const status = await isAssetSet({
      userState: userState,
      tba: tba,
      contractAddress: config.colorAddress,
      tokenId: 1,
    });

    toast({
      title: "Info",
      description: `${config.colorAddress} を${
        status ? "装着中です" : "装着してません"
      }`,
      status: "info",
      duration: 5000,
      isClosable: true,
    });
  };

  const handleMintMyCarNFTSignLess = async () => {
    try {
      setLoading(true);
      setMessage({
        header: "セッションキーを活用してMint中...",
        body: undefined,
        taskId: undefined,
      });

      const response = await signLessTx({
        userState: userState,
        targetContract: config.myCarAddress,
        abi: myCarAbi,
      });

      if (!response) {
        throw new Error("No response from the signLessTx function");
      }

      fetchGelatoRelayStatus(response)
        .then(async (status) => {
          console.log("Task succeeded:", status);
          toast({
            title: "Task succeeded",
            description: `${status}`,
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        })
        .catch((error) => {
          console.error("Task failed:", error);
          toast({
            title: "Task failed",
            description: `${error}`,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        });
    } catch (error: any) {
      console.error("An error occurred:", error);
      setMessage({
        header: "エラーが発生しました",
        body: error.message,
        taskId: undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartSignLess = async () => {
    const localStorage = new LocalStorage();
    let _sessionId = localStorage.get(StorageKeys.SESSION_ID);
    let _sessionKey = localStorage.get(StorageKeys.SESSION_KEY);
    console.log(_sessionId, _sessionKey);

    if (_sessionId == null || _sessionKey == null) {
      setLoading(true);
      setMessage({
        header: "セッションキーを作成中...",
        body: undefined,
        taskId: undefined,
      });
      const response = await createSessionKeys({
        userState: userState,
        contractAddress: config.myCarAddress,
      });
      fetchGelatoRelayStatus(response)
        .then(async (status) => {
          console.log("Task succeeded:", status);
          toast({
            title: "Task succeeded",
            description: `${status}`,
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        })
        .catch((error) => {
          console.error("Task failed:", error);
          toast({
            title: "Task failed",
            description: `${error}`,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        });
      setLoading(false);
    } else {
      const session = await getSessionKey({
        userState,
      });
      const tempKey = new TempKey(_sessionKey);
      const tempAddress = tempKey.address;
      console.log("session :", session);

      const timestamp = Math.floor(Date.now() / 1000);

      if (
        tempAddress !== session.tempPublicKey ||
        timestamp > +session.end.toString() ||
        userState.safe !== session.user
      ) {
        console.log("SESSION KEYS");
        setTimeout(() => {
          createSessionKeys({
            userState: userState,
            contractAddress: config.myCarAddress,
          });
        }, 1000);
      } else {
        setLoading(false);
      }
    }
  };

  const handleGetSessionKeys = () => {
    getSessionKey({
      userState: userState,
    });
  };

  useEffect(() => {
    if (isSessionActive) {
      handleStartSignLess()
        .then(() => {
          toast({
            title: "Success",
            description: "ドライバーモードが設定されました",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        })
        .catch((error) => {
          toast({
            title: "Error",
            description: "ドライバーモードの開始に失敗しました",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
          setIsSessionActive(false);
        });
    }
  }, [isSessionActive, toast]);
  

  return (
    <Center minH="100vh" p={4}>
      <Loading isLoading={loading} message={message.header} />
      <VStack spacing={6} align="stretch" w="full" maxW="lg">
        <Flex
          as="header"
          alignItems="center"
          justifyContent="space-between"
          p={4}
          bg="#111"
          color="white"
          shadow="md"
          borderWidth="1px"
        >
          <Text fontSize="lg" fontWeight="bold">
            マイページ
          </Text>
          <Button onClick={handleLogout}>ログアウト</Button>
        </Flex>
        <Box p={5} shadow="md" borderWidth="1px">
          <Text fontWeight="semibold">EOAアドレス:</Text>
          <Link
            href={`https://zkatana.blockscout.com/address/${userState.signerAddress}`}
            isExternal
            color="blue.500"
            fontWeight="bold"
          >
            {userState.signerAddress?.substring(0, 6) +
              "..." +
              userState.signerAddress?.substring(
                userState.signerAddress?.length - 6
              )}
          </Link>
        </Box>

        {userState.safe ? (
          <Box p={5} shadow="md" borderWidth="1px">
            <Text fontWeight="semibold">Safeアドレス</Text>
            <Link
              href={`https://zkatana.blockscout.com/address/${userState.safe}`}
              isExternal
              color="blue.500"
              fontWeight="bold"
            >
              {userState.safe.substring(0, 6) +
                "..." +
                userState.safe.substring(userState.safe.length - 6)}
            </Link>
          </Box>
        ) : (
          <Box p={5} shadow="md" borderWidth="1px">
            <Text fontWeight="semibold">No safes associated to this user</Text>
            <Button onClick={() => onMintAction(1)}>Get Safe Address</Button>
          </Box>
        )}

        {userState.safe && (
          <Box p={5} shadow="md" borderWidth="1px">
            <Text fontWeight="semibold">ユーザー操作</Text>
            <Flex direction="column" mt={4} gap={4}>
              <Button onClick={handleMintMyCarNFT}>自分でNFT取得</Button>
              <Button onClick={handleCreateTBA}>TBA作成</Button>
              <Button onClick={handleMintColorNFT}>TBAにColorNFTをMint</Button>
              <Button onClick={handleSetAssetNFT}>カラーアセット装着</Button>
              <Button onClick={handleIsAsset}>ColorNFTの装着状況の確認</Button>
              <Button onClick={handleMintMyCarNFTSignLess}>
                サインレスmint
              </Button>
              <Flex
                justifyContent="space-between"
                alignItems="center"
                p={5}
                shadow="md"
                borderWidth="1px"
                mt={1}
              >
                <Text>ドライバーモード:</Text>
                <Switch
                  isChecked={isSessionActive}
                  onChange={
                    isSessionActive ? handleNoDriverMode : handleDriverMode
                  }
                />
              </Flex>
              <Button onClick={handleGetSessionKeys}>
                セッションキーの確認
              </Button>
            </Flex>
          </Box>
        )}
      </VStack>
    </Center>
  );
};

export default MyPage;
