
export const enum SyntaxKind {
  EndOfFile = 2,
  FunctionBody = 4,
  BoltStringLiteral = 6,
  BoltIntegerLiteral = 7,
  BoltIdentifier = 9,
  BoltOperator = 10,
  BoltAssignment = 11,
  BoltComma = 12,
  BoltSemi = 13,
  BoltColon = 14,
  BoltDot = 15,
  BoltDotDot = 16,
  BoltRArrow = 17,
  BoltLArrow = 18,
  BoltEqSign = 19,
  BoltGtSign = 20,
  BoltLtSign = 21,
  BoltFnKeyword = 23,
  BoltForeignKeyword = 24,
  BoltLetKeyword = 25,
  BoltReturnKeyword = 26,
  BoltLoopKeyword = 27,
  BoltYieldKeyword = 28,
  BoltMatchKeyword = 29,
  BoltImportKeyword = 30,
  BoltPubKeyword = 31,
  BoltModKeyword = 32,
  BoltMutKeyword = 33,
  BoltEnumKeyword = 34,
  BoltStructKeyword = 35,
  BoltTypeKeyword = 36,
  BoltTraitKeyworkd = 37,
  BoltParenthesized = 39,
  BoltBraced = 40,
  BoltBracketed = 41,
  BoltSourceFile = 42,
  BoltQualName = 43,
  BoltSentence = 44,
  BoltReferenceTypeExpression = 46,
  BoltTypeParameter = 47,
  BoltBindPattern = 49,
  BoltTypePattern = 50,
  BoltExpressionPattern = 51,
  BoltTuplePatternElement = 52,
  BoltTuplePattern = 53,
  BoltRecordPatternField = 54,
  BoltRecordPattern = 55,
  BoltReferenceExpression = 57,
  BoltCallExpression = 58,
  BoltYieldExpression = 59,
  BoltMatchArm = 60,
  BoltMatchExpression = 61,
  BoltCase = 62,
  BoltCaseExpression = 63,
  BoltBlockExpression = 64,
  BoltConstantExpression = 65,
  BoltReturnStatement = 67,
  BoltResumeStatement = 68,
  BoltExpressionStatement = 69,
  BoltParameter = 70,
  BoltModule = 74,
  BoltFunctionDeclaration = 75,
  BoltVariableDeclaration = 76,
  BoltPlainImportSymbol = 78,
  BoltImportDeclaration = 79,
  BoltRecordDeclarationField = 80,
  BoltTypeAliasDeclaration = 81,
  BoltRecordDeclaration = 83,
  JSOperator = 86,
  JSIdentifier = 87,
  JSReturnKeyword = 88,
  JSTryKeyword = 89,
  JSCatchKeyword = 90,
  JSBindPattern = 92,
  JSConstantExpression = 94,
  JSMemberExpression = 96,
  JSCallExpression = 97,
  JSBinaryExpression = 98,
  JSUnaryExpression = 99,
  JSNewExpression = 100,
  JSSequenceExpression = 101,
  JSConditionalExpression = 102,
  JSReferenceExpression = 103,
  JSExpressionStatement = 106,
  JSConditionalStatement = 107,
  JSParameter = 108,
  JSFunctionDeclaration = 111,
  JSArrowFunctionDeclaration = 112,
  JSLetDeclaration = 113,
  JSSourceFile = 114,
}



import { TextSpan } from "./text"

export function setParents(node: Syntax): void;

export type SyntaxRange = [Syntax, Syntax];

interface SyntaxBase {
  kind: SyntaxKind;
  parentNode: Syntax | null;
  span: TextSpan | null;
}
export interface EndOfFile extends SyntaxBase {
  kind: SyntaxKind.EndOfFile;
}

export interface FunctionBody extends SyntaxBase {
  kind: SyntaxKind.FunctionBody;
}

export type BoltToken
  = EndOfFile
  | BoltStringLiteral
  | BoltIntegerLiteral
  | BoltIdentifier
  | BoltOperator
  | BoltAssignment
  | BoltComma
  | BoltSemi
  | BoltColon
  | BoltDot
  | BoltDotDot
  | BoltRArrow
  | BoltLArrow
  | BoltEqSign
  | BoltGtSign
  | BoltLtSign
  | BoltFnKeyword
  | BoltForeignKeyword
  | BoltLetKeyword
  | BoltReturnKeyword
  | BoltLoopKeyword
  | BoltYieldKeyword
  | BoltMatchKeyword
  | BoltImportKeyword
  | BoltPubKeyword
  | BoltModKeyword
  | BoltMutKeyword
  | BoltEnumKeyword
  | BoltStructKeyword
  | BoltTypeKeyword
  | BoltTraitKeyworkd
  | BoltParenthesized
  | BoltBraced
  | BoltBracketed


export interface BoltStringLiteral extends SyntaxBase {
  kind: SyntaxKind.BoltStringLiteral;
  value: string;
}

export interface BoltIntegerLiteral extends SyntaxBase {
  kind: SyntaxKind.BoltIntegerLiteral;
  value: bigint;
}

export type BoltSymbol
  = BoltIdentifier
  | BoltOperator


export interface BoltIdentifier extends SyntaxBase {
  kind: SyntaxKind.BoltIdentifier;
  text: string;
}

export interface BoltOperator extends SyntaxBase {
  kind: SyntaxKind.BoltOperator;
  text: string;
}

export interface BoltAssignment extends SyntaxBase {
  kind: SyntaxKind.BoltAssignment;
  operator: string | null;
}

export interface BoltComma extends SyntaxBase {
  kind: SyntaxKind.BoltComma;
}

export interface BoltSemi extends SyntaxBase {
  kind: SyntaxKind.BoltSemi;
}

