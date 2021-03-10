const {
  deleteProfileQuestions,
} = require('../inquirers/profiles');

const {
  getProfiles,
  addProfile,
  replaceProfiles,
  getCSVItems
} = require('../utils');

const inquirer = require('inquirer');
const atob = require('atob');

const importProfiles = async () => {
  const profiles = await getCSVItems();
  for (let i = 1; i < profiles.length; i += 1) {
    const rawProfile = profiles[i];
    if (rawProfile.length === 26) {
      const sameBilling = Boolean(rawProfile[1]);
      const profile = {
        profileName: rawProfile[0],
        email: rawProfile[2],
        phone: rawProfile[3],
        shipping: {
          firstName: rawProfile[4],
          lastName: rawProfile[5],
          country: rawProfile[8],
          address: rawProfile[6],
          address2: rawProfile[7],
          state: rawProfile[10],
          city: rawProfile[9],
          zipcode: rawProfile[11],
        },
      };
      if (sameBilling) {
        profile.billing = { ...profile.shipping };
      } else {
        profile.billing = {
          firstName: rawProfile[12],
          lastName: rawProfile[13],
          country: rawProfile[16],
          address: rawProfile[14],
          address2: rawProfile[15],
          state: rawProfile[18],
          city: rawProfile[17],
          zipcode: rawProfile[19],
        };
      }
      profile.payment = {
        cardName: rawProfile[20],
        cardType: rawProfile[21],
        cardNumber: rawProfile[22],
        cardMonth: rawProfile[23],
        cardYear: rawProfile[24],
        cvv: rawProfile[25],
      };
      await addProfile(profile);
    }
  }
};

const deleteProfile = async () => {
  const { deleteChoice } = await inquirer.prompt(deleteProfileQuestions);
  const profiles = await getProfiles();
  delete profiles[deleteChoice];
  await replaceProfiles(profiles);
};

module.exports = {
  importProfiles,
  deleteProfile,
};
