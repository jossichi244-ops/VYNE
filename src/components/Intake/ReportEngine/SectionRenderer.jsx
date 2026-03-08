import { ComponentMapper } from "./ComponentMapper";
import SectionCard from "../../../layouts/SectionCard";

const SectionRenderer = ({ sectionKey, dataset }) => {
  const Component = ComponentMapper[sectionKey];

  if (!Component) return null;

  return (
    <SectionCard title={sectionKey.replace("_", " ").toUpperCase()}>
      <Component dataset={dataset} />
    </SectionCard>
  );
};

export default SectionRenderer;