export interface BoltColon extends SyntaxBase {
  kind: SyntaxKind.BoltColon;
}

export interface BoltDot extends SyntaxBase {
  kind: SyntaxKind.BoltDot;
}

export interface BoltDotDot extends SyntaxBase {
  kind: SyntaxKind.BoltDotDot;
}

export interface BoltRArrow extends SyntaxBase {
  kind: SyntaxKind.BoltRArrow;
}

export interface BoltLArrow extends SyntaxBase {
  kind: SyntaxKind.BoltLArrow;
}

export interface BoltEqSign extends SyntaxBase {
  kind: SyntaxKind.BoltEqSign;
}

export interface BoltGtSign extends SyntaxBase {
  kind: SyntaxKind.BoltGtSign;
}

export interface BoltLtSign extends SyntaxBase {
  kind: SyntaxKind.BoltLtSign;
}

export type BoltKeyword
  = BoltFnKeyword
  | BoltForeignKeyword
  | BoltLetKeyword
  | BoltReturnKeyword
  | BoltLoopKeyword
  | BoltYieldKeyword
  | BoltMatchKeyword
  | BoltImportKeyword
  | BoltPubKeyword
  | BoltModKeyword
  | BoltMutKeyword
  | BoltEnumKeyword
  | BoltStructKeyword
  | BoltTypeKeyword
  | BoltTraitKeyworkd


export interface BoltFnKeyword extends SyntaxBase {
  kind: SyntaxKind.BoltFnKeyword;
}

export interface BoltForeignKeyword extends SyntaxBase {
  kind: SyntaxKind.BoltForeignKeyword;
}

export interface BoltLetKeyword extends SyntaxBase {
  kind: SyntaxKind.BoltLetKeyword;
}

export interface BoltReturnKeyword extends SyntaxBase {
  kind: SyntaxKind.BoltReturnKeyword;
}

export interface BoltLoopKeyword extends SyntaxBase {
  kind: SyntaxKind.BoltLoopKeyword;
}

export interface BoltYieldKeyword extends SyntaxBase {
  kind: SyntaxKind.BoltYieldKeyword;
}

export interface BoltMatchKeyword extends SyntaxBase {
  kind: SyntaxKind.BoltMatchKeyword;
}

export interface BoltImportKeyword extends SyntaxBase {
  kind: SyntaxKind.BoltImportKeyword;
}

export interface BoltPubKeyword extends SyntaxBase {
  kind: SyntaxKind.BoltPubKeyword;
}

export interface BoltModKeyword extends SyntaxBase {
  kind: SyntaxKind.BoltModKeyword;
}

export interface BoltMutKeyword extends SyntaxBase {
  kind: SyntaxKind.BoltMutKeyword;
}

export interface BoltEnumKeyword extends SyntaxBase {
  kind: SyntaxKind.BoltEnumKeyword;
}

export interface BoltStructKeyword extends SyntaxBase {
  kind: SyntaxKind.BoltStructKeyword;
}

export interface BoltTypeKeyword extends SyntaxBase {
  kind: SyntaxKind.BoltTypeKeyword;
}

export interface BoltTraitKeyworkd extends SyntaxBase {
  kind: SyntaxKind.BoltTraitKeyworkd;
}

export type BoltPunctuated
  = BoltParenthesized
  | BoltBraced
  | BoltBracketed


export interface BoltParenthesized extends SyntaxBase {
  kind: SyntaxKind.BoltParenthesized;
  text: string;
}

export interface BoltBraced extends SyntaxBase {
  kind: SyntaxKind.BoltBraced;
  text: string;
}

export interface BoltBracketed extends SyntaxBase {
  kind: SyntaxKind.BoltBracketed;
  text: string;
}

export interface BoltSourceFile extends SyntaxBase {
  kind: SyntaxKind.BoltSourceFile;
  elements: BoltSourceElement[];
}

export interface BoltQualName extends SyntaxBase {
  kind: SyntaxKind.BoltQualName;
  modulePath: BoltIdentifier[];
  name: BoltSymbol;
}

export interface BoltSentence extends SyntaxBase {
  kind: SyntaxKind.BoltSentence;
  tokens: BoltToken[];
}

export type BoltTypeExpression
  = BoltReferenceTypeExpression


export interface BoltReferenceTypeExpression extends SyntaxBase {
  kind: SyntaxKind.BoltReferenceTypeExpression;
  name: BoltQualName;
  arguments: BoltTypeExpression[] | null;
}

export interface BoltTypeParameter extends SyntaxBase {
  kind: SyntaxKind.BoltTypeParameter;
  index: number;
  name: BoltIdentifier;
  defaultType: BoltTypeExpression | null;
}

export type BoltPattern
  = BoltBindPattern
  | BoltTypePattern
  | BoltExpressionPattern
  | BoltTuplePattern
  | BoltRecordPattern


export interface BoltBindPattern extends SyntaxBase {
  kind: SyntaxKind.BoltBindPattern;
  name: BoltIdentifier;
}

export interface BoltTypePattern extends SyntaxBase {
  kind: SyntaxKind.BoltTypePattern;
  type: BoltTypeExpression;
  nestedPattern: BoltPattern;
}

export interface BoltExpressionPattern extends SyntaxBase {
  kind: SyntaxKind.BoltExpressionPattern;
  expression: BoltExpression;
}

export interface BoltTuplePatternElement extends SyntaxBase {
  kind: SyntaxKind.BoltTuplePatternElement;
  index: number;
  pattern: BoltPattern;
}

export interface BoltTuplePattern extends SyntaxBase {
  kind: SyntaxKind.BoltTuplePattern;
  elements: BoltTuplePatternElement[];
}

