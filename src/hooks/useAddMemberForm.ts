import { useState, useCallback } from "react";
import { NewMemberData } from "@/types";

type AddMemberStep = 1 | 2 | 3 | 4;

export function useAddMemberForm() {
  const [currentStep, setCurrentStep] = useState<AddMemberStep>(1);
  const [formData, setFormData] = useState<Partial<NewMemberData>>({});

  const updateFormData = useCallback((stepData: Partial<NewMemberData>) => {
    setFormData((prev) => ({ ...prev, ...stepData }));
  }, []);

  const goToNextStep = useCallback((stepData?: Partial<NewMemberData>) => {
    if (stepData) {
      setFormData((prev) => ({ ...prev, ...stepData }));
    }
    setCurrentStep((prev) => Math.min(prev + 1, 4) as AddMemberStep);
  }, []);

  const goToPreviousStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1) as AddMemberStep);
  }, []);

  const reset = useCallback(() => {
    setCurrentStep(1);
    setFormData({});
  }, []);

  return {
    currentStep,
    formData,
    updateFormData,
    goToNextStep,
    goToPreviousStep,
    reset,
  };
}
