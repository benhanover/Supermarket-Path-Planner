import SidebarMenu from "./SidebarMenu";
import Layout from "./Layout";

const LayoutEditor = () => {
  return (
    <div className="flex justify-center items-start gap-4 mt-4">
      <SidebarMenu />
      <Layout />
    </div>
  );
};

export default LayoutEditor;
