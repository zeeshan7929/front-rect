export const DateRange = ({ event, data, change, filterData }) => {
  const handleFilterDate = (min) => {
    change(min);
    let fill = data?.filter((el) => {
      if (
        new Date(el?.date_time).toISOString().substr(0, 10) >= min &&
        new Date(el?.date_time).toISOString().substr(0, 10) <=
          new Date().toISOString().substr(0, 10)
      ) {
        return el;
      }
    });
    filterData(fill);
  };

  const handleMinDate = (n) => {
    return new Date(Date.now() - n * 24 * 60 * 60 * 1000)
      .toISOString()
      .substr(0, 10);
  };

  switch (event) {
    case "7 Days":
      var minDate = handleMinDate(7);
      handleFilterDate(minDate);
      break;
    case "2 Weeks":
      var minDate = handleMinDate(14);
      handleFilterDate(minDate);
      break;
    case "1 Month":
      var minDate = handleMinDate(30);
      handleFilterDate(minDate);
      break;
    case "3 Months":
      var minDate = handleMinDate(90);
      handleFilterDate(minDate);
      break;
    case "YTD":
      var minDate = handleMinDate(365);
      handleFilterDate(minDate);
      break;
    default:
      return false;
  }
};