export interface BoltRecordPatternField extends SyntaxBase {
  kind: SyntaxKind.BoltRecordPatternField;
  name: BoltIdentifier;
  pattern: BoltPattern;
}

export interface BoltRecordPattern extends SyntaxBase {
  kind: SyntaxKind.BoltRecordPattern;
  name: BoltTypeExpression;
  fields: BoltRecordPatternField[];
}

export type BoltExpression
  = BoltReferenceExpression
  | BoltCallExpression
  | BoltYieldExpression
  | BoltMatchExpression
  | BoltCaseExpression
  | BoltBlockExpression
  | BoltConstantExpression


export interface BoltReferenceExpression extends SyntaxBase {
  kind: SyntaxKind.BoltReferenceExpression;
  name: BoltQualName;
}

export interface BoltCallExpression extends SyntaxBase {
  kind: SyntaxKind.BoltCallExpression;
  operator: BoltExpression;
  operands: BoltExpression[];
}

export interface BoltYieldExpression extends SyntaxBase {
  kind: SyntaxKind.BoltYieldExpression;
  value: BoltExpression;
}

export interface BoltMatchArm extends SyntaxBase {
  kind: SyntaxKind.BoltMatchArm;
  pattern: BoltPattern;
  body: BoltExpression;
}

export interface BoltMatchExpression extends SyntaxBase {
  kind: SyntaxKind.BoltMatchExpression;
  value: BoltExpression;
  arms: BoltMatchArm[];
}

export interface BoltCase extends SyntaxBase {
  kind: SyntaxKind.BoltCase;
  test: BoltExpression;
  result: BoltExpression;
}

export interface BoltCaseExpression extends SyntaxBase {
  kind: SyntaxKind.BoltCaseExpression;
  cases: BoltCase[];
}

export interface BoltBlockExpression extends SyntaxBase {
  kind: SyntaxKind.BoltBlockExpression;
  statements: BoltStatement[];
}

export interface BoltConstantExpression extends SyntaxBase {
  kind: SyntaxKind.BoltConstantExpression;
  value: BoltValue;
}

export type BoltStatement
  = BoltReturnStatement
  | BoltResumeStatement
  | BoltExpressionStatement


export interface BoltReturnStatement extends SyntaxBase {
  kind: SyntaxKind.BoltReturnStatement;
  value: BoltExpression | null;
}

export interface BoltResumeStatement extends SyntaxBase {
  kind: SyntaxKind.BoltResumeStatement;
  value: BoltExpression;
}

export interface BoltExpressionStatement extends SyntaxBase {
  kind: SyntaxKind.BoltExpressionStatement;
  expression: BoltExpression;
}

export interface BoltParameter extends SyntaxBase {
  kind: SyntaxKind.BoltParameter;
  index: number;
  bindings: BoltPattern;
  type: BoltTypeExpression | null;
  defaultValue: BoltExpression | null;
}

export type BoltDeclaration
  = BoltTypeAliasDeclaration
  | BoltRecordDeclaration
  | BoltModule
  | BoltFunctionDeclaration
  | BoltVariableDeclaration
  | BoltImportDeclaration


export type BoltTypeDeclaration
  = BoltTypeAliasDeclaration
  | BoltRecordDeclaration


export const enum BoltDeclarationModifiers {
  Mutable = 1,Public = 2,IsType = 4,IsForeign = 8,}

export interface BoltModule extends SyntaxBase {
  kind: SyntaxKind.BoltModule;
  modifiers: BoltDeclarationModifiers;
  name: BoltQualName;
  elements: BoltSourceElement[];
}

export interface BoltFunctionDeclaration extends SyntaxBase {
  kind: SyntaxKind.BoltFunctionDeclaration;
  modifiers: BoltDeclarationModifiers;
  target: string;
  name: BoltSymbol;
  params: BoltParameter[];
  returnType: BoltTypeExpression | null;
  body: BoltStatement[];
}

export interface BoltVariableDeclaration extends SyntaxBase {
  kind: SyntaxKind.BoltVariableDeclaration;
  modifiers: BoltDeclarationModifiers;
  bindings: BoltPattern;
  type: BoltTypeExpression | null;
  value: BoltExpression | null;
}

export type BoltImportSymbol
  = BoltPlainImportSymbol


export interface BoltPlainImportSymbol extends SyntaxBase {
  kind: SyntaxKind.BoltPlainImportSymbol;
  name: BoltQualName;
}

export interface BoltImportDeclaration extends SyntaxBase {
  kind: SyntaxKind.BoltImportDeclaration;
  file: string;
  symbols: BoltImportSymbol[];
}

export interface BoltRecordDeclarationField extends SyntaxBase {
  kind: SyntaxKind.BoltRecordDeclarationField;
  name: BoltIdentifier;
  type: BoltTypeExpression;
}

export interface BoltTypeAliasDeclaration extends SyntaxBase {
  kind: SyntaxKind.BoltTypeAliasDeclaration;
  modifiers: BoltDeclarationModifiers;
  name: BoltIdentifier;
  typeParams: BoltTypeParameter[] | null;
  typeExpr: BoltTypeExpression;
}

export type BoltSourceElement
  = BoltSentence
  | BoltReturnStatement
  | BoltResumeStatement
  | BoltExpressionStatement
  | BoltTypeAliasDeclaration
  | BoltRecordDeclaration
  | BoltModule
  | BoltFunctionDeclaration
  | BoltVariableDeclaration
  | BoltImportDeclaration


export interface BoltRecordDeclaration extends SyntaxBase {
  kind: SyntaxKind.BoltRecordDeclaration;
  modifiers: BoltDeclarationModifiers;
  name: BoltQualName;
  typeParms: BoltTypeParameter[] | null;
  fields: BoltRecordDeclarationField[];
}

