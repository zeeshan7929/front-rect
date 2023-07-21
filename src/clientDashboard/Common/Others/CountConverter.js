export const CountConverter = (count) => {
  var num = Number(count);
  
  var final = 0;
  if (num > 0 && num != "Infinity") {
    if (num >= 1000 && num < 1000000) {
      final = `${Math.abs(num / 1000).toFixed()}k`;
    } else if (num >= 1000000) {
      if (`${Math.abs(num / 1000000).toFixed(1)}`.includes(".0")) {
        final = `${Math.abs(num / 1000000).toFixed()}M`;
      } else {
        final = `${Math.abs(num / 1000000).toFixed(1)}M`;
      }
    } else final = num;
  } else {
    final = 0;
  }
  return final;
};
