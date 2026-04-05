"use client";

import { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Heading from "@/components/ui/typography/Heading";
import { Span, Text } from "@/components/ui/typography/Text";
import { UseFormReturn } from "react-hook-form";
import { ChurchIdentityValues } from "@/types/type";
import { ChevronDown, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { COUNTRIES, CURRENCIES, TIME_ZONES } from "@/lib/data";

type ChurchIdentityStepProps = {
  form: UseFormReturn<ChurchIdentityValues>;
  onSubmit: (data: ChurchIdentityValues) => void;
  onSaveAndExit: (data: ChurchIdentityValues) => void;
  step?: number;
  totalSteps?: number;
  onLogoSelect: (file: File | null) => void;
  isSubmitting?: boolean;
};

const COUNTRY_BY_CODE: Record<string, string> = COUNTRIES.reduce(
  (acc, country) => {
    acc[country.code] = country.name;
    return acc;
  },
  {} as Record<string, string>,
);

export function ChurchIdentityStep({
  form,
  onSubmit,
  onSaveAndExit,
  step = 1,
  totalSteps = 3,
  onLogoSelect,
  isSubmitting = false,
}: ChurchIdentityStepProps) {
  useEffect(() => {
    const currentCountry = form.getValues("country");
    const currentCurrency = form.getValues("defaultCurrency");
    const currentTimeZone = form.getValues("timeZone");

    if (currentCountry || currentCurrency || currentTimeZone) return;

    const isFieldDirty = (name: keyof ChurchIdentityValues) =>
      form.getFieldState(name).isDirty;

    const setIfAllowed = (
      name: keyof ChurchIdentityValues,
      value: string | undefined,
    ) => {
      if (!value) return;
      if (!isFieldDirty(name)) {
        form.setValue(name, value, { shouldDirty: false });
      }
    };

    const applyCountryDefaults = (country: (typeof COUNTRIES)[number]) => {
      setIfAllowed("country", country.name);
      setIfAllowed("defaultCurrency", country.currency);
      setIfAllowed("timeZone", country.timeZone);
    };

    const browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const locale = navigator.language || "";
    const localeRegion = locale.split("-")[1]?.toUpperCase();

    const matchedByTimeZone = COUNTRIES.find(
      (country) => country.timeZone === browserTimeZone,
    );
    const matchedCountryName =
      matchedByTimeZone?.name ||
      (localeRegion ? COUNTRY_BY_CODE[localeRegion] : undefined);

    if (matchedCountryName) {
      const matchedCountry = COUNTRIES.find(
        (country) => country.name === matchedCountryName,
      );
      if (matchedCountry) {
        applyCountryDefaults(matchedCountry);
      }
    }

    if (browserTimeZone && TIME_ZONES.includes(browserTimeZone)) {
      setIfAllowed("timeZone", browserTimeZone);
    }

    const controller = new AbortController();

    const hydrateFromGeo = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/", {
          signal: controller.signal,
        });

        if (!response.ok) return;
        const data = await response.json();
        const countryCode = String(data?.country_code || "").toUpperCase();
        const matchedCountry = COUNTRIES.find(
          (country) => country.code === countryCode,
        );

        if (matchedCountry) {
          applyCountryDefaults(matchedCountry);
        }

        if (data?.timezone && TIME_ZONES.includes(data.timezone)) {
          setIfAllowed("timeZone", data.timezone);
        }
      } catch {
        return;
      }
    };

    void hydrateFromGeo();

    return () => controller.abort();
  }, [form]);
  const [selectedLogoName, setSelectedLogoName] = useState<string | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (logoPreviewUrl) {
        URL.revokeObjectURL(logoPreviewUrl);
      }
    };
  }, [logoPreviewUrl]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    form.handleSubmit(onSubmit)(e);
  };

  const handleLogoChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: any) => void,
  ) => {
    const file = e.target.files?.[0] || null;
    onChange(file);
    onLogoSelect(file);
    setSelectedLogoName(file?.name || null);
    setLogoPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  return (
    <div className="space-y-6">
      <div>
        <Heading level={1} className="mb-2">
          Church Identity
        </Heading>
        <Text variant="muted">Tell us a little about your church.</Text>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="h-5 flex items-center">
                    Church Name <Span variant="error">*</Span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Living Grace Ministries" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="alias"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="h-5 flex items-center gap-1">
                    Church Alias <Span variant="muted">(optional)</Span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5"
                          >
                            <Info className="h-3.5 w-3.5 text-primary cursor-help" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-64 text-left">
                          A short or alternative name your church is commonly
                          known by.
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Living Grace" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Church Address <Span variant="error">*</Span>
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Street address" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Country <Span variant="error">*</Span>
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        const selectedCountry = COUNTRIES.find(
                          (country) => country.name === value,
                        );
                        if (selectedCountry) {
                          form.setValue(
                            "defaultCurrency",
                            selectedCountry.currency,
                          );
                          form.setValue("timeZone", selectedCountry.timeZone);
                        }
                      }}
                      value={field.value}
                    >
                      <SelectTrigger className="relative pr-10 [&>svg]:hidden">
                        <SelectValue placeholder="Select country" />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-dashed p-1">
                          <ChevronDown className="h-3 w-3 text-muted-foreground" />
                        </span>
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRIES.map((country) => (
                          <SelectItem key={country.code} value={country.name}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State / Province</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="State / Province" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="defaultCurrency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Default Currency <Span variant="error">*</Span>
                  </FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="relative pr-10 [&>svg]:hidden">
                        <SelectValue placeholder="Select currency" />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-dashed p-1">
                          <ChevronDown className="h-3 w-3 text-muted-foreground" />
                        </span>
                      </SelectTrigger>
                      <SelectContent>
                        {CURRENCIES.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            {currency.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="timeZone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Time Zone <Span variant="error">*</Span>
                  </FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="relative pr-10 [&>svg]:hidden">
                        <SelectValue placeholder="Select time zone" />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-dashed p-1">
                          <ChevronDown className="h-3 w-3 text-muted-foreground" />
                        </span>
                      </SelectTrigger>
                      <SelectContent>
                        {TIME_ZONES.map((timeZone) => (
                          <SelectItem key={timeZone} value={timeZone}>
                            {timeZone}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Church Logo <Span variant="muted">(optional)</Span>
                </FormLabel>
                <FormControl>
                  <div
                    className="border-2 border-dashed border-border rounded-lg p-5 sm:p-8 bg-background hover:border-primary transition-colors cursor-pointer"
                    onClick={() =>
                      document.getElementById("logo-upload")?.click()
                    }
                  >
                    <div className="text-center">
                      <Text variant="muted">Click to upload logo</Text>
                      {selectedLogoName && (
                        <Text className="mt-2 text-sm text-green-700">
                          Selected: {selectedLogoName}
                        </Text>
                      )}
                      {logoPreviewUrl && (
                        <img
                          src={logoPreviewUrl}
                          alt="Church logo preview"
                          className="mx-auto mt-3 h-16 w-16 rounded object-cover"
                        />
                      )}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
                <Input
                  id="logo-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleLogoChange(e, field.onChange)}
                  disabled={isSubmitting}
                />
              </FormItem>
            )}
          />

          <div className="text-center mb-4">
            <Text variant="muted">
              Step{" "}
              <Span variant="blue">
                {step} of {totalSteps}
              </Span>
            </Text>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              type="submit"
              className="w-full order-1 md:order-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save & Continue"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={form.handleSubmit(onSaveAndExit)}
              className="w-full order-2 md:order-1 "
              disabled={isSubmitting}
            >
              <Text variant="blue">Save & Go to Dashboard</Text>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
