// @cardstack/bxl — realm bundle (ESM)
// Built: 2026-05-15T06:24:25.941Z
// Source: /path/to/bxl
// Regenerate: cd /path/to/bxl && npm run realm

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/jqtools/errors.ts
var JqError = class extends Error {
};
var JqParseError = class extends JqError {
};
var JqEvaluateError = class extends JqError {
};
var JqArgumentError = class extends JqEvaluateError {
};
var NotImplementedError = class extends JqEvaluateError {
};

// src/jqtools/evaluate/evaluateErrors.ts
function notDefinedError(name) {
  return new JqEvaluateError(`'${name}' is not defined`);
}
function notImplementedError(featureName) {
  return new NotImplementedError(`Feature '${featureName}' is not implemented`);
}
function cannotIndexError(val, index) {
  return new JqEvaluateError(
    `Cannot index ${typeOf(val)} with ${typeOf(index)}`
  );
}
function cannotSliceError(val) {
  return new JqEvaluateError(`Cannot slice ${typeOf(val)}`);
}

// src/jqtools/evaluate/compare.ts
var typesOrder = {
  null: 0,
  boolean: 1,
  number: 2,
  string: 3,
  array: 4,
  object: 5
};
function compareTypes(a, b) {
  return typesOrder[a] - typesOrder[b];
}
function compare(a, b) {
  const typeA = typeOf(a);
  const typesCompare = compareTypes(typeA, typeOf(b));
  if (typesCompare !== 0) {
    return typesCompare;
  }
  switch (typeA) {
    case "null" /* null */:
      return 0;
    case "boolean" /* boolean */:
    case "number" /* number */:
      return a - b;
    case "string" /* string */:
      for (let i = 0; i < Math.max(a.length, b.length); i++) {
        const ai = a.codePointAt(i) ?? -1;
        const bi = b.codePointAt(i) ?? -1;
        const comp = ai - bi;
        if (comp !== 0)
          return comp;
      }
      return 0;
    case "array" /* array */:
      for (let i = 0; i < Math.max(a.length, b.length); i++) {
        if (a[i] === void 0)
          return -1;
        if (b[i] === void 0)
          return 1;
        const comp = compare(a[i], b[i]);
        if (comp !== 0)
          return comp;
      }
      return 0;
    case "object" /* object */:
      const aKeys = Object.keys(a).sort();
      const bKeys = Object.keys(b).sort();
      const keysComp = compare(aKeys, bKeys);
      if (keysComp !== 0)
        return keysComp;
      const aValues = aKeys.map((key) => a[key]);
      const bValues = bKeys.map((key) => b[key]);
      return compare(aValues, bValues);
  }
}

