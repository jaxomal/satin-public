const siteMap = {
  "academy": {
    "guest": [
      {
        type: "input",
        name: "url",
        message: "Url"
      },
      {
        type: "number",
        name: "delay",
        message: "Delay"
      },
      {
        type: "number",
        name: "qty",
        message: "Qty",
      }
    ]
  },
  "amazon": {
    "normal": [
      {
        type: "input",
        name: "sku",
        message: "Sku"
      },
      {
        type: "number",
        name: "delay",
        message: "Delay"
      },
      {
        type: "number",
        name: "qty",
        message: "Qty",
      },
      {
        type: "list",
        message: "Monitor Method",
        name: "monitorMethod",
        choices: () => {
          return ['fast', 'normal']
        }
      },
      {
        type: "list",
        message: "Account",
        choices: () => {
          return [] // return the account names
        }
      }
    ]
  },
  "walmart": {
    "account": [
      {
        type: "input",
        name: "sku",
        message: "Sku"
      },
      {
        type: "number",
        name: "delay",
        message: "Delay"
      },
      {
        type: "number",
        name: "qty",
        message: "Qty",
      },
      {
        type: "list",
        message: "Monitor Method",
        name: "monitorMethod",
        choices: () => {
          return ['web', 'mobile']
        }
      },
      {
        type: "number",
        message: "Max Price",
        name: "maxPrice"
      },
      {
        type: "confirm",
        message: "Captcha",
        name: "captcha",
      }
    ],
    "guest": [
      {
        type: "input",
        name: "sku",
        message: "Sku"
      },
      {
        type: "number",
        name: "delay",
        message: "Delay"
      },
      {
        type: "number",
        name: "qty",
        message: "Qty",
      },
      {
        type: "list",
        message: "Monitor Method",
        name: "monitorMethod",
        choices: () => {
          return ['web', 'mobile']
        }
      },
      {
        type: "number",
        message: "Max Price",
        name: "maxPrice"
      },
      {
        type: "confirm",
        message: "Captcha",
        name: "captcha",
      }
    ],
  },
  "target": {
    "profile": [
      {
        type: "input",
        name: "sku",
        message: "Sku"
      },
      {
        type: "number",
        name: "delay",
        message: "Delay"
      },
      {
        type: "number",
        name: "qty",
        message: "Qty",
      },
      {
        type: "number",
        message: "Max Price",
        name: "maxPrice"
      },
      {
        type: "confirm",
        message: "Browser Login?",
        name: "browserLogin"
      },
      {
        type: "list",
        message: "Account",
        choices: () => {
          return [] // return the account names
        }
      }
    ],
    "pickup": [
      {
        type: "input",
        name: "sku",
        message: "Sku"
      },
      {
        type: "number",
        name: "delay",
        message: "Delay"
      },
      {
        type: "number",
        name: "qty",
        message: "Qty",
      },
      {
        type: "number",
        name: "radius",
        message: "Radius",
      },
      {
        type: "confirm",
        message: "Browser Login?",
        name: "browserLogin"
      },
      {
        type: "list",
        message: "Account",
        choices: () => {
          return [] // return the account names
        }
      }
    ]
  },
  "homedepot": {
    "guest": [
      {
        type: "input",
        name: "url",
        message: "Url"
      },
      {
        type: "number",
        name: "delay",
        message: "Delay"
      },
      {
        type: "number",
        name: "qty",
        message: "Qty",
      }
    ]
  }
}

module.exports = siteMap;
