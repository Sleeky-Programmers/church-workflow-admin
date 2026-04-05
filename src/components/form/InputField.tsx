import React from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { HtmlInputElementTypes } from "@/lib/enums";

type Option = { value: string; label: string };

type SharedOnChange =
  | ((e: React.ChangeEvent<HTMLInputElement>) => void)
  | ((e: React.ChangeEvent<HTMLTextAreaElement>) => void);

export const InputField = ({
  id,
  label,
  as = HtmlInputElementTypes.INPUT,
  type = "text",
  placeholder,
  value,
  onChange,
  onValueChange,
  options = [],
  leftIcon,
  rightIcon,
  selectPlaceholder,
}: {
  id?: string;
  label: string;
  as?: HtmlInputElementTypes;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: SharedOnChange;
  onValueChange?: (value: string) => void;
  options?: Option[];
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  selectPlaceholder?: string;
}) => {
  const callOnChangeWithValue = (value: string) => {
    if (onValueChange) {
      onValueChange(value);
      return;
    }

    if (onChange) {
      const synthetic = {
        target: { value: value },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      (onChange as (e: React.ChangeEvent<HTMLInputElement>) => void)(synthetic);
    }
  };

  return (
    <div className="flex flex-col space-y-2 mb-3">
      <Label htmlFor={id}>{label}</Label>

      {as === HtmlInputElementTypes.TEXTAREA ? (
        <Textarea
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={(e) =>
            (onChange as (e: React.ChangeEvent<HTMLTextAreaElement>) => void)?.(e)
          }
        />
      ) : as === HtmlInputElementTypes.SELECT ? (
        <Select value={value} onValueChange={(v) => callOnChangeWithValue(v)}>
          <SelectTrigger>
            <SelectValue placeholder={selectPlaceholder ?? placeholder ?? "Select"} />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
          leftIcon={leftIcon}
          rightIcon={rightIcon}
        />
      )}
    </div>
  );
};

export default InputField;
