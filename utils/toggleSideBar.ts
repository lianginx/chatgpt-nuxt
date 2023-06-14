export const toggleSideBar = () => {
  const clientWidth = document.body.clientWidth;
  if (clientWidth < 640) {
    const sideBar = document.getElementById("sidebar");
    const mainContent = document.getElementById("main");
    sideBar?.classList.toggle("hidden");
    mainContent?.classList.toggle("hidden");
  }
};
