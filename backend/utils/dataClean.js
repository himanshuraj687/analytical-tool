function cleanData(data) {
  // Remove empty rows
  let cleaned = data.filter(row =>
    Object.values(row).some(value => value !== "" && value !== null)
  );

  // Remove duplicates
  let unique = [];
  let jsonStrings = new Set();

  cleaned.forEach(item => {
    let str = JSON.stringify(item);
    if (!jsonStrings.has(str)) {
      jsonStrings.add(str);
      unique.push(item);
    }
  });

  return unique;
}

module.exports = cleanData;