export type JSToken
  = EndOfFile
  | JSOperator
  | JSIdentifier
  | JSReturnKeyword
  | JSTryKeyword
  | JSCatchKeyword


export interface JSOperator extends SyntaxBase {
  kind: SyntaxKind.JSOperator;
  text: string;
}

export interface JSIdentifier extends SyntaxBase {
  kind: SyntaxKind.JSIdentifier;
  text: string;
}

export interface JSReturnKeyword extends SyntaxBase {
  kind: SyntaxKind.JSReturnKeyword;
}

export interface JSTryKeyword extends SyntaxBase {
  kind: SyntaxKind.JSTryKeyword;
}

export interface JSCatchKeyword extends SyntaxBase {
  kind: SyntaxKind.JSCatchKeyword;
}

export type JSPattern
  = JSBindPattern


export interface JSBindPattern extends SyntaxBase {
  kind: SyntaxKind.JSBindPattern;
  name: JSIdentifier;
}

export type JSExpression
  = JSConstantExpression
  | JSMemberExpression
  | JSCallExpression
  | JSBinaryExpression
  | JSUnaryExpression
  | JSNewExpression
  | JSSequenceExpression
  | JSConditionalExpression
  | JSReferenceExpression


export interface JSConstantExpression extends SyntaxBase {
  kind: SyntaxKind.JSConstantExpression;
  value: BoltValue;
}

export const enum JSMemberExpressionModifiers {
  Computed = 1,}

export interface JSMemberExpression extends SyntaxBase {
  kind: SyntaxKind.JSMemberExpression;
  value: JSExpression;
  property: JSExpression;
  modifiers: JSMemberExpressionModifiers;
}

export interface JSCallExpression extends SyntaxBase {
  kind: SyntaxKind.JSCallExpression;
  operator: JSExpression;
  operands: JSExpression[];
}

export interface JSBinaryExpression extends SyntaxBase {
  kind: SyntaxKind.JSBinaryExpression;
  left: JSExpression;
  operator: JSOperator;
  right: JSExpression;
}

export interface JSUnaryExpression extends SyntaxBase {
  kind: SyntaxKind.JSUnaryExpression;
  operator: JSOperator;
  operand: JSExpression;
}

export interface JSNewExpression extends SyntaxBase {
  kind: SyntaxKind.JSNewExpression;
  target: JSExpression;
  arguments: JSExpression[];
}

export interface JSSequenceExpression extends SyntaxBase {
  kind: SyntaxKind.JSSequenceExpression;
  expressions: JSExpression[];
}

export interface JSConditionalExpression extends SyntaxBase {
  kind: SyntaxKind.JSConditionalExpression;
  test: JSExpression;
  consequent: JSExpression;
  alternate: JSExpression;
}

export interface JSReferenceExpression extends SyntaxBase {
  kind: SyntaxKind.JSReferenceExpression;
  name: string;
}

export type JSSourceElement
  = JSExpressionStatement
  | JSConditionalStatement
  | JSFunctionDeclaration
  | JSArrowFunctionDeclaration
  | JSLetDeclaration


export type JSStatement
  = JSExpressionStatement
  | JSConditionalStatement


export interface JSExpressionStatement extends SyntaxBase {
  kind: SyntaxKind.JSExpressionStatement;
  expression: JSExpression;
}

export interface JSConditionalStatement extends SyntaxBase {
  kind: SyntaxKind.JSConditionalStatement;
  test: JSExpression;
  consequent: JSStatement[];
  alternate: JSStatement[];
}

export interface JSParameter extends SyntaxBase {
  kind: SyntaxKind.JSParameter;
  index: number;
  bindings: JSPattern;
  defaultValue: JSExpression | null;
}

export type JSDeclaration
  = JSFunctionDeclaration
  | JSArrowFunctionDeclaration
  | JSLetDeclaration


export const enum JSDeclarationModifiers {
  IsExported = 1,}

export interface JSFunctionDeclaration extends SyntaxBase {
  kind: SyntaxKind.JSFunctionDeclaration;
  modifiers: JSDeclarationModifiers;
  name: JSIdentifier;
  params: JSParameter[];
  body: JSStatement[];
}

export interface JSArrowFunctionDeclaration extends SyntaxBase {
  kind: SyntaxKind.JSArrowFunctionDeclaration;
  name: JSIdentifier;
  params: JSParameter[];
  body: JSExpression;
}

export interface JSLetDeclaration extends SyntaxBase {
  kind: SyntaxKind.JSLetDeclaration;
  bindings: JSPattern;
  value: JSExpression | null;
}

export interface JSSourceFile extends SyntaxBase {
  kind: SyntaxKind.JSSourceFile;
  elements: JSSourceElement[];
}

