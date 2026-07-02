// @cardstack/bxl — realm bundle (ESM)
// Built: 2026-05-15T06:24:25.941Z
// Source: /path/to/bxl
// Regenerate: cd /path/to/bxl && npm run realm

import {
  formulaBesselLibrary
} from "./bxl-chunks/chunk-67T3ZFZP.ts";
import {
  formulaStatisticalLibrary
} from "./bxl-chunks/chunk-WOOCVMXB.ts";
import {
  DETERMINISTIC_VALIDATION_FUNCTIONS,
  VALIDATION_FILTERS,
  VOLATILE_VALIDATION_FUNCTIONS,
  canonicalValidationFunctionName,
  sourceUsesValidationFunction,
  validationLibrary
} from "./bxl-chunks/chunk-NCLQR6WZ.ts";
import {
  buildExcelDate,
  excelDatedif,
  excelDatevalue,
  excelDay,
  excelDays360,
  excelMonth,
  excelNetworkdays,
  excelNetworkdaysIntl,
  excelWeeknum,
  excelWorkday,
  excelWorkdayIntl,
  excelYear,
  formulaEngineeringLibrary,
  formulaFinancialLibrary,
  yearFrac
} from "./bxl-chunks/chunk-QNI4UYHB.ts";
import {
  EXCEL_ERROR,
  averageExcelRange,
  countExcelNumbers,
  countExcelValues,
  flattenExcelArgs,
  isExcelBlank,
  maxExcelRange,
  minExcelRange,
  parseExcelBool,
  parseExcelNumber,
  parseExcelNumberArray,
  parseExcelString,
  populationStdDev,
  sampleStdDev,
  sumExcelRange,
  throwExcelError
} from "./bxl-chunks/chunk-URZ4NIDM.ts";
import {
  JqArgumentError,
  JqEvaluateError,
  JqParseError,
  access,
  assertNumber,
  assertString,
  cannotSliceError,
  collectValues,
  compare,
  createItem,
  createSliceAccessor,
  deepClone,
  deepMerge,
  delPaths,
  generateItems,
  generatePaths,
  generateValues,
  has,
  indices,
  isAtom,
  isNativeFilter,
  isPath,
  isPaths,
  isSliceAccessor,
  isTrue,
  keys,
  normalizeLeadingSliceAccessors,
  notDefinedError,
  notImplementedError,
  range,
  recursiveDescent,
  relativizePath,
  repeatString,
  shallowClone,
  single,
  sort,
  toString,
  transformRegExpMatch,
  typeIsOneOf,
  typeOf,
  typesEqual,
  typesMatch,
  typesMatchCommutative,
  wrapBareNativeFilters
} from "./bxl-chunks/chunk-XN3U6IBU.ts";

// src/realm-bundle-entry.ts
import { getFields as _getFields } from "https://cardstack.com/base/card-api";

// src/jqtools/parser/Tokenizer.ts
var Tokenizer = class _Tokenizer {
  constructor(input) {
    this.input = input;
  }
  current = null;
  static tokenTypeToString = {
    punc: "punctuation",
    op: "operator",
    ident: "identifier",
    kw: "keyword",
    format: "format",
    var: "variable",
    str: "string",
    null: "null",
    bool: "boolean",
    num: "number"
  };
  static escapeCharacters = {
    b: "\b",
    f: "\f",
    n: "\n",
    r: "\r",
    t: "	",
    v: "\v",
    "'": "'",
    '"': '"',
    "\\": "\\"
  };
  static keywords = /* @__PURE__ */ new Set([
    "__loc__",
    "and",
    "as",
    "break",
    "catch",
    "def",
    "elif",
    "else",
    "end",
    "foreach",
    "if",
    "import",
    "include",
    "label",
    "module",
    "modulemeta",
    "not",
    "or",
    "reduce",
    "then",
    "try"
  ]);
  static operators = /* @__PURE__ */ new Set([
    "!=",
    "%",
    "%=",
    "*",
    "*=",
    "+",
    "+=",
    ",",
    "-",
    "-=",
    ".",
    "..",
    "/",
    "//",
    "//=",
    "/=",
    "<",
    "<=",
    "=",
    "==",
    ">",
    ">=",
    "?",
    "?//",
    "|",
    "|="
  ]);
  interpolationContexts = [];
  next() {
    const tok = this.current;
    this.current = null;
    return tok || this.readNext();
  }
  peek() {
    return this.current || (this.current = this.readNext());
  }
  eof() {
    return this.peek() === null;
  }
  croak(msg) {
    this.input.restore();
    return this.input.croak(msg);
  }
  toArray() {
    const out = [];
    while (!this.eof()) {
      out.push(this.next());
    }
    return out;
  }
  readNext() {
    if (this.interpolationContextJustExited()) {
      this.input.snapshot();
      this.interpolationContexts.pop();
      return this.readString();
    }
    this.readWhile(_Tokenizer.isWhitespace);
    this.input.snapshot();
    if (this.input.eof())
      return null;
    const c = this.input.peek();
    if (c === "#") {
      this.skipComment();
      return this.readNext();
    }
    if (_Tokenizer.isDigit(c)) {
      return this.readNumber();
    }
    if (c == '"') {
      this.input.next();
      return this.readString();
    }
    if (_Tokenizer.isIdentStart(c)) {
      return this.readIdent();
    }
    if (_Tokenizer.isPuncChar(c)) {
      return this.readPunc();
    }
    if (_Tokenizer.isOpChar(c)) {
      return this.readOp();
    }
    throw this.croak(`Can't handle character: ${c}`);
  }
  readWhile(predicate) {
    let out = "";
    while (!this.input.eof() && predicate(this.input.peek())) {
      out += this.input.next();
    }
    return out;
  }
  skipComment() {
    this.readWhile((c) => c !== "\n");
  }
  readIdent() {
    const ident = this.readWhile(_Tokenizer.isIdentChar);
    if (ident === "null") {
      return { type: "null", value: null };
    }
    if (ident === "true")
      return { type: "bool", value: true };
    if (ident === "false")
      return { type: "bool", value: false };
    return {
      type: _Tokenizer.keywords.has(ident) ? "kw" : ident.charAt(0) === "@" ? "format" : ident.charAt(0) === "$" ? "var" : "ident",
      value: ident
    };
  }
  interpolationContextJustExited() {
    return this.interpolationContexts[this.interpolationContexts.length - 1] === 0;
  }
  updateInterpolationContext(c) {
    const len = this.interpolationContexts.length;
    if (len === 0)
      return;
    if (c === "(") {
      this.interpolationContexts[len - 1]++;
    } else if (c === ")") {
      this.interpolationContexts[len - 1]--;
    }
  }
  readPunc() {
    let value = this.input.next();
    if (value == "\\") {
      if (this.input.peek() !== "(")
        throw this.croak(`Can't handle character: ${this.input.peek()}`);
      value += this.input.next();
      this.interpolationContexts.push(1);
    } else {
      this.updateInterpolationContext(value);
    }
    return { type: "punc", value };
  }
  readOp() {
    let value = this.input.next();
    if (_Tokenizer.operators.has(value + this.input.peek() + this.input.peek(1))) {
      value += this.input.next() + this.input.next();
    } else if (_Tokenizer.operators.has(value + this.input.peek())) {
      value += this.input.next();
    }
    return {
      type: "op",
      value
    };
  }
  readString() {
    let escaped = false;
    let str = "";
    while (!this.input.eof()) {
      if (this.input.peek() == "\\" && this.input.peek(1) === "(") {
        break;
      }
      const c = this.input.next();
      if (escaped) {
        str += this.getEscaped(c);
        escaped = false;
      } else if (c == "\\") {
        escaped = true;
      } else if (c == '"') {
        break;
      } else {
        str += c;
      }
    }
    return {
      type: "str",
      value: str
    };
  }
  readNumber() {
    let hasDot = false;
    return {
      type: "num",
      value: Number(
        this.readWhile((c) => {
          if (c === ".") {
            if (hasDot)
              return false;
            hasDot = true;
            return true;
          }
          return _Tokenizer.isDigit(c);
        })
      )
    };
  }
  static isWhitespace(c) {
    return " 	\n".indexOf(c) >= 0;
  }
  static isOpChar(c) {
    return ".=!|+-*/%?<>,".indexOf(c) >= 0;
  }
  static isPuncChar(c) {
    return "()[]{}:;\\".indexOf(c) >= 0;
  }
  static isDigit(c) {
    return /[0-9]/.test(c);
  }
  static isIdentStart(c) {
    return /[a-zA-Z@$_]/.test(c);
  }
  static isIdentChar(c) {
    return _Tokenizer.isIdentStart(c) || /[0-9]/.test(c);
  }
  getEscaped(c) {
    const key = c;
    if (!_Tokenizer.escapeCharacters[key])
      throw this.croak(`Can't parse an escape character: ${c}`);
    return _Tokenizer.escapeCharacters[key];
  }
  static stringifyTokenType(tokenType) {
    return this.tokenTypeToString[tokenType];
  }
  static stringifyToken(token) {
    if (token === null)
      return "EOF";
    if (["null", "bool", "value"].includes(token.type)) {
      return `${this.tokenTypeToString[token.type]}: ${token.value}`;
    }
    return `${this.tokenTypeToString[token.type]}: "${token.value}"`;
  }
};

// src/jqtools/parser/InputStream.ts
var InputStream = class {
  constructor(input) {
    this.input = input;
  }
  state = {
    pos: 0,
    line: 1,
    col: 0,
    lineStart: 0
  };
  prev = {
    pos: 0,
    line: 1,
    col: 0,
    lineStart: 0
  };
  next() {
    let ch = this.input.charAt(this.state.pos++);
    if (ch == "\n") {
      this.state.line++;
      this.state.col = 0;
      this.state.lineStart = this.state.pos;
    } else {
      this.state.col++;
    }
    return ch;
  }
  peek(offset = 0) {
    return this.input.charAt(this.state.pos + offset);
  }
  eof() {
    return this.peek() == "";
  }
  croak(msg) {
    return new JqParseError(
      `${msg} (${this.state.line}:${this.state.col})

${this.getLine()}
${this.getErrorPointer()}`
    );
  }
  snapshot() {
    this.prev = { ...this.state };
  }
  restore() {
    this.state = { ...this.prev };
  }
  getLine() {
    let i = 0;
    while (!["\n", ""].includes(this.input.charAt(this.state.pos + i))) {
      i++;
    }
    return this.input.substring(this.state.lineStart, this.state.pos + i);
  }
  getErrorPointer() {
    let out = "";
    for (let i = 0; i < this.state.col; i++) {
      out += "-";
    }
    out += "^";
    return out;
  }
};

// src/jqtools/parser/Parser.ts
var Parser = class _Parser {
  constructor(input) {
    this.input = input;
  }
  static precedence = {
    "|": 1,
    ",": 2,
    "//": 3,
    "=": 4,
    "|=": 4,
    "+=": 4,
    "-=": 4,
    "*=": 4,
    "/=": 4,
    "%=": 4,
    "//=": 4,
    or: 5,
    and: 6,
    "==": 7,
    "!=": 7,
    "<": 7,
    ">": 7,
    "<=": 7,
    ">=": 7,
    "+": 8,
    "-": 8,
    "*": 9,
    "/": 9,
    "%": 9,
    "?//": 10
  };
  static getPrecedence(op) {
    return _Parser.precedence[op];
  }
  static normalizeBinaryAst(ast) {
    if (ast.right.type === "binary" && !ast.right.parenthesized && this.getPrecedence(ast.operator) === this.getPrecedence(ast.right.operator)) {
      return this.normalizeBinaryAst({
        type: "binary",
        left: this.normalizeBinaryAst({
          type: "binary",
          left: ast.left,
          operator: ast.operator,
          right: ast.right.left
        }),
        operator: ast.right.operator,
        right: ast.right.right.type === "binary" ? this.normalizeBinaryAst(ast.right.right) : ast.right.right
      });
    }
    return ast;
  }
  static getFilterName(ident, arity) {
    return `${ident}/${arity}`;
  }
  static getFilterIdent(filterName) {
    return filterName.split("/")[0];
  }
  static getFilterArity(filterName) {
    return Number(filterName.split("/")[1]);
  }
  parse() {
    return this.parseTopLevel();
  }
  unexpected() {
    return this.input.croak(
      `Unexpected ${Tokenizer.stringifyToken(this.input.peek())}`
    );
  }
  expected(type, value) {
    const peek = this.input.peek();
    return this.input.croak(
      `Expected ${value ? Tokenizer.stringifyToken({ type, value }) : Tokenizer.stringifyTokenType(type)}, received ${Tokenizer.stringifyToken(peek)}`
    );
  }
  is(type, val) {
    const token = this.input.peek();
    return (token && token.type === type && (!val || val === token.value) || null) && token;
  }
  skip(type, val) {
    if (this.is(type, val)) {
      return this.input.next();
    } else {
      throw this.expected(type, val);
    }
  }
  isKw(val) {
    return this.is("kw", val);
  }
  isVar(val) {
    return this.is("var", val);
  }
  isIdent(val) {
    return this.is("ident", val);
  }
  isFormat(val) {
    return this.is("format", val);
  }
  isPunc(val) {
    return this.is("punc", val);
  }
  isOp(val) {
    return this.is("op", val);
  }
  isBool(val) {
    return this.is("bool", val);
  }
  isStr(val) {
    return this.is("str", val);
  }
  isNum(val) {
    return this.is("num", val);
  }
  isNull() {
    return this.is("null");
  }
  skipPunc(val) {
    return this.skip("punc", val);
  }
  skipKw(val) {
    return this.skip("kw", val);
  }
  skipVar(val) {
    return this.skip("var", val);
  }
  skipFormat(val) {
    return this.skip("format", val);
  }
  skipIdent(val) {
    return this.skip("ident", val);
  }
  skipOp(val) {
    return this.skip("op", val);
  }
  skipBool(val) {
    return this.skip("bool", val);
  }
  skipStr(val) {
    return this.skip("str", val);
  }
  skipNum(val) {
    return this.skip("num", val);
  }
  skipNull() {
    return this.skip("null");
  }
  parseTopLevel() {
    let expression2;
    if (!this.input.eof()) {
      expression2 = this.parseExpression();
    }
    if (!this.input.eof()) {
      throw this.unexpected();
    }
    return { type: "root", expr: expression2 };
  }
  parseDef() {
    this.skipKw("def");
    const nameIdent = this.skipIdent().value;
    const args = this.isPunc("(") ? this.delimited("(", ")", ";", () => this.parseArgName()) : [];
    const name = _Parser.getFilterName(nameIdent, args.length);
    this.skipPunc(":");
    const body = this.parseExpression();
    this.skipPunc(";");
    let out = {
      type: "def",
      name,
      args,
      body
    };
    if (!this.input.eof()) {
      out.next = this.parseExpression();
    }
    return out;
  }
  delimited(start, stop, separator, parser, minCount = 0, maxCount, allowTrailingSeparator) {
    this.skipPunc(start);
    const out = [];
    let first = true;
    let count = 0;
    while (count < minCount || !this.input.eof() && !this.isPunc(stop) && (!maxCount || count < maxCount)) {
      if (!first) {
        if (typeof separator === "string")
          this.skipPunc(separator);
        else
          this.skipOp(separator.value);
      }
      if (allowTrailingSeparator && this.isPunc(stop)) {
        break;
      }
      out.push(parser());
      first = false;
      count++;
    }
    if (allowTrailingSeparator) {
      if (typeof separator === "string") {
        if (this.isPunc(separator))
          this.skipPunc(separator);
      } else {
        if (this.isOp(separator.value))
          this.skipOp(separator.value);
      }
    }
    this.skipPunc(stop);
    return out;
  }
  parseArgName() {
    const token = this.input.next();
    switch (token?.type) {
      case "ident":
        return {
          type: "filterArg",
          name: _Parser.getFilterName(token.value, 0)
        };
      case "var":
        return { type: "varArg", name: token.value };
    }
    throw this.input.croak("Expecting argument name");
  }
  parseExpression(ignoreOp) {
    return this.maybeBinary(this.parseAtomOrControlStructure(), 0, ignoreOp);
  }
  maybeShortTry(cb) {
    const expr2 = cb();
    if (this.isOp("?")) {
      this.skipOp("?");
      const shortTry = {
        type: "try",
        short: true,
        body: expr2
      };
      return this.atomMaybe(() => shortTry);
    }
    return expr2;
  }
  parseAtomOrControlStructure() {
    if (this.isKw("label"))
      return this.parseLabel();
    if (this.isKw("break"))
      return this.parseBreak();
    if (this.isKw("try"))
      return this.parseTry();
    if (this.isKw("if"))
      return this.parseIf();
    if (this.isKw("reduce"))
      return this.parseReduce();
    if (this.isKw("foreach"))
      return this.parseForeach();
    return this.parseAtom(true);
  }
  parseAtom(maybeVariable) {
    if (this.isKw("def")) {
      return this.parseDef();
    }
    if (this.isOp("-"))
      return {
        type: "unary",
        operator: this.skipOp("-").value,
        expr: this.parseAtomOrControlStructure()
      };
    const maybe = () => this.atomMaybe(() => {
      if (this.isPunc("(")) {
        this.input.next();
        const exp = this.parseExpression();
        this.skipPunc(")");
        if (exp.type === "binary") {
          exp.parenthesized = true;
        }
        return exp;
      }
      if (this.isOp("."))
        return this.parseIdentity();
      if (this.isOp(".."))
        return this.parseRecursiveDescent();
      if (this.isPunc("["))
        return this.parseArray();
      if (this.isPunc("{"))
        return this.parseObject();
      if (this.isVar())
        return this.parseVar();
      if (this.isIdent() || this.isKw("not"))
        return this.parseFilter();
      if (this.isFormat())
        return this.parseFormat();
      if (this.isStr())
        return this.parseStr();
      if (this.isNum() || this.isBool() || this.isNull()) {
        return this.input.next();
      }
      throw this.unexpected();
    });
    return maybeVariable ? this.maybeVariable(maybe) : maybe();
  }
  maybeBinary(left, parentPrecedence = 0, ignoreOp = []) {
    const op = this.isOp() || this.isKw("and") || this.isKw("or");
    if (op && !ignoreOp.includes(op.value)) {
      const precedence = _Parser.getPrecedence(op.value);
      if (precedence > parentPrecedence) {
        this.input.next();
        return this.maybeBinary(
          _Parser.normalizeBinaryAst({
            type: "binary",
            operator: op.value,
            left,
            right: this.maybeBinary(
              this.parseAtomOrControlStructure(),
              precedence,
              ignoreOp
            )
          }),
          parentPrecedence,
          ignoreOp
        );
      }
    }
    return left;
  }
  parseIdentity() {
    this.skipOp(".");
    return { type: "identity" };
  }
  parseRecursiveDescent() {
    this.skipOp("..");
    return { type: "recursiveDescent" };
  }
  atomMaybe(cb) {
    return this.maybeShortTry(
      () => this.maybeBracketIndex(() => this.maybeSimpleIndex(cb))
    );
  }
  maybeVariable(cb) {
    const expr2 = cb();
    if (this.isKw("as")) {
      this.skipKw("as");
      const destructuring = [this.parseDestructuring()];
      while (this.isOp("?//")) {
        this.skipOp("?//");
        destructuring.push(this.parseDestructuring());
      }
      this.skipOp("|");
      const child = this.parseExpression();
      const varDeclaration = {
        type: "varDeclaration",
        expr: expr2,
        destructuring,
        next: child
      };
      return varDeclaration;
    }
    return expr2;
  }
  parseDestructuring() {
    if (this.isPunc("[")) {
      return this.parseArrayDestructuring();
    } else if (this.isPunc("{")) {
      return this.parseObjectDestructuring();
    }
    return this.parseVar();
  }
  parseArrayDestructuring() {
    return {
      type: "arrayDestructuring",
      destructuring: this.delimited(
        "[",
        "]",
        { type: "op", value: "," },
        () => this.parseDestructuring()
      )
    };
  }
  parseObjectDestructuring() {
    return {
      type: "objectDestructuring",
      entries: this.delimited("{", "}", { type: "op", value: "," }, () => {
        if (this.isVar())
          return { key: this.parseVar() };
        let key;
        if (this.isIdent()) {
          key = this.skipIdent().value;
        } else if (this.isPunc("(")) {
          this.skipPunc("(");
          key = this.parseExpression();
          this.skipPunc(")");
        } else {
          key = this.parseStr();
        }
        this.skipPunc(":");
        return {
          key,
          destructuring: this.parseDestructuring()
        };
      })
    };
  }
  maybeBracketIndex(cb) {
    const expr2 = cb();
    if (this.isPunc("[")) {
      let out;
      this.skipPunc("[");
      if (this.isPunc("]")) {
        out = { type: "iterator", expr: expr2 };
      } else {
        const from = this.isPunc(":") ? void 0 : this.parseExpression();
        if (this.isPunc(":")) {
          this.skipPunc(":");
          const to = this.isPunc("]") ? void 0 : this.parseExpression();
          out = { type: "slice", expr: expr2, from, to };
        } else {
          out = { type: "index", expr: expr2, index: from };
        }
      }
      this.skipPunc("]");
      return this.atomMaybe(() => out);
    }
    return expr2;
  }
  maybeSimpleIndex(cb) {
    const expr2 = cb();
    if (expr2.type !== "identity" && this.isOp(".")) {
      this.skipOp(".");
    }
    if (this.isStr() || this.isIdent()) {
      const index = {
        type: "index",
        expr: expr2,
        index: this.isStr() ? this.parseStr() : this.skipIdent().value
      };
      return this.atomMaybe(() => index);
    }
    return expr2;
  }
  parseVar() {
    return { type: "var", name: this.skipVar().value };
  }
  parseFilter() {
    const nameIdent = this.isKw("not") ? this.skipKw().value : this.skipIdent().value;
    const args = this.isPunc("(") ? this.delimited("(", ")", ";", () => this.parseExpression()) : [];
    const name = _Parser.getFilterName(nameIdent, args.length);
    return { type: "filter", name, args };
  }
  parseFormat() {
    const format = this.skipFormat();
    const ast = {
      type: "format",
      name: format.value
    };
    if (this.isStr()) {
      return this.parseStr(ast);
    }
    return ast;
  }
  parseArray() {
    this.skipPunc("[");
    if (this.isPunc("]")) {
      this.skipPunc("]");
      return { type: "array" };
    }
    const expr2 = this.parseExpression();
    this.skipPunc("]");
    return { type: "array", expr: expr2 };
  }
  parseObject() {
    return {
      type: "object",
      entries: this.delimited(
        "{",
        "}",
        { type: "op", value: "," },
        () => this.parseEntry(),
        void 0,
        void 0,
        true
      )
    };
  }
  parseEntry() {
    let key;
    if (this.isIdent() || this.isKw()) {
      key = this.isIdent() ? this.skipIdent().value : this.skipKw().value;
      if (!this.isPunc(":")) {
        return { key };
      }
    } else if (this.isPunc("(")) {
      this.skipPunc("(");
      key = this.parseExpression();
      this.skipPunc(")");
    } else if (this.isStr()) {
      key = this.parseStr();
    } else {
      throw this.unexpected();
    }
    this.skipPunc(":");
    const value = this.parseExpression([","]);
    return { key, value };
  }
  parseStr(format) {
    const start = this.skipStr();
    let out;
    if (this.isPunc("\\(")) {
      const parts = [start.value];
      while (this.isPunc("\\(")) {
        parts.push(this.parseInterpolation());
        parts.push(this.skipStr().value);
      }
      out = {
        type: "str",
        interpolated: true,
        parts: parts.filter((x) => x !== "")
      };
    } else {
      out = {
        type: "str",
        interpolated: false,
        value: start.value
      };
    }
    if (format)
      out.format = format;
    return out;
  }
  parseInterpolation() {
    this.skipPunc("\\(");
    const expr2 = this.parseExpression();
    this.skipPunc(")");
    return expr2;
  }
  parseIf() {
    this.skipKw("if");
    const cond = this.parseExpression();
    this.skipKw("then");
    const then = this.parseExpression();
    const elifs = [];
    while (this.isKw("elif")) {
      this.skipKw("elif");
      const cond2 = this.parseExpression();
      this.skipKw("then");
      const then2 = this.parseExpression();
      elifs.push({ cond: cond2, then: then2 });
    }
    let elseExpr;
    if (this.isKw("else")) {
      this.skipKw("else");
      elseExpr = this.parseExpression();
    }
    this.skipKw("end");
    return {
      type: "if",
      cond,
      then,
      elifs: elifs.length > 0 ? elifs : void 0,
      else: elseExpr
    };
  }
  parseTry() {
    this.skipKw("try");
    const body = this.parseExpression();
    let catchExpr;
    if (this.isKw("catch")) {
      this.skipKw("catch");
      catchExpr = this.parseExpression();
    }
    return { type: "try", short: false, body, catch: catchExpr };
  }
  parseLabel() {
    this.skipKw("label");
    const value = this.skipVar().value;
    this.skipOp("|");
    const next = this.parseExpression();
    return { type: "label", value, next };
  }
  parseBreak() {
    this.skipKw("break");
    return { type: "break", value: this.skipVar().value };
  }
  parseReduce() {
    this.skipKw("reduce");
    const expr2 = this.parseAtom(false);
    this.skipKw("as");
    const varName = this.skipVar().value;
    const args = this.delimited(
      "(",
      ")",
      ";",
      () => this.parseExpression(),
      2,
      2
    );
    return {
      type: "reduce",
      expr: expr2,
      var: varName,
      init: args[0],
      update: args[1]
    };
  }
  parseForeach() {
    this.skipKw("foreach");
    const expr2 = this.parseAtom(false);
    this.skipKw("as");
    const varName = this.skipVar().value;
    const args = this.delimited(
      "(",
      ")",
      ";",
      () => this.parseExpression(),
      2,
      3
    );
    return {
      type: "foreach",
      expr: expr2,
      var: varName,
      init: args[0],
      update: args[1],
      extract: args[2]
    };
  }
};
function parse(code) {
  return new Parser(new Tokenizer(new InputStream(code))).parse();
}

// src/jqtools/evaluate/filters/lib/parseBuiltinJqFilters.ts
function parseBuiltinJqFilters(code) {
  const out = {};
  let ast = parse(code).expr;
  while (ast) {
    if (ast.type !== "def") {
      throw new JqEvaluateError("Could not parse the built-in jq filters");
    }
    out[ast.name] = ast;
    ast = ast.next;
  }
  return out;
}

// src/jqtools/evaluate/filters/builtinJqFilters.ts
var builtinJqFilters = parseBuiltinJqFilters(`
def halt_error: halt_error(5);
def error(msg): msg|error;
def map(f): [.[] | f];
def select(f): if f then . else empty end;
def sort_by(f): _sort_by_impl(map([f]));
def group_by(f): _group_by_impl(map([f]));
def unique: group_by(.) | map(.[0]);
def unique_by(f): group_by(f) | map(.[0]);
def max_by(f): _max_by_impl(map([f]));
def min_by(f): _min_by_impl(map([f]));
def add(f): reduce f as $x (null; . + $x);
def add: reduce .[] as $x (null; . + $x);
def abs: if . < 0 then - . else . end;
def del(f): delpaths([path(f)]);
def _assign(paths; $value): reduce path(paths) as $p (.; setpath($p; $value));
def _modify(paths; update):
    reduce path(paths) as $p (.;
        . as $dot
      | null
      | label $out
      | ($dot | getpath($p)) as $v
      | (
          (   $v
            | update
            | (., break $out) as $v
            | $dot
            | setpath($p; $v)
          ),
          (
              $dot
            | delpaths([$p])
          )
        )
    );
def map_values(f): .[] |= f;

# recurse
def recurse(f): def r: ., (f | r); r;
def recurse(f; cond): def r: ., (f | select(cond) | r); r;
def recurse: recurse(.[]?);
def recurse_down: recurse;

def to_entries: [keys_unsorted[] as $k | {key: $k, value: .[$k]}];
def from_entries: map({(.key // .Key // .name // .Name): (if has("value") then .value else .Value end)}) | add | .//={};
def with_entries(f): to_entries | map(f) | from_entries;
def reverse: [.[length - 1 - range(0;length)]];
def indices($i): if type == "array" and ($i|type) == "array" then .[$i]
  elif type == "array" then .[[$i]]
  elif type == "string" and ($i|type) == "string" then _strindices($i)
  else .[$i] end;
def index($i):   indices($i) | .[0];       # TODO: optimize
def rindex($i):  indices($i) | .[-1:][0];  # TODO: optimize
def paths: path(recurse(if (type|. == "array" or . == "object") then .[] else empty end))|select(length > 0);
def paths(node_filter): . as $dot|paths|select(. as $p|$dot|getpath($p)|node_filter);
def isfinite: type == "number" and (isinfinite | not);
def arrays: select(type == "array");
def objects: select(type == "object");
def iterables: select(type|. == "array" or . == "object");
def booleans: select(type == "boolean");
def numbers: select(type == "number");
def normals: select(isnormal);
def finites: select(isfinite);
def strings: select(type == "string");
def nulls: select(. == null);
def values: select(. != null);
def scalars: select(type|. != "array" and . != "object");
def leaf_paths: paths(scalars);
def join($x): reduce .[] as $i (null;
            (if .==null then "" else .+$x end) +
            ($i | if type=="boolean" or type=="number" then tostring else .//"" end)
        ) // "";
def _flatten($x): reduce .[] as $i ([]; if $i | type == "array" and $x != 0 then . + ($i | _flatten($x-1)) else . + [$i] end);
def flatten($x): if $x < 0 then error("flatten depth must not be negative") else _flatten($x) end;
def flatten: _flatten(-1);
def range($x): range(0;$x);
def fromdateiso8601: strptime("%Y-%m-%dT%H:%M:%SZ")|mktime;
def todateiso8601: strftime("%Y-%m-%dT%H:%M:%SZ");
def fromdate: fromdateiso8601;
def todate: todateiso8601;
def match(re; mode): _match_impl(re; mode; false)|.[];
def match($val): ($val|type) as $vt | if $vt == "string" then match($val; null)
   elif $vt == "array" and ($val | length) > 1 then match($val[0]; $val[1])
   elif $vt == "array" and ($val | length) > 0 then match($val[0]; null)
   else error( $vt + " not a string or array") end;
def test(re; mode): _match_impl(re; mode; true);
def test($val): ($val|type) as $vt | if $vt == "string" then test($val; null)
   elif $vt == "array" and ($val | length) > 1 then test($val[0]; $val[1])
   elif $vt == "array" and ($val | length) > 0 then test($val[0]; null)
   else error( $vt + " not a string or array") end;
def capture(re; mods): match(re; mods) | reduce ( .captures | .[] | select(.name != null) | { (.name) : .string } ) as $pair ({}; . + $pair);
def capture($val): ($val|type) as $vt | if $vt == "string" then capture($val; null)
   elif $vt == "array" and ($val | length) > 1 then capture($val[0]; $val[1])
   elif $vt == "array" and ($val | length) > 0 then capture($val[0]; null)
   else error( $vt + " not a string or array") end;
def scan($re; $flags):
  match($re; if $flags == null then "g" else "g" + $flags end)
  | if (.captures|length > 0)
      then [ .captures | .[] | .string ]
      else .string
      end;
def scan($re): scan($re; null);
#
# If input is an array, then emit a stream of successive subarrays of length n (or less),
# and similarly for strings.
def _nwise(a; $n): if a|length <= $n then a else a[0:$n] , _nwise(a[$n:]; $n) end;
def _nwise($n): _nwise(.; $n);
#
# splits/1 produces a stream; split/1 is retained for backward compatibility.
def splits($re; flags): . as $s
#  # multiple occurrences of "g" are acceptable
  | [ match($re; "g" + flags) | (.offset, .offset + .length) ]
  | [0] + . +[$s|length]
  | _nwise(2)
  | $s[.[0]:.[1] ] ;
def splits($re): splits($re; null);
#
# split emits an array for backward compatibility
def split($re; flags): [ splits($re; flags) ];
#
# If s contains capture variables, then create a capture object and pipe it to s
def sub($re; s):
  . as $in
  | [match($re)]
  | if length == 0 then $in
    else .[0]
    | . as $r
#  # create the "capture" object:
    | reduce ( $r | .captures | .[] | select(.name != null) | { (.name) : .string } ) as $pair
        ({}; . + $pair)
    | $in[0:$r.offset] + s + $in[$r.offset+$r.length:]
    end ;
#
# If s contains capture variables, then create a capture object and pipe it to s
def sub($re; s; flags):
  def subg: [explode[] | select(. != 103)] | implode;
  # "fla" should be flags with all occurrences of g removed; gs should be non-nil if flags has a g
  def sub1(fla; gs):
    def mysub:
      . as $in
      | [match($re; fla)]
      | if length == 0 then $in
        else .[0] as $edit
        | ($edit | .offset + .length) as $len
        # create the "capture" object:
        | reduce ( $edit | .captures | .[] | select(.name != null) | { (.name) : .string } ) as $pair
            ({}; . + $pair)
        | $in[0:$edit.offset]
          + s
          + ($in[$len:] | if length > 0 and gs then mysub else . end)
        end ;
    mysub ;
    (flags | index("g")) as $gs
    | (flags | if $gs then subg else . end) as $fla
    | sub1($fla; $gs);
#
def sub($re; s): sub($re; s; "");
# repeated substitution of re (which may contain named captures)
def gsub($re; s; flags): sub($re; s; flags + "g");
def gsub($re; s): sub($re; s; "g");

########################################################################
# generic iterator/generator
def while(cond; update):
     def _while:
         if cond then ., (update | _while) else empty end;
     _while;
def until(cond; next):
     def _until:
         if cond then . else (next|_until) end;
     _until;
def limit($n; exp):
    if $n > 0 then label $out | foreach exp as $item ($n; .-1; $item, if . <= 0 then break $out else empty end)
    elif $n == 0 then empty
    else error("limit doesn't support negative count") end;
def skip($n; exp):
    if $n > 0 then foreach exp as $item ($n; . - 1; if . < 0 then $item else empty end)
    elif $n == 0 then exp
    else error("skip doesn't support negative count") end;
# range/3, with a \`by\` expression argument
def range($init; $upto; $by):
    if $by > 0 then $init|while(. < $upto; . + $by)
  elif $by < 0 then $init|while(. > $upto; . + $by)
  else empty end;
def first(g): label $out | g | ., break $out;
def isempty(g): first((g|false), true);
def all(generator; condition): isempty(generator|condition and empty);
def any(generator; condition): isempty(generator|condition or empty)|not;
def all(condition): all(.[]; condition);
def any(condition): any(.[]; condition);
def all: all(.[]; .);
def any: any(.[]; .);
def last(g): reduce g as $item (null; $item);
def nth($n; g): if $n < 0 then error("nth doesn't support negative indices") else last(limit($n + 1; g)) end;
def first: .[0];
def last: .[-1];
def nth($n): .[$n];
def combinations:
    if length == 0 then [] else
        .[0][] as $x
          | (.[1:] | combinations) as $y
          | [$x] + $y
    end;
def combinations(n):
    . as $dot
      | [range(n) | $dot]
      | combinations;
# transpose a possibly jagged matrix, quickly;
# rows are padded with nulls so the result is always rectangular.
def transpose:
  if . == [] then []
  else . as $in
  | (map(length) | max) as $max
  | length as $length
  | reduce range(0; $max) as $j
      ([]; . + [reduce range(0;$length) as $i ([]; . + [ $in[$i][$j] ] )] )
  end;
def in(xs): . as $x | xs | has($x);
def inside(xs): . as $x | xs | contains($x);
def repeat(exp):
     def _repeat:
         exp, _repeat;
     _repeat;
def inputs: try repeat(input) catch if .=="break" then empty else error end;
# ensure the output of debug(m1,m2) is kept together:
def debug(msgs): (msgs | debug | empty), .;
# like ruby's downcase - only characters A to Z are affected
def ascii_downcase:
  explode | map( if 65 <= . and . <= 90 then . + 32  else . end) | implode;
# like ruby's upcase - only characters a to z are affected
def ascii_upcase:
  explode | map( if 97 <= . and . <= 122 then . - 32  else . end) | implode;

# Streaming utilities
def truncate_stream(stream):
  . as $n | null | stream | . as $input | if (.[0]|length) > $n then setpath([0];$input[0][$n:]) else empty end;
def fromstream(i): {x: null, e: false} as $init |
  # .x = object being built; .e = emit and reset state
  foreach i as $i ($init
  ; if .e then $init else . end
  | if $i|length == 2
    then setpath(["e"]; $i[0]|length==0) | setpath(["x"]+$i[0]; $i[1])
    else setpath(["e"]; $i[0]|length==1) end
  ; if .e then .x else empty end);
def tostream:
  path(def r: (.[]?|r), .; r) as $p |
  getpath($p) |
  reduce path(.[]?) as $q ([$p, .]; [$p+$q]);


# Assuming the input array is sorted, bsearch/1 returns
# the index of the target if the target is in the input array; and otherwise
#  (-1 - ix), where ix is the insertion point that would leave the array sorted.
# If the input is not sorted, bsearch will terminate but with irrelevant results.
def bsearch($target):
  if length == 0 then -1
  elif length == 1 then
     if $target == .[0] then 0 elif $target < .[0] then -1 else -2 end
  else . as $in
    # state variable: [start, end, answer]
    # where start and end are the upper and lower offsets to use.
    | [0, length-1, null]
    | until( .[0] > .[1] ;
             if .[2] != null then (.[1] = -1)               # i.e. break
             else
               ( ( (.[1] + .[0]) / 2 ) | floor ) as $mid
               | $in[$mid] as $monkey
               | if $monkey == $target  then (.[2] = $mid)   # success
                 elif .[0] == .[1]     then (.[1] = -1)     # failure
                 elif $monkey < $target then (.[0] = ($mid + 1))
                 else (.[1] = ($mid - 1))
                 end
             end )
    | if .[2] == null then          # compute the insertion point
         if $in[ .[0] ] < $target then (-2 -.[0])
         else (-1 -.[0])
         end
      else .[2]
      end
  end;

# Apply f to composite entities recursively, and to atoms
def walk(f):
  . as $in
  | if type == "object" then
      reduce keys_unsorted[] as $key
        ( {}; . + { ($key):  ($in[$key] | walk(f)) } ) | f
  elif type == "array" then map( walk(f) ) | f
  else f
  end;

# pathexps could be a stream of dot-paths
def pick(pathexps):
  . as $in
  | reduce path(pathexps) as $a (null;
      setpath($a; $in|getpath($a)) );

# SQL-ish operators here:
def INDEX(stream; idx_expr):
  reduce stream as $row ({}; .[$row|idx_expr|tostring] = $row);
def INDEX(idx_expr): INDEX(.[]; idx_expr);
def JOIN($idx; idx_expr):
  [.[] | [., $idx[idx_expr]]];
def JOIN($idx; stream; idx_expr):
  stream | [., $idx[idx_expr]];
def JOIN($idx; stream; idx_expr; join_expr):
  stream | [., $idx[idx_expr]] | join_expr;
def IN(s): any(s == .; .);
def IN(src; s): any(src == s; .);
`);

// src/jqtools/evaluate/utils/getPath.ts
function getPath(input, path) {
  if (path.length === 0)
    return input;
  const type = typeOf(input);
  const normalizedPath = normalizeLeadingSliceAccessors(
    type === "array" /* array */ ? input.length : 0,
    path
  );
  const accessor = normalizedPath[0];
  if (input === void 0 || input === null) {
    input = typeOf(accessor) === "string" /* string */ ? {} : [];
  }
  access(input, accessor);
  if (normalizedPath.length === 1) {
    if (isSliceAccessor(accessor)) {
      return input.slice(accessor.start, accessor.end);
    } else {
      return input[accessor] ?? null;
    }
  } else {
    if (isSliceAccessor(accessor)) {
      throw new JqEvaluateError(
        "getPath: Leading slice accessors are not normalized"
      );
    }
    return getPath(input[accessor], normalizedPath.slice(1));
  }
}

// src/jqtools/evaluate/utils/setPath.ts
function setPath(input, path, value) {
  if (path.length === 0)
    return value;
  const type = typeOf(input);
  const normalizedPath = normalizeLeadingSliceAccessors(
    type === "array" /* array */ ? input.length : 0,
    path
  );
  const accessor = normalizedPath[0];
  let clone = input === void 0 || input === null ? typeOf(accessor) === "string" /* string */ ? {} : [] : shallowClone(input);
  access(clone, accessor);
  if (normalizedPath.length === 1) {
    if (isSliceAccessor(accessor)) {
      if (typeOf(value) !== "array" /* array */) {
        throw new JqEvaluateError(
          `An array slice can only be assigned an array`
        );
      }
      clone.splice(accessor.start, accessor.end - accessor.start, ...value);
    } else {
      clone[accessor] = value;
    }
  } else {
    if (isSliceAccessor(accessor)) {
      throw new JqEvaluateError(
        "setPath: Leading slice accessors are not normalized"
      );
    }
    clone[accessor] = setPath(clone[accessor], normalizedPath.slice(1), value);
  }
  return clone;
}

// src/jqtools/evaluate/applyFormat.ts
var URI_UNRESERVED = /^[A-Za-z0-9\-._~]$/;
function typeDescription(value) {
  return `${typeOf(value)} (${toString(value)})`;
}
function jsonEncode(value) {
  const encoded = JSON.stringify(value);
  return encoded ?? "null";
}
function escapeHtml(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&apos;").replace(/"/g, "&quot;");
}
function percentEncode(value) {
  let output = "";
  for (const byte of new TextEncoder().encode(value)) {
    const char = String.fromCharCode(byte);
    if (URI_UNRESERVED.test(char)) {
      output += char;
    } else {
      output += `%${byte.toString(16).toUpperCase().padStart(2, "0")}`;
    }
  }
  return output;
}
function percentDecode(value) {
  try {
    return decodeURIComponent(value);
  } catch (_error) {
    throw new JqEvaluateError(
      `${typeDescription(value)} is not a valid uri encoding`
    );
  }
}
function encodeBase64(value) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}
function decodeBase64(value) {
  try {
    const binary = atob(value);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch (_error) {
    throw new JqEvaluateError(
      `${typeDescription(value)} is not valid base64 data`
    );
  }
}
function formatTabularValue(value, mode) {
  if (typeOf(value) !== "array" /* array */) {
    throw new JqEvaluateError(
      `${typeDescription(value)} cannot be ${mode}-formatted, only array`
    );
  }
  return value.map((cell) => {
    switch (typeOf(cell)) {
      case "null" /* null */:
        return "";
      case "boolean" /* boolean */:
        return jsonEncode(cell);
      case "number" /* number */:
        return Number.isNaN(cell) ? "" : jsonEncode(cell);
      case "string" /* string */:
        if (mode === "csv") {
          return `"${cell.replace(/"/g, '""')}"`;
        }
        return cell.replace(/\\/g, "\\\\").replace(/\t/g, "\\t").replace(/\r/g, "\\r").replace(/\n/g, "\\n");
      default:
        throw new JqEvaluateError(
          `${typeDescription(cell)} is not valid in a ${mode} row`
        );
    }
  }).join(mode === "csv" ? "," : "	");
}
function formatShellValue(value) {
  const values = typeOf(value) === "array" /* array */ ? value : [value];
  return values.map((entry) => {
    switch (typeOf(entry)) {
      case "null" /* null */:
      case "boolean" /* boolean */:
      case "number" /* number */:
        return jsonEncode(entry);
      case "string" /* string */:
        return `'${entry.replace(/'/g, `'\\''`)}'`;
      default:
        throw new JqEvaluateError(
          `${typeDescription(entry)} can not be escaped for shell`
        );
    }
  }).join(" ");
}
function formatterFor(name) {
  switch (name.startsWith("@") ? name.slice(1) : name) {
    case "text":
      return (value) => toString(value);
    case "json":
      return (value) => jsonEncode(value);
    case "html":
      return (value) => escapeHtml(toString(value));
    case "uri":
      return (value) => percentEncode(toString(value));
    case "urid":
      return (value) => percentDecode(toString(value));
    case "csv":
      return (value) => formatTabularValue(value, "csv");
    case "tsv":
      return (value) => formatTabularValue(value, "tsv");
    case "sh":
      return (value) => formatShellValue(value);
    case "base64":
      return (value) => encodeBase64(toString(value));
    case "base64d":
      return (value) => decodeBase64(toString(value));
    default:
      return void 0;
  }
}
function applyNamedFormat(name, value) {
  const formatter = formatterFor(name);
  if (!formatter) {
    throw new JqEvaluateError(`${name} is not a valid format`);
  }
  return formatter(value);
}
function applyFormat(format, value) {
  if (format === void 0)
    return toString(value);
  const formatter = formatterFor(format.name);
  if (!formatter)
    throw notDefinedError(format.name);
  return formatter(value);
}

// src/jqtools/evaluate/dateTime.ts
var MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
var MONTH_ABBREVIATIONS = MONTH_NAMES.map((name) => name.slice(0, 3));
var WEEKDAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];
var WEEKDAY_ABBREVIATIONS = WEEKDAY_NAMES.map((name) => name.slice(0, 3));
function pad(value, width = 2) {
  return Math.trunc(value).toString().padStart(width, "0");
}
function fractionalSeconds(epochSeconds) {
  return epochSeconds - Math.floor(epochSeconds);
}
function makeDate(year, month, day, hour, minute, second, millisecond, mode) {
  const date = /* @__PURE__ */ new Date(0);
  if (mode === "utc") {
    date.setUTCFullYear(year, month, day);
    date.setUTCHours(hour, minute, second, millisecond);
  } else {
    date.setFullYear(year, month, day);
    date.setHours(hour, minute, second, millisecond);
  }
  return date;
}
function dayOfYear(date, mode) {
  const year = mode === "utc" ? date.getUTCFullYear() : date.getFullYear();
  const start = makeDate(year, 0, 1, 0, 0, 0, 0, mode);
  return Math.floor((date.getTime() - start.getTime()) / 864e5);
}
function localOffsetMinutes(date) {
  return -date.getTimezoneOffset();
}
function localZoneName(date) {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZoneName: "short"
    }).formatToParts(date);
    return parts.find((part) => part.type === "timeZoneName")?.value ?? "UTC";
  } catch (_error) {
    return "UTC";
  }
}
function offsetToString(offsetMinutes) {
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const absolute = Math.abs(offsetMinutes);
  const hours = Math.floor(absolute / 60);
  const minutes = absolute % 60;
  return `${sign}${pad(hours)}${pad(minutes)}`;
}
function assertFiniteDate(date, label) {
  if (!Number.isFinite(date.getTime())) {
    throw new JqArgumentError(`Invalid epoch value for ${label}`);
  }
}
function normalizeBrokenDownInput(input) {
  if (!Array.isArray(input)) {
    throw new JqArgumentError("Expected an array");
  }
  const values = new Array(8).fill(0);
  for (let index = 0; index < Math.min(input.length, 8); index++) {
    const value = input[index];
    if (typeof value !== "number" || Number.isNaN(value)) {
      throw new JqArgumentError("Expected numeric parsed datetime values");
    }
    values[index] = value;
  }
  return values;
}
function brokenDownFromDate(date, epochSeconds, mode) {
  assertFiniteDate(date, mode === "utc" ? "strftime" : "strflocaltime");
  const year = mode === "utc" ? date.getUTCFullYear() : date.getFullYear();
  const month = mode === "utc" ? date.getUTCMonth() : date.getMonth();
  const day = mode === "utc" ? date.getUTCDate() : date.getDate();
  const hour = mode === "utc" ? date.getUTCHours() : date.getHours();
  const minute = mode === "utc" ? date.getUTCMinutes() : date.getMinutes();
  const secondWhole = mode === "utc" ? date.getUTCSeconds() : date.getSeconds();
  const weekday = mode === "utc" ? date.getUTCDay() : date.getDay();
  const yearDay = dayOfYear(date, mode);
  return [
    year,
    month,
    day,
    hour,
    minute,
    secondWhole + fractionalSeconds(epochSeconds),
    weekday,
    yearDay
  ];
}
function brokenDownToDate(input, mode) {
  const values = normalizeBrokenDownInput(input);
  const year = values[0];
  const month = values[1];
  const day = values[2];
  const hour = values[3];
  const minute = values[4];
  const second = Math.trunc(values[5]);
  return makeDate(year, month, day, hour, minute, second, 0, mode);
}
function applyDirective(directive, date, mode, epochSeconds) {
  const parts = brokenDownFromDate(date, epochSeconds, mode);
  const [year, month, day, hour, minute, second, weekday, yearDay] = parts;
  switch (directive) {
    case "%":
      return "%";
    case "Y":
      return pad(year, 4);
    case "m":
      return pad(month + 1);
    case "d":
      return pad(day);
    case "e":
      return `${day}`.padStart(2, " ");
    case "H":
      return pad(hour);
    case "M":
      return pad(minute);
    case "S":
      return pad(Math.trunc(second));
    case "I": {
      const clock = hour % 12 || 12;
      return pad(clock);
    }
    case "p":
      return hour < 12 ? "AM" : "PM";
    case "a":
      return WEEKDAY_ABBREVIATIONS[weekday];
    case "A":
      return WEEKDAY_NAMES[weekday];
    case "b":
    case "h":
      return MONTH_ABBREVIATIONS[month];
    case "B":
      return MONTH_NAMES[month];
    case "w":
      return `${weekday}`;
    case "u":
      return `${weekday === 0 ? 7 : weekday}`;
    case "j":
      return pad(yearDay + 1, 3);
    case "F":
      return `${pad(year, 4)}-${pad(month + 1)}-${pad(day)}`;
    case "R":
      return `${pad(hour)}:${pad(minute)}`;
    case "T":
      return `${pad(hour)}:${pad(minute)}:${pad(Math.trunc(second))}`;
    case "r": {
      const clock = hour % 12 || 12;
      const meridiem = hour < 12 ? "AM" : "PM";
      return `${pad(clock)}:${pad(minute)}:${pad(Math.trunc(second))} ${meridiem}`;
    }
    case "z":
      return mode === "utc" ? "+0000" : offsetToString(localOffsetMinutes(date));
    case "Z":
      return mode === "utc" ? "UTC" : localZoneName(date);
    default:
      throw new JqArgumentError(`Unsupported strftime format directive: %${directive}`);
  }
}
function readNumber(input, start, minDigits, maxDigits) {
  let end = start;
  while (end < input.length && /\d/.test(input[end]) && end - start < maxDigits) {
    end += 1;
  }
  if (end - start < minDigits) {
    throw new JqArgumentError("Unexpected numeric field while parsing datetime");
  }
  return {
    value: Number(input.slice(start, end)),
    nextIndex: end
  };
}
function readName(input, start, candidates) {
  const lowerInput = input.slice(start).toLowerCase();
  for (let index = 0; index < candidates.length; index++) {
    const candidate = candidates[index];
    if (lowerInput.startsWith(candidate.toLowerCase())) {
      return {
        value: index,
        nextIndex: start + candidate.length
      };
    }
  }
  throw new JqArgumentError("Unexpected named field while parsing datetime");
}
function gmtime(epochSeconds) {
  const date = new Date(epochSeconds * 1e3);
  assertFiniteDate(date, "gmtime");
  return brokenDownFromDate(date, epochSeconds, "utc");
}
function localtime(epochSeconds) {
  const date = new Date(epochSeconds * 1e3);
  assertFiniteDate(date, "localtime");
  return brokenDownFromDate(date, epochSeconds, "local");
}
function mktime(input) {
  const values = normalizeBrokenDownInput(input);
  const date = brokenDownToDate(values, "utc");
  assertFiniteDate(date, "mktime");
  return Math.floor(date.getTime() / 1e3);
}
function strftime(input, format, mode) {
  let date;
  let epochSeconds = 0;
  if (typeof input === "number") {
    epochSeconds = input;
    date = new Date(input * 1e3);
  } else {
    date = brokenDownToDate(input, mode);
    epochSeconds = date.getTime() / 1e3;
  }
  assertFiniteDate(date, mode === "utc" ? "strftime" : "strflocaltime");
  let output = "";
  for (let index = 0; index < format.length; index++) {
    const char = format[index];
    if (char !== "%") {
      output += char;
      continue;
    }
    index += 1;
    if (index >= format.length) {
      throw new JqArgumentError("Trailing % in strftime format");
    }
    output += applyDirective(format[index], date, mode, epochSeconds);
  }
  return output;
}
function strptime(input, format) {
  const fields = {};
  let inputIndex = 0;
  function consumeWhitespace() {
    while (inputIndex < input.length && /\s/.test(input[inputIndex])) {
      inputIndex += 1;
    }
  }
  for (let formatIndex = 0; formatIndex < format.length; formatIndex++) {
    const char = format[formatIndex];
    if (char === "%") {
      formatIndex += 1;
      if (formatIndex >= format.length) {
        throw new JqArgumentError("Trailing % in strptime format");
      }
      const directive = format[formatIndex];
      switch (directive) {
        case "%":
          if (input[inputIndex] !== "%") {
            throw new JqArgumentError("Literal % did not match input");
          }
          inputIndex += 1;
          break;
        case "Y": {
          const parsed = readNumber(input, inputIndex, 1, 4);
          fields.year = parsed.value;
          inputIndex = parsed.nextIndex;
          break;
        }
        case "m": {
          const parsed = readNumber(input, inputIndex, 1, 2);
          fields.month = parsed.value - 1;
          inputIndex = parsed.nextIndex;
          break;
        }
        case "d":
        case "e": {
          if (directive === "e")
            consumeWhitespace();
          const parsed = readNumber(input, inputIndex, 1, 2);
          fields.day = parsed.value;
          inputIndex = parsed.nextIndex;
          break;
        }
        case "H": {
          const parsed = readNumber(input, inputIndex, 1, 2);
          fields.hour = parsed.value;
          inputIndex = parsed.nextIndex;
          break;
        }
        case "M": {
          const parsed = readNumber(input, inputIndex, 1, 2);
          fields.minute = parsed.value;
          inputIndex = parsed.nextIndex;
          break;
        }
        case "S": {
          const match = /^(\d{1,2}(?:\.\d+)?)/.exec(input.slice(inputIndex));
          if (!match) {
            throw new JqArgumentError("Unexpected seconds field while parsing datetime");
          }
          fields.second = Number(match[1]);
          inputIndex += match[1].length;
          break;
        }
        case "a": {
          const parsed = readName(input, inputIndex, WEEKDAY_ABBREVIATIONS);
          fields.weekday = parsed.value;
          inputIndex = parsed.nextIndex;
          break;
        }
        case "A": {
          const parsed = readName(input, inputIndex, WEEKDAY_NAMES);
          fields.weekday = parsed.value;
          inputIndex = parsed.nextIndex;
          break;
        }
        case "b":
        case "h": {
          const parsed = readName(input, inputIndex, MONTH_ABBREVIATIONS);
          fields.month = parsed.value;
          inputIndex = parsed.nextIndex;
          break;
        }
        case "B": {
          const parsed = readName(input, inputIndex, MONTH_NAMES);
          fields.month = parsed.value;
          inputIndex = parsed.nextIndex;
          break;
        }
        case "w": {
          const parsed = readNumber(input, inputIndex, 1, 1);
          fields.weekday = parsed.value;
          inputIndex = parsed.nextIndex;
          break;
        }
        case "u": {
          const parsed = readNumber(input, inputIndex, 1, 1);
          fields.weekday = parsed.value % 7;
          inputIndex = parsed.nextIndex;
          break;
        }
        case "j": {
          const parsed = readNumber(input, inputIndex, 1, 3);
          fields.yearDay = parsed.value - 1;
          inputIndex = parsed.nextIndex;
          break;
        }
        case "F": {
          const match = /^(\d{1,4})-(\d{1,2})-(\d{1,2})/.exec(
            input.slice(inputIndex)
          );
          if (!match) {
            throw new JqArgumentError("Failed to parse %F datetime fragment");
          }
          fields.year = Number(match[1]);
          fields.month = Number(match[2]) - 1;
          fields.day = Number(match[3]);
          inputIndex += match[0].length;
          break;
        }
        case "T": {
          const match = /^(\d{1,2}):(\d{1,2}):(\d{1,2}(?:\.\d+)?)/.exec(
            input.slice(inputIndex)
          );
          if (!match) {
            throw new JqArgumentError("Failed to parse %T datetime fragment");
          }
          fields.hour = Number(match[1]);
          fields.minute = Number(match[2]);
          fields.second = Number(match[3]);
          inputIndex += match[0].length;
          break;
        }
        case "z": {
          const offsetMatch = /^(Z|[+-]\d{2}:?\d{2})/.exec(input.slice(inputIndex));
          if (!offsetMatch) {
            throw new JqArgumentError("Failed to parse %z timezone offset");
          }
          if (offsetMatch[1] === "Z") {
            fields.offsetMinutes = 0;
          } else {
            const raw = offsetMatch[1].replace(":", "");
            const sign = raw.startsWith("-") ? -1 : 1;
            const hours = Number(raw.slice(1, 3));
            const minutes = Number(raw.slice(3, 5));
            fields.offsetMinutes = sign * (hours * 60 + minutes);
          }
          inputIndex += offsetMatch[0].length;
          break;
        }
        case "Z": {
          const zoneMatch = /^(UTC|GMT|Z)/i.exec(input.slice(inputIndex));
          if (!zoneMatch) {
            throw new JqArgumentError("Failed to parse %Z timezone name");
          }
          fields.offsetMinutes = 0;
          inputIndex += zoneMatch[0].length;
          break;
        }
        default:
          throw new JqArgumentError(`Unsupported strptime format directive: %${directive}`);
      }
      continue;
    }
    if (/\s/.test(char)) {
      consumeWhitespace();
      continue;
    }
    if (input[inputIndex] !== char) {
      throw new JqArgumentError("Input did not match the strptime format literal");
    }
    inputIndex += 1;
  }
  const remainder = input.slice(inputIndex);
  if (/[^\s]/.test(remainder)) {
    throw new JqArgumentError(`date "${input}" does not match format "${format}"`);
  }
  let year = fields.year ?? 0;
  let month = fields.month ?? 0;
  let day = fields.day ?? 0;
  const hour = fields.hour ?? 0;
  const minute = fields.minute ?? 0;
  let second = fields.second ?? 0;
  if (fields.yearDay !== void 0 && fields.day === void 0 && fields.month === void 0) {
    const yearStart = makeDate(year, 0, 1, 0, 0, 0, 0, "utc");
    yearStart.setUTCDate(yearStart.getUTCDate() + fields.yearDay);
    month = yearStart.getUTCMonth();
    day = yearStart.getUTCDate();
  }
  if (fields.offsetMinutes !== void 0) {
    const wholeSeconds = Math.trunc(second);
    const fractional = second - wholeSeconds;
    const utcDate = makeDate(
      year,
      month,
      day,
      hour,
      minute,
      wholeSeconds,
      Math.round(fractional * 1e3),
      "utc"
    );
    utcDate.setUTCMinutes(utcDate.getUTCMinutes() - fields.offsetMinutes);
    const normalized = brokenDownFromDate(
      utcDate,
      utcDate.getTime() / 1e3,
      "utc"
    );
    year = normalized[0];
    month = normalized[1];
    day = normalized[2];
    second = normalized[5];
    return remainder.length > 0 ? [...normalized, remainder] : normalized;
  }
  const date = makeDate(
    year,
    month,
    day,
    hour,
    minute,
    Math.trunc(second),
    0,
    "utc"
  );
  const output = [
    year,
    month,
    day,
    hour,
    minute,
    second,
    fields.weekday ?? date.getUTCDay(),
    fields.yearDay ?? dayOfYear(date, "utc")
  ];
  return remainder.length > 0 ? [...output, remainder] : output;
}

// src/jqtools/evaluate/runtimeState.ts
var DEFAULT_RUNTIME_LIMITS = {
  maxSteps: 25e4,
  maxOutputs: 1e4,
  maxOutputBytes: 5e6,
  maxMillis: 2e3
};
var runtimeStack = [];
function currentRuntimeContext() {
  return runtimeStack[runtimeStack.length - 1];
}
var HaltSignal = class extends Error {
  constructor(exitCode) {
    super(`jq halted with exit code ${exitCode}`);
    this.exitCode = exitCode;
    this.name = "HaltSignal";
  }
};
var RuntimeLimitError = class extends JqEvaluateError {
  constructor(limit, message) {
    super(message);
    this.limit = limit;
    this.name = "RuntimeLimitError";
  }
};
function normalizeRuntimeLimits(limits = {}) {
  return {
    ...DEFAULT_RUNTIME_LIMITS,
    ...limits
  };
}
function isFiniteLimit(value) {
  return Number.isFinite(value) && value >= 0;
}
function estimateOutputBytes(value) {
  try {
    return JSON.stringify(value)?.length ?? 4;
  } catch {
    return 0;
  }
}
function withRuntimeDiagnostics(callback, limits) {
  const context = {
    debugMessages: [],
    stderr: [],
    limits: normalizeRuntimeLimits(limits),
    startMillis: Date.now(),
    steps: 0,
    outputs: 0,
    outputBytes: 0
  };
  runtimeStack.push(context);
  try {
    return {
      result: callback(),
      diagnostics: {
        debugMessages: [...context.debugMessages],
        stderr: [...context.stderr],
        haltedExitCode: context.haltedExitCode
      }
    };
  } catch (error) {
    return {
      diagnostics: {
        debugMessages: [...context.debugMessages],
        stderr: [...context.stderr],
        haltedExitCode: context.haltedExitCode
      },
      error
    };
  } finally {
    runtimeStack.pop();
  }
}
function checkRuntimeBudget(units = 1) {
  const context = currentRuntimeContext();
  if (!context) {
    return;
  }
  if (context.limits.signal?.aborted) {
    throw new RuntimeLimitError(
      "signal",
      `BXL evaluation aborted${context.limits.signal.reason ? `: ${String(context.limits.signal.reason)}` : ""}`
    );
  }
  context.steps += units;
  if (isFiniteLimit(context.limits.maxSteps) && context.steps > context.limits.maxSteps) {
    throw new RuntimeLimitError(
      "maxSteps",
      `BXL evaluation exceeded the ${context.limits.maxSteps} step runtime limit`
    );
  }
  if (isFiniteLimit(context.limits.maxMillis) && context.steps % 1024 === 0 && Date.now() - context.startMillis > context.limits.maxMillis) {
    throw new RuntimeLimitError(
      "maxMillis",
      `BXL evaluation exceeded the ${context.limits.maxMillis}ms runtime limit`
    );
  }
}
function recordRuntimeOutput(value) {
  const context = currentRuntimeContext();
  checkRuntimeBudget();
  if (!context) {
    return;
  }
  context.outputs++;
  if (isFiniteLimit(context.limits.maxOutputs) && context.outputs > context.limits.maxOutputs) {
    throw new RuntimeLimitError(
      "maxOutputs",
      `BXL evaluation exceeded the ${context.limits.maxOutputs} output runtime limit`
    );
  }
  context.outputBytes += estimateOutputBytes(value);
  if (isFiniteLimit(context.limits.maxOutputBytes) && context.outputBytes > context.limits.maxOutputBytes) {
    throw new RuntimeLimitError(
      "maxOutputBytes",
      `BXL evaluation exceeded the ${context.limits.maxOutputBytes} byte output runtime limit`
    );
  }
}
function emitDebugMessage(message) {
  currentRuntimeContext()?.debugMessages.push(message);
}
function emitStderrChunk(message) {
  currentRuntimeContext()?.stderr.push(message);
}
function markHalted(exitCode) {
  const context = currentRuntimeContext();
  if (context) {
    context.haltedExitCode = exitCode;
  }
}
function halt(exitCode) {
  markHalted(exitCode);
  throw new HaltSignal(exitCode);
}
function snapshotForDiagnostics(value) {
  return deepClone(value);
}

// src/jqtools/evaluate/filters/builtinNativeFilters.ts
var MIN_NORMAL = 22250738585072014e-324;
var PUBLIC_SANDBOX_BLOCKED_BUILTINS = /* @__PURE__ */ new Set(["env/0"]);
function containsValue(haystack, needle) {
  if (typeOf(haystack) !== typeOf(needle)) {
    return false;
  }
  switch (typeOf(haystack)) {
    case "object" /* object */:
      return Object.entries(needle).every(
        ([key, value]) => Object.prototype.hasOwnProperty.call(haystack, key) && containsValue(
          haystack[key],
          value
        )
      );
    case "array" /* array */:
      return needle.every(
        (needleItem) => haystack.some(
          (haystackItem) => containsValue(haystackItem, needleItem)
        )
      );
    case "string" /* string */: {
      const haystackString = haystack;
      const needleString = needle;
      return needleString.length === 0 || haystackString.includes(needleString);
    }
    default:
      return compare(haystack, needle) === 0;
  }
}
function trimStringValue(input, mode) {
  if (typeOf(input) !== "string" /* string */) {
    throw new JqEvaluateError("trim input must be a string");
  }
  let output = input;
  if (mode === "both" || mode === "left") {
    output = output.trimStart();
  }
  if (mode === "both" || mode === "right") {
    output = output.trimEnd();
  }
  return output;
}
function publicBuiltinNames() {
  return [
    .../* @__PURE__ */ new Set([
      ...Object.keys(builtinJqFilters),
      ...Object.keys(builtinNativeFilters)
    ])
  ].filter(
    (name) => !name.startsWith("_") && !PUBLIC_SANDBOX_BLOCKED_BUILTINS.has(name)
  ).sort();
}
function rawCompactString(value) {
  return typeOf(value) === "string" /* string */ ? value : JSON.stringify(snapshotForDiagnostics(value)) ?? "null";
}
function applyUnaryMath(input, fnName, fn) {
  const number = assertNumber(input);
  const result = fn(number);
  if (Number.isNaN(result)) {
    return Number.NaN;
  }
  return result;
}
function applyBinaryMath(left, right, fn) {
  return fn(assertNumber(left), assertNumber(right));
}
var F64_BUF = new ArrayBuffer(8);
var F64_DV = new DataView(F64_BUF);
function f64ToBits(x) {
  F64_DV.setFloat64(0, x);
  return { hi: F64_DV.getUint32(0), lo: F64_DV.getUint32(4) };
}
function bitsToF64(hi, lo) {
  F64_DV.setUint32(0, hi);
  F64_DV.setUint32(4, lo);
  return F64_DV.getFloat64(0);
}
function ieeeNextafter(x, y) {
  if (Number.isNaN(x) || Number.isNaN(y))
    return Number.NaN;
  if (x === y)
    return y;
  if (x === 0)
    return y > 0 ? Number.MIN_VALUE : -Number.MIN_VALUE;
  let { hi, lo } = f64ToBits(x);
  const increasing = x < y === x > 0;
  if (increasing) {
    if (lo === 4294967295) {
      hi = hi + 1 >>> 0;
      lo = 0;
    } else {
      lo = lo + 1 >>> 0;
    }
  } else {
    if (lo === 0) {
      hi = hi - 1 >>> 0;
      lo = 4294967295;
    } else {
      lo = lo - 1 >>> 0;
    }
  }
  return bitsToF64(hi, lo);
}
function roundHalfToEven(x) {
  if (!Number.isFinite(x))
    return x;
  const truncated = Math.trunc(x);
  const frac = x - truncated;
  const absFrac = Math.abs(frac);
  if (absFrac < 0.5)
    return truncated;
  if (absFrac > 0.5)
    return truncated + Math.sign(frac);
  return truncated % 2 === 0 ? truncated : truncated + Math.sign(frac);
}
function ieeeRemainder(x, y) {
  if (y === 0 || !Number.isFinite(x) || Number.isNaN(y))
    return Number.NaN;
  const n = roundHalfToEven(x / y);
  return x - n * y;
}
function frexp(x) {
  if (x === 0 || !Number.isFinite(x) || Number.isNaN(x))
    return [x, 0];
  const { hi } = f64ToBits(x);
  const rawExp = hi >>> 20 & 2047;
  if (rawExp === 0) {
    const scaled = x * 2 ** 54;
    const [m, e] = frexp(scaled);
    return [m, e - 54];
  }
  const exponent = rawExp - 1022;
  const mantissa = x / Math.pow(2, exponent);
  return [mantissa, exponent];
}
function logb(x) {
  if (x === 0)
    return Number.NEGATIVE_INFINITY;
  if (!Number.isFinite(x))
    return Number.POSITIVE_INFINITY;
  if (Number.isNaN(x))
    return Number.NaN;
  return Math.floor(Math.log2(Math.abs(x)));
}
function erfApprox(x) {
  const sign = Math.sign(x);
  const ax = Math.abs(x);
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const t = 1 / (1 + p * ax);
  const y = 1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-ax * ax);
  return sign * y;
}
var LANCZOS_G = 7;
var LANCZOS_C = [
  0.9999999999998099,
  676.5203681218851,
  -1259.1392167224028,
  771.3234287776531,
  -176.6150291621406,
  12.507343278686905,
  -0.13857109526572012,
  9984369578019572e-21,
  15056327351493116e-23
];
function gammaApprox(x) {
  if (Number.isNaN(x))
    return Number.NaN;
  if (x < 0.5) {
    return Math.PI / (Math.sin(Math.PI * x) * gammaApprox(1 - x));
  }
  x -= 1;
  let a = LANCZOS_C[0];
  const t = x + LANCZOS_G + 0.5;
  for (let i = 1; i < LANCZOS_C.length; i++) {
    a += LANCZOS_C[i] / (x + i);
  }
  return Math.sqrt(2 * Math.PI) * Math.pow(t, x + 0.5) * Math.exp(-t) * a;
}
function lgammaApprox(x) {
  if (Number.isNaN(x))
    return Number.NaN;
  if (x < 0.5) {
    return Math.log(Math.abs(Math.PI / Math.sin(Math.PI * x))) - lgammaApprox(1 - x);
  }
  x -= 1;
  let a = LANCZOS_C[0];
  const t = x + LANCZOS_G + 0.5;
  for (let i = 1; i < LANCZOS_C.length; i++) {
    a += LANCZOS_C[i] / (x + i);
  }
  return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
}
function besselJ0(x) {
  if (x === 0)
    return 1;
  const ax = Math.abs(x);
  if (ax < 8) {
    const y2 = x * x;
    const num = 57568490574 + y2 * (-13362590354 + y2 * (6516196407e-1 + y2 * (-1121442418e-2 + y2 * (77392.33017 + y2 * -184.9052456))));
    const den = 57568490411 + y2 * (1029532985 + y2 * (9494680718e-3 + y2 * (59272.64853 + y2 * (267.8532712 + y2 * 1))));
    return num / den;
  }
  const z = 8 / ax;
  const y = z * z;
  const xx = ax - 0.785398164;
  const p = 1 + y * (-0.001098628627 + y * (2734510407e-14 + y * (-2073370639e-15 + y * 2093887211e-16)));
  const q = -0.01562499995 + y * (1430488765e-13 + y * (-6911147651e-15 + y * (7621095161e-16 + y * -934935152e-16)));
  return Math.sqrt(0.636619772 / ax) * (Math.cos(xx) * p - z * Math.sin(xx) * q);
}
function besselJ1(x) {
  if (x === 0)
    return 0;
  const ax = Math.abs(x);
  if (ax < 8) {
    const y2 = x * x;
    const num = x * (72362614232 + y2 * (-7895059235 + y2 * (2423968531e-1 + y2 * (-2972611439e-3 + y2 * (15704.4826 + y2 * -30.16036606)))));
    const den = 144725228442 + y2 * (2300535178 + y2 * (1858330474e-2 + y2 * (99447.43394 + y2 * (376.9991397 + y2 * 1))));
    return num / den;
  }
  const z = 8 / ax;
  const y = z * z;
  const xx = ax - 2.356194491;
  const p = 1 + y * (183105e-8 + y * (-3516396496e-14 + y * (2457520174e-15 + y * -240337019e-15)));
  const q = 0.04687499995 + y * (-2002690873e-13 + y * (8449199096e-15 + y * (-88228987e-14 + y * 105787412e-15)));
  let result = Math.sqrt(0.636619772 / ax) * (Math.cos(xx) * p - z * Math.sin(xx) * q);
  if (x < 0)
    result = -result;
  return result;
}
function besselY0(x) {
  if (x <= 0)
    return Number.NaN;
  if (x < 8) {
    const y2 = x * x;
    const num = -2957821389 + y2 * (7062834065 + y2 * (-5123598036e-1 + y2 * (1087988129e-2 + y2 * (-86327.92757 + y2 * 228.4622733))));
    const den = 40076544269 + y2 * (7452499648e-1 + y2 * (7189466438e-3 + y2 * (47447.2647 + y2 * (226.1030244 + y2 * 1))));
    return num / den + 0.636619772 * besselJ0(x) * Math.log(x);
  }
  const z = 8 / x;
  const y = z * z;
  const xx = x - 0.785398164;
  const p = 1 + y * (-0.001098628627 + y * (2734510407e-14 + y * (-2073370639e-15 + y * 2093887211e-16)));
  const q = -0.01562499995 + y * (1430488765e-13 + y * (-6911147651e-15 + y * (7621095161e-16 + y * -934935152e-16)));
  return Math.sqrt(0.636619772 / x) * (Math.sin(xx) * p + z * Math.cos(xx) * q);
}
function besselY1(x) {
  if (x <= 0)
    return Number.NaN;
  if (x < 8) {
    const y2 = x * x;
    const num = x * (-4900604943e4 + y2 * (127527439e5 + y2 * (-515343813900 + y2 * (7349264551 + y2 * (-4237922726e-2 + y2 * 85119.37935)))));
    const den = 249958057e6 + y2 * (4244419664e3 + y2 * (37336503670 + y2 * (2245904002e-1 + y2 * (102042605e-2 + y2 * (3549.632885 + y2)))));
    return num / den + 0.636619772 * (besselJ1(x) * Math.log(x) - 1 / x);
  }
  const z = 8 / x;
  const y = z * z;
  const xx = x - 2.356194491;
  const p = 1 + y * (183105e-8 + y * (-3516396496e-14 + y * (2457520174e-15 + y * -240337019e-15)));
  const q = 0.04687499995 + y * (-2002690873e-13 + y * (8449199096e-15 + y * (-88228987e-14 + y * 105787412e-15)));
  return Math.sqrt(0.636619772 / x) * (Math.sin(xx) * p + z * Math.cos(xx) * q);
}
function besselJn(n, x) {
  n = Math.trunc(n);
  if (n === 0)
    return besselJ0(x);
  if (n === 1)
    return besselJ1(x);
  if (n < 0)
    return ((n & 1) === 0 ? 1 : -1) * besselJn(-n, x);
  if (x === 0)
    return 0;
  const ax = Math.abs(x);
  const tox = 2 / ax;
  if (ax > n) {
    let bjm = besselJ0(ax);
    let bj = besselJ1(ax);
    for (let j = 1; j < n; j++) {
      const bjp = j * tox * bj - bjm;
      bjm = bj;
      bj = bjp;
    }
    return x < 0 && n & 1 ? -bj : bj;
  } else {
    const m = 2 * Math.floor((n + Math.floor(Math.sqrt(40 * n))) / 2);
    let jsum = 0;
    let bjp = 0;
    let bj = 1;
    let ans = 0;
    let sum = 0;
    for (let j = m; j > 0; j--) {
      const bjm = j * tox * bj - bjp;
      bjp = bj;
      bj = bjm;
      if (Math.abs(bj) > 1e10) {
        bj *= 1e-10;
        bjp *= 1e-10;
        ans *= 1e-10;
        sum *= 1e-10;
      }
      if (jsum)
        sum += bj;
      jsum = jsum ? 0 : 1;
      if (j === n)
        ans = bjp;
    }
    sum = 2 * sum - bj;
    ans /= sum;
    return x < 0 && n & 1 ? -ans : ans;
  }
}
function besselYn(n, x) {
  n = Math.trunc(n);
  if (n === 0)
    return besselY0(x);
  if (n === 1)
    return besselY1(x);
  if (x <= 0)
    return Number.NaN;
  const tox = 2 / x;
  let bym = besselY0(x);
  let by = besselY1(x);
  for (let j = 1; j < n; j++) {
    const byp = j * tox * by - bym;
    bym = by;
    by = byp;
  }
  return by;
}
function isScalar(value) {
  const t = typeOf(value);
  return t === "null" /* null */ || t === "boolean" /* boolean */ || t === "number" /* number */ || t === "string" /* string */;
}
var builtinNativeFilters = {
  *"path/1"(input, value) {
    yield createItem(value.path);
  },
  ...wrapBareNativeFilters({
    *"_negate/0"(input) {
      yield -assertNumber(input);
    },
    *"_group_by_impl/1"(input, ref) {
      const items = input.map((value, i2) => ({ value, ref: ref[i2] })).sort((a, b) => compare(a.ref, b.ref));
      let i = -1;
      const groupRefs = [];
      const out = [];
      for (const item of items) {
        if (i === -1 || compare(groupRefs[i], item.ref)) {
          groupRefs.push(item.ref);
          out.push([]);
          i++;
        }
        out[i].push(item.value);
      }
      yield out;
    },
    *"_match_impl/3"(input, regex, flags, returnOnlyBoolean) {
      const str = assertString(input);
      const r = new RegExp(regex, (flags ?? "") + "d");
      if (flags && flags.includes("g")) {
        const m = Array.from(str.matchAll(r));
        if (returnOnlyBoolean) {
          yield m.length !== 0;
        } else {
          yield m.map(transformRegExpMatch);
        }
      } else {
        const m = str.match(r);
        if (returnOnlyBoolean) {
          yield !!m;
        } else if (m) {
          yield [transformRegExpMatch(m)];
        }
      }
    },
    *"_max_by_impl/1"(input, ref) {
      if (input.length === 0) {
        return;
      }
      let bestIndex = 0;
      for (let i = 1; i < input.length; i++) {
        if (compare(ref[i], ref[bestIndex]) > 0) {
          bestIndex = i;
        }
      }
      yield input[bestIndex];
    },
    *"_min_by_impl/1"(input, ref) {
      if (input.length === 0) {
        return;
      }
      let bestIndex = 0;
      for (let i = 1; i < input.length; i++) {
        if (compare(ref[i], ref[bestIndex]) < 0) {
          bestIndex = i;
        }
      }
      yield input[bestIndex];
    },
    *"_sort_by_impl/1"(input, ref) {
      yield input.map((item, i) => ({ item, ref: ref[i] })).sort(compare).map(({ item }) => item);
    },
    *"_unique_by_impl/1"(input, ref) {
      const items = input.map((value, i) => ({ value, ref: ref[i] })).sort((a, b) => compare(a.ref, b.ref));
      const output = [];
      let previousRef;
      for (const item of items) {
        if (!previousRef || compare(previousRef, item.ref) !== 0) {
          output.push(item.value);
          previousRef = item.ref;
        }
      }
      yield output;
    },
    *"_strindices/1"(input, needle) {
      yield indices(input, needle);
    },
    *"acos/0"(input) {
      yield applyUnaryMath(input, "acos", Math.acos);
    },
    *"acosh/0"(input) {
      yield applyUnaryMath(input, "acosh", Math.acosh);
    },
    *"asin/0"(input) {
      yield applyUnaryMath(input, "asin", Math.asin);
    },
    *"asinh/0"(input) {
      yield applyUnaryMath(input, "asinh", Math.asinh);
    },
    *"atan/0"(input) {
      yield applyUnaryMath(input, "atan", Math.atan);
    },
    *"atan2/1"(input, value) {
      yield applyBinaryMath(input, value, Math.atan2);
    },
    *"atan2/2"(_input, y, x) {
      const yv = assertNumber(y);
      const xv = assertNumber(x);
      if (xv === 0 && yv === 0) {
        yield 0;
        return;
      }
      yield Math.atan2(yv, xv);
    },
    *"atanh/0"(input) {
      yield applyUnaryMath(input, "atanh", Math.atanh);
    },
    *"bsearch/1"(input, target) {
      if (typeOf(input) !== "array" /* array */) {
        throw new JqArgumentError("Expected an array");
      }
      const values = input;
      let low = 0;
      let high = values.length - 1;
      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const direction = compare(values[mid], target);
        if (direction === 0) {
          yield mid;
          return;
        }
        if (direction < 0) {
          low = mid + 1;
        } else {
          high = mid - 1;
        }
      }
      yield -1 - low;
    },
    *"builtins/0"() {
      yield publicBuiltinNames();
    },
    *"cbrt/0"(input) {
      yield applyUnaryMath(input, "cbrt", Math.cbrt);
    },
    *"ceil/0"(input) {
      yield Math.ceil(assertNumber(input));
    },
    *"contains/1"(input, value) {
      yield containsValue(input, value);
    },
    *"copysign/1"(input, value) {
      const magnitude = Math.abs(assertNumber(input));
      const sign = assertNumber(value);
      yield sign === 0 ? magnitude : Math.sign(sign) * magnitude;
    },
    *"copysign/2"(_input, x, y) {
      const magnitude = Math.abs(assertNumber(x));
      const sign = assertNumber(y);
      yield sign === 0 ? magnitude : Math.sign(sign) * magnitude;
    },
    *"cos/0"(input) {
      yield applyUnaryMath(input, "cos", Math.cos);
    },
    *"cosh/0"(input) {
      yield applyUnaryMath(input, "cosh", Math.cosh);
    },
    *"debug/0"(input) {
      emitDebugMessage(JSON.stringify(["DEBUG:", snapshotForDiagnostics(input)]));
      yield input;
    },
    *"delpaths/1"(input, paths) {
      if (!isPaths(paths)) {
        throw new JqArgumentError("Expected an array of paths");
      }
      yield delPaths(input, paths);
    },
    *"drem/2"(_input, x, y) {
      yield ieeeRemainder(assertNumber(x), assertNumber(y));
    },
    *"empty/0"() {
    },
    *"endswith/1"(input, str) {
      const i = assertString(input);
      const s = assertString(str);
      yield i.endsWith(s);
    },
    *"env/0"() {
      throw new JqEvaluateError("env is not available in the public BXL sandbox");
    },
    *"erf/0"(input) {
      yield erfApprox(assertNumber(input));
    },
    *"erfc/0"(input) {
      yield 1 - erfApprox(assertNumber(input));
    },
    *"error/0"(input) {
      throw new JqEvaluateError(toString(input));
    },
    *"exp/0"(input) {
      yield applyUnaryMath(input, "exp", Math.exp);
    },
    *"exp10/0"(input) {
      yield applyUnaryMath(input, "exp10", (value) => 10 ** value);
    },
    *"exp2/0"(input) {
      yield applyUnaryMath(input, "exp2", (value) => 2 ** value);
    },
    *"explode/0"(input) {
      yield Array.from(assertString(input)).map((char) => char.codePointAt(0));
    },
    *"expm1/0"(input) {
      yield Math.expm1(assertNumber(input));
    },
    *"fabs/0"(input) {
      yield Math.abs(assertNumber(input));
    },
    *"fdim/1"(input, value) {
      const left = assertNumber(input);
      const right = assertNumber(value);
      yield Math.max(left - right, 0);
    },
    *"fdim/2"(_input, x, y) {
      yield Math.max(assertNumber(x) - assertNumber(y), 0);
    },
    *"floor/0"(input) {
      yield Math.floor(assertNumber(input));
    },
    *"fma/3"(_input, a, b, c) {
      yield assertNumber(a) * assertNumber(b) + assertNumber(c);
    },
    *"fmax/1"(input, value) {
      yield Math.max(assertNumber(input), assertNumber(value));
    },
    *"fmax/2"(_input, x, y) {
      const xv = assertNumber(x);
      const yv = assertNumber(y);
      if (Number.isNaN(xv))
        yield yv;
      else if (Number.isNaN(yv))
        yield xv;
      else
        yield Math.max(xv, yv);
    },
    *"fmin/1"(input, value) {
      yield Math.min(assertNumber(input), assertNumber(value));
    },
    *"fmin/2"(_input, x, y) {
      const xv = assertNumber(x);
      const yv = assertNumber(y);
      if (Number.isNaN(xv))
        yield yv;
      else if (Number.isNaN(yv))
        yield xv;
      else
        yield Math.min(xv, yv);
    },
    *"fmod/2"(_input, x, y) {
      yield assertNumber(x) % assertNumber(y);
    },
    *"format/1"(input, format) {
      if (typeOf(format) !== "string" /* string */) {
        throw new JqEvaluateError(
          `${typeOf(format)} (${toString(format)}) is not a valid format`
        );
      }
      yield applyNamedFormat(format, input);
    },
    *"frexp/0"(input) {
      const [m, e] = frexp(assertNumber(input));
      yield [m, e];
    },
    *"fromjson/0"(input) {
      if (typeOf(input) !== "string" /* string */) {
        throw new JqEvaluateError(
          `${typeOf(input)} (${toString(input)}) only strings can be parsed`
        );
      }
      const source = input;
      const trimmed = source.trim();
      if (trimmed === "nan") {
        yield Number.NaN;
        return;
      }
      try {
        yield JSON.parse(source);
      } catch (error) {
        const message = error && typeof error === "object" && "message" in error ? String(error.message) : String(error);
        throw new JqEvaluateError(message);
      }
    },
    *"gamma/0"(input) {
      yield gammaApprox(assertNumber(input));
    },
    *"get_jq_origin/0"() {
      yield "bxl://jq-origin";
    },
    *"get_prog_origin/0"() {
      yield "native-inline";
    },
    *"get_search_list/0"() {
      yield [];
    },
    *"getpath/1"(input, path) {
      if (!isPath(path)) {
        throw new JqArgumentError("Expected an array path");
      }
      yield getPath(input, path);
    },
    *"gmtime/0"(input) {
      if (typeOf(input) !== "number" /* number */) {
        throw new JqEvaluateError("gmtime requires numeric inputs");
      }
      yield gmtime(input);
    },
    *"halt/0"() {
      halt(0);
    },
    *"halt_error/1"(input, exitCode) {
      emitStderrChunk(rawCompactString(input));
      halt(assertNumber(exitCode));
    },
    *"has/1"(input, key) {
      yield has(input, key);
    },
    *"have_decnum/0"() {
      yield false;
    },
    *"have_literal_numbers/0"() {
      yield false;
    },
    *"hypot/1"(input, value) {
      yield Math.hypot(assertNumber(input), assertNumber(value));
    },
    *"hypot/2"(_input, x, y) {
      yield Math.hypot(assertNumber(x), assertNumber(y));
    },
    *"implode/0"(input) {
      if (typeOf(input) !== "array" /* array */) {
        throw new JqArgumentError("Expected an array");
      }
      yield String.fromCodePoint(
        ...input.map((value) => assertNumber(value))
      );
    },
    *"infinite/0"() {
      yield Number.POSITIVE_INFINITY;
    },
    *"input/0"() {
      throw notImplementedError("input/0");
    },
    *"input_filename/0"() {
      throw notImplementedError("input_filename/0");
    },
    *"input_line_number/0"() {
      throw notImplementedError("input_line_number/0");
    },
    *"isinfinite/0"(input) {
      yield typeOf(input) === "number" /* number */ && !Number.isFinite(input);
    },
    *"isnan/0"(input) {
      yield typeOf(input) === "number" /* number */ && Number.isNaN(input);
    },
    *"isnormal/0"(input) {
      yield typeOf(input) === "number" /* number */ && Number.isFinite(input) && input !== 0 && Math.abs(input) >= MIN_NORMAL;
    },
    *"j0/0"(input) {
      yield besselJ0(assertNumber(input));
    },
    *"j1/0"(input) {
      yield besselJ1(assertNumber(input));
    },
    *"jn/2"(_input, n, x) {
      yield besselJn(assertNumber(n), assertNumber(x));
    },
    *"keys/0"(input) {
      yield sort(keys(input));
    },
    *"keys_unsorted/0"(input) {
      yield keys(input);
    },
    *"ldexp/2"(_input, x, n) {
      yield assertNumber(x) * Math.pow(2, Math.trunc(assertNumber(n)));
    },
    *"length/0"(input) {
      const type = typeOf(input);
      switch (typeOf(input)) {
        case "null" /* null */:
          yield 0;
          break;
        case "string" /* string */:
        case "array" /* array */:
          yield input.length;
          break;
        case "object" /* object */:
          yield Object.keys(input).length;
          break;
        case "boolean" /* boolean */:
        case "number" /* number */:
        default:
          throw Error(`${type} has no length`);
      }
    },
    *"lgamma/0"(input) {
      yield lgammaApprox(assertNumber(input));
    },
    *"lgamma_r/0"(input) {
      yield lgammaApprox(assertNumber(input));
    },
    *"localtime/0"(input) {
      if (typeOf(input) !== "number" /* number */) {
        throw new JqEvaluateError("localtime requires numeric inputs");
      }
      yield localtime(input);
    },
    *"log/0"(input) {
      yield applyUnaryMath(input, "log", Math.log);
    },
    *"log10/0"(input) {
      yield applyUnaryMath(input, "log10", Math.log10);
    },
    *"log1p/0"(input) {
      yield applyUnaryMath(input, "log1p", Math.log1p);
    },
    *"log2/0"(input) {
      yield applyUnaryMath(input, "log2", Math.log2);
    },
    *"logb/0"(input) {
      yield logb(assertNumber(input));
    },
    *"ltrimstr/1"(input, left) {
      const str = assertString(input);
      const prefix = assertString(left);
      yield str.startsWith(prefix) ? str.slice(prefix.length) : str;
    },
    *"max/0"(input) {
      if (typeOf(input) !== "array" /* array */) {
        throw new JqArgumentError("Expected an array");
      }
      if (input.length === 0) {
        yield null;
        return;
      }
      yield input.reduce(
        (best, item) => compare(item, best) > 0 ? item : best
      );
    },
    *"min/0"(input) {
      if (typeOf(input) !== "array" /* array */) {
        throw new JqArgumentError("Expected an array");
      }
      if (input.length === 0) {
        yield null;
        return;
      }
      yield input.reduce(
        (best, item) => compare(item, best) < 0 ? item : best
      );
    },
    *"mktime/0"(input) {
      if (typeOf(input) !== "array" /* array */) {
        throw new JqEvaluateError("mktime requires array inputs");
      }
      try {
        yield mktime(input);
      } catch (_error) {
        throw new JqEvaluateError("mktime requires parsed datetime inputs");
      }
    },
    *"modf/0"(input) {
      const x = assertNumber(input);
      const intPart = Math.trunc(x);
      yield [x - intPart, intPart];
    },
    *"modulemeta/0"() {
      throw notImplementedError("modulemeta/0");
    },
    *"nan/0"() {
      yield Number.NaN;
    },
    *"nearbyint/0"(input) {
      yield roundHalfToEven(assertNumber(input));
    },
    *"nextafter/2"(_input, x, y) {
      yield ieeeNextafter(assertNumber(x), assertNumber(y));
    },
    *"nexttoward/2"(_input, x, y) {
      yield ieeeNextafter(assertNumber(x), assertNumber(y));
    },
    *"not/0"(input) {
      yield !isTrue(input);
    },
    *"now/0"() {
      yield Date.now() / 1e3;
    },
    *"pow/1"(input, value) {
      yield applyBinaryMath(input, value, Math.pow);
    },
    *"pow/2"(_input, base, exp) {
      yield Math.pow(assertNumber(base), assertNumber(exp));
    },
    *"pow10/0"(input) {
      yield Math.pow(10, assertNumber(input));
    },
    *"range/2"(input, from, upto) {
      yield* range(from, upto);
    },
    *"remainder/2"(_input, x, y) {
      yield ieeeRemainder(assertNumber(x), assertNumber(y));
    },
    *"rint/0"(input) {
      yield roundHalfToEven(assertNumber(input));
    },
    *"round/0"(input) {
      yield Math.round(assertNumber(input));
    },
    *"rtrimstr/1"(input, right) {
      const str = assertString(input);
      const suffix = assertString(right);
      yield str.endsWith(suffix) ? str.slice(0, str.length - suffix.length) : str;
    },
    *"scalars_or_empty/0"(input) {
      if (isScalar(input))
        yield input;
    },
    *"scalb/2"(_input, x, n) {
      yield assertNumber(x) * Math.pow(2, Math.trunc(assertNumber(n)));
    },
    *"scalbln/2"(_input, x, n) {
      yield assertNumber(x) * Math.pow(2, Math.trunc(assertNumber(n)));
    },
    *"significand/0"(input) {
      const x = assertNumber(input);
      if (x === 0 || !Number.isFinite(x) || Number.isNaN(x)) {
        yield x;
        return;
      }
      yield x / Math.pow(2, logb(x));
    },
    *"sin/0"(input) {
      yield applyUnaryMath(input, "sin", Math.sin);
    },
    *"sinh/0"(input) {
      yield applyUnaryMath(input, "sinh", Math.sinh);
    },
    *"sort/0"(input) {
      yield input.sort(compare);
    },
    *"split/1"(input, split) {
      yield assertString(input).split(assertString(split));
    },
    *"sqrt/0"(input) {
      yield applyUnaryMath(input, "sqrt", Math.sqrt);
    },
    *"startswith/1"(input, str) {
      const i = assertString(input);
      const s = assertString(str);
      yield i.startsWith(s);
    },
    *"stderr/0"(input) {
      emitStderrChunk(rawCompactString(input));
      yield input;
    },
    *"strflocaltime/1"(input, format) {
      if (typeOf(format) !== "string" /* string */) {
        throw new JqEvaluateError("strflocaltime/1 requires a string format");
      }
      if (typeOf(input) !== "number" /* number */ && typeOf(input) !== "array" /* array */) {
        throw new JqEvaluateError("strflocaltime/1 requires parsed datetime inputs");
      }
      try {
        yield strftime(input, format, "local");
      } catch (_error) {
        throw new JqEvaluateError("strflocaltime/1 requires parsed datetime inputs");
      }
    },
    *"strftime/1"(input, format) {
      if (typeOf(format) !== "string" /* string */) {
        throw new JqEvaluateError("strftime/1 requires a string format");
      }
      if (typeOf(input) !== "number" /* number */ && typeOf(input) !== "array" /* array */) {
        throw new JqEvaluateError("strftime/1 requires parsed datetime inputs");
      }
      try {
        yield strftime(input, format, "utc");
      } catch (_error) {
        throw new JqEvaluateError("strftime/1 requires parsed datetime inputs");
      }
    },
    *"strptime/1"(input, format) {
      if (typeOf(input) !== "string" /* string */ || typeOf(format) !== "string" /* string */) {
        throw new JqEvaluateError("strptime/1 requires string inputs and arguments");
      }
      yield strptime(input, format);
    },
    *"toboolean/0"(input) {
      if (typeOf(input) === "boolean" /* boolean */) {
        yield input;
        return;
      }
      if (typeOf(input) === "string" /* string */) {
        if (input === "true") {
          yield true;
          return;
        }
        if (input === "false") {
          yield false;
          return;
        }
      }
      throw new JqEvaluateError(
        `${typeOf(input)} (${toString(input)}) cannot be parsed as a boolean`
      );
    },
    *"tojson/0"(input) {
      const encoded = JSON.stringify(input);
      if (encoded === void 0) {
        throw new JqEvaluateError("Value cannot be serialized as JSON");
      }
      yield encoded;
    },
    *"trimstr/1"(input, value) {
      const str = assertString(input);
      const trim = assertString(value);
      const leftTrimmed = str.startsWith(trim) ? str.slice(trim.length) : str;
      yield leftTrimmed.endsWith(trim) ? leftTrimmed.slice(0, leftTrimmed.length - trim.length) : leftTrimmed;
    },
    *"trim/0"(input) {
      yield trimStringValue(input, "both");
    },
    *"tan/0"(input) {
      yield applyUnaryMath(input, "tan", Math.tan);
    },
    *"tanh/0"(input) {
      yield applyUnaryMath(input, "tanh", Math.tanh);
    },
    *"tgamma/0"(input) {
      yield gammaApprox(assertNumber(input));
    },
    *"tonumber/0"(input) {
      const type = typeOf(input);
      switch (type) {
        case "string" /* string */: {
          const parsedNumber = Number(input);
          if (isNaN(parsedNumber)) {
            throw Error(`${type} (${toString(input)}) cannot be parsed as number`);
          }
          if (!isFinite(parsedNumber)) {
            yield parsedNumber > 0 ? Number.MAX_VALUE : -1 * Number.MAX_VALUE;
            break;
          }
          yield parsedNumber;
          break;
        }
        case "number" /* number */:
          yield input;
          break;
        case "object" /* object */:
        case "array" /* array */:
        case "null" /* null */:
        case "boolean" /* boolean */:
        default:
          throw Error(`${type} (${toString(input)}) cannot be parsed as number`);
      }
    },
    *"tostring/0"(input) {
      yield toString(input);
    },
    *"utf8bytelength/0"(input) {
      if (typeOf(input) !== "string" /* string */) {
        throw new JqEvaluateError(
          `${typeOf(input)} (${toString(input)}) only strings have UTF-8 byte length`
        );
      }
      yield new TextEncoder().encode(input).length;
    },
    *"unique/0"(input) {
      if (typeOf(input) !== "array" /* array */) {
        throw new JqArgumentError("Expected an array");
      }
      const sorted = [...input].sort(compare);
      const output = [];
      for (const value of sorted) {
        if (output.length === 0 || compare(output[output.length - 1], value) !== 0) {
          output.push(value);
        }
      }
      yield output;
    },
    *"trunc/0"(input) {
      yield Math.trunc(assertNumber(input));
    },
    *"type/0"(input) {
      yield typeOf(input);
    },
    *"ltrim/0"(input) {
      yield trimStringValue(input, "left");
    },
    *"rtrim/0"(input) {
      yield trimStringValue(input, "right");
    },
    *"setpath/2"(input, path, value) {
      if (!isPath(path)) {
        throw new JqArgumentError("Expected an array path");
      }
      yield setPath(input, path, value);
    },
    *"y0/0"(input) {
      yield besselY0(assertNumber(input));
    },
    *"y1/0"(input) {
      yield besselY1(assertNumber(input));
    },
    *"yn/2"(_input, n, x) {
      yield besselYn(assertNumber(n), assertNumber(x));
    }
  })
};

// src/jqtools/evaluate/filters/registry.ts
var PUBLIC_SANDBOX_BLOCKED_BUILTINS2 = /* @__PURE__ */ new Set(["env/0"]);
var coreLibrary = {
  jq: builtinJqFilters,
  native: builtinNativeFilters
};
function publicBuiltinNames2(jqFilters, nativeFilters) {
  return [
    .../* @__PURE__ */ new Set([...Object.keys(jqFilters), ...Object.keys(nativeFilters)])
  ].filter(
    (name) => !name.startsWith("_") && !PUBLIC_SANDBOX_BLOCKED_BUILTINS2.has(name)
  ).sort();
}
function resolveRegistry(libraries, requested) {
  const uniqueLibraries = [...new Set(requested)];
  const jq2 = {};
  const native = {};
  for (const name of uniqueLibraries) {
    const lib = libraries[name];
    if (!lib)
      throw new Error(`Unknown builtin library: ${name}`);
    Object.assign(jq2, lib.jq);
    Object.assign(native, lib.native);
  }
  const publicNames = publicBuiltinNames2(jq2, native);
  native["builtins/0"] = function* () {
    yield createItem(publicNames);
  };
  return { jq: jq2, native, libraries: uniqueLibraries, publicNames };
}
var CORE_REGISTRY = {
  core: coreLibrary
};
function resolveCoreRegistry(libraries = ["core"]) {
  return resolveRegistry(CORE_REGISTRY, libraries);
}

// src/bxl/bridge/formula-contrib-jq.ts
var formulaContribJqFilters = parseBuiltinJqFilters(`
def TRUE: true;
def FALSE: false;
def NA: "#N/A" | error;
def INDEX(array; row): _EXCEL_INDEX(array; row);
def INDEX(array; row; column): _EXCEL_INDEX(array; row; column);
def IF(test; value_if_true; value_if_false):
  . as $xl_in
  | if ($xl_in | test)
      then ($xl_in | value_if_true)
      else ($xl_in | value_if_false)
    end;
def IF(test; value_if_true): IF(test; value_if_true; false);
def IFERROR(value; value_if_error):
  . as $xl_in
  | try ($xl_in | value) catch ($xl_in | value_if_error);
def IFNA(value; value_if_na):
  . as $xl_in
  | try ($xl_in | value)
    catch if . == "#N/A" then ($xl_in | value_if_na) else error end;
def ISERROR(value):
  try (. as $xl_in | $xl_in | value | false) catch true;
def ISNA(value):
  try (. as $xl_in | $xl_in | value | false) catch (. == "#N/A");
def ISERR(value):
  try (. as $xl_in | $xl_in | value | false) catch (. != "#N/A");
def ERROR_TYPE(value):
  (
    try (. as $xl_in | $xl_in | value | "__XL_NO_ERROR__")
    catch (
      if . == "#NULL!" then 1
      elif . == "#DIV/0!" then 2
      elif . == "#VALUE!" then 3
      elif . == "#REF!" then 4
      elif . == "#NAME?" then 5
      elif . == "#NUM!" then 6
      elif . == "#N/A" then 7
      elif . == "#GETTING_DATA" then 8
      else NA end
    )
  )
  | if . == "__XL_NO_ERROR__" then NA else . end;
def IFS(c1; v1; c2; v2):
  . as $in | if ($in | c1) then ($in | v1) elif ($in | c2) then ($in | v2) else NA end;
def IFS(c1; v1; c2; v2; c3; v3):
  . as $in | if ($in | c1) then ($in | v1) elif ($in | c2) then ($in | v2) elif ($in | c3) then ($in | v3) else NA end;
def IFS(c1; v1; c2; v2; c3; v3; c4; v4):
  . as $in | if ($in | c1) then ($in | v1) elif ($in | c2) then ($in | v2) elif ($in | c3) then ($in | v3) elif ($in | c4) then ($in | v4) else NA end;
def IFS(c1; v1; c2; v2; c3; v3; c4; v4; c5; v5):
  . as $in | if ($in | c1) then ($in | v1) elif ($in | c2) then ($in | v2) elif ($in | c3) then ($in | v3) elif ($in | c4) then ($in | v4) elif ($in | c5) then ($in | v5) else NA end;
def IFS(c1; v1; c2; v2; c3; v3; c4; v4; c5; v5; c6; v6):
  . as $in | if ($in | c1) then ($in | v1) elif ($in | c2) then ($in | v2) elif ($in | c3) then ($in | v3) elif ($in | c4) then ($in | v4) elif ($in | c5) then ($in | v5) elif ($in | c6) then ($in | v6) else NA end;
def IFS(c1; v1; c2; v2; c3; v3; c4; v4; c5; v5; c6; v6; c7; v7):
  . as $in | if ($in | c1) then ($in | v1) elif ($in | c2) then ($in | v2) elif ($in | c3) then ($in | v3) elif ($in | c4) then ($in | v4) elif ($in | c5) then ($in | v5) elif ($in | c6) then ($in | v6) elif ($in | c7) then ($in | v7) else NA end;
def IFS(c1; v1; c2; v2; c3; v3; c4; v4; c5; v5; c6; v6; c7; v7; c8; v8):
  . as $in | if ($in | c1) then ($in | v1) elif ($in | c2) then ($in | v2) elif ($in | c3) then ($in | v3) elif ($in | c4) then ($in | v4) elif ($in | c5) then ($in | v5) elif ($in | c6) then ($in | v6) elif ($in | c7) then ($in | v7) elif ($in | c8) then ($in | v8) else NA end;

# BXL-native helpers (lowercase) + Excel helpers not yet expressed in jq.
# ISBLANK is defined as a native filter elsewhere with Excel-strict
# semantics (null only, NOT empty string). present(x) below is the
# looser, form-friendly positive form that treats "" as absent too.
def present(x):
  . as $in | ($in | x) as $v | ($v != null) and ($v != "");

# when(p; q): conditional-requirement / implication.
# Reads "when p, require q" and vacuously passes when p is false.
# Excel shape is IF(p, q, TRUE); when(p; q) is the BXL shortcut.
def when(p; q):
  . as $in | if ($in | p) then ($in | q) else true end;

def implies(p; q): when(p; q);

# words(s): count whitespace-separated non-empty tokens. Excel has no
# direct equivalent; handles null gracefully and ignores double-spaces.
def words(s):
  . as $in | ($in | s) as $v
  | (($v // "") | split(" ") | map(select(. != "")) | length);

# nonempty(arr): strip nulls and empty strings from an array.
def nonempty(arr):
  . as $in | ($in | arr) | map(select(. != null and . != ""));

# overlaps(arr): true when the input array and arr share at least one value.
# This is the in-memory mirror of the predicate-profile SQL overlap operator.
def overlaps(arr):
  . as $left
  | arr as $right
  | if (($left | type) != "array") or (($right | type) != "array") then false
    else any($left[]; . as $item | any($right[]; . == $item))
    end;
`);

// src/formulajs/criteria.ts
function castLiteral(value) {
  if (/^-?\d+(\.\d+)?$/.test(value)) {
    return value.includes(".") ? parseFloat(value) : parseInt(value, 10);
  }
  const upper = value.toUpperCase();
  if (upper === "TRUE") {
    return true;
  }
  if (upper === "FALSE") {
    return false;
  }
  return value;
}
function hasWildcards(value) {
  let escaped = false;
  for (const char of value) {
    if (escaped) {
      escaped = false;
      continue;
    }
    if (char === "~") {
      escaped = true;
      continue;
    }
    if (char === "*" || char === "?") {
      return true;
    }
  }
  return false;
}
function wildcardToRegex(value) {
  let escaped = false;
  let pattern = "^";
  for (const char of value) {
    if (escaped) {
      pattern += char.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      escaped = false;
      continue;
    }
    if (char === "~") {
      escaped = true;
      continue;
    }
    if (char === "*") {
      pattern += ".*";
      continue;
    }
    if (char === "?") {
      pattern += ".";
      continue;
    }
    pattern += char.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  pattern += "$";
  return new RegExp(pattern, "i");
}
function normalizeStringValue(value) {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "boolean") {
    return value ? "TRUE" : "FALSE";
  }
  if (isExcelBlank(value)) {
    return "";
  }
  return String(value);
}
function compareStrings(left, right, operator) {
  const leftValue = left.toLowerCase();
  const rightValue = right.toLowerCase();
  const order = leftValue.localeCompare(rightValue);
  switch (operator) {
    case ">":
      return order > 0;
    case ">=":
      return order >= 0;
    case "<":
      return order < 0;
    case "<=":
      return order <= 0;
    case "=":
      return order === 0;
    case "<>":
      return order !== 0;
    default:
      return false;
  }
}
function compareValues(left, right, operator) {
  if (typeof right === "string" && (operator === "=" || operator === "<>")) {
    if (right === "") {
      const matched = isExcelBlank(left);
      return operator === "=" ? matched : !matched;
    }
    if (hasWildcards(right)) {
      const matched = wildcardToRegex(right).test(normalizeStringValue(left));
      return operator === "=" ? matched : !matched;
    }
  }
  if (typeof left === "string" || typeof right === "string") {
    return compareStrings(
      normalizeStringValue(left),
      normalizeStringValue(right),
      operator
    );
  }
  switch (operator) {
    case ">":
      return left > right;
    case ">=":
      return left >= right;
    case "<":
      return left < right;
    case "<=":
      return left <= right;
    case "=":
      return left == right;
    case "<>":
      return left != right;
    default:
      return false;
  }
}
function createCriteriaMatcher(criteria) {
  if (criteria === void 0) {
    return () => true;
  }
  if (typeof criteria === "string") {
    const match = criteria.match(/^(>=|<=|<>|>|<|=)?(.*)$/);
    const operator = match?.[1] ?? "=";
    const literal = castLiteral(match?.[2] ?? criteria);
    return (value) => compareValues(value, literal, operator);
  }
  return (value) => compareValues(value, criteria, "=");
}
function matchesCriteria(value, criteria) {
  return createCriteriaMatcher(criteria)(value);
}

// src/bxl/bridge/formula-dateSerial-native.ts
var bareNativeFilters = {
  *"DATE/3"(_input, year, month, day) {
    yield buildExcelDate(
      parseExcelNumber(year),
      parseExcelNumber(month),
      parseExcelNumber(day)
    );
  },
  *"DATEDIF/3"(_input, start, end, unit) {
    yield excelDatedif(start, end, unit);
  },
  *"DATEVALUE/1"(_input, text) {
    yield excelDatevalue(text);
  },
  *"DAY/1"(_input, value) {
    yield excelDay(value);
  },
  *"DAYS360/2"(_input, start, end) {
    yield excelDays360(start, end);
  },
  *"DAYS360/3"(_input, start, end, method) {
    yield excelDays360(start, end, method);
  },
  *"MONTH/1"(_input, value) {
    yield excelMonth(value);
  },
  *"NETWORKDAYS_INTL/2"(_input, start, end) {
    yield excelNetworkdaysIntl(start, end);
  },
  *"NETWORKDAYS_INTL/3"(_input, start, end, weekend) {
    yield excelNetworkdaysIntl(start, end, weekend);
  },
  *"NETWORKDAYS_INTL/4"(_input, start, end, weekend, holidays) {
    yield excelNetworkdaysIntl(start, end, weekend, holidays);
  },
  *"NETWORKDAYS/2"(_input, start, end) {
    yield excelNetworkdays(start, end);
  },
  *"NETWORKDAYS/3"(_input, start, end, holidays) {
    yield excelNetworkdays(start, end, holidays);
  },
  *"WEEKNUM/1"(_input, serial) {
    yield excelWeeknum(serial);
  },
  *"WEEKNUM/2"(_input, serial, returnType) {
    yield excelWeeknum(serial, returnType);
  },
  *"WORKDAY_INTL/2"(_input, start, days) {
    yield excelWorkdayIntl(start, days);
  },
  *"WORKDAY_INTL/3"(_input, start, days, weekend) {
    yield excelWorkdayIntl(start, days, weekend);
  },
  *"WORKDAY_INTL/4"(_input, start, days, weekend, holidays) {
    yield excelWorkdayIntl(start, days, weekend, holidays);
  },
  *"WORKDAY/2"(_input, start, days) {
    yield excelWorkday(start, days);
  },
  *"WORKDAY/3"(_input, start, days, holidays) {
    yield excelWorkday(start, days, holidays);
  },
  *"YEAR/1"(_input, value) {
    yield excelYear(value);
  },
  *"YEARFRAC/2"(_input, startDate, endDate) {
    yield yearFrac(startDate, endDate);
  },
  *"YEARFRAC/3"(_input, startDate, endDate, basis) {
    yield yearFrac(startDate, endDate, parseExcelNumber(basis));
  }
};
var formulaDateSerialNativeFilters = wrapBareNativeFilters(bareNativeFilters);

// src/bxl/bridge/formula-contrib-native.ts
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
function expectCriteriaObject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throwExcelError(EXCEL_ERROR.value);
  }
  return value;
}
function colValues(rowsLike, keyLike) {
  const rows = expectRows(rowsLike);
  const key = parseExcelString(keyLike);
  return rows.map(
    (row) => Object.prototype.hasOwnProperty.call(row, key) ? row[key] : null
  );
}
function filterRowsByCriteria(rowsLike, criteriaLike) {
  const rows = expectRows(rowsLike);
  const criteria = expectCriteriaObject(criteriaLike);
  return rows.filter(
    (row) => Object.entries(criteria).every(
      ([key, expected]) => matchesCriteria(row[key] ?? null, expected)
    )
  );
}
function roundBase(numberLike, digitsLike, roundFn) {
  const number = parseExcelNumber(numberLike);
  const digits = parseExcelNumber(digitsLike);
  const sign = number >= 0 ? 1 : -1;
  const absolute = Math.abs(number);
  let pair = `${absolute}e${digits}`.split("e");
  const shifted = roundFn(Number(`${pair[0]}e${pair[1]}`));
  pair = `${shifted}e${-digits}`.split("e");
  return Number(`${pair[0]}e${pair[1]}`) * sign;
}
function ceilingValue(numberLike, significanceLike = 1) {
  const number = parseExcelNumber(numberLike);
  const significance = Math.abs(parseExcelNumber(significanceLike));
  if (significance === 0) {
    return 0;
  }
  return Math.ceil(number / significance) * significance;
}
function floorValue(numberLike, significanceLike = 1) {
  const number = parseExcelNumber(numberLike);
  const significance = Math.abs(parseExcelNumber(significanceLike));
  if (significance === 0) {
    return 0;
  }
  return Math.floor(number / significance) * significance;
}
function checkedMathResult(result) {
  if (!Number.isFinite(result) || Number.isNaN(result)) {
    throwExcelError(EXCEL_ERROR.num);
  }
  return result;
}
function factorialValue(valueLike) {
  const number = Math.floor(parseExcelNumber(valueLike));
  if (number < 0) {
    throwExcelError(EXCEL_ERROR.num);
  }
  let result = 1;
  for (let factor = 2; factor <= number; factor++) {
    result *= factor;
    checkedMathResult(result);
  }
  return result;
}
function logValue(numberLike, baseLike = 10) {
  const number = parseExcelNumber(numberLike);
  const base = parseExcelNumber(baseLike);
  if (number <= 0 || base <= 0 || base === 1) {
    throwExcelError(EXCEL_ERROR.num);
  }
  if (base === 10) {
    return checkedMathResult(Math.log10(number));
  }
  return checkedMathResult(Math.log(number) / Math.log(base));
}
function truncValue(numberLike, digitsLike = 0) {
  const number = parseExcelNumber(numberLike);
  const digits = Math.trunc(parseExcelNumber(digitsLike));
  const factor = 10 ** digits;
  return (number < 0 ? -1 : 1) * Math.floor(Math.abs(number) * factor) / factor;
}
function multinomialValue(valuesLike) {
  const values = parseExcelNumberArray(valuesLike);
  const sum = values.reduce((total, entry) => total + Math.floor(entry), 0);
  const divisor = values.reduce(
    (product, entry) => product * factorialValue(entry),
    1
  );
  return checkedMathResult(factorialValue(sum) / divisor);
}
function seriesSumValue(xLike, nLike, mLike, coefficientsLike) {
  const x = parseExcelNumber(xLike);
  const n = parseExcelNumber(nLike);
  const m = parseExcelNumber(mLike);
  const coefficients = parseExcelNumberArray(coefficientsLike);
  return checkedMathResult(
    coefficients.reduce(
      (total, coefficient, index) => total + coefficient * x ** (n + index * m),
      0
    )
  );
}
function sumPairValue(leftLike, rightLike, mapper) {
  const left = parseExcelNumberArray(leftLike);
  const right = parseExcelNumberArray(rightLike);
  if (left.length !== right.length) {
    throwExcelError(EXCEL_ERROR.value);
  }
  return checkedMathResult(
    left.reduce((sum, entry, index) => sum + mapper(entry, right[index]), 0)
  );
}
var NOW_SERIAL_MS_PER_DAY = 864e5;
var NOW_SERIAL_EPOCH_MS = Date.UTC(1900, 0, 1);
var NOW_SERIAL_LEAP_BUG_BOUNDARY_MS = Date.UTC(1900, 1, 28);
function nowSerial() {
  const now = /* @__PURE__ */ new Date();
  const day = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate()
  ));
  const seconds = now.getUTCHours() * 3600 + now.getUTCMinutes() * 60 + now.getUTCSeconds() + now.getUTCMilliseconds() / 1e3;
  const addOn = day.getTime() > NOW_SERIAL_LEAP_BUG_BOUNDARY_MS ? 2 : 1;
  const daySerial = Math.ceil((day.getTime() - NOW_SERIAL_EPOCH_MS) / NOW_SERIAL_MS_PER_DAY) + addOn;
  return daySerial + seconds / 86400;
}
function replaceNth(text, oldText, newText, instance) {
  let index = 0;
  let found = 0;
  while (index > -1 && text.indexOf(oldText, index) > -1) {
    index = text.indexOf(oldText, index + 1);
    found++;
    if (index > -1 && found === instance) {
      return text.slice(0, index) + newText + text.slice(index + oldText.length);
    }
  }
  return text;
}
function toTextForConcat(value) {
  if (value === void 0 || value === null) {
    return "";
  }
  if (typeof value === "boolean") {
    return value ? "TRUE" : "FALSE";
  }
  return String(value);
}
function excelValue(textLike) {
  if (typeof textLike === "number") {
    return textLike;
  }
  let text = textLike;
  if (text === void 0 || text === null) {
    text = "";
  }
  if (typeof text !== "string") {
    throwExcelError(EXCEL_ERROR.value);
  }
  const isPercent = /(%)$/.test(text) || /^(%)/.test(text);
  let normalized = text.replace(/^[^0-9-]{0,3}/, "");
  normalized = normalized.replace(/[^0-9]{0,3}$/, "");
  normalized = normalized.replace(/[ ,]/g, "");
  if (normalized === "") {
    if (text.trim() === "") {
      return 0;
    }
    throwExcelError(EXCEL_ERROR.value);
  }
  const output = Number(normalized);
  if (Number.isNaN(output)) {
    throwExcelError(EXCEL_ERROR.value);
  }
  return isPercent ? output * 0.01 : output;
}
function excelText(valueLike, formatTextLike) {
  if (valueLike instanceof Date) {
    return valueLike.toISOString().slice(0, 10);
  }
  if (formatTextLike === void 0 || formatTextLike === null) {
    return "";
  }
  if (typeof formatTextLike === "number") {
    return String(formatTextLike);
  }
  if (typeof formatTextLike !== "string") {
    throwExcelError(EXCEL_ERROR.value);
  }
  const currencySymbol = formatTextLike.startsWith("$") ? "$" : "";
  const isPercent = formatTextLike.endsWith("%");
  let formatText = formatTextLike.replace(/%/g, "").replace(/\$/g, "");
  const decimalPlaces = formatText.includes(".") ? (formatText.split(".")[1].match(/0/g) ?? []).length : 0;
  const noCommas = !formatText.includes(",");
  let value = parseExcelNumber(valueLike);
  if (isPercent) {
    value *= 100;
  }
  let rendered = fixedValue(value, decimalPlaces, noCommas);
  if (rendered.startsWith("-")) {
    rendered = `-${currencySymbol}${rendered.slice(1)}`;
  } else {
    rendered = `${currencySymbol}${rendered}`;
  }
  if (isPercent) {
    rendered += "%";
  }
  return rendered;
}
function fixedValue(numberLike, decimalsLike = 2, noCommasLike = false) {
  let number = parseExcelNumber(numberLike);
  const decimals = parseExcelNumber(decimalsLike);
  const noCommas = parseExcelBool(noCommasLike);
  if (decimals < 0) {
    const factor = Math.pow(10, -decimals);
    number = Math.round(number / factor) * factor;
  } else {
    number = Number(number.toFixed(decimals));
  }
  let rendered = decimals < 0 ? String(number) : number.toFixed(decimals);
  if (noCommas) {
    return rendered.replace(/,/g, "");
  }
  const parts = rendered.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  rendered = parts.join(".");
  if (number < 0) {
    return rendered;
  }
  return rendered;
}
function dollarValue(numberLike, decimalsLike = 2) {
  let number = parseExcelNumber(numberLike);
  const decimals = parseExcelNumber(decimalsLike);
  number = roundBase(number, decimals, Math.round);
  const options = {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals >= 0 ? decimals : 0,
    maximumFractionDigits: decimals >= 0 ? decimals : 0
  };
  const formatted = number.toLocaleString("en-US", options);
  if (number < 0) {
    return `(${formatted.slice(1)})`;
  }
  return formatted;
}
function numberValue(textLike, decimalSeparatorLike, groupSeparatorLike) {
  const text = textLike === void 0 || textLike === null ? "" : textLike;
  if (typeof text === "number") {
    return text;
  }
  if (typeof text !== "string") {
    throwExcelError(EXCEL_ERROR.na);
  }
  const decimalSeparator = decimalSeparatorLike === void 0 ? "." : parseExcelString(decimalSeparatorLike);
  const groupSeparator = groupSeparatorLike === void 0 ? "," : parseExcelString(groupSeparatorLike);
  if (decimalSeparator === groupSeparator) {
    throwExcelError(EXCEL_ERROR.value);
  }
  const parsed = Number(
    text.split(groupSeparator).join("").replace(decimalSeparator, ".")
  );
  if (Number.isNaN(parsed)) {
    throwExcelError(EXCEL_ERROR.value);
  }
  return parsed;
}
var ROMAN_TOKEN_VALUES = {
  M: 1e3,
  CM: 900,
  D: 500,
  CD: 400,
  C: 100,
  XC: 90,
  L: 50,
  XL: 40,
  X: 10,
  IX: 9,
  V: 5,
  IV: 4,
  I: 1
};
function arabicValue(textLike) {
  const text = parseExcelString(textLike);
  if (!/^M*(?:D?C{0,3}|C[MD])(?:L?X{0,3}|X[CL])(?:V?I{0,3}|I[XV])$/.test(text)) {
    throwExcelError(EXCEL_ERROR.value);
  }
  let total = 0;
  text.replace(/[MDLV]|C[MD]?|X[CL]?|I[XV]?/g, (token) => {
    total += ROMAN_TOKEN_VALUES[token] ?? 0;
    return token;
  });
  return total;
}
function romanValue(numberLike) {
  const number = Math.floor(parseExcelNumber(numberLike));
  if (number < 0) {
    throwExcelError(EXCEL_ERROR.value);
  }
  const digits = String(number).split("");
  const key = [
    "",
    "C",
    "CC",
    "CCC",
    "CD",
    "D",
    "DC",
    "DCC",
    "DCCC",
    "CM",
    "",
    "X",
    "XX",
    "XXX",
    "XL",
    "L",
    "LX",
    "LXX",
    "LXXX",
    "XC",
    "",
    "I",
    "II",
    "III",
    "IV",
    "V",
    "VI",
    "VII",
    "VIII",
    "IX"
  ];
  let roman = "";
  let index = 3;
  while (index--) {
    roman = (key[Number(digits.pop()) + index * 10] ?? "") + roman;
  }
  return `${"M".repeat(Number(digits.join("")))}${roman}`;
}
function properValue(textLike) {
  return parseExcelString(textLike).replace(
    /\w\S*/g,
    (entry) => entry.charAt(0).toUpperCase() + entry.slice(1).toLowerCase()
  );
}
function textJoin(delimiterLike, ignoreEmptyLike, valuesLike) {
  const delimiter = delimiterLike === null || delimiterLike === void 0 ? "" : Array.isArray(delimiterLike) ? flattenExcelArgs(delimiterLike).map((entry) => toTextForConcat(entry)).join("") : String(delimiterLike);
  const ignoreEmpty = parseExcelBool(ignoreEmptyLike);
  const values = flattenExcelArgs(valuesLike).filter((entry) => !ignoreEmpty || !isExcelBlank(entry)).map((entry) => toTextForConcat(entry));
  return values.join(delimiter);
}
function logicalRangeValue(valueLike) {
  let result = null;
  for (const entry of flattenExcelArgs(valueLike)) {
    if (entry === void 0 || entry === null || typeof entry === "string") {
      continue;
    }
    if (result === null) {
      result = false;
    }
    if (!entry) {
      return false;
    }
    result = true;
  }
  if (result === null) {
    throwExcelError(EXCEL_ERROR.value);
  }
  return result;
}
function logicalAnyValue(valueLike) {
  let sawValue = false;
  for (const entry of flattenExcelArgs(valueLike)) {
    if (entry === void 0 || entry === null || typeof entry === "string") {
      continue;
    }
    sawValue = true;
    if (entry) {
      return true;
    }
  }
  if (!sawValue) {
    throwExcelError(EXCEL_ERROR.value);
  }
  return false;
}
function logicalXorValue(valueLike) {
  let count = 0;
  let sawValue = false;
  for (const entry of flattenExcelArgs(valueLike)) {
    if (entry === void 0 || entry === null || typeof entry === "string") {
      continue;
    }
    sawValue = true;
    if (entry) {
      count++;
    }
  }
  if (!sawValue) {
    throwExcelError(EXCEL_ERROR.value);
  }
  return Boolean(Math.floor(Math.abs(count)) & 1);
}
function countIf(rangeLike, criteriaLike) {
  const range2 = flattenExcelArgs(rangeLike);
  const matcher = createCriteriaMatcher(criteriaLike);
  return range2.reduce(
    (count, entry) => count + (matcher(entry) ? 1 : 0),
    0
  );
}
function sumIf(rangeLike, criteriaLike, sumRangeLike) {
  const range2 = flattenExcelArgs(rangeLike);
  const sumRange = flattenExcelArgs(sumRangeLike ?? rangeLike);
  const matcher = createCriteriaMatcher(criteriaLike);
  let total = 0;
  for (let i = 0; i < range2.length; i++) {
    if (matcher(range2[i])) {
      total += parseExcelNumber(sumRange[i] ?? 0);
    }
  }
  return total;
}
function averageIf(rangeLike, criteriaLike, averageRangeLike) {
  const range2 = flattenExcelArgs(rangeLike);
  const averageRange = flattenExcelArgs(averageRangeLike ?? rangeLike);
  const matcher = createCriteriaMatcher(criteriaLike);
  let total = 0;
  let count = 0;
  for (let i = 0; i < range2.length; i++) {
    if (matcher(range2[i])) {
      total += parseExcelNumber(averageRange[i] ?? 0);
      count++;
    }
  }
  if (count === 0) {
    throwExcelError(EXCEL_ERROR.div0);
  }
  return total / count;
}
function chooseValue(indexLike, optionsLike) {
  const index = Math.trunc(parseExcelNumber(indexLike));
  const options = Array.isArray(optionsLike) ? optionsLike : [optionsLike];
  if (index < 1 || index > options.length) {
    throwExcelError(EXCEL_ERROR.value);
  }
  return options[index - 1];
}
function matchValue(lookupValue2, lookupArrayLike, matchTypeLike = 1) {
  const lookupArray = flattenExcelArgs(lookupArrayLike);
  const matchType = parseExcelNumber(matchTypeLike);
  if (![1, 0, -1].includes(matchType)) {
    throwExcelError(EXCEL_ERROR.na);
  }
  let index;
  let indexValue2;
  for (let idx = 0; idx < lookupArray.length; idx++) {
    const entry = lookupArray[idx];
    if (matchType === 1) {
      if (entry === lookupValue2) {
        return idx + 1;
      }
      if (entry < lookupValue2) {
        if (indexValue2 === void 0 || entry > indexValue2) {
          index = idx + 1;
          indexValue2 = entry;
        }
      }
    } else if (matchType === 0) {
      if (typeof lookupValue2 === "string" && typeof entry === "string") {
        const escaped = lookupValue2.toLowerCase().replace(/\?/g, ".").replace(/\*/g, ".*").replace(/~/g, "\\").replace(/\+/g, "\\+").replace(/\(/g, "\\(").replace(/\)/g, "\\)").replace(/\[/g, "\\[").replace(/\]/g, "\\]");
        if (new RegExp(`^${escaped}$`).test(entry.toLowerCase())) {
          return idx + 1;
        }
      } else if (entry === lookupValue2) {
        return idx + 1;
      }
    } else if (matchType === -1) {
      if (entry === lookupValue2) {
        return idx + 1;
      }
      if (entry > lookupValue2) {
        if (indexValue2 === void 0 || entry < indexValue2) {
          index = idx + 1;
          indexValue2 = entry;
        }
      }
    }
  }
  if (index === void 0) {
    throwExcelError(EXCEL_ERROR.na);
  }
  return index;
}
function toLookupTable(tableLike) {
  if (!Array.isArray(tableLike)) {
    throwExcelError(EXCEL_ERROR.value);
  }
  return tableLike.map((row) => Array.isArray(row) ? row : [row]);
}
function transposeLookupTable(tableLike) {
  const table = toLookupTable(tableLike);
  const width = table.reduce((max, row) => Math.max(max, row.length), 0);
  return Array.from(
    { length: width },
    (_, columnIndex) => table.map((row) => row[columnIndex])
  );
}
function indexValue(arrayLike, rowNumLike, columnNumLike) {
  if (!Array.isArray(arrayLike)) {
    throwExcelError(EXCEL_ERROR.value);
  }
  let rowNum = parseExcelNumber(rowNumLike);
  let columnNum = columnNumLike === void 0 ? void 0 : parseExcelNumber(columnNumLike);
  const isOneDimensionRange = arrayLike.length > 0 && !Array.isArray(arrayLike[0]);
  if (isOneDimensionRange && columnNum === void 0) {
    columnNum = rowNum;
    rowNum = 1;
  } else {
    rowNum = rowNum || 1;
    columnNum = columnNum || 1;
  }
  if (rowNum < 0 || (columnNum ?? 0) < 0) {
    throwExcelError(EXCEL_ERROR.value);
  }
  if (isOneDimensionRange) {
    const vector = arrayLike;
    if (rowNum === 1 && (columnNum ?? 0) <= vector.length) {
      return vector[(columnNum ?? 1) - 1];
    }
    throwExcelError(EXCEL_ERROR.ref);
  }
  const table = arrayLike;
  if (rowNum <= table.length && (columnNum ?? 0) <= table[rowNum - 1].length) {
    return table[rowNum - 1][(columnNum ?? 1) - 1];
  }
  throwExcelError(EXCEL_ERROR.ref);
}
function lookupValue(lookupLike, arrayLike, resultArrayLike) {
  const lookupArray = flattenExcelArgs(arrayLike);
  const resultArray = resultArrayLike === void 0 ? lookupArray : flattenExcelArgs(resultArrayLike);
  const isNumberLookup = typeof lookupLike === "number";
  let result = void 0;
  let found = false;
  for (let index = 0; index < lookupArray.length; index++) {
    const entry = lookupArray[index];
    if (entry === lookupLike) {
      return resultArray[index];
    }
    if (isNumberLookup && typeof entry === "number" && entry <= lookupLike || typeof entry === "string" && typeof lookupLike === "string" && entry.localeCompare(lookupLike) < 0) {
      result = resultArray[index];
      found = true;
      continue;
    }
    if (isNumberLookup && typeof entry === "number" && entry > lookupLike) {
      if (found) {
        return result;
      }
      break;
    }
  }
  if (!found) {
    throwExcelError(EXCEL_ERROR.na);
  }
  return result;
}
function xlookupValue(lookupLike, lookupArrayLike, returnArrayLike, ifNotFound = void 0, matchModeLike = 0, searchModeLike = 1) {
  const lookupArray = flattenExcelArgs(lookupArrayLike);
  const returnArray = flattenExcelArgs(returnArrayLike);
  const matchMode = parseExcelNumber(matchModeLike);
  const searchMode = parseExcelNumber(searchModeLike);
  if (![0, -1, 1].includes(matchMode) || ![1, -1].includes(searchMode)) {
    throwExcelError(EXCEL_ERROR.value);
  }
  const indices2 = lookupArray.map((_, index) => index);
  if (searchMode === -1) {
    indices2.reverse();
  }
  for (const index of indices2) {
    const entry = lookupArray[index];
    if (entry === lookupLike) {
      return returnArray[index] ?? null;
    }
  }
  if (matchMode !== 0) {
    let bestIndex;
    for (const index of indices2) {
      const entry = lookupArray[index];
      if (typeof entry === "number" && typeof lookupLike === "number") {
        if (matchMode === -1 && entry < lookupLike || matchMode === 1 && entry > lookupLike) {
          if (bestIndex === void 0 || matchMode === -1 && entry > lookupArray[bestIndex] || matchMode === 1 && entry < lookupArray[bestIndex]) {
            bestIndex = index;
          }
        }
      }
      if (typeof entry === "string" && typeof lookupLike === "string") {
        const order = entry.localeCompare(lookupLike);
        if (matchMode === -1 && order < 0 || matchMode === 1 && order > 0) {
          if (bestIndex === void 0 || matchMode === -1 && entry.localeCompare(String(lookupArray[bestIndex])) > 0 || matchMode === 1 && entry.localeCompare(String(lookupArray[bestIndex])) < 0) {
            bestIndex = index;
          }
        }
      }
    }
    if (bestIndex !== void 0) {
      return returnArray[bestIndex] ?? null;
    }
  }
  if (ifNotFound !== void 0) {
    return ifNotFound;
  }
  throwExcelError(EXCEL_ERROR.na);
}
function vlookupValue(lookupLike, tableLike, colIndexLike, rangeLookupLike) {
  if (!tableLike) {
    throwExcelError(EXCEL_ERROR.na);
  }
  const colIndex = parseExcelNumber(colIndexLike);
  if (!colIndex) {
    throwExcelError(EXCEL_ERROR.na);
  }
  if (colIndex < 1) {
    throwExcelError(EXCEL_ERROR.value);
  }
  const table = toLookupTable(tableLike);
  const rangeLookup = rangeLookupLike === void 0 ? true : parseExcelBool(rangeLookupLike);
  const lookupValueNormalized = typeof lookupLike === "string" ? lookupLike.toLowerCase() : lookupLike;
  const isNumberLookup = typeof lookupLike === "number";
  let result = void 0;
  let found = false;
  let exactMatchOnly = false;
  for (const row of table) {
    const rowValue = typeof row[0] === "string" ? row[0].toLowerCase() : row[0];
    if (rowValue === lookupValueNormalized) {
      if (colIndex > row.length) {
        throwExcelError(EXCEL_ERROR.ref);
      }
      return row[colIndex - 1];
    }
    if (!exactMatchOnly && rangeLookup && (isNumberLookup && typeof rowValue === "number" && rowValue <= lookupLike || typeof rowValue === "string" && typeof lookupValueNormalized === "string" && rowValue.localeCompare(lookupValueNormalized) < 0)) {
      if (colIndex > row.length) {
        throwExcelError(EXCEL_ERROR.ref);
      }
      result = row[colIndex - 1];
      found = true;
    }
    if (isNumberLookup && typeof rowValue === "number" && rowValue > lookupLike) {
      exactMatchOnly = true;
    }
  }
  if (!found) {
    throwExcelError(EXCEL_ERROR.na);
  }
  return result;
}
function lookupByRows(rowsLike, lookupKeyLike, lookupValueLike, resultKeyLike) {
  return lookupValue(
    lookupValueLike,
    colValues(rowsLike, lookupKeyLike),
    colValues(rowsLike, resultKeyLike)
  );
}
function vlookupByRows(rowsLike, lookupKeyLike, lookupValueLike, resultKeyLike, rangeLookupLike = false) {
  const lookupKey = parseExcelString(lookupKeyLike);
  const resultKey = parseExcelString(resultKeyLike);
  const rows = expectRows(rowsLike);
  const table = rows.map((row) => [row[lookupKey] ?? null, row[resultKey] ?? null]);
  return vlookupValue(lookupValueLike, table, 2, rangeLookupLike);
}
function sqlLikeValue(valueLike, patternLike) {
  const value = parseExcelString(valueLike);
  const pattern = parseExcelString(patternLike);
  let regex = "^";
  for (const char of pattern) {
    if (char === "%") {
      regex += ".*";
    } else if (char === "_") {
      regex += ".";
    } else {
      regex += char.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&");
    }
  }
  regex += "$";
  return new RegExp(regex, "s").test(value);
}
function betweenValue(value, lower, upper) {
  return compare(value, lower) >= 0 && compare(value, upper) <= 0;
}
var bareNativeFilters2 = {
  *"between/3"(_input, value, lower, upper) {
    yield betweenValue(value, lower, upper);
  },
  *"like/2"(_input, value, pattern) {
    yield sqlLikeValue(value, pattern);
  },
  *"ABS/1"(_input, value) {
    yield Math.abs(parseExcelNumber(value));
  },
  *"ACOS/1"(_input, value) {
    yield checkedMathResult(Math.acos(parseExcelNumber(value)));
  },
  *"ACOSH/1"(_input, value) {
    yield checkedMathResult(Math.acosh(parseExcelNumber(value)));
  },
  *"ACOT/1"(_input, value) {
    const number = parseExcelNumber(value);
    const result = Math.atan(1 / number);
    yield checkedMathResult(number < 0 ? result + Math.PI : result);
  },
  *"ACOTH/1"(_input, value) {
    const number = parseExcelNumber(value);
    if (Math.abs(number) <= 1) {
      throwExcelError(EXCEL_ERROR.num);
    }
    yield checkedMathResult(0.5 * Math.log((number + 1) / (number - 1)));
  },
  *"AND/1"(_input, value) {
    yield logicalRangeValue(value);
  },
  *"ARABIC/1"(_input, text) {
    yield arabicValue(text);
  },
  *"ASIN/1"(_input, value) {
    yield checkedMathResult(Math.asin(parseExcelNumber(value)));
  },
  *"ASINH/1"(_input, value) {
    yield checkedMathResult(Math.asinh(parseExcelNumber(value)));
  },
  *"ATAN/1"(_input, value) {
    yield Math.atan(parseExcelNumber(value));
  },
  *"ATAN2/2"(_input, xNum, yNum) {
    const x = parseExcelNumber(xNum);
    const y = parseExcelNumber(yNum);
    if (x === 0 && y === 0) {
      throwExcelError(EXCEL_ERROR.div0);
    }
    yield checkedMathResult(Math.atan2(y, x));
  },
  *"ATANH/1"(_input, value) {
    yield checkedMathResult(Math.atanh(parseExcelNumber(value)));
  },
  *"AVERAGE/1"(_input, value) {
    yield averageExcelRange(value);
  },
  *"AVERAGEIF/2"(_input, range2, criteria) {
    yield averageIf(range2, criteria);
  },
  *"AVERAGEIF/3"(_input, range2, criteria, averageRange) {
    yield averageIf(range2, criteria, averageRange);
  },
  *"AVERAGEIF_BY/4"(_input, rows, valueKey, criteriaKey, criteria) {
    yield averageIf(colValues(rows, criteriaKey), criteria, colValues(rows, valueKey));
  },
  *"AVERAGEIFS_BY/3"(_input, rows, valueKey, criteriaObject) {
    const filteredRows = filterRowsByCriteria(rows, criteriaObject);
    yield averageExcelRange(colValues(filteredRows, valueKey));
  },
  *"CHAR/1"(_input, value) {
    const number = parseExcelNumber(value);
    if (number === 0) {
      throwExcelError(EXCEL_ERROR.value);
    }
    yield String.fromCharCode(number);
  },
  *"CHOOSE/2"(_input, index, options) {
    yield chooseValue(index, options);
  },
  *"CLEAN/1"(_input, value) {
    yield parseExcelString(value).replace(/[\0-\x1F]/g, "");
  },
  *"CODE/1"(_input, value) {
    const text = parseExcelString(value);
    const code = text.charCodeAt(0);
    if (Number.isNaN(code)) {
      throwExcelError(EXCEL_ERROR.value);
    }
    yield code;
  },
  *"COL/2"(_input, rows, key) {
    yield colValues(rows, key);
  },
  *"COLUMNS/1"(_input, value) {
    if (!Array.isArray(value)) {
      throwExcelError(EXCEL_ERROR.value);
    }
    if (value.length === 0) {
      yield 0;
      return;
    }
    yield Array.isArray(value[0]) ? value[0].length : value.length;
  },
  *"CONCAT/1"(_input, value) {
    yield flattenExcelArgs(value).map((entry) => toTextForConcat(entry)).join("");
  },
  *"CONCATENATE/1"(_input, value) {
    yield flattenExcelArgs(value).map((entry) => toTextForConcat(entry)).join("");
  },
  *"COUNT/1"(_input, value) {
    yield countExcelNumbers(value);
  },
  *"COUNTA/1"(_input, value) {
    yield countExcelValues(value);
  },
  *"COUNTIF/2"(_input, range2, criteria) {
    yield countIf(range2, criteria);
  },
  *"COUNTIF_BY/3"(_input, rows, criteriaKey, criteria) {
    yield countIf(colValues(rows, criteriaKey), criteria);
  },
  *"COUNTIFS_BY/2"(_input, rows, criteriaObject) {
    yield filterRowsByCriteria(rows, criteriaObject).length;
  },
  *"COS/1"(_input, value) {
    yield checkedMathResult(Math.cos(parseExcelNumber(value)));
  },
  *"COSH/1"(_input, value) {
    yield checkedMathResult(Math.cosh(parseExcelNumber(value)));
  },
  *"COT/1"(_input, value) {
    const number = parseExcelNumber(value);
    if (number === 0) {
      throwExcelError(EXCEL_ERROR.div0);
    }
    yield checkedMathResult(1 / Math.tan(number));
  },
  *"COTH/1"(_input, value) {
    const number = parseExcelNumber(value);
    if (number === 0) {
      throwExcelError(EXCEL_ERROR.div0);
    }
    yield checkedMathResult(1 / Math.tanh(number));
  },
  *"CSC/1"(_input, value) {
    const number = parseExcelNumber(value);
    if (number === 0) {
      throwExcelError(EXCEL_ERROR.div0);
    }
    yield checkedMathResult(1 / Math.sin(number));
  },
  *"CSCH/1"(_input, value) {
    const number = parseExcelNumber(value);
    if (number === 0) {
      throwExcelError(EXCEL_ERROR.div0);
    }
    yield checkedMathResult(1 / Math.sinh(number));
  },
  *"DOLLAR/1"(_input, number) {
    yield dollarValue(number);
  },
  *"DOLLAR/2"(_input, number, decimals) {
    yield dollarValue(number, decimals);
  },
  *"EXACT/2"(_input, left, right) {
    yield parseExcelString(left) === parseExcelString(right);
  },
  *"EXP/1"(_input, value) {
    yield checkedMathResult(Math.exp(parseExcelNumber(value)));
  },
  *"FALSE/0"() {
    yield false;
  },
  *"FIND/2"(_input, findText, withinText) {
    const found = parseExcelString(withinText).indexOf(parseExcelString(findText));
    if (found === -1) {
      throwExcelError(EXCEL_ERROR.value);
    }
    yield found + 1;
  },
  *"FIND/3"(_input, findText, withinText, startNum) {
    const found = parseExcelString(withinText).indexOf(
      parseExcelString(findText),
      parseExcelNumber(startNum) - 1
    );
    if (found === -1) {
      throwExcelError(EXCEL_ERROR.value);
    }
    yield found + 1;
  },
  *"FIXED/1"(_input, number) {
    yield fixedValue(number);
  },
  *"FIXED/2"(_input, number, decimals) {
    yield fixedValue(number, decimals);
  },
  *"FIXED/3"(_input, number, decimals, noCommas) {
    yield fixedValue(number, decimals, noCommas);
  },
  *"FLOOR/1"(_input, number) {
    yield floorValue(number);
  },
  *"FLOOR/2"(_input, number, significance) {
    yield floorValue(number, significance);
  },
  *"FLOOR_MATH/1"(_input, number) {
    yield floorValue(number);
  },
  *"FLOOR_MATH/2"(_input, number, significance) {
    yield floorValue(number, significance);
  },
  *"HLOOKUP/3"(_input, lookupValueLike, table, rowIndex) {
    yield vlookupValue(lookupValueLike, transposeLookupTable(table), rowIndex);
  },
  *"HLOOKUP/4"(_input, lookupValueLike, table, rowIndex, rangeLookup) {
    yield vlookupValue(lookupValueLike, transposeLookupTable(table), rowIndex, rangeLookup);
  },
  *"INDEX/2"(_input, array, rowNum) {
    yield indexValue(array, rowNum);
  },
  *"INDEX/3"(_input, array, rowNum, columnNum) {
    yield indexValue(array, rowNum, columnNum);
  },
  *"_EXCEL_INDEX/2"(_input, array, rowNum) {
    yield indexValue(array, rowNum);
  },
  *"_EXCEL_INDEX/3"(_input, array, rowNum, columnNum) {
    yield indexValue(array, rowNum, columnNum);
  },
  *"INT/1"(_input, value) {
    yield Math.floor(parseExcelNumber(value));
  },
  *"ISBLANK/1"(_input, value) {
    yield value === null || value === void 0;
  },
  *"ISNUMBER/1"(_input, value) {
    yield typeof value === "number" && !Number.isNaN(value) && Number.isFinite(value);
  },
  *"ISTEXT/1"(_input, value) {
    yield typeof value === "string";
  },
  *"LEFT/1"(_input, value) {
    yield parseExcelString(value).slice(0, 1);
  },
  *"LEFT/2"(_input, value, count) {
    yield parseExcelString(value).slice(0, parseExcelNumber(count));
  },
  *"LEN/1"(_input, value) {
    yield parseExcelString(value).length;
  },
  *"LN/1"(_input, value) {
    const number = parseExcelNumber(value);
    if (number <= 0) {
      throwExcelError(EXCEL_ERROR.num);
    }
    yield checkedMathResult(Math.log(number));
  },
  *"LOG/1"(_input, number) {
    yield logValue(number);
  },
  *"LOG/2"(_input, number, base) {
    yield logValue(number, base);
  },
  *"LOG10/1"(_input, number) {
    yield logValue(number, 10);
  },
  *"LOWER/1"(_input, value) {
    yield parseExcelString(value).toLowerCase();
  },
  *"LOOKUP/2"(_input, lookupValueLike, lookupArray) {
    yield lookupValue(lookupValueLike, lookupArray);
  },
  *"LOOKUP/3"(_input, lookupValueLike, lookupArray, resultArray) {
    yield lookupValue(lookupValueLike, lookupArray, resultArray);
  },
  *"LOOKUP_BY/4"(_input, rows, lookupKey, lookupValueLike, resultKey) {
    yield lookupByRows(rows, lookupKey, lookupValueLike, resultKey);
  },
  *"MATCH/2"(_input, lookupValue2, lookupArray) {
    yield matchValue(lookupValue2, lookupArray);
  },
  *"MATCH/3"(_input, lookupValue2, lookupArray, matchType) {
    yield matchValue(lookupValue2, lookupArray, matchType);
  },
  *"MAX/1"(_input, value) {
    yield maxExcelRange(value);
  },
  *"MID/3"(_input, value, start, count) {
    yield parseExcelString(value).substr(
      parseExcelNumber(start) - 1,
      parseExcelNumber(count)
    );
  },
  *"MIN/1"(_input, value) {
    yield minExcelRange(value);
  },
  *"MOD/2"(_input, left, right) {
    const divisor = parseExcelNumber(right);
    if (divisor === 0) {
      throwExcelError(EXCEL_ERROR.div0);
    }
    const dividend = parseExcelNumber(left);
    yield (dividend % divisor + divisor) % divisor;
  },
  *"MULTINOMIAL/1"(_input, values) {
    yield multinomialValue(values);
  },
  *"N/1"(_input, value) {
    if (typeof value === "number" && Number.isFinite(value)) {
      yield value;
      return;
    }
    if (value === true) {
      yield 1;
      return;
    }
    if (value === false) {
      yield 0;
      return;
    }
    yield 0;
  },
  *"NOT/1"(_input, value) {
    if (typeof value === "string") {
      throwExcelError(EXCEL_ERROR.value);
    }
    yield !value;
  },
  *"NUMBERVALUE/1"(_input, text) {
    yield numberValue(text);
  },
  *"NUMBERVALUE/2"(_input, text, decimalSeparator) {
    yield numberValue(text, decimalSeparator);
  },
  *"NUMBERVALUE/3"(_input, text, decimalSeparator, groupSeparator) {
    yield numberValue(text, decimalSeparator, groupSeparator);
  },
  *"OR/1"(_input, value) {
    yield logicalAnyValue(value);
  },
  *"POWER/2"(_input, number, power) {
    yield Math.pow(parseExcelNumber(number), parseExcelNumber(power));
  },
  *"PRODUCT/1"(_input, value) {
    yield flattenExcelArgs(value).filter((entry) => entry !== void 0 && entry !== null).map((entry) => parseExcelNumber(entry)).reduce((product, entry) => product * entry, 1);
  },
  *"PROPER/1"(_input, value) {
    yield properValue(value);
  },
  *"REPLACE/4"(_input, oldText, startNum, length, newText) {
    const text = parseExcelString(oldText);
    yield text.slice(0, parseExcelNumber(startNum) - 1) + parseExcelString(newText) + text.slice(parseExcelNumber(startNum) - 1 + parseExcelNumber(length));
  },
  *"REPT/2"(_input, text, count) {
    yield new Array(parseExcelNumber(count) + 1).join(parseExcelString(text));
  },
  *"RIGHT/1"(_input, value) {
    const text = parseExcelString(value);
    yield text.slice(text.length - 1);
  },
  *"RIGHT/2"(_input, value, count) {
    const text = parseExcelString(value);
    yield text.slice(text.length - parseExcelNumber(count));
  },
  *"ROMAN/1"(_input, number) {
    yield romanValue(number);
  },
  *"ROWS/1"(_input, value) {
    if (!Array.isArray(value)) {
      throwExcelError(EXCEL_ERROR.value);
    }
    yield value.length;
  },
  *"ROUND/1"(_input, value) {
    yield roundBase(value, 0, Math.round);
  },
  *"ROUND/2"(_input, value, digits) {
    yield roundBase(value, digits, Math.round);
  },
  *"ROUNDDOWN/1"(_input, value) {
    yield roundBase(value, 0, Math.floor);
  },
  *"ROUNDDOWN/2"(_input, value, digits) {
    yield roundBase(value, digits, Math.floor);
  },
  *"ROUNDUP/1"(_input, value) {
    yield roundBase(value, 0, Math.ceil);
  },
  *"ROUNDUP/2"(_input, value, digits) {
    yield roundBase(value, digits, Math.ceil);
  },
  *"SEARCH/2"(_input, findText, withinText) {
    const found = parseExcelString(withinText).toLowerCase().indexOf(parseExcelString(findText).toLowerCase());
    if (found === -1) {
      throwExcelError(EXCEL_ERROR.value);
    }
    yield found + 1;
  },
  *"SEARCH/3"(_input, findText, withinText, startNum) {
    const found = parseExcelString(withinText).toLowerCase().indexOf(
      parseExcelString(findText).toLowerCase(),
      parseExcelNumber(startNum) - 1
    );
    if (found === -1) {
      throwExcelError(EXCEL_ERROR.value);
    }
    yield found + 1;
  },
  *"SEC/1"(_input, value) {
    yield checkedMathResult(1 / Math.cos(parseExcelNumber(value)));
  },
  *"SECH/1"(_input, value) {
    yield checkedMathResult(1 / Math.cosh(parseExcelNumber(value)));
  },
  *"SERIESSUM/4"(_input, x, n, m, coefficients) {
    yield seriesSumValue(x, n, m, coefficients);
  },
  *"SIN/1"(_input, value) {
    yield checkedMathResult(Math.sin(parseExcelNumber(value)));
  },
  *"SINH/1"(_input, value) {
    yield checkedMathResult(Math.sinh(parseExcelNumber(value)));
  },
  *"SQRT/1"(_input, value) {
    const number = parseExcelNumber(value);
    if (number < 0) {
      throwExcelError(EXCEL_ERROR.num);
    }
    yield Math.sqrt(number);
  },
  *"SQRTPI/1"(_input, value) {
    const number = parseExcelNumber(value);
    if (number < 0) {
      throwExcelError(EXCEL_ERROR.num);
    }
    yield checkedMathResult(Math.sqrt(number * Math.PI));
  },
  *"STDEV/1"(_input, value) {
    yield sampleStdDev(value);
  },
  *"STDEV_P/1"(_input, value) {
    yield populationStdDev(value);
  },
  *"STDEV_S/1"(_input, value) {
    yield sampleStdDev(value);
  },
  *"SUM/1"(_input, value) {
    yield sumExcelRange(value);
  },
  *"SUMIF/2"(_input, range2, criteria) {
    yield sumIf(range2, criteria);
  },
  *"SUMIF/3"(_input, range2, criteria, sumRange) {
    yield sumIf(range2, criteria, sumRange);
  },
  *"SUMIF_BY/4"(_input, rows, valueKey, criteriaKey, criteria) {
    yield sumIf(colValues(rows, criteriaKey), criteria, colValues(rows, valueKey));
  },
  *"SUMIFS_BY/3"(_input, rows, valueKey, criteriaObject) {
    const filteredRows = filterRowsByCriteria(rows, criteriaObject);
    yield sumExcelRange(colValues(filteredRows, valueKey));
  },
  *"SUBSTITUTE/3"(_input, text, oldText, newText) {
    yield parseExcelString(text).split(parseExcelString(oldText)).join(parseExcelString(newText));
  },
  *"SUBSTITUTE/4"(_input, text, oldText, newText, instanceNum) {
    const instance = Math.floor(parseExcelNumber(instanceNum));
    if (instance <= 0) {
      throwExcelError(EXCEL_ERROR.value);
    }
    yield replaceNth(
      parseExcelString(text),
      parseExcelString(oldText),
      parseExcelString(newText),
      instance
    );
  },
  *"T/1"(_input, value) {
    yield typeof value === "string" ? value : "";
  },
  *"TAN/1"(_input, value) {
    yield checkedMathResult(Math.tan(parseExcelNumber(value)));
  },
  *"TANH/1"(_input, value) {
    yield Math.tanh(parseExcelNumber(value));
  },
  *"TEXT/2"(_input, value, formatText) {
    yield excelText(value, formatText);
  },
  *"TEXTJOIN/3"(_input, delimiter, ignoreEmpty, values) {
    yield textJoin(delimiter, ignoreEmpty, values);
  },
  *"TRIM/1"(_input, value) {
    yield parseExcelString(value).replace(/\s+/g, " ").trim();
  },
  *"TRUNC/1"(_input, value) {
    yield truncValue(value);
  },
  *"TRUNC/2"(_input, value, digits) {
    yield truncValue(value, digits);
  },
  *"TRUE/0"() {
    yield true;
  },
  *"TYPE/1"(_input, value) {
    if (typeof value === "number" && Number.isFinite(value)) {
      yield 1;
      return;
    }
    if (typeof value === "string") {
      yield 2;
      return;
    }
    if (typeof value === "boolean") {
      yield 4;
      return;
    }
    if (Array.isArray(value)) {
      yield 64;
      return;
    }
    yield 16;
  },
  *"UPPER/1"(_input, value) {
    yield parseExcelString(value).toUpperCase();
  },
  *"VALUE/1"(_input, value) {
    yield excelValue(value);
  },
  *"VLOOKUP/3"(_input, lookupValueLike, table, colIndex) {
    yield vlookupValue(lookupValueLike, table, colIndex);
  },
  *"VLOOKUP/4"(_input, lookupValueLike, table, colIndex, rangeLookup) {
    yield vlookupValue(lookupValueLike, table, colIndex, rangeLookup);
  },
  *"VLOOKUP_BY/4"(_input, rows, lookupKey, lookupValueLike, resultKey) {
    yield vlookupByRows(rows, lookupKey, lookupValueLike, resultKey, false);
  },
  *"VLOOKUP_BY/5"(_input, rows, lookupKey, lookupValueLike, resultKey, rangeLookup) {
    yield vlookupByRows(rows, lookupKey, lookupValueLike, resultKey, rangeLookup);
  },
  *"XLOOKUP/3"(_input, lookupValueLike, lookupArray, returnArray) {
    yield xlookupValue(lookupValueLike, lookupArray, returnArray);
  },
  *"XLOOKUP/4"(_input, lookupValueLike, lookupArray, returnArray, ifNotFound) {
    yield xlookupValue(lookupValueLike, lookupArray, returnArray, ifNotFound);
  },
  *"XLOOKUP/5"(_input, lookupValueLike, lookupArray, returnArray, ifNotFound, matchMode) {
    yield xlookupValue(lookupValueLike, lookupArray, returnArray, ifNotFound, matchMode);
  },
  *"XLOOKUP/6"(_input, lookupValueLike, lookupArray, returnArray, ifNotFound, matchMode, searchMode) {
    yield xlookupValue(
      lookupValueLike,
      lookupArray,
      returnArray,
      ifNotFound,
      matchMode,
      searchMode
    );
  },
  *"XOR/1"(_input, value) {
    yield logicalXorValue(value);
  },
  *"CEILING/1"(_input, number) {
    yield ceilingValue(number);
  },
  *"CEILING/2"(_input, number, significance) {
    yield ceilingValue(number, significance);
  },
  *"CEILING_MATH/1"(_input, number) {
    yield ceilingValue(number);
  },
  *"CEILING_MATH/2"(_input, number, significance) {
    yield ceilingValue(number, significance);
  },
  // ═══════════════════════════════════════════════════════════════
  // Math and trig functions
  // ═══════════════════════════════════════════════════════════════
  *"PI/0"() {
    yield Math.PI;
  },
  *"SIGN/1"(_input, value) {
    const n = parseExcelNumber(value);
    yield n > 0 ? 1 : n < 0 ? -1 : 0;
  },
  *"EVEN/1"(_input, value) {
    const n = parseExcelNumber(value);
    const ceil = Math.ceil(Math.abs(n));
    const result = ceil % 2 === 0 ? ceil : ceil + 1;
    yield n >= 0 ? result : -result;
  },
  *"ODD/1"(_input, value) {
    const n = parseExcelNumber(value);
    const ceil = Math.ceil(Math.abs(n));
    const result = ceil % 2 === 1 ? ceil : ceil + 1;
    yield n >= 0 ? result : -result;
  },
  *"GCD/1"(_input, values) {
    const nums = flattenExcelArgs(values).map(parseExcelNumber).map(Math.abs).map(Math.floor);
    if (nums.length === 0)
      yield 0;
    else {
      const gcd2 = (a, b) => b === 0 ? a : gcd2(b, a % b);
      yield nums.reduce(gcd2);
    }
  },
  *"LCM/1"(_input, values) {
    const nums = flattenExcelArgs(values).map(parseExcelNumber).map(Math.abs).map(Math.floor);
    if (nums.length === 0)
      yield 0;
    else {
      const gcd2 = (a, b) => b === 0 ? a : gcd2(b, a % b);
      const lcm2 = (a, b) => a * b / gcd2(a, b);
      yield nums.reduce(lcm2);
    }
  },
  *"FACT/1"(_input, value) {
    const n = Math.floor(parseExcelNumber(value));
    if (n < 0)
      throwExcelError(EXCEL_ERROR.num);
    if (n === 0) {
      yield 1;
      return;
    }
    let result = 1;
    for (let i = 2; i <= n; i++)
      result *= i;
    yield result;
  },
  *"FACTDOUBLE/1"(_input, value) {
    const n = Math.floor(parseExcelNumber(value));
    if (n < -1)
      throwExcelError(EXCEL_ERROR.num);
    if (n <= 0) {
      yield 1;
      return;
    }
    let result = 1;
    for (let i = n; i > 1; i -= 2)
      result *= i;
    yield result;
  },
  *"COMBIN/2"(_input, n, k) {
    const nn = Math.floor(parseExcelNumber(n));
    const kk = Math.floor(parseExcelNumber(k));
    if (nn < 0 || kk < 0 || kk > nn)
      throwExcelError(EXCEL_ERROR.num);
    let result = 1;
    for (let i = 0; i < kk; i++)
      result = result * (nn - i) / (i + 1);
    yield Math.round(result);
  },
  *"COMBINA/2"(_input, n, k) {
    const nn = Math.floor(parseExcelNumber(n));
    const kk = Math.floor(parseExcelNumber(k));
    if (nn < 0 || kk < 0)
      throwExcelError(EXCEL_ERROR.num);
    const total = nn + kk - 1;
    let result = 1;
    for (let i = 0; i < kk; i++)
      result = result * (total - i) / (i + 1);
    yield Math.round(result);
  },
  *"PERMUT/2"(_input, n, k) {
    const nn = Math.floor(parseExcelNumber(n));
    const kk = Math.floor(parseExcelNumber(k));
    if (nn < 0 || kk < 0 || kk > nn)
      throwExcelError(EXCEL_ERROR.num);
    let result = 1;
    for (let i = 0; i < kk; i++)
      result *= nn - i;
    yield result;
  },
  *"RAND/0"() {
    yield Math.random();
  },
  *"RANDBETWEEN/2"(_input, bottom, top) {
    const lo = Math.ceil(parseExcelNumber(bottom));
    const hi = Math.floor(parseExcelNumber(top));
    if (lo > hi)
      throwExcelError(EXCEL_ERROR.num);
    yield Math.floor(Math.random() * (hi - lo + 1)) + lo;
  },
  *"MROUND/2"(_input, number, multiple) {
    const n = parseExcelNumber(number);
    const m = parseExcelNumber(multiple);
    if (m === 0) {
      yield 0;
      return;
    }
    if (n * m < 0)
      throwExcelError(EXCEL_ERROR.num);
    yield Math.round(n / m) * m;
  },
  *"QUOTIENT/2"(_input, numerator, denominator) {
    const n = parseExcelNumber(numerator);
    const d = parseExcelNumber(denominator);
    if (d === 0)
      throwExcelError(EXCEL_ERROR.div0);
    yield Math.trunc(n / d);
  },
  *"DEGREES/1"(_input, value) {
    yield parseExcelNumber(value) * (180 / Math.PI);
  },
  *"RADIANS/1"(_input, value) {
    yield parseExcelNumber(value) * (Math.PI / 180);
  },
  *"SUMPRODUCT/1"(_input, arrays) {
    if (!Array.isArray(arrays) || arrays.length === 0) {
      yield 0;
      return;
    }
    if (Array.isArray(arrays[0])) {
      const len = arrays[0].length;
      let total = 0;
      for (let i = 0; i < len; i++) {
        let product = 1;
        for (const arr of arrays) {
          const val = Array.isArray(arr) ? arr[i] : 0;
          const num = typeof val === "number" ? val : 0;
          product *= num;
        }
        total += product;
      }
      yield total;
    } else {
      yield sumExcelRange(arrays);
    }
  },
  *"SUMSQ/1"(_input, values) {
    const nums = flattenExcelArgs(values);
    let total = 0;
    for (const v of nums) {
      if (typeof v === "number" && Number.isFinite(v))
        total += v * v;
    }
    yield total;
  },
  *"SUMX2MY2/2"(_input, left, right) {
    yield sumPairValue(
      left,
      right,
      (leftValue, rightValue) => leftValue ** 2 - rightValue ** 2
    );
  },
  *"SUMX2PY2/2"(_input, left, right) {
    yield sumPairValue(
      left,
      right,
      (leftValue, rightValue) => leftValue ** 2 + rightValue ** 2
    );
  },
  *"SUMXMY2/2"(_input, left, right) {
    yield sumPairValue(
      left,
      right,
      (leftValue, rightValue) => (leftValue - rightValue) ** 2
    );
  },
  // ═══════════════════════════════════════════════════════════════
  // Logical functions
  // ═══════════════════════════════════════════════════════════════
  *"SWITCH/1"(_input, args) {
    if (!Array.isArray(args) || args.length < 3)
      throwExcelError(EXCEL_ERROR.value);
    const expr2 = args[0];
    for (let i = 1; i < args.length - 1; i += 2) {
      if (args[i] === expr2) {
        yield args[i + 1];
        return;
      }
    }
    if (args.length % 2 === 0) {
      yield args[args.length - 1];
    } else {
      throwExcelError(EXCEL_ERROR.na);
    }
  },
  // ═══════════════════════════════════════════════════════════════
  // Information functions
  // ═══════════════════════════════════════════════════════════════
  *"ISEVEN/1"(_input, value) {
    const n = parseExcelNumber(value);
    yield Math.floor(n) % 2 === 0;
  },
  *"ISODD/1"(_input, value) {
    const n = parseExcelNumber(value);
    yield Math.floor(n) % 2 !== 0;
  },
  *"ISLOGICAL/1"(_input, value) {
    yield typeof value === "boolean";
  },
  *"ISNONTEXT/1"(_input, value) {
    yield typeof value !== "string";
  },
  // ═══════════════════════════════════════════════════════════════
  // Statistical functions
  // ═══════════════════════════════════════════════════════════════
  *"MEDIAN/1"(_input, values) {
    const nums = flattenExcelArgs(values).filter((v) => typeof v === "number" && Number.isFinite(v)).sort((a, b) => a - b);
    if (nums.length === 0)
      throwExcelError(EXCEL_ERROR.num);
    const mid = Math.floor(nums.length / 2);
    yield nums.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
  },
  *"LARGE/2"(_input, values, k) {
    const nums = flattenExcelArgs(values).filter((v) => typeof v === "number" && Number.isFinite(v)).sort((a, b) => b - a);
    const kk = Math.floor(parseExcelNumber(k));
    if (kk < 1 || kk > nums.length)
      throwExcelError(EXCEL_ERROR.num);
    yield nums[kk - 1];
  },
  *"SMALL/2"(_input, values, k) {
    const nums = flattenExcelArgs(values).filter((v) => typeof v === "number" && Number.isFinite(v)).sort((a, b) => a - b);
    const kk = Math.floor(parseExcelNumber(k));
    if (kk < 1 || kk > nums.length)
      throwExcelError(EXCEL_ERROR.num);
    yield nums[kk - 1];
  },
  *"COUNTBLANK/1"(_input, values) {
    const arr = Array.isArray(values) ? values : [values];
    yield arr.filter((v) => v === null || v === void 0 || v === "").length;
  },
  *"VAR/1"(_input, values) {
    const nums = flattenExcelArgs(values).filter((v) => typeof v === "number" && Number.isFinite(v));
    if (nums.length < 2)
      throwExcelError(EXCEL_ERROR.div0);
    const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
    const sumSqDev = nums.reduce((acc, v) => acc + (v - mean) ** 2, 0);
    yield sumSqDev / (nums.length - 1);
  },
  *"VAR_P/1"(_input, values) {
    const nums = flattenExcelArgs(values).filter((v) => typeof v === "number" && Number.isFinite(v));
    if (nums.length === 0)
      throwExcelError(EXCEL_ERROR.div0);
    const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
    const sumSqDev = nums.reduce((acc, v) => acc + (v - mean) ** 2, 0);
    yield sumSqDev / nums.length;
  },
  *"VAR_S/1"(_input, values) {
    const nums = flattenExcelArgs(values).filter((v) => typeof v === "number" && Number.isFinite(v));
    if (nums.length < 2)
      throwExcelError(EXCEL_ERROR.div0);
    const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
    const sumSqDev = nums.reduce((acc, v) => acc + (v - mean) ** 2, 0);
    yield sumSqDev / (nums.length - 1);
  },
  *"MAXIFS/1"(_input, args) {
    if (!Array.isArray(args) || args.length < 3)
      throwExcelError(EXCEL_ERROR.value);
    const vals = Array.isArray(args[0]) ? args[0] : [args[0]];
    const criteriaRange = Array.isArray(args[1]) ? args[1] : [args[1]];
    const criteria = args[2];
    const matcher = createCriteriaMatcher(criteria);
    let max = -Infinity;
    let found = false;
    for (let i = 0; i < vals.length; i++) {
      if (matcher(criteriaRange[i] ?? null)) {
        const v = parseExcelNumber(vals[i]);
        if (v > max) {
          max = v;
          found = true;
        }
      }
    }
    yield found ? max : 0;
  },
  *"MINIFS/1"(_input, args) {
    if (!Array.isArray(args) || args.length < 3)
      throwExcelError(EXCEL_ERROR.value);
    const vals = Array.isArray(args[0]) ? args[0] : [args[0]];
    const criteriaRange = Array.isArray(args[1]) ? args[1] : [args[1]];
    const criteria = args[2];
    const matcher = createCriteriaMatcher(criteria);
    let min = Infinity;
    let found = false;
    for (let i = 0; i < vals.length; i++) {
      if (matcher(criteriaRange[i] ?? null)) {
        const v = parseExcelNumber(vals[i]);
        if (v < min) {
          min = v;
          found = true;
        }
      }
    }
    yield found ? min : 0;
  },
  *"CORREL/2"(_input, array1, array2) {
    const x = flattenExcelArgs(array1).filter((v) => typeof v === "number" && Number.isFinite(v));
    const y = flattenExcelArgs(array2).filter((v) => typeof v === "number" && Number.isFinite(v));
    const n = Math.min(x.length, y.length);
    if (n < 2)
      throwExcelError(EXCEL_ERROR.div0);
    const meanX = x.slice(0, n).reduce((a, b) => a + b, 0) / n;
    const meanY = y.slice(0, n).reduce((a, b) => a + b, 0) / n;
    let sumXY = 0, sumX2 = 0, sumY2 = 0;
    for (let i = 0; i < n; i++) {
      const dx = x[i] - meanX;
      const dy = y[i] - meanY;
      sumXY += dx * dy;
      sumX2 += dx * dx;
      sumY2 += dy * dy;
    }
    const denom = Math.sqrt(sumX2 * sumY2);
    if (denom === 0)
      throwExcelError(EXCEL_ERROR.div0);
    yield sumXY / denom;
  },
  *"SLOPE/2"(_input, knownY, knownX) {
    const y = flattenExcelArgs(knownY).filter((v) => typeof v === "number" && Number.isFinite(v));
    const x = flattenExcelArgs(knownX).filter((v) => typeof v === "number" && Number.isFinite(v));
    const n = Math.min(x.length, y.length);
    if (n < 2)
      throwExcelError(EXCEL_ERROR.div0);
    const meanX = x.slice(0, n).reduce((a, b) => a + b, 0) / n;
    const meanY = y.slice(0, n).reduce((a, b) => a + b, 0) / n;
    let sumXY = 0, sumX2 = 0;
    for (let i = 0; i < n; i++) {
      sumXY += (x[i] - meanX) * (y[i] - meanY);
      sumX2 += (x[i] - meanX) ** 2;
    }
    if (sumX2 === 0)
      throwExcelError(EXCEL_ERROR.div0);
    yield sumXY / sumX2;
  },
  *"INTERCEPT/2"(_input, knownY, knownX) {
    const y = flattenExcelArgs(knownY).filter((v) => typeof v === "number" && Number.isFinite(v));
    const x = flattenExcelArgs(knownX).filter((v) => typeof v === "number" && Number.isFinite(v));
    const n = Math.min(x.length, y.length);
    if (n < 2)
      throwExcelError(EXCEL_ERROR.div0);
    const meanX = x.slice(0, n).reduce((a, b) => a + b, 0) / n;
    const meanY = y.slice(0, n).reduce((a, b) => a + b, 0) / n;
    let sumXY = 0, sumX2 = 0;
    for (let i = 0; i < n; i++) {
      sumXY += (x[i] - meanX) * (y[i] - meanY);
      sumX2 += (x[i] - meanX) ** 2;
    }
    if (sumX2 === 0)
      throwExcelError(EXCEL_ERROR.div0);
    yield meanY - sumXY / sumX2 * meanX;
  },
  *"FORECAST/3"(_input, x, knownY, knownX) {
    const xVal = parseExcelNumber(x);
    const yArr = flattenExcelArgs(knownY).filter((v) => typeof v === "number" && Number.isFinite(v));
    const xArr = flattenExcelArgs(knownX).filter((v) => typeof v === "number" && Number.isFinite(v));
    const n = Math.min(xArr.length, yArr.length);
    if (n < 2)
      throwExcelError(EXCEL_ERROR.div0);
    const meanX = xArr.slice(0, n).reduce((a, b) => a + b, 0) / n;
    const meanY = yArr.slice(0, n).reduce((a, b) => a + b, 0) / n;
    let sumXY = 0, sumX2 = 0;
    for (let i = 0; i < n; i++) {
      sumXY += (xArr[i] - meanX) * (yArr[i] - meanY);
      sumX2 += (xArr[i] - meanX) ** 2;
    }
    if (sumX2 === 0)
      throwExcelError(EXCEL_ERROR.div0);
    const slope = sumXY / sumX2;
    const intercept = meanY - slope * meanX;
    yield intercept + slope * xVal;
  },
  *"RANK_EQ/2"(_input, number, ref) {
    const n = parseExcelNumber(number);
    const nums = flattenExcelArgs(ref).filter((v) => typeof v === "number" && Number.isFinite(v));
    const sorted = [...nums].sort((a, b) => b - a);
    const idx = sorted.indexOf(n);
    if (idx === -1)
      throwExcelError(EXCEL_ERROR.na);
    yield idx + 1;
  },
  *"RANK_EQ/3"(_input, number, ref, order) {
    const n = parseExcelNumber(number);
    const nums = flattenExcelArgs(ref).filter((v) => typeof v === "number" && Number.isFinite(v));
    const asc = parseExcelNumber(order) !== 0;
    const sorted = asc ? [...nums].sort((a, b) => a - b) : [...nums].sort((a, b) => b - a);
    const idx = sorted.indexOf(n);
    if (idx === -1)
      throwExcelError(EXCEL_ERROR.na);
    yield idx + 1;
  },
  *"RANK_AVG/2"(_input, number, ref) {
    const n = parseExcelNumber(number);
    const nums = flattenExcelArgs(ref).filter((v) => typeof v === "number" && Number.isFinite(v));
    const sorted = [...nums].sort((a, b) => b - a);
    const indices2 = sorted.reduce((acc, v, i) => {
      if (v === n)
        acc.push(i + 1);
      return acc;
    }, []);
    if (indices2.length === 0)
      throwExcelError(EXCEL_ERROR.na);
    yield indices2.reduce((a, b) => a + b, 0) / indices2.length;
  },
  *"PERCENTILE_INC/2"(_input, values, k) {
    const nums = flattenExcelArgs(values).filter((v) => typeof v === "number" && Number.isFinite(v)).sort((a, b) => a - b);
    const kk = parseExcelNumber(k);
    if (kk < 0 || kk > 1 || nums.length === 0)
      throwExcelError(EXCEL_ERROR.num);
    const n = nums.length;
    const rank = kk * (n - 1);
    const intPart = Math.floor(rank);
    const frac = rank - intPart;
    if (intPart + 1 < n) {
      yield nums[intPart] + frac * (nums[intPart + 1] - nums[intPart]);
    } else {
      yield nums[intPart];
    }
  },
  *"QUARTILE_INC/2"(_input, values, quart) {
    const nums = flattenExcelArgs(values).filter((v) => typeof v === "number" && Number.isFinite(v)).sort((a, b) => a - b);
    const q = Math.floor(parseExcelNumber(quart));
    if (q < 0 || q > 4 || nums.length === 0)
      throwExcelError(EXCEL_ERROR.num);
    const kk = q * 0.25;
    const n = nums.length;
    const rank = kk * (n - 1);
    const intPart = Math.floor(rank);
    const frac = rank - intPart;
    if (intPart + 1 < n) {
      yield nums[intPart] + frac * (nums[intPart + 1] - nums[intPart]);
    } else {
      yield nums[intPart];
    }
  },
  *"AVEDEV/1"(_input, values) {
    const nums = flattenExcelArgs(values).filter((v) => typeof v === "number" && Number.isFinite(v));
    if (nums.length === 0)
      throwExcelError(EXCEL_ERROR.num);
    const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
    yield nums.reduce((acc, v) => acc + Math.abs(v - mean), 0) / nums.length;
  },
  *"DEVSQ/1"(_input, values) {
    const nums = flattenExcelArgs(values).filter((v) => typeof v === "number" && Number.isFinite(v));
    if (nums.length === 0)
      throwExcelError(EXCEL_ERROR.num);
    const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
    yield nums.reduce((acc, v) => acc + (v - mean) ** 2, 0);
  },
  *"GEOMEAN/1"(_input, values) {
    const nums = flattenExcelArgs(values).filter((v) => typeof v === "number" && Number.isFinite(v) && v > 0);
    if (nums.length === 0)
      throwExcelError(EXCEL_ERROR.num);
    const logSum = nums.reduce((acc, v) => acc + Math.log(v), 0);
    yield Math.exp(logSum / nums.length);
  },
  *"HARMEAN/1"(_input, values) {
    const nums = flattenExcelArgs(values).filter((v) => typeof v === "number" && Number.isFinite(v) && v > 0);
    if (nums.length === 0)
      throwExcelError(EXCEL_ERROR.num);
    const recipSum = nums.reduce((acc, v) => acc + 1 / v, 0);
    yield nums.length / recipSum;
  },
  *"TRIMMEAN/2"(_input, values, percent) {
    const nums = flattenExcelArgs(values).filter((v) => typeof v === "number" && Number.isFinite(v)).sort((a, b) => a - b);
    const pct = parseExcelNumber(percent);
    if (pct < 0 || pct >= 1 || nums.length === 0)
      throwExcelError(EXCEL_ERROR.num);
    const trim = Math.floor(nums.length * pct / 2);
    const trimmed = nums.slice(trim, nums.length - trim);
    if (trimmed.length === 0)
      throwExcelError(EXCEL_ERROR.num);
    yield trimmed.reduce((a, b) => a + b, 0) / trimmed.length;
  },
  *"SKEW/1"(_input, values) {
    const nums = flattenExcelArgs(values).filter((v) => typeof v === "number" && Number.isFinite(v));
    const n = nums.length;
    if (n < 3)
      throwExcelError(EXCEL_ERROR.div0);
    const mean = nums.reduce((a, b) => a + b, 0) / n;
    const s = Math.sqrt(nums.reduce((acc, v) => acc + (v - mean) ** 2, 0) / (n - 1));
    if (s === 0)
      throwExcelError(EXCEL_ERROR.div0);
    const sum3 = nums.reduce((acc, v) => acc + ((v - mean) / s) ** 3, 0);
    yield n / ((n - 1) * (n - 2)) * sum3;
  },
  *"KURT/1"(_input, values) {
    const nums = flattenExcelArgs(values).filter((v) => typeof v === "number" && Number.isFinite(v));
    const n = nums.length;
    if (n < 4)
      throwExcelError(EXCEL_ERROR.div0);
    const mean = nums.reduce((a, b) => a + b, 0) / n;
    const s = Math.sqrt(nums.reduce((acc, v) => acc + (v - mean) ** 2, 0) / (n - 1));
    if (s === 0)
      throwExcelError(EXCEL_ERROR.div0);
    const sum4 = nums.reduce((acc, v) => acc + ((v - mean) / s) ** 4, 0);
    const coeff = n * (n + 1) / ((n - 1) * (n - 2) * (n - 3));
    const adj = 3 * (n - 1) ** 2 / ((n - 2) * (n - 3));
    yield coeff * sum4 - adj;
  },
  // ═══════════════════════════════════════════════════════════════
  // Date/time functions
  // ═══════════════════════════════════════════════════════════════
  *"DAYS/2"(_input, endDate, startDate) {
    const end = parseExcelNumber(endDate);
    const start = parseExcelNumber(startDate);
    yield end - start;
  },
  *"TODAY/0"() {
    const now = /* @__PURE__ */ new Date();
    const epoch = new Date(1899, 11, 30);
    yield Math.floor((now.getTime() - epoch.getTime()) / 864e5);
  },
  *"NOW/0"() {
    yield nowSerial();
  },
  *"HOUR/1"(_input, value) {
    const n = parseExcelNumber(value);
    const frac = n - Math.floor(n);
    yield Math.floor(frac * 24) % 24;
  },
  *"MINUTE/1"(_input, value) {
    const n = parseExcelNumber(value);
    const frac = n - Math.floor(n);
    yield Math.floor(frac * 24 * 60) % 60;
  },
  *"SECOND/1"(_input, value) {
    const n = parseExcelNumber(value);
    const frac = n - Math.floor(n);
    yield Math.floor(frac * 24 * 60 * 60) % 60;
  },
  *"WEEKDAY/1"(_input, serialDate) {
    const serial = Math.floor(parseExcelNumber(serialDate));
    const epoch = new Date(1899, 11, 30);
    const date = new Date(epoch.getTime() + serial * 864e5);
    yield date.getDay() + 1;
  },
  *"WEEKDAY/2"(_input, serialDate, returnType) {
    const serial = Math.floor(parseExcelNumber(serialDate));
    const epoch = new Date(1899, 11, 30);
    const date = new Date(epoch.getTime() + serial * 864e5);
    const type = Math.floor(parseExcelNumber(returnType));
    const dow = date.getDay();
    if (type === 1)
      yield dow + 1;
    else if (type === 2)
      yield dow === 0 ? 7 : dow;
    else if (type === 3)
      yield dow === 0 ? 6 : dow - 1;
    else
      yield dow + 1;
  },
  *"ISOWEEKNUM/1"(_input, serialDate) {
    const serial = Math.floor(parseExcelNumber(serialDate));
    const epoch = new Date(1899, 11, 30);
    const date = new Date(epoch.getTime() + serial * 864e5);
    const jan4 = new Date(date.getFullYear(), 0, 4);
    const dayOfYear2 = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 1).getTime()) / 864e5) + 1;
    const dow = date.getDay() || 7;
    const woy = Math.floor((dayOfYear2 - dow + 10) / 7);
    yield woy;
  },
  *"EDATE/2"(_input, startDate, months) {
    const serial = Math.floor(parseExcelNumber(startDate));
    const m = Math.floor(parseExcelNumber(months));
    const epoch = new Date(1899, 11, 30);
    const date = new Date(epoch.getTime() + serial * 864e5);
    date.setMonth(date.getMonth() + m);
    yield Math.floor((date.getTime() - epoch.getTime()) / 864e5);
  },
  *"EOMONTH/2"(_input, startDate, months) {
    const serial = Math.floor(parseExcelNumber(startDate));
    const m = Math.floor(parseExcelNumber(months));
    const epoch = new Date(1899, 11, 30);
    const date = new Date(epoch.getTime() + serial * 864e5);
    date.setMonth(date.getMonth() + m + 1, 0);
    yield Math.floor((date.getTime() - epoch.getTime()) / 864e5);
  },
  // ═══════════════════════════════════════════════════════════════
  // Additional date/time functions
  // ═══════════════════════════════════════════════════════════════
  *"TIME/3"(_input, hour, minute, second) {
    const h = parseExcelNumber(hour);
    const m = parseExcelNumber(minute);
    const s = parseExcelNumber(second);
    yield (h * 3600 + m * 60 + s) / 86400;
  },
  *"TIMEVALUE/1"(_input, text) {
    const str = String(text);
    const match = str.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/);
    if (!match)
      throwExcelError(EXCEL_ERROR.value);
    const h = parseInt(match[1], 10);
    const m = parseInt(match[2], 10);
    const s = match[3] ? parseInt(match[3], 10) : 0;
    yield (h * 3600 + m * 60 + s) / 86400;
  },
  // ═══════════════════════════════════════════════════════════════
  // Additional statistical functions
  // ═══════════════════════════════════════════════════════════════
  *"PERCENTILE_EXC/2"(_input, values, k) {
    const nums = flattenExcelArgs(values).filter((v) => typeof v === "number" && Number.isFinite(v)).sort((a, b) => a - b);
    const kk = parseExcelNumber(k);
    const n = nums.length;
    if (kk <= 1 / (n + 1) || kk >= n / (n + 1) || n === 0)
      throwExcelError(EXCEL_ERROR.num);
    const rank = kk * (n + 1) - 1;
    const intPart = Math.floor(rank);
    const frac = rank - intPart;
    if (intPart + 1 < n) {
      yield nums[intPart] + frac * (nums[intPart + 1] - nums[intPart]);
    } else {
      yield nums[intPart];
    }
  },
  *"QUARTILE_EXC/2"(_input, values, quart) {
    const nums = flattenExcelArgs(values).filter((v) => typeof v === "number" && Number.isFinite(v)).sort((a, b) => a - b);
    const q = Math.floor(parseExcelNumber(quart));
    if (q < 1 || q > 3 || nums.length === 0)
      throwExcelError(EXCEL_ERROR.num);
    const kk = q * 0.25;
    const n = nums.length;
    const rank = kk * (n + 1) - 1;
    const intPart = Math.floor(rank);
    const frac = rank - intPart;
    if (intPart >= 0 && intPart + 1 < n) {
      yield nums[intPart] + frac * (nums[intPart + 1] - nums[intPart]);
    } else if (intPart >= 0 && intPart < n) {
      yield nums[intPart];
    } else {
      throwExcelError(EXCEL_ERROR.num);
    }
  },
  *"PERCENTRANK_INC/2"(_input, array, x) {
    const nums = flattenExcelArgs(array).filter((v) => typeof v === "number" && Number.isFinite(v)).sort((a, b) => a - b);
    const xVal = parseExcelNumber(x);
    const n = nums.length;
    if (n === 0 || xVal < nums[0] || xVal > nums[n - 1])
      throwExcelError(EXCEL_ERROR.na);
    if (n === 1) {
      yield 0;
      return;
    }
    for (let i = 0; i < n; i++) {
      if (nums[i] === xVal) {
        yield i / (n - 1);
        return;
      }
      if (i + 1 < n && nums[i] < xVal && xVal < nums[i + 1]) {
        yield (i + (xVal - nums[i]) / (nums[i + 1] - nums[i])) / (n - 1);
        return;
      }
    }
    yield 0;
  },
  *"PERCENTRANK_EXC/2"(_input, array, x) {
    const nums = flattenExcelArgs(array).filter((v) => typeof v === "number" && Number.isFinite(v)).sort((a, b) => a - b);
    const xVal = parseExcelNumber(x);
    const n = nums.length;
    if (n === 0 || xVal < nums[0] || xVal > nums[n - 1])
      throwExcelError(EXCEL_ERROR.na);
    for (let i = 0; i < n; i++) {
      if (nums[i] === xVal) {
        yield (i + 1) / (n + 1);
        return;
      }
      if (i + 1 < n && nums[i] < xVal && xVal < nums[i + 1]) {
        yield (i + 1 + (xVal - nums[i]) / (nums[i + 1] - nums[i])) / (n + 1);
        return;
      }
    }
    yield 0;
  },
  *"PEARSON/2"(_input, array1, array2) {
    const x = flattenExcelArgs(array1).filter((v) => typeof v === "number" && Number.isFinite(v));
    const y = flattenExcelArgs(array2).filter((v) => typeof v === "number" && Number.isFinite(v));
    const n = Math.min(x.length, y.length);
    if (n < 2)
      throwExcelError(EXCEL_ERROR.div0);
    const meanX = x.slice(0, n).reduce((a, b) => a + b, 0) / n;
    const meanY = y.slice(0, n).reduce((a, b) => a + b, 0) / n;
    let sumXY = 0, sumX2 = 0, sumY2 = 0;
    for (let i = 0; i < n; i++) {
      const dx = x[i] - meanX;
      const dy = y[i] - meanY;
      sumXY += dx * dy;
      sumX2 += dx * dx;
      sumY2 += dy * dy;
    }
    const denom = Math.sqrt(sumX2 * sumY2);
    if (denom === 0)
      throwExcelError(EXCEL_ERROR.div0);
    yield sumXY / denom;
  },
  *"UNICODE/1"(_input, text) {
    const str = parseExcelString(text);
    if (str.length === 0)
      throwExcelError(EXCEL_ERROR.value);
    yield str.codePointAt(0);
  }
};
var formulaContribNativeFilters = {
  ...wrapBareNativeFilters(bareNativeFilters2),
  ...formulaDateSerialNativeFilters
};

// src/bxl/registry/index.ts
var formulaLibrary = {
  jq: formulaContribJqFilters,
  native: formulaContribNativeFilters
};
var BXL_REGISTRY = {
  ...CORE_REGISTRY,
  formula: formulaLibrary
};
var DEFAULT_BUILTIN_LIBRARIES = [
  "core",
  "formula"
];
function resolveBuiltinRegistry(libraries = DEFAULT_BUILTIN_LIBRARIES) {
  return resolveRegistry(BXL_REGISTRY, libraries);
}
function registerBuiltinLibrary(name, library) {
  BXL_REGISTRY[name] = library;
}

// src/jqtools/evaluate/utils/nestedIterators.ts
function* nestedIterators(outer, inner) {
  let first = true;
  const memorizedInnerItems = [];
  for (const outerItem of outer) {
    const innerItems = first ? inner : memorizedInnerItems;
    yield [
      outerItem,
      function* () {
        for (const innerItem of innerItems) {
          if (first)
            memorizedInnerItems.push(innerItem);
          yield innerItem;
        }
      }()
    ];
    first = false;
  }
}
function* combineIterators(outer, inner) {
  for (const [outerItem, innerIterator] of nestedIterators(outer, inner)) {
    for (const innerItem of innerIterator) {
      yield [outerItem, innerItem];
    }
  }
}

// src/jqtools/evaluate/utils/binaryOperator.ts
var operatorMapping = {
  "|": 3 /* pipe */,
  ",": 4 /* comma */,
  "//": 5 /* alternative */,
  "=": 1 /* assignment */,
  "|=": 1 /* assignment */,
  "+=": 1 /* assignment */,
  "-=": 1 /* assignment */,
  "*=": 1 /* assignment */,
  "/=": 1 /* assignment */,
  "%=": 1 /* assignment */,
  "//=": 1 /* assignment */,
  or: 2 /* boolean */,
  and: 2 /* boolean */,
  "==": 0 /* normal */,
  "!=": 0 /* normal */,
  "<": 0 /* normal */,
  ">": 0 /* normal */,
  "<=": 0 /* normal */,
  ">=": 0 /* normal */,
  "+": 0 /* normal */,
  "-": 0 /* normal */,
  "*": 0 /* normal */,
  "/": 0 /* normal */,
  "%": 0 /* normal */,
  "?//": 6 /* destructuringAlternative */
};
function typeOfBinaryOperator(op) {
  return operatorMapping[op];
}
function isBinaryOperatorType(op, type) {
  return typeOfBinaryOperator(op) === type;
}

// src/jqtools/evaluate/applyBinary.ts
function cannotApplyOperatorToError(op, left, right) {
  return new JqEvaluateError(
    `Operator ${op} cannot be applied to ${typeOf(left)} and ${typeOf(right)}`
  );
}
function cannotApplyOperator(op) {
  return new JqEvaluateError(`applyBinary: Cannot apply operator '${op}'`);
}
function coerceToNumbers(left, right) {
  const l = coerceOne(left);
  const r = coerceOne(right);
  if (l !== null && r !== null)
    return [l, r];
  return null;
}
function coerceOne(val) {
  if (typeof val === "number" && !Number.isNaN(val))
    return val;
  if (val === null || val === void 0)
    return 0;
  if (typeof val === "boolean")
    return val ? 1 : 0;
  if (typeof val === "string" && val !== "" && !Number.isNaN(Number(val)))
    return parseFloat(val);
  return null;
}
function applyNormalBinaryOperator(op, left, right) {
  if (op === "/" || op === "*" || op === "-" || op === "%") {
    if (left == null || right == null) {
      return null;
    }
  }
  switch (op) {
    case "==":
      return compare(left, right) === 0;
    case "!=":
      return compare(left, right) !== 0;
    case "<":
      return compare(left, right) < 0;
    case ">":
      return compare(left, right) > 0;
    case "<=":
      return compare(left, right) <= 0;
    case ">=":
      return compare(left, right) >= 0;
    case "+":
      if (left == null && right == null) {
        return null;
      }
      if (left == null)
        return right;
      if (right == null)
        return left;
      if (!typesEqual(left, right)) {
        const nums = coerceToNumbers(left, right);
        if (nums)
          return nums[0] + nums[1];
        throw cannotApplyOperatorToError(op, left, right);
      }
      switch (typeOf(left)) {
        case "string" /* string */:
        case "number" /* number */:
          return left + right;
        case "array" /* array */:
          return [...left, ...right];
        case "object" /* object */:
          return { ...left, ...right };
        default:
          throw cannotApplyOperatorToError(op, left, right);
      }
    case "-":
      if (!typesEqual(left, right)) {
        const nums = coerceToNumbers(left, right);
        if (nums)
          return nums[0] - nums[1];
        throw cannotApplyOperatorToError(op, left, right);
      }
      switch (typeOf(left)) {
        case "number" /* number */:
          return left - right;
        case "array" /* array */:
          return left.filter(
            (leftItem) => !right.some(
              (rightItem) => compare(leftItem, rightItem) === 0
            )
          );
        default:
          throw cannotApplyOperatorToError(op, left, right);
      }
    case "*":
      if (typesMatch(left, right, "number" /* number */)) {
        return left * right;
      } else if (typesMatchCommutative(left, right, "string" /* string */, "number" /* number */)) {
        const str = typeOf(left) === "string" /* string */ ? left : right;
        const num = typeOf(left) === "number" /* number */ ? left : right;
        return repeatString(str, num);
      } else if (typesMatch(left, right, "object" /* object */)) {
        return deepMerge(left, right);
      }
      {
        const nums = coerceToNumbers(left, right);
        if (nums)
          return nums[0] * nums[1];
      }
      throw cannotApplyOperatorToError(op, left, right);
    case "/":
      if (typesMatch(left, right, "number" /* number */)) {
        if (right === 0)
          return null;
        return left / right;
      } else if (typesMatch(left, right, "string" /* string */)) {
        return left.split(right);
      }
      {
        const nums = coerceToNumbers(left, right);
        if (nums) {
          if (nums[1] === 0)
            return null;
          return nums[0] / nums[1];
        }
      }
      throw cannotApplyOperatorToError(op, left, right);
    case "%":
      if (typesMatch(left, right, "number" /* number */)) {
        if (Math.floor(right) === 0)
          return null;
        return Math.floor(left) % Math.floor(right);
      }
      {
        const nums = coerceToNumbers(left, right);
        if (nums) {
          if (Math.floor(nums[1]) === 0)
            return null;
          return Math.floor(nums[0]) % Math.floor(nums[1]);
        }
      }
      throw cannotApplyOperatorToError(op, left, right);
    default:
      throw cannotApplyOperator(op);
  }
}
function* evaluateSimpleAssignment(inputItem, left, right) {
  for (const [value, pathIterator] of nestedIterators(
    generateValues(right),
    generatePaths(left)
  )) {
    checkRuntimeBudget();
    let out = inputItem.value;
    for (const path of pathIterator) {
      checkRuntimeBudget();
      out = setPath(out, relativizePath(path, inputItem.path), deepClone(value));
    }
    yield createItem(out);
  }
}
function* evaluateArithmeticUpdateAssignment(op, inputItem, left, right) {
  for (const [value, pathIterator] of nestedIterators(
    generateValues(right),
    generatePaths(left)
  )) {
    checkRuntimeBudget();
    let out = inputItem.value;
    for (const path of pathIterator) {
      checkRuntimeBudget();
      const relativePath = relativizePath(path, inputItem.path);
      const subOp = op.slice(
        0,
        -1
      );
      const originalValue = getPath(out, relativePath);
      out = setPath(
        out,
        relativePath,
        isBinaryOperatorType(subOp, 5 /* alternative */) ? applyAlternativeOperator(originalValue, value) : applyNormalBinaryOperator(subOp, originalValue, value)
      );
    }
    yield createItem(out);
  }
}
function* evaluateBooleanOperator(op, left, right) {
  if (op !== "and" && op !== "or") {
    throw new JqEvaluateError(
      `evaluateBooleanOperator: Unexpected operator '${op}'`
    );
  }
  let first = true;
  const memorizedRightItems = [];
  for (const leftItem of left) {
    checkRuntimeBudget();
    const rightItems = first ? right : memorizedRightItems;
    if (op === "and" && !isTrue(leftItem.value)) {
      yield createItem(false);
      continue;
    } else if (op === "or" && isTrue(leftItem.value)) {
      yield createItem(true);
      continue;
    }
    for (const rightItem of rightItems) {
      checkRuntimeBudget();
      if (first)
        memorizedRightItems.push(rightItem);
      yield createItem(isTrue(rightItem.value));
    }
    first = false;
  }
}
function* evaluateNormalBinaryOperator(op, left, right) {
  for (const [rightItem, leftItem] of combineIterators(right, left)) {
    checkRuntimeBudget();
    yield createItem(
      applyNormalBinaryOperator(op, leftItem.value, rightItem.value)
    );
  }
}
function applyAlternativeOperator(left, right) {
  return isTrue(left) ? left : right;
}
function* evaluateAlternativeOperator(left, right) {
  let hasResults = false;
  for (const leftItem of left) {
    checkRuntimeBudget();
    if (isTrue(leftItem.value)) {
      yield leftItem;
      hasResults = true;
    }
  }
  if (!hasResults) {
    yield* right;
  }
}

// src/jqtools/evaluate/generateCombinations.ts
function* generateCombinations(sets) {
  if (sets.some((set) => set.length === 0)) {
    return;
  }
  const counters = sets.map((_) => 0);
  do {
    yield buildCombination(sets, counters);
  } while (increaseCounters(sets, counters));
}
function buildCombination(sets, counters) {
  return counters.map((counter, i) => sets[i][counter]);
}
function increaseCounters(sets, counters) {
  for (let i = counters.length - 1; i >= 0; i--) {
    counters[i]++;
    if (counters[i] < sets[i].length) {
      return true;
    }
    counters[i] = 0;
  }
  return false;
}

// src/jqtools/evaluate/generateObjects.ts
function* generateObjects(potentialEntries) {
  const flatPotentialEntries = potentialEntries.flat();
  for (const combination of generateCombinations(flatPotentialEntries)) {
    yield buildObject(combination);
  }
}
function buildObject(flatEntries) {
  const entries = flatEntries.reduce((acc, item, i) => {
    if (i % 2 === 0) {
      acc.push([item]);
    } else {
      acc[acc.length - 1].push(item);
    }
    return acc;
  }, []);
  return Object.fromEntries(entries);
}

// src/jqtools/evaluate/evaluate.ts
function cannotIterateError(value) {
  const preview = isAtom(value) ? ` "${value}"` : "";
  return new JqEvaluateError(`${typeOf(value)}${preview} is not iterable`);
}
function invalidSliceIndicesError() {
  return new JqEvaluateError("Array slice indices must be numbers");
}
var BreakError = class extends JqEvaluateError {
  constructor(value) {
    super(`Label ${value} is not defined`);
    this.value = value;
  }
};
function* evaluateWithRegistry(ast, input, registry) {
  const env = new Environment(null, registry);
  yield* generateValues(env.evaluate(ast.expr, generateItems(input)));
}
var Environment = class _Environment {
  constructor(parent = null, builtins = parent?.builtins ?? resolveCoreRegistry()) {
    this.parent = parent;
    this.builtins = builtins;
    this.vars = Object.create(this.parent ? this.parent.vars : null);
  }
  vars;
  extend() {
    return new _Environment(this, this.builtins);
  }
  getVar(name) {
    if (name in this.vars)
      return this.vars[name];
    if (name in this.builtins.jq)
      return { scope: null, value: this.builtins.jq[name] };
    if (name in this.builtins.native)
      return { scope: null, value: this.builtins.native[name] };
    throw notDefinedError(name);
  }
  setVar(name, value, scope = this) {
    this.vars[name] = { scope, value };
  }
  getVarValue(name) {
    return this.getVar(name).value;
  }
  evaluateConditions(ast, input) {
    return Array.from(this.evaluate(ast, input)).map(
      (item) => isTrue(item.value)
    );
  }
  *evaluateForeach(ast, input, reduceMode = false) {
    for (const inputItem of input) {
      checkRuntimeBudget();
      let first = true;
      const memorizedStepItems = [];
      for (const initialValue of this.evaluate(ast.init, single(inputItem))) {
        checkRuntimeBudget();
        let res = initialValue;
        const stepItems = first ? this.evaluate(ast.expr, single(inputItem)) : memorizedStepItems;
        for (const stepItem of stepItems) {
          checkRuntimeBudget();
          const scope = this.extend();
          scope.setVar(ast.var, stepItem.value);
          let empty = true;
          for (const update of scope.evaluate(ast.update, single(res))) {
            checkRuntimeBudget();
            empty = false;
            res = update;
            if (!reduceMode) {
              if (ast.extract) {
                yield* scope.evaluate(ast.extract, single(update));
              } else {
                yield update;
              }
            }
          }
          if (empty)
            res = createItem(null);
          if (first)
            memorizedStepItems.push(stepItem);
        }
        first = false;
        if (reduceMode)
          yield res;
      }
    }
  }
  *evaluate(ast, input) {
    checkRuntimeBudget();
    if (ast === void 0) {
      yield* input;
      return;
    }
    switch (ast.type) {
      case "identity":
        yield* input;
        break;
      case "binary":
        if (ast.type === "binary" && ast.operator === "|") {
          yield* this.evaluate(ast.right, this.evaluate(ast.left, input));
          break;
        }
        for (const item of input) {
          checkRuntimeBudget();
          const left = this.evaluate(ast.left, single(item));
          const right = this.evaluate(ast.right, single(item));
          if (isBinaryOperatorType(ast.operator, 4 /* comma */)) {
            yield* left;
            yield* right;
          } else if (isBinaryOperatorType(ast.operator, 0 /* normal */)) {
            yield* evaluateNormalBinaryOperator(ast.operator, left, right);
          } else if (isBinaryOperatorType(ast.operator, 2 /* boolean */)) {
            yield* evaluateBooleanOperator(ast.operator, left, right);
          } else if (isBinaryOperatorType(ast.operator, 5 /* alternative */)) {
            yield* evaluateAlternativeOperator(left, right);
          } else if (isBinaryOperatorType(ast.operator, 1 /* assignment */)) {
            if (ast.operator === "|=") {
              let out = item.value;
              for (const path of generatePaths(left)) {
                const relativePath = relativizePath(path, item.path);
                let newValue = void 0;
                for (const valItem of this.evaluate(
                  ast.right,
                  single(createItem(getPath(item.value, relativePath)))
                )) {
                  newValue = deepClone(valItem.value);
                  break;
                }
                out = setPath(out, relativePath, newValue);
              }
              yield createItem(out);
            } else if (ast.operator === "=") {
              yield* evaluateSimpleAssignment(item, left, right);
            } else {
              yield* evaluateArithmeticUpdateAssignment(
                ast.operator,
                item,
                left,
                right
              );
            }
          } else {
            throw new JqEvaluateError(`Unexpected operator ${ast.operator}`);
          }
        }
        break;
      case "def": {
        const scope = this.extend();
        scope.setVar(ast.name, ast);
        yield* scope.evaluate(ast.next, input);
        break;
      }
      case "str":
        for (const inputItem of input) {
          checkRuntimeBudget();
          if (ast.interpolated) {
            const parts = ast.parts.map(
              (part) => typeof part === "string" ? [part] : Array.from(this.evaluate(part, single(inputItem))).map(
                (item) => applyFormat(ast.format, item.value)
              )
            ).reverse();
            for (const combination of generateCombinations(parts)) {
              checkRuntimeBudget();
              yield createItem(combination.reverse().join(""));
            }
          } else {
            yield createItem(ast.value);
          }
        }
        break;
      case "num":
      case "bool":
      case "null":
        for (const item of input) {
          checkRuntimeBudget();
          yield createItem(ast.value);
        }
        break;
      case "format":
        for (const item of input) {
          checkRuntimeBudget();
          yield createItem(applyFormat(ast, item.value));
        }
        break;
      case "filter":
        for (const item of input) {
          checkRuntimeBudget();
          const arity = Parser.getFilterArity(ast.name);
          const def = this.getVar(ast.name);
          if (isNativeFilter(def.value)) {
            const argSets = [];
            for (let i = 0; i < arity; i++) {
              const argExprAst = ast.args[i];
              argSets.push(
                Array.from(
                  this.evaluate(argExprAst, single(createItem(item.value)))
                )
              );
            }
            for (const combination of generateCombinations(argSets)) {
              checkRuntimeBudget();
              for (const nativeItem of def.value(item, ...combination)) {
                checkRuntimeBudget();
                yield nativeItem;
              }
            }
          } else {
            const argSets = [];
            for (let i = 0; i < arity; i++) {
              const argDefAst = def.value.args[i];
              const argExprAst = ast.args[i];
              switch (argDefAst.type) {
                case "varArg":
                  argSets.push(
                    collectValues(this.evaluate(argExprAst, single(item)))
                  );
                  break;
                case "filterArg":
                  const def2 = {
                    type: "def",
                    name: argDefAst.name,
                    args: [],
                    body: argExprAst
                  };
                  argSets.push([def2]);
                  break;
              }
            }
            for (const combination of generateCombinations(argSets)) {
              checkRuntimeBudget();
              const scope = def.scope?.extend() ?? new _Environment(null, this.builtins);
              for (let i = 0; i < arity; i++) {
                const argDefAst = def.value.args[i];
                scope.setVar(argDefAst.name, combination[i], this);
              }
              yield* scope.evaluate(def.value.body, single(item));
            }
          }
        }
        break;
      case "if":
        for (const item of input) {
          checkRuntimeBudget();
          const condResults = [
            this.evaluateConditions(ast.cond, single(item))
          ];
          const expressions = [ast.then];
          if (condResults[0].includes(false) && ast.elifs) {
            for (const elif of ast.elifs) {
              condResults.push(
                this.evaluateConditions(elif.cond, single(item))
              );
              expressions.push(elif.then);
              if (!condResults[condResults.length - 1].includes(false))
                break;
            }
          }
          if (ast.else)
            expressions.push(ast.else);
          const exprResults = [];
          const getExprResult = (i) => {
            if (!expressions[i])
              return [];
            if (!exprResults[i]) {
              exprResults[i] = Array.from(
                this.evaluate(expressions[i], single(item))
              );
            }
            return exprResults[i];
          };
          function* generateBlock(i) {
            if (condResults[i]) {
              for (const condRes of condResults[i]) {
                checkRuntimeBudget();
                if (condRes) {
                  yield* getExprResult(i);
                } else {
                  yield* generateBlock(i + 1);
                }
              }
            } else {
              yield* getExprResult(i);
            }
          }
          yield* generateBlock(0);
        }
        break;
      case "try":
        for (const item of input) {
          checkRuntimeBudget();
          try {
            for (const val of this.evaluate(ast.body, single(item))) {
              checkRuntimeBudget();
              yield val;
            }
          } catch (e) {
            if (e instanceof BreakError)
              throw e;
            if (ast.catch) {
              yield* this.evaluate(ast.catch, single(createItem(e.message)));
            }
          }
        }
        break;
      case "reduce":
        yield* this.evaluateForeach({ ...ast, type: "foreach" }, input, true);
        break;
      case "var":
        for (const item of input) {
          checkRuntimeBudget();
          yield createItem(this.getVarValue(ast.name));
        }
        break;
      case "varDeclaration":
        for (const item of input) {
          checkRuntimeBudget();
          for (const val of this.evaluate(ast.expr, single(item))) {
            checkRuntimeBudget();
            const allVarNames = new Set(
              _Environment.extractVariableNames(ast.destructuring)
            );
            for (let i = 0; i < ast.destructuring.length; i++) {
              const destructuring = ast.destructuring[i];
              try {
                for (const vars of this.destructureValue(
                  val.value,
                  destructuring
                )) {
                  checkRuntimeBudget();
                  const scope = this.extend();
                  for (const varName of allVarNames) {
                    scope.setVar(varName, null);
                  }
                  for (const [varName, varValue] of Object.entries(vars)) {
                    scope.setVar(varName, varValue);
                  }
                  yield* scope.evaluate(ast.next, single(item));
                }
                break;
              } catch (e) {
                if (i + 1 >= ast.destructuring.length) {
                  throw e;
                }
              }
            }
          }
        }
        break;
      case "foreach":
        yield* this.evaluateForeach(ast, input);
        break;
      case "label":
        try {
          yield* this.evaluate(ast.next, input);
        } catch (e) {
          if (e instanceof BreakError) {
            if (e.value !== ast.value)
              throw e;
            break;
          } else {
            throw e;
          }
        }
        break;
      case "break":
        throw new BreakError(ast.value);
      case "unary":
        const { operator, type } = ast;
        if (ast.operator === "-") {
          for (const item of input) {
            checkRuntimeBudget();
            for (const val of this.evaluate(ast.expr, single(item))) {
              checkRuntimeBudget();
              yield createItem(-val.value);
            }
          }
          break;
        }
        throw notImplementedError(`${type}:${operator}`);
      case "index":
        for (const item of input) {
          checkRuntimeBudget();
          for (const val of this.evaluate(ast.expr, single(item))) {
            checkRuntimeBudget();
            if (typeof ast.index === "string") {
              yield createItem(access(val.value, ast.index), [
                ...val.path,
                ast.index
              ]);
            } else {
              for (const index of this.evaluate(ast.index, single(item))) {
                checkRuntimeBudget();
                yield createItem(access(val.value, index.value), [
                  ...val.path,
                  index.value
                ]);
              }
            }
          }
        }
        break;
      case "slice":
        for (const item of input) {
          checkRuntimeBudget();
          const fromItems = ast.from ? Array.from(this.evaluate(ast.from, single(item))) : [void 0];
          const toItems = ast.to ? Array.from(this.evaluate(ast.to, single(item))) : [void 0];
          for (const val of this.evaluate(ast.expr, single(item))) {
            checkRuntimeBudget();
            if (!typeIsOneOf(val.value, "array" /* array */, "string" /* string */, "null" /* null */)) {
              throw cannotSliceError(val.value);
            }
            for (const from of fromItems) {
              checkRuntimeBudget();
              if (from !== void 0 && typeOf(from.value) !== "number" /* number */) {
                throw invalidSliceIndicesError();
              }
              for (const to of toItems) {
                checkRuntimeBudget();
                if (to !== void 0 && typeOf(to.value) !== "number" /* number */) {
                  throw invalidSliceIndicesError();
                }
                const accessor = createSliceAccessor(
                  from?.value ?? null,
                  to?.value ?? null
                );
                yield createItem(access(val.value, accessor), [
                  ...val.path,
                  accessor
                ]);
              }
            }
          }
        }
        break;
      case "iterator":
        for (const item of input) {
          checkRuntimeBudget();
          for (const val of this.evaluate(ast.expr, single(item))) {
            checkRuntimeBudget();
            switch (typeOf(val.value)) {
              case "array":
                for (let i = 0; i < val.value.length; i++) {
                  checkRuntimeBudget();
                  yield createItem(val.value[i], [...val.path, i]);
                }
                break;
              case "object":
                for (const [key, value] of Object.entries(val.value)) {
                  checkRuntimeBudget();
                  yield createItem(value, [...val.path, key]);
                }
                break;
              case "null":
                break;
              default:
                throw cannotIterateError(val.value);
            }
          }
        }
        break;
      case "array":
        for (const item of input) {
          checkRuntimeBudget();
          if (ast.expr) {
            yield createItem(
              collectValues(this.evaluate(ast.expr, single(item)))
            );
          } else {
            yield createItem([]);
          }
        }
        break;
      case "object":
        for (const item of input) {
          checkRuntimeBudget();
          yield* generateItems(
            generateObjects(
              ast.entries.map(({ key, value }) => {
                return [
                  typeof key === "string" ? [key] : collectValues(this.evaluate(key, single(item))),
                  value === void 0 ? [item.value[key]] : collectValues(this.evaluate(value, single(item)))
                ];
              })
            )
          );
        }
        break;
      case "recursiveDescent":
        for (const item of input) {
          checkRuntimeBudget();
          for (const value of recursiveDescent(item.value)) {
            checkRuntimeBudget();
            yield createItem(value);
          }
        }
        break;
    }
  }
  static *extractVariableNames(destructurings) {
    for (const destructuring of destructurings) {
      switch (destructuring.type) {
        case "var":
          yield destructuring.name;
          break;
        case "arrayDestructuring": {
          for (const item of destructuring.destructuring) {
            yield* _Environment.extractVariableNames([item]);
          }
          break;
        }
        case "objectDestructuring":
          for (const entry of destructuring.entries) {
            if (entry.destructuring) {
              yield* _Environment.extractVariableNames([entry.destructuring]);
            } else {
              yield entry.key.name;
            }
          }
          break;
      }
    }
  }
  *destructureValue(val, destructuring) {
    switch (destructuring.type) {
      case "var":
        yield { [destructuring.name]: val };
        break;
      case "arrayDestructuring": {
        if (typeOf(val) !== "array") {
          throw new JqEvaluateError(
            `${typeOf(val)} cannot be destructured as an array`
          );
        }
        const results2 = destructuring.destructuring.map(
          (item, i) => Array.from(
            this.destructureValue(val[i], destructuring.destructuring[i])
          )
        );
        for (const combination of generateCombinations(results2)) {
          yield Object.assign({}, ...combination);
        }
        break;
      }
      case "objectDestructuring":
        if (typeOf(val) !== "object") {
          throw new JqEvaluateError(
            `${typeOf(val)} cannot be destructured as an object`
          );
        }
        const results = destructuring.entries.map((entry) => {
          if (entry.destructuring) {
            if (typeof entry.key === "string") {
              return Array.from(
                this.destructureValue(val[entry.key], entry.destructuring)
              );
            } else {
              const keys2 = collectValues(
                this.evaluate(entry.key, single(createItem(val)))
              );
              return keys2.map(
                (key) => Array.from(
                  this.destructureValue(val[key], entry.destructuring)
                )
              ).flat();
            }
          } else {
            const varName = entry.key.name;
            const key = entry.key.name.substring(1);
            const varValue = val[key];
            return [{ [varName]: varValue }];
          }
        });
        for (const combination of generateCombinations(results)) {
          yield Object.assign({}, ...combination.reverse());
        }
        break;
    }
  }
};

// src/bxl/bridge/formula-statistical-manifest.ts
var FORMULA_STATISTICAL_FUNCTIONS = [
  "BETA_DIST",
  "BETA_INV",
  "BINOM_DIST",
  "BINOM_DIST_RANGE",
  "BINOM_INV",
  "CHISQ_DIST",
  "CHISQ_DIST_RT",
  "CHISQ_INV",
  "CHISQ_INV_RT",
  "CHISQ_TEST",
  "CONFIDENCE_NORM",
  "CONFIDENCE_T",
  "EXPON_DIST",
  "F_DIST",
  "F_DIST_RT",
  "F_INV",
  "F_INV_RT",
  "F_TEST",
  "GAMMA",
  "GAMMA_DIST",
  "GAMMA_INV",
  "GAMMALN",
  "GAMMALN_PRECISE",
  "GAUSS",
  "HYPGEOM_DIST",
  "LOGNORM_DIST",
  "LOGNORM_INV",
  "NEGBINOM_DIST",
  "NORM_DIST",
  "NORM_INV",
  "NORM_S_DIST",
  "NORM_S_INV",
  "PHI",
  "POISSON_DIST",
  "STANDARDIZE",
  "T_DIST",
  "T_DIST_2T",
  "T_DIST_RT",
  "T_INV",
  "T_INV_2T",
  "T_TEST",
  "WEIBULL_DIST",
  "Z_TEST"
];
var FORMULA_STATISTICAL_FILTERS = /* @__PURE__ */ new Set([
  "BETA_DIST/4",
  "BETA_DIST/5",
  "BETA_DIST/6",
  "BETA_INV/3",
  "BETA_INV/4",
  "BETA_INV/5",
  "BINOM_DIST/4",
  "BINOM_DIST_RANGE/3",
  "BINOM_DIST_RANGE/4",
  "BINOM_INV/3",
  "CHISQ_DIST/3",
  "CHISQ_DIST_RT/2",
  "CHISQ_INV/2",
  "CHISQ_INV_RT/2",
  "CHISQ_TEST/2",
  "CONFIDENCE_NORM/3",
  "CONFIDENCE_T/3",
  "EXPON_DIST/3",
  "F_DIST/4",
  "F_DIST_RT/3",
  "F_INV/3",
  "F_INV_RT/3",
  "F_TEST/2",
  "GAMMA/1",
  "GAMMA_DIST/4",
  "GAMMA_INV/3",
  "GAMMALN/1",
  "GAMMALN_PRECISE/1",
  "GAUSS/1",
  "HYPGEOM_DIST/5",
  "LOGNORM_DIST/4",
  "LOGNORM_INV/3",
  "NEGBINOM_DIST/4",
  "NORM_DIST/4",
  "NORM_INV/3",
  "NORM_S_DIST/2",
  "NORM_S_INV/1",
  "PHI/1",
  "POISSON_DIST/3",
  "STANDARDIZE/3",
  "T_DIST/3",
  "T_DIST_2T/2",
  "T_DIST_RT/2",
  "T_INV/2",
  "T_INV_2T/2",
  "T_TEST/2",
  "WEIBULL_DIST/4",
  "Z_TEST/2",
  "Z_TEST/3"
]);
var FORMULA_STATISTICAL_DOTTED_ALIASES = /* @__PURE__ */ new Map([
  ["BETA.DIST", "BETA_DIST"],
  ["BETA.INV", "BETA_INV"],
  ["BINOM.DIST.RANGE", "BINOM_DIST_RANGE"],
  ["BINOM.DIST", "BINOM_DIST"],
  ["BINOM.INV", "BINOM_INV"],
  ["CHISQ.DIST.RT", "CHISQ_DIST_RT"],
  ["CHISQ.DIST", "CHISQ_DIST"],
  ["CHISQ.INV.RT", "CHISQ_INV_RT"],
  ["CHISQ.INV", "CHISQ_INV"],
  ["CHISQ.TEST", "CHISQ_TEST"],
  ["CONFIDENCE.NORM", "CONFIDENCE_NORM"],
  ["CONFIDENCE.T", "CONFIDENCE_T"],
  ["EXPON.DIST", "EXPON_DIST"],
  ["F.DIST.RT", "F_DIST_RT"],
  ["F.DIST", "F_DIST"],
  ["F.INV.RT", "F_INV_RT"],
  ["F.INV", "F_INV"],
  ["F.TEST", "F_TEST"],
  ["GAMMA.DIST", "GAMMA_DIST"],
  ["GAMMA.INV", "GAMMA_INV"],
  ["GAMMALN.PRECISE", "GAMMALN_PRECISE"],
  ["HYPGEOM.DIST", "HYPGEOM_DIST"],
  ["LOGNORM.DIST", "LOGNORM_DIST"],
  ["LOGNORM.INV", "LOGNORM_INV"],
  ["NEGBINOM.DIST", "NEGBINOM_DIST"],
  ["NORM.S.DIST", "NORM_S_DIST"],
  ["NORM.S.INV", "NORM_S_INV"],
  ["NORM.DIST", "NORM_DIST"],
  ["NORM.INV", "NORM_INV"],
  ["POISSON.DIST", "POISSON_DIST"],
  ["T.DIST.2T", "T_DIST_2T"],
  ["T.DIST.RT", "T_DIST_RT"],
  ["T.DIST", "T_DIST"],
  ["T.INV.2T", "T_INV_2T"],
  ["T.INV", "T_INV"],
  ["T.TEST", "T_TEST"],
  ["WEIBULL.DIST", "WEIBULL_DIST"],
  ["Z.TEST", "Z_TEST"]
]);
var DOTTED_ALIASES_DESC = [...FORMULA_STATISTICAL_DOTTED_ALIASES.entries()].sort((left, right) => right[0].length - left[0].length);
var STATISTICAL_NAME_SET = new Set(FORMULA_STATISTICAL_FUNCTIONS);
function isIdentifierChar(char) {
  return Boolean(char && /[A-Za-z0-9_]/.test(char));
}
function isCallAfter(source, index) {
  let cursor = index;
  while (/\s/.test(source[cursor] ?? "")) {
    cursor++;
  }
  return source[cursor] === "(";
}
function scanFormulaSource(source, visitor) {
  let inString = false;
  let escaped = false;
  let inComment = false;
  for (let index = 0; index < source.length; index++) {
    const char = source[index];
    if (inComment) {
      if (char === "\n") {
        inComment = false;
      }
      continue;
    }
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }
    if (char === "#") {
      inComment = true;
      continue;
    }
    if (char === '"') {
      inString = true;
      continue;
    }
    if (isIdentifierChar(source[index - 1])) {
      continue;
    }
    for (const [dotted, replacement] of DOTTED_ALIASES_DESC) {
      const candidate = source.slice(index, index + dotted.length);
      if (candidate.toUpperCase() === dotted && !isIdentifierChar(source[index + dotted.length]) && isCallAfter(source, index + dotted.length)) {
        visitor({ start: index, end: index + dotted.length, replacement });
        index += dotted.length - 1;
        break;
      }
    }
  }
}
function rewriteStatisticalDottedFormulaNames(source) {
  const edits = [];
  scanFormulaSource(source, (entry) => {
    if (entry.replacement) {
      edits.push({
        start: entry.start,
        end: entry.end,
        replacement: entry.replacement
      });
    }
  });
  if (edits.length === 0) {
    return { source, changed: false };
  }
  let output = "";
  let cursor = 0;
  for (const edit of edits) {
    output += source.slice(cursor, edit.start) + edit.replacement;
    cursor = edit.end;
  }
  output += source.slice(cursor);
  return { source: output, changed: true };
}
function sourceUsesStatisticalFormula(source) {
  let found = false;
  scanFormulaSource(source, () => {
    found = true;
  });
  if (found) {
    return true;
  }
  let inString = false;
  let escaped = false;
  let inComment = false;
  for (let index = 0; index < source.length; index++) {
    const char = source[index];
    if (inComment) {
      if (char === "\n")
        inComment = false;
      continue;
    }
    if (inString) {
      if (escaped)
        escaped = false;
      else if (char === "\\")
        escaped = true;
      else if (char === '"')
        inString = false;
      continue;
    }
    if (char === "#") {
      inComment = true;
      continue;
    }
    if (char === '"') {
      inString = true;
      continue;
    }
    if (isIdentifierChar(source[index - 1])) {
      continue;
    }
    const match = source.slice(index).match(/^[A-Za-z_][A-Za-z0-9_]*/);
    if (!match) {
      continue;
    }
    const name = match[0].toUpperCase();
    if (STATISTICAL_NAME_SET.has(name) && !isIdentifierChar(source[index + match[0].length]) && isCallAfter(source, index + match[0].length)) {
      return true;
    }
    index += match[0].length - 1;
  }
  return false;
}

// src/bxl/bridge/formula-bessel-manifest.ts
var FORMULA_BESSEL_FUNCTIONS = [
  "BESSELI",
  "BESSELJ",
  "BESSELK",
  "BESSELY"
];
var FORMULA_BESSEL_FILTERS = /* @__PURE__ */ new Set([
  "BESSELI/2",
  "BESSELJ/2",
  "BESSELK/2",
  "BESSELY/2"
]);
var BESSEL_NAME_SET = new Set(FORMULA_BESSEL_FUNCTIONS);
function isIdentifierChar2(char) {
  return Boolean(char && /[A-Za-z0-9_]/.test(char));
}
function isCallAfter2(source, index) {
  let cursor = index;
  while (/\s/.test(source[cursor] ?? "")) {
    cursor++;
  }
  return source[cursor] === "(";
}
function sourceUsesBesselFormula(source) {
  let inString = false;
  let escaped = false;
  let inComment = false;
  for (let index = 0; index < source.length; index++) {
    const char = source[index];
    if (inComment) {
      if (char === "\n")
        inComment = false;
      continue;
    }
    if (inString) {
      if (escaped)
        escaped = false;
      else if (char === "\\")
        escaped = true;
      else if (char === '"')
        inString = false;
      continue;
    }
    if (char === "#") {
      inComment = true;
      continue;
    }
    if (char === '"') {
      inString = true;
      continue;
    }
    if (isIdentifierChar2(source[index - 1])) {
      continue;
    }
    const match = source.slice(index).match(/^[A-Za-z_][A-Za-z0-9_]*/);
    if (!match) {
      continue;
    }
    const name = match[0].toUpperCase();
    if (BESSEL_NAME_SET.has(name) && !isIdentifierChar2(source[index + match[0].length]) && isCallAfter2(source, index + match[0].length)) {
      return true;
    }
    index += match[0].length - 1;
  }
  return false;
}

// src/bxl/bridge/formula-engineering-manifest.ts
var FORMULA_ENGINEERING_FUNCTIONS = [
  "BASE",
  "BIN2DEC",
  "BIN2HEX",
  "BIN2OCT",
  "BITAND",
  "BITLSHIFT",
  "BITOR",
  "BITRSHIFT",
  "BITXOR",
  "COMPLEX",
  "CONVERT",
  "DEC2BIN",
  "DEC2HEX",
  "DEC2OCT",
  "DECIMAL",
  "DELTA",
  "ERF",
  "ERFC",
  "GESTEP",
  "HEX2BIN",
  "HEX2DEC",
  "HEX2OCT",
  "IMABS",
  "IMAGINARY",
  "IMARGUMENT",
  "IMCONJUGATE",
  "IMCOS",
  "IMCOSH",
  "IMCOT",
  "IMCSC",
  "IMCSCH",
  "IMDIV",
  "IMEXP",
  "IMLN",
  "IMLOG10",
  "IMLOG2",
  "IMPOWER",
  "IMPRODUCT",
  "IMREAL",
  "IMSEC",
  "IMSECH",
  "IMSIN",
  "IMSINH",
  "IMSQRT",
  "IMSUB",
  "IMSUM",
  "IMTAN",
  "OCT2BIN",
  "OCT2DEC",
  "OCT2HEX",
  "UNICHAR"
];
var FORMULA_ENGINEERING_FILTERS = /* @__PURE__ */ new Set([
  "BASE/2",
  "BASE/3",
  "BIN2DEC/1",
  "BIN2HEX/1",
  "BIN2HEX/2",
  "BIN2OCT/1",
  "BIN2OCT/2",
  "BITAND/2",
  "BITLSHIFT/2",
  "BITOR/2",
  "BITRSHIFT/2",
  "BITXOR/2",
  "COMPLEX/2",
  "COMPLEX/3",
  "CONVERT/3",
  "DEC2BIN/1",
  "DEC2BIN/2",
  "DEC2HEX/1",
  "DEC2HEX/2",
  "DEC2OCT/1",
  "DEC2OCT/2",
  "DECIMAL/2",
  "DELTA/1",
  "DELTA/2",
  "ERF/1",
  "ERF/2",
  "ERFC/1",
  "GESTEP/1",
  "GESTEP/2",
  "HEX2BIN/1",
  "HEX2BIN/2",
  "HEX2DEC/1",
  "HEX2OCT/1",
  "HEX2OCT/2",
  "IMABS/1",
  "IMAGINARY/1",
  "IMARGUMENT/1",
  "IMCONJUGATE/1",
  "IMCOS/1",
  "IMCOSH/1",
  "IMCOT/1",
  "IMCSC/1",
  "IMCSCH/1",
  "IMDIV/2",
  "IMEXP/1",
  "IMLN/1",
  "IMLOG10/1",
  "IMLOG2/1",
  "IMPOWER/2",
  "IMPRODUCT/1",
  "IMREAL/1",
  "IMSEC/1",
  "IMSECH/1",
  "IMSIN/1",
  "IMSINH/1",
  "IMSQRT/1",
  "IMSUB/2",
  "IMSUM/1",
  "IMSUM/2",
  "IMSUM/3",
  "IMTAN/1",
  "OCT2BIN/1",
  "OCT2BIN/2",
  "OCT2DEC/1",
  "OCT2HEX/1",
  "OCT2HEX/2",
  "UNICHAR/1"
]);
var NAME_SET = new Set(FORMULA_ENGINEERING_FUNCTIONS);
function isIdentifierChar3(char) {
  return Boolean(char && /[A-Za-z0-9_]/.test(char));
}
function isCallAfter3(source, index) {
  let cursor = index;
  while (/\s/.test(source[cursor] ?? "")) {
    cursor++;
  }
  return source[cursor] === "(";
}
function sourceUsesEngineeringFormula(source) {
  let inString = false;
  let escaped = false;
  let inComment = false;
  for (let index = 0; index < source.length; index++) {
    const char = source[index];
    if (inComment) {
      if (char === "\n")
        inComment = false;
      continue;
    }
    if (inString) {
      if (escaped)
        escaped = false;
      else if (char === "\\")
        escaped = true;
      else if (char === '"')
        inString = false;
      continue;
    }
    if (char === "#") {
      inComment = true;
      continue;
    }
    if (char === '"') {
      inString = true;
      continue;
    }
    if (isIdentifierChar3(source[index - 1])) {
      continue;
    }
    const match = source.slice(index).match(/^[A-Za-z_][A-Za-z0-9_]*/);
    if (!match) {
      continue;
    }
    const name = match[0].toUpperCase();
    if (NAME_SET.has(name) && !isIdentifierChar3(source[index + match[0].length]) && isCallAfter3(source, index + match[0].length)) {
      return true;
    }
    index += match[0].length - 1;
  }
  return false;
}

// src/bxl/bridge/formula-financial-manifest.ts
var FORMULA_FINANCIAL_FUNCTIONS = [
  "ACCRINT",
  "COUPDAYS",
  "CUMIPMT",
  "CUMPRINC",
  "DB",
  "DDB",
  "DISC",
  "DOLLARDE",
  "DOLLARFR",
  "EFFECT",
  "FV",
  "FVSCHEDULE",
  "IPMT",
  "IRR",
  "IRR_BY",
  "ISPMT",
  "MIRR",
  "NOMINAL",
  "NPER",
  "NPV",
  "NPV_BY",
  "PDURATION",
  "PMT",
  "PPMT",
  "PRICEDISC",
  "PV",
  "RATE",
  "RRI",
  "SLN",
  "SYD",
  "TBILLEQ",
  "TBILLPRICE",
  "TBILLYIELD",
  "XIRR",
  "XIRR_BY",
  "XNPV",
  "XNPV_BY"
];
var FORMULA_FINANCIAL_FILTERS = /* @__PURE__ */ new Set([
  "ACCRINT/6",
  "ACCRINT/7",
  "COUPDAYS/3",
  "COUPDAYS/4",
  "CUMIPMT/6",
  "CUMPRINC/6",
  "DB/4",
  "DB/5",
  "DDB/4",
  "DDB/5",
  "DISC/4",
  "DISC/5",
  "DOLLARDE/2",
  "DOLLARFR/2",
  "EFFECT/2",
  "FV/3",
  "FV/4",
  "FV/5",
  "FVSCHEDULE/2",
  "IPMT/4",
  "IPMT/5",
  "IPMT/6",
  "IRR/1",
  "IRR/2",
  "IRR_BY/2",
  "IRR_BY/3",
  "ISPMT/4",
  "MIRR/3",
  "NOMINAL/2",
  "NPER/3",
  "NPER/4",
  "NPER/5",
  "NPV/2",
  "NPV_BY/3",
  "PDURATION/3",
  "PMT/3",
  "PMT/4",
  "PMT/5",
  "PPMT/4",
  "PPMT/5",
  "PPMT/6",
  "PRICEDISC/4",
  "PRICEDISC/5",
  "PV/3",
  "PV/4",
  "PV/5",
  "RATE/3",
  "RATE/4",
  "RATE/5",
  "RATE/6",
  "RRI/3",
  "SLN/3",
  "SYD/4",
  "TBILLEQ/3",
  "TBILLPRICE/3",
  "TBILLYIELD/3",
  "XIRR/2",
  "XIRR/3",
  "XIRR_BY/3",
  "XIRR_BY/4",
  "XNPV/3",
  "XNPV_BY/4"
]);
var NAME_SET2 = new Set(FORMULA_FINANCIAL_FUNCTIONS);
function isIdentifierChar4(char) {
  return Boolean(char && /[A-Za-z0-9_]/.test(char));
}
function isCallAfter4(source, index) {
  let cursor = index;
  while (/\s/.test(source[cursor] ?? "")) {
    cursor++;
  }
  return source[cursor] === "(";
}
function sourceUsesFinancialFormula(source) {
  let inString = false;
  let escaped = false;
  let inComment = false;
  for (let index = 0; index < source.length; index++) {
    const char = source[index];
    if (inComment) {
      if (char === "\n")
        inComment = false;
      continue;
    }
    if (inString) {
      if (escaped)
        escaped = false;
      else if (char === "\\")
        escaped = true;
      else if (char === '"')
        inString = false;
      continue;
    }
    if (char === "#") {
      inComment = true;
      continue;
    }
    if (char === '"') {
      inString = true;
      continue;
    }
    if (isIdentifierChar4(source[index - 1])) {
      continue;
    }
    const match = source.slice(index).match(/^[A-Za-z_][A-Za-z0-9_]*/);
    if (!match) {
      continue;
    }
    const name = match[0].toUpperCase();
    if (NAME_SET2.has(name) && !isIdentifierChar4(source[index + match[0].length]) && isCallAfter4(source, index + match[0].length)) {
      return true;
    }
    index += match[0].length - 1;
  }
  return false;
}

// src/bxl/bridge/lazy-formulas.ts
var formulaStatisticalLoad;
var formulaBesselLoad;
var formulaExtrasBundleLoad;
var validationLoad;
function astUsesFilterSet(node, filters) {
  if (!node || typeof node !== "object") {
    return false;
  }
  if (node.type === "filter" && filters.has(String(node.name))) {
    return true;
  }
  for (const value of Object.values(node)) {
    if (Array.isArray(value)) {
      if (value.some((entry) => astUsesFilterSet(entry, filters))) {
        return true;
      }
    } else if (astUsesFilterSet(value, filters)) {
      return true;
    }
  }
  return false;
}
async function ensureStatisticalLoaded() {
  formulaStatisticalLoad ??= import("./bxl-chunks/formula-statistical-WJO2WZJO.ts").then(
    ({ formulaStatisticalLibrary: formulaStatisticalLibrary2 }) => {
      registerBuiltinLibrary("formula-statistical", formulaStatisticalLibrary2);
    }
  );
  await formulaStatisticalLoad;
}
async function ensureBesselLoaded() {
  formulaBesselLoad ??= import("./bxl-chunks/formula-bessel-FPZIFJF4.ts").then(
    ({ formulaBesselLibrary: formulaBesselLibrary2 }) => {
      registerBuiltinLibrary("formula-bessel", formulaBesselLibrary2);
    }
  );
  await formulaBesselLoad;
}
async function ensureExtrasBundleLoaded() {
  formulaExtrasBundleLoad ??= import("./bxl-chunks/formula-extras-RUVQDYXU.ts").then(
    ({ formulaExtrasBundle }) => {
      for (const [name, library] of Object.entries(formulaExtrasBundle)) {
        registerBuiltinLibrary(name, library);
      }
    }
  );
  await formulaExtrasBundleLoad;
}
async function ensureValidationLoaded() {
  validationLoad ??= import("./bxl-chunks/validation-CH4DQ6RW.ts").then(
    ({ validationLibrary: validationLibrary2 }) => {
      registerBuiltinLibrary("validation", validationLibrary2);
    }
  );
  await validationLoad;
}
var EXTRAS_LIBRARIES = [
  "formula-engineering",
  "formula-financial"
];
function canAutoLoadFormulaExtension(libraries, extension) {
  const target = Array.isArray(extension) ? extension : [extension];
  if (target.includes("validation")) {
    return libraries.includes("formula") || libraries.includes("validation");
  }
  if (libraries.includes("formula"))
    return true;
  return target.some((name) => libraries.includes(name));
}
async function maybeLoadSingle(next, extension, needed, load) {
  if (!needed || !canAutoLoadFormulaExtension(next, extension)) {
    return;
  }
  await load();
  if (!next.includes(extension)) {
    next.push(extension);
  }
}
async function maybeLoadBundle(next, bundleLibraries, needed, load) {
  if (!needed || !canAutoLoadFormulaExtension(next, bundleLibraries)) {
    return;
  }
  await load();
  for (const name of bundleLibraries) {
    if (!next.includes(name)) {
      next.push(name);
    }
  }
}
async function resolveLazyBuiltinLibrariesForAst(ast, libraries = DEFAULT_BUILTIN_LIBRARIES) {
  const next = [...new Set(libraries)];
  await maybeLoadSingle(
    next,
    "formula-statistical",
    next.includes("formula-statistical") || astUsesFilterSet(ast, FORMULA_STATISTICAL_FILTERS),
    ensureStatisticalLoaded
  );
  await maybeLoadSingle(
    next,
    "formula-bessel",
    next.includes("formula-bessel") || astUsesFilterSet(ast, FORMULA_BESSEL_FILTERS),
    ensureBesselLoaded
  );
  const extrasNeeded = EXTRAS_LIBRARIES.some((name) => next.includes(name)) || astUsesFilterSet(ast, FORMULA_ENGINEERING_FILTERS) || astUsesFilterSet(ast, FORMULA_FINANCIAL_FILTERS);
  await maybeLoadBundle(next, EXTRAS_LIBRARIES, extrasNeeded, ensureExtrasBundleLoaded);
  await maybeLoadSingle(
    next,
    "validation",
    next.includes("validation") || astUsesFilterSet(ast, VALIDATION_FILTERS),
    ensureValidationLoaded
  );
  return next;
}
async function resolveLazyBuiltinLibrariesForExpressions(expressions, libraries = DEFAULT_BUILTIN_LIBRARIES) {
  const next = [...new Set(libraries)];
  await maybeLoadSingle(
    next,
    "formula-statistical",
    next.includes("formula-statistical") || expressions.some((expression2) => sourceUsesStatisticalFormula(expression2)),
    ensureStatisticalLoaded
  );
  await maybeLoadSingle(
    next,
    "formula-bessel",
    next.includes("formula-bessel") || expressions.some((expression2) => sourceUsesBesselFormula(expression2)),
    ensureBesselLoaded
  );
  const extrasNeeded = EXTRAS_LIBRARIES.some((name) => next.includes(name)) || expressions.some((expression2) => sourceUsesEngineeringFormula(expression2)) || expressions.some((expression2) => sourceUsesFinancialFormula(expression2));
  await maybeLoadBundle(next, EXTRAS_LIBRARIES, extrasNeeded, ensureExtrasBundleLoaded);
  await maybeLoadSingle(
    next,
    "validation",
    next.includes("validation") || expressions.some((expression2) => sourceUsesValidationFunction(expression2)),
    ensureValidationLoaded
  );
  return next;
}

// src/bxl/compiler/lexicon.ts
var JQ_KEYWORDS = /* @__PURE__ */ new Set([
  "and",
  "as",
  "break",
  "catch",
  "def",
  "elif",
  "else",
  "end",
  "foreach",
  "if",
  "label",
  "not",
  "or",
  "reduce",
  "then",
  "try"
]);
var BXL_LITERALS = /* @__PURE__ */ new Set([
  "true",
  "false",
  "null"
]);

// src/bxl/compiler/readable-syntax.ts
var ReadableSyntaxError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "ReadableSyntaxError";
  }
};
var FORMULA_FUNCTIONS = /* @__PURE__ */ new Set([
  "ABS",
  "ACCRINT",
  "ACOS",
  "ACOSH",
  "ACOT",
  "ACOTH",
  "AND",
  "ARABIC",
  "ASIN",
  "ASINH",
  "ATAN",
  "ATAN2",
  "ATANH",
  "AVEDEV",
  "AVERAGE",
  "AVERAGEIF",
  "AVERAGEIFS_BY",
  "AVERAGEIF_BY",
  "BASE",
  "BIN2DEC",
  "BIN2HEX",
  "BIN2OCT",
  "BITAND",
  "BITLSHIFT",
  "BITOR",
  "BITRSHIFT",
  "BITXOR",
  "CEILING",
  "CEILING_MATH",
  "CHAR",
  "CHOOSE",
  "CLEAN",
  "CODE",
  "COL",
  "COLUMNS",
  "COMBIN",
  "COMBINA",
  "COMPLEX",
  "CONCAT",
  "CONCATENATE",
  "CONVERT",
  "CORREL",
  "COS",
  "COSH",
  "COT",
  "COTH",
  "COUNT",
  "COUNTA",
  "COUNTBLANK",
  "COUNTIF",
  "COUNTIFS_BY",
  "COUNTIF_BY",
  "COUPDAYS",
  "CSC",
  "CSCH",
  "CUMIPMT",
  "CUMPRINC",
  "DATE",
  "DATEDIF",
  "DATEVALUE",
  "DAY",
  "DAYS",
  "DAYS360",
  "DB",
  "DDB",
  "DEC2BIN",
  "DEC2HEX",
  "DEC2OCT",
  "DECIMAL",
  "DEGREES",
  "DELTA",
  "DEVSQ",
  "DISC",
  "DOLLAR",
  "DOLLARDE",
  "DOLLARFR",
  "EDATE",
  "EFFECT",
  "EOMONTH",
  "ERF",
  "ERFC",
  "EVEN",
  "EXACT",
  "EXP",
  "FACT",
  "FACTDOUBLE",
  "FALSE",
  "FIND",
  "FIXED",
  "FLOOR",
  "FLOOR_MATH",
  "FORECAST",
  "FV",
  "FVSCHEDULE",
  "GCD",
  "GEOMEAN",
  "GESTEP",
  "HARMEAN",
  "HEX2BIN",
  "HEX2DEC",
  "HEX2OCT",
  "HLOOKUP",
  "HOUR",
  "IF",
  "IFERROR",
  "IFNA",
  "IFS",
  "IMABS",
  "IMAGINARY",
  "IMARGUMENT",
  "IMCONJUGATE",
  "IMCOS",
  "IMCOSH",
  "IMCOT",
  "IMCSC",
  "IMCSCH",
  "IMDIV",
  "IMEXP",
  "IMLN",
  "IMLOG10",
  "IMLOG2",
  "IMPOWER",
  "IMPRODUCT",
  "IMREAL",
  "IMSEC",
  "IMSECH",
  "IMSIN",
  "IMSINH",
  "IMSQRT",
  "IMSUB",
  "IMSUM",
  "IMTAN",
  "INDEX",
  "INT",
  "INTERCEPT",
  "IPMT",
  "IRR",
  "IRR_BY",
  "ISBLANK",
  "ISERR",
  "ISERROR",
  "ISEVEN",
  "ISLOGICAL",
  "ISNA",
  "ISNONTEXT",
  "ISNUMBER",
  "ISODD",
  "ISOWEEKNUM",
  "ISPMT",
  "ISTEXT",
  "KURT",
  "LARGE",
  "LCM",
  "LEFT",
  "LEN",
  "LN",
  "LOG",
  "LOG10",
  "LOOKUP",
  "LOOKUP_BY",
  "LOWER",
  "MATCH",
  "MAX",
  "MAXIFS",
  "MEDIAN",
  "MID",
  "MIN",
  "MINIFS",
  "MINUTE",
  "MIRR",
  "MOD",
  "MONTH",
  "MROUND",
  "MULTINOMIAL",
  "N",
  "NETWORKDAYS",
  "NETWORKDAYS_INTL",
  "NOMINAL",
  "NOT",
  "NOW",
  "NPER",
  "NPV",
  "NPV_BY",
  "NUMBERVALUE",
  "OCT2BIN",
  "OCT2DEC",
  "OCT2HEX",
  "ODD",
  "OR",
  "PDURATION",
  "PEARSON",
  "PERCENTILE_EXC",
  "PERCENTILE_INC",
  "PERCENTRANK_EXC",
  "PERCENTRANK_INC",
  "PERMUT",
  "PI",
  "PMT",
  "POWER",
  "PPMT",
  "PRICEDISC",
  "PRODUCT",
  "PROPER",
  "PV",
  "QUARTILE_EXC",
  "QUARTILE_INC",
  "QUOTIENT",
  "RADIANS",
  "RAND",
  "RANDBETWEEN",
  "RANK_AVG",
  "RANK_EQ",
  "RATE",
  "REPLACE",
  "REPT",
  "RIGHT",
  "ROMAN",
  "ROUND",
  "ROUNDDOWN",
  "ROUNDUP",
  "ROWS",
  "RRI",
  "SEARCH",
  "SEC",
  "SECH",
  "SECOND",
  "SERIESSUM",
  "SIGN",
  "SIN",
  "SINH",
  "SKEW",
  "SLN",
  "SLOPE",
  "SMALL",
  "SQRT",
  "SQRTPI",
  "STDEV",
  "STDEV_P",
  "STDEV_S",
  "SUBSTITUTE",
  "SUM",
  "SUMIF",
  "SUMIFS_BY",
  "SUMIF_BY",
  "SUMPRODUCT",
  "SUMSQ",
  "SUMX2MY2",
  "SUMX2PY2",
  "SUMXMY2",
  "SWITCH",
  "SYD",
  "T",
  "TAN",
  "TANH",
  "TBILLEQ",
  "TBILLPRICE",
  "TBILLYIELD",
  "TEXT",
  "TEXTJOIN",
  "TIME",
  "TIMEVALUE",
  "TODAY",
  "TRIM",
  "TRIMMEAN",
  "TRUE",
  "TRUNC",
  "TYPE",
  "UNICHAR",
  "UNICODE",
  "UPPER",
  "VALUE",
  "VAR",
  "VAR_P",
  "VAR_S",
  "VLOOKUP",
  "VLOOKUP_BY",
  "WEEKDAY",
  "WEEKNUM",
  "WORKDAY",
  "WORKDAY_INTL",
  "LET",
  "XIRR",
  "XIRR_BY",
  "XNPV",
  "XNPV_BY",
  "XLOOKUP",
  "XOR",
  "YEAR",
  "YEARFRAC",
  ...FORMULA_BESSEL_FUNCTIONS,
  ...FORMULA_STATISTICAL_FUNCTIONS
]);
var LOWERCASE_BXL_HELPERS = /* @__PURE__ */ new Set([
  "between",
  "implies",
  "like",
  "nonempty",
  "overlaps",
  "present",
  "when",
  "words"
]);
var REMOVED_STRING_OPERATOR_ALIASES = /* @__PURE__ */ new Set(["^=", "$=", "*="]);
function removedStringOperatorMessage(operator) {
  return `Readable string operator ${operator} was removed. Use jq pipe form instead, such as Field | contains("text"), Field | startswith("prefix"), or Field | endswith("suffix").`;
}
function isRemovedStringWordOperator(value) {
  const lower = value.toLowerCase();
  return value !== lower && (lower === "contains" || lower === "startswith" || lower === "endswith");
}
var ARRAY_PACKED_VARIADIC_FORMULAS = /* @__PURE__ */ new Set([
  "AND",
  "AVERAGE",
  "CONCAT",
  "CONCATENATE",
  "COUNT",
  "COUNTA",
  "MAX",
  "MEDIAN",
  "MIN",
  "OR",
  "PRODUCT",
  "STDEV",
  "STDEV_P",
  "STDEV_S",
  "SUM",
  "SUMPRODUCT",
  "SUMSQ",
  "SWITCH",
  "VAR",
  "VAR_P",
  "VAR_S",
  "XOR"
]);
var TRAILING_ARRAY_PACKED_VARIADIC_FORMULAS = /* @__PURE__ */ new Map([
  ["CHOOSE", 1],
  ["TEXTJOIN", 2]
]);
var CASE_INSENSITIVE_JQ_FUNCTIONS = /* @__PURE__ */ new Set([
  "add",
  "all",
  "any",
  "atan2",
  "contains",
  "endswith",
  "first",
  "flatten",
  "from_entries",
  "fromjson",
  "group_by",
  "has",
  "implies",
  "keys",
  "last",
  "length",
  "like",
  "log",
  "map",
  "map_values",
  "match",
  "max",
  "min",
  "nonempty",
  "now",
  "overlaps",
  "present",
  "reverse",
  "select",
  "sort",
  "sort_by",
  "split",
  "startswith",
  "to_entries",
  "tojson",
  "tonumber",
  "tostring",
  "trim",
  "type",
  "unique",
  "unique_by",
  "when",
  "with_entries",
  "words",
  "between"
]);
var JQ_ZERO_ARG_CASE_FOLD_FILTERS = /* @__PURE__ */ new Set([
  "abs",
  "acos",
  "acosh",
  "asin",
  "asinh",
  "atan",
  "atanh",
  "cos",
  "cosh",
  "erf",
  "erfc",
  "exp",
  "floor",
  "gamma",
  "log",
  "log10",
  "max",
  "min",
  "not",
  "now",
  "round",
  "sin",
  "sinh",
  "sqrt",
  "tan",
  "tanh",
  "trim",
  "trunc",
  "type"
]);
var PATH_RESERVED = /* @__PURE__ */ new Set([
  "all",
  "item",
  "last",
  "position",
  "row"
]);
var POSITIONAL_SELECTOR_KEYWORDS = /* @__PURE__ */ new Set([
  "first",
  "last",
  "only",
  "odd",
  "even"
]);
function normalizeLabel(label) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "");
}
function identLower(token) {
  return token?.type === "ident" ? token.value.toLowerCase() : void 0;
}
function isIdent(token, value) {
  return identLower(token) === value.toLowerCase();
}
function dispatchReadableFunctionCall({
  name,
  explicitArity,
  separator,
  parenthesized
}) {
  const upper = name.toUpperCase();
  if (isRemovedStringWordOperator(name)) {
    throw new ReadableSyntaxError(removedStringOperatorMessage(upper));
  }
  const lower = name.toLowerCase();
  if (explicitArity !== void 0) {
    if (lower === "now" && parenthesized && explicitArity === 0) {
      return { name: "NOW", dialect: "excel" };
    }
    if (explicitArity === 0 && JQ_ZERO_ARG_CASE_FOLD_FILTERS.has(lower)) {
      return { name: lower, dialect: "jq" };
    }
    switch (lower) {
      case "match":
        if (explicitArity === 1) {
          return { name: "match", dialect: "jq" };
        }
        if (explicitArity === 2) {
          return separator === "semicolon" ? { name: "match", dialect: "jq" } : { name: "MATCH", dialect: "excel" };
        }
        if (explicitArity === 3) {
          return { name: "MATCH", dialect: "excel" };
        }
        break;
      case "index":
        if (explicitArity === 1) {
          return { name: "index", dialect: "jq" };
        }
        if (explicitArity === 2 || explicitArity === 3) {
          return { name: "INDEX", dialect: "excel" };
        }
        break;
      case "type":
        if (explicitArity === 1) {
          return { name: "TYPE", dialect: "excel" };
        }
        break;
      case "log":
        if (explicitArity === 1 || explicitArity === 2) {
          return { name: "LOG", dialect: "excel" };
        }
        break;
      case "trim":
        if (explicitArity === 1) {
          return { name: "TRIM", dialect: "excel" };
        }
        break;
      case "atan2":
        if (explicitArity === 1) {
          return { name: "atan2", dialect: "jq" };
        }
        if (explicitArity === 2) {
          return separator === "semicolon" ? { name: "atan2", dialect: "jq" } : { name: "ATAN2", dialect: "excel" };
        }
        break;
    }
  }
  if (FORMULA_FUNCTIONS.has(upper)) {
    return { name: upper, dialect: "excel" };
  }
  const validationName = canonicalValidationFunctionName(name, explicitArity);
  if (validationName) {
    return { name: validationName, dialect: "bxl-helper" };
  }
  if (LOWERCASE_BXL_HELPERS.has(lower) || lower === "all" || lower === "any") {
    return { name: lower, dialect: "bxl-helper" };
  }
  if (CASE_INSENSITIVE_JQ_FUNCTIONS.has(lower)) {
    return { name: lower, dialect: "jq" };
  }
  return { name, dialect: "unknown" };
}
function isCommaArgumentFunction(dispatch) {
  return dispatch.dialect === "excel" || dispatch.dialect === "bxl-helper";
}
function canonicalReadableBareFilterName(name) {
  const lower = name.toLowerCase();
  if (JQ_ZERO_ARG_CASE_FOLD_FILTERS.has(lower)) {
    return lower;
  }
  return name;
}
function formatFunctionCallSource(name, args) {
  const upper = name.toUpperCase();
  if (ARRAY_PACKED_VARIADIC_FORMULAS.has(upper) && args.length > 1) {
    return `${name}([${args.map((arg) => arg.source).join(", ")}])`;
  }
  const trailingArrayPrefix = TRAILING_ARRAY_PACKED_VARIADIC_FORMULAS.get(upper);
  if (trailingArrayPrefix !== void 0 && args.length > trailingArrayPrefix + 1) {
    const leading = args.slice(0, trailingArrayPrefix).map((arg) => arg.source);
    const trailing = `[${args.slice(trailingArrayPrefix).map((arg) => arg.source).join(", ")}]`;
    return `${name}(${[...leading, trailing].join("; ")})`;
  }
  return `${name}(${args.map((arg) => arg.source).join("; ")})`;
}
function canonicalTokenSource(token) {
  if (token.type === "ident") {
    const lower = token.value.toLowerCase();
    if (JQ_KEYWORDS.has(lower) || BXL_LITERALS.has(lower)) {
      return lower;
    }
    const bare = canonicalReadableBareFilterName(token.value);
    if (bare !== token.value) {
      return bare;
    }
  }
  return tokenSource(token);
}
function childScope(field) {
  if (field.kind === "array") {
    return field.item;
  }
  if (field.item) {
    return field.item;
  }
  if (field.fields) {
    return { fields: field.fields };
  }
  return void 0;
}
function itemScope(field) {
  if (field.kind === "array" || field.item) {
    return field.item ?? (field.fields ? { fields: field.fields } : void 0);
  }
  return void 0;
}
function resolveField(scope, label) {
  if (!scope) {
    return void 0;
  }
  const normalized = normalizeLabel(label);
  const candidates = scope.fields.filter((field2) => {
    const labels = [
      field2.displayName,
      field2.label,
      field2.key
    ].filter((entry) => Boolean(entry));
    return labels.some(
      (entry) => entry === label || normalizeLabel(entry) === normalized
    );
  });
  if (candidates.length > 1) {
    throw new ReadableSyntaxError(
      `Ambiguous readable label '${label}' in schema scope`
    );
  }
  const field = candidates[0];
  if (!field) {
    return void 0;
  }
  return {
    field,
    valueScope: childScope(field),
    arrayItemScope: itemScope(field)
  };
}
function pascalCaseToCamelKey(label) {
  if (label.type !== "ident")
    return null;
  if (!/^[A-Z][A-Za-z0-9]*$/.test(label.value))
    return null;
  if (!/[a-z]/.test(label.value))
    return null;
  const lower = label.value.toLowerCase();
  if (JQ_KEYWORDS.has(lower) || BXL_LITERALS.has(lower))
    return null;
  return label.value[0].toLowerCase() + label.value.slice(1);
}
function isIdentifierStart(char) {
  return /[A-Za-z_]/.test(char);
}
function isIdentifierChar5(char) {
  return /[A-Za-z0-9_]/.test(char);
}
function previousNonWhitespaceChar(source, index) {
  for (let cursor = index - 1; cursor >= 0; cursor--) {
    const value = source[cursor];
    if (!/\s/.test(value)) {
      return value;
    }
  }
  return void 0;
}
function previousNonWhitespaceChars(source, index, count) {
  const values = [];
  for (let cursor = index - 1; cursor >= 0 && values.length < count; cursor--) {
    const value = source[cursor];
    if (!/\s/.test(value)) {
      values.unshift(value);
    }
  }
  return values.join("");
}
function startsHashSelector(source, index) {
  const previous = previousNonWhitespaceChar(source, index);
  const previousTwo = previousNonWhitespaceChars(source, index, 2);
  if (previous !== "[" && previousTwo !== "..") {
    return false;
  }
  const next = source[index + 1] ?? "";
  if (/[0-9]/.test(next)) {
    return true;
  }
  if (next === "-" && /[0-9]/.test(source[index + 2] ?? "")) {
    return true;
  }
  if (!isIdentifierStart(next)) {
    return false;
  }
  let cursor = index + 1;
  let word = "";
  while (cursor < source.length && isIdentifierChar5(source[cursor])) {
    word += source[cursor++];
  }
  return POSITIONAL_SELECTOR_KEYWORDS.has(word.toLowerCase());
}
function tokenize(source) {
  const tokens = [];
  let index = 0;
  while (index < source.length) {
    const char = source[index];
    if (/\s/.test(char)) {
      index++;
      continue;
    }
    if (char === "#" && !startsHashSelector(source, index) && !/[0-9]/.test(source[index + 1] ?? "")) {
      while (index < source.length && source[index] !== "\n") {
        index++;
      }
      continue;
    }
    if (char === '"') {
      let value = "";
      const start = index;
      index++;
      while (index < source.length) {
        const current = source[index++];
        if (current === "\\") {
          const next = source[index++];
          if (next === void 0) {
            throw new ReadableSyntaxError("Unterminated string escape");
          }
          value += `\\${next}`;
        } else if (current === '"') {
          break;
        } else {
          value += current;
        }
      }
      let decoded;
      try {
        decoded = JSON.parse(`"${value}"`);
      } catch {
        decoded = value.replace(/\\n/g, "\n").replace(/\\t/g, "	").replace(/\\r/g, "\r").replace(/\\"/g, '"').replace(/\\\\/g, "\\");
      }
      tokens.push({
        type: "string",
        value: decoded,
        start,
        end: index,
        raw: source.slice(start, index)
      });
      continue;
    }
    if (/[0-9]/.test(char)) {
      let value = char;
      let hasDecimal = false;
      const start = index;
      index++;
      while (index < source.length) {
        const current = source[index];
        if (/[0-9]/.test(current)) {
          value += source[index++];
          continue;
        }
        if (current === "." && !hasDecimal && source[index + 1] !== ".") {
          hasDecimal = true;
          value += source[index++];
          continue;
        }
        break;
      }
      tokens.push({ type: "number", value, start, end: index, raw: value });
      continue;
    }
    if (char === "$" && isIdentifierStart(source[index + 1] ?? "")) {
      let value = "$";
      const start = index;
      index++;
      while (index < source.length && isIdentifierChar5(source[index])) {
        value += source[index++];
      }
      tokens.push({ type: "var", value, start, end: index, raw: value });
      continue;
    }
    if (char === "@" && isIdentifierStart(source[index + 1] ?? "")) {
      let value = "@";
      const start = index;
      index++;
      while (index < source.length && isIdentifierChar5(source[index])) {
        value += source[index++];
      }
      tokens.push({ type: "format", value, start, end: index, raw: value });
      continue;
    }
    if (isIdentifierStart(char)) {
      let value = char;
      const start = index;
      index++;
      while (index < source.length && isIdentifierChar5(source[index])) {
        value += source[index++];
      }
      tokens.push({ type: "ident", value, start, end: index, raw: value });
      continue;
    }
    const three = source.slice(index, index + 3);
    const two = source.slice(index, index + 2);
    if (["?//", "//=", "..."].includes(three)) {
      tokens.push({
        type: "op",
        value: three,
        start: index,
        end: index + 3,
        raw: three
      });
      index += 3;
      continue;
    }
    if (two === "<>") {
      tokens.push({
        type: "op",
        value: "!=",
        start: index,
        end: index + 2,
        raw: "<>"
      });
      index += 2;
      continue;
    }
    if ([
      "==",
      "!=",
      "<=",
      ">=",
      "+=",
      "-=",
      "*=",
      "/=",
      "%=",
      "//",
      "|=",
      "?//",
      "..",
      "?.",
      "^=",
      "$="
    ].includes(two)) {
      tokens.push({
        type: "op",
        value: two,
        start: index,
        end: index + 2,
        raw: two
      });
      index += 2;
      continue;
    }
    if ("()[]{}:;\\".includes(char)) {
      tokens.push({
        type: "punc",
        value: char,
        start: index,
        end: index + 1,
        raw: char
      });
      index++;
      continue;
    }
    if (".=!|+-*/%?<>,#^&".includes(char)) {
      tokens.push({
        type: "op",
        value: char,
        start: index,
        end: index + 1,
        raw: char
      });
      index++;
      continue;
    }
    throw new ReadableSyntaxError(
      `Cannot tokenize character '${char}' at position ${index}`
    );
  }
  return tokens;
}
function tokenizeReadableSyntax(source) {
  return tokenize(source);
}
function tokenSource(token) {
  if (token.type === "string") {
    if (token.raw && token.raw.includes("\\(")) {
      return token.raw;
    }
    return JSON.stringify(token.value);
  }
  return token.value;
}
function isWordLike(source) {
  return /^[A-Za-z_$@][A-Za-z0-9_$@]*$/.test(source);
}
function endsWithWordBoundary(source) {
  return /[A-Za-z0-9_$@\])]$/.test(source);
}
function startsWithWordBoundary(source) {
  return /^[A-Za-z_$@.0-9"]/.test(source);
}
function appendPart(parts, source) {
  if (!source) {
    return;
  }
  const previous = parts[parts.length - 1];
  if (previous && JQ_KEYWORDS.has(previous) && source && !/^[\s)\]},;]/.test(source)) {
    parts.push(" ");
  }
  if (previous && (previous.endsWith(";") || previous.endsWith(",")) && !source.startsWith(" ")) {
    parts.push(" ");
  }
  if (previous && (isWordLike(previous) || JQ_KEYWORDS.has(previous) || endsWithWordBoundary(previous)) && (isWordLike(source) || JQ_KEYWORDS.has(source) || startsWithWordBoundary(source))) {
    parts.push(" ");
  }
  parts.push(source);
}
function joinParts(parts) {
  const out = [];
  for (const part of parts) {
    appendPart(out, part);
  }
  return out.join("");
}
function hasUnclosedMaterializedArray(source) {
  const opens = [...source].filter((char) => char === "[").length;
  const closes = [...source].filter((char) => char === "]").length;
  return opens > closes;
}
function matchingClose(open) {
  switch (open) {
    case "(":
      return ")";
    case "[":
      return "]";
    case "{":
      return "}";
    default:
      throw new ReadableSyntaxError(`Unexpected opener '${open}'`);
  }
}
function findMatching(tokens, start) {
  const open = tokens[start];
  if (!open || open.type !== "punc") {
    throw new ReadableSyntaxError("Expected opening punctuation");
  }
  const close = matchingClose(open.value);
  let depth = 0;
  for (let i = start; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.type === "punc" && token.value === open.value) {
      depth++;
    } else if (token.type === "punc" && token.value === close) {
      depth--;
      if (depth === 0) {
        return i;
      }
    }
  }
  throw new ReadableSyntaxError(`Unclosed '${open.value}'`);
}
function splitTopLevel(tokens, start, end, separator) {
  const ranges = [];
  let depth = 0;
  let rangeStart = start;
  for (let i = start; i < end; i++) {
    const token = tokens[i];
    if (token.type === "punc" && ["(", "[", "{"].includes(token.value)) {
      depth++;
    } else if (token.type === "punc" && [")", "]", "}"].includes(token.value)) {
      depth--;
    } else if (depth === 0 && // Match the separator by value + structural type only. Never treat a
    // string or number literal whose content happens to equal the
    // separator (e.g. the string `","` inside `NUMBERVALUE(..., ",")`) as
    // a separator.
    ((token.type === "punc" || token.type === "op") && token.value === separator || token.type === "ident" && token.value.toLowerCase() === separator.toLowerCase())) {
      ranges.push([rangeStart, i]);
      rangeStart = i + 1;
    }
  }
  ranges.push([rangeStart, end]);
  return ranges;
}
function splitCallArguments(tokens, start, end, separator) {
  if (start === end) {
    return [];
  }
  return splitTopLevel(tokens, start, end, separator);
}
function callArgumentSeparator(commaRanges, semicolonRanges) {
  if (semicolonRanges.length > 1) {
    return "semicolon";
  }
  if (commaRanges.length > 1) {
    return "comma";
  }
  return "none";
}
function analyzeReadableFunctionCall(tokens, index) {
  const ident = tokens[index];
  const openToken = tokens[index + 1];
  if (ident?.type !== "ident" || openToken?.type !== "punc" || openToken.value !== "(") {
    return void 0;
  }
  const open = index + 1;
  let close;
  try {
    close = findMatching(tokens, open);
  } catch {
    return void 0;
  }
  const commaRanges = splitCallArguments(tokens, open + 1, close, ",");
  const semicolonRanges = splitCallArguments(tokens, open + 1, close, ";");
  const separator = callArgumentSeparator(commaRanges, semicolonRanges);
  const explicitArity = separator === "semicolon" ? semicolonRanges.length : separator === "comma" ? commaRanges.length : commaRanges.length;
  return {
    open,
    close,
    separator,
    explicitArity,
    commaRanges,
    semicolonRanges,
    dispatch: dispatchReadableFunctionCall({
      name: ident.value,
      explicitArity,
      separator,
      parenthesized: true
    })
  };
}
function parseSelectorRangeEndpoint(tokens, options = {}) {
  if (options.allowBareNumber && tokens.length === 1 && tokens[0].type === "number") {
    const oneBased = Number(tokens[0].value);
    if (!Number.isInteger(oneBased) || oneBased < 1) {
      throw new ReadableSyntaxError(
        `[${tokens[0].value}] must be a positive 1-based row number`
      );
    }
    return {
      family: "front",
      display: `#${tokens[0].value}`,
      oneBased
    };
  }
  if (tokens.length === 2 && tokens[0].value === "#" && tokens[1].type === "number") {
    const oneBased = Number(tokens[1].value);
    if (!Number.isInteger(oneBased) || oneBased < 1) {
      throw new ReadableSyntaxError(
        `[#${tokens[1].value}] must be a positive 1-based row number`
      );
    }
    return {
      family: "front",
      display: `#${tokens[1].value}`,
      oneBased
    };
  }
  if (tokens.length === 2 && tokens[0].value === "#" && tokens[1].type === "ident") {
    const keyword = tokens[1].value.toLowerCase();
    if (keyword === "first") {
      return {
        family: "front",
        display: "#first",
        oneBased: 1
      };
    }
    if (keyword === "last") {
      return {
        family: "back",
        display: "#last",
        offsetFromLast: 0
      };
    }
    return void 0;
  }
  if (tokens.length === 4 && tokens[0].value === "#" && tokens[1].type === "ident" && tokens[1].value.toLowerCase() === "last" && tokens[2].type === "op" && tokens[2].value === "-" && tokens[3].type === "number") {
    const offset = Number(tokens[3].value);
    if (!Number.isInteger(offset) || offset < 1) {
      throw new ReadableSyntaxError(
        `[#last-${tokens[3].value}] must subtract a positive whole number`
      );
    }
    return {
      family: "back",
      display: `#last-${tokens[3].value}`,
      offsetFromLast: offset
    };
  }
  return void 0;
}
function selectorRangeIsIncreasing(start, end) {
  if (start.family === "front" && end.family === "front") {
    return start.oneBased <= end.oneBased;
  }
  if (start.family === "front" && end.family === "back") {
    return true;
  }
  if (start.family === "back" && end.family === "back") {
    return start.offsetFromLast >= end.offsetFromLast;
  }
  return false;
}
function selectorEndpointIndexExpr(endpoint, lengthExpr) {
  if (endpoint.family === "front") {
    return `${endpoint.oneBased - 1}`;
  }
  return endpoint.offsetFromLast === 0 ? `(${lengthExpr} - 1)` : `(${lengthExpr} - ${endpoint.offsetFromLast + 1})`;
}
function selectorRangeStartExpr(endpoint, lengthExpr) {
  return selectorEndpointIndexExpr(endpoint, lengthExpr);
}
function selectorRangeEndExpr(endpoint, lengthExpr) {
  if (endpoint.family === "front") {
    return `${endpoint.oneBased}`;
  }
  return endpoint.offsetFromLast === 0 ? `${lengthExpr}` : `(${lengthExpr} - ${endpoint.offsetFromLast})`;
}
function parseSelectorUnionTerm(tokens) {
  const rangeParts = splitTopLevel(tokens, 0, tokens.length, "..");
  if (rangeParts.length === 1) {
    const endpoint = parseSelectorRangeEndpoint(tokens);
    if (!endpoint) {
      return void 0;
    }
    return {
      kind: "single",
      display: endpoint.display,
      indexExpr: selectorEndpointIndexExpr(endpoint, "$__len")
    };
  }
  if (rangeParts.length === 2) {
    const startEndpoint = parseSelectorRangeEndpoint(tokens.slice(...rangeParts[0]));
    const endEndpoint = parseSelectorRangeEndpoint(tokens.slice(...rangeParts[1]), {
      allowBareNumber: true
    });
    if (!startEndpoint || !endEndpoint) {
      return void 0;
    }
    if (!selectorRangeIsIncreasing(startEndpoint, endEndpoint)) {
      throw new ReadableSyntaxError(
        `[${startEndpoint.display}..${endEndpoint.display}] range must move forward in collection order`
      );
    }
    return {
      kind: "range",
      display: `${startEndpoint.display}..${endEndpoint.display}`,
      startExpr: selectorRangeStartExpr(startEndpoint, "$__len"),
      endExpr: selectorRangeEndExpr(endEndpoint, "$__len")
    };
  }
  return void 0;
}
function selectorUnionCondition(terms) {
  return terms.map(
    (term) => term.kind === "single" ? `$__idx == ${term.indexExpr}` : `($__idx >= ${term.startExpr} and $__idx < ${term.endExpr})`
  ).join(" or ");
}
function isSimpleHumanIndex(tokens) {
  return tokens.length >= 2 && ["row", "item"].includes(identLower(tokens[0]) ?? "") && tokens[1].type === "number";
}
function indexTextFromHumanIndex(tokens) {
  if (!isSimpleHumanIndex(tokens)) {
    return void 0;
  }
  const start = Number(tokens[1].value);
  if (!Number.isInteger(start) || start < 1) {
    throw new ReadableSyntaxError("Human row/item indices are 1-based");
  }
  if (tokens.length === 2) {
    return String(start - 1);
  }
  if (tokens.length === 4 && tokens[2].type === "op" && tokens[2].value === "..") {
    const end = Number(tokens[3].value);
    if (!Number.isInteger(end) || end < start) {
      throw new ReadableSyntaxError("Human row/item range must be increasing");
    }
    return `${start - 1}:${end}`;
  }
  return void 0;
}
function isLastCall(tokens) {
  return tokens.length >= 3 && isIdent(tokens[0], "last") && tokens[1].value === "(" && tokens[2].value === ")";
}
function isPredicateLike(tokens) {
  if (tokens.length === 0) {
    return false;
  }
  if (tokens[0].type === "ident" && PATH_RESERVED.has(tokens[0].value.toLowerCase()) && tokens[0].value.toLowerCase() !== "not") {
    return false;
  }
  return tokens.some(
    (token) => token.type === "ident" || ["=", "==", "!=", "<", "<=", ">", ">="].includes(token.value) || ["between", "in", "is", "like"].includes(token.value.toLowerCase())
  );
}
function hasExplicitCurrentItem(tokens) {
  return tokens.some(
    (token) => token.type === "op" && (token.value === "." || token.value === "?.")
  );
}
function compileValue(tokens, scope) {
  const compiler = new Compiler(tokens, { schema: scope });
  return compiler.compile(scope);
}
function compilePredicate(tokens, itemScope2) {
  const rangesOr = splitTopLevel(tokens, 0, tokens.length, "or");
  if (rangesOr.length > 1) {
    const parts = rangesOr.map(
      ([start, end]) => compilePredicate(tokens.slice(start, end), itemScope2)
    );
    return {
      source: parts.map((part) => `(${part.source})`).join(" or "),
      changed: parts.some((part) => part.changed),
      warnings: parts.flatMap((part) => part.warnings)
    };
  }
  const sqlConstruct = compileSqlPredicateConstruct(tokens, itemScope2);
  if (sqlConstruct) {
    return sqlConstruct;
  }
  const rangesAnd = splitTopLevel(tokens, 0, tokens.length, "and");
  if (rangesAnd.length > 1) {
    const parts = rangesAnd.map(
      ([start, end]) => compilePredicate(tokens.slice(start, end), itemScope2)
    );
    return {
      source: parts.map((part) => `(${part.source})`).join(" and "),
      changed: parts.some((part) => part.changed),
      warnings: parts.flatMap((part) => part.warnings)
    };
  }
  if (isIdent(tokens[0], "not")) {
    const inner = compilePredicate(tokens.slice(1), itemScope2);
    return {
      source: `(${inner.source}) | not`,
      changed: true,
      warnings: inner.warnings
    };
  }
  if (tokens[0]?.value === "(" && tokens[tokens.length - 1]?.value === ")") {
    const inner = compilePredicate(tokens.slice(1, -1), itemScope2);
    return {
      source: `(${inner.source})`,
      changed: inner.changed,
      warnings: inner.warnings
    };
  }
  const removedStringOp = tokens.find(
    (token) => REMOVED_STRING_OPERATOR_ALIASES.has(token.value) || token.type === "ident" && isRemovedStringWordOperator(token.value)
  );
  if (removedStringOp) {
    throw new ReadableSyntaxError(
      removedStringOperatorMessage(removedStringOp.value)
    );
  }
  const opIndex = tokens.findIndex(
    (token) => ["=", "==", "!=", "<", "<=", ">", ">="].includes(token.value) || token.value.toUpperCase() === "IN"
  );
  if (opIndex === -1) {
    const presence = compileValue(tokens, itemScope2);
    return {
      source: presence.source,
      changed: true,
      warnings: presence.warnings
    };
  }
  const left = compileValue(tokens.slice(0, opIndex), itemScope2);
  const op = tokens[opIndex].value.toUpperCase() === "IN" ? tokens[opIndex].value.toUpperCase() : tokens[opIndex].value;
  const right = compileValue(tokens.slice(opIndex + 1), itemScope2);
  const warnings = [...left.warnings, ...right.warnings];
  switch (op) {
    case "=":
      return {
        source: `${left.source} == ${right.source}`,
        changed: true,
        warnings
      };
    case "==":
    case "!=":
    case "<":
    case "<=":
    case ">":
    case ">=":
      return {
        source: `${left.source} ${op} ${right.source}`,
        changed: left.changed || right.changed,
        warnings
      };
    case "IN":
      return {
        source: `(${left.source} | IN(${right.source}))`,
        changed: true,
        warnings: [
          ...warnings,
          {
            code: "in-predicate-needs-helper",
            message: "Readable IN predicates compile to IN(value); add a native helper before using this in production."
          }
        ]
      };
    default:
      throw new ReadableSyntaxError(`Unsupported predicate operator '${op}'`);
  }
}
function compileSqlPredicateConstruct(tokens, itemScope2) {
  const isIndex = findTopLevelWord(tokens, "is");
  if (isIndex > 0) {
    const notIndex = isIdent(tokens[isIndex + 1], "not") ? isIndex + 1 : -1;
    const literalIndex = notIndex === -1 ? isIndex + 1 : isIndex + 2;
    const literal = sqlIsLiteral(tokens[literalIndex]);
    if (literal && literalIndex === tokens.length - 1) {
      const left = compileValue(tokens.slice(0, isIndex), itemScope2);
      const op = notIndex === -1 ? "==" : "!=";
      return {
        source: `${left.source} ${op} ${literal}`,
        changed: true,
        warnings: left.warnings
      };
    }
  }
  const betweenIndex = findTopLevelWord(tokens, "between");
  if (betweenIndex > 0) {
    const notIndex = isIdent(tokens[betweenIndex - 1], "not") ? betweenIndex - 1 : -1;
    const leftEnd = notIndex === -1 ? betweenIndex : notIndex;
    const andIndex = findTopLevelWord(tokens, "and", betweenIndex + 1);
    if (andIndex > betweenIndex + 1 && andIndex < tokens.length - 1) {
      const left = compileValue(tokens.slice(0, leftEnd), itemScope2);
      const lower = compileValue(tokens.slice(betweenIndex + 1, andIndex), itemScope2);
      const upper = compileValue(tokens.slice(andIndex + 1), itemScope2);
      const source = `between(${left.source}; ${lower.source}; ${upper.source})`;
      return {
        source: notIndex === -1 ? source : `(${source} | not)`,
        changed: true,
        warnings: [...left.warnings, ...lower.warnings, ...upper.warnings]
      };
    }
  }
  const likeIndex = findTopLevelWord(tokens, "like");
  if (likeIndex > 0) {
    const notIndex = isIdent(tokens[likeIndex - 1], "not") ? likeIndex - 1 : -1;
    const leftEnd = notIndex === -1 ? likeIndex : notIndex;
    const left = compileValue(tokens.slice(0, leftEnd), itemScope2);
    const pattern = compileValue(tokens.slice(likeIndex + 1), itemScope2);
    const source = `like(${left.source}; ${pattern.source})`;
    return {
      source: notIndex === -1 ? source : `(${source} | not)`,
      changed: true,
      warnings: [...left.warnings, ...pattern.warnings]
    };
  }
  const inIndex = findTopLevelWord(tokens, "in");
  if (inIndex > 0 && isIdent(tokens[inIndex - 1], "not")) {
    const left = compileValue(tokens.slice(0, inIndex - 1), itemScope2);
    const right = compileValue(tokens.slice(inIndex + 1), itemScope2);
    return {
      source: `((${left.source} | IN(${right.source})) | not)`,
      changed: true,
      warnings: [
        ...left.warnings,
        ...right.warnings,
        {
          code: "in-predicate-needs-helper",
          message: "Readable IN predicates compile to IN(value); add a native helper before using this in production."
        }
      ]
    };
  }
  return void 0;
}
function findTopLevelWord(tokens, word, start = 0) {
  let depth = 0;
  for (let i = start; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.type === "punc") {
      if (token.value === "(" || token.value === "[" || token.value === "{") {
        depth++;
      } else if (token.value === ")" || token.value === "]" || token.value === "}") {
        depth--;
      }
      continue;
    }
    if (depth === 0 && isIdent(token, word)) {
      return i;
    }
  }
  return -1;
}
function sqlIsLiteral(token) {
  if (!token || token.type !== "ident") {
    return void 0;
  }
  const lower = token.value.toLowerCase();
  if (lower === "null" || lower === "true" || lower === "false") {
    return lower;
  }
  return void 0;
}
var Compiler = class _Compiler {
  constructor(tokens, options, start = 0, end = tokens.length) {
    this.tokens = tokens;
    this.index = start;
    this.end = end;
    this.schema = options.schema;
    this.rootPathPrefix = options.rootPathPrefix;
    this.constructorItemScope = options.itemScope;
    this.bindings = new Set(options.bindings ?? []);
  }
  index = 0;
  end;
  schema;
  rootPathPrefix;
  // The `.` scope at the start of this Compiler. Distinct from `scope`
  // (which is the root for bare-ident lookup). Gets mutated during a
  // pipeline: after `|`, `.` points at the prior stream's element scope.
  constructorItemScope;
  bindings;
  compile(scope = this.schema) {
    const parts = [];
    const warnings = [];
    let changed = false;
    let streamItemScope;
    let needsRootBinding = false;
    let readableRootPrefix = this.rootPathPrefix;
    let itemScope2 = this.constructorItemScope ?? scope;
    while (this.index < this.end) {
      const token = this.tokens[this.index];
      if (token.type === "op" && token.value === "|") {
        appendPart(parts, "|");
        this.index++;
        if (this.schema) {
          readableRootPrefix = "$root";
        }
        if (streamItemScope) {
          itemScope2 = streamItemScope;
          streamItemScope = void 0;
        }
        continue;
      }
      if (isIdent(token, "not")) {
        const nextTok = this.tokens[this.index + 1];
        if (nextTok?.type === "punc" && nextTok.value === "(") {
          const open = this.index + 1;
          const close = findMatching(this.tokens, open);
          const inner = new _Compiler(
            this.tokens,
            {
              schema: this.schema,
              rootPathPrefix: readableRootPrefix,
              itemScope: itemScope2,
              bindings: this.bindings
            },
            open + 1,
            close
          ).compile(scope);
          appendPart(parts, `((${inner.source}) | not)`);
          warnings.push(...inner.warnings);
          needsRootBinding = needsRootBinding || Boolean(inner.needsRootBinding);
          changed = true;
          this.index = close + 1;
          continue;
        }
        if (nextTok?.type === "ident" && this.tokens[this.index + 2]?.type === "punc" && this.tokens[this.index + 2]?.value === "(") {
          this.index++;
          const fn = this.compileFunctionCall(scope, readableRootPrefix, itemScope2);
          appendPart(parts, `((${fn.source}) | not)`);
          warnings.push(...fn.warnings);
          needsRootBinding = needsRootBinding || Boolean(fn.needsRootBinding);
          streamItemScope = fn.streamItemScope ?? streamItemScope;
          changed = true;
          continue;
        }
        if (nextTok?.type === "ident" || nextTok?.value === ".") {
          this.index++;
          const path2 = this.tryCompilePath(scope, readableRootPrefix, itemScope2);
          if (path2) {
            appendPart(parts, `((${path2.source}) | not)`);
            warnings.push(...path2.warnings);
            needsRootBinding = needsRootBinding || Boolean(path2.needsRootBinding);
            streamItemScope = path2.streamItemScope ?? streamItemScope;
            changed = true;
            continue;
          }
          this.index--;
        }
      }
      if (token.type === "ident" && this.tokens[this.index + 1]?.type === "punc" && this.tokens[this.index + 1]?.value === "(" && // jq control keywords (`if`, `try`, `reduce`, `foreach`, etc.) are
      // sometimes followed by a parenthesized sub-expression — for
      // example `if (.x // 0) == 0 then …`. Without this guard the
      // function-call branch would treat `if` as the Excel `IF()`
      // formula and corrupt the source. The check is case-sensitive
      // because Excel formulas are conventionally uppercase (`IF(...)`,
      // `IFS(...)`) while jq keywords are lowercase: `IF` should still
      // dispatch to the formula branch, only `if` is a jq control
      // keyword.
      !JQ_KEYWORDS.has(token.value) && !(["and", "or"].includes(token.value.toLowerCase()) && parts.length > 0) && !resolveField(scope, token.value) && !resolveField(itemScope2, token.value)) {
        const fn = this.compileFunctionCall(scope, readableRootPrefix, itemScope2);
        appendPart(parts, fn.source);
        warnings.push(...fn.warnings);
        changed = changed || fn.changed;
        needsRootBinding = needsRootBinding || Boolean(fn.needsRootBinding);
        streamItemScope = fn.streamItemScope ?? streamItemScope;
        continue;
      }
      const path = this.tryCompilePath(scope, readableRootPrefix, itemScope2);
      if (path) {
        appendPart(parts, path.source);
        warnings.push(...path.warnings);
        changed = changed || path.changed;
        needsRootBinding = needsRootBinding || Boolean(path.needsRootBinding);
        streamItemScope = path.streamItemScope ?? streamItemScope;
        continue;
      }
      if (token.type === "punc" && token.value === "(") {
        const close = findMatching(this.tokens, this.index);
        const inner = new _Compiler(
          this.tokens,
          {
            schema: this.schema,
            rootPathPrefix: readableRootPrefix,
            itemScope: itemScope2,
            bindings: this.bindings
          },
          this.index + 1,
          close
        ).compile(scope);
        appendPart(parts, `(${inner.source})`);
        warnings.push(...inner.warnings);
        changed = changed || inner.changed;
        needsRootBinding = needsRootBinding || Boolean(inner.needsRootBinding);
        this.index = close + 1;
        continue;
      }
      if (token.type === "punc" && token.value === "[") {
        const close = findMatching(this.tokens, this.index);
        const inner = new _Compiler(
          this.tokens,
          {
            schema: this.schema,
            rootPathPrefix: readableRootPrefix,
            itemScope: itemScope2,
            bindings: this.bindings
          },
          this.index + 1,
          close
        ).compile(scope);
        appendPart(parts, `[${inner.source}]`);
        warnings.push(...inner.warnings);
        changed = changed || inner.changed;
        needsRootBinding = needsRootBinding || Boolean(inner.needsRootBinding);
        this.index = close + 1;
        continue;
      }
      if (token.type === "punc" && token.value === "{") {
        const object = this.compileObject(scope, readableRootPrefix, itemScope2);
        appendPart(parts, object.source);
        warnings.push(...object.warnings);
        changed = changed || object.changed;
        needsRootBinding = needsRootBinding || Boolean(object.needsRootBinding);
        continue;
      }
      appendPart(parts, canonicalTokenSource(token));
      this.index++;
    }
    return {
      source: joinParts(parts),
      changed,
      warnings,
      streamItemScope,
      needsRootBinding
    };
  }
  compileObject(scope, rootPathPrefix, itemScope2) {
    const close = findMatching(this.tokens, this.index);
    const ranges = splitTopLevel(this.tokens, this.index + 1, close, ",");
    const entries = [];
    const warnings = [];
    let changed = false;
    let needsRootBinding = false;
    for (const [start, end] of ranges) {
      if (start === end) {
        continue;
      }
      const colon = this.findTopLevelToken(start, end, ":");
      if (colon === -1) {
        entries.push(
          this.tokens.slice(start, end).map(tokenSource).join("")
        );
        continue;
      }
      const key = this.tokens.slice(start, colon).map(tokenSource).join("");
      const value = new _Compiler(
        this.tokens,
        { schema: this.schema, rootPathPrefix, itemScope: itemScope2, bindings: this.bindings },
        colon + 1,
        end
      ).compile(scope);
      entries.push(`${key}:${value.source}`);
      warnings.push(...value.warnings);
      changed = changed || value.changed;
      needsRootBinding = needsRootBinding || Boolean(value.needsRootBinding);
    }
    this.index = close + 1;
    return {
      source: `{${entries.join(", ")}}`,
      changed,
      warnings,
      needsRootBinding
    };
  }
  findTopLevelToken(start, end, value) {
    let depth = 0;
    for (let i = start; i < end; i++) {
      const token = this.tokens[i];
      if (token.type === "punc" && ["(", "[", "{"].includes(token.value)) {
        depth++;
      } else if (token.type === "punc" && [")", "]", "}"].includes(token.value)) {
        depth--;
      } else if (depth === 0 && token.value === value) {
        return i;
      }
    }
    return -1;
  }
  compileFunctionCall(scope, rootPathPrefix, itemScope2) {
    const originalName = this.tokens[this.index].value;
    const analysis = analyzeReadableFunctionCall(this.tokens, this.index);
    if (!analysis) {
      throw new ReadableSyntaxError("Expected function call");
    }
    const name = analysis.dispatch.name;
    const close = analysis.close;
    const useCommaArgs = analysis.separator !== "semicolon" && isCommaArgumentFunction(analysis.dispatch);
    const ranges = useCommaArgs ? analysis.commaRanges : analysis.semicolonRanges;
    if (name === "LET") {
      const compiledLet = this.compileLetFunction(
        ranges,
        scope,
        rootPathPrefix,
        itemScope2
      );
      this.index = close + 1;
      return compiledLet;
    }
    const args = ranges.map(
      ([start, end]) => new _Compiler(
        this.tokens,
        { schema: this.schema, rootPathPrefix, itemScope: itemScope2, bindings: this.bindings },
        start,
        end
      ).compile(scope)
    );
    if (["all", "any"].includes(name) && args.length === 2 && args[0].streamItemScope) {
      const conditionRange = ranges[1];
      args[1] = compilePredicate(
        this.tokens.slice(conditionRange[0], conditionRange[1]),
        args[0].streamItemScope
      );
    }
    this.index = close + 1;
    const source = formatFunctionCallSource(name, args);
    return {
      source,
      changed: originalName !== name || useCommaArgs || source !== `${name}(${args.map((arg) => arg.source).join("; ")})` || args.some((arg) => arg.changed),
      warnings: args.flatMap((arg) => arg.warnings),
      streamItemScope: args[0]?.streamItemScope,
      needsRootBinding: args.some((arg) => arg.needsRootBinding)
    };
  }
  compileLetFunction(ranges, scope, rootPathPrefix, itemScope2) {
    if (ranges.length < 3 || ranges.length % 2 === 0) {
      throw new ReadableSyntaxError(
        "LET expects one or more name/value pairs followed by a final expression."
      );
    }
    const warnings = [];
    const nextBindings = new Set(this.bindings);
    const compiledBindings = [];
    let needsRootBinding = false;
    for (let index = 0; index < ranges.length - 1; index += 2) {
      const name = this.letBindingName(ranges[index]);
      const valueRange = ranges[index + 1];
      const value = new _Compiler(
        this.tokens,
        {
          schema: this.schema,
          rootPathPrefix,
          itemScope: itemScope2,
          bindings: nextBindings
        },
        valueRange[0],
        valueRange[1]
      ).compile(scope);
      compiledBindings.push({ name, value });
      warnings.push(...value.warnings);
      needsRootBinding = needsRootBinding || Boolean(value.needsRootBinding);
      nextBindings.add(name);
    }
    const bodyRange = ranges[ranges.length - 1];
    const body = new _Compiler(
      this.tokens,
      {
        schema: this.schema,
        rootPathPrefix,
        itemScope: itemScope2,
        bindings: nextBindings
      },
      bodyRange[0],
      bodyRange[1]
    ).compile(scope);
    warnings.push(...body.warnings);
    needsRootBinding = needsRootBinding || Boolean(body.needsRootBinding);
    let source = body.source;
    for (const binding of [...compiledBindings].reverse()) {
      source = `(${binding.value.source}) as $${binding.name} | ${source}`;
    }
    return {
      source,
      changed: true,
      warnings,
      streamItemScope: body.streamItemScope,
      needsRootBinding
    };
  }
  letBindingName(range2) {
    const tokens = this.tokens.slice(range2[0], range2[1]);
    if (tokens.length !== 1 || tokens[0].type !== "ident" || JQ_KEYWORDS.has(tokens[0].value.toLowerCase()) || BXL_LITERALS.has(tokens[0].value.toLowerCase())) {
      throw new ReadableSyntaxError(
        "LET binding names must be bare identifiers."
      );
    }
    return tokens[0].value;
  }
  tryCompilePath(scope, rootPathPrefix, itemScope2) {
    const start = this.index;
    const first = this.tokens[this.index];
    let out = "";
    let changed = false;
    const warnings = [];
    let valueScope;
    let arrayItemScope;
    let streamItemScope;
    let materialized = false;
    let needsRootBinding = false;
    let pendingImplicitArray = false;
    const dotScope = itemScope2 ?? scope;
    const allowPascalFallback = !scope;
    if (first?.type === "op" && first.value === ".") {
      out = ".";
      this.index++;
      const label = this.readLabelToken(dotScope);
      if (label) {
        const resolved = resolveField(dotScope, label.value);
        const fallbackKey = !resolved && allowPascalFallback ? pascalCaseToCamelKey(label) : null;
        out += resolved?.field.key ?? fallbackKey ?? label.value;
        valueScope = resolved?.valueScope;
        arrayItemScope = resolved?.arrayItemScope;
        pendingImplicitArray = Boolean(resolved?.field.kind === "array");
        changed = changed || Boolean(resolved && resolved.field.key !== label.value) || Boolean(fallbackKey);
      }
    } else if (first?.type === "op" && first.value === "?.") {
      out = ".";
      this.index++;
      const label = this.readLabelToken(dotScope);
      if (!label) {
        this.index = start;
        return null;
      }
      const resolved = resolveField(dotScope, label.value);
      const fallbackKey = !resolved && allowPascalFallback ? pascalCaseToCamelKey(label) : null;
      out += `${resolved?.field.key ?? fallbackKey ?? label.value}?`;
      valueScope = resolved?.valueScope;
      arrayItemScope = resolved?.arrayItemScope;
      pendingImplicitArray = Boolean(resolved?.field.kind === "array");
      changed = true;
    } else if (first?.type === "ident" && this.bindings.has(first.value)) {
      out = `$${first.value}`;
      this.index++;
      changed = true;
    } else {
      const label = this.readLabelToken(scope);
      if (!label || this.tokens[this.index]?.value === "(") {
        this.index = start;
        return null;
      }
      const resolved = resolveField(scope, label.value);
      const fallbackKey = !resolved && allowPascalFallback ? pascalCaseToCamelKey(label) : null;
      if (!resolved && !fallbackKey) {
        this.index = start;
        return null;
      }
      const key = resolved?.field.key ?? fallbackKey;
      out = rootPathPrefix ? `${rootPathPrefix}.${key}` : `.${key}`;
      valueScope = resolved?.valueScope;
      arrayItemScope = resolved?.arrayItemScope;
      pendingImplicitArray = resolved?.field.kind === "array";
      changed = true;
    }
    while (this.index < this.end) {
      const token = this.tokens[this.index];
      if (token.type === "op" && token.value === "?") {
        out += "?";
        changed = true;
        this.index++;
        continue;
      }
      if (token.type === "op" && (token.value === "." || token.value === "?.")) {
        const optional = token.value === "?.";
        if (pendingImplicitArray && !materialized) {
          out = `[${out}[]`;
          materialized = true;
          changed = true;
          pendingImplicitArray = false;
        }
        this.index++;
        const label = this.readLabelToken(valueScope);
        if (!label) {
          this.index = start;
          return null;
        }
        const resolved = resolveField(valueScope, label.value);
        const fallbackKey = !resolved && allowPascalFallback ? pascalCaseToCamelKey(label) : null;
        out += `${optional ? "?" : ""}.${resolved?.field.key ?? fallbackKey ?? label.value}`;
        valueScope = resolved?.valueScope;
        arrayItemScope = resolved?.arrayItemScope;
        pendingImplicitArray = Boolean(resolved?.field.kind === "array");
        changed = changed || optional || Boolean(resolved && resolved.field.key !== label.value);
        continue;
      }
      if (token.type === "punc" && token.value === "[") {
        const suffix = this.compileIndexSuffix(
          out,
          valueScope,
          arrayItemScope,
          materialized,
          rootPathPrefix
        );
        out = suffix.source;
        changed = changed || suffix.changed;
        warnings.push(...suffix.warnings);
        needsRootBinding = needsRootBinding || Boolean(suffix.needsRootBinding);
        valueScope = suffix.valueScope;
        arrayItemScope = suffix.arrayItemScope;
        streamItemScope = suffix.streamItemScope ?? streamItemScope;
        materialized = suffix.openMaterialized ?? materialized;
        pendingImplicitArray = false;
        continue;
      }
      if (token.type === "punc" && token.value === ":") {
        throw new ReadableSyntaxError(
          "CSS-style pseudo-class syntax was removed; use [#first], [#last], [#last-N], [#only], [#odd], [#even], [#N], or [#-N]."
        );
      }
      break;
    }
    if (materialized && hasUnclosedMaterializedArray(out)) {
      out += "]";
    }
    return {
      source: out,
      changed,
      warnings,
      next: this.index,
      valueScope,
      arrayItemScope,
      streamItemScope,
      needsRootBinding: needsRootBinding || Boolean(rootPathPrefix && out.includes(rootPathPrefix))
    };
  }
  readLabelToken(scope) {
    const token = this.tokens[this.index];
    if (!token || !["ident", "string"].includes(token.type)) {
      return void 0;
    }
    if (token.type === "ident") {
      let best;
      const parts = [];
      for (let i = this.index; i < this.end; i++) {
        const current = this.tokens[i];
        if (current.type !== "ident") {
          break;
        }
        const lower = current.value.toLowerCase();
        if (i > this.index && (JQ_KEYWORDS.has(lower) || BXL_LITERALS.has(lower))) {
          break;
        }
        parts.push(current.value);
        const phrase = parts.join(" ");
        if (scope && resolveField(scope, phrase)) {
          best = { value: phrase, next: i + 1 };
        }
      }
      if (best) {
        this.index = best.next;
        return { type: "ident", value: best.value };
      }
    }
    this.index++;
    return token;
  }
  compileIndexSuffix(base, currentScope, currentItemScope, materialized, rootPathPrefix) {
    const open = this.index;
    const close = findMatching(this.tokens, open);
    const inner = this.tokens.slice(open + 1, close);
    this.index = close + 1;
    const item = currentItemScope ?? currentScope;
    if (inner.length === 0) {
      return {
        source: `${base}[]`,
        changed: false,
        warnings: [],
        next: this.index,
        valueScope: item,
        streamItemScope: item
      };
    }
    if (inner.length === 1 && (isIdent(inner[0], "all") || inner[0].value === "...")) {
      return {
        source: `[${base}[]`,
        changed: true,
        warnings: [],
        next: this.index,
        valueScope: item,
        streamItemScope: item,
        openMaterialized: true
      };
    }
    if (inner[0]?.type === "op" && inner[0].value === "*" && item) {
      const predTokens = inner.slice(1);
      if (predTokens.length === 0) {
        return {
          source: `[${base}[]`,
          changed: true,
          warnings: [],
          next: this.index,
          valueScope: item,
          arrayItemScope: item,
          streamItemScope: item,
          openMaterialized: true
        };
      }
      if (!hasExplicitCurrentItem(predTokens)) {
        throw new ReadableSyntaxError(
          'Filter-all [* ...] predicates must use explicit current-item paths such as [* .Field] or [* ."Display Label"].'
        );
      }
      const predicate = compilePredicate(predTokens, item);
      return {
        source: `[${base}[] | select(${predicate.source})`,
        changed: true,
        warnings: predicate.warnings,
        next: this.index,
        valueScope: item,
        arrayItemScope: item,
        streamItemScope: item,
        openMaterialized: true
      };
    }
    const selectorTerms = splitTopLevel(inner, 0, inner.length, ",");
    if (selectorTerms.length > 1) {
      const parsedTerms = selectorTerms.map(
        ([start, end]) => parseSelectorUnionTerm(inner.slice(start, end))
      );
      if (parsedTerms.every((term) => Boolean(term))) {
        const closedBase = hasUnclosedMaterializedArray(base) ? `${base}]` : base;
        return {
          source: `[(${closedBase}) as $__seq | ($__seq | length) as $__len | range(0; $__len) as $__idx | select(${selectorUnionCondition(parsedTerms)}) | $__seq[$__idx]`,
          changed: true,
          warnings: [],
          next: this.index,
          valueScope: item,
          arrayItemScope: item,
          streamItemScope: item,
          openMaterialized: true
        };
      }
    }
    if (inner.length === 4 && inner[0].value === "#" && inner[1].type === "ident" && inner[1].value.toLowerCase() === "last" && inner[2].type === "op" && inner[2].value === "-" && inner[3].type === "number") {
      const offset = Number(inner[3].value);
      if (!Number.isInteger(offset) || offset < 1) {
        throw new ReadableSyntaxError(
          `[#last-${inner[3].value}] must subtract a positive whole number`
        );
      }
      return {
        source: `${base}[-${offset + 1}]`,
        changed: true,
        warnings: [],
        next: this.index,
        valueScope: item
      };
    }
    if (inner.length === 2 && inner[0].value === "#" && inner[1].type === "ident") {
      const keyword = inner[1].value.toLowerCase();
      const closedBase = hasUnclosedMaterializedArray(base) ? `${base}]` : base;
      if (keyword === "first") {
        return {
          source: `${base}[0]`,
          changed: true,
          warnings: [],
          next: this.index,
          valueScope: item
        };
      }
      if (keyword === "last") {
        return {
          source: `${base}[-1]`,
          changed: true,
          warnings: [],
          next: this.index,
          valueScope: item
        };
      }
      if (keyword === "only") {
        return {
          source: `((${closedBase}) as $__seq | ($__seq | length) as $__len | if $__len == 1 then $__seq[0] else error("expected exactly 1 element, got \\($__len)") end)`,
          changed: true,
          warnings: [],
          next: this.index,
          valueScope: item
        };
      }
      if (keyword === "odd" || keyword === "even") {
        const start = keyword === "odd" ? 0 : 1;
        return {
          source: `[${closedBase} | .[range(${start}; length; 2)]`,
          changed: true,
          warnings: [],
          next: this.index,
          valueScope: item,
          arrayItemScope: item,
          streamItemScope: item,
          openMaterialized: true
        };
      }
      throw new ReadableSyntaxError(
        `Unsupported positional selector keyword '#${inner[1].value}'`
      );
    }
    if (inner.length === 3 && inner[0].value === "#" && inner[1].type === "op" && inner[1].value === "-" && inner[2].type === "number") {
      const fromEnd = Number(inner[2].value);
      if (!Number.isInteger(fromEnd) || fromEnd < 1) {
        throw new ReadableSyntaxError(
          `[#-${inner[2].value}] must be a negative index with a positive magnitude`
        );
      }
      return {
        source: `${base}[-${fromEnd}]`,
        changed: true,
        warnings: [],
        next: this.index,
        valueScope: item
      };
    }
    if (inner.length === 2 && inner[0].value === "#" && inner[1].type === "number") {
      const oneBased = Number(inner[1].value);
      if (!Number.isInteger(oneBased) || oneBased < 1) {
        throw new ReadableSyntaxError(
          `[#${inner[1].value}] must be a positive 1-based row number`
        );
      }
      return {
        source: `${base}[${oneBased - 1}]`,
        changed: true,
        warnings: [],
        next: this.index,
        valueScope: item
      };
    }
    const rangeParts = splitTopLevel(inner, 0, inner.length, "..");
    if (rangeParts.length === 2) {
      const startEndpoint = parseSelectorRangeEndpoint(inner.slice(...rangeParts[0]));
      const endEndpoint = parseSelectorRangeEndpoint(inner.slice(...rangeParts[1]), {
        allowBareNumber: true
      });
      if (startEndpoint && endEndpoint) {
        if (!selectorRangeIsIncreasing(startEndpoint, endEndpoint)) {
          throw new ReadableSyntaxError(
            `[${startEndpoint.display}..${endEndpoint.display}] range must move forward in collection order`
          );
        }
        if (startEndpoint.family === "front" && endEndpoint.family === "front") {
          return {
            source: `[${base}[${startEndpoint.oneBased - 1}:${endEndpoint.oneBased}][]`,
            changed: true,
            warnings: [],
            next: this.index,
            valueScope: item,
            arrayItemScope: item,
            streamItemScope: item,
            openMaterialized: true
          };
        }
        const closedBase = hasUnclosedMaterializedArray(base) ? `${base}]` : base;
        const seqVar = "$__seq";
        const lengthExpr = `(${seqVar} | length)`;
        return {
          source: `[(${closedBase}) as ${seqVar} | ${seqVar}[${selectorRangeStartExpr(startEndpoint, lengthExpr)}:${selectorRangeEndExpr(endEndpoint, lengthExpr)}][]`,
          changed: true,
          warnings: [],
          next: this.index,
          valueScope: item,
          arrayItemScope: item,
          streamItemScope: item,
          openMaterialized: true
        };
      }
    }
    const commaRanges = splitTopLevel(inner, 0, inner.length, ",");
    if (commaRanges.length === 2 && isSimpleHumanIndex(inner.slice(...commaRanges[0]))) {
      const indexText = indexTextFromHumanIndex(inner.slice(...commaRanges[0]));
      const predicate = compilePredicate(inner.slice(...commaRanges[1]), item);
      return {
        source: `(${base}[${indexText}] | select(${predicate.source}))`,
        changed: true,
        warnings: predicate.warnings,
        next: this.index,
        valueScope: item
      };
    }
    const humanIndex = indexTextFromHumanIndex(inner);
    if (humanIndex !== void 0) {
      if (humanIndex.includes(":")) {
        return {
          source: `[${base}[${humanIndex}][]`,
          changed: true,
          warnings: [],
          next: this.index,
          valueScope: item,
          arrayItemScope: item,
          streamItemScope: item,
          openMaterialized: true
        };
      }
      return {
        source: `${base}[${humanIndex}]`,
        changed: true,
        warnings: [],
        next: this.index,
        valueScope: item,
        arrayItemScope: currentItemScope
      };
    }
    if (isLastCall(inner)) {
      let indexText = "-1";
      if (inner.length === 5 && inner[3].value === "-" && inner[4].type === "number") {
        indexText = `-${Number(inner[4].value) + 1}`;
      }
      return {
        source: `${base}[${indexText}]`,
        changed: true,
        warnings: [],
        next: this.index,
        valueScope: item
      };
    }
    if (isPredicateLike(inner) && item) {
      const predicate = compilePredicate(inner, item);
      return {
        source: `first(${base}[] | select(${predicate.source}))`,
        changed: true,
        warnings: predicate.warnings,
        next: this.index,
        valueScope: item
      };
    }
    if (splitTopLevel(inner, 0, inner.length, ":").length === 2) {
      const compiled2 = new _Compiler(inner, {
        schema: this.schema,
        rootPathPrefix,
        bindings: this.bindings
      }).compile(currentScope);
      return {
        source: `[${base}[${compiled2.source}][]`,
        changed: compiled2.changed,
        warnings: compiled2.warnings,
        next: this.index,
        valueScope: item,
        arrayItemScope: item,
        streamItemScope: item,
        openMaterialized: true,
        needsRootBinding: compiled2.needsRootBinding
      };
    }
    const compiled = new _Compiler(inner, {
      schema: this.schema,
      rootPathPrefix,
      bindings: this.bindings
    }).compile(currentScope);
    return {
      source: `${base}[${compiled.source}]`,
      changed: compiled.changed,
      warnings: compiled.warnings,
      next: this.index,
      valueScope: item,
      arrayItemScope: materialized ? currentItemScope : void 0,
      needsRootBinding: compiled.needsRootBinding
    };
  }
};
function stripExcelCellPrefix(source) {
  const match = source.match(/^(\s*)=(?!=)/);
  if (!match) {
    return { source, changed: false };
  }
  return { source: match[1] + source.slice(match[0].length), changed: true };
}
function rewriteWordBinaryOperators(source) {
  let current = source;
  let guard = 0;
  while (guard++ < 1024) {
    const tokens = tokenizeQuietly(current);
    if (!tokens)
      break;
    let rewroteThisPass = false;
    const depthAt = predicateBracketDepths(tokens);
    for (let i = tokens.length - 1; i >= 0; i--) {
      const tok = tokens[i];
      if (tok.type !== "ident")
        continue;
      if (depthAt[i] > 0)
        continue;
      const next = tokens[i + 1];
      const isCall = next && next.type === "punc" && next.value === "(" && next.start === tok.end;
      if (isRemovedStringWordOperator(tok.value)) {
        if (isCall || excelOperandExtent(tokens, i, -1) && excelOperandExtent(tokens, i, 1)) {
          throw new ReadableSyntaxError(removedStringOperatorMessage(tok.value));
        }
        continue;
      }
      if (isIdent(tok, "is")) {
        const left2 = excelOperandExtent(tokens, i, -1);
        const notIndex2 = isIdent(tokens[i + 1], "not") ? i + 1 : -1;
        const literalIndex = notIndex2 === -1 ? i + 1 : i + 2;
        const literal = sqlIsLiteral(tokens[literalIndex]);
        const literalToken = tokens[literalIndex];
        if (left2 && literal && literalToken?.end !== void 0) {
          const leftSource2 = current.slice(left2.start, left2.end);
          current = current.slice(0, left2.start) + `${leftSource2} ${notIndex2 === -1 ? "==" : "!="} ${literal}` + current.slice(literalToken.end);
          rewroteThisPass = true;
          break;
        }
      }
      if (isIdent(tok, "between")) {
        const notIndex2 = isIdent(tokens[i - 1], "not") ? i - 1 : -1;
        const left2 = excelOperandExtent(tokens, notIndex2 === -1 ? i : notIndex2, -1);
        const lower = excelOperandExtent(tokens, i, 1);
        const andIndex = findTopLevelWord(tokens, "and", i + 1);
        const upper = andIndex === -1 ? void 0 : excelOperandExtent(tokens, andIndex, 1);
        if (left2 && lower && upper && andIndex > i) {
          const leftSource2 = current.slice(left2.start, left2.end);
          const lowerSource = current.slice(lower.start, lower.end);
          const upperSource = current.slice(upper.start, upper.end);
          const source2 = `between(${leftSource2}; ${lowerSource}; ${upperSource})`;
          current = current.slice(0, left2.start) + (notIndex2 === -1 ? source2 : `(${source2} | not)`) + current.slice(upper.end);
          rewroteThisPass = true;
          break;
        }
      }
      if (isIdent(tok, "like")) {
        const notIndex2 = isIdent(tokens[i - 1], "not") ? i - 1 : -1;
        const left2 = excelOperandExtent(tokens, notIndex2 === -1 ? i : notIndex2, -1);
        const right2 = excelOperandExtent(tokens, i, 1);
        if (left2 && right2) {
          const leftSource2 = current.slice(left2.start, left2.end);
          const rightSource2 = current.slice(right2.start, right2.end);
          const source2 = `like(${leftSource2}; ${rightSource2})`;
          current = current.slice(0, left2.start) + (notIndex2 === -1 ? source2 : `(${source2} | not)`) + current.slice(right2.end);
          rewroteThisPass = true;
          break;
        }
      }
      const operator = tok.value.toUpperCase() === "IN" ? "IN" : void 0;
      if (!operator || isCall)
        continue;
      const notIndex = operator === "IN" && isIdent(tokens[i - 1], "not") ? i - 1 : -1;
      const left = excelOperandExtent(tokens, notIndex === -1 ? i : notIndex, -1);
      const right = excelOperandExtent(tokens, i, 1);
      if (!left || !right)
        continue;
      const leftSource = current.slice(left.start, left.end);
      const rightSource = current.slice(right.start, right.end);
      const replacement = operator === "IN" ? notIndex === -1 ? `(${leftSource} | IN(${rightSource}))` : `((${leftSource} | IN(${rightSource})) | not)` : void 0;
      if (!replacement)
        continue;
      current = current.slice(0, left.start) + replacement + current.slice(right.end);
      rewroteThisPass = true;
      break;
    }
    if (!rewroteThisPass) {
      break;
    }
  }
  return { source: current, changed: current !== source };
}
function rewriteExcelOperators(source) {
  let current = source;
  let changed = false;
  let guard = 0;
  while (guard++ < 1024) {
    const tokens = tokenizeQuietly(current);
    if (!tokens)
      break;
    let rewroteThisPass = false;
    for (let i = tokens.length - 1; i >= 0; i--) {
      const tok = tokens[i];
      if (tok.type !== "op" || tok.value !== "^" && tok.value !== "&")
        continue;
      const lhs = excelOperandExtent(tokens, i, -1);
      const rhs = excelOperandExtent(tokens, i, 1);
      if (!lhs || !rhs)
        continue;
      const lhsText = current.slice(lhs.start, lhs.end);
      const rhsText = current.slice(rhs.start, rhs.end);
      const replacement = tok.value === "^" ? `POWER(${lhsText}, ${rhsText})` : `((${lhsText}|tostring) + (${rhsText}|tostring))`;
      current = current.slice(0, lhs.start) + replacement + current.slice(rhs.end);
      changed = true;
      rewroteThisPass = true;
      break;
    }
    if (!rewroteThisPass)
      break;
  }
  return { source: current, changed };
}
function tokenizeQuietly(source) {
  try {
    return tokenize(source);
  } catch {
    return void 0;
  }
}
function excelOperandExtent(tokens, opIndex, direction) {
  const startIdx = opIndex + direction;
  const first = tokens[startIdx];
  if (!first || first.start === void 0 || first.end === void 0)
    return void 0;
  if (direction === -1) {
    let anchor2 = startIdx;
    if (first.type === "punc" && (first.value === ")" || first.value === "]")) {
      anchor2 = matchOpen(tokens, startIdx);
      if (anchor2 < 0)
        return void 0;
      if (anchor2 > 0 && tokens[anchor2 - 1].type === "ident")
        anchor2--;
    } else if (!["ident", "number", "string", "format"].includes(first.type)) {
      return void 0;
    }
    while (anchor2 > 0) {
      const current = tokens[anchor2];
      if (current.type === "punc" && (current.value === ")" || current.value === "]")) {
        anchor2 = matchOpen(tokens, anchor2);
        if (anchor2 < 0)
          return void 0;
        if (anchor2 > 0 && ["ident", "number", "string", "format"].includes(tokens[anchor2 - 1].type)) {
          anchor2 -= 1;
        }
        continue;
      }
      const prev = tokens[anchor2 - 1];
      if (prev.type === "op" && (prev.value === "." || prev.value === "?.")) {
        const beforeDot = tokens[anchor2 - 2];
        const okPunc = beforeDot && beforeDot.type === "punc" && (beforeDot.value === ")" || beforeDot.value === "]" || beforeDot.value === "}");
        if (beforeDot && (okPunc || ["ident", "number", "string", "format"].includes(beforeDot.type))) {
          anchor2 -= 2;
          continue;
        }
        anchor2 -= 1;
        continue;
      }
      break;
    }
    const startTok2 = tokens[anchor2];
    const endTok2 = tokens[startIdx];
    if (startTok2.start === void 0 || endTok2.end === void 0)
      return void 0;
    return { start: startTok2.start, end: endTok2.end };
  }
  let anchor = startIdx;
  let endIdx = startIdx;
  if (first.type === "punc" && (first.value === "(" || first.value === "[")) {
    endIdx = matchClose(tokens, anchor);
    if (endIdx < 0)
      return void 0;
  } else if (first.type === "op" && first.value === ".") {
    endIdx = anchor + 1;
    if (endIdx >= tokens.length)
      return void 0;
  } else if (!["ident", "number", "string", "format"].includes(first.type)) {
    return void 0;
  }
  while (endIdx + 1 < tokens.length) {
    const next = tokens[endIdx + 1];
    if (next.type === "op" && (next.value === "." || next.value === "?.")) {
      const afterDot = tokens[endIdx + 2];
      if (afterDot && ["ident", "number", "string", "format"].includes(afterDot.type)) {
        endIdx += 2;
        continue;
      }
      break;
    }
    if (next.type === "punc" && (next.value === "(" || next.value === "[")) {
      const close = matchClose(tokens, endIdx + 1);
      if (close < 0)
        break;
      endIdx = close;
      continue;
    }
    break;
  }
  const startTok = tokens[anchor];
  const endTok = tokens[endIdx];
  if (startTok.start === void 0 || endTok.end === void 0)
    return void 0;
  return { start: startTok.start, end: endTok.end };
}
function matchOpen(tokens, closeIndex) {
  const close = tokens[closeIndex].value;
  const open = close === ")" ? "(" : close === "]" ? "[" : "{";
  let depth = 1;
  for (let i = closeIndex - 1; i >= 0; i--) {
    if (tokens[i].type !== "punc")
      continue;
    if (tokens[i].value === close)
      depth++;
    else if (tokens[i].value === open) {
      depth--;
      if (depth === 0)
        return i;
    }
  }
  return -1;
}
function matchClose(tokens, openIndex) {
  const open = tokens[openIndex].value;
  const close = open === "(" ? ")" : open === "[" ? "]" : "}";
  let depth = 1;
  for (let i = openIndex + 1; i < tokens.length; i++) {
    if (tokens[i].type !== "punc")
      continue;
    if (tokens[i].value === open)
      depth++;
    else if (tokens[i].value === close) {
      depth--;
      if (depth === 0)
        return i;
    }
  }
  return -1;
}
function opensSuffixBracketContext(tokens, openIndex) {
  const previous = tokens[openIndex - 1];
  if (!previous) {
    return false;
  }
  if (["ident", "number", "string", "var", "format"].includes(previous.type)) {
    return true;
  }
  if (previous.type === "punc" && [")", "]", "}"].includes(previous.value)) {
    return true;
  }
  if (previous.type === "op" && [".", "?.", "?"].includes(previous.value)) {
    return true;
  }
  return false;
}
function isPredicateBracketContext(tokens, openIndex) {
  if (!opensSuffixBracketContext(tokens, openIndex)) {
    return false;
  }
  const close = matchClose(tokens, openIndex);
  if (close < 0) {
    return false;
  }
  const inner = tokens.slice(openIndex + 1, close);
  if (inner.length === 0) {
    return false;
  }
  if (inner[0]?.type === "op" && inner[0].value === "*") {
    return true;
  }
  const commaRanges = splitTopLevel(inner, 0, inner.length, ",");
  if (commaRanges.length === 2 && isSimpleHumanIndex(inner.slice(...commaRanges[0]))) {
    return true;
  }
  return isPredicateLike(inner);
}
function predicateBracketDepths(tokens) {
  const depths = new Array(tokens.length).fill(0);
  let depth = 0;
  const stack = [];
  for (let index = 0; index < tokens.length; index++) {
    depths[index] = depth;
    const token = tokens[index];
    if (token.type === "punc" && token.value === "[") {
      const isPredicate = isPredicateBracketContext(tokens, index);
      stack.push(isPredicate);
      if (isPredicate) {
        depth++;
      }
      continue;
    }
    if (token.type === "punc" && token.value === "]") {
      const wasPredicate = stack.pop();
      if (wasPredicate) {
        depth--;
      }
    }
  }
  return depths;
}
function rewriteInequality(source) {
  const tokens = tokenizeQuietly(source);
  if (!tokens)
    return { source, changed: false };
  const edits = [];
  for (const tok of tokens) {
    if (tok.type === "op" && tok.value === "!=" && tok.raw === "<>" && tok.start !== void 0 && tok.end !== void 0) {
      edits.push([tok.start, tok.end]);
    }
  }
  if (edits.length === 0)
    return { source, changed: false };
  let out = "";
  let cursor = 0;
  for (const [start, end] of edits) {
    out += source.slice(cursor, start) + "!=";
    cursor = end;
  }
  out += source.slice(cursor);
  return { source: out, changed: true };
}
function rewriteTopLevelEquals(source) {
  const tokens = tokenizeQuietly(source);
  if (!tokens)
    return { source, changed: false };
  const predicateDepths = predicateBracketDepths(tokens);
  const edits = [];
  for (let index = 0; index < tokens.length; index++) {
    const tok = tokens[index];
    if (predicateDepths[index] === 0 && tok.type === "op" && tok.value === "=" && tok.start !== void 0 && tok.end !== void 0) {
      edits.push([tok.start, tok.end]);
    }
  }
  if (edits.length === 0)
    return { source, changed: false };
  let out = "";
  let cursor = 0;
  for (const [start, end] of edits) {
    out += source.slice(cursor, start) + "==";
    cursor = end;
  }
  out += source.slice(cursor);
  return { source: out, changed: true };
}
function preprocessReadableSource(source) {
  const rewrites = [];
  let next = source;
  const prefix = stripExcelCellPrefix(next);
  if (prefix.changed) {
    rewrites.push({
      code: "excel-cell-prefix-stripped",
      message: "Dropped the leading `=` (Excel cell-formula prefix)."
    });
    next = prefix.source;
  }
  const statisticalDotted = rewriteStatisticalDottedFormulaNames(next);
  if (statisticalDotted.changed) {
    rewrites.push({
      code: "statistical-dotted-formula-rewritten",
      message: "Rewrote dotted statistical FormulaJS names to BXL underscore names."
    });
    next = statisticalDotted.source;
  }
  const inequality = rewriteInequality(next);
  if (inequality.changed) {
    rewrites.push({
      code: "excel-inequality-rewritten",
      message: "Rewrote Excel-style `<>` to canonical `!=`."
    });
    next = inequality.source;
  }
  const topLevelEquals = rewriteTopLevelEquals(next);
  if (topLevelEquals.changed) {
    rewrites.push({
      code: "top-level-equals-to-comparison",
      message: "Converted top-level = to == (BXL comparison)."
    });
    next = topLevelEquals.source;
  }
  const ops = rewriteExcelOperators(next);
  if (ops.changed) {
    rewrites.push({
      code: "excel-operator-rewritten",
      message: "Rewrote Excel-style `^` / `&` operators to BXL equivalents."
    });
    next = ops.source;
  }
  const wordOps = rewriteWordBinaryOperators(next);
  if (wordOps.changed) {
    rewrites.push({
      code: "word-binary-operator-rewritten",
      message: "Rewrote word-form string operators to pipe-form jq calls."
    });
    next = wordOps.source;
  }
  return { source: next, rewrites };
}
function compileReadableSyntax(source, options = {}) {
  const pre = preprocessReadableSource(source);
  const tokens = tokenize(pre.source);
  const compiler = new Compiler(tokens, { schema: options.schema });
  const compiled = compiler.compile(options.schema);
  const compiledSource = compiled.needsRootBinding ? `. as $root | ${compiled.source}` : compiled.source;
  let formatted = compiledSource;
  try {
    const reformatted = formatCompiledJq(compiledSource);
    if (reformatted)
      formatted = reformatted;
  } catch {
  }
  return {
    source: formatted,
    changed: compiled.changed || formatted !== source,
    warnings: compiled.warnings
  };
}
var formatCompiledJq = (source) => source;
function registerCompiledJqFormatter(fn) {
  formatCompiledJq = fn;
}

// src/bxl/bridge/native.ts
var NativeJqDialectError = class extends Error {
  constructor(phase, message) {
    super(message);
    this.phase = phase;
    this.name = "NativeJqDialectError";
  }
};
function wrapPhaseError(phase, error) {
  if (error instanceof NativeJqDialectError) {
    return error;
  }
  const message = error && typeof error === "object" && "message" in error ? String(error.message) : String(error);
  return new NativeJqDialectError(phase, message);
}
function compileProgram(program, options = {}) {
  if (options.readableSyntax === false) {
    return {
      source: program,
      changed: false,
      warnings: []
    };
  }
  return compileReadableSyntax(program, { schema: options.schema });
}
function tokenizeNativeJq(program, options = {}) {
  const compiled = compileProgram(program, options);
  try {
    return new Tokenizer(new InputStream(compiled.source)).toArray();
  } catch (error) {
    throw wrapPhaseError("tokenize", error);
  }
}
function parseNativeJq(program, options = {}) {
  const compiled = compileProgram(program, options);
  const tokens = tokenizeNativeJq(compiled.source, {
    ...options,
    readableSyntax: false
  });
  try {
    return {
      tokens,
      ast: parse(compiled.source),
      source: program,
      compiledSource: compiled.source,
      readableWarnings: compiled.warnings
    };
  } catch (error) {
    throw wrapPhaseError("parse", error);
  }
}
function runParsedNativeProgram(parsed, input, registry, runtimeLimits) {
  const outputs = [];
  try {
    const runtime = withRuntimeDiagnostics(() => {
      for (const value of evaluateWithRegistry(parsed.ast, [input], registry)) {
        recordRuntimeOutput(value);
        outputs.push(value);
      }
    }, runtimeLimits);
    if (runtime.error && !(runtime.error instanceof HaltSignal)) {
      throw runtime.error;
    }
    return {
      tokens: parsed.tokens,
      ast: parsed.ast,
      source: parsed.source,
      compiledSource: parsed.compiledSource,
      readableWarnings: parsed.readableWarnings,
      outputs,
      debugMessages: runtime.diagnostics.debugMessages,
      stderr: runtime.diagnostics.stderr,
      haltedExitCode: runtime.diagnostics.haltedExitCode
    };
  } catch (error) {
    throw wrapPhaseError("evaluate", error);
  }
}
function runNativeJq(program, input, options = {}) {
  const parsed = parseNativeJq(program, options);
  const registry = resolveBuiltinRegistry(
    options.libraries ?? DEFAULT_BUILTIN_LIBRARIES
  );
  return runParsedNativeProgram(parsed, input, registry, options.runtimeLimits);
}
async function runNativeJqAsync(program, input, options = {}) {
  const parsed = parseNativeJq(program, options);
  const libraries = await resolveLazyBuiltinLibrariesForAst(
    parsed.ast,
    options.libraries ?? DEFAULT_BUILTIN_LIBRARIES
  );
  const registry = resolveBuiltinRegistry(libraries);
  return runParsedNativeProgram(parsed, input, registry, options.runtimeLimits);
}
function stringLiteralValue(node) {
  return node?.type === "str" && !node.interpolated ? node.value : void 0;
}
function objectLiteralKeys(node) {
  if (!node || node.type !== "object") {
    return [];
  }
  return node.entries.map((entry) => typeof entry.key === "string" ? entry.key : void 0).filter((entry) => Boolean(entry));
}
function collectExcelContribFilterDeps(node, deps, scope, currentOrigin) {
  const addStringKeyFromArg = (rowsIndex, keyIndex) => {
    if (expressionOutputOrigin(node.args[rowsIndex], scope, currentOrigin) === "root") {
      const key = stringLiteralValue(node.args[keyIndex]);
      if (key) {
        deps.add(key);
      }
    }
  };
  const addCriteriaObjectKeys = (criteriaIndex) => {
    if (expressionOutputOrigin(node.args[0], scope, currentOrigin) === "root") {
      for (const key of objectLiteralKeys(node.args[criteriaIndex])) {
        deps.add(key);
      }
    }
  };
  switch (node.name) {
    case "COL/2":
      addStringKeyFromArg(0, 1);
      return;
    case "SUMIF_BY/4":
    case "AVERAGEIF_BY/4":
      addStringKeyFromArg(0, 1);
      addStringKeyFromArg(0, 2);
      return;
    case "COUNTIF_BY/3":
      addStringKeyFromArg(0, 1);
      return;
    case "SUMIFS_BY/3":
    case "AVERAGEIFS_BY/3":
      addStringKeyFromArg(0, 1);
      addCriteriaObjectKeys(2);
      return;
    case "COUNTIFS_BY/2":
      addCriteriaObjectKeys(1);
      return;
    case "LOOKUP_BY/4":
      addStringKeyFromArg(0, 1);
      addStringKeyFromArg(0, 3);
      return;
    case "NPV_BY/3":
      addStringKeyFromArg(1, 2);
      return;
    case "IRR_BY/2":
      addStringKeyFromArg(0, 1);
      return;
    case "IRR_BY/3":
      addStringKeyFromArg(0, 1);
      return;
    case "XNPV_BY/4":
      addStringKeyFromArg(1, 2);
      addStringKeyFromArg(1, 3);
      return;
    case "XIRR_BY/3":
      addStringKeyFromArg(0, 1);
      addStringKeyFromArg(0, 2);
      return;
    case "XIRR_BY/4":
      addStringKeyFromArg(0, 1);
      addStringKeyFromArg(0, 2);
      return;
    case "VLOOKUP_BY/4":
    case "VLOOKUP_BY/5":
      addStringKeyFromArg(0, 1);
      addStringKeyFromArg(0, 3);
      return;
  }
}
function extendDependencyScope(scope) {
  return {
    defs: new Map(scope.defs),
    vars: new Map(scope.vars)
  };
}
function bindDefArgs(scope, args) {
  for (const arg of args) {
    scope.vars.set(arg.name, "derived");
  }
}
function bindDestructuringOrigins(scope, destructurings, origin) {
  for (const destructuring of destructurings) {
    switch (destructuring.type) {
      case "var":
        scope.vars.set(destructuring.name, origin);
        break;
      case "arrayDestructuring":
        bindDestructuringOrigins(scope, destructuring.destructuring, "derived");
        break;
      case "objectDestructuring":
        for (const entry of destructuring.entries) {
          if (entry.destructuring) {
            bindDestructuringOrigins(scope, [entry.destructuring], "derived");
          } else {
            scope.vars.set(entry.key.name, "derived");
          }
        }
        break;
    }
  }
}
function collectDestructuringDeps(destructurings, deps, scope, origin) {
  for (const destructuring of destructurings) {
    switch (destructuring.type) {
      case "var":
        break;
      case "arrayDestructuring":
        collectDestructuringDeps(destructuring.destructuring, deps, scope, "derived");
        break;
      case "objectDestructuring":
        for (const entry of destructuring.entries) {
          if (origin === "root") {
            if (typeof entry.key === "string") {
              deps.add(entry.key);
            } else if (entry.key.type === "var" && !entry.destructuring) {
              deps.add(entry.key.name.replace(/^\$/, ""));
            } else {
              collectExpressionDeps(entry.key, deps, scope, origin);
            }
          } else if (typeof entry.key !== "string" && entry.key.type !== "var") {
            collectExpressionDeps(entry.key, deps, scope, origin);
          }
          if (entry.destructuring) {
            collectDestructuringDeps([entry.destructuring], deps, scope, "derived");
          }
        }
        break;
    }
  }
}
function expressionOutputOrigin(node, scope, currentOrigin) {
  if (!node)
    return currentOrigin;
  switch (node.type) {
    case "identity":
      return currentOrigin;
    case "var":
      return scope.vars.get(node.name) ?? "derived";
    case "def": {
      const nextScope = extendDependencyScope(scope);
      nextScope.defs.set(node.name, node);
      return expressionOutputOrigin(node.next, nextScope, currentOrigin);
    }
    case "varDeclaration": {
      const exprOrigin = expressionOutputOrigin(node.expr, scope, currentOrigin);
      const nextScope = extendDependencyScope(scope);
      bindDestructuringOrigins(nextScope, node.destructuring, exprOrigin);
      return expressionOutputOrigin(node.next, nextScope, currentOrigin);
    }
    case "label":
      return expressionOutputOrigin(node.next, scope, currentOrigin);
    case "try":
      return expressionOutputOrigin(node.body, scope, currentOrigin);
    case "binary":
      if (node.operator === "|") {
        const leftOrigin = expressionOutputOrigin(node.left, scope, currentOrigin);
        return expressionOutputOrigin(node.right, scope, leftOrigin);
      }
      return "derived";
    default:
      return "derived";
  }
}
function collectExpressionDeps(node, deps, scope, currentOrigin) {
  if (!node)
    return;
  switch (node.type) {
    case "binary":
      if (node.operator === "|") {
        collectExpressionDeps(node.left, deps, scope, currentOrigin);
        collectExpressionDeps(
          node.right,
          deps,
          scope,
          expressionOutputOrigin(node.left, scope, currentOrigin)
        );
        return;
      }
      collectExpressionDeps(node.left, deps, scope, currentOrigin);
      collectExpressionDeps(node.right, deps, scope, currentOrigin);
      return;
    case "def": {
      const nextScope = extendDependencyScope(scope);
      nextScope.defs.set(node.name, node);
      collectExpressionDeps(node.next, deps, nextScope, currentOrigin);
      return;
    }
    case "filter": {
      for (const arg of node.args) {
        collectExpressionDeps(arg, deps, scope, currentOrigin);
      }
      collectExcelContribFilterDeps(node, deps, scope, currentOrigin);
      const localDef = scope.defs.get(node.name);
      if (localDef) {
        const defScope = extendDependencyScope(scope);
        bindDefArgs(defScope, localDef.args);
        collectExpressionDeps(localDef.body, deps, defScope, currentOrigin);
      }
      return;
    }
    case "if":
      collectExpressionDeps(node.cond, deps, scope, currentOrigin);
      collectExpressionDeps(node.then, deps, scope, currentOrigin);
      for (const branch of node.elifs ?? []) {
        collectExpressionDeps(branch.cond, deps, scope, currentOrigin);
        collectExpressionDeps(branch.then, deps, scope, currentOrigin);
      }
      collectExpressionDeps(node.else, deps, scope, currentOrigin);
      return;
    case "try":
      collectExpressionDeps(node.body, deps, scope, currentOrigin);
      collectExpressionDeps(node.catch, deps, scope, currentOrigin);
      return;
    case "reduce": {
      collectExpressionDeps(node.expr, deps, scope, currentOrigin);
      collectExpressionDeps(node.init, deps, scope, currentOrigin);
      const nextScope = extendDependencyScope(scope);
      nextScope.vars.set(node.var, "derived");
      collectExpressionDeps(node.update, deps, nextScope, currentOrigin);
      return;
    }
    case "foreach": {
      collectExpressionDeps(node.expr, deps, scope, currentOrigin);
      collectExpressionDeps(node.init, deps, scope, currentOrigin);
      const nextScope = extendDependencyScope(scope);
      nextScope.vars.set(node.var, "derived");
      collectExpressionDeps(node.update, deps, nextScope, currentOrigin);
      collectExpressionDeps(node.extract, deps, nextScope, currentOrigin);
      return;
    }
    case "varDeclaration": {
      collectExpressionDeps(node.expr, deps, scope, currentOrigin);
      const exprOrigin = expressionOutputOrigin(node.expr, scope, currentOrigin);
      collectDestructuringDeps(node.destructuring, deps, scope, exprOrigin);
      const nextScope = extendDependencyScope(scope);
      bindDestructuringOrigins(nextScope, node.destructuring, exprOrigin);
      collectExpressionDeps(node.next, deps, nextScope, currentOrigin);
      return;
    }
    case "label":
      collectExpressionDeps(node.next, deps, scope, currentOrigin);
      return;
    case "unary":
      collectExpressionDeps(node.expr, deps, scope, currentOrigin);
      return;
    case "index": {
      collectExpressionDeps(node.expr, deps, scope, currentOrigin);
      if (typeof node.index === "string" && expressionOutputOrigin(node.expr, scope, currentOrigin) === "root") {
        deps.add(node.index);
      } else if (typeof node.index !== "string") {
        collectExpressionDeps(node.index, deps, scope, currentOrigin);
      }
      return;
    }
    case "slice":
      collectExpressionDeps(node.expr, deps, scope, currentOrigin);
      collectExpressionDeps(node.from, deps, scope, currentOrigin);
      collectExpressionDeps(node.to, deps, scope, currentOrigin);
      return;
    case "iterator":
      collectExpressionDeps(node.expr, deps, scope, currentOrigin);
      return;
    case "array":
      collectExpressionDeps(node.expr, deps, scope, currentOrigin);
      return;
    case "object":
      for (const entry of node.entries) {
        if (typeof entry.key !== "string") {
          collectExpressionDeps(entry.key, deps, scope, currentOrigin);
        } else if (!("value" in entry) && currentOrigin === "root") {
          deps.add(entry.key);
        }
        if ("value" in entry) {
          collectExpressionDeps(entry.value, deps, scope, currentOrigin);
        }
      }
      return;
    case "str":
      if (node.interpolated) {
        for (const part of node.parts) {
          if (typeof part !== "string") {
            collectExpressionDeps(part, deps, scope, currentOrigin);
          }
        }
      }
      return;
    case "format":
    case "identity":
    case "num":
    case "bool":
    case "null":
    case "var":
    case "break":
    case "recursiveDescent":
      return;
  }
}
function extractNativeJqDepsFromAst(ast) {
  const deps = /* @__PURE__ */ new Set();
  collectExpressionDeps(
    ast.expr,
    deps,
    {
      defs: /* @__PURE__ */ new Map(),
      vars: /* @__PURE__ */ new Map()
    },
    "root"
  );
  return [...deps];
}
function prepareNativeJq(program, options = {}) {
  const parsed = parseNativeJq(program, options);
  const registry = resolveBuiltinRegistry(
    options.libraries ?? DEFAULT_BUILTIN_LIBRARIES
  );
  const deps = extractNativeJqDepsFromAst(parsed.ast);
  return {
    ...parsed,
    deps,
    run(input, runOptions = {}) {
      return runParsedNativeProgram(
        parsed,
        input,
        registry,
        runOptions.runtimeLimits ?? options.runtimeLimits
      );
    }
  };
}
async function prepareNativeJqAsync(program, options = {}) {
  const parsed = parseNativeJq(program, options);
  const libraries = await resolveLazyBuiltinLibrariesForAst(
    parsed.ast,
    options.libraries ?? DEFAULT_BUILTIN_LIBRARIES
  );
  const registry = resolveBuiltinRegistry(libraries);
  const deps = extractNativeJqDepsFromAst(parsed.ast);
  return {
    ...parsed,
    deps,
    run(input, runOptions = {}) {
      return runParsedNativeProgram(
        parsed,
        input,
        registry,
        runOptions.runtimeLimits ?? options.runtimeLimits
      );
    }
  };
}

// src/bxl/formatter/index.ts
function tokenRaw(source, token) {
  if (typeof token.start === "number" && typeof token.end === "number") {
    return source.slice(token.start, token.end);
  }
  return token.raw ?? token.value;
}
function isValueToken(token) {
  return Boolean(
    token && (["ident", "number", "string", "var", "format"].includes(token.type) || [")", "]"].includes(token.value))
  );
}
function shouldInsertReadableSpace(previous, current, prevPrev) {
  if (!previous) {
    return false;
  }
  if ((previous.type === "op" || previous.type === "punc") && (previous.value === "," || previous.value === ";")) {
    return true;
  }
  if ([",", ";", ")", "]", "}"].includes(current.value)) {
    return false;
  }
  if (["(", "[", "{", "#"].includes(previous.value)) {
    return false;
  }
  const JQ_BINDING_KEYWORDS = /* @__PURE__ */ new Set(["as", "if", "then", "else", "elif", "end", "and", "or", "not", "try", "catch", "reduce", "foreach", "label", "def"]);
  if (current.value === "(" && previous.type === "ident" && JQ_BINDING_KEYWORDS.has(previous.value.toLowerCase())) {
    return true;
  }
  if (current.value === "(") {
    return false;
  }
  if (current.value === ".." || previous.value === "..") {
    return false;
  }
  if (previous.type === "ident" && JQ_BINDING_KEYWORDS.has(previous.value.toLowerCase()) && (current.value === "." || current.value === ".." || current.type === "ident" || current.type === "var" || current.type === "number" || current.type === "string" || current.value === "(" || current.value === "[" || current.value === "{" || current.value === "-")) {
    return true;
  }
  if (current.value === "." && (isValueToken(previous) || previous.value === ".")) {
    return false;
  }
  if (previous.value === "." && current.type === "ident" && JQ_BINDING_KEYWORDS.has(current.value.toLowerCase())) {
    return true;
  }
  if (previous.value === "." && (isValueToken(current) || current.value === ".")) {
    return false;
  }
  if (current.value === "[" && isValueToken(previous)) {
    return false;
  }
  if (["==", "!=", "<", "<=", ">", ">=", "=", "|"].includes(current.value)) {
    return true;
  }
  if (["==", "!=", "<", "<=", ">", ">=", "=", "|"].includes(previous.value)) {
    return true;
  }
  const valueStart = (tok) => Boolean(
    tok && (isValueToken(tok) || tok.type === "op" && tok.value === "." || tok.type === "punc" && tok.value === "(")
  );
  if (current.type === "op" && isValueToken(previous) && ["+", "*", "/", "%"].includes(current.value)) {
    return true;
  }
  if (previous.type === "op" && valueStart(current) && ["+", "*", "/", "%"].includes(previous.value)) {
    if (previous.value === "*" && prevPrev && prevPrev.type === "punc" && (prevPrev.value === "[" || prevPrev.value === "," || prevPrev.value === ";")) {
      return false;
    }
    return true;
  }
  if (current.type === "op" && current.value === "-" && isValueToken(previous)) {
    return true;
  }
  if (previous.type === "op" && previous.value === "-" && valueStart(current) && isValueToken(prevPrev)) {
    return true;
  }
  return isValueToken(previous) && isValueToken(current);
}
function formatReadableBxlSource(source) {
  try {
    const tokens = tokenizeReadableSyntax(source);
    let output = "";
    let previous;
    let prevPrev;
    for (const token of tokens) {
      if (shouldInsertReadableSpace(previous, token, prevPrev)) {
        output += " ";
      }
      output += token.raw ?? tokenRaw(source, token);
      prevPrev = previous;
      previous = token;
    }
    return output.replace(/\[#last\s*-\s*(\d+)\]/g, "[#last-$1]").replace(/#(\d+)\s*\.\.\s*(\d+)(?=[,\]])/g, "#$1..#$2");
  } catch {
    return source;
  }
}
registerCompiledJqFormatter((source) => {
  try {
    const out = formatReadableBxlSource(source);
    return out || source;
  } catch {
    return source;
  }
});

// src/bxl/profiles/function-safety.ts
function names(values) {
  return new Set(values.map((value) => value.toUpperCase()));
}
var BXL_AGGREGATE_CALLS = names([
  "AVEDEV",
  "AVERAGE",
  "AVERAGEIF",
  "AVERAGEIF_BY",
  "AVERAGEIFS_BY",
  "CHISQ_TEST",
  "COUNT",
  "COUNTA",
  "COUNTBLANK",
  "COUNTIF",
  "COUNTIF_BY",
  "COUNTIFS_BY",
  "CORREL",
  "DEVSQ",
  "F_TEST",
  "FORECAST",
  "FVSCHEDULE",
  "GCD",
  "GEOMEAN",
  "HARMEAN",
  "IMPRODUCT",
  "IMSUM",
  "IRR",
  "IRR_BY",
  "KURT",
  "LARGE",
  "LCM",
  "MAX",
  "MAXIFS",
  "MEDIAN",
  "MIN",
  "MINIFS",
  "MIRR",
  "MULTINOMIAL",
  "NPV",
  "NPV_BY",
  "PEARSON",
  "PERCENTILE_EXC",
  "PERCENTILE_INC",
  "PERCENTRANK_EXC",
  "PERCENTRANK_INC",
  "QUARTILE_EXC",
  "QUARTILE_INC",
  "PRODUCT",
  "RANK_AVG",
  "RANK_EQ",
  "SERIESSUM",
  "SKEW",
  "SLOPE",
  "SMALL",
  "STDEV",
  "STDEV_P",
  "STDEV_S",
  "SUM",
  "SUMIF",
  "SUMIF_BY",
  "SUMIFS_BY",
  "SUMPRODUCT",
  "SUMSQ",
  "SUMX2MY2",
  "SUMX2PY2",
  "SUMXMY2",
  "T_TEST",
  "TRIMMEAN",
  "VAR",
  "VAR_P",
  "VAR_S",
  "XIRR",
  "XIRR_BY",
  "XNPV",
  "XNPV_BY",
  "Z_TEST"
]);
var BXL_BOUNDED_SCALAR_CALLS = names([
  "ACCRINT",
  "BASE",
  "BESSELI",
  "BESSELJ",
  "BESSELK",
  "BESSELY",
  "BETA_DIST",
  "BETA_INV",
  "BIN2DEC",
  "BIN2HEX",
  "BIN2OCT",
  "BINOM_DIST",
  "BINOM_DIST_RANGE",
  "BINOM_INV",
  "BITAND",
  "BITLSHIFT",
  "BITOR",
  "BITRSHIFT",
  "BITXOR",
  "CHISQ_DIST",
  "CHISQ_DIST_RT",
  "CHISQ_INV",
  "CHISQ_INV_RT",
  "COMPLEX",
  "CONFIDENCE_NORM",
  "CONFIDENCE_T",
  "CONVERT",
  "COUPDAYS",
  "CUMIPMT",
  "CUMPRINC",
  "DB",
  "DDB",
  "DEC2BIN",
  "DEC2HEX",
  "DEC2OCT",
  "DECIMAL",
  "DELTA",
  "DISC",
  "DOLLARDE",
  "DOLLARFR",
  "EFFECT",
  "ERF",
  "ERFC",
  "EXPON_DIST",
  "F_DIST",
  "F_DIST_RT",
  "F_INV",
  "F_INV_RT",
  "FV",
  "GAMMA",
  "GAMMA_DIST",
  "GAMMA_INV",
  "GAMMALN",
  "GAMMALN_PRECISE",
  "GAUSS",
  "GESTEP",
  "HEX2BIN",
  "HEX2DEC",
  "HEX2OCT",
  "HYPGEOM_DIST",
  "IMABS",
  "IMAGINARY",
  "IMARGUMENT",
  "IMCONJUGATE",
  "IMCOS",
  "IMCOSH",
  "IMCOT",
  "IMCSC",
  "IMCSCH",
  "IMDIV",
  "IMEXP",
  "IMLN",
  "IMLOG10",
  "IMLOG2",
  "IMPOWER",
  "IMREAL",
  "IMSEC",
  "IMSECH",
  "IMSIN",
  "IMSINH",
  "IMSQRT",
  "IMSUB",
  "IMTAN",
  "IPMT",
  "ISPMT",
  "LOGNORM_DIST",
  "LOGNORM_INV",
  "NEGBINOM_DIST",
  "NOMINAL",
  "NORM_DIST",
  "NORM_INV",
  "NORM_S_DIST",
  "NORM_S_INV",
  "NPER",
  "OCT2BIN",
  "OCT2DEC",
  "OCT2HEX",
  "PDURATION",
  "PHI",
  "PMT",
  "POISSON_DIST",
  "PPMT",
  "PRICEDISC",
  "PV",
  "RATE",
  "RRI",
  "SLN",
  "STANDARDIZE",
  "SYD",
  "T_DIST",
  "T_DIST_2T",
  "T_DIST_RT",
  "T_INV",
  "T_INV_2T",
  "TBILLEQ",
  "TBILLPRICE",
  "TBILLYIELD",
  "UNICHAR",
  "WEIBULL_DIST",
  ...DETERMINISTIC_VALIDATION_FUNCTIONS
]);
var BXL_ERROR_MASKING_CALLS = names([
  "ERROR_TYPE",
  "IFERROR",
  "IFNA",
  "ISERR",
  "ISERROR",
  "ISNA",
  "try"
]);
var BXL_VOLATILE_CALLS = names([
  "NOW",
  "RAND",
  "RANDBETWEEN",
  "TODAY",
  "now",
  ...VOLATILE_VALIDATION_FUNCTIONS
]);
var BXL_CONTROL_OR_SIDE_EFFECT_CALLS = names([
  "debug",
  "empty",
  "env",
  "error",
  "halt",
  "halt_error",
  "input",
  "input_filename",
  "input_line_number",
  "stderr"
]);
var BXL_DERIVE_CONTROL_DENIED_CALLS = names([
  "debug",
  "env",
  "error",
  "halt",
  "halt_error",
  "input",
  "input_filename",
  "input_line_number",
  "stderr"
]);
var BXL_METADATA_CALLS = names([
  "builtins",
  "get_jq_origin",
  "get_prog_origin",
  "get_search_list",
  "modulemeta"
]);
var BXL_PREDICATE_LOWERABLE_CALLS = names([
  "IN",
  "age",
  "between",
  "like",
  "matches",
  "NOT",
  "not",
  "overlaps",
  "present"
]);
var BXL_DERIVE_DENIED_CALLS = names([
  ...BXL_VOLATILE_CALLS,
  ...BXL_DERIVE_CONTROL_DENIED_CALLS,
  ...BXL_METADATA_CALLS
]);
var BXL_FUNCTION_SAFETY_CATEGORIES = new Map([
  ...[...BXL_AGGREGATE_CALLS].map((name) => [name, "aggregate"]),
  ...[...BXL_BOUNDED_SCALAR_CALLS].map((name) => [name, "boundedScalar"]),
  ...[...BXL_ERROR_MASKING_CALLS].map((name) => [name, "errorMasking"]),
  ...[...BXL_VOLATILE_CALLS].map((name) => [name, "volatile"]),
  ...[...BXL_CONTROL_OR_SIDE_EFFECT_CALLS].map((name) => [name, "controlOrSideEffect"]),
  ...[...BXL_METADATA_CALLS].map((name) => [name, "metadata"]),
  ...[...BXL_PREDICATE_LOWERABLE_CALLS].map((name) => [name, "predicateLowerable"])
]);
var POLICY_DENIED_CALLS = /* @__PURE__ */ new Set([
  ...BXL_AGGREGATE_CALLS,
  ...BXL_ERROR_MASKING_CALLS,
  ...BXL_VOLATILE_CALLS,
  ...BXL_CONTROL_OR_SIDE_EFFECT_CALLS,
  ...BXL_METADATA_CALLS
]);
var BXL_PROFILE_FUNCTION_POLICIES = {
  policy: {
    deniedCalls: POLICY_DENIED_CALLS,
    denyMessageByCategory: {
      aggregate: "aggregate calls can pull work across collections",
      controlOrSideEffect: "control/side-effect calls are not request-time authorization predicates",
      errorMasking: "error-masking calls can hide fail-closed authorization errors",
      metadata: "runtime metadata calls are not authorization predicates",
      volatile: "volatile calls are not stable request-time authorization predicates"
    }
  },
  predicate: {
    allowedCalls: BXL_PREDICATE_LOWERABLE_CALLS
  },
  derive: {
    deniedCalls: BXL_DERIVE_DENIED_CALLS,
    denyMessageByCategory: {
      controlOrSideEffect: "control/side-effect calls are not stable write-time derivations",
      metadata: "runtime metadata calls are not stable write-time derivations",
      volatile: "volatile calls are not stable write-time derivations"
    }
  }
};
function normalizeBxlFunctionName(name) {
  return name.toUpperCase();
}
function categoryForBxlFunction(name) {
  return BXL_FUNCTION_SAFETY_CATEGORIES.get(normalizeBxlFunctionName(name));
}
function classifyBxlProfileFunction(profile, name) {
  const normalizedName = normalizeBxlFunctionName(name);
  if (profile === "compute") {
    return { safety: "allow", normalizedName };
  }
  const policy = BXL_PROFILE_FUNCTION_POLICIES[profile];
  const category = categoryForBxlFunction(name);
  if (policy.allowedCalls) {
    return policy.allowedCalls.has(normalizedName) ? { safety: "allow", normalizedName, category } : { safety: "deny", normalizedName, category };
  }
  if (policy.deniedCalls?.has(normalizedName)) {
    return {
      safety: "deny",
      normalizedName,
      category,
      message: category ? policy.denyMessageByCategory?.[category] : void 0
    };
  }
  if (category) {
    return { safety: "allow", normalizedName, category };
  }
  return { safety: "unclassified", normalizedName, category };
}

// src/bxl/ast/index.ts
var ASSIGNMENT_OPERATORS = /* @__PURE__ */ new Set([
  "=",
  "|=",
  "+=",
  "-=",
  "*=",
  "/=",
  "%=",
  "//="
]);
function parseBxlAst(source, options = {}) {
  const parsed = parseNativeJq(source, options);
  const program = {
    type: "program",
    source: parsed.source,
    canonicalSource: parsed.compiledSource,
    warnings: parsed.readableWarnings,
    body: parsed.ast.expr ? fromJqExpression(parsed.ast.expr) : null,
    profile: options.profile,
    attachment: options.attachment,
    profileIssues: []
  };
  if (options.profile) {
    program.profileIssues = validateBxlAst(program, {
      profile: options.profile,
      attachment: options.attachment
    });
  }
  return program;
}
function validateBxlAst(program, options) {
  const issues = [];
  const root = program.type === "program" ? program.body : program;
  if (!root) {
    return issues;
  }
  visitBxlAstWithParent(root, void 0, (node, parent) => {
    if (options.profile !== "compute") {
      validateSandboxProfileNode(node, options.profile, issues);
    }
    if (options.profile === "policy") {
      validatePolicyNode(node, issues);
    }
    if (options.profile === "predicate") {
      validatePredicateNode(node, parent, issues);
    }
    if (options.profile === "derive") {
      validateDeriveNode(node, parent, issues);
    }
  });
  return issues;
}
function visitBxlAstWithParent(node, parent, visitor) {
  visitor(node, parent);
  for (const child of childNodes(node)) {
    visitBxlAstWithParent(child, node, visitor);
  }
}
function validateSandboxProfileNode(node, profile, issues) {
  if (node.type === "def") {
    issues.push({
      code: `${profile}-def-banned`,
      severity: "error",
      message: `${profileMessagePrefix(profile)} does not allow user-defined helpers.`,
      nodeType: node.type
    });
  }
  if ((node.type === "reduce" || node.type === "foreach") && profile !== "derive") {
    issues.push({
      code: `${profile}-loop-banned`,
      severity: "error",
      message: `${profileMessagePrefix(profile)} does not allow explicit reduce/foreach loops.`,
      nodeType: node.type
    });
  }
  if (node.type === "recursiveDescent") {
    issues.push({
      code: `${profile}-recursive-descent-banned`,
      severity: "error",
      message: `${profileMessagePrefix(profile)} does not allow recursive descent.`,
      nodeType: node.type
    });
  }
  if (node.type === "binary" && ASSIGNMENT_OPERATORS.has(node.operator)) {
    issues.push({
      code: `${profile}-assignment-banned`,
      severity: "error",
      message: `${profileMessagePrefix(profile)} does not allow jq assignment operator ${node.operator}.`,
      nodeType: node.type
    });
  }
  if (node.type === "try" && !(profile === "derive" && node.short)) {
    issues.push({
      code: `${profile}-try-banned`,
      severity: "error",
      message: `${profileMessagePrefix(profile)} does not allow jq try/catch error masking.`,
      nodeType: node.type
    });
  }
  if (node.type === "label" || node.type === "break") {
    issues.push({
      code: `${profile}-control-flow-banned`,
      severity: "error",
      message: `${profileMessagePrefix(profile)} does not allow jq label/break control flow.`,
      nodeType: node.type
    });
  }
  if (node.type === "format") {
    issues.push({
      code: `${profile}-format-banned`,
      severity: "error",
      message: `${profileMessagePrefix(profile)} does not allow jq format filters.`,
      nodeType: node.type
    });
  }
}
function validatePolicyNode(node, issues) {
  if (node.type !== "call") {
    return;
  }
  const decision = classifyBxlProfileFunction("policy", node.name);
  if (decision.safety === "deny") {
    issues.push({
      code: decision.category === "aggregate" ? "policy-aggregate-banned" : "policy-call-banned",
      severity: "error",
      message: `Profile.policy is for bounded request-time authorization decisions and does not allow call ${node.name}${decision.message ? `: ${decision.message}` : ""}.`,
      nodeType: node.type
    });
  }
}
function validatePredicateNode(node, parent, issues) {
  if (node.type === "binding") {
    issues.push({
      code: "predicate-binding-banned",
      severity: "error",
      message: "Profile.predicate must compile to a query-time boolean predicate and cannot use local jq bindings.",
      nodeType: node.type
    });
  }
  if (node.type === "variable") {
    issues.push({
      code: "predicate-variable-banned",
      severity: "error",
      message: "Profile.predicate must compile to a query-time boolean predicate and cannot use free jq variables.",
      nodeType: node.type
    });
  }
  if (node.type === "contextPath" && (node.root === "$new" || node.root === "$old")) {
    issues.push({
      code: "predicate-state-context-banned",
      severity: "error",
      message: `Profile.predicate must compile to a query-time boolean predicate and cannot use mutation state ${node.root}.`,
      nodeType: node.type
    });
  }
  if (isDynamicPathNode(node)) {
    issues.push({
      code: "predicate-dynamic-path-banned",
      severity: "error",
      message: "Profile.predicate must compile to a query-time boolean predicate and cannot use iterator, slice, or dynamic-index paths.",
      nodeType: node.type
    });
  }
  if (node.type === "call" && classifyBxlProfileFunction("predicate", node.name).safety !== "allow") {
    issues.push({
      code: "predicate-call-banned",
      severity: "error",
      message: `Profile.predicate must compile to a query-time boolean predicate and cannot use call ${node.name}.`,
      nodeType: node.type
    });
  }
  if (node.type === "binary" && node.operator === "," && isArrayComma(parent)) {
    return;
  }
  if (node.type === "binary" && node.operator === "|" && isPredicatePipe(node)) {
    return;
  }
  if (node.type === "binary" && !isPredicateOperator(node.operator)) {
    issues.push({
      code: "predicate-operator-banned",
      severity: "error",
      message: `Profile.predicate must compile to a query-time boolean predicate and cannot use operator ${node.operator}.`,
      nodeType: node.type
    });
  }
}
function validateDeriveNode(node, _parent, issues) {
  if (node.type === "contextPath") {
    issues.push({
      code: "derive-context-banned",
      severity: "error",
      message: `Profile.derive is for deterministic write/index-time computation and cannot use request or environment context ${node.root}.`,
      nodeType: node.type
    });
  }
  if (node.type === "call") {
    const decision = classifyBxlProfileFunction("derive", node.name);
    if (decision.safety === "deny") {
      issues.push({
        code: "derive-call-banned",
        severity: "error",
        message: `Profile.derive is for deterministic write/index-time computation and cannot use call ${node.name}${decision.message ? `: ${decision.message}` : ""}.`,
        nodeType: node.type
      });
    }
  }
}
function isArrayComma(parent) {
  return parent?.type === "array" || parent?.type === "binary" && parent.operator === ",";
}
function isPredicatePipe(node) {
  return node.right.type === "call" && (["IN", "overlaps"].includes(node.right.name) && node.right.args.length === 1 || node.right.name === "not" && node.right.args.length === 0);
}
function profileMessagePrefix(profile) {
  switch (profile) {
    case "compute":
      return "Profile.compute";
    case "policy":
      return "Profile.policy is for bounded request-time authorization decisions and";
    case "predicate":
      return "Profile.predicate must compile to a query-time boolean predicate and";
    case "derive":
      return "Profile.derive is for deterministic write/index-time computation and";
  }
}
function isPredicateOperator(operator) {
  return [
    "+",
    "-",
    "*",
    "/",
    "%",
    "and",
    "or",
    "==",
    "!=",
    "<",
    "<=",
    ">",
    ">=",
    "//"
  ].includes(operator);
}
function isDynamicPathNode(node) {
  return (node.type === "path" || node.type === "contextPath") && node.parts.some(
    (part) => part.type === "iterator" || part.type === "slice" || part.type === "dynamic-index"
  );
}
function fromJqExpression(node) {
  const path = pathFromJq(node);
  if (path) {
    return path;
  }
  switch (node.type) {
    case "str":
      return fromJqString(node);
    case "num":
      return { type: "literal", value: node.value, valueType: "number" };
    case "bool":
      return { type: "literal", value: node.value, valueType: "boolean" };
    case "null":
      return { type: "literal", value: null, valueType: "null" };
    case "filter":
      return fromJqFilter(node);
    case "binary":
      return fromJqBinary(node);
    case "unary":
      return fromJqUnary(node);
    case "if":
      return fromJqIf(node);
    case "array":
      return fromJqArray(node);
    case "object":
      return fromJqObject(node);
    case "def":
      return fromJqDef(node);
    case "try":
      return fromJqTry(node);
    case "reduce":
      return fromJqReduce(node);
    case "foreach":
      return fromJqForeach(node);
    case "varDeclaration":
      return fromJqVarDeclaration(node);
    case "label":
      return fromJqLabel(node);
    case "break":
      return fromJqBreak(node);
    case "format":
      return fromJqFormat(node);
    case "recursiveDescent":
      return { type: "recursiveDescent" };
    case "var":
      return { type: "variable", name: node.name };
    case "identity":
      return { type: "path", root: "current", parts: [] };
    case "index":
      return {
        type: "index",
        expr: fromJqExpression(node.expr),
        index: typeof node.index === "string" ? node.index : fromJqExpression(node.index)
      };
    case "slice":
      return {
        type: "slice",
        expr: fromJqExpression(node.expr),
        from: node.from ? fromJqExpression(node.from) : void 0,
        to: node.to ? fromJqExpression(node.to) : void 0
      };
    case "iterator":
      return {
        type: "iterator",
        expr: fromJqExpression(node.expr)
      };
  }
}
function fromJqString(node) {
  if (node.interpolated) {
    return {
      type: "literal",
      valueType: "interpolated-string",
      parts: node.parts.map(
        (part) => typeof part === "string" ? part : fromJqExpression(part)
      )
    };
  }
  return {
    type: "literal",
    value: node.value,
    valueType: "string",
    interpolated: false
  };
}
function fromJqFilter(node) {
  const { name, arity } = splitFilterName(node.name);
  return {
    type: "call",
    name,
    arity,
    args: node.args.map(fromJqExpression)
  };
}
function fromJqBinary(node) {
  return {
    type: "binary",
    operator: node.operator,
    left: fromJqExpression(node.left),
    right: fromJqExpression(node.right)
  };
}
function fromJqUnary(node) {
  return {
    type: "unary",
    operator: node.operator,
    expr: fromJqExpression(node.expr)
  };
}
function fromJqIf(node) {
  return {
    type: "if",
    cond: fromJqExpression(node.cond),
    then: fromJqExpression(node.then),
    elifs: (node.elifs ?? []).map((branch) => ({
      cond: fromJqExpression(branch.cond),
      then: fromJqExpression(branch.then)
    })),
    else: node.else ? fromJqExpression(node.else) : void 0
  };
}
function fromJqArray(node) {
  return {
    type: "array",
    expr: node.expr ? fromJqExpression(node.expr) : void 0
  };
}
function fromJqObject(node) {
  return {
    type: "object",
    entries: node.entries.map((entry) => {
      if (entry.value !== void 0) {
        return {
          key: typeof entry.key === "string" ? entry.key : fromJqExpression(entry.key),
          value: fromJqExpression(entry.value)
        };
      }
      return { key: entry.key };
    })
  };
}
function fromJqDef(node) {
  return {
    type: "def",
    name: node.name,
    args: node.args.map((arg) => ({
      type: arg.type === "filterArg" ? "filter" : "var",
      name: arg.name
    })),
    body: fromJqExpression(node.body),
    next: node.next ? fromJqExpression(node.next) : void 0
  };
}
function fromJqTry(node) {
  return {
    type: "try",
    short: node.short,
    body: fromJqExpression(node.body),
    catch: node.catch ? fromJqExpression(node.catch) : void 0
  };
}
function fromJqReduce(node) {
  return {
    type: "reduce",
    expr: fromJqExpression(node.expr),
    variable: node.var,
    init: fromJqExpression(node.init),
    update: fromJqExpression(node.update)
  };
}
function fromJqForeach(node) {
  return {
    type: "foreach",
    expr: fromJqExpression(node.expr),
    variable: node.var,
    init: fromJqExpression(node.init),
    update: fromJqExpression(node.update),
    extract: node.extract ? fromJqExpression(node.extract) : void 0
  };
}
function fromJqVarDeclaration(node) {
  return {
    type: "binding",
    expr: fromJqExpression(node.expr),
    names: node.destructuring.flatMap(destructuringNames),
    next: fromJqExpression(node.next)
  };
}
function fromJqLabel(node) {
  return {
    type: "label",
    value: node.value,
    next: fromJqExpression(node.next)
  };
}
function fromJqBreak(node) {
  return {
    type: "break",
    value: node.value
  };
}
function fromJqFormat(node) {
  return {
    type: "format",
    name: node.name
  };
}
function pathFromJq(node) {
  const parts = [];
  let current = node;
  while (true) {
    if (current.type === "index") {
      parts.unshift(indexPart(current));
      current = current.expr;
      continue;
    }
    if (current.type === "iterator") {
      parts.unshift({ type: "iterator" });
      current = current.expr;
      continue;
    }
    if (current.type === "slice") {
      parts.unshift({
        type: "slice",
        from: current.from ? fromJqExpression(current.from) : void 0,
        to: current.to ? fromJqExpression(current.to) : void 0
      });
      current = current.expr;
      continue;
    }
    break;
  }
  if (current.type === "identity") {
    return {
      type: "path",
      root: "current",
      parts
    };
  }
  if (current.type === "var") {
    if (isContextRoot(current.name)) {
      return {
        type: "contextPath",
        root: current.name,
        parts
      };
    }
    if (parts.length === 0) {
      return void 0;
    }
  }
  if (current.type === "format" && isContextRoot(current.name)) {
    return {
      type: "contextPath",
      root: current.name,
      parts
    };
  }
  if (current.type === "filter") {
    const { name, arity } = splitFilterName(current.name);
    if (arity === 0 && isContextRoot(name)) {
      return {
        type: "contextPath",
        root: name,
        parts
      };
    }
  }
  return void 0;
}
function indexPart(node) {
  if (typeof node.index === "string") {
    return { type: "field", key: node.index };
  }
  if (node.index.type === "num") {
    return { type: "index", value: node.index.value };
  }
  return {
    type: "dynamic-index",
    expr: fromJqExpression(node.index)
  };
}
function isContextRoot(value) {
  return value === "@User" || value === "@Env" || value === "$new" || value === "$old" || value === "Record";
}
function splitFilterName(name) {
  const slash = name.lastIndexOf("/");
  if (slash === -1) {
    return { name, arity: 0 };
  }
  return {
    name: name.slice(0, slash),
    arity: Number(name.slice(slash + 1))
  };
}
function destructuringNames(destructuring) {
  if (destructuring.type === "var") {
    return [destructuring.name];
  }
  if (destructuring.type === "arrayDestructuring") {
    return destructuring.destructuring.flatMap(destructuringNames);
  }
  return destructuring.entries.flatMap((entry) => {
    if (entry.destructuring !== void 0) {
      return destructuringNames(entry.destructuring);
    }
    return entry.key.type === "var" ? [entry.key.name] : [];
  });
}
function childNodes(node) {
  switch (node.type) {
    case "literal":
      return node.valueType === "interpolated-string" ? node.parts.filter((part) => typeof part !== "string") : [];
    case "path":
    case "contextPath":
      return node.parts.flatMap(pathPartChildren);
    case "variable":
    case "format":
    case "break":
    case "recursiveDescent":
      return [];
    case "call":
      return node.args;
    case "binary":
      return [node.left, node.right];
    case "unary":
      return [node.expr];
    case "if":
      return [
        node.cond,
        node.then,
        ...node.elifs.flatMap((branch) => [branch.cond, branch.then]),
        ...node.else ? [node.else] : []
      ];
    case "array":
      return node.expr ? [node.expr] : [];
    case "object":
      return node.entries.flatMap((entry) => {
        if (entry.value === void 0) {
          return [];
        }
        const children = [
          ...typeof entry.key === "string" ? [] : [entry.key],
          entry.value
        ];
        return children;
      });
    case "index":
      return [
        node.expr,
        ...typeof node.index === "string" ? [] : [node.index]
      ];
    case "slice":
      return [
        node.expr,
        ...node.from ? [node.from] : [],
        ...node.to ? [node.to] : []
      ];
    case "iterator":
      return [node.expr];
    case "def":
      return [node.body, ...node.next ? [node.next] : []];
    case "try":
      return [node.body, ...node.catch ? [node.catch] : []];
    case "reduce":
      return [node.expr, node.init, node.update];
    case "foreach":
      return [
        node.expr,
        node.init,
        node.update,
        ...node.extract ? [node.extract] : []
      ];
    case "binding":
      return [node.expr, node.next];
    case "label":
      return [node.next];
  }
}
function pathPartChildren(part) {
  switch (part.type) {
    case "dynamic-index":
      return [part.expr];
    case "slice":
      return [
        ...part.from ? [part.from] : [],
        ...part.to ? [part.to] : []
      ];
    default:
      return [];
  }
}

// src/bxl/sql/predicate-module.ts
var SQL_PREDICATE_MODULE = {
  name: "sql-predicate",
  grammar: String.raw`
SqlPredicate      = SqlOr ;
SqlOr             = SqlAnd, { "OR", SqlAnd } ;
SqlAnd            = SqlNot, { "AND", SqlNot } ;
SqlNot            = [ "NOT" ], SqlComparison ;
SqlComparison     = SqlValue
                  | SqlValue, CompareOp, SqlValue
                  | SqlValue, [ "NOT" ], "IN", ArrayOrContext
                  | SqlValue, [ "NOT" ], "BETWEEN", SqlValue, "AND", SqlValue
                  | SqlValue, [ "NOT" ], "LIKE", SqlLikePattern
                  | SqlValue, "IS", [ "NOT" ], ("NULL" | "TRUE" | "FALSE") ;
SqlValue          = SqlTerm, { ("+" | "-"), SqlTerm } ;
SqlTerm           = SqlFactor, { ("*" | "/" | "%"), SqlFactor } ;
SqlFactor         = FieldPath | ContextPath | Literal | ArrayLiteral | "(", SqlValue, ")" ;
CompareOp         = "=" | "==" | "!=" | "<>" | "<" | "<=" | ">" | ">=" ;
ArrayOrContext    = ArrayLiteral | ContextPath ;
SqlLikePattern    = String ;  (* SQL LIKE wildcards live in the string:
                                  "fish%" starts with fish,
                                  "%fish" ends with fish,
                                  "%fish%" contains fish,
                                  "_" matches one character. *)
`,
  mappings: [
    { syntax: "a = b", jq: "a == b", sql: "a = b" },
    { syntax: "a <> b", jq: "a != b", sql: "a <> b" },
    { syntax: "a != b", jq: "a != b", sql: "a <> b" },
    { syntax: "a < b / <= / > / >=", jq: "same operator", sql: "same operator" },
    { syntax: "a + b / - / * / / / %", jq: "same operator", sql: "same operator" },
    { syntax: "a IS NULL", jq: "a == null", sql: "a IS NULL" },
    { syntax: "a IS NOT NULL", jq: "a != null", sql: "a IS NOT NULL" },
    { syntax: "a IS TRUE", jq: "a == true", sql: "a IS TRUE" },
    { syntax: "a IS FALSE", jq: "a == false", sql: "a IS FALSE" },
    { syntax: "a IN [x, y]", jq: "a | IN([x, y])", sql: "a IN (?, ?)" },
    { syntax: "a NOT IN [x, y]", jq: "(a | IN([x, y])) | not", sql: "a NOT IN (?, ?)" },
    { syntax: "a BETWEEN lo AND hi", jq: "between(a; lo; hi)", sql: "a BETWEEN lo AND hi" },
    { syntax: "a NOT BETWEEN lo AND hi", jq: "between(a; lo; hi) | not", sql: "a NOT BETWEEN lo AND hi" },
    { syntax: 'a LIKE "fish%"', jq: 'like(a; "fish%")', sql: "a LIKE ?", notes: "% and _ are SQL LIKE wildcards inside the pattern string." },
    { syntax: 'a NOT LIKE "%fish%"', jq: 'like(a; "%fish%") | not', sql: "a NOT LIKE ?", notes: "No wildcard means exact string match." }
  ]
};

// src/error-utils.ts
function toBxlErrorRecord(error, fallbackPhase = "unknown") {
  if (error instanceof NativeJqDialectError) {
    return {
      phase: error.phase,
      name: error.name,
      message: error.message,
      stack: error.stack
    };
  }
  if (error instanceof ReadableSyntaxError) {
    return {
      phase: "compile",
      name: error.name,
      message: error.message,
      stack: error.stack
    };
  }
  if (error instanceof Error) {
    return {
      phase: fallbackPhase,
      name: error.name,
      message: error.message,
      stack: error.stack
    };
  }
  return {
    phase: fallbackPhase,
    name: "Error",
    message: String(error)
  };
}

// src/boxel-runtime.ts
function normalizeOutputs(outputs) {
  if (outputs.length === 0)
    return null;
  if (outputs.length === 1)
    return outputs[0];
  return outputs;
}
function normalizeExpressionSlot(value) {
  return typeof value === "string" ? value : value.expression;
}
function isExpressionValue(value) {
  return Boolean(
    value && typeof value === "object" && "expression" in value && typeof value.expression === "string"
  );
}
function humanizeKey(key) {
  return key.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim().replace(/\b\w/g, (char) => char.toUpperCase());
}
function normalizePath(path) {
  if (!path || path === ".") {
    return ".";
  }
  return path.startsWith(".") ? path : `.${path}`;
}
function parsePath(path) {
  const normalized = normalizePath(path);
  if (normalized === ".") {
    return [];
  }
  const out = [];
  let index = normalized.startsWith(".") ? 1 : 0;
  while (index < normalized.length) {
    if (normalized[index] === ".") {
      index++;
      continue;
    }
    if (normalized[index] === "[") {
      const close = normalized.indexOf("]", index);
      if (close === -1) {
        throw new Error(`Invalid path "${path}": missing closing ]`);
      }
      const raw = normalized.slice(index + 1, close).trim();
      if (!/^\d+$/.test(raw)) {
        throw new Error(
          `Invalid path "${path}": only numeric indexes are supported`
        );
      }
      out.push(Number(raw));
      index = close + 1;
      continue;
    }
    const start = index;
    while (index < normalized.length && normalized[index] !== "." && normalized[index] !== "[") {
      index++;
    }
    const key = normalized.slice(start, index);
    if (!key) {
      throw new Error(`Invalid path "${path}"`);
    }
    out.push(key);
  }
  return out;
}
function pathSegments(path) {
  return parsePath(path);
}
function pathRoot(path) {
  for (const segment of pathSegments(path)) {
    if (typeof segment === "string") {
      return segment;
    }
  }
  return null;
}
function leafKey(path) {
  const segments = pathSegments(path);
  for (let index = segments.length - 1; index >= 0; index--) {
    const segment = segments[index];
    if (typeof segment === "string") {
      return segment;
    }
  }
  return "value";
}
function cloneField(field) {
  return {
    key: field.key,
    label: field.label,
    displayName: field.displayName,
    kind: field.kind,
    fields: field.fields?.map(cloneField),
    item: field.item ? { fields: field.item.fields.map(cloneField) } : void 0
  };
}
function cloneSchema(schema) {
  return {
    fields: schema?.fields?.map(cloneField) ?? []
  };
}
function findField(schema, key) {
  return schema.fields.find((field) => field.key === key);
}
function ensureFieldForPath(schema, path, leafLabel) {
  const segments = pathSegments(path);
  if (segments.length === 0) {
    return;
  }
  let scope = schema;
  for (let index = 0; index < segments.length; index++) {
    const segment = segments[index];
    if (typeof segment !== "string") {
      continue;
    }
    const next = segments[index + 1];
    const desiredKind = next === void 0 ? "scalar" : typeof next === "number" ? "array" : "object";
    let field = findField(scope, segment);
    if (!field) {
      field = {
        key: segment,
        label: index === segments.length - 1 && leafLabel ? leafLabel : humanizeKey(segment)
      };
      if (desiredKind === "object") {
        field.kind = "object";
        field.fields = [];
      } else if (desiredKind === "array") {
        field.kind = "array";
        field.item = { fields: [] };
      }
      scope.fields.push(field);
    } else if (!field.label && index === segments.length - 1 && leafLabel) {
      field.label = leafLabel;
    }
    if (desiredKind === "object") {
      if (field.kind === void 0 || field.kind === "scalar") {
        field.kind = "object";
        field.fields = field.fields ?? [];
      }
      if (field.kind !== "object") {
        throw new Error(
          `Schema path conflict at "${segment}" while augmenting "${path}"`
        );
      }
      field.fields = field.fields ?? [];
      scope = { fields: field.fields };
      continue;
    }
    if (desiredKind === "array") {
      if (field.kind === void 0 || field.kind === "scalar") {
        field.kind = "array";
        field.item = field.item ?? { fields: [] };
      }
      if (field.kind !== "array") {
        throw new Error(
          `Schema path conflict at "${segment}" while augmenting "${path}"`
        );
      }
      field.item = field.item ?? { fields: [] };
      scope = field.item;
    }
  }
}
function prepareExpression(expression2, schema, options) {
  const prepared = prepareNativeJq(expression2, {
    schema,
    readableSyntax: options.readableSyntax,
    libraries: options.libraries ?? DEFAULT_BUILTIN_LIBRARIES,
    runtimeLimits: options.runtimeLimits
  });
  return {
    expression: expression2,
    deps: [...prepared.deps],
    warnings: prepared.readableWarnings,
    evaluate(input) {
      const run = prepared.run(input, {
        runtimeLimits: options.runtimeLimits
      });
      return normalizeOutputs(run.outputs);
    }
  };
}
function createRuleId(prefix, counter) {
  return `${prefix}-${String(counter).padStart(4, "0")}`;
}
function createErrorRecord(rule, message) {
  return {
    ruleId: rule.id,
    kind: rule.kind,
    expression: "prepared" in rule ? rule.prepared.expression : void 0,
    fieldPath: "fieldPath" in rule ? rule.fieldPath : void 0,
    targetPath: "targetPath" in rule ? rule.targetPath : void 0,
    message
  };
}
function toErrorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}
function coerceString(value) {
  if (value === null || value === void 0) {
    return void 0;
  }
  return typeof value === "string" ? value : String(value);
}
function collectRuntimeExpressions(definition) {
  const expressions = [];
  const add = (value) => {
    if (value) {
      expressions.push(normalizeExpressionSlot(value));
    }
  };
  const addLiteralOrExpression = (value) => {
    if (isExpressionValue(value)) {
      expressions.push(value.expression);
    }
  };
  for (const fieldGuide of definition.guide?.fieldGuides ?? []) {
    add(fieldGuide.visibleWhen);
    add(fieldGuide.suggestedValue);
    add(fieldGuide.defaultFrom);
    add(fieldGuide.computedVia);
    if (isExpressionValue(fieldGuide.required)) {
      expressions.push(fieldGuide.required.expression);
    }
    for (const constraint of fieldGuide.constraints ?? []) {
      add(constraint.expression);
    }
  }
  for (const constraint of definition.guide?.constraints ?? []) {
    add(constraint.expression);
  }
  for (const formula of definition.formulas ?? []) {
    add(formula.expression);
  }
  for (const annotation of definition.annotations ?? []) {
    add(annotation.when);
    addLiteralOrExpression(annotation.cardTitle);
    addLiteralOrExpression(annotation.summary);
    addLiteralOrExpression(annotation.details);
    addLiteralOrExpression(annotation.snippet);
    addLiteralOrExpression(annotation.previousValue);
    addLiteralOrExpression(annotation.newValue);
    addLiteralOrExpression(annotation.createdAt);
  }
  return expressions;
}
async function resolveLazyBoxelRuntimeOptions(definition, options) {
  const libraries = await resolveLazyBuiltinLibrariesForExpressions(
    collectRuntimeExpressions(definition),
    options.libraries ?? DEFAULT_BUILTIN_LIBRARIES
  );
  return { ...options, libraries };
}
function resolveLiteralOrExpression(value, state, prepared) {
  if (value === void 0) {
    return void 0;
  }
  if (typeof value === "string") {
    return value;
  }
  return coerceString(prepared?.evaluate(state));
}
function collectRuleWarnings(rule) {
  const preparedWarnings = "prepared" in rule ? [{ expression: rule.prepared.expression, warnings: rule.prepared.warnings }] : [
    rule.when && {
      expression: rule.when.expression,
      warnings: rule.when.warnings
    },
    rule.cardTitleExpression && {
      expression: rule.cardTitleExpression.expression,
      warnings: rule.cardTitleExpression.warnings
    },
    rule.summaryExpression && {
      expression: rule.summaryExpression.expression,
      warnings: rule.summaryExpression.warnings
    },
    rule.detailsExpression && {
      expression: rule.detailsExpression.expression,
      warnings: rule.detailsExpression.warnings
    },
    rule.snippetExpression && {
      expression: rule.snippetExpression.expression,
      warnings: rule.snippetExpression.warnings
    },
    rule.previousValueExpression && {
      expression: rule.previousValueExpression.expression,
      warnings: rule.previousValueExpression.warnings
    },
    rule.newValueExpression && {
      expression: rule.newValueExpression.expression,
      warnings: rule.newValueExpression.warnings
    },
    rule.createdAtExpression && {
      expression: rule.createdAtExpression.expression,
      warnings: rule.createdAtExpression.warnings
    }
  ].filter(Boolean);
  return preparedWarnings.flatMap(
    (entry) => entry && entry.warnings.length > 0 ? [{ ruleId: rule.id, expression: entry.expression, warnings: entry.warnings }] : []
  );
}
function buildFormulaDependencyOrder(rules) {
  const emittedByRoot = /* @__PURE__ */ new Map();
  for (const rule of rules) {
    for (const root of rule.emittedRoots) {
      const bucket = emittedByRoot.get(root) ?? [];
      bucket.push(rule.id);
      emittedByRoot.set(root, bucket);
    }
  }
  const edges = /* @__PURE__ */ new Map();
  const indegree = /* @__PURE__ */ new Map();
  for (const rule of rules) {
    indegree.set(rule.id, 0);
    edges.set(rule.id, /* @__PURE__ */ new Set());
  }
  for (const consumer of rules) {
    for (const dep of consumer.deps) {
      for (const producerId of emittedByRoot.get(dep) ?? []) {
        if (producerId === consumer.id) {
          continue;
        }
        const bucket = edges.get(producerId);
        if (!bucket.has(consumer.id)) {
          bucket.add(consumer.id);
          indegree.set(consumer.id, (indegree.get(consumer.id) ?? 0) + 1);
        }
      }
    }
  }
  const queue = rules.map((rule) => rule.id).filter((id) => (indegree.get(id) ?? 0) === 0);
  const order = [];
  while (queue.length > 0) {
    const next = queue.shift();
    order.push(next);
    for (const downstream of edges.get(next) ?? []) {
      const remaining = (indegree.get(downstream) ?? 1) - 1;
      indegree.set(downstream, remaining);
      if (remaining === 0) {
        queue.push(downstream);
      }
    }
  }
  if (order.length !== rules.length) {
    const unresolved = rules.map((rule) => rule.id).filter((id) => !order.includes(id));
    throw new Error(
      `Formula dependency cycle detected in Boxel runtime: ${unresolved.join(", ")}`
    );
  }
  return order;
}
function buildRuleSummary(rule) {
  return {
    id: rule.id,
    kind: rule.kind,
    expression: "prepared" in rule ? rule.prepared.expression : void 0,
    fieldPath: "fieldPath" in rule ? rule.fieldPath : void 0,
    targetPath: "targetPath" in rule ? rule.targetPath : void 0,
    deps: [...rule.deps],
    emits: "emittedRoots" in rule ? [...rule.emittedRoots] : []
  };
}
function isAnnotationRule(rule) {
  return rule.kind === "annotation";
}
function createReverseDeps(rules) {
  const reverse = /* @__PURE__ */ new Map();
  for (const rule of rules) {
    for (const dep of rule.deps) {
      const bucket = reverse.get(dep) ?? [];
      bucket.push(rule.id);
      reverse.set(dep, bucket);
    }
  }
  return reverse;
}
function collectAffectedRuleIds(runtime, changedRoots) {
  const affected = /* @__PURE__ */ new Set();
  const seenRoots = new Set(changedRoots);
  const queue = [...changedRoots];
  while (queue.length > 0) {
    const root = queue.shift();
    for (const ruleId of runtime.reverseDeps.get(root) ?? []) {
      if (affected.has(ruleId)) {
        continue;
      }
      affected.add(ruleId);
      const rule = runtime.rulesById.get(ruleId);
      if (rule?.kind === "formula") {
        for (const emittedRoot of rule.emittedRoots) {
          if (seenRoots.has(emittedRoot)) {
            continue;
          }
          seenRoots.add(emittedRoot);
          queue.push(emittedRoot);
        }
      }
    }
  }
  return runtime.rules.map((rule) => rule.id).filter((ruleId) => affected.has(ruleId));
}
function defaultFieldLabel(path) {
  return humanizeKey(leafKey(path));
}
function prepareBoxelRuntimeInternals(definition, options = {}) {
  const baseSchema = cloneSchema(options.schema ?? definition.schema);
  const warnings = [];
  const rules = [];
  const fieldStatics = /* @__PURE__ */ new Map();
  const fieldOrder = [];
  const formulaTargets = /* @__PURE__ */ new Set();
  let counter = 0;
  const guide = definition.guide;
  for (const fieldGuide of guide?.fieldGuides ?? []) {
    const path = normalizePath(fieldGuide.fieldPath);
    ensureFieldForPath(baseSchema, path, fieldGuide.label);
    if (fieldGuide.computedVia) {
      if (formulaTargets.has(path)) {
        throw new Error(`Duplicate formula target path ${path}`);
      }
      formulaTargets.add(path);
    }
  }
  for (const formula of definition.formulas ?? []) {
    const targetPath = normalizePath(formula.targetPath);
    if (formulaTargets.has(targetPath)) {
      throw new Error(`Duplicate formula target path ${targetPath}`);
    }
    formulaTargets.add(targetPath);
    ensureFieldForPath(baseSchema, targetPath, formula.label);
  }
  for (const fieldGuide of guide?.fieldGuides ?? []) {
    const path = normalizePath(fieldGuide.fieldPath);
    if (fieldStatics.has(path)) {
      throw new Error(`Duplicate field guide for path ${path}`);
    }
    fieldStatics.set(path, {
      path,
      label: fieldGuide.label ?? defaultFieldLabel(path),
      altLabel: fieldGuide.altLabel ?? null,
      helperText: fieldGuide.helperText ?? null,
      placeholder: fieldGuide.placeholder ?? null,
      required: fieldGuide.required === true,
      min: fieldGuide.min ?? null,
      max: fieldGuide.max ?? null,
      pattern: fieldGuide.pattern ?? null,
      note: fieldGuide.note ? { text: fieldGuide.note, author: fieldGuide.noteAuthor ?? null } : null
    });
    fieldOrder.push(path);
    ensureFieldForPath(baseSchema, path, fieldGuide.label);
    for (const constraint of fieldGuide.constraints ?? []) {
      const id = constraint.id ?? createRuleId("constraint", ++counter);
      const prepared = prepareExpression(
        normalizeExpressionSlot(constraint.expression),
        baseSchema,
        options
      );
      const rule = {
        id,
        kind: "constraint",
        fieldPath: path,
        deps: prepared.deps,
        message: constraint.message,
        severity: constraint.severity,
        prepared
      };
      warnings.push(...collectRuleWarnings(rule));
      rules.push(rule);
    }
    if (fieldGuide.visibleWhen) {
      const id = createRuleId("field-visible", ++counter);
      const prepared = prepareExpression(
        normalizeExpressionSlot(fieldGuide.visibleWhen),
        baseSchema,
        options
      );
      const rule = {
        id,
        kind: "field-visible",
        fieldPath: path,
        deps: prepared.deps,
        fallback: true,
        prepared
      };
      warnings.push(...collectRuleWarnings(rule));
      rules.push(rule);
    }
    if (isExpressionValue(fieldGuide.required)) {
      const id = createRuleId("field-required", ++counter);
      const prepared = prepareExpression(fieldGuide.required.expression, baseSchema, options);
      const rule = {
        id,
        kind: "field-required",
        fieldPath: path,
        deps: prepared.deps,
        fallback: false,
        prepared
      };
      warnings.push(...collectRuleWarnings(rule));
      rules.push(rule);
    }
    const suggestedExpr = fieldGuide.defaultFrom ?? fieldGuide.suggestedValue;
    if (suggestedExpr) {
      const id = createRuleId("field-suggested", ++counter);
      const prepared = prepareExpression(
        normalizeExpressionSlot(suggestedExpr),
        baseSchema,
        options
      );
      const rule = {
        id,
        kind: "field-suggested",
        fieldPath: path,
        deps: prepared.deps,
        fallback: false,
        suggestedLabel: fieldGuide.suggestedLabel,
        prepared
      };
      warnings.push(...collectRuleWarnings(rule));
      rules.push(rule);
    }
  }
  for (const constraint of guide?.constraints ?? []) {
    const id = constraint.id ?? createRuleId("constraint", ++counter);
    const fieldPath = normalizePath(constraint.fieldPath);
    const prepared = prepareExpression(
      normalizeExpressionSlot(constraint.expression),
      baseSchema,
      options
    );
    const rule = {
      id,
      kind: "constraint",
      fieldPath,
      deps: prepared.deps,
      message: constraint.message,
      severity: constraint.severity,
      prepared
    };
    warnings.push(...collectRuleWarnings(rule));
    rules.push(rule);
  }
  for (const fieldGuide of guide?.fieldGuides ?? []) {
    if (!fieldGuide.computedVia) {
      continue;
    }
    const targetPath = normalizePath(fieldGuide.fieldPath);
    const root = pathRoot(targetPath);
    if (!root) {
      throw new Error(`Formula target path ${targetPath} must not be root`);
    }
    const id = createRuleId("formula", ++counter);
    const prepared = prepareExpression(
      normalizeExpressionSlot(fieldGuide.computedVia),
      baseSchema,
      options
    );
    const rule = {
      id,
      kind: "formula",
      targetPath,
      emittedRoots: [root],
      deps: prepared.deps,
      prepared
    };
    warnings.push(...collectRuleWarnings(rule));
    rules.push(rule);
  }
  const explicitFormulas = definition.formulas ?? [];
  for (const formula of explicitFormulas) {
    const targetPath = normalizePath(formula.targetPath);
    const root = pathRoot(targetPath);
    if (!root) {
      throw new Error(`Formula target path ${targetPath} must not be root`);
    }
    const id = formula.id ?? createRuleId("formula", ++counter);
    const prepared = prepareExpression(
      normalizeExpressionSlot(formula.expression),
      baseSchema,
      options
    );
    const rule = {
      id,
      kind: "formula",
      targetPath,
      emittedRoots: [root],
      deps: prepared.deps,
      prepared
    };
    warnings.push(...collectRuleWarnings(rule));
    rules.push(rule);
  }
  for (const annotation of definition.annotations ?? []) {
    const id = annotation.id ?? createRuleId("annotation", ++counter);
    const deps = /* @__PURE__ */ new Set();
    const prepareOptional = (value) => {
      if (!isExpressionValue(value)) {
        return void 0;
      }
      const prepared = prepareExpression(value.expression, baseSchema, options);
      for (const dep of prepared.deps) {
        deps.add(dep);
      }
      return prepared;
    };
    const when = annotation.when ? prepareExpression(normalizeExpressionSlot(annotation.when), baseSchema, options) : void 0;
    for (const dep of when?.deps ?? []) {
      deps.add(dep);
    }
    const cardTitleExpression = prepareOptional(annotation.cardTitle);
    const summaryExpression = prepareOptional(annotation.summary);
    const detailsExpression = prepareOptional(annotation.details);
    const snippetExpression = prepareOptional(annotation.snippet);
    const previousValueExpression = prepareOptional(annotation.previousValue);
    const newValueExpression = prepareOptional(annotation.newValue);
    const createdAtExpression = prepareOptional(annotation.createdAt);
    const rule = {
      id,
      kind: "annotation",
      targetPath: normalizePath(annotation.targetPath),
      targetCardId: annotation.targetCardId,
      targetCardType: annotation.targetCardType,
      cardTitle: typeof annotation.cardTitle === "string" ? annotation.cardTitle : void 0,
      cardTitleExpression,
      annotationKind: annotation.kind,
      actor: annotation.actor,
      deps: [...deps],
      when,
      summary: typeof annotation.summary === "string" ? annotation.summary : void 0,
      summaryExpression,
      details: typeof annotation.details === "string" ? annotation.details : void 0,
      detailsExpression,
      snippet: typeof annotation.snippet === "string" ? annotation.snippet : void 0,
      snippetExpression,
      previousValue: typeof annotation.previousValue === "string" ? annotation.previousValue : void 0,
      previousValueExpression,
      newValue: typeof annotation.newValue === "string" ? annotation.newValue : void 0,
      newValueExpression,
      createdAt: typeof annotation.createdAt === "string" ? annotation.createdAt : void 0,
      createdAtExpression
    };
    warnings.push(...collectRuleWarnings(rule));
    rules.push(rule);
  }
  const rulesById = new Map(rules.map((rule) => [rule.id, rule]));
  const formulaRules = rules.filter(
    (rule) => rule.kind === "formula"
  );
  return {
    schema: baseSchema,
    warnings,
    rules,
    rulesById,
    reverseDeps: createReverseDeps(rules),
    formulaOrder: buildFormulaDependencyOrder(formulaRules),
    fieldStatics,
    fieldOrder,
    formulaRuleIds: new Set(formulaRules.map((rule) => rule.id))
  };
}
function evaluateFormulaRule(rule, state) {
  try {
    return {
      patch: {
        ruleId: rule.id,
        path: rule.targetPath,
        value: rule.prepared.evaluate(state)
      }
    };
  } catch (error) {
    return {
      patch: {
        ruleId: rule.id,
        path: rule.targetPath,
        value: null
      },
      error: createErrorRecord(rule, toErrorMessage(error))
    };
  }
}
function evaluateConstraintRule(rule, state) {
  try {
    const passed = Boolean(rule.prepared.evaluate(state));
    return {
      violation: passed ? null : {
        ruleId: rule.id,
        fieldPath: rule.fieldPath,
        expression: rule.prepared.expression,
        message: rule.message ?? "Constraint failed",
        severity: rule.severity ?? "error"
      }
    };
  } catch (error) {
    const message = toErrorMessage(error);
    return {
      violation: {
        ruleId: rule.id,
        fieldPath: rule.fieldPath,
        expression: rule.prepared.expression,
        message: rule.message ?? message,
        severity: rule.severity ?? "error",
        error: message
      },
      error: createErrorRecord(rule, message)
    };
  }
}
function evaluateFieldRule(rule, state) {
  try {
    const value = rule.prepared.evaluate(state);
    if (rule.kind === "field-suggested") {
      return {
        value: value === null || value === void 0 ? null : {
          value,
          label: rule.suggestedLabel ?? "suggested"
        }
      };
    }
    return {
      value: Boolean(value)
    };
  } catch (error) {
    return {
      value: rule.kind === "field-suggested" ? null : rule.fallback,
      error: createErrorRecord(rule, toErrorMessage(error))
    };
  }
}
function evaluateAnnotationRule(rule, state, now) {
  try {
    if (rule.when && !Boolean(rule.when.evaluate(state))) {
      return { entry: null };
    }
    const entry = {
      ruleId: rule.id,
      targetPath: rule.targetPath,
      kind: rule.annotationKind,
      summary: resolveLiteralOrExpression(rule.summary, state, rule.summaryExpression),
      details: resolveLiteralOrExpression(rule.details, state, rule.detailsExpression),
      snippet: resolveLiteralOrExpression(rule.snippet, state, rule.snippetExpression),
      previousValue: resolveLiteralOrExpression(
        rule.previousValue,
        state,
        rule.previousValueExpression
      ),
      newValue: resolveLiteralOrExpression(
        rule.newValue,
        state,
        rule.newValueExpression
      ),
      createdAt: resolveLiteralOrExpression(
        rule.createdAt,
        state,
        rule.createdAtExpression
      ) ?? now?.(),
      actor: rule.actor
    };
    return {
      entry,
      targetCardId: rule.targetCardId,
      targetCardType: rule.targetCardType,
      cardTitle: resolveLiteralOrExpression(
        rule.cardTitle,
        state,
        rule.cardTitleExpression
      ) ?? void 0
    };
  } catch (error) {
    return {
      entry: null,
      error: createErrorRecord(rule, toErrorMessage(error))
    };
  }
}
function buildFieldState(runtime, fieldOutputs, constraintOutputs) {
  const fieldState = /* @__PURE__ */ new Map();
  for (const path of runtime.fieldOrder) {
    const base = runtime.fieldStatics.get(path);
    fieldState.set(path, {
      path,
      label: base.label,
      altLabel: base.altLabel,
      helperText: base.helperText,
      placeholder: base.placeholder,
      required: base.required,
      visible: true,
      min: base.min,
      max: base.max,
      pattern: base.pattern,
      suggested: null,
      note: base.note,
      errors: []
    });
  }
  for (const [ruleId, output] of fieldOutputs) {
    const rule = runtime.rulesById.get(ruleId);
    if (!rule || !("fieldPath" in rule)) {
      continue;
    }
    const path = rule.fieldPath;
    const current = fieldState.get(path) ?? {
      path,
      label: defaultFieldLabel(path),
      altLabel: null,
      helperText: null,
      placeholder: null,
      required: false,
      visible: true,
      min: null,
      max: null,
      pattern: null,
      suggested: null,
      note: null,
      errors: []
    };
    if (rule.kind === "field-visible") {
      current.visible = Boolean(output.value);
    } else if (rule.kind === "field-required") {
      current.required = Boolean(output.value);
    } else if (rule.kind === "field-suggested") {
      current.suggested = output.value;
    }
    fieldState.set(path, current);
  }
  const violations = [];
  for (const output of constraintOutputs.values()) {
    if (!output.violation) {
      continue;
    }
    violations.push(output.violation);
    const current = fieldState.get(output.violation.fieldPath) ?? {
      path: output.violation.fieldPath,
      label: defaultFieldLabel(output.violation.fieldPath),
      altLabel: null,
      helperText: null,
      placeholder: null,
      required: false,
      visible: true,
      min: null,
      max: null,
      pattern: null,
      suggested: null,
      note: null,
      errors: []
    };
    current.errors.push(output.violation);
    fieldState.set(output.violation.fieldPath, current);
  }
  const orderedPaths = [
    ...runtime.fieldOrder,
    ...[...fieldState.keys()].filter((path) => !runtime.fieldOrder.includes(path))
  ];
  return {
    fieldState: Object.fromEntries(
      orderedPaths.map((path) => [path, fieldState.get(path)])
    ),
    fieldStateList: orderedPaths.map((path) => fieldState.get(path)),
    violations
  };
}
function buildAnnotationCards(outputs) {
  const grouped = /* @__PURE__ */ new Map();
  for (const output of outputs.values()) {
    if (!output.entry) {
      continue;
    }
    const key = [
      output.targetCardId ?? "",
      output.targetCardType ?? "",
      output.cardTitle ?? ""
    ].join("::");
    let card = grouped.get(key);
    if (!card) {
      card = {
        targetCardId: output.targetCardId,
        targetCardType: output.targetCardType,
        entries: [],
        cardTitle: output.cardTitle
      };
      grouped.set(key, card);
    }
    card.entries.push(output.entry);
  }
  return [...grouped.values()];
}
function buildRuntimeResult(runtime, source, state, formulaOutputs, constraintOutputs, fieldOutputs, annotationOutputs, evaluatedRuleIds, changedRoots) {
  const { fieldState, fieldStateList, violations } = buildFieldState(
    runtime,
    fieldOutputs,
    constraintOutputs
  );
  const formulaPatches = runtime.formulaOrder.map(
    (ruleId) => formulaOutputs.get(ruleId).patch
  );
  const evaluatedFormulaPatches = evaluatedRuleIds.filter((ruleId) => runtime.formulaRuleIds.has(ruleId)).map((ruleId) => formulaOutputs.get(ruleId).patch);
  const annotationCards = buildAnnotationCards(annotationOutputs);
  const runtimeErrors = [
    ...formulaOutputs.values(),
    ...constraintOutputs.values(),
    ...fieldOutputs.values(),
    ...annotationOutputs.values()
  ].map((output) => output.error).filter((error) => Boolean(error));
  return {
    source,
    state,
    fieldState,
    fieldStateList,
    violations,
    formulaPatches,
    annotationCards,
    runtimeErrors,
    delta: {
      changedRoots,
      evaluatedRuleIds,
      evaluatedFormulaPatches
    }
  };
}
function prepareBoxelRuntime(definition, options = {}) {
  const runtime = prepareBoxelRuntimeInternals(definition, options);
  const evaluateInput = (input) => {
    let source = structuredClone(input);
    let state = structuredClone(input);
    const formulaOutputs = /* @__PURE__ */ new Map();
    const constraintOutputs = /* @__PURE__ */ new Map();
    const fieldOutputs = /* @__PURE__ */ new Map();
    const annotationOutputs = /* @__PURE__ */ new Map();
    for (const ruleId of runtime.formulaOrder) {
      const rule = runtime.rulesById.get(ruleId);
      const output = evaluateFormulaRule(rule, state);
      state = setPath(state, parsePath(rule.targetPath), output.patch.value);
      formulaOutputs.set(rule.id, output);
    }
    for (const rule of runtime.rules) {
      if (rule.kind === "formula") {
        continue;
      }
      if (rule.kind === "constraint") {
        constraintOutputs.set(rule.id, evaluateConstraintRule(rule, state));
        continue;
      }
      if (rule.kind === "field-visible" || rule.kind === "field-required" || rule.kind === "field-suggested") {
        fieldOutputs.set(rule.id, evaluateFieldRule(rule, state));
        continue;
      }
      if (isAnnotationRule(rule)) {
        annotationOutputs.set(
          rule.id,
          evaluateAnnotationRule(rule, state, options.now)
        );
      }
    }
    return buildRuntimeResult(
      runtime,
      source,
      state,
      formulaOutputs,
      constraintOutputs,
      fieldOutputs,
      annotationOutputs,
      runtime.rules.map((rule) => rule.id),
      []
    );
  };
  return {
    schema: runtime.schema,
    warnings: runtime.warnings,
    rules: runtime.rules.map(buildRuleSummary),
    evaluate: evaluateInput,
    createSession(initialInput) {
      let sourceState = structuredClone(initialInput);
      let resolvedState = structuredClone(initialInput);
      let lastResult = null;
      const formulaOutputs = /* @__PURE__ */ new Map();
      const constraintOutputs = /* @__PURE__ */ new Map();
      const fieldOutputs = /* @__PURE__ */ new Map();
      const annotationOutputs = /* @__PURE__ */ new Map();
      const runAll = () => {
        sourceState = structuredClone(sourceState);
        resolvedState = structuredClone(sourceState);
        formulaOutputs.clear();
        constraintOutputs.clear();
        fieldOutputs.clear();
        annotationOutputs.clear();
        for (const ruleId of runtime.formulaOrder) {
          const rule = runtime.rulesById.get(ruleId);
          const output = evaluateFormulaRule(rule, resolvedState);
          resolvedState = setPath(
            resolvedState,
            parsePath(rule.targetPath),
            output.patch.value
          );
          formulaOutputs.set(rule.id, output);
        }
        for (const rule of runtime.rules) {
          if (rule.kind === "formula") {
            continue;
          }
          if (rule.kind === "constraint") {
            constraintOutputs.set(rule.id, evaluateConstraintRule(rule, resolvedState));
            continue;
          }
          if (rule.kind === "field-visible" || rule.kind === "field-required" || rule.kind === "field-suggested") {
            fieldOutputs.set(rule.id, evaluateFieldRule(rule, resolvedState));
            continue;
          }
          if (isAnnotationRule(rule)) {
            annotationOutputs.set(
              rule.id,
              evaluateAnnotationRule(rule, resolvedState, options.now)
            );
          }
        }
        lastResult = buildRuntimeResult(
          runtime,
          sourceState,
          resolvedState,
          formulaOutputs,
          constraintOutputs,
          fieldOutputs,
          annotationOutputs,
          runtime.rules.map((rule) => rule.id),
          []
        );
        return lastResult;
      };
      const runAffected = (changedRoots) => {
        if (!lastResult) {
          return runAll();
        }
        resolvedState = structuredClone(resolvedState);
        const affectedRuleIds = collectAffectedRuleIds(runtime, changedRoots);
        for (const ruleId of runtime.formulaOrder) {
          if (!affectedRuleIds.includes(ruleId)) {
            continue;
          }
          const rule = runtime.rulesById.get(ruleId);
          const output = evaluateFormulaRule(rule, resolvedState);
          resolvedState = setPath(
            resolvedState,
            parsePath(rule.targetPath),
            output.patch.value
          );
          formulaOutputs.set(rule.id, output);
        }
        for (const ruleId of affectedRuleIds) {
          if (runtime.formulaRuleIds.has(ruleId)) {
            continue;
          }
          const rule = runtime.rulesById.get(ruleId);
          if (rule.kind === "constraint") {
            constraintOutputs.set(rule.id, evaluateConstraintRule(rule, resolvedState));
            continue;
          }
          if (rule.kind === "field-visible" || rule.kind === "field-required" || rule.kind === "field-suggested") {
            fieldOutputs.set(rule.id, evaluateFieldRule(rule, resolvedState));
            continue;
          }
          if (isAnnotationRule(rule)) {
            annotationOutputs.set(
              rule.id,
              evaluateAnnotationRule(rule, resolvedState, options.now)
            );
          }
        }
        lastResult = buildRuntimeResult(
          runtime,
          sourceState,
          resolvedState,
          formulaOutputs,
          constraintOutputs,
          fieldOutputs,
          annotationOutputs,
          affectedRuleIds,
          changedRoots
        );
        return lastResult;
      };
      return {
        get source() {
          return sourceState;
        },
        get state() {
          return resolvedState;
        },
        get result() {
          return lastResult;
        },
        evaluate() {
          return runAll();
        },
        replace(input) {
          sourceState = structuredClone(input);
          resolvedState = structuredClone(input);
          return runAll();
        },
        applyPatch(path, value) {
          const normalizedPath = normalizePath(path);
          const root = pathRoot(normalizedPath);
          sourceState = setPath(sourceState, parsePath(normalizedPath), value);
          resolvedState = setPath(resolvedState, parsePath(normalizedPath), value);
          return runAffected(root ? [root] : []);
        }
      };
    }
  };
}
function prepareBoxelGuide(guide, options = {}) {
  return prepareBoxelRuntime({ guide }, options);
}
function prepareBoxelRuntimeSafe(definition, options = {}) {
  try {
    return {
      ok: true,
      value: prepareBoxelRuntime(definition, options)
    };
  } catch (error) {
    return {
      ok: false,
      error: toBxlErrorRecord(error, "prepare")
    };
  }
}
function prepareBoxelGuideSafe(guide, options = {}) {
  return prepareBoxelRuntimeSafe({ guide }, options);
}
function getBoxelValue(input, path) {
  return getPath(input, parsePath(path));
}
var BOXEL_RUNTIME_ASYNC_PROTOCOL = "boxel-runtime-async:v1";
var LOCAL_ASYNC_PREPARED_RUNTIME = Symbol("LocalAsyncPreparedRuntime");
var WORKER_ASYNC_PREPARED_RUNTIME = Symbol("WorkerAsyncPreparedRuntime");
function cloneValue(value) {
  return structuredClone(value);
}
function stableSerialize(value) {
  if (value === null || value === void 0) {
    return JSON.stringify(value);
  }
  const valueType = typeof value;
  if (valueType === "string" || valueType === "number" || valueType === "boolean") {
    return JSON.stringify(value);
  }
  if (valueType === "bigint") {
    return JSON.stringify({ $bigint: String(value) });
  }
  if (Array.isArray(value)) {
    return `[${value.map((entry) => stableSerialize(entry)).join(",")}]`;
  }
  if (value instanceof Date) {
    return JSON.stringify({ $date: value.toISOString() });
  }
  if (valueType === "object") {
    const entries = Object.entries(value).filter(([, entry]) => entry !== void 0).sort(([left], [right]) => left.localeCompare(right)).map(
      ([key, entry]) => `${JSON.stringify(key)}:${stableSerialize(entry)}`
    );
    return `{${entries.join(",")}}`;
  }
  return JSON.stringify(String(value));
}
function hashString(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index++) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}
function buildPreparedContentHash(definition, options) {
  return hashString(
    stableSerialize({
      definition,
      compileOptions: {
        schema: options.schema ?? null,
        libraries: options.libraries ?? DEFAULT_BUILTIN_LIBRARIES,
        readableSyntax: options.readableSyntax ?? null,
        runtimeLimits: options.runtimeLimits ?? null
      }
    })
  );
}
function buildPreparedCacheNamespace(options) {
  return options.cacheKey ?? options.guideUrl ?? "inline";
}
function createPreparedPlanIdentity(definition, options) {
  const contentHash = options.contentHash ?? buildPreparedContentHash(definition, options);
  const cacheNamespace = buildPreparedCacheNamespace(options);
  const cacheKey = [
    BOXEL_RUNTIME_ASYNC_PROTOCOL,
    cacheNamespace,
    contentHash
  ].join("::");
  return {
    cacheKey,
    cacheNamespace,
    contentHash,
    guideUrl: options.guideUrl
  };
}
function createPreparedPlanPayload(definition, options) {
  const identity = createPreparedPlanIdentity(definition, options);
  return {
    ...identity,
    definition: cloneValue(definition),
    options: {
      schema: cloneValue(options.schema),
      libraries: options.libraries ? [...options.libraries] : DEFAULT_BUILTIN_LIBRARIES,
      readableSyntax: options.readableSyntax,
      runtimeLimits: cloneValue(options.runtimeLimits)
    }
  };
}
function canUseBrowserWorkerRuntime(options) {
  if (options.worker === false) {
    return false;
  }
  const scope = globalThis;
  return Boolean(
    scope.window && typeof scope.Worker === "function" && typeof scope.Blob === "function" && scope.URL && typeof scope.URL.createObjectURL === "function"
  );
}
function toSerializedWorkerError(error) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack
    };
  }
  return {
    name: "Error",
    message: String(error)
  };
}
function fromSerializedWorkerError(error) {
  const output = new Error(error.message);
  output.name = error.name;
  output.stack = error.stack;
  return output;
}
function snapshotSession(session) {
  return {
    source: cloneValue(session.source),
    state: cloneValue(session.state),
    result: cloneValue(session.result)
  };
}
function isWorkerRuntimeScope() {
  const scope = globalThis;
  return Boolean(
    typeof scope.document === "undefined" && typeof scope.postMessage === "function" && typeof scope.addEventListener === "function"
  );
}
function __runBoxelRuntimeWorker() {
  if (!isWorkerRuntimeScope()) {
    throw new Error("Boxel runtime worker bootstrap must run inside a worker.");
  }
  const scope = globalThis;
  if (scope.__boxelRuntimeWorkerStarted) {
    return;
  }
  scope.__boxelRuntimeWorkerStarted = true;
  const plans = /* @__PURE__ */ new Map();
  const sessions = /* @__PURE__ */ new Map();
  const ensurePlan = async (payload) => {
    let entry = plans.get(payload.cacheKey);
    if (!entry) {
      const prepared = prepareBoxelRuntime(
        payload.definition,
        await resolveLazyBoxelRuntimeOptions(payload.definition, payload.options)
      );
      entry = {
        prepared,
        metadata: {
          cacheKey: payload.cacheKey,
          cacheNamespace: payload.cacheNamespace,
          contentHash: payload.contentHash,
          guideUrl: payload.guideUrl,
          schema: cloneValue(prepared.schema),
          warnings: cloneValue(prepared.warnings),
          rules: cloneValue(prepared.rules)
        }
      };
      plans.set(payload.cacheKey, entry);
    }
    return entry;
  };
  scope.addEventListener("message", async (event) => {
    const request = event.data;
    try {
      switch (request.type) {
        case "ensure-plan": {
          const prepared = await ensurePlan(request);
          scope.postMessage({
            requestId: request.requestId,
            ok: true,
            value: cloneValue(prepared.metadata)
          });
          return;
        }
        case "invalidate-plans": {
          let removed = 0;
          if (request.cacheKey) {
            removed = plans.delete(request.cacheKey) ? 1 : 0;
          } else if (request.cacheNamespace) {
            for (const [cacheKey, entry] of plans.entries()) {
              if (entry.metadata.cacheNamespace !== request.cacheNamespace) {
                continue;
              }
              plans.delete(cacheKey);
              removed += 1;
            }
          } else {
            removed = plans.size;
            plans.clear();
          }
          scope.postMessage({
            requestId: request.requestId,
            ok: true,
            value: removed
          });
          return;
        }
        case "evaluate-plan": {
          const entry = plans.get(request.cacheKey);
          if (!entry) {
            throw new Error(`No prepared Boxel runtime plan for ${request.cacheKey}`);
          }
          scope.postMessage({
            requestId: request.requestId,
            ok: true,
            value: cloneValue(entry.prepared.evaluate(request.input))
          });
          return;
        }
        case "create-session": {
          const entry = plans.get(request.cacheKey);
          if (!entry) {
            throw new Error(`No prepared Boxel runtime plan for ${request.cacheKey}`);
          }
          const session = entry.prepared.createSession(request.initialInput);
          sessions.set(request.sessionId, session);
          scope.postMessage({
            requestId: request.requestId,
            ok: true,
            value: snapshotSession(session)
          });
          return;
        }
        case "session-evaluate": {
          const session = sessions.get(request.sessionId);
          if (!session) {
            throw new Error(`No Boxel runtime session ${request.sessionId}`);
          }
          session.evaluate();
          scope.postMessage({
            requestId: request.requestId,
            ok: true,
            value: snapshotSession(session)
          });
          return;
        }
        case "session-replace": {
          const session = sessions.get(request.sessionId);
          if (!session) {
            throw new Error(`No Boxel runtime session ${request.sessionId}`);
          }
          session.replace(request.input);
          scope.postMessage({
            requestId: request.requestId,
            ok: true,
            value: snapshotSession(session)
          });
          return;
        }
        case "session-apply-patch": {
          const session = sessions.get(request.sessionId);
          if (!session) {
            throw new Error(`No Boxel runtime session ${request.sessionId}`);
          }
          session.applyPatch(request.path, request.value);
          scope.postMessage({
            requestId: request.requestId,
            ok: true,
            value: snapshotSession(session)
          });
          return;
        }
        case "session-swap-plan": {
          const session = sessions.get(request.sessionId);
          if (!session) {
            throw new Error(`No Boxel runtime session ${request.sessionId}`);
          }
          const entry = plans.get(request.cacheKey);
          if (!entry) {
            throw new Error(`No prepared Boxel runtime plan for ${request.cacheKey}`);
          }
          const nextSession = entry.prepared.createSession(session.source);
          nextSession.evaluate();
          sessions.set(request.sessionId, nextSession);
          scope.postMessage({
            requestId: request.requestId,
            ok: true,
            value: snapshotSession(nextSession)
          });
          return;
        }
        case "session-dispose": {
          sessions.delete(request.sessionId);
          scope.postMessage({
            requestId: request.requestId,
            ok: true,
            value: null
          });
          return;
        }
      }
    } catch (error) {
      scope.postMessage({
        requestId: request.requestId,
        ok: false,
        error: toSerializedWorkerError(error)
      });
    }
  });
}
var BoxelRuntimeWorkerManager = class {
  #worker;
  #requestCounter = 0;
  #pending = /* @__PURE__ */ new Map();
  constructor() {
    this.#worker = this.#createWorker();
    this.#worker.addEventListener("message", (event) => {
      const response = event.data;
      const pending = this.#pending.get(response.requestId);
      if (!pending) {
        return;
      }
      this.#pending.delete(response.requestId);
      if (response.ok) {
        pending.resolve(response.value);
      } else {
        pending.reject(fromSerializedWorkerError(response.error));
      }
    });
    this.#worker.addEventListener("error", (event) => {
      const error = event.error ?? new Error(event.message);
      for (const pending of this.#pending.values()) {
        pending.reject(error);
      }
      this.#pending.clear();
    });
  }
  #createWorker() {
    const bootstrap = [
      `import { __runBoxelRuntimeWorker } from ${JSON.stringify(import.meta.url)};`,
      "__runBoxelRuntimeWorker();"
    ].join("\n");
    const scope = globalThis;
    const WorkerCtor = scope.Worker;
    if (!WorkerCtor) {
      throw new Error("Web Worker constructor is unavailable.");
    }
    const objectUrl = URL.createObjectURL(
      new Blob([bootstrap], { type: "text/javascript" })
    );
    const worker = new WorkerCtor(objectUrl, {
      name: "boxel-runtime",
      type: "module"
    });
    URL.revokeObjectURL(objectUrl);
    return worker;
  }
  async request(request) {
    const requestId = `boxel-runtime-request-${++this.#requestCounter}`;
    const promise = new Promise((resolve, reject) => {
      this.#pending.set(requestId, {
        resolve(value) {
          resolve(value);
        },
        reject
      });
    });
    this.#worker.postMessage({ ...request, requestId });
    return promise;
  }
  ensurePlan(payload) {
    return this.request({
      type: "ensure-plan",
      ...payload
    });
  }
  invalidatePlans(cacheKey, cacheNamespace) {
    return this.request({
      type: "invalidate-plans",
      cacheKey,
      cacheNamespace
    });
  }
  evaluate(cacheKey, input) {
    return this.request({
      type: "evaluate-plan",
      cacheKey,
      input
    });
  }
  createSession(cacheKey, sessionId, initialInput) {
    return this.request({
      type: "create-session",
      cacheKey,
      sessionId,
      initialInput
    });
  }
  evaluateSession(sessionId) {
    return this.request({
      type: "session-evaluate",
      sessionId
    });
  }
  replaceSession(sessionId, input) {
    return this.request({
      type: "session-replace",
      sessionId,
      input
    });
  }
  applyPatchToSession(sessionId, path, value) {
    return this.request({
      type: "session-apply-patch",
      sessionId,
      path,
      value
    });
  }
  swapSessionPlan(sessionId, cacheKey) {
    return this.request({
      type: "session-swap-plan",
      sessionId,
      cacheKey
    });
  }
  disposeSession(sessionId) {
    return this.request({
      type: "session-dispose",
      sessionId
    });
  }
};
var boxelRuntimeWorkerManager = null;
var preparedAsyncRuntimeCache = /* @__PURE__ */ new Map();
var boxelRuntimeSessionCounter = 0;
function getBoxelRuntimeWorkerManager() {
  if (!boxelRuntimeWorkerManager) {
    boxelRuntimeWorkerManager = new BoxelRuntimeWorkerManager();
  }
  return boxelRuntimeWorkerManager;
}
function nextAsyncSessionId() {
  boxelRuntimeSessionCounter += 1;
  return `boxel-runtime-session-${boxelRuntimeSessionCounter}`;
}
function getCachedPreparedAsyncRuntime(cacheKey) {
  const entry = preparedAsyncRuntimeCache.get(cacheKey);
  if (!entry) {
    return void 0;
  }
  if (entry.promise) {
    return entry.promise;
  }
  const prepared = entry.runtimeRef?.deref();
  if (prepared) {
    return Promise.resolve(prepared);
  }
  preparedAsyncRuntimeCache.delete(cacheKey);
  if (entry.workerBacked && boxelRuntimeWorkerManager) {
    void boxelRuntimeWorkerManager.invalidatePlans(cacheKey).catch(
      () => void 0
    );
  }
  return void 0;
}
function setCachedPreparedAsyncRuntime(entry) {
  preparedAsyncRuntimeCache.set(entry.cacheKey, entry);
}
function deleteCachedPreparedAsyncRuntime(cacheKey) {
  preparedAsyncRuntimeCache.delete(cacheKey);
}
function cleanupStalePreparedAsyncRuntimes(cacheKeyOrNamespace) {
  for (const [cacheKey, entry] of preparedAsyncRuntimeCache.entries()) {
    if (cacheKeyOrNamespace && cacheKey !== cacheKeyOrNamespace && entry.cacheNamespace !== cacheKeyOrNamespace) {
      continue;
    }
    if (entry.promise) {
      continue;
    }
    if (entry.runtimeRef?.deref()) {
      continue;
    }
    preparedAsyncRuntimeCache.delete(cacheKey);
    if (entry.workerBacked && boxelRuntimeWorkerManager) {
      void boxelRuntimeWorkerManager.invalidatePlans(cacheKey).catch(
        () => void 0
      );
    }
  }
}
function prunePreparedAsyncRuntimeNamespace(cacheNamespace, retainedCacheKey, workerBacked) {
  for (const [cacheKey, entry] of preparedAsyncRuntimeCache.entries()) {
    if (cacheKey === retainedCacheKey || entry.cacheNamespace !== cacheNamespace || Boolean(entry.workerBacked) !== workerBacked) {
      continue;
    }
    preparedAsyncRuntimeCache.delete(cacheKey);
  }
}
function invalidateLocalPreparedAsyncRuntimeCache(cacheKeyOrNamespace) {
  cleanupStalePreparedAsyncRuntimes(cacheKeyOrNamespace);
  if (!cacheKeyOrNamespace) {
    const removed2 = preparedAsyncRuntimeCache.size;
    preparedAsyncRuntimeCache.clear();
    return removed2;
  }
  let removed = 0;
  for (const [cacheKey, entry] of preparedAsyncRuntimeCache.entries()) {
    if (cacheKey !== cacheKeyOrNamespace && entry.cacheNamespace !== cacheKeyOrNamespace) {
      continue;
    }
    preparedAsyncRuntimeCache.delete(cacheKey);
    removed += 1;
  }
  return removed;
}
function getLocalAsyncPreparedRuntime(prepared) {
  return prepared[LOCAL_ASYNC_PREPARED_RUNTIME] ?? null;
}
function getWorkerAsyncPreparedRuntime(prepared) {
  return prepared[WORKER_ASYNC_PREPARED_RUNTIME] ?? null;
}
var BaseAsyncBoxelRuntimeSession = class {
  ready;
  #source;
  #state;
  #result;
  #operationQueue = Promise.resolve();
  constructor(initialInput) {
    this.#source = cloneValue(initialInput);
    this.#state = cloneValue(initialInput);
    this.#result = null;
    this.ready = Promise.resolve();
  }
  get source() {
    return this.#source;
  }
  get state() {
    return this.#state;
  }
  get result() {
    return this.#result;
  }
  applySnapshot(snapshot) {
    this.#source = snapshot.source;
    this.#state = snapshot.state;
    this.#result = snapshot.result;
  }
  queue(operation) {
    const next = this.#operationQueue.then(operation, operation);
    this.#operationQueue = next.then(
      () => void 0,
      () => void 0
    );
    return next;
  }
  async evaluate() {
    return this.queue(async () => {
      await this.ready;
      const snapshot = await this.evaluateRemote();
      this.applySnapshot(snapshot);
      return snapshot.result ?? buildMissingRuntimeResultError();
    });
  }
  async replace(input) {
    return this.queue(async () => {
      await this.ready;
      const snapshot = await this.replaceRemote(input);
      this.applySnapshot(snapshot);
      return snapshot.result ?? buildMissingRuntimeResultError();
    });
  }
  async applyPatch(path, value) {
    return this.queue(async () => {
      await this.ready;
      const snapshot = await this.applyPatchRemote(path, value);
      this.applySnapshot(snapshot);
      return snapshot.result ?? buildMissingRuntimeResultError();
    });
  }
  async swapPlan(prepared) {
    return this.queue(async () => {
      await this.ready;
      const snapshot = await this.swapPlanRemote(prepared);
      this.applySnapshot(snapshot);
      return snapshot.result ?? buildMissingRuntimeResultError();
    });
  }
  async dispose() {
    await this.queue(async () => {
      await this.ready.catch(() => void 0);
      await this.disposeRemote();
    });
  }
};
function buildMissingRuntimeResultError() {
  throw new Error("Boxel runtime session did not return a result.");
}
var LocalAsyncBoxelRuntimeSession = class extends BaseAsyncBoxelRuntimeSession {
  #session;
  constructor(session, initialInput) {
    super(initialInput);
    this.#session = session;
    this.ready = this.initialize();
  }
  async initialize() {
  }
  async evaluateRemote() {
    this.#session.evaluate();
    return snapshotSession(this.#session);
  }
  async replaceRemote(input) {
    this.#session.replace(input);
    return snapshotSession(this.#session);
  }
  async applyPatchRemote(path, value) {
    this.#session.applyPatch(path, value);
    return snapshotSession(this.#session);
  }
  async swapPlanRemote(prepared) {
    const localPrepared = getLocalAsyncPreparedRuntime(prepared);
    if (!localPrepared) {
      throw new Error(
        "Cannot swap a local async Boxel runtime session to a worker-backed prepared plan. Recreate the session with the new prepared runtime instead."
      );
    }
    this.#session = localPrepared.createSession(this.source);
    this.#session.evaluate();
    return snapshotSession(this.#session);
  }
  async disposeRemote() {
  }
};
var WorkerBackedBoxelRuntimeSession = class extends BaseAsyncBoxelRuntimeSession {
  #manager;
  #cacheKey;
  #sessionId;
  constructor(manager, cacheKey, initialInput) {
    super(initialInput);
    this.#manager = manager;
    this.#cacheKey = cacheKey;
    this.#sessionId = nextAsyncSessionId();
    this.ready = this.initialize();
  }
  async initialize() {
    const snapshot = await this.#manager.createSession(
      this.#cacheKey,
      this.#sessionId,
      this.source
    );
    this.applySnapshot(snapshot);
  }
  evaluateRemote() {
    return this.#manager.evaluateSession(this.#sessionId);
  }
  replaceRemote(input) {
    return this.#manager.replaceSession(this.#sessionId, input);
  }
  applyPatchRemote(path, value) {
    return this.#manager.applyPatchToSession(this.#sessionId, path, value);
  }
  async swapPlanRemote(prepared) {
    const workerPrepared = getWorkerAsyncPreparedRuntime(prepared);
    if (!workerPrepared) {
      throw new Error(
        "Cannot swap a worker-backed Boxel runtime session to a local prepared plan. Recreate the session with the new prepared runtime instead."
      );
    }
    this.#cacheKey = workerPrepared.metadata.cacheKey;
    return this.#manager.swapSessionPlan(
      this.#sessionId,
      workerPrepared.metadata.cacheKey
    );
  }
  disposeRemote() {
    return this.#manager.disposeSession(this.#sessionId);
  }
};
async function createLocalAsyncPreparedBoxelRuntime(payload) {
  const prepared = prepareBoxelRuntime(
    payload.definition,
    await resolveLazyBoxelRuntimeOptions(payload.definition, payload.options)
  );
  const runtime = {
    cacheKey: payload.cacheKey,
    cacheNamespace: payload.cacheNamespace,
    contentHash: payload.contentHash,
    guideUrl: payload.guideUrl,
    schema: prepared.schema,
    warnings: prepared.warnings,
    rules: prepared.rules,
    async evaluate(input) {
      return prepared.evaluate(input);
    },
    createSession(initialInput) {
      return new LocalAsyncBoxelRuntimeSession(
        prepared.createSession(initialInput),
        initialInput
      );
    }
  };
  runtime[LOCAL_ASYNC_PREPARED_RUNTIME] = prepared;
  return runtime;
}
function createWorkerBackedPreparedBoxelRuntime(manager, metadata) {
  const runtime = {
    cacheKey: metadata.cacheKey,
    cacheNamespace: metadata.cacheNamespace,
    contentHash: metadata.contentHash,
    guideUrl: metadata.guideUrl,
    schema: metadata.schema,
    warnings: metadata.warnings,
    rules: metadata.rules,
    evaluate(input) {
      return manager.evaluate(metadata.cacheKey, input);
    },
    createSession(initialInput) {
      return new WorkerBackedBoxelRuntimeSession(
        manager,
        metadata.cacheKey,
        initialInput
      );
    }
  };
  runtime[WORKER_ASYNC_PREPARED_RUNTIME] = {
    manager,
    metadata
  };
  return runtime;
}
async function prepareBoxelRuntimeAsync(definition, options = {}) {
  const payload = createPreparedPlanPayload(definition, options);
  cleanupStalePreparedAsyncRuntimes(payload.cacheNamespace);
  const useWorkerRuntime = canUseBrowserWorkerRuntime(options);
  const cached = getCachedPreparedAsyncRuntime(payload.cacheKey);
  if (cached) {
    return cached;
  }
  const cacheEntry = {
    cacheKey: payload.cacheKey,
    cacheNamespace: payload.cacheNamespace
  };
  const preparedPromise = (async () => {
    const prepared = !useWorkerRuntime ? await createLocalAsyncPreparedBoxelRuntime(payload) : createWorkerBackedPreparedBoxelRuntime(
      getBoxelRuntimeWorkerManager(),
      await getBoxelRuntimeWorkerManager().ensurePlan(payload)
    );
    cacheEntry.workerBacked = Boolean(
      getWorkerAsyncPreparedRuntime(prepared)
    );
    cacheEntry.runtimeRef = typeof WeakRef === "function" ? new WeakRef(prepared) : void 0;
    cacheEntry.promise = cacheEntry.runtimeRef ? void 0 : Promise.resolve(prepared);
    if (!useWorkerRuntime) {
      prunePreparedAsyncRuntimeNamespace(
        payload.cacheNamespace,
        payload.cacheKey,
        false
      );
    }
    return prepared;
  })();
  cacheEntry.promise = preparedPromise;
  setCachedPreparedAsyncRuntime(cacheEntry);
  try {
    return await preparedPromise;
  } catch (error) {
    deleteCachedPreparedAsyncRuntime(payload.cacheKey);
    throw error;
  }
}
async function invalidateBoxelRuntimeAsyncCache(cacheKeyOrNamespace) {
  const exactCacheKey = cacheKeyOrNamespace?.startsWith(
    `${BOXEL_RUNTIME_ASYNC_PROTOCOL}::`
  ) ? cacheKeyOrNamespace : void 0;
  const localInvalidated = invalidateLocalPreparedAsyncRuntimeCache(
    cacheKeyOrNamespace
  );
  let workerInvalidated = 0;
  if (boxelRuntimeWorkerManager) {
    workerInvalidated = await boxelRuntimeWorkerManager.invalidatePlans(
      exactCacheKey,
      cacheKeyOrNamespace
    );
  }
  return Math.max(localInvalidated, workerInvalidated);
}
function prepareBoxelGuideAsync(guide, options = {}) {
  return prepareBoxelRuntimeAsync({ guide }, options);
}
async function prepareBoxelRuntimeAsyncSafe(definition, options = {}) {
  try {
    return {
      ok: true,
      value: await prepareBoxelRuntimeAsync(definition, options)
    };
  } catch (error) {
    return {
      ok: false,
      error: toBxlErrorRecord(error, "prepare")
    };
  }
}
function prepareBoxelGuideAsyncSafe(guide, options = {}) {
  return prepareBoxelRuntimeAsyncSafe({ guide }, options);
}

// src/index.ts
var VERSION = "0.1.0-dev.0";
var BXL_BUILD_INFO = {
  version: VERSION,
  buildTime: "2026-05-15T06:24:26.138Z",
  features: [
    "null-tolerance",
    // port-doc §6–9
    "jq-fx-tags",
    // §10, §11
    "as-materialize",
    // §11a
    "pascalcase-fallback",
    // §12
    "jq-keywords-guard"
    // §13
  ]
};
function assertComputeViaDeriveProfile(source, options) {
  const program = parseBxlAst(source, {
    attachment: "formula",
    libraries: options.libraries,
    profile: "derive",
    readableSyntax: options.readableSyntax,
    schema: options.schema
  });
  const issues = program.profileIssues.filter(
    (issue) => issue.severity === "error"
  );
  if (issues.length === 0) {
    return;
  }
  throw new Error(
    [
      "computeVia expression violates the derive profile:",
      ...issues.map((issue) => `${issue.code}: ${issue.message}`)
    ].join("\n")
  );
}
function normalizeBxlOutputs(outputs) {
  if (outputs.length === 0)
    return null;
  if (outputs.length === 1)
    return outputs[0];
  return outputs;
}
function evaluateBxl(expression2, input, options = {}) {
  const run = runNativeJq(expression2, input, {
    schema: options.schema,
    readableSyntax: options.readableSyntax,
    libraries: options.libraries ?? DEFAULT_BUILTIN_LIBRARIES,
    runtimeLimits: options.runtimeLimits
  });
  return {
    source: run.source,
    compiledSource: run.compiledSource,
    warnings: run.readableWarnings,
    outputs: run.outputs,
    value: normalizeBxlOutputs(run.outputs)
  };
}
function evaluateBxlSafe(expression2, input, options = {}) {
  try {
    return {
      ok: true,
      value: evaluateBxl(expression2, input, options)
    };
  } catch (error) {
    return {
      ok: false,
      error: toBxlErrorRecord(error)
    };
  }
}
function prepareBxl(expression2, options = {}) {
  const prepared = prepareNativeJq(expression2, {
    schema: options.schema,
    readableSyntax: options.readableSyntax,
    libraries: options.libraries ?? DEFAULT_BUILTIN_LIBRARIES,
    runtimeLimits: options.runtimeLimits
  });
  return {
    source: prepared.source,
    compiledSource: prepared.compiledSource,
    warnings: prepared.readableWarnings,
    deps: prepared.deps,
    evaluate(input, runOptions = {}) {
      const run = prepared.run(input, {
        runtimeLimits: runOptions.runtimeLimits ?? options.runtimeLimits
      });
      return {
        source: run.source,
        compiledSource: run.compiledSource,
        warnings: run.readableWarnings,
        outputs: run.outputs,
        value: normalizeBxlOutputs(run.outputs)
      };
    }
  };
}
function prepareBxlSafe(expression2, options = {}) {
  try {
    return {
      ok: true,
      value: prepareBxl(expression2, options)
    };
  } catch (error) {
    return {
      ok: false,
      error: toBxlErrorRecord(error, "prepare")
    };
  }
}
var BXL_MODE = Symbol.for("@cardstack/bxl.mode");
function isTaggedSource(value) {
  return !!value && typeof value === "object" && BXL_MODE in value && typeof value.source === "string";
}
function makeTagged(mode, strings, values) {
  const source = strings.raw.reduce(
    (acc, segment, i) => acc + segment + (i < values.length ? String(values[i]) : ""),
    ""
  );
  return {
    [BXL_MODE]: mode,
    source,
    toString() {
      return source;
    }
  };
}
var GET_FIELDS_KEY = "__cardstackGetFields";
function getCardstackGetFields() {
  const fn = globalThis[GET_FIELDS_KEY];
  return typeof fn === "function" ? fn : void 0;
}
function safeFieldMap(value) {
  if (!value || typeof value !== "object" || Array.isArray(value))
    return null;
  const getFields = getCardstackGetFields();
  if (!getFields)
    return null;
  try {
    return getFields(value, { includeComputeds: false });
  } catch {
    return null;
  }
}
function fieldMapForShape(shape, instance) {
  if (!getCardstackGetFields())
    return null;
  for (const target of [instance, shape]) {
    const map = safeFieldMap(target);
    if (map && Object.keys(map).length > 0)
      return map;
  }
  return null;
}
function hasStructuredFields(value) {
  if (typeof value !== "function")
    return false;
  try {
    const probe = new value();
    return !!safeFieldMap(probe);
  } catch {
    return false;
  }
}
function materializeShape(raw, ShapeClass) {
  if (raw == null)
    return null;
  if (typeof raw !== "object" || Array.isArray(raw))
    return raw;
  const instance = new ShapeClass();
  const fieldMap = fieldMapForShape(ShapeClass, instance);
  if (!fieldMap) {
    Object.assign(instance, raw);
    return instance;
  }
  for (const [fieldName, field] of Object.entries(fieldMap)) {
    const value = raw[fieldName];
    if (value === void 0)
      continue;
    if (field.fieldType === "containsMany") {
      if (!Array.isArray(value)) {
        instance[fieldName] = [];
        continue;
      }
      if (hasStructuredFields(field.card)) {
        instance[fieldName] = value.map(
          (entry) => materializeShape(entry, field.card)
        );
      } else {
        instance[fieldName] = value;
      }
      continue;
    }
    if (field.fieldType === "contains") {
      if (hasStructuredFields(field.card) && value != null) {
        instance[fieldName] = materializeShape(
          value,
          field.card
        );
      } else {
        instance[fieldName] = value;
      }
      continue;
    }
    instance[fieldName] = value;
  }
  return instance;
}
function materializeAs(raw, ShapeClass) {
  if (!ShapeClass)
    return raw;
  if (raw == null)
    return null;
  if (Array.isArray(raw)) {
    return raw.map((entry) => materializeShape(entry, ShapeClass));
  }
  return materializeShape(raw, ShapeClass);
}
function bxl(input, options = {}) {
  const tagged = isTaggedSource(input) ? input : null;
  const source = tagged ? tagged.source : input;
  const defaultReadable = tagged?.[BXL_MODE] === "jq" ? false : true;
  const merged = {
    ...options,
    readableSyntax: options.readableSyntax ?? defaultReadable
  };
  assertComputeViaDeriveProfile(source, merged);
  const ShapeClass = options.as;
  return function computeViaBxl() {
    let raw;
    try {
      raw = evaluateBxl(source, this, merged).value;
    } catch (error) {
      if (isExcelErrorMessage(error)) {
        return null;
      }
      throw error;
    }
    return materializeAs(raw, ShapeClass);
  };
}
var EXCEL_ERROR_SENTINELS = /* @__PURE__ */ new Set([
  "#NULL!",
  "#DIV/0!",
  "#VALUE!",
  "#REF!",
  "#NAME?",
  "#NUM!",
  "#N/A",
  "#ERROR!",
  "#GETTING_DATA"
]);
function isExcelErrorMessage(error) {
  if (!error || typeof error !== "object")
    return false;
  const message = error.message;
  if (typeof message !== "string")
    return false;
  return Array.from(EXCEL_ERROR_SENTINELS).some(
    (sentinel) => message.includes(sentinel)
  );
}
var expression = bxl;
var expr = bxl;
function jq(strings, ...values) {
  return makeTagged("jq", strings, values);
}
function fx(strings, ...values) {
  return makeTagged("fx", strings, values);
}

// src/realm-bundle-entry.ts
globalThis["__cardstackGetFields"] = _getFields;
registerBuiltinLibrary("formula-statistical", formulaStatisticalLibrary);
registerBuiltinLibrary("formula-bessel", formulaBesselLibrary);
registerBuiltinLibrary("formula-engineering", formulaEngineeringLibrary);
registerBuiltinLibrary("formula-financial", formulaFinancialLibrary);
registerBuiltinLibrary("validation", validationLibrary);
DEFAULT_BUILTIN_LIBRARIES.push(
  "formula-statistical",
  "formula-bessel",
  "formula-engineering",
  "formula-financial",
  "validation"
);
export {
  BXL_BUILD_INFO,
  VERSION,
  __runBoxelRuntimeWorker,
  bxl,
  evaluateBxl,
  evaluateBxlSafe,
  expr,
  expression,
  fx,
  getBoxelValue,
  invalidateBoxelRuntimeAsyncCache,
  jq,
  parseNativeJq,
  prepareBoxelGuide,
  prepareBoxelGuideAsync,
  prepareBoxelGuideAsyncSafe,
  prepareBoxelGuideSafe,
  prepareBoxelRuntime,
  prepareBoxelRuntimeAsync,
  prepareBoxelRuntimeAsyncSafe,
  prepareBoxelRuntimeSafe,
  prepareBxl,
  prepareBxlSafe,
  prepareNativeJq,
  prepareNativeJqAsync,
  runNativeJq,
  runNativeJqAsync,
  tokenizeNativeJq
};
