import Registration from "@/components/registration/registration";
import { getRaces } from "@/lib/db-helper";

export default async function Page() {
  const races = await getRaces();
  return <Registration races={races}/>
}
