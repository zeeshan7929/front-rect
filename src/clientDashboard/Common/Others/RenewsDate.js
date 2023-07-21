export const RenewsDate = (date) => {
  let n = Number(new Date(date).getDate());
  
  let month = new Date(date).toLocaleDateString("en-US", {
    month: "short",
  });
  let ord = ["st", "nd", "rd"];
  let exceptions = [11, 12, 13];
  let nth =
    ord[(n % 10) - 1] == undefined || exceptions.includes(n % 100)
      ? "th"
      : ord[(n % 10) - 1];
  let getRenewDate = `${n + nth} ${month} `;
  
  return getRenewDate;
};
