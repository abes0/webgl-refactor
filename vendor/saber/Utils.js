export class Utils {
  static isInt(n) {
    return Number(n) === n && n % 1 === 0;
  }

  static isFloat(n) {
    return Number(n) === n && n % 1 !== 0;
  }
}