// src/jqtools/evaluate/utils/utils.ts
function createSliceAccessor(start, end) {
  return { start, end };
}
function isSliceAccessor(val) {
  return val && (val.start === null || Number.isInteger(val.start)) && (val.end === null || Number.isInteger(val.end));
}
function createItem(value, path = []) {
  return { value, path };
}
function* generateItems(values) {
  for (const value of values) {
    yield createItem(value);
  }
}
function* generateValues(items) {
  for (const item of items) {
    yield item.value;
  }
}
function* generatePaths(items) {
  for (const item of items) {
    yield item.path;
  }
}
function collectValues(items) {
  return Array.from(generateValues(items));
}
function typeOf(value) {
  if (Array.isArray(value))
    return "array" /* array */;
  if (value === null)
    return "null" /* null */;
  return typeof value;
}
function isAtom(value) {
  const type = typeOf(value);
  return type !== "array" && type !== "object";
}
function typesEqual(a, b) {
  return typeOf(a) === typeOf(b);
}
function typesMatch(a, b, typeA, typeB = typeA) {
  return typeOf(a) === typeA && typeOf(b) === typeB;
}
function typesMatchCommutative(a, b, typeA, typeB) {
  return typesMatch(a, b, typeA, typeB) || typesMatch(a, b, typeB, typeA);
}
function typeIsOneOf(val, ...types) {
  return types.some((type) => typeOf(val) === type);
}
function* single(val) {
  yield val;
}
function isPath(val) {
  return Array.isArray(val) && val.every((item) => {
    switch (typeof item) {
      case "string":
        return true;
      case "number":
        return Number.isInteger(item);
      case "object":
        return isSliceAccessor(item);
      default:
        return false;
    }
  });
}
function isPaths(val) {
  return Array.isArray(val) && val.every((item) => isPath(item));
}
function isTrue(val) {
  return val !== null && val !== false;
}
function repeatString(str, num) {
  if (num <= 0) {
    return null;
  }
  let out = "";
  for (let i = 0; i < Math.floor(num); i++) {
    out += str;
  }
  return out;
}
function* recursiveDescent(val) {
  yield val;
  if (typeOf(val) === "object") {
    for (const child of Object.values(val)) {
      yield* recursiveDescent(child);
    }
  } else if (typeOf(val) === "array") {
    for (const child of val) {
      yield* recursiveDescent(child);
    }
  }
}
function toString(val) {
  switch (typeOf(val)) {
    case "null" /* null */:
      return "null";
    case "boolean" /* boolean */:
    case "number" /* number */:
      return val.toString();
    case "string" /* string */:
      return val;
    case "array" /* array */:
    case "object" /* object */:
      return JSON.stringify(val);
  }
}
function indices(haystack, needle) {
  const out = [];
  for (let i = 0; i < haystack.length; i++) {
    for (let j = 0; j < needle.length; j++) {
      if (compare(haystack[i + j], needle[j]) !== 0)
        break;
      if (j + 1 === needle.length) {
        out.push(i);
      }
    }
  }
  return out;
}
function access(val, index) {
  if (typesMatch(index, val, "number" /* number */, "array" /* array */)) {
    return val[normalizeArrayIndex(val.length, index)] ?? null;
  } else if (typesMatch(index, val, "string" /* string */, "object" /* object */)) {
    return val[index] ?? null;
  } else if (typesMatch(index, val, "array" /* array */, "array" /* array */)) {
    return indices(val, index);
  } else if (typeOf(val) === "null" /* null */ && (typeIsOneOf(index, "number" /* number */, "string" /* string */) || isSliceAccessor(index))) {
    return null;
  } else if (typeIsOneOf(val, "array" /* array */, "string" /* string */) && isSliceAccessor(index)) {
    return val.slice(index.start ?? void 0, index.end ?? void 0);
  } else {
    if (isSliceAccessor(index)) {
      throw cannotSliceError(val);
    }
    throw cannotIndexError(val, index);
  }
}
function normalizeArrayIndex(arrayLength, index) {
  return index < 0 ? arrayLength + index : index;
}
function normalizeSliceAccessor(arrayLength, sliceAccessor) {
  const { start, end } = sliceAccessor;
  const newEnd = Math.max(
    0,
    Math.min(normalizeArrayIndex(arrayLength, end ?? arrayLength), arrayLength)
  );
  const newStart = Math.max(
    0,
    Math.min(normalizeArrayIndex(arrayLength, start ?? 0), newEnd)
  );
  return {
    start: newStart,
    end: newEnd
  };
}
function normalizeLeadingSliceAccessors(arrayLength, path) {
  if (!isSliceAccessor(path[0])) {
    return path;
  }
  let pos = 1;
  let accessor = normalizeSliceAccessor(
    arrayLength,
    path[0]
  );
  while (isSliceAccessor(path[pos])) {
    arrayLength = accessor.end - accessor.start;
    const next = normalizeSliceAccessor(arrayLength, path[pos]);
    accessor = {
      start: accessor.start + next.start,
      end: accessor.start + next.end
    };
    pos++;
  }
  if (pos < path.length) {
    const next = path[pos];
    if (typeof next !== "number") {
      throw cannotIndexError([], next);
    }
    return [accessor.start + next, ...path.slice(pos + 1)];
  } else {
    return [accessor];
  }
}
function resolveNormalizedSliceAccessor(accessor) {
  const out = [];
  for (let i = accessor.start; i < accessor.end; i++) {
    out.push(i);
  }
  return out;
}
function pathItemsEqual(a, b) {
  if (typeof a === "string" || typeof a === "number") {
    return a === b;
  }
  return isSliceAccessor(a) && isSliceAccessor(b) && a.start === b.start && a.end === b.end;
}
function pathStartsWith(path, prefix) {
  return prefix.length <= path.length && prefix.every((item, index) => pathItemsEqual(path[index], item));
}
function relativizePath(path, prefix) {
  return pathStartsWith(path, prefix) ? path.slice(prefix.length) : path;
}
function deepMerge(a, b) {
  if (typesMatch(a, b, "object" /* object */, "object" /* object */)) {
    const keys2 = new Set(Object.keys(a).concat(Object.keys(b)));
    const entries = [];
    for (let key of keys2) {
      entries.push([key, deepMerge(a[key], b[key])]);
    }
    return Object.fromEntries(entries);
  } else {
    return b === void 0 ? a : b;
  }
}
function deepClone(value) {
  switch (typeOf(value)) {
    case "null" /* null */:
    case "boolean" /* boolean */:
    case "number" /* number */:
    case "string" /* string */:
      return value;
    case "array" /* array */:
      return value.map(deepClone);
    case "object" /* object */:
      return Object.fromEntries(
        Object.entries(value).map(([k, v]) => [
          k,
          deepClone(v)
        ])
      );
  }
}
function shallowClone(value) {
  switch (typeOf(value)) {
    case "null" /* null */:
    case "boolean" /* boolean */:
    case "number" /* number */:
    case "string" /* string */:
      return value;
    case "array" /* array */:
      return [...value];
    case "object" /* object */:
      return { ...value };
  }
}
function getChildPaths(paths) {
  const out = {};
  for (const path of paths.filter((path2) => path2.length > 1)) {
    const accessor = path[0];
    if (isSliceAccessor(accessor)) {
      throw new JqEvaluateError(
        "getChildPaths: Cannot handle paths that are longer than 1, and start in a slice accessor"
      );
    }
    if (!(accessor in out))
      out[accessor] = [];
    out[accessor].push(path.slice(1));
  }
  return out;
}
function delPaths(value, paths) {
  if (paths.length === 0)
    return value;
  const type = typeOf(value);
  if (typeIsOneOf(value, "array" /* array */, "object" /* object */)) {
    let clone = shallowClone(value);
    const normalizedPaths = paths.map(
      (path) => normalizeLeadingSliceAccessors(
        typeOf(value) === "array" /* array */ ? value.length : 0,
        path
      )
    );
    for (const path of normalizedPaths) {
      if (path.length !== 1)
        continue;
      const accessor = path[0];
      access(clone, accessor);
      if (isSliceAccessor(accessor)) {
        const normalizedAccessor = normalizeSliceAccessor(
          value.length,
          accessor
        );
        for (const key of resolveNormalizedSliceAccessor(normalizedAccessor)) {
          delete clone[key];
        }
      } else {
        delete clone[accessor];
      }
    }
    if (type === "array" /* array */)
      clone = clone.filter((item) => item !== void 0);
    for (const [key, childPaths] of Object.entries(
      getChildPaths(normalizedPaths)
    )) {
      if (key in clone)
        clone[key] = delPaths(clone[key], childPaths);
    }
    return clone;
  } else {
    throw new JqEvaluateError(`Cannot delete fields from ${type}`);
  }
}
function* range(a, b, c) {
  let from, upto, by;
  if (b !== void 0 && c !== void 0) {
    from = assertNumber(a);
    upto = assertNumber(b);
    by = assertNumber(c);
  } else if (b !== void 0) {
    from = assertNumber(a);
    upto = assertNumber(b);
    by = 1;
  } else {
    from = 0;
    upto = assertNumber(a);
    by = 1;
  }
  for (let i = from; i < upto; i += by) {
    yield i;
  }
}
function assertNumber(value) {
  if (value === null || value === void 0) {
    return 0;
  }
  if (typeOf(value) !== "number" /* number */) {
    throw new JqEvaluateError(`Got ${typeOf(value)}, number expected`);
  }
  return value;
}
function assertString(value) {
  if (value === null || value === void 0) {
    return "";
  }
  if (typeOf(value) !== "string" /* string */) {
    throw new JqEvaluateError(`Got ${typeOf(value)}, string expected`);
  }
  return value;
}
function keys(value) {
  if (!typeIsOneOf(value, "array" /* array */, "object" /* object */)) {
    throw new JqEvaluateError(`${typeOf(value)} has no keys`);
  }
  if (typeOf(value) === "array" /* array */) {
    return Array.from(range(value.length));
  }
  return Object.keys(value);
}
function has(value, key) {
  if (!typesMatch(value, key, "array" /* array */, "number" /* number */) && !typesMatch(value, key, "object" /* object */, "string" /* string */)) {
    throw new JqEvaluateError(
      `Cannot check whether ${typeOf(value)} has a ${typeOf(key)} key`
    );
  }
  return key in value;
}
function sort(values) {
  return values.sort(compare);
}
function transformRegExpMatch(match) {
  const indices2 = match.indices;
  if (match.index === void 0 || indices2 === void 0)
    throw new JqEvaluateError("RegExp match item transformation error");
  const offset = match.index;
  return {
    offset,
    length: match[0].length,
    string: match[0],
    captures: match.slice(1).map((item, i) => ({
      offset: indices2[i + 1][0],
      length: item.length,
      string: item,
      name: null
    }))
  };
}

