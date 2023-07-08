// Put other commmer function here

export const addBlurClass = () => {
  let scrollPart = document.querySelector(".scrollPart");
  let stickyHeader = document.querySelector(`.stickyHeader`);

  const handleScroll = () => {
    if (scrollPart.scrollTop > 10) {
      stickyHeader.classList.add("blur");
    } else {
      stickyHeader.classList.remove("blur");
    }
  };

  scrollPart.addEventListener("scroll", handleScroll);
  return () => {
    scrollPart.removeEventListener("scroll", handleScroll);
  };
};
