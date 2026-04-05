import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Text, Span } from "@/components/ui/typography/Text";
import { Label } from "@/components/ui/label";
import { WeeklyServicesValues } from "@/types/type";
import { Trash2, Plus, Clock3 } from "lucide-react";
import Heading from "@/components/ui/typography/Heading";
import { useState } from "react";

type WeeklyServicesStepProps = {
  services: WeeklyServicesValues;
  onAddService: (service: WeeklyServicesValues[0]) => void;
  onUpdateService: (
    index: number,
    field: keyof WeeklyServicesValues[0],
    value: any,
  ) => void;
  onRemoveService: (index: number) => void;
  onSubmit: () => void;
  onBack: () => void;
  onSkip: () => void;
  step?: number;
  totalSteps?: number;
};

const daysOfWeek = [
  { short: "Sun", full: "Sunday" },
  { short: "Mon", full: "Monday" },
  { short: "Tue", full: "Tuesday" },
  { short: "Wed", full: "Wednesday" },
  { short: "Thu", full: "Thursday" },
  { short: "Fri", full: "Friday" },
  { short: "Sat", full: "Saturday" },
];

export function WeeklyServicesStep({
  services,
  onAddService,
  onRemoveService,
  onSubmit,
  onBack,
  onSkip,
  step = 2,
  totalSteps = 3,
}: WeeklyServicesStepProps) {
  const [isContinuing, setIsContinuing] = useState(false);
  const [newService, setNewService] = useState<{
    serviceName: string;
    days: string[];
    startTime: string;
    endTime: string;
    location: string;
  }>({
    serviceName: "",
    days: [],
    startTime: "",
    endTime: "",
    location: "",
  });

  const handleDayToggle = (day: string) => {
    setNewService((prev) => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day],
    }));
  };

  const handleAddService = () => {
    if (!newService.serviceName.trim()) {
      alert("Please enter a service name");
      return;
    }
    if (newService.days.length === 0) {
      alert("Please select at least one day");
      return;
    }
    if (!newService.startTime) {
      alert("Please set a start time");
      return;
    }

    onAddService(newService);
    setNewService({
      serviceName: "",
      days: [],
      startTime: "",
      endTime: "",
      location: "",
    });
  };

  const handleContinue = async () => {
    if (isContinuing) return;

    setIsContinuing(true);
    try {
      await Promise.resolve(onSubmit());
    } finally {
      setIsContinuing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <Heading level={1}>Weekly Services</Heading>
        <Text variant="muted">
          Set up your regular church services. These will repeat automatically
          every week.
        </Text>
      </div>

      <div className="space-y-4">
        <div>
          <Label>
            Service Name <Span variant="error">*</Span>
          </Label>
          <Input
            placeholder="e.g. Sunday Worship Service"
            value={newService.serviceName}
            onChange={(e) =>
              setNewService((prev) => ({
                ...prev,
                serviceName: e.target.value,
              }))
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Days</Label>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {daysOfWeek.map((day) => (
              <Button
                key={day.short}
                type="button"
                variant={
                  newService.days.includes(day.full) ? "default" : "outline"
                }
                className="w-full"
                onClick={() => handleDayToggle(day.full)}
              >
                {day.short}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>
              Start Time <Span variant="error">*</Span>
            </Label>
            <div className="relative">
              <Input
                type="time"
                placeholder="--:-- --"
                value={newService.startTime}
                onChange={(e) =>
                  setNewService((prev) => ({
                    ...prev,
                    startTime: e.target.value,
                  }))
                }
                className="pr-10"
              />
              <Clock3 className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <div>
            <Label>End Time</Label>
            <div className="relative">
              <Input
                type="time"
                placeholder="--:-- --"
                value={newService.endTime}
                onChange={(e) =>
                  setNewService((prev) => ({
                    ...prev,
                    endTime: e.target.value,
                  }))
                }
                className="pr-10"
              />
              <Clock3 className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        <div>
          <Label>Location</Label>
          <Input
            placeholder="e.g. Main Auditorium"
            value={newService.location}
            onChange={(e) =>
              setNewService((prev) => ({ ...prev, location: e.target.value }))
            }
          />
        </div>
      </div>

      <Button
        type="button"
        onClick={handleAddService}
        className="w-full"
        variant="default"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Service
      </Button>

      {services.length > 0 && (
        <div className="space-y-3">
          {services.map((service, index) => (
            <Card key={index} className="p-4 hover:shadow-sm transition-shadow">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                <div className="flex-1">
                  <Heading level={3} className="mb-1">
                    {service.serviceName || "Untitled Service"}
                  </Heading>
                  <div className="space-y-1">
                    <Text variant="muted" className="text-sm">
                      {service.days.join(", ") || "No days selected"} -{" "}
                      {service.startTime || "--:--"} -{" "}
                      {service.endTime || "--:--"}
                    </Text>
                    {service.location && (
                      <Text variant="muted" className="text-sm">
                        {service.location}
                      </Text>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:ml-8 self-end sm:self-auto">
                  <Text variant="tag">Weekly</Text>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => onRemoveService(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="text-center mb-4">
        <Text variant="muted">
          Step{" "}
          <Span variant="blue">
            {step} of {totalSteps}
          </Span>
        </Text>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="w-full"
        >
          <Span variant="blue">Back</Span>
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onSkip}
          className="w-full"
        >
          <Span variant="blue">Skip for now</Span>
        </Button>
        <Button
          type="button"
          onClick={handleContinue}
          className="w-full"
          disabled={isContinuing}
        >
          {isContinuing ? "Continuing..." : "Continue"}
        </Button>
      </div>
    </div>
  );
}
