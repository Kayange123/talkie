import SidebarLinks from "./SidebarLinks";

const Sidebar = () => {
  return (
    <section className="sticky left-0 top-[73px] flex h-[calc(100vh-73px)] w-fit flex-col border-r border-white/5 bg-dark-1 px-3 py-6 text-white max-sm:hidden lg:w-[264px]">
      <SidebarLinks />
    </section>
  );
};

export default Sidebar;
