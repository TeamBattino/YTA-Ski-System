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
  if (!req.body)
    return NextResponse.json(
      { message: "Error: body is empty" },
      { status: 400 }
    );
  try {
    const data = await req.json(); // omit run_id for create operation

    if (
      !data ||
      !data.ski_pass ||
      !data.ldap ||
      !data.name ||
      !data.location ||
      !data.race_id
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    } else {
      const racerData = await createRacer(
        data.name,
        data.ldap,
        data.ski_pass,
        data.location,
        data.race_id
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
