
import * as path from "path"
import * as fs from "fs"
import moment from "moment"
import chalk from "chalk"

import { TextFile, TextSpan, TextPos } from "./text"
import { Scanner } from "./scanner"
import { kindToString, Syntax, BoltQualName, BoltDeclaration, BoltDeclarationModifiers, createEndOfFile, SyntaxKind, isBoltPunctuated } from "./ast"

export function assert(test: boolean): void {
  if (!test) {
    throw new Error(`Invariant violation: an internal sanity check failed.`);
  }
}

export function createTokenStream(node: Syntax) {
  if (isBoltPunctuated(node)) {
    const origPos = node.span!.start;
    const startPos = new TextPos(origPos.offset+1, origPos.line, origPos.column+1);
    return new Scanner(node.span!.file, node.text, startPos);
  } else if (node.kind === SyntaxKind.BoltSentence) {
    return new StreamWrapper(
      node.tokens,
      () => createEndOfFile(new TextSpan(node.span!.file, node.span!.end.clone(), node.span!.end.clone()))
    );
  } else {
    throw new Error(`Could not convert ${kindToString(node.kind)} to a token stream.`);
  }
}

export interface JsonArray extends Array<Json> {  };
export interface JsonObject { [key: string]: Json }
export type Json = null | string | boolean | number | JsonArray | JsonObject;

export function uniq<T>(elements: T[]): T[] {
  const out: T[] = [];
  const visited = new Set<T>();
  for (const element of elements) {
    if (visited.has(element)) {
      continue;
    }
    visited.add(element);
    out.push(element);
  }
  return out;
}


export class FastStringMap<K extends PropertyKey, V> {

  private mapping = Object.create(null);

  public get(key: K): V {
    if (!(key in this.mapping)) {
      throw new Error(`No value found for key '${key}'.`);
    }
    return this.mapping[key];
  }

  public *values(): IterableIterator<V> {
    for (const key of Object.keys(this.mapping)) {
      yield this.mapping[key];
    }
  }

  public set(key: K, value: V): void {
    if (key in this.mapping) {
      throw new Error(`A value for key '${key}' already exists.`);
    }
    this.mapping[key] = value
  }

  public has(key: K): boolean {
    return key in this.mapping;
  }

  public delete(key: K): void {
    if (!(key in this.mapping)) {
      throw new Error(`No value found for key '${key}'.`);
    }
    delete this.mapping[key];
  }

}

class DeepMap {

  private rootMap = new Map<any, any>();

  public has(key: any[]) {
    let curr = this.rootMap;
    for (const element of key) {
      if (!curr.has(element)) {
        return false;
      }
      curr = curr.get(element)!;
    }
    return true;
  }

  public get(key: any[]) {
    let curr = this.rootMap;
    for (const element of key) {
      if (!curr.has(element)) {
        return;
      }
      curr = curr.get(element)!;
    }
    return curr;
  }

  public set(key: any[], value: any) {
    let curr = this.rootMap;
    for (const element of key.slice(0, -1)) {
      if (!curr.has(element)) {
        curr.set(element, new Map());
      }
      curr = curr.get(element)!;
    }
    curr.set(key[key.length-1], value);
  }

}

export function memoize(hasher: (...args: any[]) => string) {
  return function (target: any, key: PropertyKey) {
    const origMethod = target[key];
    target[key] = function wrapper(...args: any[]) {
      if (this.__MEMOIZE_CACHE === undefined) {
        this.__MEMOIZE_CACHE = Object.create(null);
      }
      if (this.__MEMOIZE_CACHE[key] === undefined) {
        this.__MEMOIZE_CACHE[key] = Object.create(null);
      }
      const hashed = hasher(...args);
      const cache = this.__MEMOIZE_CACHE[key];
      if (hashed in cache) {
        return cache[hashed];
      }
      const result = origMethod.apply(this, args);
      cache[hashed] = result;
      return result;
    }
    return target;
  }
}

const supportedLanguages = ['Bolt', 'JS'];

export function getLanguage(node: Syntax): string {
  const kindStr = kindToString(node.kind);
  for (const prefix of supportedLanguages) {
    if (kindStr.startsWith(prefix)) {
      return prefix;
    }
  }
  throw new Error(`Could not determine the language of ${kindStr}`);
}

export function cloneSpan(span: TextSpan | null) {
  if (span === null) {
    return null;
  }
  return span.clone();
}

export function setOrigNodeRange(node: Syntax, startNode: Syntax, endNode: Syntax): void {
  node.span = new TextSpan(startNode.span!.file, startNode.span!.start.clone(), endNode.span!.end.clone());
}

