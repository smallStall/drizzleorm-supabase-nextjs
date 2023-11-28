const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'user_data.json');

const readKey = (key) => {
  const data = readData();
  return data[key];
}

const writeKey = (key, value) => {
  let oldData = readData();
  const newData = {
    ...oldData,
    [key]: value
  }
  writeData(newData);
}

const writeData = (data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data));
    return true;
  }
  catch (err) {
    return false;
  }
}

const readData = () => {
  try {
    const jsonData = fs.readFileSync(filePath);
    return JSON.parse(jsonData);
  }
  catch (err) {
    if (err.code === 'ENOENT') {
      writeData({}, filePath);
    }
    return {};
  }
}

module.exports = {
  readKey,
  writeKey
}
