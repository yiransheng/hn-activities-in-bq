export function parseTimestamp(time) {
  time = parseInt(time, 10);
  const timestamp = new Date(time * 1000);
  if (timestamp.toString() === "Invalid Date") {
    throw TypeError(timestamp);
  }
  return timestamp;
}

export function sleep(milseconds) {
  return new Promise(resolve => {
    setTimeout(resolve, milseconds);
  });
}
