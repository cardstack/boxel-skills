// @cardstack/bxl — realm bundle (ESM)
// Built: 2026-05-15T06:24:25.941Z
// Source: /path/to/bxl
// Regenerate: cd /path/to/bxl && npm run realm

import {
  EXCEL_ERROR,
  flattenExcelArgs,
  parseExcelNumber,
  parseExcelNumberArray,
  parseExcelString,
  throwExcelError
} from "./chunk-URZ4NIDM.ts";
import {
  wrapBareNativeFilters
} from "./chunk-XN3U6IBU.ts";

// src/formulajs/engineering.ts
var MAX_BITWISE = 281474976710655n;
var DEC2BIN_MIN = -512;
var DEC2BIN_MAX = 511;
var DEC2HEX_MIN = -549755813888;
var DEC2HEX_MAX = 549755813887;
var DEC2OCT_MIN = -536870912;
var DEC2OCT_MAX = 536870911;
function parseEngineeringInteger(value) {
  const number = parseExcelNumber(value);
  if (!Number.isInteger(number)) {
    throwExcelError(EXCEL_ERROR.num);
  }
  return number;
}
function parsePlaces(placesLike) {
  if (placesLike === void 0) {
    return void 0;
  }
  const places = parseExcelNumber(placesLike);
  if (Number.isNaN(places)) {
    throwExcelError(EXCEL_ERROR.value);
  }
  if (places < 0) {
    throwExcelError(EXCEL_ERROR.num);
  }
  return Math.floor(places);
}
function padResult(result, placesLike) {
  const places = parsePlaces(placesLike);
  if (places === void 0) {
    return result;
  }
  if (places < result.length) {
    throwExcelError(EXCEL_ERROR.num);
  }
  return `${"0".repeat(places - result.length)}${result}`;
}
function parseBitwiseOperand(value) {
  const number = parseEngineeringInteger(value);
  if (number < 0 || BigInt(number) > MAX_BITWISE) {
    throwExcelError(EXCEL_ERROR.num);
  }
  return BigInt(number);
}
function ensureMatches(value, pattern) {
  if (!pattern.test(value)) {
    throwExcelError(EXCEL_ERROR.num);
  }
}
function parseComplex(value) {
  if (value === void 0 || value === true || value === false) {
    throwExcelError(EXCEL_ERROR.value);
  }
  if (value === 0 || value === "0") {
    return { real: 0, imaginary: 0, unit: "i" };
  }
  const raw = String(value);
  const last = raw.slice(-1);
  if (last !== "i" && last !== "j") {
    const real = Number(raw);
    if (Number.isNaN(real)) {
      throwExcelError(EXCEL_ERROR.num);
    }
    return { real, imaginary: 0, unit: "i" };
  }
  const unit = last;
  const body = raw.slice(0, -1);
  if (body === "" || body === "+") {
    return { real: 0, imaginary: 1, unit };
  }
  if (body === "-") {
    return { real: 0, imaginary: -1, unit };
  }
  let splitIndex = -1;
  for (let index = 1; index < body.length; index++) {
    const char = body[index];
    if (char === "+" || char === "-") {
      splitIndex = index;
    }
  }
  if (splitIndex === -1) {
    const imaginary2 = Number(body);
    if (Number.isNaN(imaginary2)) {
      throwExcelError(EXCEL_ERROR.num);
    }
    return { real: 0, imaginary: imaginary2, unit };
  }
  const realPart = Number(body.slice(0, splitIndex));
  const imaginaryPart = body.slice(splitIndex);
  const imaginary = imaginaryPart === "+" ? 1 : imaginaryPart === "-" ? -1 : Number(imaginaryPart);
  if (Number.isNaN(realPart) || Number.isNaN(imaginary)) {
    throwExcelError(EXCEL_ERROR.num);
  }
  return { real: realPart, imaginary, unit };
}
function formatComplex(real, imaginary, unit) {
  if (real === 0 && imaginary === 0) {
    return 0;
  }
  if (real === 0) {
    return imaginary === 1 ? unit : `${imaginary}${unit}`;
  }
  if (imaginary === 0) {
    return String(real);
  }
  const sign = imaginary > 0 ? "+" : "";
  return `${real}${sign}${imaginary === 1 ? unit : `${imaginary}${unit}`}`;
}
function excelBitAnd(leftLike, rightLike) {
  return Number(parseBitwiseOperand(leftLike) & parseBitwiseOperand(rightLike));
}
function excelBitOr(leftLike, rightLike) {
  return Number(parseBitwiseOperand(leftLike) | parseBitwiseOperand(rightLike));
}
function excelBitXor(leftLike, rightLike) {
  return Number(parseBitwiseOperand(leftLike) ^ parseBitwiseOperand(rightLike));
}
function excelBitLShift(numberLike, shiftLike) {
  const number = parseBitwiseOperand(numberLike);
  const shift = parseEngineeringInteger(shiftLike);
  if (Math.abs(shift) > 53) {
    throwExcelError(EXCEL_ERROR.num);
  }
  return Number(shift >= 0 ? number << BigInt(shift) : number >> BigInt(-shift));
}
function excelBitRShift(numberLike, shiftLike) {
  const number = parseBitwiseOperand(numberLike);
  const shift = parseEngineeringInteger(shiftLike);
  if (Math.abs(shift) > 53) {
    throwExcelError(EXCEL_ERROR.num);
  }
  return Number(shift >= 0 ? number >> BigInt(shift) : number << BigInt(-shift));
}
function excelBin2Dec(numberLike) {
  const number = parseExcelString(numberLike);
  ensureMatches(number, /^[01]{1,10}$/);
  if (number.length === 10 && number.startsWith("1")) {
    return parseInt(number.slice(1), 2) - 512;
  }
  return parseInt(number, 2);
}
function excelBin2Hex(numberLike, placesLike) {
  const number = parseExcelString(numberLike);
  ensureMatches(number, /^[01]{1,10}$/);
  if (number.length === 10 && number.startsWith("1")) {
    return (1099511627264 + parseInt(number.slice(1), 2)).toString(16);
  }
  return padResult(parseInt(number, 2).toString(16), placesLike);
}
function excelBin2Oct(numberLike, placesLike) {
  const number = parseExcelString(numberLike);
  ensureMatches(number, /^[01]{1,10}$/);
  if (number.length === 10 && number.startsWith("1")) {
    return (1073741312 + parseInt(number.slice(1), 2)).toString(8);
  }
  return padResult(parseInt(number, 2).toString(8), placesLike);
}
function excelDec2Bin(numberLike, placesLike) {
  const number = parseEngineeringInteger(numberLike);
  if (!/^-?[0-9]{1,3}$/.test(String(number)) || number < DEC2BIN_MIN || number > DEC2BIN_MAX) {
    throwExcelError(EXCEL_ERROR.num);
  }
  if (number < 0) {
    return `1${"0".repeat(9 - (512 + number).toString(2).length)}${(512 + number).toString(2)}`;
  }
  return padResult(number.toString(2), placesLike);
}
function excelDec2Hex(numberLike, placesLike) {
  const number = parseEngineeringInteger(numberLike);
  if (!/^-?[0-9]{1,12}$/.test(String(number)) || number < DEC2HEX_MIN || number > DEC2HEX_MAX) {
    throwExcelError(EXCEL_ERROR.num);
  }
  if (number < 0) {
    return (1099511627776 + number).toString(16);
  }
  return padResult(number.toString(16), placesLike);
}
function excelDec2Oct(numberLike, placesLike) {
  const number = parseEngineeringInteger(numberLike);
  if (!/^-?[0-9]{1,9}$/.test(String(number)) || number < DEC2OCT_MIN || number > DEC2OCT_MAX) {
    throwExcelError(EXCEL_ERROR.num);
  }
  if (number < 0) {
    return (1073741824 + number).toString(8);
  }
  return padResult(number.toString(8), placesLike);
}
function excelHex2Bin(numberLike, placesLike) {
  const number = parseExcelString(numberLike);
  ensureMatches(number, /^[0-9A-Fa-f]{1,10}$/);
  const negative = number.length === 10 && number[0].toLowerCase() === "f";
  const decimal = negative ? parseInt(number, 16) - 1099511627776 : parseInt(number, 16);
  if (decimal < DEC2BIN_MIN || decimal > DEC2BIN_MAX) {
    throwExcelError(EXCEL_ERROR.num);
  }
  if (negative) {
    return `1${"0".repeat(9 - (512 + decimal).toString(2).length)}${(512 + decimal).toString(2)}`;
  }
  return padResult(decimal.toString(2), placesLike);
}
function excelHex2Dec(numberLike) {
  const number = parseExcelString(numberLike);
  ensureMatches(number, /^[0-9A-Fa-f]{1,10}$/);
  const decimal = parseInt(number, 16);
  return decimal >= 549755813888 ? decimal - 1099511627776 : decimal;
}
function excelHex2Oct(numberLike, placesLike) {
  const number = parseExcelString(numberLike);
  ensureMatches(number, /^[0-9A-Fa-f]{1,10}$/);
  const decimal = parseInt(number, 16);
  if (decimal > 536870911 && decimal < 1098974756864) {
    throwExcelError(EXCEL_ERROR.num);
  }
  if (decimal >= 1098974756864) {
    return (decimal - 1098437885952).toString(8);
  }
  return padResult(decimal.toString(8), placesLike);
}
function excelOct2Bin(numberLike, placesLike) {
  const number = parseExcelString(numberLike);
  ensureMatches(number, /^[0-7]{1,10}$/);
  const negative = number.length === 10 && number.startsWith("7");
  const decimal = negative ? parseInt(number, 8) - 1073741824 : parseInt(number, 8);
  if (decimal < DEC2BIN_MIN || decimal > DEC2BIN_MAX) {
    throwExcelError(EXCEL_ERROR.num);
  }
  if (negative) {
    return `1${"0".repeat(9 - (512 + decimal).toString(2).length)}${(512 + decimal).toString(2)}`;
  }
  return padResult(decimal.toString(2), placesLike);
}
function excelOct2Dec(numberLike) {
  const number = parseExcelString(numberLike);
  ensureMatches(number, /^[0-7]{1,10}$/);
  const decimal = parseInt(number, 8);
  return decimal >= 536870912 ? decimal - 1073741824 : decimal;
}
function excelOct2Hex(numberLike, placesLike) {
  const number = parseExcelString(numberLike);
  ensureMatches(number, /^[0-7]{1,10}$/);
  const decimal = parseInt(number, 8);
  if (decimal >= 536870912) {
    return `ff${(decimal + 3221225472).toString(16)}`;
  }
  return padResult(decimal.toString(16), placesLike);
}
function excelDelta(leftLike, rightLike = 0) {
  return parseExcelNumber(leftLike) === parseExcelNumber(rightLike) ? 1 : 0;
}
function excelGestep(numberLike, stepLike = 0) {
  return parseExcelNumber(numberLike) >= parseExcelNumber(stepLike) ? 1 : 0;
}
function excelBase(numberLike, radixLike, minLengthLike = 0) {
  const number = parseExcelNumber(numberLike);
  const radix = parseExcelNumber(radixLike);
  const minLength = parseExcelNumber(minLengthLike);
  if (radix === 0) {
    throwExcelError(EXCEL_ERROR.num);
  }
  const result = number.toString(radix);
  return `${"0".repeat(Math.max(minLength - result.length, 0))}${result}`;
}
function excelDecimal(textLike, radixLike) {
  const text = parseExcelString(textLike) || "0";
  const radix = parseExcelNumber(radixLike);
  if (radix === 0) {
    throwExcelError(EXCEL_ERROR.num);
  }
  const result = parseInt(text, radix);
  if (Number.isNaN(result)) {
    throwExcelError(EXCEL_ERROR.num);
  }
  return result;
}
function excelComplex(realLike, imaginaryLike, unitLike = "i") {
  const real = parseExcelNumber(realLike);
  const imaginary = parseExcelNumber(imaginaryLike);
  const unitText = unitLike === void 0 ? "i" : parseExcelString(unitLike);
  if (unitText !== "i" && unitText !== "j") {
    throwExcelError(EXCEL_ERROR.value);
  }
  return formatComplex(real, imaginary, unitText);
}
function excelImReal(valueLike) {
  return parseComplex(valueLike).real;
}
function excelImImaginary(valueLike) {
  return parseComplex(valueLike).imaginary;
}
function excelImAbs(valueLike) {
  const value = parseComplex(valueLike);
  return Math.sqrt(value.real ** 2 + value.imaginary ** 2);
}
function excelImConjugate(valueLike) {
  const value = parseComplex(valueLike);
  return formatComplex(value.real, -value.imaginary, value.unit);
}
function excelImSub(leftLike, rightLike) {
  const left = parseComplex(leftLike);
  const right = parseComplex(rightLike);
  const unit = left.unit === "j" || right.unit === "j" ? "j" : "i";
  return formatComplex(left.real - right.real, left.imaginary - right.imaginary, unit);
}
function excelImSum(valuesLike) {
  const values = flattenExcelArgs(valuesLike);
  if (values.length === 0) {
    throwExcelError(EXCEL_ERROR.value);
  }
  let real = 0;
  let imaginary = 0;
  let unit = "i";
  for (const valueLike of values) {
    const value = parseComplex(valueLike);
    if (value.unit === "j") {
      unit = "j";
    }
    real += value.real;
    imaginary += value.imaginary;
  }
  return formatComplex(real, imaginary, unit);
}
function excelImCos(valueLike) {
  const z = parseComplex(valueLike);
  return formatComplex(
    Math.cos(z.real) * Math.cosh(z.imaginary),
    -Math.sin(z.real) * Math.sinh(z.imaginary),
    z.unit
  );
}
function excelImSin(valueLike) {
  const z = parseComplex(valueLike);
  return formatComplex(
    Math.sin(z.real) * Math.cosh(z.imaginary),
    Math.cos(z.real) * Math.sinh(z.imaginary),
    z.unit
  );
}
function excelImTan(valueLike) {
  const z = parseComplex(valueLike);
  const d = Math.cos(2 * z.real) + Math.cosh(2 * z.imaginary);
  if (d === 0)
    throwExcelError(EXCEL_ERROR.num);
  return formatComplex(
    Math.sin(2 * z.real) / d,
    Math.sinh(2 * z.imaginary) / d,
    z.unit
  );
}
function excelImCot(valueLike) {
  return excelImDiv(excelImCos(valueLike), excelImSin(valueLike));
}
function excelImCsc(valueLike) {
  return excelImDiv(1, excelImSin(valueLike));
}
function excelImSec(valueLike) {
  return excelImDiv(1, excelImCos(valueLike));
}
function excelImCosh(valueLike) {
  const z = parseComplex(valueLike);
  return formatComplex(
    Math.cosh(z.real) * Math.cos(z.imaginary),
    Math.sinh(z.real) * Math.sin(z.imaginary),
    z.unit
  );
}
function excelImSinh(valueLike) {
  const z = parseComplex(valueLike);
  return formatComplex(
    Math.sinh(z.real) * Math.cos(z.imaginary),
    Math.cosh(z.real) * Math.sin(z.imaginary),
    z.unit
  );
}
function excelImCsch(valueLike) {
  return excelImDiv(1, excelImSinh(valueLike));
}
function excelImSech(valueLike) {
  return excelImDiv(1, excelImCosh(valueLike));
}
function excelImExp(valueLike) {
  const z = parseComplex(valueLike);
  const ea = Math.exp(z.real);
  return formatComplex(
    ea * Math.cos(z.imaginary),
    ea * Math.sin(z.imaginary),
    z.unit
  );
}
function excelImLn(valueLike) {
  const z = parseComplex(valueLike);
  const r = Math.sqrt(z.real ** 2 + z.imaginary ** 2);
  if (r === 0)
    throwExcelError(EXCEL_ERROR.num);
  return formatComplex(Math.log(r), Math.atan2(z.imaginary, z.real), z.unit);
}
function excelImLog10(valueLike) {
  const z = parseComplex(valueLike);
  const r = Math.sqrt(z.real ** 2 + z.imaginary ** 2);
  if (r === 0)
    throwExcelError(EXCEL_ERROR.num);
  const ln10 = Math.log(10);
  return formatComplex(Math.log(r) / ln10, Math.atan2(z.imaginary, z.real) / ln10, z.unit);
}
function excelImLog2(valueLike) {
  const z = parseComplex(valueLike);
  const r = Math.sqrt(z.real ** 2 + z.imaginary ** 2);
  if (r === 0)
    throwExcelError(EXCEL_ERROR.num);
  const ln2 = Math.log(2);
  return formatComplex(Math.log(r) / ln2, Math.atan2(z.imaginary, z.real) / ln2, z.unit);
}
function excelImDiv(leftLike, rightLike) {
  const a = parseComplex(leftLike);
  const b = parseComplex(rightLike);
  const denom = b.real ** 2 + b.imaginary ** 2;
  if (denom === 0)
    throwExcelError(EXCEL_ERROR.num);
  const unit = a.unit === "j" || b.unit === "j" ? "j" : "i";
  return formatComplex(
    (a.real * b.real + a.imaginary * b.imaginary) / denom,
    (a.imaginary * b.real - a.real * b.imaginary) / denom,
    unit
  );
}
function excelImProduct(valuesLike) {
  const values = flattenExcelArgs(valuesLike);
  if (values.length === 0)
    throwExcelError(EXCEL_ERROR.value);
  let real = 1;
  let imaginary = 0;
  let unit = "i";
  for (const valueLike of values) {
    const z = parseComplex(valueLike);
    if (z.unit === "j")
      unit = "j";
    const newReal = real * z.real - imaginary * z.imaginary;
    const newImag = real * z.imaginary + imaginary * z.real;
    real = newReal;
    imaginary = newImag;
  }
  return formatComplex(real, imaginary, unit);
}
function excelImPower(valueLike, powerLike) {
  const z = parseComplex(valueLike);
  const n = parseExcelNumber(powerLike);
  const r = Math.sqrt(z.real ** 2 + z.imaginary ** 2);
  const theta = Math.atan2(z.imaginary, z.real);
  const rn = Math.pow(r, n);
  return formatComplex(rn * Math.cos(n * theta), rn * Math.sin(n * theta), z.unit);
}
function excelImSqrt(valueLike) {
  const z = parseComplex(valueLike);
  const r = Math.sqrt(z.real ** 2 + z.imaginary ** 2);
  const theta = Math.atan2(z.imaginary, z.real);
  return formatComplex(
    Math.sqrt(r) * Math.cos(theta / 2),
    Math.sqrt(r) * Math.sin(theta / 2),
    z.unit
  );
}
function excelImArgument(valueLike) {
  const z = parseComplex(valueLike);
  if (z.real === 0 && z.imaginary === 0)
    throwExcelError(EXCEL_ERROR.div0);
  return Math.atan2(z.imaginary, z.real);
}
function excelErf(lowerLike, upperLike) {
  function erf1(x) {
    const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741;
    const a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
    const sign = x < 0 ? -1 : 1;
    const t = 1 / (1 + p * Math.abs(x));
    const y = 1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    return sign * y;
  }
  const lower = parseExcelNumber(lowerLike);
  if (upperLike !== void 0) {
    const upper = parseExcelNumber(upperLike);
    return erf1(upper) - erf1(lower);
  }
  return erf1(lower);
}
function excelErfc(valueLike) {
  return 1 - excelErf(valueLike);
}
var UNITS = [
  // Length (base: metre)
  ["m", null, "length", 1],
  ["mi", null, "length", 1609.344],
  ["Nmi", ["M"], "length", 1852],
  ["in", null, "length", 0.0254],
  ["ft", null, "length", 0.3048],
  ["yd", null, "length", 0.9144],
  ["ang", ["\xC5"], "length", 1e-10],
  ["ell", null, "length", 1.143],
  ["ly", null, "length", 9460730472580800],
  ["pc", ["parsec"], "length", 30856775814671900],
  ["Pica", ["Picapt"], "length", 0.00423333333333333],
  ["pica", null, "length", 35277777777778e-17],
  ["survey_mi", null, "length", 1609.347219],
  ["ua", null, "length", 149597870691667e-3],
  // Mass (base: kilogram)
  ["kg", null, "mass", 1],
  ["g", null, "mass", 1e-3],
  ["lbm", null, "mass", 0.45359237],
  ["ozm", null, "mass", 0.028349523125],
  ["stone", null, "mass", 6.35029318],
  ["ton", null, "mass", 907.18474],
  ["t", null, "mass", 1e3],
  ["sg", null, "mass", 14.59390294],
  ["grain", null, "mass", 647989e-10],
  ["cwt", ["shweight"], "mass", 45.359237],
  ["lcwt", ["uk_cwt", "hweight"], "mass", 50.802345],
  ["brton", ["uk_ton", "LTON"], "mass", 1016.046909],
  ["Da", ["u"], "mass", 166053886282828e-41],
  // Time (base: second)
  ["s", ["sec"], "time", 1],
  ["min", ["mn"], "time", 60],
  ["h", ["hr"], "time", 3600],
  ["d", ["day"], "time", 86400],
  ["yr", null, "time", 31557600],
  // Temperature (base: kelvin — special handling below)
  ["K", ["kel"], "temperature", 1],
  ["Rank", null, "temperature", 0.555555555555556],
  // Speed (base: m/s)
  ["m/s", ["m/sec"], "speed", 1],
  ["m/h", ["m/hr"], "speed", 27777777777778e-17],
  ["mph", null, "speed", 0.44704],
  ["kn", null, "speed", 0.514444444444444],
  ["admkn", null, "speed", 0.514773333],
  // Area (base: m²)
  ["m2", ["m^2"], "area", 1],
  ["ft2", ["ft^2"], "area", 0.09290304],
  ["in2", ["in^2"], "area", 64516e-8],
  ["yd2", ["yd^2"], "area", 0.83612736],
  ["mi2", ["mi^2"], "area", 2589988110336e-6],
  ["Nmi2", ["Nmi^2"], "area", 3429904],
  ["Pica2", ["Picapt2", "Pica^2", "Picapt^2"], "area", 1792111111111e-17],
  ["ang2", ["ang^2"], "area", 1e-20],
  ["ly2", ["ly^2"], "area", 895054210748189e17],
  ["ar", null, "area", 100],
  ["ha", null, "area", 1e4],
  ["uk_acre", null, "area", 4046.8564224],
  ["us_acre", null, "area", 4046.87261],
  ["Morgen", null, "area", 2500],
  // Volume (base: m³)
  ["m3", ["m^3"], "volume", 1],
  ["L", ["l", "lt"], "volume", 1e-3],
  ["ft3", ["ft^3"], "volume", 0.028316846592],
  ["in3", ["in^3"], "volume", 16387064e-12],
  ["yd3", ["yd^3"], "volume", 0.764554857984],
  ["mi3", ["mi^3"], "volume", 416818182544058e-5],
  ["Nmi3", ["Nmi^3"], "volume", 6352182208],
  ["Pica3", ["Picapt3", "Pica^3", "Picapt^3"], "volume", 758660370370369e-22],
  ["ang3", ["ang^3"], "volume", 1e-30],
  ["ly3", ["ly^3"], "volume", 846786664623715e-61],
  ["gal", null, "volume", 0.003785411784],
  ["qt", null, "volume", 946352946e-12],
  ["pt", ["us_pt"], "volume", 473176473e-12],
  ["cup", null, "volume", 2365882365e-13],
  ["oz", null, "volume", 295735295625e-16],
  ["tbs", null, "volume", 147868e-10],
  ["tsp", null, "volume", 492892e-11],
  ["tspm", null, "volume", 5e-6],
  ["uk_gal", null, "volume", 454609e-8],
  ["uk_qt", null, "volume", 0.0011365225],
  ["uk_pt", null, "volume", 56826125e-11],
  ["bushel", null, "volume", 0.03523907],
  ["barrel", null, "volume", 0.158987295],
  ["GRT", ["regton"], "volume", 2.8316846592],
  ["MTON", null, "volume", 1.13267386368],
  // Energy (base: joule)
  ["J", null, "energy", 1],
  ["cal", null, "energy", 4.1868],
  ["c", null, "energy", 4.184],
  ["eV", ["ev"], "energy", 160217656514141e-33],
  ["BTU", ["btu"], "energy", 1055.05585262],
  ["HPh", ["hh", "hph"], "energy", 2684519538e-3],
  ["Wh", ["wh"], "energy", 3600],
  ["flb", null, "energy", 1.3558179483314],
  ["erg", null, "energy", 1e-7],
  ["Eh", null, "energy", 435974417757576e-32],
  // Power (base: watt)
  ["W", null, "power", 1],
  ["HP", null, "power", 745.69987158227],
  ["PS", null, "power", 735.49875],
  // Force (base: newton)
  ["N", null, "force", 1],
  ["dyn", ["dy"], "force", 1e-5],
  ["lbf", null, "force", 4.4482216152605],
  ["pond", null, "force", 980665e-8],
  // Pressure (base: pascal)
  ["Pa", null, "pressure", 1],
  ["bar", null, "pressure", 1e5],
  ["mmHg", null, "pressure", 133.322],
  // Angle (base: radian)
  ["rad", null, "angle", 1],
  // degree symbol handled via alternate
  ["deg", ["\xB0"], "angle", 0.0174532925199433],
  // Frequency (base: hertz)
  ["Hz", null, "frequency", 1],
  // Electric current (base: ampere)
  ["A", null, "electric_current", 1],
  // Voltage (base: volt)
  ["V", null, "voltage", 1],
  // Information (base: bit — uses binary prefixes)
  ["bit", ["b"], "information", 1],
  ["byte", null, "information", 8],
  // Magnetic flux density
  ["T", null, "magnetic_flux_density", 1],
  ["G", ["ga"], "magnetic_flux_density", 1e-4]
];
var SI_PREFIXES = [
  ["Y", 1e24],
  ["Z", 1e21],
  ["E", 1e18],
  ["P", 1e15],
  ["T", 1e12],
  ["G", 1e9],
  ["M", 1e6],
  ["k", 1e3],
  ["h", 100],
  ["da", 10],
  ["e", 10],
  ["d", 0.1],
  ["c", 0.01],
  ["m", 1e-3],
  ["u", 1e-6],
  ["n", 1e-9],
  ["p", 1e-12],
  ["f", 1e-15],
  ["a", 1e-18],
  ["z", 1e-21],
  ["y", 1e-24]
];
var BINARY_PREFIXES = [
  ["Yi", 12089258196146292e8],
  ["Zi", 11805916207174113e5],
  ["Ei", 1152921504606847e3],
  ["Pi", 1125899906842624],
  ["Ti", 1099511627776],
  ["Gi", 1073741824],
  ["Mi", 1048576],
  ["ki", 1024]
];
function resolveUnit(unitStr) {
  for (const def of UNITS) {
    if (def[0] === unitStr)
      return { def, multiplier: 1 };
    if (def[1]) {
      for (const alt of def[1]) {
        if (alt === unitStr)
          return { def, multiplier: 1 };
      }
    }
  }
  if (unitStr.length > 2) {
    const bPrefix = unitStr.slice(0, 2);
    const bBase = unitStr.slice(2);
    for (const [abbr, mult] of BINARY_PREFIXES) {
      if (abbr === bPrefix) {
        for (const def of UNITS) {
          if (def[2] === "information" && (def[0] === bBase || def[1] && def[1].includes(bBase))) {
            return { def, multiplier: mult };
          }
        }
      }
    }
  }
  if (unitStr.length > 2 && unitStr.startsWith("da")) {
    const base = unitStr.slice(2);
    for (const def of UNITS) {
      if (def[0] === base || def[1] && def[1].includes(base)) {
        return { def, multiplier: 10 };
      }
    }
  }
  if (unitStr.length > 1) {
    const prefix = unitStr[0];
    const base = unitStr.slice(1);
    for (const [abbr, mult] of SI_PREFIXES) {
      if (abbr === prefix && abbr.length === 1) {
        for (const def of UNITS) {
          if (def[0] === base || def[1] && def[1].includes(base)) {
            return { def, multiplier: mult };
          }
        }
      }
    }
  }
  return null;
}
function convertTemperature(value, fromSym, toSym) {
  const from = fromSym === "kel" ? "K" : fromSym === "Rank" ? "Rank" : fromSym;
  const to = toSym === "kel" ? "K" : toSym === "Rank" ? "Rank" : toSym;
  const isCelsius = (s) => s === "C" || s === "cel";
  const isFahrenheit = (s) => s === "F" || s === "fah";
  let kelvin;
  if (from === "K")
    kelvin = value;
  else if (from === "Rank")
    kelvin = value * 5 / 9;
  else if (isCelsius(from))
    kelvin = value + 273.15;
  else if (isFahrenheit(from))
    kelvin = (value + 459.67) * 5 / 9;
  else
    return NaN;
  if (to === "K")
    return kelvin;
  if (to === "Rank")
    return kelvin * 9 / 5;
  if (isCelsius(to))
    return kelvin - 273.15;
  if (isFahrenheit(to))
    return kelvin * 9 / 5 - 459.67;
  return NaN;
}
function excelConvert(numberLike, fromUnit, toUnit) {
  const number = parseExcelNumber(numberLike);
  const fromStr = parseExcelString(fromUnit);
  const toStr = parseExcelString(toUnit);
  const tempUnits = ["K", "kel", "C", "cel", "F", "fah", "Rank"];
  const fromIsTemp = tempUnits.includes(fromStr);
  const toIsTemp = tempUnits.includes(toStr);
  if (fromIsTemp && toIsTemp) {
    return convertTemperature(number, fromStr, toStr);
  }
  if (fromIsTemp || toIsTemp) {
    throwExcelError(EXCEL_ERROR.na);
  }
  const from = resolveUnit(fromStr);
  const to = resolveUnit(toStr);
  if (!from || !to)
    throwExcelError(EXCEL_ERROR.na);
  if (from.def[2] !== to.def[2])
    throwExcelError(EXCEL_ERROR.na);
  return number * from.def[3] * from.multiplier / (to.def[3] * to.multiplier);
}