export function hasPublicModifier(node: BoltDeclaration) {
  return (node.modifiers & BoltDeclarationModifiers.Public) > 0;
}

export function toDeclarationPath(node: BoltQualName): string[] {
  if (node.modulePath === null) {
    return [ node.name.text ];
  }
  return [...node.modulePath.map(id => id.text), node.name.text];
}

export interface Stream<T> {
  get(): T;
  peek(count?: number): T;
}

export class StreamWrapper<T> {

  offset = 0

  constructor(protected data: T[], protected createSentry: () => T) {

  }

  peek(count = 1) {
    const offset = this.offset + (count - 1);
    if (offset >= this.data.length) {
      return this.createSentry();
    }
    return this.data[offset];
  }

  get() {
    if (this.offset >= this.data.length) {
      return this.createSentry();
    }
    return this.data[this.offset++];
  }

}

const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'

export function verbose(message: string) {
  console.error(chalk.gray('[') + chalk.magenta('verb') + ' ' + chalk.gray(moment().format(DATETIME_FORMAT) + ']') + ' ' + message);
}

export function upsearchSync(filename: string, startDir = '.') {
  let currDir = startDir;
  while (true) {
    const filePath = path.join(currDir, filename);
    if (fs.existsSync(filePath)) {
      return filePath
    }
    const  { root, dir } = path.parse(currDir);
    if (dir === root) {
      return null;
    }
    currDir = dir;
  }
}

export function getFileStem(filepath: string): string {
  return path.basename(filepath).split('.')[0];
}

export function describeKind(kind: SyntaxKind): string {
  switch (kind) {
    case SyntaxKind.JSIdentifier:
      return "a JavaScript identifier"
    case SyntaxKind.BoltIdentifier:
      return "an identifier"
    case SyntaxKind.BoltOperator:
      return "an operator"
    case SyntaxKind.BoltStringLiteral:
      return "a string"
    case SyntaxKind.BoltIntegerLiteral:
      return "an integer"
    case SyntaxKind.BoltFnKeyword:
      return "'fn'"
    case SyntaxKind.BoltForeignKeyword:
      return "'foreign'"
    case SyntaxKind.BoltMatchKeyword:
      return "'match'";
    case SyntaxKind.BoltYieldKeyword:
      return "'yield'";
    case SyntaxKind.BoltReturnKeyword:
      return "'return'";
    case SyntaxKind.BoltPubKeyword:
      return "'pub'"
    case SyntaxKind.BoltLetKeyword:
      return "'let'"
    case SyntaxKind.BoltSemi:
      return "';'"
    case SyntaxKind.BoltColon:
      return "':'"
    case SyntaxKind.BoltDot:
      return "'.'"
    case SyntaxKind.JSDot:
      return "'.'"
    case SyntaxKind.JSDotDotDot:
      return "'...'"
    case SyntaxKind.BoltRArrow:
      return "'->'"
    case SyntaxKind.BoltComma:
      return "','"
    case SyntaxKind.BoltModKeyword:
      return "'mod'"
    case SyntaxKind.BoltStructKeyword:
      return "'struct'"
    case SyntaxKind.BoltEnumKeyword:
      return "'enum'"
    case SyntaxKind.BoltTypeKeyword:
      return "'type'";
    case SyntaxKind.BoltBraced:
      return "'{' .. '}'"
    case SyntaxKind.BoltBracketed:
      return "'[' .. ']'"
    case SyntaxKind.BoltParenthesized:
      return "'(' .. ')'"
    case SyntaxKind.EndOfFile:
      return "'}', ')', ']' or end-of-file"
    case SyntaxKind.BoltLtSign:
      return "'<'";
    case SyntaxKind.BoltGtSign:
      return "'<'";
    case SyntaxKind.BoltEqSign:
      return "'='";
    case SyntaxKind.JSOpenBrace:
      return "'{'";
    case SyntaxKind.JSCloseBrace:
      return "'}'";
    case SyntaxKind.JSOpenBracket:
      return "'['";
    case SyntaxKind.JSCloseBracket:
      return "']'";
    case SyntaxKind.JSOpenParen:
      return "'('";
    case SyntaxKind.JSCloseParen:
      return "')'";
    case SyntaxKind.JSSemi:
      return "';'";
    case SyntaxKind.JSComma:
      return "','";
    case SyntaxKind.BoltTraitKeyword:
      return "'trait'";
    case SyntaxKind.BoltTraitKeyword:
      return "'impl'";
    case SyntaxKind.BoltImplKeyword:
      return "'trait'";
    case SyntaxKind.BoltForKeyword:
      return "'for'";
    case SyntaxKind.JSMulOp:
      return "'*'";
    case SyntaxKind.JSAddOp:
      return "'+'";
    case SyntaxKind.JSDivOp:
      return "'/'";
    case SyntaxKind.JSSubOp:
      return "'-'";
    case SyntaxKind.JSLtOp:
      return "'<'";
    case SyntaxKind.JSGtOp:
      return "'>'";
    case SyntaxKind.JSBOrOp:
      return "'|'";
    case SyntaxKind.JSBXorOp:
      return "'^'";
    case SyntaxKind.JSBAndOp:
      return "'&'";
    case SyntaxKind.JSBNotOp:
      return "'~'";
    case SyntaxKind.JSNotOp:
      return "'~'";
    case SyntaxKind.JSString:
      return "a JavaScript string"
    case SyntaxKind.JSReturnKeyword:
      return "'return'";
    case SyntaxKind.JSForKeyword:
      return "'for'";
    case SyntaxKind.JSTryKeyword:
      return "'try'";
    case SyntaxKind.BoltRArrowAlt:
      return "'=>'";
    default:
      throw new Error(`failed to describe ${kindToString(kind)}`)
  }
}

