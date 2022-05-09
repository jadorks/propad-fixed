export function isNonZeroNumber(_input) {
  return _input !== undefined && _input !== "" && parseFloat(_input) !== 0.0;
}

export function onInputNumberChange(e, f) {
  const re = /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/;
  if (e.target.value === "" || re.test(e.target.value)) {
    f(e.target.value);
  }
}

function treatAsUTC(date) {
  var result = new Date(Number(date));
  result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
  return result.getTime();
}

export function timestampToNumberOfDay(timestamp) {
  const millisecondePerDay = 24 * 60 * 60 * 1000;
  let now = treatAsUTC(Date.now());
  let future = treatAsUTC(Number(timestamp));

  const dys = Math.ceil((future - now) / millisecondePerDay);
  return dys > 0 ? dys : 0;
}

// export function timestampToNumberOfDayExtra(timestamp) {
//   const days = timestampToNumberOfDay(timestamp);

//   // if (days > 100) {
//   //   return
//   // }
// }

export function numberOfDaysTimeStamp(days) {
  const millisecondePerDay = 24 * 60 * 60 * 1000;
  const daysTimestamp = Number(days) * millisecondePerDay;
  const finalDate = treatAsUTC(Date.now()) + treatAsUTC(daysTimestamp);
  return new Date(finalDate).getTime();
}

export function numberOfDaysToDateString(days) {
  const timestamp = numberOfDaysTimeStamp(days);
  const date = new Date(timestamp);
  const month = date.toLocaleString("default", {
    month: "long",
  });
  const day = date.getDate();
  const year = date.getFullYear();

  return `${month} ${day}, ${year}`;
}

export function getPercentage(value, total) {
  return ((Number(value) / Number(total)) * 100).toFixed(1);
}

export const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const getUSDValue = (ethInLp, ethPrice) => {
  const supply = ethInLp * 2;
  return supply * ethPrice;
};

export const numFormatter = (num) => {
  if (num > 999 && num < 1000000) {
    return (num / 1000).toFixed(1) + "K"; // convert to K for number from > 1000 < 1 million
  } else if (num > 1000000) {
    return (num / 1000000).toFixed(1) + "M"; // convert to M for number from > 1 million
  } else if (num < 900) {
    return num; // if value < 1000, nothing to do
  }
};
