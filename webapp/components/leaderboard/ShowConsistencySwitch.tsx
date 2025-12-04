"use client";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useCallback } from "react";

type SwitchProp = {
  defaultValue: boolean;
  onChange: () => Promise<void>;
};

export default function ShowConsistencySwitch({
  defaultValue,
  onChange,
}: SwitchProp) {
  const onConsistencyChange = useCallback(async () => {
    await updateShowConsistency(!defaultValue);
  }, [defaultValue]);
  console.log("Consistency Switch", defaultValue);
  return (
    <div className="flex items-center space-x-2 my-4">
      <Label htmlFor="show-consistency">Show Consistency</Label>
      <Switch
        id="show-consistency"
        checked={defaultValue}
        onCheckedChange={async () => {
          await onChange();
        }}
      />
    </div>
  );
}
