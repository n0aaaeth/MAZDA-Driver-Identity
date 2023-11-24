import { AlertColor, Box } from "@mui/material";
import { PrimaryLayout } from "../component/layout/PrimaryLayout";
import { FC, useEffect, useRef, useState } from "react";
import { useDiscloser } from "../hooks/useDiscloser";
import { PrimaryModal } from "../component/modal/PrimaryModal";
import { Notification } from "../component/notification/Notification";
import { config } from "../config/config";
import { getGelatoRelayStatus } from "../services/getGelatoRelayStatus";
import { useRecoilValue } from "recoil";
import { createSessionKeys } from "../services/createSessionKeys";
import { TempKey } from "../session/TempKey";
import { getSessionKey } from "../services/getSessionKey";
import { StorageKeys } from "../session/storage/storage-keys";
import { LocalStorage } from "../session/storage/local-storage";
import { web3StateAtom } from "../store/web3State";
import { mintColorWithSessionKey } from "../services/mintColorWithSessionKey";

export const Map: FC = () => {
  const web3State = useRecoilValue(web3StateAtom);
  const [isOpen, onClose] = useDiscloser(true);
  const [carPosition, setCarPosition] = useState<any>({});
  const [pointerPosition] = useState({ x: 37, y: 35 });
  const [showArrivalModal, setShowArrivalModal] = useState(false);
  const [isSignLess, setIsSignLess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info" as AlertColor,
  });
  const markerRef = useRef<HTMLImageElement>(null);

  const openSnackbar = (
    message: string,
    severity: AlertColor
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handlePointerClick = () => {
    setCarPosition({ x: 57, y: 85 });
  };

  const handleMintItemSignLess = async () => {
    setLoading(true);

    try {
      const response = await mintColorWithSessionKey({
        provider: web3State.provider,
        to: web3State.tba,
        tokenId: [4],
        amount: [1],
      });
      const status = await getGelatoRelayStatus({
        taskIdToQuery: response
      });
      console.log("Task succeeded:", status);
      openSnackbar(`カラーNFTの取得に成功しました`, "success");
      openSnackbar(
        `アクティビティタスクの「アスターカラーNFTの入手」を達成しました! 🎉`,
        "success"
      );
      setShowArrivalModal(false);
    } catch (error) {
      console.error("An error occurred:", error);
      openSnackbar("カラーNFTの取得が失敗しました", "error");
      setShowArrivalModal(false);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  const handleStartSignLess = async () => {
    const localStorage = new LocalStorage();
    const _sessionId = localStorage.get(StorageKeys.SESSION_ID);
    const _sessionKey = localStorage.get(StorageKeys.SESSION_KEY);

    if (!_sessionId || !_sessionKey) {
      console.log("Task start");
      try {
        setLoading(true);
        const response = await createSessionKeys({
          provider: web3State.provider,
          safe: web3State.safe,
          contractAddress: config.colorAddress,
        });
        const status = await getGelatoRelayStatus({
          taskIdToQuery: response
        });
        console.log("Task succeeded:", status);
        openSnackbar(`セッションキーの作成に成功しました`, "success");
      } catch (error) {
        console.error("Error creating or fetching session keys:", error);
        openSnackbar(`セッションキーの作成または取得に失敗しました`, "error");
      } finally {
        setLoading(false);
        setIsSignLess(true);
        onClose();
      }
      return;
    }

    try {
      const session = await getSessionKey({ provider: web3State.provider });
      console.log("Session Key:", session);
      const tempKey = new TempKey(_sessionKey);
      const timestamp = Math.floor(Date.now() / 1000);

      if (
        tempKey.address !== session.tempPublicKey ||
        timestamp > +session.end.toString() ||
        web3State.safe !== session.user
      ) {
        openSnackbar(
          `セッションキーが無効です。新しいキーを作成します。`,
          "info"
        );
        setTimeout(async () => {
          try {
            await createSessionKeys({
              provider: web3State.provider,
              safe: web3State.safe,
              contractAddress: config.colorAddress,
            });
          } catch (error) {
            console.error("Error re-creating session keys:", error);
            openSnackbar(`セッションキーの再作成に失敗しました`, "error");
          }
        }, 1000);
      } else {
        openSnackbar(`既存のセッションキーが有効です。`, "info");
      }
    } catch (error) {
      console.error("Error validating or updating session:", error);
      openSnackbar(`セッションキーの検証または更新に失敗しました`, "error");
    } finally {
      setLoading(false);
    }
  };

  // useEffect for car movement - demo-specific logic
  // This effect moves the car towards the pointer position in a demo simulation.
  useEffect(() => {
    const interval = setInterval(() => {
      const dx = pointerPosition.x - carPosition.x;
      const dy = pointerPosition.y - carPosition.y;

      const distance = Math.sqrt(dx * dx + dy * dy);

      const nx = dx / distance;
      const ny = dy / distance;

      const speed = 0.3;

      const newX = carPosition.x + nx * speed;
      const newY = carPosition.y + ny * speed;

      setCarPosition({ x: newX, y: newY });

      if (
        Math.abs(newX - pointerPosition.x) < speed &&
        Math.abs(newY - pointerPosition.y) < speed
      ) {
        setCarPosition({ x: pointerPosition.x, y: pointerPosition.y });
        clearInterval(interval);
      }
    }, 16);

    return () => {
      clearInterval(interval);
    };
  }, [carPosition.x, carPosition.y]);

  // useEffect for showing arrival modal - demo-specific logic
  // This effect checks if the car has reached a specific point and triggers a modal.
  useEffect(() => {
    if (carPosition.x === 37 && carPosition.y === 35 && !showArrivalModal) {
      setShowArrivalModal(true);
    }
  }, [carPosition]);

  // useEffect for handling mint item sign-less - demo-specific logic
  // This effect performs a sign-less minting operation after a delay when the modal is shown.
  useEffect(() => {
    if (showArrivalModal) {
      const timer = setTimeout(() => {
        console.log("Processing with Session Key");

        const mintItem = async () => {
          openSnackbar(`セッションキーで自動処理を開始します`, "info");
          try {
            await handleMintItemSignLess();
          } catch (error) {
            console.error("Minting failed:", error);
          }
        };

        mintItem();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showArrivalModal]);

  return (
    <PrimaryLayout>
      <Box
        sx={{
          position: "relative",
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
          backgroundColor: "primary.black",
        }}
      >
        <Box
          style={{
            width: "100%",
            height: "100%",

            position: "absolute",
            top: "54%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <img src="../assets/map.png" alt="map" style={{ maxWidth: "100%" }} />
          {isSignLess && (
            <Box
              sx={{
                position: "absolute",
                backgroundColor: "#7A7A7A",
                transform: "translate(-50%, -15%)",
                width: "310px",
                top: "5%",
                left: "50%",
                color: "#fff",
                p: 1,
                fontSize: "12px",
                fontWeight: "600",
              }}
            >
              ドライブモード中（自動でアイテムを受け取ります）
            </Box>
          )}
          <div
            style={{
              position: "absolute",
              top: `${pointerPosition.y}%`,
              left: `${pointerPosition.x}%`,
              transform: "translate(-50%, -50%)",
              backgroundColor: "yellow",
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              cursor: "pointer",
            }}
            onClick={handlePointerClick}
          />

          <div
            style={{
              position: "absolute",
              top: `${carPosition.y}%`,
              left: `${carPosition.x}%`,
              transform: "translate(-50%, -50%)",
              cursor: "pointer",
            }}
          >
            <img
              ref={markerRef}
              src="../assets/car-cursor.png"
              alt="car cursor"
              style={{ width: "40px", height: "40px" }}
            />
          </div>
        </Box>
      </Box>
      <PrimaryModal
        isOpen={isOpen}
        onClose={onClose}
        titleLabel="ドライブモードに切り替えますか？"
        buttonLabel="切り替える（署名する）"
        onSubmitClick={handleStartSignLess}
        loading={loading}
      >
        切り替えると、セッションキーが発行され、署名なしでアイテムを受け取ること(トランザクションの発行)ができます。
      </PrimaryModal>
      <PrimaryModal
        isOpen={showArrivalModal}
        onClose={() => setShowArrivalModal(false)}
        titleLabel="アスターカラーNFTを発見しました !"
        buttonLabel="受け取る（署名する）"
        isButtonDisabled={true}
        onSubmitClick={() => {
          setShowArrivalModal(false);
        }}
        loading={loading}
      >
        <img
          src="../assets/color-astar.png"
          alt="color astar"
          style={{
            height: "90px",
          }}
        />
      </PrimaryModal>
      <Notification
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={closeSnackbar}
      />
    </PrimaryLayout>
  );
};