export type BoltSyntax
  = BoltStringLiteral
  | BoltIntegerLiteral
  | BoltIdentifier
  | BoltOperator
  | BoltAssignment
  | BoltComma
  | BoltSemi
  | BoltColon
  | BoltDot
  | BoltDotDot
  | BoltRArrow
  | BoltLArrow
  | BoltEqSign
  | BoltGtSign
  | BoltLtSign
  | BoltFnKeyword
  | BoltForeignKeyword
  | BoltLetKeyword
  | BoltReturnKeyword
  | BoltLoopKeyword
  | BoltYieldKeyword
  | BoltMatchKeyword
  | BoltImportKeyword
  | BoltPubKeyword
  | BoltModKeyword
  | BoltMutKeyword
  | BoltEnumKeyword
  | BoltStructKeyword
  | BoltTypeKeyword
  | BoltTraitKeyworkd
  | BoltParenthesized
  | BoltBraced
  | BoltBracketed
  | BoltSourceFile
  | BoltQualName
  | BoltSentence
  | BoltReferenceTypeExpression
  | BoltTypeParameter
  | BoltBindPattern
  | BoltTypePattern
  | BoltExpressionPattern
  | BoltTuplePatternElement
  | BoltTuplePattern
  | BoltRecordPatternField
  | BoltRecordPattern
  | BoltReferenceExpression
  | BoltCallExpression
  | BoltYieldExpression
  | BoltMatchArm
  | BoltMatchExpression
  | BoltCase
  | BoltCaseExpression
  | BoltBlockExpression
  | BoltConstantExpression
  | BoltReturnStatement
  | BoltResumeStatement
  | BoltExpressionStatement
  | BoltParameter
  | BoltModule
  | BoltFunctionDeclaration
  | BoltVariableDeclaration
  | BoltPlainImportSymbol
  | BoltImportDeclaration
  | BoltRecordDeclarationField
  | BoltTypeAliasDeclaration
  | BoltRecordDeclaration


export type JSSyntax
  = JSOperator
  | JSIdentifier
  | JSReturnKeyword
  | JSTryKeyword
  | JSCatchKeyword
  | JSBindPattern
  | JSConstantExpression
  | JSMemberExpression
  | JSCallExpression
  | JSBinaryExpression
  | JSUnaryExpression
  | JSNewExpression
  | JSSequenceExpression
  | JSConditionalExpression
  | JSReferenceExpression
  | JSExpressionStatement
  | JSConditionalStatement
  | JSParameter
  | JSFunctionDeclaration
  | JSArrowFunctionDeclaration
  | JSLetDeclaration
  | JSSourceFile


export type Syntax
  = EndOfFile
  | FunctionBody
  | BoltStringLiteral
  | BoltIntegerLiteral
  | BoltIdentifier
  | BoltOperator
  | BoltAssignment
  | BoltComma
  | BoltSemi
  | BoltColon
  | BoltDot
  | BoltDotDot
  | BoltRArrow
  | BoltLArrow
  | BoltEqSign
  | BoltGtSign
  | BoltLtSign
  | BoltFnKeyword
  | BoltForeignKeyword
  | BoltLetKeyword
  | BoltReturnKeyword
  | BoltLoopKeyword
  | BoltYieldKeyword
  | BoltMatchKeyword
  | BoltImportKeyword
  | BoltPubKeyword
  | BoltModKeyword
  | BoltMutKeyword
  | BoltEnumKeyword
  | BoltStructKeyword
  | BoltTypeKeyword
  | BoltTraitKeyworkd
  | BoltParenthesized
  | BoltBraced
  | BoltBracketed
  | BoltSourceFile
  | BoltQualName
  | BoltSentence
  | BoltReferenceTypeExpression
  | BoltTypeParameter
  | BoltBindPattern
  | BoltTypePattern
  | BoltExpressionPattern
  | BoltTuplePatternElement
  | BoltTuplePattern
  | BoltRecordPatternField
  | BoltRecordPattern
  | BoltReferenceExpression
  | BoltCallExpression
  | BoltYieldExpression
  | BoltMatchArm
  | BoltMatchExpression
  | BoltCase
  | BoltCaseExpression
  | BoltBlockExpression
  | BoltConstantExpression
  | BoltReturnStatement
  | BoltResumeStatement
  | BoltExpressionStatement
  | BoltParameter
  | BoltModule
  | BoltFunctionDeclaration
  | BoltVariableDeclaration
  | BoltPlainImportSymbol
  | BoltImportDeclaration
  | BoltRecordDeclarationField
  | BoltTypeAliasDeclaration
  | BoltRecordDeclaration
  | JSOperator
  | JSIdentifier
  | JSReturnKeyword
  | JSTryKeyword
  | JSCatchKeyword
  | JSBindPattern
  | JSConstantExpression
  | JSMemberExpression
  | JSCallExpression
  | JSBinaryExpression
  | JSUnaryExpression
  | JSNewExpression
  | JSSequenceExpression
  | JSConditionalExpression
  | JSReferenceExpression
  | JSExpressionStatement
  | JSConditionalStatement
  | JSParameter
  | JSFunctionDeclaration
  | JSArrowFunctionDeclaration
  | JSLetDeclaration
  | JSSourceFile


export function kindToString(kind: SyntaxKind): string;

