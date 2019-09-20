const MD5 = require('crypto-js/md5');
const Hmac256 = require('crypto-js/hmac-sha256');

module.exports = class Utils {
  /** 
  * 校验Body数据
  * @return true 校验通过 false校验不通过
  */
  static checkBodyData(params, keys) {
    if (!params) {
      return false;
    }

    if (typeof params === 'object') {
      // let _list = Object.keys(params);
      let check_err = false;
      keys.some((item, index) => {
        if (!params[item] || JSON.stringify(params[item]) === '{}' || JSON.stringify(params[item]) === '[]') {
          check_err = true;
          return true;
        }
      })
      if (check_err) return false;
    }

    return true;

  }
  // 处理Promise数据
  static awaitWrap(promise) {
    return promise.then(data => [null, data])
      .catch(err => [err, null])
  }
  static HmacFn(str, timer) {
    let dateStr = '' + timer;
    return MD5(Hmac256(str, dateStr).toString()).toString();
  }
  /**
  * 时间戳转换日期
  * @param {Number} unixTime    待时间戳(毫秒)
  * @param {Number}  timeZone   时区
  */
  static UnixToDate(unixTime, timeZone) {
    let _second = parseInt(unixTime / 1000);
    if (typeof (timeZone) == 'number') {
      _second = parseInt(_second) + parseInt(timeZone) * 60 * 60;
    }
    let time = new Date(_second * 1000);
    let ymdhis = "";
    ymdhis += time.getUTCFullYear() + "-";
    ymdhis += ((time.getUTCMonth() + 1) < 10 ? '0' + (time.getUTCMonth() + 1) : (time.getUTCMonth() + 1)) + "-";
    ymdhis += time.getUTCDate() < 10 ? '0' + time.getUTCDate() : time.getUTCDate();
    ymdhis += " " + (time.getUTCHours() < 10 ? '0' + time.getUTCHours() : time.getUTCHours()) + ":";
    ymdhis += (time.getUTCMinutes() < 10 ? '0' + time.getUTCMinutes() : time.getUTCMinutes());
    // ymdhis += time.getUTCSeconds() < 10 ? '0' + time.getUTCSeconds() : time.getUTCSeconds();
    return ymdhis;
  }
}