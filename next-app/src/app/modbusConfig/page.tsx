import RuleTable from "./ruleTable";

const ParentComp = () => {

  return (
    <div>
      <div className=" bg-slate-100 h-screen">
        <div className="m-16 h-2/3 border-2 border-black border-solid">
          <RuleTable />
        </div>
      </div>
    </div>
  )
}

export default ParentComp;