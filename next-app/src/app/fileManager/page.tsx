import readConfig from "@/globalComponents/configManager";
import FileTable from "./fileTable";

async function fileManager() {

  return (
    <div className="m-10">
      <FileTable config={await readConfig() || new Map()}/>
    </div>
  )
}


export default fileManager;