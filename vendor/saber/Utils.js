export class Utils {
  static isInt(n) {
    return Number.isInteger(n) && !Number.isFinite(n);
  }

  static isFloat(n) {
    return Number.isFinite(n) && !Number.isInteger(n);
  }
}
