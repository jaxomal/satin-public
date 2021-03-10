const {promisify} = require('util');
const Task = require('../../task');
const request = require('request');
const tough = require('tough-cookie');
const cheerio = require('cheerio');
const Discord = require('discord.js');
const encryptData = require('./encrypt');

const sleep = promisify(setTimeout);
const rp = promisify(request);


class AcademyTask extends Task {
  constructor({
    url,
    qty,
    delay,
    profileName,
    monitorSetName,
    checkoutSetName,
    watcher,
    path,
  }) {
    super(path);
    this.url = url;
    this.identifier = url;
    this.delay = delay;
    this.profileName = profileName;
    this.monitorSetName = monitorSetName;
    this.checkoutSetName = checkoutSetName;
    this.watcher = watcher;
    this.qty = qty;

    this.jar = request.jar();
    this.site = 'Academy';
    this.status = 'Created';

    this.updateStatus = (msg) =>  { this.status = msg };

    this.start = this.start.bind(this);
    this.getAbckCookie = this.getAbckCookie.bind(this);
    this.getProductInfo = this.getProductInfo.bind(this);
    this.getStoreInfo = this.getStoreInfo.bind(this);
    this.atc = this.atc.bind(this);
    this.monitor = this.monitor.bind(this);
    this.submitShipping = this.submitShipping.bind(this);
    this.selectShippingMethod  = this.selectShippingMethod.bind(this);
    this.authorizeClient = this.authorizeClient.bind(this);
    this.submitPaymentInfo = this.submitPaymentInfo.bind(this);
    this.tokenizeResponse = this.tokenizeResponse.bind(this);
    this.finalizeInfo = this.finalizeInfo.bind(this);
    this.checkout = this.checkout.bind(this);
    this.createCheckoutEmbed = this.createCheckoutEmbed.bind(this);

    this.steps = {
      0: this.setCheckoutProxy,
      1: this.getProductInfo,
      2: this.getStoreInfo,
      3: this.getAbckCookie,
      4: this.atc,
      5: this.submitShipping,
      6: this.selectShippingMethod,
      7: this.authorizeClient,
      8: this.submitPaymentInfo,
      9: this.tokenizeResponse,
      10: this.finalizeInfo,
      11: this.checkout,
    };
  }

  async start() {
    this.started = true;
    const { steps, delay, monitorSetName, checkoutSetName, profileName, updateStatus } = this;
    this.profile = await this.getProfile(profileName);
    this.monitorSet = this.itemIterator((await this.getProxySet(monitorSetName)).proxies);
    this.checkoutSet = this.itemIterator((await this.getProxySet(checkoutSetName)).proxies);
    updateStatus('Started');
    while (
      this.started &&
      !this.hasFatalError &&
      this.step < Object.keys(this.steps).length
    ) {
      try {
        await steps[this.step]();
        this.step += 1;
      } catch (e) {
        if (typeof e === 'object') {
          if (e.message) {
            updateStatus(e.message);
          }
        } else {
          updateStatus(e);
        }
        await sleep(delay);
      }
    }
  }

  async getAbckCookie() {
    const {
      jar,
      updateStatus,
    } = this;
    updateStatus('Getting Abck Cookie');
    await sleep(5000);
    const { body } = await rp(url, {
      headers: {
        authorization: 'n1XbeKlqkTIavOaqHCl3',
      }
    });
    const abckInfo = JSON.parse(body);
    const abckCkie = new tough.Cookie({
      key: '_abck',
      value: abckInfo._abck,
      domain: '.academy.com'
    });
    await jar.setCookie(abckCkie.toString(), 'https://www.academy.com');
  }

