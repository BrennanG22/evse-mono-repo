import { redirect } from "next/navigation";
import APIContainer from "./apiContainer";
import readConfig from "@/globalComponents/config/configManager";

export const dynamic = "force-dynamic";

async function manualAPI() {

  return (
    <div>
      <div className="m-10 ">
        <APIContainer />
      </div>

    </div>
  );
}

export default manualAPI;