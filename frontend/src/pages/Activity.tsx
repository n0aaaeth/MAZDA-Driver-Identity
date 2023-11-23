import React, { FC, useState, useMemo } from "react";
import { Box, Button, Chip, Paper, Typography } from "@mui/material";
import { PrimaryLayout } from "../component/layout/PrimaryLayout";
import { useDiscloser } from "../hooks/useDiscloser";
import { PrimaryModal } from "../component/modal/PrimaryModal";
import { useNavigate } from "react-router-dom";

const typographyStyle = {
  color: "primary.main",
  fontFamily: "Mazda Type Regular",
  fontSize: "16px",
};

const NFTPaper = ({ title, achieved, onOpen }: any) => (
  <Paper sx={{ mb: 2, p: 2, position: "relative" }}>
    <Typography variant="h6" sx={typographyStyle}>
      {title}
    </Typography>
    <Chip
      label={achieved ? "達成済み" : "未達成"}
      sx={{
        position: "absolute",
        top: 5,
        right: 5,
        color: achieved ? "green" : "red",
        bgcolor: "white",
        fontWeight: 600,
      }}
    />
    <Button
      variant={achieved ? "contained" : "outlined"}
      fullWidth
      disabled={!achieved}
      sx={{ mt: 2 }}
      onClick={onOpen}
    >
      報酬を受け取る
    </Button>
  </Paper>
);

export const Activity: FC = () => {
  const [isOpen, onClose, onOpen] = useDiscloser(false);
  const [achievements, setAchievements] = useState([
    { title: "アスターカラーNFTを入手", isAchieved: true },
    { title: "ホイールNFT①を入手", isAchieved: false },
    { title: "ホイールNFT②を入手", isAchieved: false },
  ]);
  const navigate = useNavigate();

  const renderNFTPapers = useMemo(
    () =>
      achievements.map((achievement) => (
        <NFTPaper
          key={achievement.title}
          title={achievement.title}
          achieved={achievement.isAchieved}
          onOpen={onOpen}
        />
      )),
    [achievements, onOpen]
  );

  return (
    <PrimaryLayout>
      <Box p={2}>
        <Typography
          variant="h6"
          sx={{
            color: "secondary.main",
            fontFamily: "Mazda Type Regular",
            fontSize: "18px",
            mb: 2,
          }}
        >
          Activity Task
        </Typography>
        <Box position="relative">{renderNFTPapers}</Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button
            variant="contained"
            onClick={() => navigate("/utility")}
            sx={{
              width: "180px",
              height: "45px",
              backgroundColor: "#fff",
              color: "#000",
              mt: "210px",
              "&:hover": {
                color: "secondary.main",
              },
            }}
          >
            受け取った報酬を確認
          </Button>
        </Box>
      </Box>

      <PrimaryModal
        isOpen={isOpen}
        onClose={onClose}
        titleLabel="報酬を受け取りますか？"
        buttonLabel="受け取る（署名する)"
        onSubmitClick={onClose}
      >
        <Box display="flex" alignItems="center">
          <img
            src="../assets/item-icon.png"
            alt="Item"
            style={{
              height: "80px",
            }}
          />
        </Box>
      </PrimaryModal>
    </PrimaryLayout>
  );
};
