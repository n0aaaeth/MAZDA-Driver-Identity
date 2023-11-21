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

// type StepModalProps = {
//   isOpen: boolean;
//   onClose: () => void;
//   handleMintMyCarNFT: () => Promise<void> ;
//   handleCreateTBA: () => Promise<void> ;
//   handleMintColorNFT: () => Promise<void> ;
//   handleSetColorNFT: () =>Promise<void> ;
// };

type StepModalProps = {
  isOpen: boolean;
  onClose: () => void;
  handleMintMyCarNFT: any;
  handleCreateTBA: any;
  handleMintColorNFT: any;
  handleSetColorNFT: any;
};

const steps = ["取得する", "作成する", "取得する", "装着する"];

const stepContent: Record<number, string> = {
  0: "モデルを取得",
  1: "モデルに紐づくTBAを作成",
  2: "初期カラーの取得",
  3: "初期カラーをTBAに装着",
  4: "初期設定がすべて完了しました",
};

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
      // If the step function executes without throwing an error, proceed to the next step
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } catch (error) {
      // If an error is thrown, handle it here (e.g., by showing a toast notification)
      // Error handling should also be performed within each step function
    }
    setLoading(false); // Stop the spinner regardless of the outcome
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
