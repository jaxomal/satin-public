const inquirer = require('inquirer');
const { profileOptionQuestions } = require('../inquirers/profiles');
const {
  importProfiles,
  deleteProfile,
} = require('../services/profiles');

const atob = require('atob');

const profileSection = async () => {
  while (true) {
    const { option } = await inquirer.prompt(profileOptionQuestions);
    switch (option) {
      case 'Go Back':
        return;
      case 'Import Profiles':
        await importProfiles();
        break;
      case 'Delete Profile':
        await deleteProfile();
        break;
      default:
        break;
    }
  }
};

module.exports = profileSection;