// src/bxl/bridge/formula-engineering-native.ts
var bareNativeFilters = {
  *"BASE/2"(_input, number, radix) {
    yield excelBase(number, radix);
  },
  *"BASE/3"(_input, number, radix, minLength) {
    yield excelBase(number, radix, minLength);
  },
  *"BIN2DEC/1"(_input, number) {
    yield excelBin2Dec(number);
  },
  *"BIN2HEX/1"(_input, number) {
    yield excelBin2Hex(number);
  },
  *"BIN2HEX/2"(_input, number, places) {
    yield excelBin2Hex(number, places);
  },
  *"BIN2OCT/1"(_input, number) {
    yield excelBin2Oct(number);
  },
  *"BIN2OCT/2"(_input, number, places) {
    yield excelBin2Oct(number, places);
  },
  *"BITAND/2"(_input, left, right) {
    yield excelBitAnd(left, right);
  },
  *"BITLSHIFT/2"(_input, number, shift) {
    yield excelBitLShift(number, shift);
  },
  *"BITOR/2"(_input, left, right) {
    yield excelBitOr(left, right);
  },
  *"BITRSHIFT/2"(_input, number, shift) {
    yield excelBitRShift(number, shift);
  },
  *"BITXOR/2"(_input, left, right) {
    yield excelBitXor(left, right);
  },
  *"COMPLEX/2"(_input, real, imaginary) {
    yield excelComplex(real, imaginary);
  },
  *"COMPLEX/3"(_input, real, imaginary, suffix) {
    yield excelComplex(real, imaginary, suffix);
  },
  *"CONVERT/3"(_input, number, fromUnit, toUnit) {
    yield excelConvert(number, fromUnit, toUnit);
  },
  // ═══════════════════════════════════════════════════════════════
  // Text functions
  // ═══════════════════════════════════════════════════════════════
  *"UNICHAR/1"(_input, number) {
    const n = Math.floor(parseExcelNumber(number));
    if (n < 1 || n > 1114111)
      throwExcelError(EXCEL_ERROR.value);
    yield String.fromCodePoint(n);
  },
  *"DEC2BIN/1"(_input, number) {
    yield excelDec2Bin(number);
  },
  *"DEC2BIN/2"(_input, number, places) {
    yield excelDec2Bin(number, places);
  },
  *"DEC2HEX/1"(_input, number) {
    yield excelDec2Hex(number);
  },
  *"DEC2HEX/2"(_input, number, places) {
    yield excelDec2Hex(number, places);
  },
  *"DEC2OCT/1"(_input, number) {
    yield excelDec2Oct(number);
  },
  *"DEC2OCT/2"(_input, number, places) {
    yield excelDec2Oct(number, places);
  },
  *"DECIMAL/2"(_input, text, radix) {
    yield excelDecimal(text, radix);
  },
  *"DELTA/1"(_input, left) {
    yield excelDelta(left);
  },
  *"DELTA/2"(_input, left, right) {
    yield excelDelta(left, right);
  },
  *"ERF/2"(_input, lower, upper) {
    yield excelErf(lower, upper);
  },
  *"ERFC/1"(_input, value) {
    yield excelErfc(value);
  },
  *"GESTEP/1"(_input, number) {
    yield excelGestep(number);
  },
  *"GESTEP/2"(_input, number, step) {
    yield excelGestep(number, step);
  },
  *"HEX2BIN/1"(_input, number) {
    yield excelHex2Bin(number);
  },
  *"HEX2BIN/2"(_input, number, places) {
    yield excelHex2Bin(number, places);
  },
  *"HEX2DEC/1"(_input, number) {
    yield excelHex2Dec(number);
  },
  *"HEX2OCT/1"(_input, number) {
    yield excelHex2Oct(number);
  },
  *"HEX2OCT/2"(_input, number, places) {
    yield excelHex2Oct(number, places);
  },
  *"IMABS/1"(_input, value) {
    yield excelImAbs(value);
  },
  *"IMAGINARY/1"(_input, value) {
    yield excelImImaginary(value);
  },
  *"IMARGUMENT/1"(_input, value) {
    yield excelImArgument(value);
  },
  *"ERF/1"(_input, lower) {
    yield excelErf(lower);
  },
  *"IMCONJUGATE/1"(_input, value) {
    yield excelImConjugate(value);
  },
  *"IMCOS/1"(_input, value) {
    yield excelImCos(value);
  },
  *"IMCOSH/1"(_input, value) {
    yield excelImCosh(value);
  },
  *"IMCOT/1"(_input, value) {
    yield excelImCot(value);
  },
  *"IMCSC/1"(_input, value) {
    yield excelImCsc(value);
  },
  *"IMCSCH/1"(_input, value) {
    yield excelImCsch(value);
  },
  *"IMSIN/1"(_input, value) {
    yield excelImSin(value);
  },
  *"IMDIV/2"(_input, left, right) {
    yield excelImDiv(left, right);
  },
  *"IMPRODUCT/1"(_input, values) {
    yield excelImProduct(values);
  },
  *"IMEXP/1"(_input, value) {
    yield excelImExp(value);
  },
  *"IMLN/1"(_input, value) {
    yield excelImLn(value);
  },
  *"IMLOG10/1"(_input, value) {
    yield excelImLog10(value);
  },
  *"IMLOG2/1"(_input, value) {
    yield excelImLog2(value);
  },
  *"IMPOWER/2"(_input, value, power) {
    yield excelImPower(value, power);
  },
  *"IMSQRT/1"(_input, value) {
    yield excelImSqrt(value);
  },
  *"IMREAL/1"(_input, value) {
    yield excelImReal(value);
  },
  *"IMSEC/1"(_input, value) {
    yield excelImSec(value);
  },
  *"IMSECH/1"(_input, value) {
    yield excelImSech(value);
  },
  *"IMSINH/1"(_input, value) {
    yield excelImSinh(value);
  },
  *"IMTAN/1"(_input, value) {
    yield excelImTan(value);
  },
  *"IMSUB/2"(_input, left, right) {
    yield excelImSub(left, right);
  },
  *"IMSUM/1"(_input, values) {
    yield excelImSum(values);
  },
  *"IMSUM/2"(_input, left, right) {
    yield excelImSum([left, right]);
  },
  *"IMSUM/3"(_input, first, second, third) {
    yield excelImSum([first, second, third]);
  },
  *"OCT2BIN/1"(_input, number) {
    yield excelOct2Bin(number);
  },
  *"OCT2BIN/2"(_input, number, places) {
    yield excelOct2Bin(number, places);
  },
  *"OCT2DEC/1"(_input, number) {
    yield excelOct2Dec(number);
  },
  *"OCT2HEX/1"(_input, number) {
    yield excelOct2Hex(number);
  },
  *"OCT2HEX/2"(_input, number, places) {
    yield excelOct2Hex(number, places);
  }
};
var formulaEngineeringNativeFilters = wrapBareNativeFilters(bareNativeFilters);

