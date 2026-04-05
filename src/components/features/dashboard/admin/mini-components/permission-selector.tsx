"use client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ModulePermission, PermissionLevel } from "@/types";
import { Span } from "@/components/ui/typography/Text";
import Heading from "@/components/ui/typography/Heading";

type PermissionModuleSelectorProps = {
  module: ModulePermission;
  value: PermissionLevel;
  onChange?: (moduleName: string, level: PermissionLevel) => void;
  disabled?: boolean;
};

export function PermissionModuleSelector({
  module,
  value,
  onChange,
  disabled = false,
}: PermissionModuleSelectorProps) {
  return (
    <div className="space-y-3">
      <Heading level={4}>{module.module}</Heading>
      <RadioGroup
        value={value}
        disabled={disabled}
        onValueChange={(newValue) =>
          onChange && onChange(module.module, newValue as PermissionLevel)
        }
      >
        {module.options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem
              value={option.value}
              id={`${module.module}-${option.value}`}
            />
            <Label
              htmlFor={`${module.module}-${option.value}`}
              className={`text-sm font-normal ${disabled ? "cursor-not-allowed text-gray-600" : "cursor-pointer"}`}
            >
              {option.label}
              {option.description && (
                <Span variant="default"> → {option.description}</Span>
              )}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
