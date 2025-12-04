"use client";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dispatch, SetStateAction } from "react";

type SwitchProp = {
  defaultValue: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
};

export default function ShowConsistencySwitch({
  defaultValue,
  onChange,
}: SwitchProp) {
  return (
    <div className="flex items-center space-x-2 my-4">
      <Label htmlFor="show-consistency">Show Consistency</Label>
      <Switch
        id="show-consistency"
        checked={defaultValue}
        onCheckedChange={onChange}
      />
    </div>
  );
}
