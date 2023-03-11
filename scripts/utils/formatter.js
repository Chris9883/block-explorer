function displayUnix(unixTimestamp) {
  let now = Math.floor(Date.now() / 1000);
  let difference = now - unixTimestamp;

  if (difference < 60) {
    return `${difference} seconds ago`;
  } else if (difference >= 60 && difference < 120) {
    return `> 1 minute ago`;
  } else if (difference >= 120 && difference < 3600) {
    return `> ${Math.floor(difference / 60)} minutes ago`;
  } else if (difference >= 3600 && difference < 7200) {
    return `> 1 hour ago`;
  } else if (difference >= 7200 && difference < 86400) {
    return `> ${Math.floor(difference / 3600)} hours ago`;
  } else if (difference >= 86400 && difference < 172800) {
    return `> 1 day ago`;
  } else if (difference >= 172800) {
    return `> ${Math.floor(difference / 84600)} days ago`;
  } else {
    return;
  }
}

export { displayUnix };
