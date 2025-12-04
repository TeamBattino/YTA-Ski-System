"use client";
import { useState } from "react";
import { race as Race } from "@/src/generated/client";
import WithConsistency from "@/components/leaderboard/WithConsistency";
import WithoutConsistency from "@/components/leaderboard/WithoutConsistency";

type LeaderboardProp = {
  races: Race[];
  currentRace: Race;
};

export default function Leaderboard({ races, currentRace }: LeaderboardProp) {
  const [showConsistency, setShowConsistency] = useState<boolean>(true);

  if (showConsistency) {
    return (
      <>
        <WithConsistency
          races={races}
          currentRace={currentRace}
          onChange={setShowConsistency}
        />
      </>
    );
  } else {
    return (
      <>
        <WithoutConsistency
          races={races}
          currentRace={currentRace}
          onChange={setShowConsistency}
        />
      </>
    );
  }
}
