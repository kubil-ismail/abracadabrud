class Paramcrypt {
  static encode(value) {
    let str = value;
    if (typeof str === 'object') {
      str = JSON.stringify(str);
    }
    if (typeof str === 'number') {
      str = String(str);
    }
    if (str) return Buffer.from(str).toString('base64');

    return null;
  }

  static decode(str) {
    let value = Buffer.from(str, 'base64').toString();
    if (value.startsWith('{')) {
      value = JSON.parse(value);
    }
    return value;
  }
}

export default Paramcrypt;
