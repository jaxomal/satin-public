const siteMap = {
  "others": {
    "academy": {
      "modes": {
        "guest": {
          "modes": false,
          "params": [
            "url",
            "profileName",
            "monitorSetName",
            "checkoutSetName",
            "delay",
            "qty",
            "watcher"
          ]
        }
      }
    },
    "amazon": {
      "modes": {
        "normal": {
          "modes": false,
          "params": [
            "sku",
            "qty",
            "delay",
            "amazonMonitorMethod",
            "monitorSetName",
            "checkoutSetName",
            "accountName"
          ]
        }
      }
    },
    "playstation": {
      "modes": {
        "guest": {
          "modes": false,
          "params": [
            "sku",
            "profileName",
            "monitorSetName",
            "checkoutSetName",
            "delay",
            "qty",
            "watcher"
          ]
        },
        "account": {
          "modes": false,
          "params": [
            "sku",
            "profileName",
            "accountName",
            "monitorSetName",
            "checkoutSetName",
            "delay",
            "qty",
            "watcher"
          ]
        }
      }
    },
    "walmart": {
      "modes": {
        "account": {
          "modes": false,
          "params": [
            "sku",
            "monitorSetName",
            "checkoutSetName",
            "delay",
            "qty",
            "walmartMonitorMethod",
            "price",
            "profileName",
            "enforceCaptcha",
            "watcher"
          ]
        },
        "guest": {
          "modes": false,
          "params": [
            "sku",
            "profileName",
            "monitorSetName",
            "checkoutSetName",
            "walmartMonitorMethod",
            "delay",
            "qty",
            "price",
            "enforceCaptcha",
            "watcher"
          ]
        }
      }
    },
    "target": {
      "modes": {
        "profile": {
          "modes": false,
          "params": [
            "sku",
            "profileName",
            "monitorSetName",
            "checkoutSetName",
            "delay",
            "qty",
            "accountName",
            "cookieLogin",
            "watcher"
          ]
        },
        "pickup": {
          "modes": false,
          "params": [
            "sku",
            "profileName",
            "monitorSetName",
            "checkoutSetName",
            "delay",
            "radius",
            "qty",
            "accountName",
            "cookieLogin",
            "watcher"
          ]
        },
        "reuse": {
          "modes": false,
          "params": [
            "sku",
            "monitorSetName",
            "checkoutSetName",
            "delay",
            "qty",
            "accountName",
            "cookieLogin",
            "watcher"
          ]
        },
        "sfl": {
          "modes": false,
          "params": [
            "sku",
            "monitorSetName",
            "checkoutSetName",
            "delay",
            "qty",
            "accountName",
            "cookieLogin",
            "watcher"
          ]
        }
      }
    },
    "pokemoncenter": {
      "modes": {
        "guest": {
          "modes": false,
          "params": [
            "url",
            "profileName",
            "monitorSetName",
            "checkoutSetName",
            "delay",
            "qty",
            "watcher"
          ]
        }
      }
    },
    "mint": {
      "modes": {
        "guest": {
          "modes": false,
          "params": [
            "url",
            "profileName",
            "monitorSetName",
            "checkoutSetName",
            "delay",
            "qty",
            "watcher"
          ]
        }
      }
    },
    "homedepot": {
      "modes": {
        "guest": {
          "modes": false,
          "params": [
            "sku",
            "profileName",
            "monitorSetName",
            "checkoutSetName",
            "delay",
            "qty",
            "watcher"
          ]
        }
      }
    },
    "bestbuy": {
      "modes": {
        "guest": {
          "modes": false,
          "params": [
            "sku",
            "profileName",
            "monitorSetName",
            "checkoutSetName",
            "delay",
            "qty",
            "watcher"
          ]
        }
      }
    }
  },
  "woocommerce": {
    "powerblock": {
      "modes": {
        "guest": {
          "modes": false,
          "params": [
            "url",
            "profileName",
            "monitorSetName",
            "checkoutSetName",
            "delay",
            "qty",
            "watcher"
          ]
        }
      }
    }
  }
}

module.exports = siteMap;
