const {
  AcademyTask,
} = require('./others');

const taskDict = {
  others: {
    academy: {
      modes: {
        guest: AcademyTask,
      }
    }
  }
};

const getTaskConstructor = (siteType, site, mode) => {
  if (mode) {
    return taskDict[siteType][site].modes[mode];
  } else {
    return taskDict[siteType][site];
  }
};

module.exports = {
  getTaskConstructor,
};
