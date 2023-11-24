import React, { useState, FC, useCallback } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { CommonModal } from "./CommonModal";
import { useNavigate } from "react-router-dom";

type StepModalProps = {
  isOpen: boolean;
  onClose: () => void;
  handleMintMyCarNFT: any;
  handleCreateTBA: any;
  handleMintColorNFT: any;
  handleSetColorNFT: any;
};

const steps = ["受け取る（署名する）", "作成する（署名する）", "受け取る（署名する）", "収納する（署名する）"];

const stepContent: Record<number, string> = {
  0: "モデルを受け取る",
  1: "モデルに紐づくTBAを作成",
  2: "初期アセット（カラー）を受け取る",
  3: "初期アセット（カラー）をTBAに収納",
  4: "初期設定がすべて完了しました",
};

const stepImage: any = {
  0: "../assets/car-black.png",
  1: "../assets/TBA-icon.png",
  2: "../assets/colors.png",
  3: "../assets/set-colors.png",
  4: "../assets/success-icon.png",
}

const stepImageStyle: any = {
  0: "80px",
  1: "120px",
  2: "85px",
  3: "120px",
  4: "70px",
}

export const StepModal: FC<StepModalProps> = ({
  isOpen,
  onClose,
  handleMintMyCarNFT,
  handleCreateTBA,
  handleMintColorNFT,
  handleSetColorNFT,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useNavigate();

  const executeStepAction = useCallback(async () => {
    setLoading(true);
    try {
      if (activeStep === 0) {
        await handleMintMyCarNFT();
      } else if (activeStep === 1) {
        await handleCreateTBA();
      } else if (activeStep === 2) {
        await handleMintColorNFT();
      } else if (activeStep === 3) {
        await handleSetColorNFT();
      }
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } catch (error) {
    }
    setLoading(false); 
  }, [
    activeStep,
    handleMintMyCarNFT,
    handleCreateTBA,
    handleMintColorNFT,
    handleSetColorNFT,
  ]);

  const handleNext = () => {
    if (activeStep < steps.length) {
      executeStepAction();
    } else {
      onClose();
      router("/custom");
    }
  };

  return (
    <CommonModal isOpen={isOpen} onClose={onClose}>
      <Box
        sx={{
          padding: 3,
          mt: 2,
          mb: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          overflow: "auto",
        }}
      >
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel></StepLabel>
            </Step>
          ))}
        </Stepper>
        <Typography variant="body1" sx={{ my: 4, textAlign: "center" }}>
          {loading ? "処理中です.." : stepContent[activeStep]}
        </Typography>
        <img
          src={stepImage[activeStep]}
          alt="Astar"
          style={{
            height: stepImageStyle[activeStep],
            marginBottom: "30px"
          }}
        />
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? (
            <>
              <CircularProgress size={20} color="inherit" />
            </>
          ) : activeStep >= steps.length ? (
            "完了"
          ) : (
            steps[activeStep]
          )}
        </Button>
      </Box>
    </CommonModal>
  );
};