// src/bxl/registry/formula-engineering.ts
var formulaEngineeringLibrary = {
  jq: {},
  native: formulaEngineeringNativeFilters
};

// src/formulajs/dateSerial.ts
var MS_PER_DAY = 24 * 60 * 60 * 1e3;
var WEEKEND_TYPES = {
  1: [0, 6],
  2: [0, 1],
  3: [1, 2],
  4: [2, 3],
  5: [3, 4],
  6: [4, 5],
  7: [5, 6],
  11: [0],
  12: [1],
  13: [2],
  14: [3],
  15: [4],
  16: [5],
  17: [6]
};
function utcDate(year, month, day, hours = 0, minutes = 0, seconds = 0) {
  return new Date(Date.UTC(year, month, day, hours, minutes, seconds));
}
function serialToExcelDate(serial) {
  if (!Number.isFinite(serial)) {
    throwExcelError(EXCEL_ERROR.num);
  }
  let adjustedSerial = serial;
  if (adjustedSerial < 60) {
    adjustedSerial += 1;
  }
  const utcDays = Math.floor(adjustedSerial - 25569);
  const utcValue = utcDays * 86400;
  const dateInfo = new Date(utcValue * 1e3);
  const fractionalDay = adjustedSerial - Math.floor(adjustedSerial) + 1e-7;
  let totalSeconds = Math.floor(86400 * fractionalDay);
  const seconds = totalSeconds % 60;
  totalSeconds -= seconds;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor(totalSeconds / 60) % 60;
  let days = dateInfo.getUTCDate();
  let month = dateInfo.getUTCMonth();
  if (serial >= 60 && serial < 61) {
    days = 29;
    month = 1;
  }
  return utcDate(
    dateInfo.getUTCFullYear(),
    month,
    days,
    hours,
    minutes,
    seconds
  );
}
function excelDateToSerial(date) {
  const d1900 = utcDate(1900, 0, 1).getTime();
  const addOn = date.getTime() > Date.UTC(1900, 1, 28) ? 2 : 1;
  return Math.ceil((date.getTime() - d1900) / MS_PER_DAY) + addOn;
}
function parseExcelDate(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return new Date(value.getTime());
  }
  if (typeof value === "number") {
    if (value < 0 || value >= 2958466) {
      throwExcelError(EXCEL_ERROR.num);
    }
    return serialToExcelDate(value);
  }
  if (typeof value === "string") {
    const numeric = Number(value);
    if (value.trim() !== "" && Number.isFinite(numeric)) {
      return parseExcelDate(numeric);
    }
    const parsed = /^\d{4}-\d\d?-\d\d?$/.test(value) ? /* @__PURE__ */ new Date(`${value}T00:00:00.000Z`) : new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  throwExcelError(EXCEL_ERROR.value);
}
function parseExcelDateArray(value) {
  const values = Array.isArray(value) ? value : [value];
  return values.map((entry) => parseExcelDate(entry));
}
function buildExcelDate(yearValue, monthValue, dayValue) {
  const year = Math.trunc(yearValue);
  const month = Math.trunc(monthValue);
  const day = Math.trunc(dayValue);
  return excelDateToSerial(utcDate(year, month - 1, day));
}
function excelYear(dateLike) {
  return parseExcelDate(dateLike).getUTCFullYear();
}
function excelMonth(dateLike) {
  return parseExcelDate(dateLike).getUTCMonth() + 1;
}
function excelDay(dateLike) {
  return parseExcelDate(dateLike).getUTCDate();
}
function daysBetween(start, end) {
  return Math.ceil((end.getTime() - start.getTime()) / MS_PER_DAY);
}
function isLeapYear(year) {
  return new Date(Date.UTC(year, 1, 29)).getUTCMonth() === 1;
}
function yearFrac(startLike, endLike, basisValue = 0) {
  const startDate = parseExcelDate(startLike);
  const endDate = parseExcelDate(endLike);
  const basis = Math.trunc(Number(basisValue) || 0);
  let sd = startDate.getUTCDate();
  const sm = startDate.getUTCMonth() + 1;
  const sy = startDate.getUTCFullYear();
  let ed = endDate.getUTCDate();
  const em = endDate.getUTCMonth() + 1;
  const ey = endDate.getUTCFullYear();
  switch (basis) {
    case 0:
      if (sd === 31 && ed === 31) {
        sd = 30;
        ed = 30;
      } else if (sd === 31) {
        sd = 30;
      } else if (sd === 30 && ed === 31) {
        ed = 30;
      }
      return (ed + em * 30 + ey * 360 - (sd + sm * 30 + sy * 360)) / 360;
    case 1: {
      const feb29Between = (date1, date2) => {
        const year1 = date1.getUTCFullYear();
        const mar1year1 = utcDate(year1, 2, 1);
        if (isLeapYear(year1) && date1 < mar1year1 && date2 >= mar1year1) {
          return true;
        }
        const year2 = date2.getUTCFullYear();
        const mar1year2 = utcDate(year2, 2, 1);
        return isLeapYear(year2) && date2 >= mar1year2 && date1 < mar1year2;
      };
      let yearLength = 365;
      if (sy === ey || sy + 1 === ey && (sm > em || sm === em && sd >= ed)) {
        if (sy === ey && isLeapYear(sy) || feb29Between(startDate, endDate) || em === 1 && ed === 29) {
          yearLength = 366;
        }
        return daysBetween(startDate, endDate) / yearLength;
      }
      const years = ey - sy + 1;
      const days = (utcDate(ey + 1, 0, 1).getTime() - utcDate(sy, 0, 1).getTime()) / MS_PER_DAY;
      const average = days / years;
      return daysBetween(startDate, endDate) / average;
    }
    case 2:
      return daysBetween(startDate, endDate) / 360;
    case 3:
      return daysBetween(startDate, endDate) / 365;
    case 4:
      return (ed + em * 30 + ey * 360 - (sd + sm * 30 + sy * 360)) / 360;
    default:
      throwExcelError(EXCEL_ERROR.num);
  }
}
function excelDatedif(startLike, endLike, unitLike) {
  const start = parseExcelDate(startLike);
  const end = parseExcelDate(endLike);
  const unit = String(unitLike).toUpperCase();
  if (end < start)
    throwExcelError(EXCEL_ERROR.num);
  const sy = start.getUTCFullYear(), sm = start.getUTCMonth(), sd = start.getUTCDate();
  const ey = end.getUTCFullYear(), em = end.getUTCMonth(), ed = end.getUTCDate();
  switch (unit) {
    case "Y": {
      let years = ey - sy;
      if (em < sm || em === sm && ed < sd)
        years--;
      return years;
    }
    case "M": {
      let months = (ey - sy) * 12 + (em - sm);
      if (ed < sd)
        months--;
      return months;
    }
    case "D":
      return daysBetween(start, end);
    case "MD":
      return ed >= sd ? ed - sd : new Date(Date.UTC(ey, em, 0)).getUTCDate() - sd + ed;
    case "YM": {
      let m = em - sm;
      if (ed < sd)
        m--;
      return m < 0 ? m + 12 : m;
    }
    case "YD": {
      const anniv = utcDate(ey, sm, sd);
      if (anniv <= end)
        return daysBetween(anniv, end);
      const prevAnniv = utcDate(ey - 1, sm, sd);
      return daysBetween(prevAnniv, end);
    }
    default:
      throwExcelError(EXCEL_ERROR.num);
  }
}
function excelDatevalue(textLike) {
  const text = String(textLike);
  const date = parseExcelDate(text);
  return excelDateToSerial(utcDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}
function excelDays360(startLike, endLike, methodLike = false) {
  const start = parseExcelDate(startLike);
  const end = parseExcelDate(endLike);
  const european = Boolean(methodLike);
  let sd = start.getUTCDate(), sm = start.getUTCMonth() + 1, sy = start.getUTCFullYear();
  let ed = end.getUTCDate(), em = end.getUTCMonth() + 1, ey = end.getUTCFullYear();
  if (european) {
    if (sd === 31)
      sd = 30;
    if (ed === 31)
      ed = 30;
  } else {
    if (sd === 31)
      sd = 30;
    if (ed === 31 && sd >= 30)
      ed = 30;
  }
  return (ey - sy) * 360 + (em - sm) * 30 + (ed - sd);
}
function excelWeeknum(serialLike, returnTypeLike = 1) {
  const date = parseExcelDate(serialLike);
  const returnType = Math.floor(Number(returnTypeLike) || 1);
  const jan1 = utcDate(date.getUTCFullYear(), 0, 1);
  const dayOfYear = Math.floor((date.getTime() - jan1.getTime()) / MS_PER_DAY);
  const jan1Dow = jan1.getUTCDay();
  const startOffset = returnType === 2 ? jan1Dow === 0 ? 6 : jan1Dow - 1 : jan1Dow;
  return Math.floor((dayOfYear + startOffset) / 7) + 1;
}
function isWeekend(date) {
  const dow = date.getUTCDay();
  return dow === 0 || dow === 6;
}
function weekendDays(weekendLike = 1) {
  if (typeof weekendLike === "string") {
    if (!/^[01]{7}$/.test(weekendLike) || weekendLike === "1111111") {
      throwExcelError(EXCEL_ERROR.value);
    }
    const maskIndex = [1, 2, 3, 4, 5, 6, 0];
    return new Set(
      weekendLike.split("").flatMap((entry, index) => entry === "1" ? [maskIndex[index]] : [])
    );
  }
  const weekendType = Math.trunc(parseExcelNumber(weekendLike));
  const days = WEEKEND_TYPES[weekendType];
  if (!days) {
    throwExcelError(EXCEL_ERROR.value);
  }
  return new Set(days);
}
function holidaySerials(holidaysLike) {
  const holidays = /* @__PURE__ */ new Set();
  if (holidaysLike === void 0) {
    return holidays;
  }
  for (const holiday of parseExcelDateArray(holidaysLike)) {
    holidays.add(excelDateToSerial(holiday));
  }
  return holidays;
}
function isWeekendIntl(date, weekends) {
  return weekends.has(date.getUTCDay());
}
function excelNetworkdays(startLike, endLike, holidaysLike) {
  const start = parseExcelDate(startLike);
  const end = parseExcelDate(endLike);
  const holidays = holidaySerials(holidaysLike);
  const sign = end >= start ? 1 : -1;
  const s = sign === 1 ? start : end;
  const e = sign === 1 ? end : start;
  let count = 0;
  const current = new Date(s.getTime());
  while (current <= e) {
    if (!isWeekend(current) && !holidays.has(excelDateToSerial(current))) {
      count++;
    }
    current.setUTCDate(current.getUTCDate() + 1);
  }
  return sign * count;
}
function excelWorkday(startLike, daysLike, holidaysLike) {
  const start = parseExcelDate(startLike);
  let days = Math.trunc(parseExcelNumber(daysLike));
  const holidays = holidaySerials(holidaysLike);
  const sign = days >= 0 ? 1 : -1;
  days = Math.abs(days);
  const current = new Date(start.getTime());
  let counted = 0;
  while (counted < days) {
    current.setUTCDate(current.getUTCDate() + sign);
    if (!isWeekend(current) && !holidays.has(excelDateToSerial(current))) {
      counted++;
    }
  }
  return excelDateToSerial(current);
}
function excelNetworkdaysIntl(startLike, endLike, weekendLike = 1, holidaysLike) {
  const start = parseExcelDate(startLike);
  const end = parseExcelDate(endLike);
  const weekends = weekendDays(weekendLike);
  const holidays = holidaySerials(holidaysLike);
  const sign = end >= start ? 1 : -1;
  const s = sign === 1 ? start : end;
  const e = sign === 1 ? end : start;
  let count = 0;
  const current = new Date(s.getTime());
  while (current <= e) {
    if (!isWeekendIntl(current, weekends) && !holidays.has(excelDateToSerial(current))) {
      count++;
    }
    current.setUTCDate(current.getUTCDate() + 1);
  }
  return sign * count;
}
function excelWorkdayIntl(startLike, daysLike, weekendLike = 1, holidaysLike) {
  const start = parseExcelDate(startLike);
  let days = Math.trunc(parseExcelNumber(daysLike));
  const weekends = weekendDays(weekendLike);
  const holidays = holidaySerials(holidaysLike);
  const sign = days >= 0 ? 1 : -1;
  days = Math.abs(days);
  const current = new Date(start.getTime());
  let counted = 0;
  while (counted < days) {
    current.setUTCDate(current.getUTCDate() + sign);
    if (!isWeekendIntl(current, weekends) && !holidays.has(excelDateToSerial(current))) {
      counted++;
    }
  }
  return excelDateToSerial(current);
}

// src/formulajs/financial.ts
function parseCashFlows(values) {
  const parsed = parseExcelNumberArray(flattenExcelArgs(values));
  const positive = parsed.some((value) => value > 0);
  const negative = parsed.some((value) => value < 0);
  if (!positive || !negative) {
    throwExcelError(EXCEL_ERROR.num);
  }
  return parsed;
}
function excelFv(rateLike, nperLike, paymentLike, valueLike = 0, typeLike = 0) {
  const rate = parseExcelNumber(rateLike);
  const nper = parseExcelNumber(nperLike);
  const payment = parseExcelNumber(paymentLike);
  const value = parseExcelNumber(valueLike);
  const type = parseExcelNumber(typeLike);
  if (rate === 0) {
    return -(value + payment * nper);
  }
  const term = Math.pow(1 + rate, nper);
  const result = type === 1 ? value * term + payment * (1 + rate) * (term - 1) / rate : value * term + payment * (term - 1) / rate;
  return -result;
}
function excelFvSchedule(principalLike, scheduleLike) {
  const principal = parseExcelNumber(principalLike);
  const schedule = parseExcelNumberArray(scheduleLike);
  return schedule.reduce((future, rate) => future * (1 + rate), principal);
}
function excelNpv(rateLike, valuesLike) {
  const rate = parseExcelNumber(rateLike);
  const values = parseExcelNumberArray(flattenExcelArgs(valuesLike));
  let result = 0;
  for (let i = 0; i < values.length; i++) {
    result += values[i] / Math.pow(1 + rate, i + 1);
  }
  return result;
}
function excelEffect(nominalRateLike, nperyLike) {
  const nominalRate = parseExcelNumber(nominalRateLike);
  let npery = parseExcelNumber(nperyLike);
  if (nominalRate <= 0 || npery < 1) {
    throwExcelError(EXCEL_ERROR.num);
  }
  npery = Math.trunc(npery);
  return Math.pow(1 + nominalRate / npery, npery) - 1;
}
function excelNominal(effectRateLike, nperyLike) {
  const effectRate = parseExcelNumber(effectRateLike);
  let npery = parseExcelNumber(nperyLike);
  if (effectRate <= 0 || npery < 1) {
    throwExcelError(EXCEL_ERROR.num);
  }
  npery = Math.trunc(npery);
  return (Math.pow(effectRate + 1, 1 / npery) - 1) * npery;
}
function excelPmt(rateLike, nperLike, pvLike, fvLike = 0, typeLike = 0) {
  const rate = parseExcelNumber(rateLike);
  const nper = parseExcelNumber(nperLike);
  const pv = parseExcelNumber(pvLike);
  const fv = parseExcelNumber(fvLike);
  const type = parseExcelNumber(typeLike);
  if (rate === 0) {
    return -(pv + fv) / nper;
  }
  const term = Math.pow(1 + rate, nper);
  const result = type === 1 ? (fv * rate / (term - 1) + pv * rate / (1 - 1 / term)) / (1 + rate) : fv * rate / (term - 1) + pv * rate / (1 - 1 / term);
  return -result;
}
function excelIpmt(rateLike, perLike, nperLike, pvLike, fvLike = 0, typeLike = 0) {
  const rate = parseExcelNumber(rateLike);
  const per = parseExcelNumber(perLike);
  const nper = parseExcelNumber(nperLike);
  const pv = parseExcelNumber(pvLike);
  const fv = parseExcelNumber(fvLike);
  const type = parseExcelNumber(typeLike);
  if (per < 1 || per > nper) {
    throwExcelError(EXCEL_ERROR.num);
  }
  const payment = excelPmt(rate, nper, pv, fv, type);
  const interest = per === 1 ? type === 1 ? 0 : -pv : type === 1 ? excelFv(rate, per - 2, payment, pv, 1) - payment : excelFv(rate, per - 1, payment, pv, 0);
  return interest * rate;
}
function excelPpmt(rateLike, perLike, nperLike, pvLike, fvLike = 0, typeLike = 0) {
  const rate = parseExcelNumber(rateLike);
  const per = parseExcelNumber(perLike);
  const nper = parseExcelNumber(nperLike);
  const pv = parseExcelNumber(pvLike);
  const fv = parseExcelNumber(fvLike);
  const type = parseExcelNumber(typeLike);
  return excelPmt(rate, nper, pv, fv, type) - excelIpmt(rate, per, nper, pv, fv, type);
}
function excelPv(rateLike, nperLike, pmtLike, fvLike = 0, typeLike = 0) {
  const rate = parseExcelNumber(rateLike);
  const nper = parseExcelNumber(nperLike);
  const pmt = parseExcelNumber(pmtLike);
  const fv = parseExcelNumber(fvLike);
  const type = parseExcelNumber(typeLike);
  return rate === 0 ? -pmt * nper - fv : ((1 - Math.pow(1 + rate, nper)) / rate * pmt * (1 + rate * type) - fv) / Math.pow(1 + rate, nper);
}
function excelNper(rateLike, pmtLike, pvLike, fvLike = 0, typeLike = 0) {
  const rate = parseExcelNumber(rateLike);
  const pmt = parseExcelNumber(pmtLike);
  const pv = parseExcelNumber(pvLike);
  const fv = parseExcelNumber(fvLike);
  const type = parseExcelNumber(typeLike);
  if (rate === 0) {
    return -(pv + fv) / pmt;
  }
  const numerator = pmt * (1 + rate * type) - fv * rate;
  const denominator = pv * rate + pmt * (1 + rate * type);
  return Math.log(numerator / denominator) / Math.log(1 + rate);
}
function excelRate(nperLike, pmtLike, pvLike, fvLike = 0, typeLike = 0, guessLike = 0.1) {
  const nper = parseExcelNumber(nperLike);
  const pmt = parseExcelNumber(pmtLike);
  const pv = parseExcelNumber(pvLike);
  const fv = parseExcelNumber(fvLike);
  let type = parseExcelNumber(typeLike);
  let rate = parseExcelNumber(guessLike);
  const epsMax = 1e-10;
  const iterMax = 100;
  type = type ? 1 : 0;
  for (let i = 0; i < iterMax; i++) {
    if (rate <= -1) {
      throwExcelError(EXCEL_ERROR.num);
    }
    let y;
    let f;
    if (Math.abs(rate) < epsMax) {
      y = pv * (1 + nper * rate) + pmt * (1 + rate * type) * nper + fv;
    } else {
      f = Math.pow(1 + rate, nper);
      y = pv * f + pmt * (1 / rate + type) * (f - 1) + fv;
    }
    if (Math.abs(y) < epsMax) {
      return rate;
    }
    let dy;
    if (Math.abs(rate) < epsMax) {
      dy = pv * nper + pmt * type * nper;
    } else {
      f = Math.pow(1 + rate, nper);
      const df = nper * Math.pow(1 + rate, nper - 1);
      dy = pv * df + pmt * (1 / rate + type) * df + pmt * (-1 / (rate * rate)) * (f - 1);
    }
    rate -= y / dy;
  }
  return rate;
}
function excelCumipmt(rateLike, nperLike, pvLike, startPeriodLike, endPeriodLike, typeLike) {
  const rate = parseExcelNumber(rateLike);
  const nper = parseExcelNumber(nperLike);
  const pv = parseExcelNumber(pvLike);
  let startPeriod = parseExcelNumber(startPeriodLike);
  const endPeriod = parseExcelNumber(endPeriodLike);
  const type = parseExcelNumber(typeLike);
  if (rate <= 0 || nper <= 0 || pv <= 0) {
    throwExcelError(EXCEL_ERROR.num);
  }
  if (startPeriod < 1 || endPeriod < 1 || startPeriod > endPeriod) {
    throwExcelError(EXCEL_ERROR.num);
  }
  if (type !== 0 && type !== 1) {
    throwExcelError(EXCEL_ERROR.num);
  }
  const payment = excelPmt(rate, nper, pv, 0, type);
  let interest = 0;
  if (startPeriod === 1) {
    if (type === 0) {
      interest = -pv;
    }
    startPeriod++;
  }
  for (let period = startPeriod; period <= endPeriod; period++) {
    interest += type === 1 ? excelFv(rate, period - 2, payment, pv, 1) - payment : excelFv(rate, period - 1, payment, pv, 0);
  }
  return interest * rate;
}
function excelCumprinc(rateLike, nperLike, pvLike, startPeriodLike, endPeriodLike, typeLike) {
  const rate = parseExcelNumber(rateLike);
  const nper = parseExcelNumber(nperLike);
  const pv = parseExcelNumber(pvLike);
  let startPeriod = parseExcelNumber(startPeriodLike);
  const endPeriod = parseExcelNumber(endPeriodLike);
  const type = parseExcelNumber(typeLike);
  if (rate <= 0 || nper <= 0 || pv <= 0) {
    throwExcelError(EXCEL_ERROR.num);
  }
  if (startPeriod < 1 || endPeriod < 1 || startPeriod > endPeriod) {
    throwExcelError(EXCEL_ERROR.num);
  }
  if (type !== 0 && type !== 1) {
    throwExcelError(EXCEL_ERROR.num);
  }
  const payment = excelPmt(rate, nper, pv, 0, type);
  let principal = 0;
  if (startPeriod === 1) {
    principal = type === 0 ? payment + pv * rate : payment;
    startPeriod++;
  }
  for (let period = startPeriod; period <= endPeriod; period++) {
    principal += type > 0 ? payment - (excelFv(rate, period - 2, payment, pv, 1) - payment) * rate : payment - excelFv(rate, period - 1, payment, pv, 0) * rate;
  }
  return principal;
}
function excelIrr(valuesLike, guessLike = 0.1) {
  const values = parseCashFlows(valuesLike);
  let guess = parseExcelNumber(guessLike);
  const npv = (rate) => {
    const safeRate = rate <= -1 ? -0.999999999 : rate;
    let result = values[0];
    const r = 1 + safeRate;
    let factor = 1;
    for (let i = 1; i < values.length; i++) {
      factor *= r;
      result += values[i] / factor;
    }
    return result;
  };
  const npvDerivative = (rate) => {
    const safeRate = rate <= -1 ? -0.999999999 : rate;
    const r = 1 + safeRate;
    let result = 0;
    let factor = r;
    for (let i = 1; i < values.length; i++) {
      result -= i * values[i] / factor;
      factor *= r;
    }
    return result / r;
  };
  const epsMax = 1e-10;
  for (let i = 0; i < 50; i++) {
    const resultValue = npv(guess);
    const derivative = npvDerivative(guess);
    if (Math.abs(derivative) < epsMax) {
      break;
    }
    const nextGuess = guess - resultValue / derivative;
    if (Math.abs(nextGuess - guess) <= epsMax && Math.abs(resultValue) <= epsMax) {
      return nextGuess;
    }
    guess = Math.max(-0.99999999, Math.min(nextGuess, 1e3));
  }
  return guess;
}
function excelXnpv(rateLike, valuesLike, datesLike) {
  const rate = parseExcelNumber(rateLike);
  const values = parseExcelNumberArray(flattenExcelArgs(valuesLike));
  const dates = parseExcelDateArray(flattenExcelArgs(datesLike));
  let result = 0;
  for (let i = 0; i < values.length; i++) {
    result += values[i] / Math.pow(1 + rate, daysBetween(dates[0], dates[i]) / 365);
  }
  return result;
}
function excelXirr(valuesLike, datesLike, guessLike = 0.1) {
  const values = parseCashFlows(valuesLike);
  const dates = parseExcelDateArray(flattenExcelArgs(datesLike));
  let guess = parseExcelNumber(guessLike);
  const irrResult = (rate) => {
    const r = rate + 1;
    let result = values[0];
    for (let i = 1; i < values.length; i++) {
      result += values[i] / Math.pow(r, daysBetween(dates[0], dates[i]) / 365);
    }
    return result;
  };
  const irrDerivative = (rate) => {
    const r = rate + 1;
    let result = 0;
    for (let i = 1; i < values.length; i++) {
      const frac = daysBetween(dates[0], dates[i]) / 365;
      result -= frac * values[i] / Math.pow(r, frac + 1);
    }
    return result;
  };
  const epsMax = 1e-10;
  for (let i = 0; i < 100; i++) {
    const resultValue = irrResult(guess);
    const nextGuess = guess - resultValue / irrDerivative(guess);
    if (Math.abs(nextGuess - guess) <= epsMax && Math.abs(resultValue) <= epsMax) {
      return nextGuess;
    }
    guess = nextGuess;
  }
  return guess;
}
function excelMirr(valuesLike, financeRateLike, reinvestRateLike) {
  const values = parseExcelNumberArray(flattenExcelArgs(valuesLike));
  const financeRate = parseExcelNumber(financeRateLike);
  const reinvestRate = parseExcelNumber(reinvestRateLike);
  const payments = values.filter((value) => value < 0);
  const incomes = values.filter((value) => value >= 0);
  if (payments.length === 0 || incomes.length === 0) {
    throwExcelError(EXCEL_ERROR.div0);
  }
  const numerator = -excelNpv(reinvestRate, incomes) * Math.pow(1 + reinvestRate, values.length - 1);
  const denominator = excelNpv(financeRate, payments) * (1 + financeRate);
  return Math.pow(numerator / denominator, 1 / (values.length - 1)) - 1;
}
function excelAccrint(issueLike, _firstInterestLike, settlementLike, rateLike, parLike, frequencyLike, basisLike = 0) {
  const issue = parseExcelDate(issueLike);
  const settlement = parseExcelDate(settlementLike);
  const rate = parseExcelNumber(rateLike);
  const par = parseExcelNumber(parLike);
  const frequency = parseExcelNumber(frequencyLike);
  const basis = parseExcelNumber(basisLike);
  if (![1, 2, 4].includes(frequency)) {
    throwExcelError(EXCEL_ERROR.num);
  }
  if (![0, 1, 2, 3, 4].includes(basis)) {
    throwExcelError(EXCEL_ERROR.num);
  }
  if (rate <= 0 || par <= 0 || settlement <= issue) {
    throwExcelError(EXCEL_ERROR.num);
  }
  return par * rate * yearFrac(issue, settlement, basis);
}
function excelSln(costLike, salvageLike, lifeLike) {
  const cost = parseExcelNumber(costLike);
  const salvage = parseExcelNumber(salvageLike);
  const life = parseExcelNumber(lifeLike);
  if (life === 0) {
    throwExcelError(EXCEL_ERROR.num);
  }
  return (cost - salvage) / life;
}
function excelSyd(costLike, salvageLike, lifeLike, perLike) {
  const cost = parseExcelNumber(costLike);
  const salvage = parseExcelNumber(salvageLike);
  const life = parseExcelNumber(lifeLike);
  let per = parseExcelNumber(perLike);
  if (life === 0 || per < 1 || per > life) {
    throwExcelError(EXCEL_ERROR.num);
  }
  per = Math.trunc(per);
  return (cost - salvage) * (life - per + 1) * 2 / (life * (life + 1));
}
function excelDb(costLike, salvageLike, lifeLike, periodLike, monthLike = 12) {
  const cost = parseExcelNumber(costLike);
  const salvage = parseExcelNumber(salvageLike);
  const life = parseExcelNumber(lifeLike);
  const period = Math.floor(parseExcelNumber(periodLike));
  const month = Math.floor(parseExcelNumber(monthLike));
  if (cost < 0 || salvage < 0 || life <= 0 || period < 1 || month < 1 || month > 12) {
    throwExcelError(EXCEL_ERROR.num);
  }
  const rate = +(1 - Math.pow(salvage / cost, 1 / life)).toFixed(3);
  let total = 0;
  let depn;
  for (let i = 1; i <= period; i++) {
    if (i === 1) {
      depn = cost * rate * month / 12;
    } else if (i === life + 1) {
      depn = (cost - total) * rate * (12 - month) / 12;
    } else {
      depn = (cost - total) * rate;
    }
    total += depn;
  }
  return depn;
}
function excelDdb(costLike, salvageLike, lifeLike, periodLike, factorLike = 2) {
  const cost = parseExcelNumber(costLike);
  const salvage = parseExcelNumber(salvageLike);
  const life = parseExcelNumber(lifeLike);
  const period = parseExcelNumber(periodLike);
  const factor = parseExcelNumber(factorLike);
  if (cost < 0 || salvage < 0 || life <= 0 || period < 1 || factor <= 0) {
    throwExcelError(EXCEL_ERROR.num);
  }
  let total = 0;
  let depn = 0;
  for (let i = 1; i <= period; i++) {
    depn = Math.min((cost - total) * (factor / life), cost - salvage - total);
    depn = Math.max(depn, 0);
    total += depn;
  }
  return depn;
}
function excelIspmt(rateLike, perLike, nperLike, pvLike) {
  const rate = parseExcelNumber(rateLike);
  const per = parseExcelNumber(perLike);
  const nper = parseExcelNumber(nperLike);
  const pv = parseExcelNumber(pvLike);
  return pv * rate * (per / nper - 1);
}
function excelPduration(rateLike, pvLike, fvLike) {
  const rate = parseExcelNumber(rateLike);
  const pv = parseExcelNumber(pvLike);
  const fv = parseExcelNumber(fvLike);
  if (rate <= 0 || pv <= 0 || fv <= 0)
    throwExcelError(EXCEL_ERROR.num);
  return (Math.log(fv) - Math.log(pv)) / Math.log(1 + rate);
}
function excelRri(nperLike, pvLike, fvLike) {
  const nper = parseExcelNumber(nperLike);
  const pv = parseExcelNumber(pvLike);
  const fv = parseExcelNumber(fvLike);
  if (nper <= 0 || pv === 0)
    throwExcelError(EXCEL_ERROR.num);
  return Math.pow(fv / pv, 1 / nper) - 1;
}
function excelDollarde(fractionalLike, fractionLike) {
  const fractional = parseExcelNumber(fractionalLike);
  const fraction = Math.floor(parseExcelNumber(fractionLike));
  if (fraction < 0)
    throwExcelError(EXCEL_ERROR.num);
  if (fraction === 0)
    throwExcelError(EXCEL_ERROR.div0);
  const sign = fractional >= 0 ? 1 : -1;
  const abs = Math.abs(fractional);
  const intPart = Math.floor(abs);
  const decPart = abs - intPart;
  const digits = Math.ceil(Math.log10(fraction));
  return sign * (intPart + decPart * Math.pow(10, digits) / fraction);
}
function excelDollarfr(decimalLike, fractionLike) {
  const decimal = parseExcelNumber(decimalLike);
  const fraction = Math.floor(parseExcelNumber(fractionLike));
  if (fraction < 0)
    throwExcelError(EXCEL_ERROR.num);
  if (fraction === 0)
    throwExcelError(EXCEL_ERROR.div0);
  const sign = decimal >= 0 ? 1 : -1;
  const abs = Math.abs(decimal);
  const intPart = Math.floor(abs);
  const decPart = abs - intPart;
  const digits = Math.ceil(Math.log10(fraction));
  return sign * (intPart + decPart * fraction / Math.pow(10, digits));
}
function excelDisc(settlementLike, maturityLike, prLike, redemptionLike, basisLike = 0) {
  const settlement = parseExcelDate(settlementLike);
  const maturity = parseExcelDate(maturityLike);
  const pr = parseExcelNumber(prLike);
  const redemption = parseExcelNumber(redemptionLike);
  if (pr <= 0 || redemption <= 0)
    throwExcelError(EXCEL_ERROR.num);
  const yf = yearFrac(settlementLike, maturityLike, Number(basisLike));
  return (redemption - pr) / redemption / yf;
}
function excelPricedisc(settlementLike, maturityLike, discLike, redemptionLike, basisLike = 0) {
  const disc = parseExcelNumber(discLike);
  const redemption = parseExcelNumber(redemptionLike);
  const yf = yearFrac(settlementLike, maturityLike, Number(basisLike));
  return redemption * (1 - disc * yf);
}
function excelCoupdays(settlementLike, maturityLike, frequencyLike, basisLike = 0) {
  const frequency = Math.floor(parseExcelNumber(frequencyLike));
  const basis = Math.floor(Number(basisLike) || 0);
  if (![1, 2, 4].includes(frequency))
    throwExcelError(EXCEL_ERROR.num);
  switch (basis) {
    case 0:
    case 4:
      return 360 / frequency;
    case 1:
      return 365 / frequency;
    case 2:
      return 360 / frequency;
    case 3:
      return 365 / frequency;
    default:
      throwExcelError(EXCEL_ERROR.num);
  }
}
function excelTbilleq(settlementLike, maturityLike, discountLike) {
  const settlement = parseExcelDate(settlementLike);
  const maturity = parseExcelDate(maturityLike);
  const discount = parseExcelNumber(discountLike);
  const dsm = daysBetween(settlement, maturity);
  if (dsm <= 0 || discount <= 0)
    throwExcelError(EXCEL_ERROR.num);
  return 365 * discount / (360 - discount * dsm);
}
function excelTbillprice(settlementLike, maturityLike, discountLike) {
  const settlement = parseExcelDate(settlementLike);
  const maturity = parseExcelDate(maturityLike);
  const discount = parseExcelNumber(discountLike);
  const dsm = daysBetween(settlement, maturity);
  if (dsm <= 0 || discount <= 0)
    throwExcelError(EXCEL_ERROR.num);
  return 100 * (1 - discount * dsm / 360);
}
function excelTbillyield(settlementLike, maturityLike, priceLike) {
  const settlement = parseExcelDate(settlementLike);
  const maturity = parseExcelDate(maturityLike);
  const price = parseExcelNumber(priceLike);
  const dsm = daysBetween(settlement, maturity);
  if (dsm <= 0 || price <= 0)
    throwExcelError(EXCEL_ERROR.num);
  return (100 - price) / price * (360 / dsm);
}

// src/bxl/bridge/formula-financial-native.ts
function asRowObject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }
  return value;
}
function expectRows(rowsLike) {
  if (!Array.isArray(rowsLike)) {
    throwExcelError(EXCEL_ERROR.value);
  }
  return rowsLike.map((row) => asRowObject(row));
}
function colValues(rowsLike, keyLike) {
  const rows = expectRows(rowsLike);
  const key = parseExcelString(keyLike);
  return rows.map(
    (row) => Object.prototype.hasOwnProperty.call(row, key) ? row[key] : null
  );
}
var bareNativeFilters2 = {
  *"ACCRINT/6"(_input, issue, firstInterest, settlement, rate, par, frequency) {
    yield excelAccrint(issue, firstInterest, settlement, rate, par, frequency);
  },
  *"ACCRINT/7"(_input, issue, firstInterest, settlement, rate, par, frequency, basis) {
    yield excelAccrint(
      issue,
      firstInterest,
      settlement,
      rate,
      par,
      frequency,
      basis
    );
  },
  *"COUPDAYS/3"(_input, settlement, maturity, frequency) {
    yield excelCoupdays(settlement, maturity, frequency);
  },
  *"COUPDAYS/4"(_input, settlement, maturity, frequency, basis) {
    yield excelCoupdays(settlement, maturity, frequency, basis);
  },
  *"CUMIPMT/6"(_input, rate, nper, pv, startPeriod, endPeriod, type) {
    yield excelCumipmt(rate, nper, pv, startPeriod, endPeriod, type);
  },
  *"CUMPRINC/6"(_input, rate, nper, pv, startPeriod, endPeriod, type) {
    yield excelCumprinc(rate, nper, pv, startPeriod, endPeriod, type);
  },
  *"DB/4"(_input, cost, salvage, life, period) {
    yield excelDb(cost, salvage, life, period);
  },
  *"DB/5"(_input, cost, salvage, life, period, month) {
    yield excelDb(cost, salvage, life, period, month);
  },
  *"DDB/4"(_input, cost, salvage, life, period) {
    yield excelDdb(cost, salvage, life, period);
  },
  *"DDB/5"(_input, cost, salvage, life, period, factor) {
    yield excelDdb(cost, salvage, life, period, factor);
  },
  *"DISC/4"(_input, settlement, maturity, pr, redemption) {
    yield excelDisc(settlement, maturity, pr, redemption);
  },
  *"DISC/5"(_input, settlement, maturity, pr, redemption, basis) {
    yield excelDisc(settlement, maturity, pr, redemption, basis);
  },
  *"DOLLARDE/2"(_input, fractional, fraction) {
    yield excelDollarde(fractional, fraction);
  },
  *"DOLLARFR/2"(_input, decimal, fraction) {
    yield excelDollarfr(decimal, fraction);
  },
  *"EFFECT/2"(_input, nominalRate, npery) {
    yield excelEffect(nominalRate, npery);
  },
  *"FV/3"(_input, rate, nper, payment) {
    yield excelFv(rate, nper, payment);
  },
  *"FV/4"(_input, rate, nper, payment, value) {
    yield excelFv(rate, nper, payment, value);
  },
  *"FV/5"(_input, rate, nper, payment, value, type) {
    yield excelFv(rate, nper, payment, value, type);
  },
  *"FVSCHEDULE/2"(_input, principal, schedule) {
    yield excelFvSchedule(principal, schedule);
  },
  *"IPMT/4"(_input, rate, per, nper, pv) {
    yield excelIpmt(rate, per, nper, pv);
  },
  *"IPMT/5"(_input, rate, per, nper, pv, fv) {
    yield excelIpmt(rate, per, nper, pv, fv);
  },
  *"IPMT/6"(_input, rate, per, nper, pv, fv, type) {
    yield excelIpmt(rate, per, nper, pv, fv, type);
  },
  *"IRR_BY/2"(_input, rows, valueKey) {
    yield excelIrr(colValues(rows, valueKey));
  },
  *"IRR_BY/3"(_input, rows, valueKey, guess) {
    yield excelIrr(colValues(rows, valueKey), guess);
  },
  *"IRR/1"(_input, values) {
    yield excelIrr(values);
  },
  *"IRR/2"(_input, values, guess) {
    yield excelIrr(values, guess);
  },
  *"ISPMT/4"(_input, rate, per, nper, pv) {
    yield excelIspmt(rate, per, nper, pv);
  },
  *"MIRR/3"(_input, values, financeRate, reinvestRate) {
    yield excelMirr(values, financeRate, reinvestRate);
  },
  *"NOMINAL/2"(_input, effectRate, npery) {
    yield excelNominal(effectRate, npery);
  },
  *"NPER/3"(_input, rate, pmt, pv) {
    yield excelNper(rate, pmt, pv);
  },
  *"NPER/4"(_input, rate, pmt, pv, fv) {
    yield excelNper(rate, pmt, pv, fv);
  },
  *"NPER/5"(_input, rate, pmt, pv, fv, type) {
    yield excelNper(rate, pmt, pv, fv, type);
  },
  *"NPV_BY/3"(_input, rate, rows, valueKey) {
    yield excelNpv(rate, colValues(rows, valueKey));
  },
  *"NPV/2"(_input, rate, values) {
    yield excelNpv(rate, values);
  },
  *"PDURATION/3"(_input, rate, pv, fv) {
    yield excelPduration(rate, pv, fv);
  },
  *"PMT/3"(_input, rate, nper, pv) {
    yield excelPmt(rate, nper, pv);
  },
  *"PMT/4"(_input, rate, nper, pv, fv) {
    yield excelPmt(rate, nper, pv, fv);
  },
  *"PMT/5"(_input, rate, nper, pv, fv, type) {
    yield excelPmt(rate, nper, pv, fv, type);
  },
  *"PPMT/4"(_input, rate, per, nper, pv) {
    yield excelPpmt(rate, per, nper, pv);
  },
  *"PPMT/5"(_input, rate, per, nper, pv, fv) {
    yield excelPpmt(rate, per, nper, pv, fv);
  },
  *"PPMT/6"(_input, rate, per, nper, pv, fv, type) {
    yield excelPpmt(rate, per, nper, pv, fv, type);
  },
  *"PRICEDISC/4"(_input, settlement, maturity, disc, redemption) {
    yield excelPricedisc(settlement, maturity, disc, redemption);
  },
  *"PRICEDISC/5"(_input, settlement, maturity, disc, redemption, basis) {
    yield excelPricedisc(settlement, maturity, disc, redemption, basis);
  },
  *"PV/3"(_input, rate, nper, pmt) {
    yield excelPv(rate, nper, pmt);
  },
  *"PV/4"(_input, rate, nper, pmt, fv) {
    yield excelPv(rate, nper, pmt, fv);
  },
  *"PV/5"(_input, rate, nper, pmt, fv, type) {
    yield excelPv(rate, nper, pmt, fv, type);
  },
  *"RATE/3"(_input, nper, pmt, pv) {
    yield excelRate(nper, pmt, pv);
  },
  *"RATE/4"(_input, nper, pmt, pv, fv) {
    yield excelRate(nper, pmt, pv, fv);
  },
  *"RATE/5"(_input, nper, pmt, pv, fv, type) {
    yield excelRate(nper, pmt, pv, fv, type);
  },
  *"RATE/6"(_input, nper, pmt, pv, fv, type, guess) {
    yield excelRate(nper, pmt, pv, fv, type, guess);
  },
  *"RRI/3"(_input, nper, pv, fv) {
    yield excelRri(nper, pv, fv);
  },
  *"SLN/3"(_input, cost, salvage, life) {
    yield excelSln(cost, salvage, life);
  },
  *"SYD/4"(_input, cost, salvage, life, per) {
    yield excelSyd(cost, salvage, life, per);
  },
  *"TBILLEQ/3"(_input, settlement, maturity, discount) {
    yield excelTbilleq(settlement, maturity, discount);
  },
  *"TBILLPRICE/3"(_input, settlement, maturity, discount) {
    yield excelTbillprice(settlement, maturity, discount);
  },
  *"TBILLYIELD/3"(_input, settlement, maturity, price) {
    yield excelTbillyield(settlement, maturity, price);
  },
  *"XIRR_BY/3"(_input, rows, valueKey, dateKey) {
    yield excelXirr(colValues(rows, valueKey), colValues(rows, dateKey));
  },
  *"XIRR_BY/4"(_input, rows, valueKey, dateKey, guess) {
    yield excelXirr(colValues(rows, valueKey), colValues(rows, dateKey), guess);
  },
  *"XIRR/2"(_input, values, dates) {
    yield excelXirr(values, dates);
  },
  *"XIRR/3"(_input, values, dates, guess) {
    yield excelXirr(values, dates, guess);
  },
  *"XNPV_BY/4"(_input, rate, rows, valueKey, dateKey) {
    yield excelXnpv(rate, colValues(rows, valueKey), colValues(rows, dateKey));
  },
  *"XNPV/3"(_input, rate, values, dates) {
    yield excelXnpv(rate, values, dates);
  }
};
var formulaFinancialNativeFilters = wrapBareNativeFilters(bareNativeFilters2);

// src/bxl/registry/formula-financial.ts
var formulaFinancialLibrary = {
  jq: {},
  native: formulaFinancialNativeFilters
};

export {
  formulaEngineeringLibrary,
  buildExcelDate,
  excelYear,
  excelMonth,
  excelDay,
  yearFrac,
  excelDatedif,
  excelDatevalue,
  excelDays360,
  excelWeeknum,
  excelNetworkdays,
  excelWorkday,
  excelNetworkdaysIntl,
  excelWorkdayIntl,
  formulaFinancialLibrary
};
