import MappingRow from "./MappingRow";

const MappingTable = ({ mappings }) => {
  return (
    <div className="mapping-table">
      <h3>Field Mapping & Risk Analysis</h3>
      {mappings.map((m, i) => (
        <MappingRow key={i} data={m} />
      ))}
    </div>
  );
};

export default MappingTable;
