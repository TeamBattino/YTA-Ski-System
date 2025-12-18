import { fetchRacers, fetchRacerBySkiPass, createRacer } from "@/lib/db-helper";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const ski_pass = url.searchParams.get("ski_pass");

    if (!ski_pass) {
      const racers = await fetchRacers();
      return NextResponse.json(racers);
    } else {
      const racerData = await fetchRacerBySkiPass(ski_pass);
      if (!racerData) {
        return NextResponse.json(
          { message: "Racer not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(racerData);
    }
  } catch (error) {
    console.error("Error handling GET request:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const ski_pass = url.searchParams.get("ski_pass");
    const ldap = url.searchParams.get("ldap");
    const name = url.searchParams.get("name");
    const location = url.searchParams.get("location");
    const race_id = url.searchParams.get("race_id");

    if (!ski_pass || !ldap || !name || !location || !race_id) {
      return NextResponse.json(
        { message: "Every attribute needed" },
        { status: 403 }
      );
    } else {
      const racerData = await createRacer(
        name,
        ldap,
        ski_pass,
        location,
        race_id
      );
      if (!racerData) {
        return NextResponse.json(
          { message: "Not able to create Racer" },
          { status: 500 }
        );
      }
      return NextResponse.json(racerData);
    }
  } catch (error) {
    console.error("Error handling POST request:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