  async getProductInfo() {
    const {
      url,
      checkoutProxy,
    } = this;
    const headers = {
      Host: 'www.academy.com',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:79.0) Gecko/20100101 Firefox/79.0',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br',
      Connection: 'keep-alive',
      'Upgrade-Insecure-Requests': 1,
      Pragma: 'no-cache',
      'Cache-Control': 'no-cache',
      TE: 'Trailers',
    }
    const options = {
      headers,
      proxy: checkoutProxy,
      gzip: true,
    }
    const { body } = await rp(url, options);
    let $ = cheerio.load(body);
    const sData = $('div[data-component="pdpFacelift"] > script').html();
    const skuInfo = JSON.parse(sData.substring(sData.indexOf('={"cms') + 1));
    const skuId = skuInfo.api.inventory.online[0].skuId;
    this.sku = skuId;
    const pData = $('div[data-component="recommendations"] > script').html();
    const productInfo = JSON.parse(pData.substring(pData.indexOf('={"cms') + 1));
    const productId = productInfo.pageInfo.productId;
    this.productId = productId;
  }

  async getStoreInfo() {
    const {
      checkoutProxy,
      productId,
      url: productUrl,
      updateStatus,
    } = this;
    updateStatus('Getting Store Info');
    const url = `https://www.academy.com/api/product/${productId}/shipping?selectedStore=`;
    const headers = {
      accept: 'application/json, text/plain, */*',
      'accept-encoding': 'gzip, deflate, br',
      'accept-language': 'en-US,en;q=0.9',
      'referer': productUrl,
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36'
    }
    const options = {
      headers,
      proxy: checkoutProxy,
      gzip: true,
      json: true,
    }
    const { body: storeInfo } = await rp(url, options);
    if (storeInfo && storeInfo.shippingSLA) {
      this.shippingInfo = storeInfo['shippingSLA'];
    } else {
      throw new Error('Failed To Get Store Info');
    }
  }

  async monitor() {
    const {
      productId,
      jar,
      monitorSet,
    } = this;
    const url = `https://www.academy.com/api/inventory?productId=${productId}&storeId=&storeEligibility=&bopisEnabled=false&isSTSEnabled=false`;
    const headers = {
      Host: 'www.academy.com',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:79.0) Gecko/20100101 Firefox/79.0',
      Accept: 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br',
      Connection: 'keep-alive',
      Referer: url,
      Pragma: 'no-cache',
      'Cache-Control': 'no-cache',
      TE: 'Trailers',
    }
    const options = {
      headers,
      jar,
      proxy: monitorSet.random(),
      gzip: true,
      json: true,
    }
    const { body: stockBody } = await rp(url, options);
    if (stockBody && stockBody.online && stockBody.online[0]) {
      const stockInfo = (stockBody).online[0];
      if (stockInfo.inventoryStatus === 'IN_STOCK') {
        return;
      } else {
        throw new Error('OOS');
      }
    } else {
      throw new Error('Invalid Monitor Resp');
    }
  }

  async atc() {
    const {
      url: productUrl,
      monitorSet,
      sku,
      qty,
      jar,
      updateStatus,
    } = this;
    updateStatus('Adding To Cart');
    const url = 'https://www.academy.com/api/cart/sku';
    const headers = {
      'accept': 'application/json, text/plain, */*',
      'accept-encoding': 'gzip, deflate, br',
      'accept-language': 'en-US,en;q=0.9',
      'content-type': 'application/json;charset=UTF-8',
      'origin': 'https://www.academy.com',
      'referer': productUrl,
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Mobile Safari/537.36',
    };
    const payload = {
      skus: [{
        id: sku,
        quantity: qty,
        type: "REGULAR"
      }],
      giftAmount: "",
      inventoryCheck: true,
      isGCItem: false
    }
    const options = {
      method: 'POST',
      headers,
      proxy: monitorSet.random(),
      jar,
      json: payload,
      gzip: true,
    }
    const { body: cartInfo, statusCode } = await rp(url, options);
    if (statusCode === 403) {
      await this.getAbckCookie();
      throw new Error('Need To Get Cookie');
    }
    if (cartInfo && cartInfo.addToCart && cartInfo.addToCart.orderId && cartInfo.addToCart.orderId[0]) {
      const productInfo = cartInfo.addToCart.items[0];
      const orderId = cartInfo["addToCart"]["orderId"][0];
      this.orderId = orderId;
      this.orderItemId = productInfo.itemId;
      this.productPrice = productInfo.price;
      this.productTitle = productInfo.productName;
      this.productImage = `https:${productInfo.productImageURL}`;
    } else {
      throw new Error('Failed To ATC');
    }
  }

  async submitShipping() {
    const {
      orderId,
      profile: {
        shipping: {
          firstName,
          lastName,
          address,
          address2,
          city,
          state,
          zipcode
        },
        phone
      },
      checkoutProxy,
      jar,
      updateStatus,
    } = this;
    updateStatus('Submitting Shipping Info');
    const url = `https://www.academy.com/api/orders/PUT/${orderId}/shipping`;
    const headers = {
      'accept': 'application/json, text/plain, */*',
      'accept-encoding': 'gzip, deflate, br',
      'accept-language': 'en-US,en;q=0.9',
      'content-type': 'application/json;charset=UTF-8',
      'origin': 'https://www.academy.com',
      'referer': `https://www.academy.com/checkout?orderId=${orderId}&deliveryzip=77450`,
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'user-agent':' Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36'
    }
    const payload = {
      zipCode: zipcode,
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phone,
      address: `${address} ${address2}`,
      city: city,
      state: state,
      officeAddress: "0",
      country: "US",
      orderId: orderId,
      isAddressVerified: "1",
      URL: "checkout"
    }
    const options = {
      method: 'POST',
      headers,
      jar,
      proxy: checkoutProxy,
      json: payload,
      gzip: true,
    }

    const { body: shipInfo, statusCode } = await rp(url, options);

    if (statusCode === 403) {
      await this.getAbckCookie();
      await sleep(15000);
      throw new Error('Need To Get Cookie');
    }
    if (shipInfo && shipInfo.updateShippingAddress && shipInfo.updateShippingAddress.addressId) {
      const addressId = shipInfo.updateShippingAddress.addressId;
      this.addressId = addressId;
    } else {
      console.log(shipInfo);
      throw new Error('Failed To Update Shipping');
    }
  }

  async selectShippingMethod() {
    const {
      orderId,
      addressId,
      orderItemId,
      profile: {
        shipping: {
          firstName,
          lastName,
          address,
          address2,
          city,
          state,
          zipcode,
        },
        phone,
      },
      jar,
      proxy,
      shippingInfo,
      updateStatus,
    } = this;
    updateStatus('Selecting Shipping Method');
    const url = `https://www.academy.com/api/orders/PUT/${orderId}/shipping`;
    const headers = {
      'accept': 'application/json, text/plain, */*',
      'accept-encoding': 'gzip, deflate, br',
      'accept-language': 'en-US,en;q=0.9',
      'content-type': 'application/json;charset=UTF-8',
      'origin': 'https://www.academy.com',
      'referer': `https://www.academy.com/checkout?orderId=${orderId}&deliveryzip=77450`,
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'user-agent':' Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36'
    }
    const payload = {
      firstName,
      lastName,
      addressId,
      phoneNumber: phone,
      address: `${address} ${address2}`,
      zipCode: zipcode,
      city: city,
      state: state,
      country: "US",
      companyName: " ",
      logonId: "",
      orderItems: [{
        orderItemId,
        shipModeId: shippingInfo['shipmodeId'],
      }],
      orderId: orderId,
      isAddressVerified: "1",
      URL: "checkout",
      storeAddress: []
    }
    const options = {
      method: 'POST',
      headers,
      json: payload,
      jar,
      proxy,
      gzip: true,
    }
    const { statusCode, body: selectInfo } = await rp(url, options);
    if (statusCode === 403) {
      await this.getAbckCookie();
      await sleep(15000);
      throw new Error('Need To Get Cookie');
    }
    if (selectInfo && selectInfo.updateShippingAddress && selectInfo.updateShippingAddress.orderId) {
    } else {
      console.log(selectInfo);
      throw new Error('Failed To Select Shipping Method');
    }
  }

  async authorizeClient() {
    const {
      jar,
      orderId,
      checkoutProxy,
      updateStatus,
    } = this;
    updateStatus('Authorizing Client');
    const url = `https://www.academy.com/api/payment/payeezy/${orderId}/authorizeClient`;
    const headers = {
      accept: 'application/json, text/plain, */*',
      'accept-encoding': 'gzip, deflate, br',
      'accept-language': 'en-US,en;q=0.9',
      'cache-control': 'no-cache',
      'pragma': 'no-cache',
      'referer': `https://www.academy.com/checkout?orderId=${orderId}&deliveryzip=77450`,
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36',
    }
    const options = {
      headers,
      proxy: checkoutProxy,
      jar,
      json: true,
      gzip: true,
    }
    const { body: authInfo, statusCode } = await rp(url, options);
    if (statusCode === 403) {
      await this.getAbckCookie();
      await sleep(15000);
      throw new Error('Need To Get Cookie');
    }
    if (authInfo && authInfo.clientToken) {
      this.authInfo = authInfo;
    } else {
      throw new Error('Failed To Authorize Client');
    }
  }

  async submitPaymentInfo() {
    const {
      authInfo,
      jar,
      profile: {
        payment: {
          cardNumber,
          cvv,
          cardMonth,
          cardYear,
          cardName,
        }
      },
      checkoutProxy,
      updateStatus,
    } = this;
    const { clientToken, publicKeyBase64 } = authInfo;
    const data1 = {
      card: {
        value: cardNumber,
      },
      cvv: {
        value: cvv
      },
      exp: {
        value: `${cardMonth}/${cardYear}`
      },
      name: {
        value: cardName
      }
    }
    updateStatus('Submitting Payment Info');
    const url = 'https://prod.api.firstdata.com/paymentjs/v2/client/tokenize';
    const headers = {
      'Accept': '/',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'en-US,en;q=0.9',
      'Client-Token': `Bearer ${clientToken}`,
      'Connection': 'keep-alive',
      'Content-Type': 'application/json',
      'Host': 'prod.api.firstdata.com',
      'Origin': 'https://docs.paymentjs.firstadata.com/',
      'Referer': 'https://docs.paymentjs.firstdata.com/lib/prod/fields.html',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-site',
      'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Mobile Safari/537.36'
    }
    const payload = {
      "encryptedData": encryptData(publicKeyBase64, data1),
    };
    const options = {
      method: 'POST',
      headers,
      json: payload,
      proxy: checkoutProxy,
      jar,
      gzip: true,
    }
    const { body: payeezyInfo } = await rp(url, options);
    if (payeezyInfo && payeezyInfo.body) {
      this.hasFatalError = true;
      throw new Error('Failed To Encrpyt Card');
    } else {
      return;
    }
  }

  async tokenizeResponse() {
    const {
      authInfo,
      orderId,
      checkoutProxy,
      jar,
      updateStatus,
    } = this;
    const { clientToken } = authInfo;
    updateStatus('Getting Token Response');
    const url = `https://www.academy.com/api/payment/payeezy/tokenizeResponse/${clientToken}`;
    const headers = {
      'accept': 'application/json, text/plain, */*',
      'accept-encoding': 'gzip, deflate, br',
      'accept-language': 'en-US,en;q=0.9',
      'referer': `https://www.academy.com/checkout?orderId=${orderId}&deliveryzip=77450`,
      'cache-control': 'no-cache',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'user-agent':' Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36'
    }
    const options = {
      headers,
      proxy: checkoutProxy,
      jar,
      json: true,
      gzip: true,
    }
    const { body: paymentInfo, statusCode } = await rp(url, options);
    if (statusCode === 403) {
      await this.getAbckCookie();
      await sleep(15000);
      throw new Error('Need To Get Cookie');
    }
    if (paymentInfo && paymentInfo.body && !paymentInfo.body.error) {
      this.paymentInfo = paymentInfo;
    } else {
      console.log(paymentInfo);
      this.hasFatalError = true;
      throw new Error('Failed To Submit Payment');
    }
  }

  async finalizeInfo() {
    const {
      paymentInfo,
      addressId,
      orderId,
      profile: {
        payment: {
          cardName,
          cardMonth,
          cardYear,
        },
        billing: {
          firstName,
          lastName,
          address,
          address2,
          zipcode,
          state,
          city,
        },
        phone,
        email,
      },
      checkoutProxy,
      jar,
      updateStatus,
    } = this;
    const { card, zeroDollarAuth: { cvv2 } } = paymentInfo.body;
    const {
      brand,
      last4,
      token,
      bin,
    } = card;
    updateStatus('Finalizing Info');
    const url = `https://www.academy.com/api/orders/${orderId}/creditCard`;
    const headers = {
      'Accept': 'application/json, text/plain, */*',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'en-US,en;q=0.9',
      'Content-Type': 'application/json;charset=UTF-8',
      'cache-control': 'no-cache',
      'Origin': 'https://www.academy.com',
      'Referer': `https://www.academy.com/checkout?orderId=${orderId}&deliveryzip=77450`,
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-site',
      'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Mobile Safari/537.36'
    }
    const payload = {
      "orderId": orderId,
      "paymentMethod":"creditCard",
      "addressId": addressId,
      "editBillingAddressId":"",
      "billingSameAsShippingAddress":"0",
      "creditCard":{
        "exp_date":`${cardMonth}${`${cardYear.charAt(0)}${cardYear.charAt(3)}`}`,
        "cardType": brand,
        "lastFourCCDigit": last4,
        "token": token,
        "cardHolderFirstName": cardName.split(' ')[0],
        "cardHolderLastName": cardName.split(' ')[1],
        "cvv":"",
        "cvvCode": cvv2,
        "cardBin": bin,
      },
      "billingAddress":{
        "firstName": firstName,
        "lastName": lastName,
        "address": `${address} ${address2}`,
        "phoneNumber": phone,
        "zipCode": zipcode,
        "state": state,
        "city": city,
        "country": "US",
        "organizationName":"",
        "email": email,
      },
      "savePaymentInfo":"0",
      "promoEmailPreference":"1",
      "smsPreference":"0"
    }
    const options = {
      method: 'POST',
      headers,
      json: payload,
      proxy: checkoutProxy,
      jar,
      gzip: true,
    }
    const { body: finalizedInfo, statusCode } = await rp(url, options);
    if (statusCode === 403) {
      await this.getAbckCookie();
      await sleep(15000);
      throw new Error('Need To Get Cookie');
    }
    if (finalizedInfo && finalizedInfo.addBillingAddress && finalizedInfo.addBillingAddress.orderId) {
      return;
    } else {
      throw new Error('Failed To Finalize Info');
    }
  }

  async checkout() {
    const {
      orderId,
      orderItemId,
      shippingInfo,
      proxy,
      jar,
      updateStatus,
      sendCheckoutNotifications,
    } = this;
    const {
      shipmodeId,
      estimatedFromDate,
      estimatedToDate
    } = shippingInfo;
    updateStatus('Checking Out');
    const url = `https://www.academy.com/api/orders/${orderId}`;
    const headers = {
      accept: 'application/json, text/plain, */*',
      'accept-encoding': 'gzip, deflate, br',
      'accept-language': 'en-US,en;q=0.9',
      'content-type': 'application/json;charset=UTF-8',
      'origin': 'https://www.academy.com',
      'referer': `https://www.academy.com/checkout?orderId=${orderId}&deliveryzip=77450`,
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Mobile Safari/537.36',
    }
    const payload = {
      "orderId": orderId,
      "shippingModes":[
        {
          "orderItemId": orderItemId,
          "selectedShipmodeId": shipmodeId,
          "estimatedFromDate": estimatedFromDate,
          "estimatedToDate": estimatedToDate
        }
      ],
      "agreeTermsAndConditions":"Y",
      "agreeAgeRestrictionForOrder":"N",
      "noOfAttempts":1,
      "cvv": "",
      "gc_pin": null,
      "avoidExtraParamsCalculation":true,
      "paymentMethod":"creditCard"
    }
    const options = {
      method: 'POST',
      headers,
      proxy,
      jar,
      json: payload,
      gzip: true,
    }
    const { body: orderInfo, statusCode } = await rp(url, options);
    if (statusCode === 403) {
      await this.getAbckCookie();
      await sleep(15000);
      throw new Error('Need To Get Cookie');
    }
    if (statusCode === 201 && orderInfo && orderInfo.orderId) {
      console.log(orderInfo);
      sendCheckoutNotifications();
      updateStatus('Checked Out');
    } else if (orderInfo.errors[0].errorKey === '_API_BAD_INV') {
      throw new Error('OOS');
    } else {
      throw new Error('Failed To Checkout');
    }
  }

  createCheckoutEmbed() {
    const {
      productPrice,
      url,
      productTitle,
      productImage,
      siteName,
      profileName,
      mode,
      orderId,
    } = this;
    const embed = new Discord.MessageEmbed();
    return embed;
  }
}

module.exports = AcademyTask;
