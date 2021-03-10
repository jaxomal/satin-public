const atob = require('atob');
const btoa = require('btoa');
const crypto = require('crypto')


const encryptData = (basekey, inData) => {
  const exp = p(inData.exp.value);
  var data;
  var d = ((data = {}).card = inData.card.value, data.cvv = inData.cvv.value, data.exp = exp, data.name = inData.name.value, data);
  return create(basekey, d);
};
  
  var p = function (name) {
  var arr = function (value) {
      return (value = value.replace(/\s/g, "")).indexOf("/") >= 0 ? value.split("/") : value.length >= 4 ? [value.substring(0, 2), value.substring(2)] : (console.log("ERROR: failed to parse expdate"), ["01", "00"]);
  }(name);
  var s = arr[0];
  var val = arr[1];
  return 1 === s.length && (s = "0" + s), 4 === val.length && "20" === val.substring(0, 2) && (val = val.substr(2)), s + val;
  };
  
  var create = function (dir, charset) {
  var options;
  var data;
  var logger = init(dir, (options = charset, JSON.stringify(((data = {}).card = options.card, data.cvv = options.cvv, data.exp = options.exp, data.name = options.name, data))));
  if (null == logger) {
      throw new Error("failed to encrypt card data");
  }
  return logger;
  };
  
  
  var eventProcessor = function() {
      /**
       * @param {?} tag
       * @param {string} tagNumber
       * @param {!Function} tagClass
       * @return {undefined}
       */
      function ASN1Tag(tag, tagNumber, tagClass) {
      this.tagConstructed = tag;
      /** @type {string} */
      this.tagNumber = tagNumber;
      /** @type {!Function} */
      this.tagClass = tagClass;
      }
      return ASN1Tag.fromStream = function(stream) {
      var n = stream.get();
      return new ASN1Tag(0 != (32 & n), 31 & n, n >> 6);
      }, ASN1Tag.prototype.isUniversal = function() {
      return 0 === this.tagClass;
      }, ASN1Tag.prototype.isEOC = function() {
      return 0 === this.tagClass && 0 === this.tagNumber;
      }, ASN1Tag;
  }();
  
  var done = function decode(stream) {
      var streamStart = new Error(stream);
      var tag = eventProcessor.fromStream(stream);
      var len = stream.decodeLength();
      var start = stream.pos;
      /** @type {number} */
      var header = start - streamStart.pos;
      /** @type {null} */
      var sub = null;
      /**
       * @return {?}
       */
      var parse = function() {
          /** @type {!Array} */
          var args = [];
          if (null !== len) {
          var end = start + len;
          for (; stream.pos < end;) {
              args[args.length] = decode(stream);
          }
          if (stream.pos != end) {
              throw new Error("Content size is not correct for container starting at offset " + start);
          }
          } else {
          try {
              for (;;) {
              var s = decode(stream);
              if (s.tag.isEOC()) {
                  break;
              }
              args[args.length] = s;
              }
              /** @type {number} */
              len = start - stream.pos;
          } catch (to3) {
              throw new Error("Exception while decoding undefined length content: " + to3);
          }
          }
          return args;
      };
      if (tag.tagConstructed) {
          sub = parse();
      } else {
          if (tag.isUniversal() && (3 == tag.tagNumber || 4 == tag.tagNumber) && (3 != tag.tagNumber || 0 == stream.get())) {
          /** @type {number} */
          var i = 0;
          var keyPackets = sub = parse();
          for (; i < keyPackets.length; i++) {
              if (keyPackets[i].tag.isEOC()) {
              /** @type {null} */
              sub = null;
              break;
              }
          }
          }
      }
      if (null === sub) {
          if (null === len) {
          throw new Error("We can't skip over an invalid tag with undefined length at offset " + start);
          }
          stream.pos = start + Math.abs(len);
      }
      return new ASN1(streamStart, header, len, tag, sub);
  };
  
  var ASN1 = function() {
      /**
       * @param {!Object} stream
       * @param {string} header
       * @param {!Object} value
       * @param {string} tag
       * @param {!Object} _2
       * @return {undefined}
       */
      function error(stream, header, value, tag, _2) {
      if (!(tag instanceof eventProcessor)) {
          throw new Error("Invalid tag value.");
      }
      /** @type {!Object} */
      this.stream = stream;
      /** @type {string} */
      this.header = header;
      /** @type {!Object} */
      this.length = value;
      /** @type {string} */
      this.tag = tag;
      /** @type {!Object} */
      this.sub = _2;
      }
      return error.prototype.getHexStringValue = function() {
      var lineText = this.stream.hexDump(this.stream.pos, this.stream.pos + this.header + Math.abs(this.length), true);
      /** @type {number} */
      var snippetStartIndex = 2 * this.header;
      /** @type {number} */
      var start = 2 * this.length;
      return lineText.substr(snippetStartIndex, start);
      }, error;
  }();
  
  var init = function (d, e) {
  var b;
  var c;
  var dayOfMonth;
  /** @type {string} */
  var json = atob(d);
  var publicKey = (b = getUser(json).sub[1].sub[0], c = b.sub[0].getHexStringValue(), dayOfMonth = b.sub[1].getHexStringValue(), {
      e: parseInt(dayOfMonth, 16),
      n: x.fromString(c, 4)
  });
  var t = function (t, stacked) {
      if (stacked < t.length + 11) {
          return console.error("Message too long for RSA"), null;
      }
      /** @type {!Array} */
      var s = [];
      /** @type {number} */
      var i = t.length - 1;
      for (; i >= 0 && stacked > 0;) {
          var rows = t.charCodeAt(i--);
          if (rows < 128) {
              s[--stacked] = rows;
          } else {
              if (rows > 127 && rows < 2048) {
                  /** @type {number} */
                  s[--stacked] = 63 & rows | 128;
                  /** @type {number} */
                  s[--stacked] = rows >> 6 | 192;
              } else {
                  /** @type {number} */
                  s[--stacked] = 63 & rows | 128;
                  /** @type {number} */
                  s[--stacked] = rows >> 6 & 63 | 128;
                  /** @type {number} */
                  s[--stacked] = rows >> 12 | 224;
              }
          }
      }
      /** @type {number} */
      s[--stacked] = 0;
      var r = directory_epub.create();
      /** @type {!Array} */
      var a = [];
      for (; stacked > 2;) {
          /** @type {number} */
          a[0] = 0;
          for (; 0 == a[0];) {
              r.nextBytes(a);
          }
          s[--stacked] = a[0];
      }
      return s[--stacked] = 2, s[--stacked] = 0, x.fromString(s, 8);
  }(e, publicKey.n.bitLength() + 7 >> 3);
  if (null == t) {
      return null;
  }
  var compositeEncryptedMessage = t.modPowInt(publicKey.e, publicKey.n);
  if (null == compositeEncryptedMessage) {
      return null;
  }
  var s = compositeEncryptedMessage.toHexString();
  if (0 != (1 & s.length)) {
      /** @type {string} */
      s = "0" + s;
  }
  var navLinksArr = s.match(/\w{2}/g);
  if (null == navLinksArr) {
      return null;
  }
  var XMLString = navLinksArr.map(function (hexaCode) {
      return String.fromCharCode(parseInt(hexaCode, 16));
  }).join("");
  return btoa(XMLString);
  };
  
  function getUser(value) {
      //console.log(value);
      var err = /^\s*(?:[0-9A-Fa-f][0-9A-Fa-f]\s*)+$/.test(value) ? function(t) {
      var i;
      if (void 0 === o) {
          /** @type {string} */
          var n = "0123456789ABCDEF";
          /** @type {string} */
          var preescape = " \f\n\r\t\u00c2 \u2028\u2029";
          o = {};
          /** @type {number} */
          i = 0;
          for (; i < 16; ++i) {
          /** @type {number} */
          o[n.charAt(i)] = i;
          }
          /** @type {string} */
          n = n.toLowerCase();
          /** @type {number} */
          i = 10;
          for (; i < 16; ++i) {
          /** @type {number} */
          o[n.charAt(i)] = i;
          }
          /** @type {number} */
          i = 0;
          for (; i < preescape.length; ++i) {
          /** @type {number} */
          o[preescape.charAt(i)] = -1;
          }
      }
      /** @type {!Array} */
      var ret = [];
      /** @type {number} */
      var a = 0;
      /** @type {number} */
      var d = 0;
      /** @type {number} */
      i = 0;
      for (; i < t.length; ++i) {
          var p = t.charAt(i);
          if ("=" == p) {
          break;
          }
          if (-1 != (p = o[p])) {
          if (void 0 === p) {
              throw new Error("Illegal character at offset " + i);
          }
          /** @type {number} */
          a = a | p;
          if (++d >= 2) {
              /** @type {number} */
              ret[ret.length] = a;
              /** @type {number} */
              a = 0;
              /** @type {number} */
              d = 0;
          } else {
              /** @type {number} */
              a = a << 4;
          }
          }
      }
      if (d) {
          throw new Error("Hex encoding incomplete: 4 bits missing");
      }
      return ret;
      }(value) : get(value);
      const newError = new Error(err, 0)
      return done(newError);
  };
  
  
  var args;
  function get(t) {
      const options = /-----BEGIN [^-]+-----([A-Za-z0-9+\/=\s]+)-----END [^-]+-----|begin-base64[^\n]+\n([A-Za-z0-9+\/=\s]+)====/;
      /** @type {(Array<string>|null)} */
      var tl = options.exec(t);
      if (tl) {
      if (tl[1]) {
          /** @type {string} */
          t = tl[1];
      } else {
          if (!tl[2]) {
          throw new Error("RegExp out of sync");
          }
          /** @type {string} */
          t = tl[2];
      }
      }
      return function(b) {
      var i;
      if (void 0 === args) {
          /** @type {string} */
          var preescape = "= \f\n\r\t\u00c2 \u2028\u2029";
          /** @type {!Object} */
          args = Object.create(null);
          /** @type {number} */
          i = 0;
          for (; i < 64; ++i) {
          /** @type {number} */
          args["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(i)] = i;
          }
          /** @type {number} */
          i = 0;
          for (; i < preescape.length; ++i) {
          /** @type {number} */
          args[preescape.charAt(i)] = -1;
          }
      }
      /** @type {!Array} */
      var parsed = [];
      /** @type {number} */
      var a = 0;
      /** @type {number} */
      var s = 0;
      /** @type {number} */
      i = 0;
      for (; i < b.length; ++i) {
          var p = b.charAt(i);
          if ("=" == p) {
          break;
          }
          if (-1 != (p = args[p])) {
          if (void 0 === p) {
              throw new Error("Illegal character at offset " + i);
          }
          /** @type {number} */
          a = a | p;
          if (++s >= 4) {
              /** @type {number} */
              parsed[parsed.length] = a >> 16;
              /** @type {number} */
              parsed[parsed.length] = a >> 8 & 255;
              /** @type {number} */
              parsed[parsed.length] = 255 & a;
              /** @type {number} */
              a = 0;
              /** @type {number} */
              s = 0;
          } else {
              /** @type {number} */
              a = a << 6;
          }
          }
      }
      switch(s) {
          case 1:
          throw new Error("Base64 encoding incomplete: at least 2 bits missing");
          case 2:
          /** @type {number} */
          parsed[parsed.length] = a >> 10;
          break;
          case 3:
          /** @type {number} */
          parsed[parsed.length] = a >> 16;
          /** @type {number} */
          parsed[parsed.length] = a >> 8 & 255;
      }
      return parsed;
      }(t);
  };
  
  var Error = function() {
      /**
       * @param {string} enc
       * @param {number} size
       * @return {undefined}
       */
      function Stream(enc, size) {
      /** @type {string} */
      this.hexDigits = "0123456789ABCDEF";
      if (enc instanceof Stream) {
          this.enc = enc.enc;
          this.pos = enc.pos;
      } else {
          /** @type {string} */
          this.enc = enc;
          /** @type {number} */
          this.pos = size;
      }
      }
      return Stream.prototype.get = function(pos) {
      if (void 0 === pos && (pos = this.pos++), pos >= this.enc.length) {
          throw new Error("Requesting byte offset " + pos + " on a stream of length " + this.enc.length);
      }
      return "string" == typeof this.enc ? this.enc.charCodeAt(pos) : this.enc[pos];
      }, Stream.prototype.hexDump = function(start, width, data) {
      /** @type {string} */
      var s = "";
      /** @type {number} */
      var i = start;
      for (; i < width; ++i) {
          if (s = s + this.hexByte(this.get(i)), true !== data) {
          switch(15 & i) {
              case 7:
              /** @type {string} */
              s = s + "  ";
              break;
              case 15:
              /** @type {string} */
              s = s + "\n";
              break;
              default:
              /** @type {string} */
              s = s + " ";
          }
          }
      }
      return s;
      }, Stream.prototype.decodeLength = function() {
      var n = this.get();
      /** @type {number} */
      var len = 127 & n;
      if (len == n) {
          return len;
      }
      if (len > 6) {
          throw new Error("Length over 48 bits not supported at position " + (this.pos - 1));
      }
      if (0 === len) {
          return null;
      }
      /** @type {number} */
      n = 0;
      /** @type {number} */
      var fp = 0;
      for (; fp < len; ++fp) {
          n = 256 * n + this.get();
      }
      return n;
      }, Stream.prototype.hexByte = function(b) {
      return this.hexDigits.charAt(b >> 4 & 15) + this.hexDigits.charAt(15 & b);
      }, Stream;
  }();
  
  var x = function() {
      /**
       * @param {number} a
       * @param {number} b
       * @return {undefined}
       */
      function BigInteger(a, b) {
      /** @type {number} */
      this.s = a;
      /** @type {number} */
      this.t = b;
      }
      return BigInteger.one = function() {
      var biSig = new BigInteger(0, 1);
      return biSig[0] = 1, biSig;
      }, BigInteger.fromString = function(value, string) {
      var b = BigInteger.null();
      /** @type {number} */
      b.t = 0;
      /** @type {number} */
      b.s = 0;
      var n = value.length;
      /** @type {boolean} */
      var incompat = false;
      /** @type {number} */
      var s = 0;
      for (; --n >= 0;) {
          var c = 8 == string ? 255 & +value[n] : $(value, n);
          if (c < 0) {
          if ("-" == value.charAt(n)) {
              /** @type {boolean} */
              incompat = true;
          }
          } else {
          /** @type {boolean} */
          incompat = false;
          if (0 == s) {
              b[b.t++] = c;
          } else {
              if (s + string > context.DB) {
              b[b.t - 1] |= (c & (1 << context.DB - s) - 1) << s;
              /** @type {number} */
              b[b.t++] = c >> context.DB - s;
              } else {
              b[b.t - 1] |= c << s;
              }
          }
          if ((s = s + string) >= context.DB) {
              /** @type {number} */
              s = s - context.DB;
          }
          }
      }
      return 8 == string && 0 != (128 & +value[0]) && (b.s = -1, s > 0 && (b[b.t - 1] |= (1 << context.DB - s) - 1 << s)), b.clamp(), incompat && b.negateTo(b), b;
      }, BigInteger.null = function() {
      return new BigInteger;
      }, BigInteger.prototype.toHexString = function() {
      if (this.s < 0) {
          return "-" + this.negate().toHexString();
      }
      var p;
      /** @type {boolean} */
      var ascending = false;
      /** @type {string} */
      var result = "";
      var i = this.t;
      /** @type {number} */
      var j = context.DB - i * context.DB % 4;
      if (i-- > 0) {
          if (j < context.DB && (p = this[i] >> j) > 0) {
          /** @type {boolean} */
          ascending = true;
          result = encode(p);
          }
          for (; i >= 0;) {
          if (j < 4) {
              /** @type {number} */
              p = (this[i] & (1 << j) - 1) << 4 - j;
              /** @type {number} */
              p = p | this[--i] >> (j = j + (context.DB - 4));
          } else {
              /** @type {number} */
              p = this[i] >> (j = j - 4) & 15;
              if (j <= 0) {
              j = j + context.DB;
              --i;
              }
          }
          if (p > 0) {
              /** @type {boolean} */
              ascending = true;
          }
          if (ascending) {
              result = result + encode(p);
          }
          }
      }
      return ascending ? result : "0";
      }, BigInteger.prototype.abs = function() {
      return this.s < 0 ? this.negate() : this;
      }, BigInteger.prototype.compareTo = function(a) {
      /** @type {number} */
      var r = this.s - a.s;
      if (0 != r) {
          return r;
      }
      var i = this.t;
      if (0 != (r = i - a.t)) {
          return this.s < 0 ? -r : r;
      }
      for (; --i >= 0;) {
          if (0 != (r = this[i] - a[i])) {
          return r;
          }
      }
      return 0;
      }, BigInteger.prototype.bitLength = function() {
      return this.t <= 0 ? 0 : context.DB * (this.t - 1) + isFunction(this[this.t - 1] ^ this.s & context.DM);
      }, BigInteger.prototype.modPowInt = function(val, data) {
      var t;
      if (t = val < 256 || 0 == (data.t > 0 ? 1 & data[0] : data.s) ? new YM(data) : new RtmpChunk(data), val > 4294967295 || val < 1) {
          return BigInteger.ONE;
      }
      var r = BigInteger.null();
      var x = BigInteger.null();
      var pt = t.convert(this);
      /** @type {number} */
      var bit = isFunction(val) - 1;
      pt.copyTo(r);
      for (; --bit >= 0;) {
          var m = r.abs();
          /** @type {number} */
          var i = x.t = 2 * m.t;
          for (; --i >= 0;) {
          /** @type {number} */
          x[i] = 0;
          }
          /** @type {number} */
          i = 0;
          for (; i < m.t - 1; ++i) {
          var h = context.am(m, i, m[i], x, 2 * i, 0, 1);
          if ((x[i + m.t] += context.am(m, i + 1, 2 * m[i], x, 2 * i + 1, h, m.t - i - 1)) >= context.DV) {
              x[i + m.t] -= context.DV;
              /** @type {number} */
              x[i + m.t + 1] = 1;
          }
          }
          if (x.t > 0 && (x[x.t - 1] += context.am(m, i, m[i], x, 2 * i, 0, 1)), x.s = 0, x.clamp(), t.reduce(x), (val & 1 << bit) > 0) {
          x.multiplyTo(pt, r);
          t.reduce(r);
          } else {
          var i = r;
          r = x;
          x = i;
          }
      }
      return t.revert(r);
      }, BigInteger.prototype.copyTo = function(r) {
      /** @type {number} */
      var i = this.t - 1;
      for (; i >= 0; --i) {
          r[i] = this[i];
      }
      r.t = this.t;
      r.s = this.s;
      }, BigInteger.prototype.clamp = function() {
      /** @type {number} */
      var c = this.s & context.DM;
      for (; this.t > 0 && this[this.t - 1] == c;) {
          --this.t;
      }
      }, BigInteger.prototype.dlShiftTo = function(n, r) {
      var i;
      /** @type {number} */
      i = this.t - 1;
      for (; i >= 0; --i) {
          r[i + n] = this[i];
      }
      /** @type {number} */
      i = n - 1;
      for (; i >= 0; --i) {
          /** @type {number} */
          r[i] = 0;
      }
      r.t = this.t + n;
      r.s = this.s;
      }, BigInteger.prototype.drShiftTo = function(n, r) {
      var i = n;
      for (; i < this.t; ++i) {
          r[i - n] = this[i];
      }
      /** @type {number} */
      r.t = Math.max(this.t - n, 0);
      r.s = this.s;
      }, BigInteger.prototype.subTo = function(a, r) {
      /** @type {number} */
      var i = 0;
      /** @type {number} */
      var c = 0;
      /** @type {number} */
      var m = Math.min(a.t, this.t);
      for (; i < m;) {
          /** @type {number} */
          c = c + (this[i] - a[i]);
          /** @type {number} */
          r[i++] = c & context.DM;
          /** @type {number} */
          c = c >> context.DB;
      }
      if (a.t < this.t) {
          /** @type {number} */
          c = c - a.s;
          for (; i < this.t;) {
          c = c + this[i];
          /** @type {number} */
          r[i++] = c & context.DM;
          /** @type {number} */
          c = c >> context.DB;
          }
          c = c + this.s;
      } else {
          c = c + this.s;
          for (; i < a.t;) {
          /** @type {number} */
          c = c - a[i];
          /** @type {number} */
          r[i++] = c & context.DM;
          /** @type {number} */
          c = c >> context.DB;
          }
          /** @type {number} */
          c = c - a.s;
      }
      /** @type {number} */
      r.s = c < 0 ? -1 : 0;
      if (c < -1) {
          r[i++] = context.DV + c;
      } else {
          if (c > 0) {
          r[i++] = c;
          }
      }
      /** @type {number} */
      r.t = i;
      r.clamp();
      }, BigInteger.prototype.multiplyTo = function(a, data) {
      var r = this.abs();
      var line = a.abs();
      var i = r.t;
      data.t = i + line.t;
      for (; --i >= 0;) {
          /** @type {number} */
          data[i] = 0;
      }
      /** @type {number} */
      i = 0;
      for (; i < line.t; ++i) {
          data[i + r.t] = context.am(r, 0, line[i], data, i, 0, r.t);
      }
      /** @type {number} */
      data.s = 0;
      data.clamp();
      if (this.s != a.s) {
          data.negateTo(data);
      }
      }, BigInteger.prototype.divRemTo = function(_, value) {
      var pm = _.abs();
      if (!(pm.t <= 0)) {
          var pt = this.abs();
          if (pt.t < pm.t) {
          if (null != value) {
              this.copyTo(value);
          }
          } else {
          var r = null == value ? BigInteger.null() : value;
          var y = BigInteger.null();
          var s = this.s;
          /** @type {number} */
          var pos = context.DB - isFunction(pm[pm.t - 1]);
          if (pos > 0) {
              pm.lShiftTo(pos, y);
              pt.lShiftTo(pos, r);
          } else {
              pm.copyTo(y);
              pt.copyTo(r);
          }
          var ys = y.t;
          var y0 = y[ys - 1];
          if (0 != y0) {
              /** @type {number} */
              var arcsizessum = y0 * (1 << context.F1) + (ys > 1 ? y[ys - 2] >> context.F2 : 0);
              /** @type {number} */
              var ringunitsize = context.FV / arcsizessum;
              /** @type {number} */
              var item_count = (1 << context.F1) / arcsizessum;
              /** @type {number} */
              var frame_margin = 1 << context.F2;
              var i = r.t;
              /** @type {number} */
              var j = i - ys;
              var t = BigInteger.null();
              y.dlShiftTo(j, t);
              if (r.compareTo(t) >= 0) {
              /** @type {number} */
              r[r.t++] = 1;
              r.subTo(t, r);
              }
              BigInteger.ONE.dlShiftTo(ys, t);
              t.subTo(y, y);
              for (; y.t < ys;) {
              /** @type {number} */
              y[y.t++] = 0;
              }
              for (; --j >= 0;) {
              /** @type {number} */
              var x = r[--i] == y0 ? context.DM : Math.floor(r[i] * ringunitsize + (r[i - 1] + frame_margin) * item_count);
              if ((r[i] += context.am(y, 0, x, r, j, 0, ys)) < x) {
                  y.dlShiftTo(j, t);
                  r.subTo(t, r);
                  for (; r[i] < --x;) {
                  r.subTo(t, r);
                  }
              }
              }
              if (r.t = ys, r.clamp(), pos > 0) {
              r.s = this.s;
              /** @type {number} */
              var ds = Math.floor(pos / context.DB);
              if (ds >= this.t) {
                  return void(r.t = 0);
              }
              /** @type {number} */
              var bs = pos % context.DB;
              /** @type {number} */
              var cbs = context.DB - bs;
              /** @type {number} */
              var bm = (1 << bs) - 1;
              /** @type {number} */
              r[0] = this[ds] >> bs;
              /** @type {number} */
              var i = ds + 1;
              for (; i < this.t; ++i) {
                  r[i - ds - 1] |= (this[i] & bm) << cbs;
                  /** @type {number} */
                  r[i - ds] = this[i] >> bs;
              }
              if (bs > 0) {
                  r[this.t - ds - 1] |= (this.s & bm) << cbs;
              }
              /** @type {number} */
              r.t = this.t - ds;
              r.clamp();
              }
              if (s < 0) {
              r.negateTo(r);
              }
          }
          }
      }
      }, BigInteger.prototype.negateTo = function(r) {
      BigInteger.ZERO.subTo(this, r);
      }, BigInteger.prototype.negate = function() {
      var e = BigInteger.null();
      return this.negateTo(e), e;
      }, BigInteger.prototype.lShiftTo = function(pos, r) {
      /** @type {number} */
      var bs = pos % context.DB;
      /** @type {number} */
      var cbs = context.DB - bs;
      /** @type {number} */
      var bm = (1 << cbs) - 1;
      /** @type {number} */
      var ds = Math.floor(pos / context.DB);
      /** @type {number} */
      var c = this.s << bs & context.DM;
      /** @type {number} */
      var i = this.t - 1;
      for (; i >= 0; --i) {
          /** @type {number} */
          r[i + ds + 1] = this[i] >> cbs | c;
          /** @type {number} */
          c = (this[i] & bm) << bs;
      }
      /** @type {number} */
      i = ds - 1;
      for (; i >= 0; --i) {
          /** @type {number} */
          r[i] = 0;
      }
      /** @type {number} */
      r[ds] = c;
      r.t = this.t + ds + 1;
      r.s = this.s;
      r.clamp();
      }, BigInteger.ONE = BigInteger.one(), BigInteger.ZERO = new BigInteger(0, 0), BigInteger;
  }();
  
  var context = ($$t_5 = function() {
      var letterDesignator;
      var DB;
      /** @type {string} */
      var n = "Netscape"
      return null != n && "Microsoft Internet Explorer" == n ? (letterDesignator = C, DB = 30) : null != n && "Netscape" != n ? (letterDesignator = S, DB = 26) : (letterDesignator = E, DB = 28), {
      am : letterDesignator,
      DB : DB
      };
  }(), hostCoercionType = $$t_5.am, {
      DB : ref$ = $$t_5.DB,
      DM : (1 << ref$) - 1,
      DV : 1 << ref$,
      F1 : 52 - ref$,
      F2 : 2 * ref$ - 52,
      FV : Math.pow(2, 52),
      am : hostCoercionType
  });
  
  var $ = function(q, x) {
      var n = q.charCodeAt(x);
      return n < 48 ? -1 : n < 58 ? n - 48 : n < 65 ? -1 : (n > 96 && (n = n - 32), n > 90 ? -1 : n - 55);
  };
  
  function E(d, n, val, r, i, e, arg) {
      /** @type {number} */
      var s = 16383 & val;
      /** @type {number} */
      var w = val >> 14;
      for (; --arg >= 0;) {
      /** @type {number} */
      var t = 16383 & d[n];
      /** @type {number} */
      var z = d[n++] >> 14;
      /** @type {number} */
      var f = w * t + z * s;
      /** @type {number} */
      e = ((t = s * t + ((16383 & f) << 14) + r[i] + e) >> 28) + (f >> 14) + w * z;
      /** @type {number} */
      r[i++] = 268435455 & t;
      }
      return e;
  }
  
  var isFunction = function(o) {
      var actualval;
      /** @type {number} */
      var s = 1;
      return 0 != (actualval = o >>> 16) && (o = actualval, s = s + 16), 0 != (actualval = o >> 8) && (o = actualval, s = s + 8), 0 != (actualval = o >> 4) && (o = actualval, s = s + 4), 0 != (actualval = o >> 2) && (o = actualval, s = s + 2), o >> 1 != 0 && (s = s + 1), s;
  };
  
  var directory_epub = function() {
      /**
       * @param {?} gotoEnd
       * @return {undefined}
       */
      function t(gotoEnd) {
      this.crypto = gotoEnd;
      }
      return t.create = function() {
      return new t(crypto);
      }, t.prototype.nextBytes = function(b) {
      /** @type {!Uint32Array} */
      var array = crypto.randomBytes(b.length).toJSON().data;
      /** @type {number} */
      var i = 0;
      for (; i < b.length; i++) {
          /** @type {number} */
          b[i] = 255 & array[i];
      }
      }, t;
  }();
  
  var RtmpChunk = function() {
      /**
       * @param {!Array} m
       * @return {undefined}
       */
      function Montgomery(m) {
      /** @type {!Array} */
      this.m = m;
      this.mp = bnpInvDigit(m);
      /** @type {number} */
      this.mpl = 32767 & this.mp;
      /** @type {number} */
      this.mph = this.mp >> 15;
      /** @type {number} */
      this.um = (1 << context.DB - 15) - 1;
      /** @type {number} */
      this.mt2 = 2 * m.t;
      }
      return Montgomery.prototype.convert = function(val) {
      var r = x.null();
      return val.abs().dlShiftTo(this.m.t, r), r.divRemTo(this.m, r), callback(this.m, val, r);
      }, Montgomery.prototype.revert = function(path) {
      var r = x.null();
      return path.copyTo(r), this.reduce(r), r;
      }, Montgomery.prototype.reduce = function(x) {
      for (; x.t <= this.mt2;) {
          /** @type {number} */
          x[x.t++] = 0;
      }
      /** @type {number} */
      var i = 0;
      for (; i < this.m.t; ++i) {
          /** @type {number} */
          var j = 32767 & x[i];
          /** @type {number} */
          var r = j * this.mpl + ((j * this.mph + (x[i] >> 15) * this.mpl & this.um) << 15) & context.DM;
          x[j = i + this.m.t] += context.am(this.m, 0, r, x, i, 0, this.m.t);
          for (; x[j] >= context.DV;) {
          x[j] -= context.DV;
          x[++j]++;
          }
      }
      x.clamp();
      x.drShiftTo(this.m.t, x);
      if (x.compareTo(this.m) >= 0) {
          x.subTo(this.m, x);
      }
      }, Montgomery;
  }();
  
  var bnpInvDigit = function(t) {
      if (t.t < 1) {
      return 0;
      }
      var val = t[0];
      if (0 == (1 & val)) {
      return 0;
      }
      /** @type {number} */
      var level = 3 & val;
      return (level = (level = (level = (level = level * (2 - (15 & val) * level) & 15) * (2 - (255 & val) * level) & 255) * (2 - ((65535 & val) * level & 65535)) & 65535) * (2 - val * level % context.DV) % context.DV) > 0 ? context.DV - level : -level;
  };
  
  var callback = function(t, result, r) {
      return result.s < 0 && r.compareTo(x.ZERO) > 0 && t.subTo(r, r), r;
  };
  
  var encode = function(pos) {
      return "0123456789abcdefghijklmnopqrstuvwxyz".charAt(pos);
  };

module.exports = encryptData;