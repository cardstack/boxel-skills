// @cardstack/bxl — realm bundle (ESM)
// Built: 2026-05-15T06:24:25.941Z
// Source: /path/to/bxl
// Regenerate: cd /path/to/bxl && npm run realm


// src/formulajs/errors.ts
var ExcelError = class extends Error {
  constructor(code) {
    super(code);
    this.code = code;
    this.name = "ExcelError";
  }
};
var EXCEL_ERROR = {
  nil: "#NULL!",
  div0: "#DIV/0!",
  value: "#VALUE!",
  ref: "#REF!",
  name: "#NAME?",
  num: "#NUM!",
  na: "#N/A",
  error: "#ERROR!",
  data: "#GETTING_DATA"
};
var EXCEL_ERROR_TYPE_INDEX = {
  [EXCEL_ERROR.nil]: 1,
  [EXCEL_ERROR.div0]: 2,
  [EXCEL_ERROR.value]: 3,
  [EXCEL_ERROR.ref]: 4,
  [EXCEL_ERROR.name]: 5,
  [EXCEL_ERROR.num]: 6,
  [EXCEL_ERROR.na]: 7,
  [EXCEL_ERROR.data]: 8,
  [EXCEL_ERROR.error]: 9
};
function throwExcelError(code) {
  throw new ExcelError(code);
}

// src/formulajs/common.ts
function isDefined(value) {
  return value !== void 0 && value !== null;
}
function isExcelBlank(value) {
  return value === void 0 || value === null || value === "";
}
function flattenExcelArgs(value) {
  if (!Array.isArray(value)) {
    return [value];
  }
  const output = [];
  for (const entry of value) {
    output.push(...flattenExcelArgs(entry));
  }
  return output;
}
function parseExcelNumber(value) {
  if (value === void 0 || value === null) {
    return 0;
  }
  if (typeof value === "boolean") {
    return value ? 1 : 0;
  }
  if (typeof value === "number" && !Number.isNaN(value)) {
    return value;
  }
  if (typeof value === "string" && value !== "" && !Number.isNaN(Number(value))) {
    return parseFloat(value);
  }
  throwExcelError(EXCEL_ERROR.value);
}
function parseExcelString(value) {
  if (value === void 0 || value === null) {
    return "";
  }
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "boolean") {
    return value ? "TRUE" : "FALSE";
  }
  return String(value);
}
function parseExcelBool(value) {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "number") {
    return value !== 0;
  }
  if (typeof value === "string") {
    const upper = value.toUpperCase();
    if (upper === "TRUE") {
      return true;
    }
    if (upper === "FALSE") {
      return false;
    }
  }
  throwExcelError(EXCEL_ERROR.value);
}
function parseExcelNumberArray(value) {
  const entries = flattenExcelArgs(value);
  if (entries.length === 0) {
    throwExcelError(EXCEL_ERROR.value);
  }
  return entries.map((entry) => parseExcelNumber(entry));
}
function sumExcelRange(value) {
  let result = 0;
  for (const entry of flattenExcelArgs(value)) {
    if (typeof entry === "number") {
      result += entry;
      continue;
    }
    if (typeof entry === "string") {
      const parsed = parseFloat(entry);
      if (!Number.isNaN(parsed)) {
        result += parsed;
      }
      continue;
    }
    if (Array.isArray(entry)) {
      result += sumExcelRange(entry);
    }
  }
  return result;
}
function countExcelNumbers(value) {
  return flattenExcelArgs(value).filter(
    (entry) => typeof entry === "number" && Number.isFinite(entry)
  ).length;
}
function countExcelValues(value) {
  return flattenExcelArgs(value).filter(
    (entry) => entry !== void 0 && entry !== null && entry !== ""
  ).length;
}
function averageExcelRange(value) {
  const flat = flattenExcelArgs(value).filter(isDefined);
  if (flat.length === 0) {
    throwExcelError(EXCEL_ERROR.div0);
  }
  const numbers = flat.filter(
    (entry) => typeof entry === "number" && Number.isFinite(entry)
  );
  if (numbers.length === 0) {
    throwExcelError(EXCEL_ERROR.num);
  }
  return numbers.reduce((sum, entry) => sum + entry, 0) / numbers.length;
}
function minExcelRange(value) {
  const numbers = parseExcelNumberArray(value);
  return Math.min(...numbers);
}
function maxExcelRange(value) {
  const numbers = parseExcelNumberArray(value);
  return Math.max(...numbers);
}
function sampleStdDev(value) {
  const numbers = parseExcelNumberArray(value);
  if (numbers.length < 2) {
    throwExcelError(EXCEL_ERROR.div0);
  }
  const mean = numbers.reduce((sum, entry) => sum + entry, 0) / numbers.length;
  const variance = numbers.reduce((sum, entry) => sum + (entry - mean) ** 2, 0) / (numbers.length - 1);
  return Math.sqrt(variance);
}
function populationStdDev(value) {
  const numbers = parseExcelNumberArray(value);
  if (numbers.length === 0) {
    throwExcelError(EXCEL_ERROR.div0);
  }
  const mean = numbers.reduce((sum, entry) => sum + entry, 0) / numbers.length;
  const variance = numbers.reduce((sum, entry) => sum + (entry - mean) ** 2, 0) / numbers.length;
  return Math.sqrt(variance);
}

export {
  EXCEL_ERROR,
  throwExcelError,
  isExcelBlank,
  flattenExcelArgs,
  parseExcelNumber,
  parseExcelString,
  parseExcelBool,
  parseExcelNumberArray,
  sumExcelRange,
  countExcelNumbers,
  countExcelValues,
  averageExcelRange,
  minExcelRange,
  maxExcelRange,
  sampleStdDev,
  populationStdDev
};