export function createEndOfFile(span?: TextSpan | null): EndOfFile;
export function createFunctionBody(span?: TextSpan | null): FunctionBody;
export function createBoltStringLiteral(value: string, span?: TextSpan | null): BoltStringLiteral;
export function createBoltIntegerLiteral(value: bigint, span?: TextSpan | null): BoltIntegerLiteral;
export function createBoltIdentifier(text: string, span?: TextSpan | null): BoltIdentifier;
export function createBoltOperator(text: string, span?: TextSpan | null): BoltOperator;
export function createBoltAssignment(operator: string | null, span?: TextSpan | null): BoltAssignment;
export function createBoltComma(span?: TextSpan | null): BoltComma;
export function createBoltSemi(span?: TextSpan | null): BoltSemi;
export function createBoltColon(span?: TextSpan | null): BoltColon;
export function createBoltDot(span?: TextSpan | null): BoltDot;
export function createBoltDotDot(span?: TextSpan | null): BoltDotDot;
export function createBoltRArrow(span?: TextSpan | null): BoltRArrow;
export function createBoltLArrow(span?: TextSpan | null): BoltLArrow;
export function createBoltEqSign(span?: TextSpan | null): BoltEqSign;
export function createBoltGtSign(span?: TextSpan | null): BoltGtSign;
export function createBoltLtSign(span?: TextSpan | null): BoltLtSign;
export function createBoltFnKeyword(span?: TextSpan | null): BoltFnKeyword;
export function createBoltForeignKeyword(span?: TextSpan | null): BoltForeignKeyword;
export function createBoltLetKeyword(span?: TextSpan | null): BoltLetKeyword;
export function createBoltReturnKeyword(span?: TextSpan | null): BoltReturnKeyword;
export function createBoltLoopKeyword(span?: TextSpan | null): BoltLoopKeyword;
export function createBoltYieldKeyword(span?: TextSpan | null): BoltYieldKeyword;
export function createBoltMatchKeyword(span?: TextSpan | null): BoltMatchKeyword;
export function createBoltImportKeyword(span?: TextSpan | null): BoltImportKeyword;
export function createBoltPubKeyword(span?: TextSpan | null): BoltPubKeyword;
export function createBoltModKeyword(span?: TextSpan | null): BoltModKeyword;
export function createBoltMutKeyword(span?: TextSpan | null): BoltMutKeyword;
export function createBoltEnumKeyword(span?: TextSpan | null): BoltEnumKeyword;
export function createBoltStructKeyword(span?: TextSpan | null): BoltStructKeyword;
export function createBoltTypeKeyword(span?: TextSpan | null): BoltTypeKeyword;
export function createBoltTraitKeyworkd(span?: TextSpan | null): BoltTraitKeyworkd;
export function createBoltParenthesized(text: string, span?: TextSpan | null): BoltParenthesized;
export function createBoltBraced(text: string, span?: TextSpan | null): BoltBraced;
export function createBoltBracketed(text: string, span?: TextSpan | null): BoltBracketed;
export function createBoltSourceFile(elements: BoltSourceElement[], span?: TextSpan | null): BoltSourceFile;
export function createBoltQualName(modulePath: BoltIdentifier[], name: BoltSymbol, span?: TextSpan | null): BoltQualName;
export function createBoltSentence(tokens: BoltToken[], span?: TextSpan | null): BoltSentence;
export function createBoltReferenceTypeExpression(name: BoltQualName, arguments: BoltTypeExpression[] | null, span?: TextSpan | null): BoltReferenceTypeExpression;
export function createBoltTypeParameter(index: number, name: BoltIdentifier, defaultType: BoltTypeExpression | null, span?: TextSpan | null): BoltTypeParameter;
export function createBoltBindPattern(name: BoltIdentifier, span?: TextSpan | null): BoltBindPattern;
export function createBoltTypePattern(type: BoltTypeExpression, nestedPattern: BoltPattern, span?: TextSpan | null): BoltTypePattern;
export function createBoltExpressionPattern(expression: BoltExpression, span?: TextSpan | null): BoltExpressionPattern;
export function createBoltTuplePatternElement(index: number, pattern: BoltPattern, span?: TextSpan | null): BoltTuplePatternElement;
export function createBoltTuplePattern(elements: BoltTuplePatternElement[], span?: TextSpan | null): BoltTuplePattern;
export function createBoltRecordPatternField(name: BoltIdentifier, pattern: BoltPattern, span?: TextSpan | null): BoltRecordPatternField;
export function createBoltRecordPattern(name: BoltTypeExpression, fields: BoltRecordPatternField[], span?: TextSpan | null): BoltRecordPattern;
export function createBoltReferenceExpression(name: BoltQualName, span?: TextSpan | null): BoltReferenceExpression;
export function createBoltCallExpression(operator: BoltExpression, operands: BoltExpression[], span?: TextSpan | null): BoltCallExpression;
export function createBoltYieldExpression(value: BoltExpression, span?: TextSpan | null): BoltYieldExpression;
export function createBoltMatchArm(pattern: BoltPattern, body: BoltExpression, span?: TextSpan | null): BoltMatchArm;
export function createBoltMatchExpression(value: BoltExpression, arms: BoltMatchArm[], span?: TextSpan | null): BoltMatchExpression;
export function createBoltCase(test: BoltExpression, result: BoltExpression, span?: TextSpan | null): BoltCase;
export function createBoltCaseExpression(cases: BoltCase[], span?: TextSpan | null): BoltCaseExpression;
export function createBoltBlockExpression(statements: BoltStatement[], span?: TextSpan | null): BoltBlockExpression;
export function createBoltConstantExpression(value: BoltValue, span?: TextSpan | null): BoltConstantExpression;
export function createBoltReturnStatement(value: BoltExpression | null, span?: TextSpan | null): BoltReturnStatement;
export function createBoltResumeStatement(value: BoltExpression, span?: TextSpan | null): BoltResumeStatement;
export function createBoltExpressionStatement(expression: BoltExpression, span?: TextSpan | null): BoltExpressionStatement;
export function createBoltParameter(index: number, bindings: BoltPattern, type: BoltTypeExpression | null, defaultValue: BoltExpression | null, span?: TextSpan | null): BoltParameter;
export function createBoltModule(modifiers: BoltDeclarationModifiers, name: BoltQualName, elements: BoltSourceElement[], span?: TextSpan | null): BoltModule;
export function createBoltFunctionDeclaration(modifiers: BoltDeclarationModifiers, target: string, name: BoltSymbol, params: BoltParameter[], returnType: BoltTypeExpression | null, body: BoltStatement[], span?: TextSpan | null): BoltFunctionDeclaration;
export function createBoltVariableDeclaration(modifiers: BoltDeclarationModifiers, bindings: BoltPattern, type: BoltTypeExpression | null, value: BoltExpression | null, span?: TextSpan | null): BoltVariableDeclaration;
export function createBoltPlainImportSymbol(name: BoltQualName, span?: TextSpan | null): BoltPlainImportSymbol;
export function createBoltImportDeclaration(file: string, symbols: BoltImportSymbol[], span?: TextSpan | null): BoltImportDeclaration;
export function createBoltRecordDeclarationField(name: BoltIdentifier, type: BoltTypeExpression, span?: TextSpan | null): BoltRecordDeclarationField;
export function createBoltTypeAliasDeclaration(modifiers: BoltDeclarationModifiers, name: BoltIdentifier, typeParams: BoltTypeParameter[] | null, typeExpr: BoltTypeExpression, span?: TextSpan | null): BoltTypeAliasDeclaration;
export function createBoltRecordDeclaration(modifiers: BoltDeclarationModifiers, name: BoltQualName, typeParms: BoltTypeParameter[] | null, fields: BoltRecordDeclarationField[], span?: TextSpan | null): BoltRecordDeclaration;
export function createJSOperator(text: string, span?: TextSpan | null): JSOperator;
export function createJSIdentifier(text: string, span?: TextSpan | null): JSIdentifier;
export function createJSReturnKeyword(span?: TextSpan | null): JSReturnKeyword;
export function createJSTryKeyword(span?: TextSpan | null): JSTryKeyword;
export function createJSCatchKeyword(span?: TextSpan | null): JSCatchKeyword;
export function createJSBindPattern(name: JSIdentifier, span?: TextSpan | null): JSBindPattern;
export function createJSConstantExpression(value: BoltValue, span?: TextSpan | null): JSConstantExpression;
export function createJSMemberExpression(value: JSExpression, property: JSExpression, modifiers: JSMemberExpressionModifiers, span?: TextSpan | null): JSMemberExpression;
export function createJSCallExpression(operator: JSExpression, operands: JSExpression[], span?: TextSpan | null): JSCallExpression;
export function createJSBinaryExpression(left: JSExpression, operator: JSOperator, right: JSExpression, span?: TextSpan | null): JSBinaryExpression;
export function createJSUnaryExpression(operator: JSOperator, operand: JSExpression, span?: TextSpan | null): JSUnaryExpression;
export function createJSNewExpression(target: JSExpression, arguments: JSExpression[], span?: TextSpan | null): JSNewExpression;
export function createJSSequenceExpression(expressions: JSExpression[], span?: TextSpan | null): JSSequenceExpression;
export function createJSConditionalExpression(test: JSExpression, consequent: JSExpression, alternate: JSExpression, span?: TextSpan | null): JSConditionalExpression;
export function createJSReferenceExpression(name: string, span?: TextSpan | null): JSReferenceExpression;
export function createJSExpressionStatement(expression: JSExpression, span?: TextSpan | null): JSExpressionStatement;
export function createJSConditionalStatement(test: JSExpression, consequent: JSStatement[], alternate: JSStatement[], span?: TextSpan | null): JSConditionalStatement;
export function createJSParameter(index: number, bindings: JSPattern, defaultValue: JSExpression | null, span?: TextSpan | null): JSParameter;
export function createJSFunctionDeclaration(modifiers: JSDeclarationModifiers, name: JSIdentifier, params: JSParameter[], body: JSStatement[], span?: TextSpan | null): JSFunctionDeclaration;
export function createJSArrowFunctionDeclaration(name: JSIdentifier, params: JSParameter[], body: JSExpression, span?: TextSpan | null): JSArrowFunctionDeclaration;
export function createJSLetDeclaration(bindings: JSPattern, value: JSExpression | null, span?: TextSpan | null): JSLetDeclaration;
export function createJSSourceFile(elements: JSSourceElement[], span?: TextSpan | null): JSSourceFile;

