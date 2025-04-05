import RuleTable from "./ruleTable";

const ParentComp = () => {

  return (
    <div className="m-10 h-full">
      <div className="h-2/3 border-2 border-black border-solid">
        <RuleTable />
      </div>
    </div>
  )
}

export default ParentComp;