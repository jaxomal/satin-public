const inquirer = require('inquirer');
const {
  getProfiles,
} = require('../utils');
const atob = require('atob');
const optionMap = require('../maps/options');

const countryList = ['US'];

const states = [
  'AL',
  'AK',
  'AS',
  'AZ',
  'AR',
  'CA',
  'CO',
  'CT',
  'DE',
  'DC',
  'FM',
  'FL',
  'GA',
  'GU',
  'HI',
  'ID',
  'IL',
  'IN',
  'IA',
  'KS',
  'KY',
  'LA',
  'ME',
  'MH',
  'MD',
  'MA',
  'MI',
  'MN',
  'MS',
  'MO',
  'MT',
  'NE',
  'NV',
  'NH',
  'NJ',
  'NM',
  'NY',
  'NC',
  'ND',
  'MP',
  'OH',
  'OK',
  'OR',
  'PW',
  'PA',
  'PR',
  'RI',
  'SC',
  'SD',
  'TN',
  'TX',
  'UT',
  'VT',
  'VI',
  'VA',
  'WA',
  'WV',
  'WI',
  'WY',
];

const cards = [
  'Visa',
  'MasterCard',
  'Discover',
  'Amex'
]

const profileNameQuestion = {
  type: 'input',
  name: 'profileName',
  message: 'Profile Name:',
};

const shippingFirstNameQuestion = {
  type: 'input',
  name: 'shippingFirstName',
  message: 'Shipping First Name:',
};

const shippingLastNameQuestion = {
  type: 'input',
  name: 'shippingLastName',
  message: 'Shipping Last Name:',
};

const shippingCountryQuestion = {
  type: 'list',
  name: 'shippingCountry',
  message: 'Shipping Country:',
  choices: () => {
    return countryList;
  },
};

const shippingAddressQuestion = {
  type: 'input',
  name: 'shippingAddress',
  message: 'Shipping Address:',
};

const shippingAddress2Question = {
  type: 'input',
  name: 'shippingAddress2',
  message: 'Shipping Address 2:',
};

const shippingStateQuestion = {
  type: 'list',
  name: 'shippingState',
  message: 'Shipping State:',
  choices: () => {
    return states;
  },
};

const shippingCityQuestion = {
  type: 'input',
  name: 'shippingCity',
  message: 'Shipping City:',
};

const shippingZipcodeQuestion = {
  type: 'input',
  name: 'shippingZipcode',
  message: 'Shipping Zipcode:',
};

const sameBillingQuestion = {
  type: 'confirm',
  name: 'sameBilling',
  message: 'Same Biling:',
};

const billingFirstNameQuestion = {
  type: 'input',
  name: 'billingFirstName',
  message: 'Billing First Name:',
  when: ({ sameBilling }) => {
    return !sameBilling;
  },
};

const billingLastNameQuestion = {
  type: 'input',
  name: 'billingLastName',
  message: 'Billing Last Name:',
  when: ({ sameBilling }) => {
    return !sameBilling;
  },
};

const billingCountryQuestion = {
  type: 'input',
  name: 'billingCountry',
  message: 'Billing Country:',
  when: ({ sameBilling }) => {
    return !sameBilling;
  },
  choices: () => {
    return Object.keys(countryList);
  },
};

const billingAddressQuestion = {
  type: 'input',
  name: 'billingAddress',
  message: 'Billing Address:',
  when: ({ sameBilling }) => {
    return !sameBilling;
  },
};

const billingAddress2Question = {
  type: 'input',
  name: 'billingAddress2',
  message: 'Billing Address 2:',
  when: ({ sameBilling }) => {
    return !sameBilling;
  },
};

const billingStateQuestion = {
  type: 'input',
  name: 'billingState',
  message: 'Billing State:',
  when: ({ sameBilling }) => {
    return !sameBilling;
  },
  choices: () => {
    return states;
  },
};

const billingCityQuestion = {
  type: 'input',
  name: 'billingCity',
  message: 'Billing City:',
  when: ({ sameBilling }) => {
    return !sameBilling;
  },
};

const billingZipcodeQuestion = {
  type: 'input',
  name: 'billingZipcode',
  message: 'Billing Zipcode:',
  when: ({ sameBilling }) => {
    return !sameBilling;
  },
};

const cardNameQuestion = {
  type: 'input',
  name: 'cardName',
  message: 'Card Name:',
  default: 'Billy Boe',
}

const cardTypeQuestion = {
  type: 'list',
  name: 'cardType',
  message: 'Card Type:',
  default: 0,
  choices: () => {
    return cards;
  },
};

const cardNumberQuestion = {
  type: 'input',
  name: 'cardNumber',
  message: 'Card Number:',
};

const cardMonthQuestion = {
  type: 'list',
  name: 'cardMonth',
  message: 'Card Month:',
  default: 0,
  choices: () => {
    return ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  }
};

const cardYearQuestion = {
  type: 'input',
  name: 'cardYear',
  message: 'Card Year:',
  default: 0,
  choices: () => {
    return [
      '2020', '2021', '2022', '2023', '2024', '2025',
      '2026', '2027', '2028', '2029', '2030', '2031',
    ];
  }
};

const cvvQuestion = {
  type: 'input',
  name: 'cvv',
  message: 'CVV:',
};

const phoneQuestion = {
  type: 'input',
  name: 'phone',
  message: 'Phone:',
};

const emailQuestion = {
  type: 'input',
  name: 'email',
  message: 'Email:',
};

const deleteProfileQuestion = {
  type: 'list',
  name: 'deleteChoice',
  message: 'Delete Profile:',
  default: 0,
  choices: async () => {
    return Object.keys(await getProfiles());
  },
};

const deleteProfileQuestions = [deleteProfileQuestion];

const createProfileQuestions = [
  profileNameQuestion,
  shippingFirstNameQuestion,
  shippingLastNameQuestion,
  shippingCountryQuestion,
  shippingAddressQuestion,
  shippingAddress2Question,
  shippingStateQuestion,
  shippingCityQuestion,
  shippingZipcodeQuestion,
  sameBillingQuestion,
  billingFirstNameQuestion,
  billingLastNameQuestion,
  billingCountryQuestion,
  billingCityQuestion,
  billingAddressQuestion,
  billingAddress2Question,
  billingStateQuestion,
  billingCityQuestion,
  billingZipcodeQuestion,
  cardNameQuestion,
  cardTypeQuestion,
  cardNumberQuestion,
  cardMonthQuestion,
  cardYearQuestion,
  cvvQuestion,
  phoneQuestion,
  emailQuestion,
];

const profileOptionQuestion = {
  type: 'list',
  name: 'option',
  message: 'Option:',
  default: 0,
  choices: Object.keys(optionMap['profiles']),
};

const profileOptionQuestions = [profileOptionQuestion];

module.exports = {
  profileOptionQuestions,
  createProfileQuestions,
  deleteProfileQuestions,
};