export function isEndOfFile(value: any): value is EndOfFile;
export function isFunctionBody(value: any): value is FunctionBody;
export function isBoltToken(value: any): value is BoltToken;
export function isBoltStringLiteral(value: any): value is BoltStringLiteral;
export function isBoltIntegerLiteral(value: any): value is BoltIntegerLiteral;
export function isBoltSymbol(value: any): value is BoltSymbol;
export function isBoltIdentifier(value: any): value is BoltIdentifier;
export function isBoltOperator(value: any): value is BoltOperator;
export function isBoltAssignment(value: any): value is BoltAssignment;
export function isBoltComma(value: any): value is BoltComma;
export function isBoltSemi(value: any): value is BoltSemi;
export function isBoltColon(value: any): value is BoltColon;
export function isBoltDot(value: any): value is BoltDot;
export function isBoltDotDot(value: any): value is BoltDotDot;
export function isBoltRArrow(value: any): value is BoltRArrow;
export function isBoltLArrow(value: any): value is BoltLArrow;
export function isBoltEqSign(value: any): value is BoltEqSign;
export function isBoltGtSign(value: any): value is BoltGtSign;
export function isBoltLtSign(value: any): value is BoltLtSign;
export function isBoltKeyword(value: any): value is BoltKeyword;
export function isBoltFnKeyword(value: any): value is BoltFnKeyword;
export function isBoltForeignKeyword(value: any): value is BoltForeignKeyword;
export function isBoltLetKeyword(value: any): value is BoltLetKeyword;
export function isBoltReturnKeyword(value: any): value is BoltReturnKeyword;
export function isBoltLoopKeyword(value: any): value is BoltLoopKeyword;
export function isBoltYieldKeyword(value: any): value is BoltYieldKeyword;
export function isBoltMatchKeyword(value: any): value is BoltMatchKeyword;
export function isBoltImportKeyword(value: any): value is BoltImportKeyword;
export function isBoltPubKeyword(value: any): value is BoltPubKeyword;
export function isBoltModKeyword(value: any): value is BoltModKeyword;
export function isBoltMutKeyword(value: any): value is BoltMutKeyword;
export function isBoltEnumKeyword(value: any): value is BoltEnumKeyword;
export function isBoltStructKeyword(value: any): value is BoltStructKeyword;
export function isBoltTypeKeyword(value: any): value is BoltTypeKeyword;
export function isBoltTraitKeyworkd(value: any): value is BoltTraitKeyworkd;
export function isBoltPunctuated(value: any): value is BoltPunctuated;
export function isBoltParenthesized(value: any): value is BoltParenthesized;
export function isBoltBraced(value: any): value is BoltBraced;
export function isBoltBracketed(value: any): value is BoltBracketed;
export function isBoltSourceFile(value: any): value is BoltSourceFile;
export function isBoltQualName(value: any): value is BoltQualName;
export function isBoltSentence(value: any): value is BoltSentence;
export function isBoltTypeExpression(value: any): value is BoltTypeExpression;
export function isBoltReferenceTypeExpression(value: any): value is BoltReferenceTypeExpression;
export function isBoltTypeParameter(value: any): value is BoltTypeParameter;
export function isBoltPattern(value: any): value is BoltPattern;
export function isBoltBindPattern(value: any): value is BoltBindPattern;
export function isBoltTypePattern(value: any): value is BoltTypePattern;
export function isBoltExpressionPattern(value: any): value is BoltExpressionPattern;
export function isBoltTuplePatternElement(value: any): value is BoltTuplePatternElement;
export function isBoltTuplePattern(value: any): value is BoltTuplePattern;
export function isBoltRecordPatternField(value: any): value is BoltRecordPatternField;
export function isBoltRecordPattern(value: any): value is BoltRecordPattern;
export function isBoltExpression(value: any): value is BoltExpression;
export function isBoltReferenceExpression(value: any): value is BoltReferenceExpression;
export function isBoltCallExpression(value: any): value is BoltCallExpression;
export function isBoltYieldExpression(value: any): value is BoltYieldExpression;
export function isBoltMatchArm(value: any): value is BoltMatchArm;
export function isBoltMatchExpression(value: any): value is BoltMatchExpression;
export function isBoltCase(value: any): value is BoltCase;
export function isBoltCaseExpression(value: any): value is BoltCaseExpression;
export function isBoltBlockExpression(value: any): value is BoltBlockExpression;
export function isBoltConstantExpression(value: any): value is BoltConstantExpression;
export function isBoltStatement(value: any): value is BoltStatement;
export function isBoltReturnStatement(value: any): value is BoltReturnStatement;
export function isBoltResumeStatement(value: any): value is BoltResumeStatement;
export function isBoltExpressionStatement(value: any): value is BoltExpressionStatement;
export function isBoltParameter(value: any): value is BoltParameter;
export function isBoltDeclaration(value: any): value is BoltDeclaration;
export function isBoltTypeDeclaration(value: any): value is BoltTypeDeclaration;
export function isBoltModule(value: any): value is BoltModule;
export function isBoltFunctionDeclaration(value: any): value is BoltFunctionDeclaration;
export function isBoltVariableDeclaration(value: any): value is BoltVariableDeclaration;
export function isBoltImportSymbol(value: any): value is BoltImportSymbol;
export function isBoltPlainImportSymbol(value: any): value is BoltPlainImportSymbol;
export function isBoltImportDeclaration(value: any): value is BoltImportDeclaration;
export function isBoltRecordDeclarationField(value: any): value is BoltRecordDeclarationField;
export function isBoltTypeAliasDeclaration(value: any): value is BoltTypeAliasDeclaration;
export function isBoltSourceElement(value: any): value is BoltSourceElement;
export function isBoltRecordDeclaration(value: any): value is BoltRecordDeclaration;
export function isJSToken(value: any): value is JSToken;
export function isJSOperator(value: any): value is JSOperator;
export function isJSIdentifier(value: any): value is JSIdentifier;
export function isJSReturnKeyword(value: any): value is JSReturnKeyword;
export function isJSTryKeyword(value: any): value is JSTryKeyword;
export function isJSCatchKeyword(value: any): value is JSCatchKeyword;
export function isJSPattern(value: any): value is JSPattern;
export function isJSBindPattern(value: any): value is JSBindPattern;
export function isJSExpression(value: any): value is JSExpression;
export function isJSConstantExpression(value: any): value is JSConstantExpression;
export function isJSMemberExpression(value: any): value is JSMemberExpression;
export function isJSCallExpression(value: any): value is JSCallExpression;
export function isJSBinaryExpression(value: any): value is JSBinaryExpression;
export function isJSUnaryExpression(value: any): value is JSUnaryExpression;
export function isJSNewExpression(value: any): value is JSNewExpression;
export function isJSSequenceExpression(value: any): value is JSSequenceExpression;
export function isJSConditionalExpression(value: any): value is JSConditionalExpression;
export function isJSReferenceExpression(value: any): value is JSReferenceExpression;
export function isJSSourceElement(value: any): value is JSSourceElement;
export function isJSStatement(value: any): value is JSStatement;
export function isJSExpressionStatement(value: any): value is JSExpressionStatement;
export function isJSConditionalStatement(value: any): value is JSConditionalStatement;
export function isJSParameter(value: any): value is JSParameter;
export function isJSDeclaration(value: any): value is JSDeclaration;
export function isJSFunctionDeclaration(value: any): value is JSFunctionDeclaration;
export function isJSArrowFunctionDeclaration(value: any): value is JSArrowFunctionDeclaration;
export function isJSLetDeclaration(value: any): value is JSLetDeclaration;
export function isJSSourceFile(value: any): value is JSSourceFile;
