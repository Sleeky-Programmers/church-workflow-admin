"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { ChurchIdentityStep } from "./church-identity";
import { UploadMembersStep } from "./upload-members";
import { WeeklyServicesStep } from "./weekly-service";
import {
  WeeklyServicesValues,
  ChurchIdentityValues,
  churchIdentitySchema,
  UploadMembersValues,
  uploadMembersSchema,
} from "@/types/type";
import { createChurch, createWeeklyService, uploadMembersCsv } from "@/lib/api";
import { RouteConfig } from "@/config/routes";
import { convertTo12Hour } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  getAccessToken,
  getCurrentUserKey,
  markChurchIdentityComplete,
  markMembersUploaded,
  markWeeklyServicesComplete,
} from "@/lib/auth/session";
import Image from "next/image";

export default function ChurchOnboarding() {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<WeeklyServicesValues>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isSubmittingIdentity, setIsSubmittingIdentity] = useState(false);
  const [uploadErrorSummary, setUploadErrorSummary] = useState<string | null>(
    null,
  );
  const [uploadErrorMessages, setUploadErrorMessages] = useState<string[]>([]);
  const [servicesSynced, setServicesSynced] = useState(false);

  const { toast } = useToast();

  const router = useRouter();

  const identityForm = useForm<ChurchIdentityValues>({
    resolver: zodResolver(churchIdentitySchema),
    defaultValues: {
      name: "",
      alias: "",
      address: "",
      country: "",
      state: "",
      defaultCurrency: "",
      timeZone: "",
    },
  });

  const uploadForm = useForm<UploadMembersValues>({
    resolver: zodResolver(uploadMembersSchema),
    defaultValues: { csvFile: undefined },
  });
  const currentUserKey = getCurrentUserKey();
  const identityDraftKey = currentUserKey
    ? `onboarding:church-identity-draft:${currentUserKey}`
    : "onboarding:church-identity-draft";

  useEffect(() => {
    if (!getAccessToken()) {
      router.replace(RouteConfig.auth.signIn);
      return;
    }

    if (typeof window === "undefined") return;

    const savedDraft = window.localStorage.getItem(identityDraftKey);

    if (!savedDraft) return;

    try {
      const parsed = JSON.parse(savedDraft) as Partial<ChurchIdentityValues>;
      identityForm.reset({
        name: parsed.name || "",
        alias: parsed.alias || "",
        address: parsed.address || "",
        country: parsed.country || "",
        state: parsed.state || "",
        defaultCurrency: parsed.defaultCurrency || "",
        timeZone: parsed.timeZone || "",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to parse saved onboarding draft",
        variant: "destructive",
      });
    }
  }, [identityDraftKey, identityForm, router, toast]);

  const onIdentitySubmit = async (data: ChurchIdentityValues) => {
    setIsSubmittingIdentity(true);

    try {
      await createChurch(
        {
          name: data.name,
          alias: data.alias || "",
          address: data.address,
          country: data.country,
          state: data.state || "",
          defaultCurrency: data.defaultCurrency,
          timeZone: data.timeZone,
        },
        logoFile,
      );

      if (typeof window !== "undefined") {
        window.localStorage.setItem(identityDraftKey, JSON.stringify(data));
      }

      markChurchIdentityComplete({
        name: data.name,
        alias: data.alias || "",
        address: data.address,
        country: data.country,
        state: data.state || "",
        defaultCurrency: data.defaultCurrency,
        timeZone: data.timeZone,
      });

      setStep(2);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create church",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingIdentity(false);
    }
  };

  const onSaveIdentityAndExit = async (data: ChurchIdentityValues) => {
    setIsSubmittingIdentity(true);
    try {
      await createChurch(
        {
          name: data.name,
          alias: data.alias || "",
          address: data.address,
          country: data.country,
          state: data.state || "",
          defaultCurrency: data.defaultCurrency,
          timeZone: data.timeZone,
        },
        logoFile,
      );

      if (typeof window !== "undefined") {
        window.localStorage.setItem(identityDraftKey, JSON.stringify(data));
      }

      markChurchIdentityComplete({
        name: data.name,
        alias: data.alias || "",
        address: data.address,
        country: data.country,
        state: data.state || "",
        defaultCurrency: data.defaultCurrency,
        timeZone: data.timeZone,
      });

      router.push(RouteConfig.dashboard.home);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save church identity",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingIdentity(false);
    }
  };

  const persistWeeklyServices = async () => {
    if (servicesSynced || services.length === 0) {
      return;
    }

    const uniqueServices = new Map<
      string,
      {
        serviceName: string;
        day: string;
        startTime: string;
        endTime: string;
        location?: string;
      }
    >();
    services.forEach((service) => {
      service.days.forEach((day) => {
        const startTime = convertTo12Hour(service.startTime || "");
        const endTime = convertTo12Hour(service.endTime || service.startTime);
        const normalizedDay = day.trim().toUpperCase();
        const location = (service.location || "").trim();
        const key = [
          service.serviceName.trim().toLowerCase(),
          normalizedDay,
          startTime.trim().toUpperCase(),
          location.toLowerCase(),
        ].join("|");
        if (!uniqueServices.has(key)) {
          uniqueServices.set(key, {
            serviceName: service.serviceName,
            day: normalizedDay,
            startTime,
            endTime,
            location,
          });
        }
      });
    });

    for (const service of uniqueServices.values()) {
      await createWeeklyService({
        serviceName: service.serviceName,
        type: "REGULAR",
        day: service.day,
        startTime: service.startTime,
        endTime: service.endTime,
        location: service.location,
      });
    }

    setServicesSynced(true);
    markWeeklyServicesComplete();
  };

  const onServiceSubmit = async () => {
    try {
      setStep(3);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create weekly services",
        variant: "destructive",
      });
    }
  };

  const onUploadSubmit = async (data: UploadMembersValues) => {
    if (!data.csvFile) {
      alert("Please select a CSV file");
      return;
    }

    try {
      setUploadErrorSummary(null);
      setUploadErrorMessages([]);
      await persistWeeklyServices();
      await uploadMembersCsv(data.csvFile);
      markMembersUploaded();
      router.push(RouteConfig.dashboard.home);
    } catch (error: any) {
      const summary =
        error?.response?.data?.message ||
        error?.message ||
        "Members upload failed";
      const details = Array.isArray(error?.response?.data?.errors)
        ? error.response.data.errors.map(
            (entry: { row?: number; column?: string; reason?: string }) =>
              `Row ${entry.row ?? "?"}, ${entry.column ?? "field"}: ${entry.reason ?? "Invalid value"}`,
          )
        : [];

      setUploadErrorSummary(summary);
      setUploadErrorMessages(details);
      toast({
        title: "Error",
        description: summary,
        variant: "destructive",
      });
    }
  };

  const handleBack = () => step > 1 && setStep(step - 1);
  const handleSkip = () => {
    router.push(RouteConfig.dashboard.home);
  };

  const addService = (service: WeeklyServicesValues[number]) => {
    setServices((prev) => [...prev, service]);
  };

  const updateService = (
    index: number,
    field: keyof WeeklyServicesValues[0],
    value: any,
  ) => {
    const updated = [...services];
    updated[index][field] = value;
    setServices(updated);
  };

  const removeService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <ChurchIdentityStep
            form={identityForm}
            onSubmit={onIdentitySubmit}
            onSaveAndExit={onSaveIdentityAndExit}
            step={step}
            totalSteps={3}
            onLogoSelect={setLogoFile}
            isSubmitting={isSubmittingIdentity}
          />
        );
      case 2:
        return (
          <WeeklyServicesStep
            services={services}
            onAddService={addService}
            onUpdateService={updateService}
            onRemoveService={removeService}
            onSubmit={onServiceSubmit}
            onBack={handleBack}
            onSkip={handleSkip}
            step={step}
            totalSteps={3}
          />
        );
      case 3:
        return (
          <UploadMembersStep
            form={uploadForm}
            onSubmit={onUploadSubmit}
            onBack={handleBack}
            onSkip={handleSkip}
            errorSummary={uploadErrorSummary}
            errorMessages={uploadErrorMessages}
            onClearError={() => {
              setUploadErrorSummary(null);
              setUploadErrorMessages([]);
            }}
            step={step}
            totalSteps={3}
          />
        );
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-4 sm:mb-6">
        <Image
          src="/assets/logo/horizontal/main.png"
          alt="Church Workflow"
          width={180}
          height={52}
          priority
        />
      </div>
      {renderStep()}
    </Card>
  );
}
