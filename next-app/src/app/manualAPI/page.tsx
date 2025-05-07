import APIContainer from "./apiContainer";

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