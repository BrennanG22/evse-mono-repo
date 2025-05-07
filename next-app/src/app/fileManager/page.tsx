import FileTable from "./fileTable";

export const dynamic = "force-dynamic";

async function fileManager() {
  // const config = await readConfig();
  // if (config === null) {
  //   redirect("/");
  // }

  return (
    <div className="m-10">
      <FileTable />
    </div>
  )
}


export default fileManager;