// src/jqtools/evaluate/filters/lib/nativeFilter.ts
function wrapBareNativeFilters(impls) {
  return Object.fromEntries(
    Object.entries(impls).map(([key, bareFilter]) => {
      return [
        key,
        (input, ...args) => generateItems(bareFilter(input.value, ...collectValues(args)))
      ];
    })
  );
}
function isNativeFilter(val) {
  return typeof val === "function";
}

export {
  __commonJS,
  __toESM,
  JqParseError,
  JqEvaluateError,
  JqArgumentError,
  notDefinedError,
  notImplementedError,
  cannotSliceError,
  compare,
  createSliceAccessor,
  isSliceAccessor,
  createItem,
  generateItems,
  generateValues,
  generatePaths,
  collectValues,
  typeOf,
  isAtom,
  typesEqual,
  typesMatch,
  typesMatchCommutative,
  typeIsOneOf,
  single,
  isPath,
  isPaths,
  isTrue,
  repeatString,
  recursiveDescent,
  toString,
  indices,
  access,
  normalizeLeadingSliceAccessors,
  relativizePath,
  deepMerge,
  deepClone,
  shallowClone,
  delPaths,
  range,
  assertNumber,
  assertString,
  keys,
  has,
  sort,
  transformRegExpMatch,
  wrapBareNativeFilters,
  isNativeFilter
};
