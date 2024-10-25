// // cookie will be expire after 2 day
// const currentDate = new Date();
// const fiveHours = 5 * 60 * 60 * 1000;
// const thirtymin = 30 * 60 * 1000;
// const afterDays = 2;
// const TwoDaysInMiliseconds =
//   currentDate.getMilliseconds() +
//   afterDays * 24 * 60 * 60 * 1000 +
//   fiveHours +
//   thirtymin;

// const expiresAtDate = new Date().toDateString();

export function millisecondsAfterdays(afterDays: number) {
  const currentDate = new Date();
  // const fiveHours = 18000000; // 5 * 60 * 60 * 1000
  // const thirtymin = 1800000; // 30 * 60 * 1000;
  const fiveAndHalfHoursMilli = 19800000;
  const oneDayMilli = 86400000; // 1 day *  24 * 60 * 60 * 1000
  const Miliseconds =
    currentDate.getMilliseconds() + fiveAndHalfHoursMilli + oneDayMilli * afterDays;

  return Miliseconds;
}

export function dateStringAfterDays(afterDays: number) {
  // Get the current date and time
  let currentDate = new Date();

  // Add number of days
  currentDate.setDate(currentDate.getDate() + afterDays);

  // Convert the date to a full date and time string
  // let dateTimeString = currentDate.toLocaleString(); // Default locale

  // Output the date and time string
  // console.log(dateTimeString); // Example: "10/25/2024, 10:30:00 AM"

  // // Example with specific locale (US English) and options for date and time
  // let options = {
  //   year: "numeric",
  //   month: "2-digit",
  //   day: "2-digit",
  //   hour: "2-digit",
  //   minute: "2-digit",
  //   second: "2-digit",
  // };
  let formattedDateTime = currentDate.toLocaleString("en-US");

  // console.log(formattedDateTime); // Example: "10/25/2024, 10:30:00 AM"

  return formattedDateTime;
}