function enumerate(elements: string[]) {
  if (elements.length === 1) {
    return elements[0]
  } else {
    return elements.slice(0, elements.length-1).join(', ') + ' or ' + elements[elements.length-1]
  }
}

export class ParseError extends Error {
  constructor(public actual: Syntax, public expected: SyntaxKind[]) {
    super(`${actual.span!.file.origPath}:${actual.span!.start.line}:${actual.span!.start.column}: expected ${enumerate(expected.map(e => describeKind(e)))} but got ${describeKind(actual.kind)}`)
  }
}

export enum OperatorKind {
  Prefix,
  InfixL,
  InfixR,
  Suffix,
}

export function isRightAssoc(kind: OperatorKind) {
  return kind === OperatorKind.InfixR;
}

export interface OperatorInfo {
  kind: OperatorKind;
  arity: number;
  name: string;
  precedence: number;
}

export function assertToken(node: Syntax, kind: SyntaxKind) {
  if (node.kind !== kind) {
    throw new ParseError(node, [kind]);
  }
}


type OperatorTableList = [OperatorKind, number, string][][];

export class OperatorTable {

  private operatorsByName = new FastStringMap<string, OperatorInfo>();
  //private operatorsByPrecedence = FastStringMap<number, OperatorInfo>();

  constructor(definitions: OperatorTableList) {
    let i = 0;
    for (const group of definitions) {
      for (const [kind, arity, name] of group) {
        const info = { kind, arity, name, precedence: i }
        this.operatorsByName.set(name, info);
        //this.operatorsByPrecedence[i] = info;
      }
      i++;
    }
  }

  public lookup(name: string): OperatorInfo | null {
    if (!this.operatorsByName.has(name)) {
      return null;
    }
    return this.operatorsByName.get(name);
  }

}

export const EOF = ''

function escapeChar(ch: string) {
  switch (ch) {
    case '\a': return '\\a';
    case '\b': return '\\b';
    case '\f': return '\\f';
    case '\n': return '\\n';
    case '\r': return '\\r';
    case '\t': return '\\t';
    case '\v': return '\\v';
    case '\0': return '\\0';
    case '\'': return '\\\'';
    default:
      const code = ch.charCodeAt(0);
      if (code >= 0x20 && code <= 0x7E)  {
        return ch
      } else if (code < 0x7F) {
        return `\\x${code.toString(16).padStart(2, '0')}`
      } else {
        return `\\u${code.toString(16).padStart(4, '0')}`
      }
  }
}

export class ScanError extends Error {
  constructor(public file: TextFile, public position: TextPos, public char: string) {
    super(`${file.origPath}:${position.line}:${position.column}: unexpected char '${escapeChar(char)}'`)
  }
}

export interface MapLike<T> {
  [key: string]: T;
}

export type FormatArg = string | Date | number

export function format(message: string, data: MapLike<FormatArg>) {

  let out = ''

  let name = '';
  let insideParam = false;

  for (const ch of message) {
    if (insideParam) {
      if (ch === '}') {
        out += data[name]!.toString();
        reset();
      } else {
        name += ch;
      }
    } else {
      if (ch === '{') {
        insideParam = true;
      } else {
        out += ch;
      }
    }
  }

  return out;

  function reset() {
    name = '';
    insideParam = false;
  }

}

