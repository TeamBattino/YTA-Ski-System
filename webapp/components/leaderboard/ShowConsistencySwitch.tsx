"use client";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useCallback, useState } from "react";
import {
  updateShowConsistency,
} from "@/lib/db-helper";

type SwitchProp = {
  defaultValue: boolean;
};

export default function ShowConsistencySwitch({
  defaultValue,
}: SwitchProp) {
  const [showConsistency, setShowConsistency] = useState<boolean>(defaultValue);
  const onConsistencyChange = useCallback(async () => {
    await updateShowConsistency(!defaultValue);
    setShowConsistency(!showConsistency);
  }, [defaultValue, showConsistency]);
  console.log("Consistency Switch", defaultValue);
  return (
    <div className="flex items-center space-x-2 my-4">
      <Label htmlFor="show-consistency">Show Consistency</Label>
      <Switch
        id="show-consistency"
        checked={showConsistency}
        onCheckedChange={async () => {
          await onConsistencyChange();
        }}
      />
    </div>
  );
}
