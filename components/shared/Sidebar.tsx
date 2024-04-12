import SidebarLinks from "./SidebarLinks";

const Sidebar = () => {
  return (
    <section className="sticky left-0 top-0 flex h-screen w-fit flex-col bg-dark-1 text-white px-3 py-4 max-sm:hidden lg:w-[264px]">
      <SidebarLinks />
    </section>
  );
};

export default Sidebar;
