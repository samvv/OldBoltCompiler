import { Type } from "./types";

import { TextSpan } from "./text";

import { Value } from "./evaluator";

import { Package } from "./package";

import { Diagnostic } from "./diagnostics";

let nextNodeId = 1;

export type ResolveSyntaxKind<K extends SyntaxKind> = Extract<Syntax, {
    kind: K;
}>;

export abstract class SyntaxBase {
    public id: number;
    public type?: Type;
    public errors: Diagnostic[] = [];
    public abstract kind: SyntaxKind;
    public abstract parentNode: Syntax | null = null;
    public abstract getChildNodes(): IterableIterator<Syntax>;
    constructor(public span: TextSpan | null = null) {
        this.id = nextNodeId++;
    }
    *preorder() {
        const stack: Syntax[] = [this as unknown as Syntax];
        while (stack.length > 0) {
            const node = stack.pop()!;
            yield node;
            for (const childNode of node.getChildNodes()) {
                stack.push(childNode);
            }
        }
    }
    mayContainKind(kind: SyntaxKind) {
        // TODO
        return true;
    }
    getParentOfKind(kind: SyntaxKind) {
        let currNode = this.parentNode;
        while (currNode !== null) {
            if (currNode.kind === kind) {
                return currNode;
            }
            currNode = currNode.parentNode;
        }
        return null;
    }
    *findAllChildrenOfKind<K extends SyntaxKind>(kind: K): IterableIterator<ResolveSyntaxKind<K>> {
        for (const node of this.preorder()) {
            if (!node.mayContainKind(kind)) {
                break;
            }
            if (node.kind === kind) {
                yield node as ResolveSyntaxKind<K>;
            }
        }
    }
}

export function setParents(node: Syntax, parentNode: Syntax | null = null) {
    // NOTE We cast to any here because TypeScript does not like this complex assignment
    node.parentNode = parentNode as any;
    for (const child of node.getChildNodes()) {
        setParents(child, node);
    }
}

export enum BoltModifiers {
    IsMutable = 0x1,
    IsPublic = 0x2
}

export enum JSDeclarationModifiers {
    IsExported = 0x1
}



export class EndOfFile extends SyntaxBase {
    parentNode: null | EndOfFileParent = null;
    kind: SyntaxKind.EndOfFile = SyntaxKind.EndOfFile;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<EndOfFileChild> { }
}

type EndOfFileParent = never;

type EndOfFileChild = never;

export type Token = JSNotOp | JSBNotOp | JSBAndOp | JSBXorOp | JSBOrOp | JSGtOp | JSLtOp | JSSubOp | JSDivOp | JSAddOp | JSMulOp | JSDotDotDot | JSDot | JSComma | JSSemi | JSOpenParen | JSOpenBracket | JSOpenBrace | JSCloseParen | JSCloseBracket | JSCloseBrace | JSOperator | JSForKeyword | JSWhileKeyword | JSFunctionKeyword | JSExportKeyword | JSLetKeyword | JSConstKeyword | JSAsKeyword | JSImportKeyword | JSCatchKeyword | JSFinallyKeyword | JSTryKeyword | JSReturnKeyword | JSFromKeyword | JSInteger | JSString | JSIdentifier | EndOfFile | BoltBracketed | BoltBraced | BoltParenthesized | BoltImplKeyword | BoltTraitKeyword | BoltTypeKeyword | BoltStructKeyword | BoltEnumKeyword | BoltMutKeyword | BoltModKeyword | BoltPubKeyword | BoltExportKeyword | BoltImportKeyword | BoltMatchKeyword | BoltYieldKeyword | BoltLoopKeyword | BoltReturnKeyword | BoltLetKeyword | BoltForKeyword | BoltForeignKeyword | BoltFnKeyword | BoltQuoteKeyword | BoltWhereKeyword | BoltVBar | BoltLtSign | BoltExMark | BoltGtSign | BoltEqSign | BoltLArrow | BoltRArrowAlt | BoltRArrow | BoltDotDot | BoltDot | BoltColonColon | BoltColon | BoltSemi | BoltComma | BoltAssignment | BoltOperator | BoltIdentifier | BoltIntegerLiteral | BoltStringLiteral;

export type SourceFile = JSSourceFile | BoltSourceFile;

export type FunctionBodyElement = JSLetDeclaration | JSArrowFunctionDeclaration | JSFunctionDeclaration | JSImportDeclaration | JSReturnStatement | JSConditionalStatement | JSExpressionStatement | JSTryCatchStatement | BoltMacroCall | BoltVariableDeclaration | BoltFunctionDeclaration | BoltLoopStatement | BoltExpressionStatement | BoltResumeStatement | BoltConditionalStatement | BoltReturnStatement;

export type ReturnStatement = JSReturnStatement | BoltReturnStatement;

export type BoltSyntax = BoltMacroCall | BoltRecordField | BoltPlainExportSymbol | BoltImportDirective | BoltPlainImportSymbol | BoltModule | BoltRecordDeclaration | BoltTypeAliasDeclaration | BoltImplDeclaration | BoltTraitDeclaration | BoltVariableDeclaration | BoltFunctionDeclaration | BoltParameter | BoltConditionalCase | BoltLoopStatement | BoltExpressionStatement | BoltResumeStatement | BoltConditionalStatement | BoltReturnStatement | BoltCase | BoltMatchArm | BoltConstantExpression | BoltBlockExpression | BoltCaseExpression | BoltMatchExpression | BoltYieldExpression | BoltCallExpression | BoltFunctionExpression | BoltMemberExpression | BoltReferenceExpression | BoltTupleExpression | BoltQuoteExpression | BoltRecordFieldPattern | BoltTuplePatternElement | BoltRecordPattern | BoltTuplePattern | BoltExpressionPattern | BoltTypePattern | BoltBindPattern | BoltTypeParameter | BoltLiftedTypeExpression | BoltFunctionTypeExpression | BoltReferenceTypeExpression | BoltTypeOfExpression | BoltQualName | BoltSourceFile | BoltBracketed | BoltBraced | BoltParenthesized | BoltImplKeyword | BoltTraitKeyword | BoltTypeKeyword | BoltStructKeyword | BoltEnumKeyword | BoltMutKeyword | BoltModKeyword | BoltPubKeyword | BoltExportKeyword | BoltImportKeyword | BoltMatchKeyword | BoltYieldKeyword | BoltLoopKeyword | BoltReturnKeyword | BoltLetKeyword | BoltForKeyword | BoltForeignKeyword | BoltFnKeyword | BoltQuoteKeyword | BoltWhereKeyword | BoltVBar | BoltLtSign | BoltExMark | BoltGtSign | BoltEqSign | BoltLArrow | BoltRArrowAlt | BoltRArrow | BoltDotDot | BoltDot | BoltColonColon | BoltColon | BoltSemi | BoltComma | BoltAssignment | BoltOperator | BoltIdentifier | BoltIntegerLiteral | BoltStringLiteral | EndOfFile;

export type BoltToken = BoltBracketed | BoltBraced | BoltParenthesized | BoltImplKeyword | BoltTraitKeyword | BoltTypeKeyword | BoltStructKeyword | BoltEnumKeyword | BoltMutKeyword | BoltModKeyword | BoltPubKeyword | BoltExportKeyword | BoltImportKeyword | BoltMatchKeyword | BoltYieldKeyword | BoltLoopKeyword | BoltReturnKeyword | BoltLetKeyword | BoltForKeyword | BoltForeignKeyword | BoltFnKeyword | BoltQuoteKeyword | BoltWhereKeyword | BoltVBar | BoltLtSign | BoltExMark | BoltGtSign | BoltEqSign | BoltLArrow | BoltRArrowAlt | BoltRArrow | BoltDotDot | BoltDot | BoltColonColon | BoltColon | BoltSemi | BoltComma | BoltAssignment | BoltOperator | BoltIdentifier | BoltIntegerLiteral | BoltStringLiteral | EndOfFile;

export class BoltStringLiteral extends SyntaxBase {
    parentNode: null | BoltStringLiteralParent = null;
    kind: SyntaxKind.BoltStringLiteral = SyntaxKind.BoltStringLiteral;
    constructor(public value: string, span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltStringLiteralChild> { }
}

type BoltStringLiteralParent = BoltImportDirective | never;

type BoltStringLiteralChild = never;

export class BoltIntegerLiteral extends SyntaxBase {
    parentNode: null | BoltIntegerLiteralParent = null;
    kind: SyntaxKind.BoltIntegerLiteral = SyntaxKind.BoltIntegerLiteral;
    constructor(public value: bigint, span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltIntegerLiteralChild> { }
}

type BoltIntegerLiteralParent = never;

type BoltIntegerLiteralChild = never;

export type BoltSymbol = BoltOperator | BoltVBar | BoltLtSign | BoltExMark | BoltGtSign | BoltIdentifier;

export class BoltIdentifier extends SyntaxBase {
    parentNode: null | BoltIdentifierParent = null;
    kind: SyntaxKind.BoltIdentifier = SyntaxKind.BoltIdentifier;
    constructor(public text: string, span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltIdentifierChild> { }
}

type BoltIdentifierParent = BoltQualName | BoltTypeParameter | BoltBindPattern | BoltRecordFieldPattern | BoltMemberExpression | BoltPlainImportSymbol | BoltPlainExportSymbol | BoltRecordField | BoltFunctionDeclaration | BoltTraitDeclaration | BoltImplDeclaration | BoltTypeAliasDeclaration | BoltRecordDeclaration | BoltModule | BoltMacroCall | never;

type BoltIdentifierChild = never;

export type BoltOperatorLike = BoltVBar | BoltLtSign | BoltExMark | BoltGtSign;

export class BoltOperator extends SyntaxBase {
    parentNode: null | BoltOperatorParent = null;
    kind: SyntaxKind.BoltOperator = SyntaxKind.BoltOperator;
    constructor(public text: string, span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltOperatorChild> { }
}

type BoltOperatorParent = BoltQualName | BoltPlainImportSymbol | BoltPlainExportSymbol | BoltFunctionDeclaration | never;

type BoltOperatorChild = never;

export class BoltAssignment extends SyntaxBase {
    parentNode: null | BoltAssignmentParent = null;
    kind: SyntaxKind.BoltAssignment = SyntaxKind.BoltAssignment;
    constructor(public operator: string | null, span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltAssignmentChild> { }
}

type BoltAssignmentParent = never;

type BoltAssignmentChild = never;

export class BoltComma extends SyntaxBase {
    parentNode: null | BoltCommaParent = null;
    kind: SyntaxKind.BoltComma = SyntaxKind.BoltComma;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltCommaChild> { }
}

type BoltCommaParent = never;

type BoltCommaChild = never;

export class BoltSemi extends SyntaxBase {
    parentNode: null | BoltSemiParent = null;
    kind: SyntaxKind.BoltSemi = SyntaxKind.BoltSemi;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltSemiChild> { }
}

type BoltSemiParent = never;

type BoltSemiChild = never;

export class BoltColon extends SyntaxBase {
    parentNode: null | BoltColonParent = null;
    kind: SyntaxKind.BoltColon = SyntaxKind.BoltColon;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltColonChild> { }
}

type BoltColonParent = never;

type BoltColonChild = never;

export class BoltColonColon extends SyntaxBase {
    parentNode: null | BoltColonColonParent = null;
    kind: SyntaxKind.BoltColonColon = SyntaxKind.BoltColonColon;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltColonColonChild> { }
}

type BoltColonColonParent = never;

type BoltColonColonChild = never;

export class BoltDot extends SyntaxBase {
    parentNode: null | BoltDotParent = null;
    kind: SyntaxKind.BoltDot = SyntaxKind.BoltDot;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltDotChild> { }
}

type BoltDotParent = never;

type BoltDotChild = never;

export class BoltDotDot extends SyntaxBase {
    parentNode: null | BoltDotDotParent = null;
    kind: SyntaxKind.BoltDotDot = SyntaxKind.BoltDotDot;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltDotDotChild> { }
}

type BoltDotDotParent = never;

type BoltDotDotChild = never;

export class BoltRArrow extends SyntaxBase {
    parentNode: null | BoltRArrowParent = null;
    kind: SyntaxKind.BoltRArrow = SyntaxKind.BoltRArrow;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltRArrowChild> { }
}

type BoltRArrowParent = never;

type BoltRArrowChild = never;

export class BoltRArrowAlt extends SyntaxBase {
    parentNode: null | BoltRArrowAltParent = null;
    kind: SyntaxKind.BoltRArrowAlt = SyntaxKind.BoltRArrowAlt;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltRArrowAltChild> { }
}

type BoltRArrowAltParent = never;

type BoltRArrowAltChild = never;

export class BoltLArrow extends SyntaxBase {
    parentNode: null | BoltLArrowParent = null;
    kind: SyntaxKind.BoltLArrow = SyntaxKind.BoltLArrow;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltLArrowChild> { }
}

type BoltLArrowParent = never;

type BoltLArrowChild = never;

export class BoltEqSign extends SyntaxBase {
    parentNode: null | BoltEqSignParent = null;
    kind: SyntaxKind.BoltEqSign = SyntaxKind.BoltEqSign;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltEqSignChild> { }
}

type BoltEqSignParent = never;

type BoltEqSignChild = never;

export class BoltGtSign extends SyntaxBase {
    parentNode: null | BoltGtSignParent = null;
    kind: SyntaxKind.BoltGtSign = SyntaxKind.BoltGtSign;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltGtSignChild> { }
}

type BoltGtSignParent = BoltQualName | BoltPlainImportSymbol | BoltPlainExportSymbol | BoltFunctionDeclaration | never;

type BoltGtSignChild = never;

export class BoltExMark extends SyntaxBase {
    parentNode: null | BoltExMarkParent = null;
    kind: SyntaxKind.BoltExMark = SyntaxKind.BoltExMark;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltExMarkChild> { }
}

type BoltExMarkParent = BoltQualName | BoltPlainImportSymbol | BoltPlainExportSymbol | BoltFunctionDeclaration | never;

type BoltExMarkChild = never;

export class BoltLtSign extends SyntaxBase {
    parentNode: null | BoltLtSignParent = null;
    kind: SyntaxKind.BoltLtSign = SyntaxKind.BoltLtSign;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltLtSignChild> { }
}

type BoltLtSignParent = BoltQualName | BoltPlainImportSymbol | BoltPlainExportSymbol | BoltFunctionDeclaration | never;

type BoltLtSignChild = never;

export class BoltVBar extends SyntaxBase {
    parentNode: null | BoltVBarParent = null;
    kind: SyntaxKind.BoltVBar = SyntaxKind.BoltVBar;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltVBarChild> { }
}

type BoltVBarParent = BoltQualName | BoltPlainImportSymbol | BoltPlainExportSymbol | BoltFunctionDeclaration | never;

type BoltVBarChild = never;

export type BoltKeyword = BoltImplKeyword | BoltTraitKeyword | BoltTypeKeyword | BoltStructKeyword | BoltEnumKeyword | BoltMutKeyword | BoltModKeyword | BoltPubKeyword | BoltExportKeyword | BoltImportKeyword | BoltMatchKeyword | BoltYieldKeyword | BoltLoopKeyword | BoltReturnKeyword | BoltLetKeyword | BoltForKeyword | BoltForeignKeyword | BoltFnKeyword | BoltQuoteKeyword | BoltWhereKeyword;

export class BoltWhereKeyword extends SyntaxBase {
    parentNode: null | BoltWhereKeywordParent = null;
    kind: SyntaxKind.BoltWhereKeyword = SyntaxKind.BoltWhereKeyword;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltWhereKeywordChild> { }
}

type BoltWhereKeywordParent = never;

type BoltWhereKeywordChild = never;

export class BoltQuoteKeyword extends SyntaxBase {
    parentNode: null | BoltQuoteKeywordParent = null;
    kind: SyntaxKind.BoltQuoteKeyword = SyntaxKind.BoltQuoteKeyword;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltQuoteKeywordChild> { }
}

type BoltQuoteKeywordParent = never;

type BoltQuoteKeywordChild = never;

export class BoltFnKeyword extends SyntaxBase {
    parentNode: null | BoltFnKeywordParent = null;
    kind: SyntaxKind.BoltFnKeyword = SyntaxKind.BoltFnKeyword;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltFnKeywordChild> { }
}

type BoltFnKeywordParent = never;

type BoltFnKeywordChild = never;

export class BoltForeignKeyword extends SyntaxBase {
    parentNode: null | BoltForeignKeywordParent = null;
    kind: SyntaxKind.BoltForeignKeyword = SyntaxKind.BoltForeignKeyword;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltForeignKeywordChild> { }
}

type BoltForeignKeywordParent = never;

type BoltForeignKeywordChild = never;

export class BoltForKeyword extends SyntaxBase {
    parentNode: null | BoltForKeywordParent = null;
    kind: SyntaxKind.BoltForKeyword = SyntaxKind.BoltForKeyword;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltForKeywordChild> { }
}

type BoltForKeywordParent = never;

type BoltForKeywordChild = never;

export class BoltLetKeyword extends SyntaxBase {
    parentNode: null | BoltLetKeywordParent = null;
    kind: SyntaxKind.BoltLetKeyword = SyntaxKind.BoltLetKeyword;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltLetKeywordChild> { }
}

type BoltLetKeywordParent = never;

type BoltLetKeywordChild = never;

export class BoltReturnKeyword extends SyntaxBase {
    parentNode: null | BoltReturnKeywordParent = null;
    kind: SyntaxKind.BoltReturnKeyword = SyntaxKind.BoltReturnKeyword;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltReturnKeywordChild> { }
}

type BoltReturnKeywordParent = never;

type BoltReturnKeywordChild = never;

export class BoltLoopKeyword extends SyntaxBase {
    parentNode: null | BoltLoopKeywordParent = null;
    kind: SyntaxKind.BoltLoopKeyword = SyntaxKind.BoltLoopKeyword;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltLoopKeywordChild> { }
}

type BoltLoopKeywordParent = never;

type BoltLoopKeywordChild = never;

export class BoltYieldKeyword extends SyntaxBase {
    parentNode: null | BoltYieldKeywordParent = null;
    kind: SyntaxKind.BoltYieldKeyword = SyntaxKind.BoltYieldKeyword;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltYieldKeywordChild> { }
}

type BoltYieldKeywordParent = never;

type BoltYieldKeywordChild = never;

export class BoltMatchKeyword extends SyntaxBase {
    parentNode: null | BoltMatchKeywordParent = null;
    kind: SyntaxKind.BoltMatchKeyword = SyntaxKind.BoltMatchKeyword;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltMatchKeywordChild> { }
}

type BoltMatchKeywordParent = never;

type BoltMatchKeywordChild = never;

export class BoltImportKeyword extends SyntaxBase {
    parentNode: null | BoltImportKeywordParent = null;
    kind: SyntaxKind.BoltImportKeyword = SyntaxKind.BoltImportKeyword;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltImportKeywordChild> { }
}

type BoltImportKeywordParent = never;

type BoltImportKeywordChild = never;

export class BoltExportKeyword extends SyntaxBase {
    parentNode: null | BoltExportKeywordParent = null;
    kind: SyntaxKind.BoltExportKeyword = SyntaxKind.BoltExportKeyword;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltExportKeywordChild> { }
}

type BoltExportKeywordParent = never;

type BoltExportKeywordChild = never;

export class BoltPubKeyword extends SyntaxBase {
    parentNode: null | BoltPubKeywordParent = null;
    kind: SyntaxKind.BoltPubKeyword = SyntaxKind.BoltPubKeyword;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltPubKeywordChild> { }
}

type BoltPubKeywordParent = never;

type BoltPubKeywordChild = never;

export class BoltModKeyword extends SyntaxBase {
    parentNode: null | BoltModKeywordParent = null;
    kind: SyntaxKind.BoltModKeyword = SyntaxKind.BoltModKeyword;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltModKeywordChild> { }
}

type BoltModKeywordParent = never;

type BoltModKeywordChild = never;

export class BoltMutKeyword extends SyntaxBase {
    parentNode: null | BoltMutKeywordParent = null;
    kind: SyntaxKind.BoltMutKeyword = SyntaxKind.BoltMutKeyword;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltMutKeywordChild> { }
}

type BoltMutKeywordParent = never;

type BoltMutKeywordChild = never;

export class BoltEnumKeyword extends SyntaxBase {
    parentNode: null | BoltEnumKeywordParent = null;
    kind: SyntaxKind.BoltEnumKeyword = SyntaxKind.BoltEnumKeyword;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltEnumKeywordChild> { }
}

type BoltEnumKeywordParent = never;

type BoltEnumKeywordChild = never;

export class BoltStructKeyword extends SyntaxBase {
    parentNode: null | BoltStructKeywordParent = null;
    kind: SyntaxKind.BoltStructKeyword = SyntaxKind.BoltStructKeyword;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltStructKeywordChild> { }
}

type BoltStructKeywordParent = never;

type BoltStructKeywordChild = never;

export class BoltTypeKeyword extends SyntaxBase {
    parentNode: null | BoltTypeKeywordParent = null;
    kind: SyntaxKind.BoltTypeKeyword = SyntaxKind.BoltTypeKeyword;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltTypeKeywordChild> { }
}

type BoltTypeKeywordParent = never;

type BoltTypeKeywordChild = never;

export class BoltTraitKeyword extends SyntaxBase {
    parentNode: null | BoltTraitKeywordParent = null;
    kind: SyntaxKind.BoltTraitKeyword = SyntaxKind.BoltTraitKeyword;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltTraitKeywordChild> { }
}

type BoltTraitKeywordParent = never;

type BoltTraitKeywordChild = never;

export class BoltImplKeyword extends SyntaxBase {
    parentNode: null | BoltImplKeywordParent = null;
    kind: SyntaxKind.BoltImplKeyword = SyntaxKind.BoltImplKeyword;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltImplKeywordChild> { }
}

type BoltImplKeywordParent = never;

type BoltImplKeywordChild = never;

export type BoltPunctuated = BoltBracketed | BoltBraced | BoltParenthesized;

export class BoltParenthesized extends SyntaxBase {
    parentNode: null | BoltParenthesizedParent = null;
    kind: SyntaxKind.BoltParenthesized = SyntaxKind.BoltParenthesized;
    constructor(public text: string, span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltParenthesizedChild> { }
}

type BoltParenthesizedParent = never;

type BoltParenthesizedChild = never;

export class BoltBraced extends SyntaxBase {
    parentNode: null | BoltBracedParent = null;
    kind: SyntaxKind.BoltBraced = SyntaxKind.BoltBraced;
    constructor(public text: string, span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltBracedChild> { }
}

type BoltBracedParent = never;

type BoltBracedChild = never;

export class BoltBracketed extends SyntaxBase {
    parentNode: null | BoltBracketedParent = null;
    kind: SyntaxKind.BoltBracketed = SyntaxKind.BoltBracketed;
    constructor(public text: string, span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltBracketedChild> { }
}

type BoltBracketedParent = never;

type BoltBracketedChild = never;

export class BoltSourceFile extends SyntaxBase {
    parentNode: null | BoltSourceFileParent = null;
    kind: SyntaxKind.BoltSourceFile = SyntaxKind.BoltSourceFile;
    constructor(public elements: BoltSourceElement[], public pkg: Package | null, span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltSourceFileChild> { for (let element of this.elements)
        yield element; }
}

type BoltSourceFileParent = never;

type BoltSourceFileChild = BoltMacroCall | BoltExportDirective | BoltImportDirective | BoltModule | BoltRecordDeclaration | BoltTypeAliasDeclaration | BoltImplDeclaration | BoltTraitDeclaration | BoltVariableDeclaration | BoltFunctionDeclaration | BoltLoopStatement | BoltExpressionStatement | BoltResumeStatement | BoltConditionalStatement | BoltReturnStatement | never;

export class BoltQualName extends SyntaxBase {
    parentNode: null | BoltQualNameParent = null;
    kind: SyntaxKind.BoltQualName = SyntaxKind.BoltQualName;
    constructor(public isAbsolute: boolean, public modulePath: BoltIdentifier[], public name: BoltSymbol, span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltQualNameChild> { for (let element of this.modulePath)
        yield element; yield this.name; }
}

type BoltQualNameParent = BoltReferenceTypeExpression | BoltReferenceExpression | BoltPlainImportSymbol | BoltPlainExportSymbol | never;

type BoltQualNameChild = BoltOperator | BoltVBar | BoltLtSign | BoltExMark | BoltGtSign | BoltIdentifier | never;

export type BoltTypeExpression = BoltLiftedTypeExpression | BoltFunctionTypeExpression | BoltReferenceTypeExpression | BoltTypeOfExpression;

export class BoltTypeOfExpression extends SyntaxBase {
    parentNode: null | BoltTypeOfExpressionParent = null;
    kind: SyntaxKind.BoltTypeOfExpression = SyntaxKind.BoltTypeOfExpression;
    constructor(public expression: BoltExpression, span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltTypeOfExpressionChild> { yield this.expression; }
}

type BoltTypeOfExpressionParent = BoltReferenceTypeExpression | BoltFunctionTypeExpression | BoltTypeParameter | BoltTypePattern | BoltRecordPattern | BoltFunctionExpression | BoltParameter | BoltRecordField | BoltFunctionDeclaration | BoltVariableDeclaration | BoltTraitDeclaration | BoltImplDeclaration | BoltTypeAliasDeclaration | never;

type BoltTypeOfExpressionChild = BoltConstantExpression | BoltBlockExpression | BoltCaseExpression | BoltMatchExpression | BoltYieldExpression | BoltCallExpression | BoltFunctionExpression | BoltMemberExpression | BoltReferenceExpression | BoltTupleExpression | BoltQuoteExpression | never;

export class BoltReferenceTypeExpression extends SyntaxBase {
    parentNode: null | BoltReferenceTypeExpressionParent = null;
    kind: SyntaxKind.BoltReferenceTypeExpression = SyntaxKind.BoltReferenceTypeExpression;
    constructor(public name: BoltQualName, public typeArgs: BoltTypeExpression[] | null, span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltReferenceTypeExpressionChild> { yield this.name; if (this.typeArgs !== null)
        for (let element of this.typeArgs)
            yield element; }
}

type BoltReferenceTypeExpressionParent = BoltReferenceTypeExpression | BoltFunctionTypeExpression | BoltTypeParameter | BoltTypePattern | BoltRecordPattern | BoltFunctionExpression | BoltParameter | BoltRecordField | BoltFunctionDeclaration | BoltVariableDeclaration | BoltTraitDeclaration | BoltImplDeclaration | BoltTypeAliasDeclaration | never;

type BoltReferenceTypeExpressionChild = BoltLiftedTypeExpression | BoltFunctionTypeExpression | BoltReferenceTypeExpression | BoltTypeOfExpression | BoltQualName | never;

export class BoltFunctionTypeExpression extends SyntaxBase {
    parentNode: null | BoltFunctionTypeExpressionParent = null;
    kind: SyntaxKind.BoltFunctionTypeExpression = SyntaxKind.BoltFunctionTypeExpression;
    constructor(public params: BoltParameter[], public returnType: BoltTypeExpression | null, span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltFunctionTypeExpressionChild> { for (let element of this.params)
        yield element; if (this.returnType !== null)
        yield this.returnType; }
}

type BoltFunctionTypeExpressionParent = BoltReferenceTypeExpression | BoltFunctionTypeExpression | BoltTypeParameter | BoltTypePattern | BoltRecordPattern | BoltFunctionExpression | BoltParameter | BoltRecordField | BoltFunctionDeclaration | BoltVariableDeclaration | BoltTraitDeclaration | BoltImplDeclaration | BoltTypeAliasDeclaration | never;

type BoltFunctionTypeExpressionChild = BoltLiftedTypeExpression | BoltFunctionTypeExpression | BoltReferenceTypeExpression | BoltTypeOfExpression | BoltParameter | never;

export class BoltLiftedTypeExpression extends SyntaxBase {
    parentNode: null | BoltLiftedTypeExpressionParent = null;
    kind: SyntaxKind.BoltLiftedTypeExpression = SyntaxKind.BoltLiftedTypeExpression;
    constructor(public expression: BoltExpression, span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltLiftedTypeExpressionChild> { yield this.expression; }
}

type BoltLiftedTypeExpressionParent = BoltReferenceTypeExpression | BoltFunctionTypeExpression | BoltTypeParameter | BoltTypePattern | BoltRecordPattern | BoltFunctionExpression | BoltParameter | BoltRecordField | BoltFunctionDeclaration | BoltVariableDeclaration | BoltTraitDeclaration | BoltImplDeclaration | BoltTypeAliasDeclaration | never;

type BoltLiftedTypeExpressionChild = BoltConstantExpression | BoltBlockExpression | BoltCaseExpression | BoltMatchExpression | BoltYieldExpression | BoltCallExpression | BoltFunctionExpression | BoltMemberExpression | BoltReferenceExpression | BoltTupleExpression | BoltQuoteExpression | never;

export class BoltTypeParameter extends SyntaxBase {
    parentNode: null | BoltTypeParameterParent = null;
    kind: SyntaxKind.BoltTypeParameter = SyntaxKind.BoltTypeParameter;
    constructor(public index: number, public name: BoltIdentifier, public typeExpr: BoltTypeExpression | null, public defaultType: BoltTypeExpression | null, span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltTypeParameterChild> { yield this.name; if (this.typeExpr !== null)
        yield this.typeExpr; if (this.defaultType !== null)
        yield this.defaultType; }
}

type BoltTypeParameterParent = BoltFunctionDeclaration | BoltTraitDeclaration | BoltImplDeclaration | BoltTypeAliasDeclaration | BoltRecordDeclaration | never;

type BoltTypeParameterChild = BoltLiftedTypeExpression | BoltFunctionTypeExpression | BoltReferenceTypeExpression | BoltTypeOfExpression | BoltIdentifier | never;

export type BoltPattern = BoltRecordPattern | BoltTuplePattern | BoltExpressionPattern | BoltTypePattern | BoltBindPattern;

export class BoltBindPattern extends SyntaxBase {
    parentNode: null | BoltBindPatternParent = null;
    kind: SyntaxKind.BoltBindPattern = SyntaxKind.BoltBindPattern;
    constructor(public name: BoltIdentifier, span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltBindPatternChild> { yield this.name; }
}

type BoltBindPatternParent = BoltTypePattern | BoltTuplePatternElement | BoltRecordFieldPattern | BoltMatchArm | BoltParameter | BoltVariableDeclaration | never;

type BoltBindPatternChild = BoltIdentifier | never;

export class BoltTypePattern extends SyntaxBase {
    parentNode: null | BoltTypePatternParent = null;
    kind: SyntaxKind.BoltTypePattern = SyntaxKind.BoltTypePattern;
    constructor(public typeExpr: BoltTypeExpression, public nestedPattern: BoltPattern, span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltTypePatternChild> { yield this.typeExpr; yield this.nestedPattern; }
}

type BoltTypePatternParent = BoltTypePattern | BoltTuplePatternElement | BoltRecordFieldPattern | BoltMatchArm | BoltParameter | BoltVariableDeclaration | never;

type BoltTypePatternChild = BoltRecordPattern | BoltTuplePattern | BoltExpressionPattern | BoltTypePattern | BoltBindPattern | BoltLiftedTypeExpression | BoltFunctionTypeExpression | BoltReferenceTypeExpression | BoltTypeOfExpression | never;

export class BoltExpressionPattern extends SyntaxBase {
    parentNode: null | BoltExpressionPatternParent = null;
    kind: SyntaxKind.BoltExpressionPattern = SyntaxKind.BoltExpressionPattern;
    constructor(public expression: BoltExpression, span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltExpressionPatternChild> { yield this.expression; }
}

type BoltExpressionPatternParent = BoltTypePattern | BoltTuplePatternElement | BoltRecordFieldPattern | BoltMatchArm | BoltParameter | BoltVariableDeclaration | never;

type BoltExpressionPatternChild = BoltConstantExpression | BoltBlockExpression | BoltCaseExpression | BoltMatchExpression | BoltYieldExpression | BoltCallExpression | BoltFunctionExpression | BoltMemberExpression | BoltReferenceExpression | BoltTupleExpression | BoltQuoteExpression | never;

export class BoltTuplePatternElement extends SyntaxBase {
    parentNode: null | BoltTuplePatternElementParent = null;
    kind: SyntaxKind.BoltTuplePatternElement = SyntaxKind.BoltTuplePatternElement;
    constructor(public index: number, public pattern: BoltPattern, span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltTuplePatternElementChild> { yield this.pattern; }
}

type BoltTuplePatternElementParent = BoltTuplePattern | never;

type BoltTuplePatternElementChild = BoltRecordPattern | BoltTuplePattern | BoltExpressionPattern | BoltTypePattern | BoltBindPattern | never;

export class BoltTuplePattern extends SyntaxBase {
    parentNode: null | BoltTuplePatternParent = null;
    kind: SyntaxKind.BoltTuplePattern = SyntaxKind.BoltTuplePattern;
    constructor(public elements: BoltTuplePatternElement[], span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltTuplePatternChild> { for (let element of this.elements)
        yield element; }
}

type BoltTuplePatternParent = BoltTypePattern | BoltTuplePatternElement | BoltRecordFieldPattern | BoltMatchArm | BoltParameter | BoltVariableDeclaration | never;

type BoltTuplePatternChild = BoltTuplePatternElement | never;

export class BoltRecordFieldPattern extends SyntaxBase {
    parentNode: null | BoltRecordFieldPatternParent = null;
    kind: SyntaxKind.BoltRecordFieldPattern = SyntaxKind.BoltRecordFieldPattern;
    constructor(public isRest: boolean, public name: BoltIdentifier | null, public pattern: BoltPattern | null, span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltRecordFieldPatternChild> { if (this.name !== null)
        yield this.name; if (this.pattern !== null)
        yield this.pattern; }
}

type BoltRecordFieldPatternParent = BoltRecordPattern | never;

type BoltRecordFieldPatternChild = BoltRecordPattern | BoltTuplePattern | BoltExpressionPattern | BoltTypePattern | BoltBindPattern | BoltIdentifier | never;

export class BoltRecordPattern extends SyntaxBase {
    parentNode: null | BoltRecordPatternParent = null;
    kind: SyntaxKind.BoltRecordPattern = SyntaxKind.BoltRecordPattern;
    constructor(public name: BoltTypeExpression, public fields: BoltRecordFieldPattern[], span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltRecordPatternChild> { yield this.name; for (let element of this.fields)
        yield element; }
}

type BoltRecordPatternParent = BoltTypePattern | BoltTuplePatternElement | BoltRecordFieldPattern | BoltMatchArm | BoltParameter | BoltVariableDeclaration | never;

type BoltRecordPatternChild = BoltRecordFieldPattern | BoltLiftedTypeExpression | BoltFunctionTypeExpression | BoltReferenceTypeExpression | BoltTypeOfExpression | never;

export type BoltExpression = BoltConstantExpression | BoltBlockExpression | BoltCaseExpression | BoltMatchExpression | BoltYieldExpression | BoltCallExpression | BoltFunctionExpression | BoltMemberExpression | BoltReferenceExpression | BoltTupleExpression | BoltQuoteExpression;

export class BoltQuoteExpression extends SyntaxBase {
    parentNode: null | BoltQuoteExpressionParent = null;
    kind: SyntaxKind.BoltQuoteExpression = SyntaxKind.BoltQuoteExpression;
    constructor(public tokens: (Token | BoltExpression)[], span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltQuoteExpressionChild> { }
}

type BoltQuoteExpressionParent = BoltTypeOfExpression | BoltLiftedTypeExpression | BoltExpressionPattern | BoltTupleExpression | BoltMemberExpression | BoltCallExpression | BoltYieldExpression | BoltMatchArm | BoltMatchExpression | BoltCase | BoltConditionalCase | BoltParameter | BoltReturnStatement | BoltResumeStatement | BoltExpressionStatement | BoltVariableDeclaration | never;

type BoltQuoteExpressionChild = never;

export class BoltTupleExpression extends SyntaxBase {
    parentNode: null | BoltTupleExpressionParent = null;
    kind: SyntaxKind.BoltTupleExpression = SyntaxKind.BoltTupleExpression;
    constructor(public elements: BoltExpression[], span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltTupleExpressionChild> { for (let element of this.elements)
        yield element; }
}

type BoltTupleExpressionParent = BoltTypeOfExpression | BoltLiftedTypeExpression | BoltExpressionPattern | BoltTupleExpression | BoltMemberExpression | BoltCallExpression | BoltYieldExpression | BoltMatchArm | BoltMatchExpression | BoltCase | BoltConditionalCase | BoltParameter | BoltReturnStatement | BoltResumeStatement | BoltExpressionStatement | BoltVariableDeclaration | never;

type BoltTupleExpressionChild = BoltConstantExpression | BoltBlockExpression | BoltCaseExpression | BoltMatchExpression | BoltYieldExpression | BoltCallExpression | BoltFunctionExpression | BoltMemberExpression | BoltReferenceExpression | BoltTupleExpression | BoltQuoteExpression | never;

export class BoltReferenceExpression extends SyntaxBase {
    parentNode: null | BoltReferenceExpressionParent = null;
    kind: SyntaxKind.BoltReferenceExpression = SyntaxKind.BoltReferenceExpression;
    constructor(public name: BoltQualName, span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltReferenceExpressionChild> { yield this.name; }
}

type BoltReferenceExpressionParent = BoltTypeOfExpression | BoltLiftedTypeExpression | BoltExpressionPattern | BoltTupleExpression | BoltMemberExpression | BoltCallExpression | BoltYieldExpression | BoltMatchArm | BoltMatchExpression | BoltCase | BoltConditionalCase | BoltParameter | BoltReturnStatement | BoltResumeStatement | BoltExpressionStatement | BoltVariableDeclaration | never;

type BoltReferenceExpressionChild = BoltQualName | never;

export class BoltMemberExpression extends SyntaxBase {
    parentNode: null | BoltMemberExpressionParent = null;
    kind: SyntaxKind.BoltMemberExpression = SyntaxKind.BoltMemberExpression;
    constructor(public expression: BoltExpression, public path: BoltIdentifier[], span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltMemberExpressionChild> { yield this.expression; for (let element of this.path)
        yield element; }
}

type BoltMemberExpressionParent = BoltTypeOfExpression | BoltLiftedTypeExpression | BoltExpressionPattern | BoltTupleExpression | BoltMemberExpression | BoltCallExpression | BoltYieldExpression | BoltMatchArm | BoltMatchExpression | BoltCase | BoltConditionalCase | BoltParameter | BoltReturnStatement | BoltResumeStatement | BoltExpressionStatement | BoltVariableDeclaration | never;

type BoltMemberExpressionChild = BoltIdentifier | BoltConstantExpression | BoltBlockExpression | BoltCaseExpression | BoltMatchExpression | BoltYieldExpression | BoltCallExpression | BoltFunctionExpression | BoltMemberExpression | BoltReferenceExpression | BoltTupleExpression | BoltQuoteExpression | never;

export class BoltFunctionExpression extends SyntaxBase {
    parentNode: null | BoltFunctionExpressionParent = null;
    kind: SyntaxKind.BoltFunctionExpression = SyntaxKind.BoltFunctionExpression;
    constructor(public params: BoltParameter[], public returnType: BoltTypeExpression | null, public body: BoltFunctionBodyElement[], span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltFunctionExpressionChild> { for (let element of this.params)
        yield element; if (this.returnType !== null)
        yield this.returnType; for (let element of this.body)
        yield element; }
}

type BoltFunctionExpressionParent = BoltTypeOfExpression | BoltLiftedTypeExpression | BoltExpressionPattern | BoltTupleExpression | BoltMemberExpression | BoltCallExpression | BoltYieldExpression | BoltMatchArm | BoltMatchExpression | BoltCase | BoltConditionalCase | BoltParameter | BoltReturnStatement | BoltResumeStatement | BoltExpressionStatement | BoltVariableDeclaration | never;

type BoltFunctionExpressionChild = BoltMacroCall | BoltVariableDeclaration | BoltFunctionDeclaration | BoltLoopStatement | BoltExpressionStatement | BoltResumeStatement | BoltConditionalStatement | BoltReturnStatement | BoltLiftedTypeExpression | BoltFunctionTypeExpression | BoltReferenceTypeExpression | BoltTypeOfExpression | BoltParameter | never;

export class BoltCallExpression extends SyntaxBase {
    parentNode: null | BoltCallExpressionParent = null;
    kind: SyntaxKind.BoltCallExpression = SyntaxKind.BoltCallExpression;
    constructor(public operator: BoltExpression, public operands: BoltExpression[], span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltCallExpressionChild> { yield this.operator; for (let element of this.operands)
        yield element; }
}

type BoltCallExpressionParent = BoltTypeOfExpression | BoltLiftedTypeExpression | BoltExpressionPattern | BoltTupleExpression | BoltMemberExpression | BoltCallExpression | BoltYieldExpression | BoltMatchArm | BoltMatchExpression | BoltCase | BoltConditionalCase | BoltParameter | BoltReturnStatement | BoltResumeStatement | BoltExpressionStatement | BoltVariableDeclaration | never;

type BoltCallExpressionChild = BoltConstantExpression | BoltBlockExpression | BoltCaseExpression | BoltMatchExpression | BoltYieldExpression | BoltCallExpression | BoltFunctionExpression | BoltMemberExpression | BoltReferenceExpression | BoltTupleExpression | BoltQuoteExpression | never;

export class BoltYieldExpression extends SyntaxBase {
    parentNode: null | BoltYieldExpressionParent = null;
    kind: SyntaxKind.BoltYieldExpression = SyntaxKind.BoltYieldExpression;
    constructor(public value: BoltExpression, span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltYieldExpressionChild> { yield this.value; }
}

type BoltYieldExpressionParent = BoltTypeOfExpression | BoltLiftedTypeExpression | BoltExpressionPattern | BoltTupleExpression | BoltMemberExpression | BoltCallExpression | BoltYieldExpression | BoltMatchArm | BoltMatchExpression | BoltCase | BoltConditionalCase | BoltParameter | BoltReturnStatement | BoltResumeStatement | BoltExpressionStatement | BoltVariableDeclaration | never;

type BoltYieldExpressionChild = BoltConstantExpression | BoltBlockExpression | BoltCaseExpression | BoltMatchExpression | BoltYieldExpression | BoltCallExpression | BoltFunctionExpression | BoltMemberExpression | BoltReferenceExpression | BoltTupleExpression | BoltQuoteExpression | never;

export class BoltMatchArm extends SyntaxBase {
    parentNode: null | BoltMatchArmParent = null;
    kind: SyntaxKind.BoltMatchArm = SyntaxKind.BoltMatchArm;
    constructor(public pattern: BoltPattern, public body: BoltExpression, span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltMatchArmChild> { yield this.pattern; yield this.body; }
}

type BoltMatchArmParent = BoltMatchExpression | never;

type BoltMatchArmChild = BoltConstantExpression | BoltBlockExpression | BoltCaseExpression | BoltMatchExpression | BoltYieldExpression | BoltCallExpression | BoltFunctionExpression | BoltMemberExpression | BoltReferenceExpression | BoltTupleExpression | BoltQuoteExpression | BoltRecordPattern | BoltTuplePattern | BoltExpressionPattern | BoltTypePattern | BoltBindPattern | never;

export class BoltMatchExpression extends SyntaxBase {
    parentNode: null | BoltMatchExpressionParent = null;
    kind: SyntaxKind.BoltMatchExpression = SyntaxKind.BoltMatchExpression;
    constructor(public value: BoltExpression, public arms: BoltMatchArm[], span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltMatchExpressionChild> { yield this.value; for (let element of this.arms)
        yield element; }
}

type BoltMatchExpressionParent = BoltTypeOfExpression | BoltLiftedTypeExpression | BoltExpressionPattern | BoltTupleExpression | BoltMemberExpression | BoltCallExpression | BoltYieldExpression | BoltMatchArm | BoltMatchExpression | BoltCase | BoltConditionalCase | BoltParameter | BoltReturnStatement | BoltResumeStatement | BoltExpressionStatement | BoltVariableDeclaration | never;

type BoltMatchExpressionChild = BoltMatchArm | BoltConstantExpression | BoltBlockExpression | BoltCaseExpression | BoltMatchExpression | BoltYieldExpression | BoltCallExpression | BoltFunctionExpression | BoltMemberExpression | BoltReferenceExpression | BoltTupleExpression | BoltQuoteExpression | never;

export class BoltCase extends SyntaxBase {
    parentNode: null | BoltCaseParent = null;
    kind: SyntaxKind.BoltCase = SyntaxKind.BoltCase;
    constructor(public test: BoltExpression, public result: BoltExpression, span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltCaseChild> { yield this.test; yield this.result; }
}

type BoltCaseParent = BoltCaseExpression | never;

type BoltCaseChild = BoltConstantExpression | BoltBlockExpression | BoltCaseExpression | BoltMatchExpression | BoltYieldExpression | BoltCallExpression | BoltFunctionExpression | BoltMemberExpression | BoltReferenceExpression | BoltTupleExpression | BoltQuoteExpression | never;

export class BoltCaseExpression extends SyntaxBase {
    parentNode: null | BoltCaseExpressionParent = null;
    kind: SyntaxKind.BoltCaseExpression = SyntaxKind.BoltCaseExpression;
    constructor(public cases: BoltCase[], span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltCaseExpressionChild> { for (let element of this.cases)
        yield element; }
}

type BoltCaseExpressionParent = BoltTypeOfExpression | BoltLiftedTypeExpression | BoltExpressionPattern | BoltTupleExpression | BoltMemberExpression | BoltCallExpression | BoltYieldExpression | BoltMatchArm | BoltMatchExpression | BoltCase | BoltConditionalCase | BoltParameter | BoltReturnStatement | BoltResumeStatement | BoltExpressionStatement | BoltVariableDeclaration | never;

type BoltCaseExpressionChild = BoltCase | never;

export class BoltBlockExpression extends SyntaxBase {
    parentNode: null | BoltBlockExpressionParent = null;
    kind: SyntaxKind.BoltBlockExpression = SyntaxKind.BoltBlockExpression;
    constructor(public elements: BoltFunctionBodyElement[], span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltBlockExpressionChild> { for (let element of this.elements)
        yield element; }
}

type BoltBlockExpressionParent = BoltTypeOfExpression | BoltLiftedTypeExpression | BoltExpressionPattern | BoltTupleExpression | BoltMemberExpression | BoltCallExpression | BoltYieldExpression | BoltMatchArm | BoltMatchExpression | BoltCase | BoltConditionalCase | BoltParameter | BoltReturnStatement | BoltResumeStatement | BoltExpressionStatement | BoltVariableDeclaration | never;

type BoltBlockExpressionChild = BoltMacroCall | BoltVariableDeclaration | BoltFunctionDeclaration | BoltLoopStatement | BoltExpressionStatement | BoltResumeStatement | BoltConditionalStatement | BoltReturnStatement | never;

export class BoltConstantExpression extends SyntaxBase {
    parentNode: null | BoltConstantExpressionParent = null;
    kind: SyntaxKind.BoltConstantExpression = SyntaxKind.BoltConstantExpression;
    constructor(public value: Value, span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltConstantExpressionChild> { }
}

type BoltConstantExpressionParent = BoltTypeOfExpression | BoltLiftedTypeExpression | BoltExpressionPattern | BoltTupleExpression | BoltMemberExpression | BoltCallExpression | BoltYieldExpression | BoltMatchArm | BoltMatchExpression | BoltCase | BoltConditionalCase | BoltParameter | BoltReturnStatement | BoltResumeStatement | BoltExpressionStatement | BoltVariableDeclaration | never;

type BoltConstantExpressionChild = never;

export type BoltStatement = BoltLoopStatement | BoltExpressionStatement | BoltResumeStatement | BoltConditionalStatement | BoltReturnStatement;

export class BoltReturnStatement extends SyntaxBase {
    parentNode: null | BoltReturnStatementParent = null;
    kind: SyntaxKind.BoltReturnStatement = SyntaxKind.BoltReturnStatement;
    constructor(public value: BoltExpression | null, span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltReturnStatementChild> { if (this.value !== null)
        yield this.value; }
}

type BoltReturnStatementParent = BoltSourceFile | BoltFunctionExpression | BoltBlockExpression | BoltConditionalCase | BoltLoopStatement | BoltFunctionDeclaration | BoltModule | never;

type BoltReturnStatementChild = BoltConstantExpression | BoltBlockExpression | BoltCaseExpression | BoltMatchExpression | BoltYieldExpression | BoltCallExpression | BoltFunctionExpression | BoltMemberExpression | BoltReferenceExpression | BoltTupleExpression | BoltQuoteExpression | never;

export class BoltConditionalCase extends SyntaxBase {
    parentNode: null | BoltConditionalCaseParent = null;
    kind: SyntaxKind.BoltConditionalCase = SyntaxKind.BoltConditionalCase;
    constructor(public test: BoltExpression | null, public body: BoltFunctionBodyElement[], span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltConditionalCaseChild> { if (this.test !== null)
        yield this.test; for (let element of this.body)
        yield element; }
}

type BoltConditionalCaseParent = BoltConditionalStatement | never;

type BoltConditionalCaseChild = BoltMacroCall | BoltVariableDeclaration | BoltFunctionDeclaration | BoltLoopStatement | BoltExpressionStatement | BoltResumeStatement | BoltConditionalStatement | BoltReturnStatement | BoltConstantExpression | BoltBlockExpression | BoltCaseExpression | BoltMatchExpression | BoltYieldExpression | BoltCallExpression | BoltFunctionExpression | BoltMemberExpression | BoltReferenceExpression | BoltTupleExpression | BoltQuoteExpression | never;

export class BoltConditionalStatement extends SyntaxBase {
    parentNode: null | BoltConditionalStatementParent = null;
    kind: SyntaxKind.BoltConditionalStatement = SyntaxKind.BoltConditionalStatement;
    constructor(public cases: BoltConditionalCase[], span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltConditionalStatementChild> { for (let element of this.cases)
        yield element; }
}

type BoltConditionalStatementParent = BoltSourceFile | BoltFunctionExpression | BoltBlockExpression | BoltConditionalCase | BoltLoopStatement | BoltFunctionDeclaration | BoltModule | never;

type BoltConditionalStatementChild = BoltConditionalCase | never;

export class BoltResumeStatement extends SyntaxBase {
    parentNode: null | BoltResumeStatementParent = null;
    kind: SyntaxKind.BoltResumeStatement = SyntaxKind.BoltResumeStatement;
    constructor(public value: BoltExpression, span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltResumeStatementChild> { yield this.value; }
}

type BoltResumeStatementParent = BoltSourceFile | BoltFunctionExpression | BoltBlockExpression | BoltConditionalCase | BoltLoopStatement | BoltFunctionDeclaration | BoltModule | never;

type BoltResumeStatementChild = BoltConstantExpression | BoltBlockExpression | BoltCaseExpression | BoltMatchExpression | BoltYieldExpression | BoltCallExpression | BoltFunctionExpression | BoltMemberExpression | BoltReferenceExpression | BoltTupleExpression | BoltQuoteExpression | never;

export class BoltExpressionStatement extends SyntaxBase {
    parentNode: null | BoltExpressionStatementParent = null;
    kind: SyntaxKind.BoltExpressionStatement = SyntaxKind.BoltExpressionStatement;
    constructor(public expression: BoltExpression, span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltExpressionStatementChild> { yield this.expression; }
}

type BoltExpressionStatementParent = BoltSourceFile | BoltFunctionExpression | BoltBlockExpression | BoltConditionalCase | BoltLoopStatement | BoltFunctionDeclaration | BoltModule | never;

type BoltExpressionStatementChild = BoltConstantExpression | BoltBlockExpression | BoltCaseExpression | BoltMatchExpression | BoltYieldExpression | BoltCallExpression | BoltFunctionExpression | BoltMemberExpression | BoltReferenceExpression | BoltTupleExpression | BoltQuoteExpression | never;

export class BoltLoopStatement extends SyntaxBase {
    parentNode: null | BoltLoopStatementParent = null;
    kind: SyntaxKind.BoltLoopStatement = SyntaxKind.BoltLoopStatement;
    constructor(public elements: BoltFunctionBodyElement[], span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltLoopStatementChild> { for (let element of this.elements)
        yield element; }
}

type BoltLoopStatementParent = BoltSourceFile | BoltFunctionExpression | BoltBlockExpression | BoltConditionalCase | BoltLoopStatement | BoltFunctionDeclaration | BoltModule | never;

type BoltLoopStatementChild = BoltMacroCall | BoltVariableDeclaration | BoltFunctionDeclaration | BoltLoopStatement | BoltExpressionStatement | BoltResumeStatement | BoltConditionalStatement | BoltReturnStatement | never;

export class BoltParameter extends SyntaxBase {
    parentNode: null | BoltParameterParent = null;
    kind: SyntaxKind.BoltParameter = SyntaxKind.BoltParameter;
    constructor(public index: number, public bindings: BoltPattern, public typeExpr: BoltTypeExpression | null, public defaultValue: BoltExpression | null, span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltParameterChild> { yield this.bindings; if (this.typeExpr !== null)
        yield this.typeExpr; if (this.defaultValue !== null)
        yield this.defaultValue; }
}

type BoltParameterParent = BoltFunctionTypeExpression | BoltFunctionExpression | BoltFunctionDeclaration | never;

type BoltParameterChild = BoltConstantExpression | BoltBlockExpression | BoltCaseExpression | BoltMatchExpression | BoltYieldExpression | BoltCallExpression | BoltFunctionExpression | BoltMemberExpression | BoltReferenceExpression | BoltTupleExpression | BoltQuoteExpression | BoltLiftedTypeExpression | BoltFunctionTypeExpression | BoltReferenceTypeExpression | BoltTypeOfExpression | BoltRecordPattern | BoltTuplePattern | BoltExpressionPattern | BoltTypePattern | BoltBindPattern | never;

export type BoltDeclaration = BoltRecordDeclaration | BoltVariableDeclaration | BoltFunctionDeclaration;

export type BoltTypeDeclaration = BoltRecordDeclaration | BoltTypeAliasDeclaration | BoltImplDeclaration | BoltTraitDeclaration;

export class BoltModule extends SyntaxBase {
    parentNode: null | BoltModuleParent = null;
    kind: SyntaxKind.BoltModule = SyntaxKind.BoltModule;
    constructor(public modifiers: BoltModifiers, public name: BoltIdentifier[], public elements: BoltSourceElement[], span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltModuleChild> { for (let element of this.name)
        yield element; for (let element of this.elements)
        yield element; }
}

type BoltModuleParent = BoltSourceFile | BoltModule | never;

type BoltModuleChild = BoltMacroCall | BoltExportDirective | BoltImportDirective | BoltModule | BoltRecordDeclaration | BoltTypeAliasDeclaration | BoltImplDeclaration | BoltTraitDeclaration | BoltVariableDeclaration | BoltFunctionDeclaration | BoltLoopStatement | BoltExpressionStatement | BoltResumeStatement | BoltConditionalStatement | BoltReturnStatement | BoltIdentifier | never;

export type BoltDeclarationLike = BoltRecordDeclaration | BoltTypeAliasDeclaration | BoltImplDeclaration | BoltTraitDeclaration | BoltVariableDeclaration | BoltFunctionDeclaration;

export type BoltFunctionBodyElement = BoltMacroCall | BoltVariableDeclaration | BoltFunctionDeclaration | BoltLoopStatement | BoltExpressionStatement | BoltResumeStatement | BoltConditionalStatement | BoltReturnStatement;

export class BoltFunctionDeclaration extends SyntaxBase {
    parentNode: null | BoltFunctionDeclarationParent = null;
    kind: SyntaxKind.BoltFunctionDeclaration = SyntaxKind.BoltFunctionDeclaration;
    constructor(public modifiers: BoltModifiers, public target: string, public name: BoltSymbol, public params: BoltParameter[], public returnType: BoltTypeExpression | null, public typeParams: BoltTypeParameter[] | null, public body: BoltFunctionBodyElement[], span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltFunctionDeclarationChild> { yield this.name; for (let element of this.params)
        yield element; if (this.returnType !== null)
        yield this.returnType; if (this.typeParams !== null)
        for (let element of this.typeParams)
            yield element; for (let element of this.body)
        yield element; }
}

type BoltFunctionDeclarationParent = BoltSourceFile | BoltFunctionExpression | BoltBlockExpression | BoltConditionalCase | BoltLoopStatement | BoltFunctionDeclaration | BoltTraitDeclaration | BoltImplDeclaration | BoltModule | never;

type BoltFunctionDeclarationChild = BoltMacroCall | BoltVariableDeclaration | BoltFunctionDeclaration | BoltLoopStatement | BoltExpressionStatement | BoltResumeStatement | BoltConditionalStatement | BoltReturnStatement | BoltTypeParameter | BoltLiftedTypeExpression | BoltFunctionTypeExpression | BoltReferenceTypeExpression | BoltTypeOfExpression | BoltParameter | BoltOperator | BoltVBar | BoltLtSign | BoltExMark | BoltGtSign | BoltIdentifier | never;

export class BoltVariableDeclaration extends SyntaxBase {
    parentNode: null | BoltVariableDeclarationParent = null;
    kind: SyntaxKind.BoltVariableDeclaration = SyntaxKind.BoltVariableDeclaration;
    constructor(public modifiers: BoltModifiers, public bindings: BoltPattern, public typeExpr: BoltTypeExpression | null, public value: BoltExpression | null, span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltVariableDeclarationChild> { yield this.bindings; if (this.typeExpr !== null)
        yield this.typeExpr; if (this.value !== null)
        yield this.value; }
}

type BoltVariableDeclarationParent = BoltSourceFile | BoltFunctionExpression | BoltBlockExpression | BoltConditionalCase | BoltLoopStatement | BoltFunctionDeclaration | BoltModule | never;

type BoltVariableDeclarationChild = BoltConstantExpression | BoltBlockExpression | BoltCaseExpression | BoltMatchExpression | BoltYieldExpression | BoltCallExpression | BoltFunctionExpression | BoltMemberExpression | BoltReferenceExpression | BoltTupleExpression | BoltQuoteExpression | BoltLiftedTypeExpression | BoltFunctionTypeExpression | BoltReferenceTypeExpression | BoltTypeOfExpression | BoltRecordPattern | BoltTuplePattern | BoltExpressionPattern | BoltTypePattern | BoltBindPattern | never;

export type BoltImportSymbol = BoltPlainImportSymbol;

export class BoltPlainImportSymbol extends SyntaxBase {
    parentNode: null | BoltPlainImportSymbolParent = null;
    kind: SyntaxKind.BoltPlainImportSymbol = SyntaxKind.BoltPlainImportSymbol;
    constructor(public remote: BoltQualName, public local: BoltSymbol, span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltPlainImportSymbolChild> { yield this.remote; yield this.local; }
}

type BoltPlainImportSymbolParent = BoltImportDirective | never;

type BoltPlainImportSymbolChild = BoltOperator | BoltVBar | BoltLtSign | BoltExMark | BoltGtSign | BoltIdentifier | BoltQualName | never;

export class BoltImportDirective extends SyntaxBase {
    parentNode: null | BoltImportDirectiveParent = null;
    kind: SyntaxKind.BoltImportDirective = SyntaxKind.BoltImportDirective;
    constructor(public modifiers: BoltModifiers, public file: BoltStringLiteral, public symbols: BoltImportSymbol[] | null, span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltImportDirectiveChild> { yield this.file; if (this.symbols !== null)
        for (let element of this.symbols)
            yield element; }
}

type BoltImportDirectiveParent = BoltSourceFile | BoltModule | never;

type BoltImportDirectiveChild = BoltPlainImportSymbol | BoltStringLiteral | never;

export type BoltExportSymbol = BoltPlainExportSymbol;

export class BoltPlainExportSymbol extends SyntaxBase {
    parentNode: null | BoltPlainExportSymbolParent = null;
    kind: SyntaxKind.BoltPlainExportSymbol = SyntaxKind.BoltPlainExportSymbol;
    constructor(public local: BoltQualName, public remote: BoltSymbol, span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltPlainExportSymbolChild> { yield this.local; yield this.remote; }
}

type BoltPlainExportSymbolParent = BoltExportDirective | never;

type BoltPlainExportSymbolChild = BoltOperator | BoltVBar | BoltLtSign | BoltExMark | BoltGtSign | BoltIdentifier | BoltQualName | never;

export class BoltExportDirective extends SyntaxBase {
    parentNode: null | BoltExportDirectiveParent = null;
    kind: SyntaxKind.BoltExportDirective = SyntaxKind.BoltExportDirective;
    constructor(public file: string, public symbols: BoltExportSymbol[] | null, span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltExportDirectiveChild> { if (this.symbols !== null)
        for (let element of this.symbols)
            yield element; }
}

type BoltExportDirectiveParent = BoltSourceFile | BoltModule | never;

type BoltExportDirectiveChild = BoltPlainExportSymbol | never;

export type BoltTraitOrImplElement = BoltMacroCall | BoltTypeAliasDeclaration | BoltFunctionDeclaration;

export class BoltTraitDeclaration extends SyntaxBase {
    parentNode: null | BoltTraitDeclarationParent = null;
    kind: SyntaxKind.BoltTraitDeclaration = SyntaxKind.BoltTraitDeclaration;
    constructor(public modifiers: BoltModifiers, public typeParams: BoltTypeParameter[] | null, public name: BoltIdentifier, public typeBoundExpr: BoltTypeExpression | null, public elements: BoltTraitOrImplElement[] | null, span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltTraitDeclarationChild> { if (this.typeParams !== null)
        for (let element of this.typeParams)
            yield element; yield this.name; if (this.typeBoundExpr !== null)
        yield this.typeBoundExpr; if (this.elements !== null)
        for (let element of this.elements)
            yield element; }
}

type BoltTraitDeclarationParent = BoltSourceFile | BoltModule | never;

type BoltTraitDeclarationChild = BoltMacroCall | BoltTypeAliasDeclaration | BoltFunctionDeclaration | BoltLiftedTypeExpression | BoltFunctionTypeExpression | BoltReferenceTypeExpression | BoltTypeOfExpression | BoltIdentifier | BoltTypeParameter | never;

export class BoltImplDeclaration extends SyntaxBase {
    parentNode: null | BoltImplDeclarationParent = null;
    kind: SyntaxKind.BoltImplDeclaration = SyntaxKind.BoltImplDeclaration;
    constructor(public modifiers: BoltModifiers, public typeParams: BoltTypeParameter[] | null, public name: BoltIdentifier, public traitTypeExpr: BoltTypeExpression | null, public elements: BoltTraitOrImplElement[], span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltImplDeclarationChild> { if (this.typeParams !== null)
        for (let element of this.typeParams)
            yield element; yield this.name; if (this.traitTypeExpr !== null)
        yield this.traitTypeExpr; for (let element of this.elements)
        yield element; }
}

type BoltImplDeclarationParent = BoltSourceFile | BoltModule | never;

type BoltImplDeclarationChild = BoltMacroCall | BoltTypeAliasDeclaration | BoltFunctionDeclaration | BoltLiftedTypeExpression | BoltFunctionTypeExpression | BoltReferenceTypeExpression | BoltTypeOfExpression | BoltIdentifier | BoltTypeParameter | never;

export class BoltTypeAliasDeclaration extends SyntaxBase {
    parentNode: null | BoltTypeAliasDeclarationParent = null;
    kind: SyntaxKind.BoltTypeAliasDeclaration = SyntaxKind.BoltTypeAliasDeclaration;
    constructor(public modifiers: BoltModifiers, public name: BoltIdentifier, public typeParams: BoltTypeParameter[] | null, public typeExpr: BoltTypeExpression, span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltTypeAliasDeclarationChild> { yield this.name; if (this.typeParams !== null)
        for (let element of this.typeParams)
            yield element; yield this.typeExpr; }
}

type BoltTypeAliasDeclarationParent = BoltSourceFile | BoltTraitDeclaration | BoltImplDeclaration | BoltModule | never;

type BoltTypeAliasDeclarationChild = BoltLiftedTypeExpression | BoltFunctionTypeExpression | BoltReferenceTypeExpression | BoltTypeOfExpression | BoltTypeParameter | BoltIdentifier | never;

export type BoltRecordMember = BoltMacroCall | BoltRecordField;

export class BoltRecordField extends SyntaxBase {
    parentNode: null | BoltRecordFieldParent = null;
    kind: SyntaxKind.BoltRecordField = SyntaxKind.BoltRecordField;
    constructor(public name: BoltIdentifier, public typeExpr: BoltTypeExpression, span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltRecordFieldChild> { yield this.name; yield this.typeExpr; }
}

type BoltRecordFieldParent = BoltRecordDeclaration | never;

type BoltRecordFieldChild = BoltLiftedTypeExpression | BoltFunctionTypeExpression | BoltReferenceTypeExpression | BoltTypeOfExpression | BoltIdentifier | never;

export class BoltRecordDeclaration extends SyntaxBase {
    parentNode: null | BoltRecordDeclarationParent = null;
    kind: SyntaxKind.BoltRecordDeclaration = SyntaxKind.BoltRecordDeclaration;
    constructor(public modifiers: BoltModifiers, public name: BoltIdentifier, public typeParms: BoltTypeParameter[] | null, public members: BoltRecordMember[] | null, span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltRecordDeclarationChild> { yield this.name; if (this.typeParms !== null)
        for (let element of this.typeParms)
            yield element; if (this.members !== null)
        for (let element of this.members)
            yield element; }
}

type BoltRecordDeclarationParent = BoltSourceFile | BoltModule | never;

type BoltRecordDeclarationChild = BoltMacroCall | BoltRecordField | BoltTypeParameter | BoltIdentifier | never;

export type BoltSourceElement = BoltMacroCall | BoltExportDirective | BoltImportDirective | BoltModule | BoltRecordDeclaration | BoltTypeAliasDeclaration | BoltImplDeclaration | BoltTraitDeclaration | BoltVariableDeclaration | BoltFunctionDeclaration | BoltLoopStatement | BoltExpressionStatement | BoltResumeStatement | BoltConditionalStatement | BoltReturnStatement;

export class BoltMacroCall extends SyntaxBase {
    parentNode: null | BoltMacroCallParent = null;
    kind: SyntaxKind.BoltMacroCall = SyntaxKind.BoltMacroCall;
    constructor(public name: BoltIdentifier, public text: string, span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<BoltMacroCallChild> { yield this.name; }
}

type BoltMacroCallParent = BoltSourceFile | BoltFunctionExpression | BoltBlockExpression | BoltConditionalCase | BoltLoopStatement | BoltFunctionDeclaration | BoltTraitDeclaration | BoltImplDeclaration | BoltRecordDeclaration | BoltModule | never;

type BoltMacroCallChild = BoltIdentifier | never;

export type JSSyntax = JSSourceFile | JSImportAsBinding | JSImportStarBinding | JSLetDeclaration | JSArrowFunctionDeclaration | JSFunctionDeclaration | JSImportDeclaration | JSParameter | JSConditionalCase | JSCatchBlock | JSReturnStatement | JSConditionalStatement | JSExpressionStatement | JSTryCatchStatement | JSReferenceExpression | JSLiteralExpression | JSConditionalExpression | JSSequenceExpression | JSNewExpression | JSUnaryExpression | JSBinaryExpression | JSCallExpression | JSMemberExpression | JSConstantExpression | JSBindPattern | JSNotOp | JSBNotOp | JSBAndOp | JSBXorOp | JSBOrOp | JSGtOp | JSLtOp | JSSubOp | JSDivOp | JSAddOp | JSMulOp | JSDotDotDot | JSDot | JSComma | JSSemi | JSOpenParen | JSOpenBracket | JSOpenBrace | JSCloseParen | JSCloseBracket | JSCloseBrace | JSOperator | JSForKeyword | JSWhileKeyword | JSFunctionKeyword | JSExportKeyword | JSLetKeyword | JSConstKeyword | JSAsKeyword | JSImportKeyword | JSCatchKeyword | JSFinallyKeyword | JSTryKeyword | JSReturnKeyword | JSFromKeyword | JSInteger | JSString | JSIdentifier | EndOfFile;

export type JSToken = JSNotOp | JSBNotOp | JSBAndOp | JSBXorOp | JSBOrOp | JSGtOp | JSLtOp | JSSubOp | JSDivOp | JSAddOp | JSMulOp | JSDotDotDot | JSDot | JSComma | JSSemi | JSOpenParen | JSOpenBracket | JSOpenBrace | JSCloseParen | JSCloseBracket | JSCloseBrace | JSOperator | JSForKeyword | JSWhileKeyword | JSFunctionKeyword | JSExportKeyword | JSLetKeyword | JSConstKeyword | JSAsKeyword | JSImportKeyword | JSCatchKeyword | JSFinallyKeyword | JSTryKeyword | JSReturnKeyword | JSFromKeyword | JSInteger | JSString | JSIdentifier | EndOfFile;

export class JSIdentifier extends SyntaxBase {
    parentNode: null | JSIdentifierParent = null;
    kind: SyntaxKind.JSIdentifier = SyntaxKind.JSIdentifier;
    constructor(public text: string, span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<JSIdentifierChild> { }
}

type JSIdentifierParent = JSBindPattern | JSMemberExpression | JSImportStarBinding | JSImportAsBinding | JSFunctionDeclaration | JSArrowFunctionDeclaration | never;

type JSIdentifierChild = never;

export class JSString extends SyntaxBase {
    parentNode: null | JSStringParent = null;
    kind: SyntaxKind.JSString = SyntaxKind.JSString;
    constructor(public value: string, span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<JSStringChild> { }
}

type JSStringParent = JSImportDeclaration | never;

type JSStringChild = never;

export class JSInteger extends SyntaxBase {
    parentNode: null | JSIntegerParent = null;
    kind: SyntaxKind.JSInteger = SyntaxKind.JSInteger;
    constructor(public value: bigint, span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<JSIntegerChild> { }
}

type JSIntegerParent = never;

type JSIntegerChild = never;

export class JSFromKeyword extends SyntaxBase {
    parentNode: null | JSFromKeywordParent = null;
    kind: SyntaxKind.JSFromKeyword = SyntaxKind.JSFromKeyword;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<JSFromKeywordChild> { }
}

type JSFromKeywordParent = never;

type JSFromKeywordChild = never;

export class JSReturnKeyword extends SyntaxBase {
    parentNode: null | JSReturnKeywordParent = null;
    kind: SyntaxKind.JSReturnKeyword = SyntaxKind.JSReturnKeyword;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<JSReturnKeywordChild> { }
}

type JSReturnKeywordParent = never;

type JSReturnKeywordChild = never;

export class JSTryKeyword extends SyntaxBase {
    parentNode: null | JSTryKeywordParent = null;
    kind: SyntaxKind.JSTryKeyword = SyntaxKind.JSTryKeyword;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<JSTryKeywordChild> { }
}

type JSTryKeywordParent = never;

type JSTryKeywordChild = never;

export class JSFinallyKeyword extends SyntaxBase {
    parentNode: null | JSFinallyKeywordParent = null;
    kind: SyntaxKind.JSFinallyKeyword = SyntaxKind.JSFinallyKeyword;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<JSFinallyKeywordChild> { }
}

type JSFinallyKeywordParent = never;

type JSFinallyKeywordChild = never;

export class JSCatchKeyword extends SyntaxBase {
    parentNode: null | JSCatchKeywordParent = null;
    kind: SyntaxKind.JSCatchKeyword = SyntaxKind.JSCatchKeyword;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<JSCatchKeywordChild> { }
}

type JSCatchKeywordParent = never;

type JSCatchKeywordChild = never;

export class JSImportKeyword extends SyntaxBase {
    parentNode: null | JSImportKeywordParent = null;
    kind: SyntaxKind.JSImportKeyword = SyntaxKind.JSImportKeyword;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<JSImportKeywordChild> { }
}

type JSImportKeywordParent = never;

type JSImportKeywordChild = never;

export class JSAsKeyword extends SyntaxBase {
    parentNode: null | JSAsKeywordParent = null;
    kind: SyntaxKind.JSAsKeyword = SyntaxKind.JSAsKeyword;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<JSAsKeywordChild> { }
}

type JSAsKeywordParent = never;

type JSAsKeywordChild = never;

export class JSConstKeyword extends SyntaxBase {
    parentNode: null | JSConstKeywordParent = null;
    kind: SyntaxKind.JSConstKeyword = SyntaxKind.JSConstKeyword;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<JSConstKeywordChild> { }
}

type JSConstKeywordParent = never;

type JSConstKeywordChild = never;

export class JSLetKeyword extends SyntaxBase {
    parentNode: null | JSLetKeywordParent = null;
    kind: SyntaxKind.JSLetKeyword = SyntaxKind.JSLetKeyword;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<JSLetKeywordChild> { }
}

type JSLetKeywordParent = never;

type JSLetKeywordChild = never;

export class JSExportKeyword extends SyntaxBase {
    parentNode: null | JSExportKeywordParent = null;
    kind: SyntaxKind.JSExportKeyword = SyntaxKind.JSExportKeyword;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<JSExportKeywordChild> { }
}

type JSExportKeywordParent = never;

type JSExportKeywordChild = never;

export class JSFunctionKeyword extends SyntaxBase {
    parentNode: null | JSFunctionKeywordParent = null;
    kind: SyntaxKind.JSFunctionKeyword = SyntaxKind.JSFunctionKeyword;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<JSFunctionKeywordChild> { }
}

type JSFunctionKeywordParent = never;

type JSFunctionKeywordChild = never;

export class JSWhileKeyword extends SyntaxBase {
    parentNode: null | JSWhileKeywordParent = null;
    kind: SyntaxKind.JSWhileKeyword = SyntaxKind.JSWhileKeyword;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<JSWhileKeywordChild> { }
}

type JSWhileKeywordParent = never;

type JSWhileKeywordChild = never;

export class JSForKeyword extends SyntaxBase {
    parentNode: null | JSForKeywordParent = null;
    kind: SyntaxKind.JSForKeyword = SyntaxKind.JSForKeyword;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<JSForKeywordChild> { }
}

type JSForKeywordParent = never;

type JSForKeywordChild = never;

export type JSOperatorLike = JSNotOp | JSBNotOp | JSBAndOp | JSBXorOp | JSBOrOp | JSGtOp | JSLtOp | JSSubOp | JSDivOp | JSAddOp | JSMulOp;

export class JSOperator extends SyntaxBase {
    parentNode: null | JSOperatorParent = null;
    kind: SyntaxKind.JSOperator = SyntaxKind.JSOperator;
    constructor(public text: string, span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<JSOperatorChild> { }
}

type JSOperatorParent = JSBinaryExpression | JSUnaryExpression | never;

type JSOperatorChild = never;

export class JSCloseBrace extends SyntaxBase {
    parentNode: null | JSCloseBraceParent = null;
    kind: SyntaxKind.JSCloseBrace = SyntaxKind.JSCloseBrace;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<JSCloseBraceChild> { }
}

type JSCloseBraceParent = never;

type JSCloseBraceChild = never;

export class JSCloseBracket extends SyntaxBase {
    parentNode: null | JSCloseBracketParent = null;
    kind: SyntaxKind.JSCloseBracket = SyntaxKind.JSCloseBracket;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<JSCloseBracketChild> { }
}

type JSCloseBracketParent = never;

type JSCloseBracketChild = never;

export class JSCloseParen extends SyntaxBase {
    parentNode: null | JSCloseParenParent = null;
    kind: SyntaxKind.JSCloseParen = SyntaxKind.JSCloseParen;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<JSCloseParenChild> { }
}

type JSCloseParenParent = never;

type JSCloseParenChild = never;

export class JSOpenBrace extends SyntaxBase {
    parentNode: null | JSOpenBraceParent = null;
    kind: SyntaxKind.JSOpenBrace = SyntaxKind.JSOpenBrace;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<JSOpenBraceChild> { }
}

type JSOpenBraceParent = never;

type JSOpenBraceChild = never;

export class JSOpenBracket extends SyntaxBase {
    parentNode: null | JSOpenBracketParent = null;
    kind: SyntaxKind.JSOpenBracket = SyntaxKind.JSOpenBracket;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<JSOpenBracketChild> { }
}

type JSOpenBracketParent = never;

type JSOpenBracketChild = never;

export class JSOpenParen extends SyntaxBase {
    parentNode: null | JSOpenParenParent = null;
    kind: SyntaxKind.JSOpenParen = SyntaxKind.JSOpenParen;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<JSOpenParenChild> { }
}

type JSOpenParenParent = never;

type JSOpenParenChild = never;

export class JSSemi extends SyntaxBase {
    parentNode: null | JSSemiParent = null;
    kind: SyntaxKind.JSSemi = SyntaxKind.JSSemi;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<JSSemiChild> { }
}

type JSSemiParent = never;

type JSSemiChild = never;

export class JSComma extends SyntaxBase {
    parentNode: null | JSCommaParent = null;
    kind: SyntaxKind.JSComma = SyntaxKind.JSComma;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<JSCommaChild> { }
}

type JSCommaParent = never;

type JSCommaChild = never;

export class JSDot extends SyntaxBase {
    parentNode: null | JSDotParent = null;
    kind: SyntaxKind.JSDot = SyntaxKind.JSDot;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<JSDotChild> { }
}

type JSDotParent = never;

type JSDotChild = never;

export class JSDotDotDot extends SyntaxBase {
    parentNode: null | JSDotDotDotParent = null;
    kind: SyntaxKind.JSDotDotDot = SyntaxKind.JSDotDotDot;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<JSDotDotDotChild> { }
}

type JSDotDotDotParent = never;

type JSDotDotDotChild = never;

export class JSMulOp extends SyntaxBase {
    parentNode: null | JSMulOpParent = null;
    kind: SyntaxKind.JSMulOp = SyntaxKind.JSMulOp;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<JSMulOpChild> { }
}

type JSMulOpParent = never;

type JSMulOpChild = never;

export class JSAddOp extends SyntaxBase {
    parentNode: null | JSAddOpParent = null;
    kind: SyntaxKind.JSAddOp = SyntaxKind.JSAddOp;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<JSAddOpChild> { }
}

type JSAddOpParent = never;

type JSAddOpChild = never;

export class JSDivOp extends SyntaxBase {
    parentNode: null | JSDivOpParent = null;
    kind: SyntaxKind.JSDivOp = SyntaxKind.JSDivOp;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<JSDivOpChild> { }
}

type JSDivOpParent = never;

type JSDivOpChild = never;

export class JSSubOp extends SyntaxBase {
    parentNode: null | JSSubOpParent = null;
    kind: SyntaxKind.JSSubOp = SyntaxKind.JSSubOp;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<JSSubOpChild> { }
}

type JSSubOpParent = never;

type JSSubOpChild = never;

export class JSLtOp extends SyntaxBase {
    parentNode: null | JSLtOpParent = null;
    kind: SyntaxKind.JSLtOp = SyntaxKind.JSLtOp;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<JSLtOpChild> { }
}

type JSLtOpParent = never;

type JSLtOpChild = never;

export class JSGtOp extends SyntaxBase {
    parentNode: null | JSGtOpParent = null;
    kind: SyntaxKind.JSGtOp = SyntaxKind.JSGtOp;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<JSGtOpChild> { }
}

type JSGtOpParent = never;

type JSGtOpChild = never;

export class JSBOrOp extends SyntaxBase {
    parentNode: null | JSBOrOpParent = null;
    kind: SyntaxKind.JSBOrOp = SyntaxKind.JSBOrOp;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<JSBOrOpChild> { }
}

type JSBOrOpParent = never;

type JSBOrOpChild = never;

export class JSBXorOp extends SyntaxBase {
    parentNode: null | JSBXorOpParent = null;
    kind: SyntaxKind.JSBXorOp = SyntaxKind.JSBXorOp;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<JSBXorOpChild> { }
}

type JSBXorOpParent = never;

type JSBXorOpChild = never;

export class JSBAndOp extends SyntaxBase {
    parentNode: null | JSBAndOpParent = null;
    kind: SyntaxKind.JSBAndOp = SyntaxKind.JSBAndOp;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<JSBAndOpChild> { }
}

type JSBAndOpParent = never;

type JSBAndOpChild = never;

export class JSBNotOp extends SyntaxBase {
    parentNode: null | JSBNotOpParent = null;
    kind: SyntaxKind.JSBNotOp = SyntaxKind.JSBNotOp;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<JSBNotOpChild> { }
}

type JSBNotOpParent = never;

type JSBNotOpChild = never;

export class JSNotOp extends SyntaxBase {
    parentNode: null | JSNotOpParent = null;
    kind: SyntaxKind.JSNotOp = SyntaxKind.JSNotOp;
    constructor(span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<JSNotOpChild> { }
}

type JSNotOpParent = never;

type JSNotOpChild = never;

export type JSPattern = JSBindPattern;

export class JSBindPattern extends SyntaxBase {
    parentNode: null | JSBindPatternParent = null;
    kind: SyntaxKind.JSBindPattern = SyntaxKind.JSBindPattern;
    constructor(public name: JSIdentifier, span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<JSBindPatternChild> { yield this.name; }
}

type JSBindPatternParent = JSCatchBlock | JSParameter | JSLetDeclaration | never;

type JSBindPatternChild = JSIdentifier | never;

export type JSExpression = JSReferenceExpression | JSLiteralExpression | JSConditionalExpression | JSSequenceExpression | JSNewExpression | JSUnaryExpression | JSBinaryExpression | JSCallExpression | JSMemberExpression | JSConstantExpression;

export class JSConstantExpression extends SyntaxBase {
    parentNode: null | JSConstantExpressionParent = null;
    kind: SyntaxKind.JSConstantExpression = SyntaxKind.JSConstantExpression;
    constructor(public value: Value, span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<JSConstantExpressionChild> { }
}

type JSConstantExpressionParent = JSMemberExpression | JSCallExpression | JSBinaryExpression | JSUnaryExpression | JSNewExpression | JSSequenceExpression | JSConditionalExpression | JSExpressionStatement | JSConditionalCase | JSReturnStatement | JSParameter | JSArrowFunctionDeclaration | JSLetDeclaration | never;

type JSConstantExpressionChild = never;

export class JSMemberExpression extends SyntaxBase {
    parentNode: null | JSMemberExpressionParent = null;
    kind: SyntaxKind.JSMemberExpression = SyntaxKind.JSMemberExpression;
    constructor(public value: JSExpression, public property: JSIdentifier, span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<JSMemberExpressionChild> { yield this.value; yield this.property; }
}

type JSMemberExpressionParent = JSMemberExpression | JSCallExpression | JSBinaryExpression | JSUnaryExpression | JSNewExpression | JSSequenceExpression | JSConditionalExpression | JSExpressionStatement | JSConditionalCase | JSReturnStatement | JSParameter | JSArrowFunctionDeclaration | JSLetDeclaration | never;

type JSMemberExpressionChild = JSIdentifier | JSReferenceExpression | JSLiteralExpression | JSConditionalExpression | JSSequenceExpression | JSNewExpression | JSUnaryExpression | JSBinaryExpression | JSCallExpression | JSMemberExpression | JSConstantExpression | never;

export class JSCallExpression extends SyntaxBase {
    parentNode: null | JSCallExpressionParent = null;
    kind: SyntaxKind.JSCallExpression = SyntaxKind.JSCallExpression;
    constructor(public operator: JSExpression, public operands: JSExpression[], span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<JSCallExpressionChild> { yield this.operator; for (let element of this.operands)
        yield element; }
}

type JSCallExpressionParent = JSMemberExpression | JSCallExpression | JSBinaryExpression | JSUnaryExpression | JSNewExpression | JSSequenceExpression | JSConditionalExpression | JSExpressionStatement | JSConditionalCase | JSReturnStatement | JSParameter | JSArrowFunctionDeclaration | JSLetDeclaration | never;

type JSCallExpressionChild = JSReferenceExpression | JSLiteralExpression | JSConditionalExpression | JSSequenceExpression | JSNewExpression | JSUnaryExpression | JSBinaryExpression | JSCallExpression | JSMemberExpression | JSConstantExpression | never;

export class JSBinaryExpression extends SyntaxBase {
    parentNode: null | JSBinaryExpressionParent = null;
    kind: SyntaxKind.JSBinaryExpression = SyntaxKind.JSBinaryExpression;
    constructor(public left: JSExpression, public operator: JSOperator, public right: JSExpression, span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<JSBinaryExpressionChild> { yield this.left; yield this.operator; yield this.right; }
}

type JSBinaryExpressionParent = JSMemberExpression | JSCallExpression | JSBinaryExpression | JSUnaryExpression | JSNewExpression | JSSequenceExpression | JSConditionalExpression | JSExpressionStatement | JSConditionalCase | JSReturnStatement | JSParameter | JSArrowFunctionDeclaration | JSLetDeclaration | never;

type JSBinaryExpressionChild = JSReferenceExpression | JSLiteralExpression | JSConditionalExpression | JSSequenceExpression | JSNewExpression | JSUnaryExpression | JSBinaryExpression | JSCallExpression | JSMemberExpression | JSConstantExpression | JSOperator | never;

export class JSUnaryExpression extends SyntaxBase {
    parentNode: null | JSUnaryExpressionParent = null;
    kind: SyntaxKind.JSUnaryExpression = SyntaxKind.JSUnaryExpression;
    constructor(public operator: JSOperator, public operand: JSExpression, span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<JSUnaryExpressionChild> { yield this.operator; yield this.operand; }
}

type JSUnaryExpressionParent = JSMemberExpression | JSCallExpression | JSBinaryExpression | JSUnaryExpression | JSNewExpression | JSSequenceExpression | JSConditionalExpression | JSExpressionStatement | JSConditionalCase | JSReturnStatement | JSParameter | JSArrowFunctionDeclaration | JSLetDeclaration | never;

type JSUnaryExpressionChild = JSReferenceExpression | JSLiteralExpression | JSConditionalExpression | JSSequenceExpression | JSNewExpression | JSUnaryExpression | JSBinaryExpression | JSCallExpression | JSMemberExpression | JSConstantExpression | JSOperator | never;

export class JSNewExpression extends SyntaxBase {
    parentNode: null | JSNewExpressionParent = null;
    kind: SyntaxKind.JSNewExpression = SyntaxKind.JSNewExpression;
    constructor(public target: JSExpression, public args: JSExpression[], span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<JSNewExpressionChild> { yield this.target; for (let element of this.args)
        yield element; }
}

type JSNewExpressionParent = JSMemberExpression | JSCallExpression | JSBinaryExpression | JSUnaryExpression | JSNewExpression | JSSequenceExpression | JSConditionalExpression | JSExpressionStatement | JSConditionalCase | JSReturnStatement | JSParameter | JSArrowFunctionDeclaration | JSLetDeclaration | never;

type JSNewExpressionChild = JSReferenceExpression | JSLiteralExpression | JSConditionalExpression | JSSequenceExpression | JSNewExpression | JSUnaryExpression | JSBinaryExpression | JSCallExpression | JSMemberExpression | JSConstantExpression | never;

export class JSSequenceExpression extends SyntaxBase {
    parentNode: null | JSSequenceExpressionParent = null;
    kind: SyntaxKind.JSSequenceExpression = SyntaxKind.JSSequenceExpression;
    constructor(public expressions: JSExpression[], span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<JSSequenceExpressionChild> { for (let element of this.expressions)
        yield element; }
}

type JSSequenceExpressionParent = JSMemberExpression | JSCallExpression | JSBinaryExpression | JSUnaryExpression | JSNewExpression | JSSequenceExpression | JSConditionalExpression | JSExpressionStatement | JSConditionalCase | JSReturnStatement | JSParameter | JSArrowFunctionDeclaration | JSLetDeclaration | never;

type JSSequenceExpressionChild = JSReferenceExpression | JSLiteralExpression | JSConditionalExpression | JSSequenceExpression | JSNewExpression | JSUnaryExpression | JSBinaryExpression | JSCallExpression | JSMemberExpression | JSConstantExpression | never;

export class JSConditionalExpression extends SyntaxBase {
    parentNode: null | JSConditionalExpressionParent = null;
    kind: SyntaxKind.JSConditionalExpression = SyntaxKind.JSConditionalExpression;
    constructor(public test: JSExpression, public consequent: JSExpression, public alternate: JSExpression, span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<JSConditionalExpressionChild> { yield this.test; yield this.consequent; yield this.alternate; }
}

type JSConditionalExpressionParent = JSMemberExpression | JSCallExpression | JSBinaryExpression | JSUnaryExpression | JSNewExpression | JSSequenceExpression | JSConditionalExpression | JSExpressionStatement | JSConditionalCase | JSReturnStatement | JSParameter | JSArrowFunctionDeclaration | JSLetDeclaration | never;

type JSConditionalExpressionChild = JSReferenceExpression | JSLiteralExpression | JSConditionalExpression | JSSequenceExpression | JSNewExpression | JSUnaryExpression | JSBinaryExpression | JSCallExpression | JSMemberExpression | JSConstantExpression | never;

export class JSLiteralExpression extends SyntaxBase {
    parentNode: null | JSLiteralExpressionParent = null;
    kind: SyntaxKind.JSLiteralExpression = SyntaxKind.JSLiteralExpression;
    constructor(public value: Value, span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<JSLiteralExpressionChild> { }
}

type JSLiteralExpressionParent = JSMemberExpression | JSCallExpression | JSBinaryExpression | JSUnaryExpression | JSNewExpression | JSSequenceExpression | JSConditionalExpression | JSExpressionStatement | JSConditionalCase | JSReturnStatement | JSParameter | JSArrowFunctionDeclaration | JSLetDeclaration | never;

type JSLiteralExpressionChild = never;

export class JSReferenceExpression extends SyntaxBase {
    parentNode: null | JSReferenceExpressionParent = null;
    kind: SyntaxKind.JSReferenceExpression = SyntaxKind.JSReferenceExpression;
    constructor(public name: string, span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<JSReferenceExpressionChild> { }
}

type JSReferenceExpressionParent = JSMemberExpression | JSCallExpression | JSBinaryExpression | JSUnaryExpression | JSNewExpression | JSSequenceExpression | JSConditionalExpression | JSExpressionStatement | JSConditionalCase | JSReturnStatement | JSParameter | JSArrowFunctionDeclaration | JSLetDeclaration | never;

type JSReferenceExpressionChild = never;

export type JSSourceElement = JSLetDeclaration | JSArrowFunctionDeclaration | JSFunctionDeclaration | JSImportDeclaration | JSReturnStatement | JSConditionalStatement | JSExpressionStatement | JSTryCatchStatement;

export type JSFunctionBodyElement = JSLetDeclaration | JSArrowFunctionDeclaration | JSFunctionDeclaration | JSImportDeclaration | JSReturnStatement | JSConditionalStatement | JSExpressionStatement | JSTryCatchStatement;

export type JSStatement = JSReturnStatement | JSConditionalStatement | JSExpressionStatement | JSTryCatchStatement;

export class JSCatchBlock extends SyntaxBase {
    parentNode: null | JSCatchBlockParent = null;
    kind: SyntaxKind.JSCatchBlock = SyntaxKind.JSCatchBlock;
    constructor(public bindings: JSPattern | null, public elements: JSSourceElement[], span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<JSCatchBlockChild> { if (this.bindings !== null)
        yield this.bindings; for (let element of this.elements)
        yield element; }
}

type JSCatchBlockParent = JSTryCatchStatement | never;

type JSCatchBlockChild = JSLetDeclaration | JSArrowFunctionDeclaration | JSFunctionDeclaration | JSImportDeclaration | JSReturnStatement | JSConditionalStatement | JSExpressionStatement | JSTryCatchStatement | JSBindPattern | never;

export class JSTryCatchStatement extends SyntaxBase {
    parentNode: null | JSTryCatchStatementParent = null;
    kind: SyntaxKind.JSTryCatchStatement = SyntaxKind.JSTryCatchStatement;
    constructor(public tryBlock: JSSourceElement[], public catchBlock: JSCatchBlock | null, public finalBlock: JSSourceElement[] | null, span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<JSTryCatchStatementChild> { for (let element of this.tryBlock)
        yield element; if (this.catchBlock !== null)
        yield this.catchBlock; if (this.finalBlock !== null)
        for (let element of this.finalBlock)
            yield element; }
}

type JSTryCatchStatementParent = JSCatchBlock | JSTryCatchStatement | JSConditionalCase | JSFunctionDeclaration | JSSourceFile | never;

type JSTryCatchStatementChild = JSLetDeclaration | JSArrowFunctionDeclaration | JSFunctionDeclaration | JSImportDeclaration | JSReturnStatement | JSConditionalStatement | JSExpressionStatement | JSTryCatchStatement | JSCatchBlock | never;

export class JSExpressionStatement extends SyntaxBase {
    parentNode: null | JSExpressionStatementParent = null;
    kind: SyntaxKind.JSExpressionStatement = SyntaxKind.JSExpressionStatement;
    constructor(public expression: JSExpression, span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<JSExpressionStatementChild> { yield this.expression; }
}

type JSExpressionStatementParent = JSCatchBlock | JSTryCatchStatement | JSConditionalCase | JSFunctionDeclaration | JSSourceFile | never;

type JSExpressionStatementChild = JSReferenceExpression | JSLiteralExpression | JSConditionalExpression | JSSequenceExpression | JSNewExpression | JSUnaryExpression | JSBinaryExpression | JSCallExpression | JSMemberExpression | JSConstantExpression | never;

export class JSConditionalCase extends SyntaxBase {
    parentNode: null | JSConditionalCaseParent = null;
    kind: SyntaxKind.JSConditionalCase = SyntaxKind.JSConditionalCase;
    constructor(public test: JSExpression | null, public body: JSFunctionBodyElement[], span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<JSConditionalCaseChild> { if (this.test !== null)
        yield this.test; for (let element of this.body)
        yield element; }
}

type JSConditionalCaseParent = JSConditionalStatement | never;

type JSConditionalCaseChild = JSLetDeclaration | JSArrowFunctionDeclaration | JSFunctionDeclaration | JSImportDeclaration | JSReturnStatement | JSConditionalStatement | JSExpressionStatement | JSTryCatchStatement | JSReferenceExpression | JSLiteralExpression | JSConditionalExpression | JSSequenceExpression | JSNewExpression | JSUnaryExpression | JSBinaryExpression | JSCallExpression | JSMemberExpression | JSConstantExpression | never;

export class JSConditionalStatement extends SyntaxBase {
    parentNode: null | JSConditionalStatementParent = null;
    kind: SyntaxKind.JSConditionalStatement = SyntaxKind.JSConditionalStatement;
    constructor(public cases: JSConditionalCase[], span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<JSConditionalStatementChild> { for (let element of this.cases)
        yield element; }
}

type JSConditionalStatementParent = JSCatchBlock | JSTryCatchStatement | JSConditionalCase | JSFunctionDeclaration | JSSourceFile | never;

type JSConditionalStatementChild = JSConditionalCase | never;

export class JSReturnStatement extends SyntaxBase {
    parentNode: null | JSReturnStatementParent = null;
    kind: SyntaxKind.JSReturnStatement = SyntaxKind.JSReturnStatement;
    constructor(public value: JSExpression | null, span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<JSReturnStatementChild> { if (this.value !== null)
        yield this.value; }
}

type JSReturnStatementParent = JSCatchBlock | JSTryCatchStatement | JSConditionalCase | JSFunctionDeclaration | JSSourceFile | never;

type JSReturnStatementChild = JSReferenceExpression | JSLiteralExpression | JSConditionalExpression | JSSequenceExpression | JSNewExpression | JSUnaryExpression | JSBinaryExpression | JSCallExpression | JSMemberExpression | JSConstantExpression | never;

export class JSParameter extends SyntaxBase {
    parentNode: null | JSParameterParent = null;
    kind: SyntaxKind.JSParameter = SyntaxKind.JSParameter;
    constructor(public index: number, public bindings: JSPattern, public defaultValue: JSExpression | null, span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<JSParameterChild> { yield this.bindings; if (this.defaultValue !== null)
        yield this.defaultValue; }
}

type JSParameterParent = JSFunctionDeclaration | JSArrowFunctionDeclaration | never;

type JSParameterChild = JSReferenceExpression | JSLiteralExpression | JSConditionalExpression | JSSequenceExpression | JSNewExpression | JSUnaryExpression | JSBinaryExpression | JSCallExpression | JSMemberExpression | JSConstantExpression | JSBindPattern | never;

export type JSDeclaration = JSLetDeclaration | JSArrowFunctionDeclaration | JSFunctionDeclaration | JSImportDeclaration;

export type JSImportBinding = JSImportAsBinding | JSImportStarBinding;

export class JSImportStarBinding extends SyntaxBase {
    parentNode: null | JSImportStarBindingParent = null;
    kind: SyntaxKind.JSImportStarBinding = SyntaxKind.JSImportStarBinding;
    constructor(public local: JSIdentifier, span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<JSImportStarBindingChild> { yield this.local; }
}

type JSImportStarBindingParent = JSImportDeclaration | never;

type JSImportStarBindingChild = JSIdentifier | never;

export class JSImportAsBinding extends SyntaxBase {
    parentNode: null | JSImportAsBindingParent = null;
    kind: SyntaxKind.JSImportAsBinding = SyntaxKind.JSImportAsBinding;
    constructor(public remote: JSIdentifier, public local: JSIdentifier | null, span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<JSImportAsBindingChild> { yield this.remote; if (this.local !== null)
        yield this.local; }
}

type JSImportAsBindingParent = JSImportDeclaration | never;

type JSImportAsBindingChild = JSIdentifier | never;

export class JSImportDeclaration extends SyntaxBase {
    parentNode: null | JSImportDeclarationParent = null;
    kind: SyntaxKind.JSImportDeclaration = SyntaxKind.JSImportDeclaration;
    constructor(public bindings: JSImportBinding[], public filename: JSString, span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<JSImportDeclarationChild> { for (let element of this.bindings)
        yield element; yield this.filename; }
}

type JSImportDeclarationParent = JSCatchBlock | JSTryCatchStatement | JSConditionalCase | JSSourceFile | never;

type JSImportDeclarationChild = JSString | JSImportAsBinding | JSImportStarBinding | never;

export class JSFunctionDeclaration extends SyntaxBase {
    parentNode: null | JSFunctionDeclarationParent = null;
    kind: SyntaxKind.JSFunctionDeclaration = SyntaxKind.JSFunctionDeclaration;
    constructor(public modifiers: JSDeclarationModifiers, public name: JSIdentifier, public params: JSParameter[], public body: JSStatement[], span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<JSFunctionDeclarationChild> { yield this.name; for (let element of this.params)
        yield element; for (let element of this.body)
        yield element; }
}

type JSFunctionDeclarationParent = JSCatchBlock | JSTryCatchStatement | JSConditionalCase | JSSourceFile | never;

type JSFunctionDeclarationChild = JSReturnStatement | JSConditionalStatement | JSExpressionStatement | JSTryCatchStatement | JSParameter | JSIdentifier | never;

export class JSArrowFunctionDeclaration extends SyntaxBase {
    parentNode: null | JSArrowFunctionDeclarationParent = null;
    kind: SyntaxKind.JSArrowFunctionDeclaration = SyntaxKind.JSArrowFunctionDeclaration;
    constructor(public name: JSIdentifier, public params: JSParameter[], public body: JSExpression, span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<JSArrowFunctionDeclarationChild> { yield this.name; for (let element of this.params)
        yield element; yield this.body; }
}

type JSArrowFunctionDeclarationParent = JSCatchBlock | JSTryCatchStatement | JSConditionalCase | JSSourceFile | never;

type JSArrowFunctionDeclarationChild = JSReferenceExpression | JSLiteralExpression | JSConditionalExpression | JSSequenceExpression | JSNewExpression | JSUnaryExpression | JSBinaryExpression | JSCallExpression | JSMemberExpression | JSConstantExpression | JSParameter | JSIdentifier | never;

export class JSLetDeclaration extends SyntaxBase {
    parentNode: null | JSLetDeclarationParent = null;
    kind: SyntaxKind.JSLetDeclaration = SyntaxKind.JSLetDeclaration;
    constructor(public bindings: JSPattern, public value: JSExpression | null, span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<JSLetDeclarationChild> { yield this.bindings; if (this.value !== null)
        yield this.value; }
}

type JSLetDeclarationParent = JSCatchBlock | JSTryCatchStatement | JSConditionalCase | JSSourceFile | never;

type JSLetDeclarationChild = JSReferenceExpression | JSLiteralExpression | JSConditionalExpression | JSSequenceExpression | JSNewExpression | JSUnaryExpression | JSBinaryExpression | JSCallExpression | JSMemberExpression | JSConstantExpression | JSBindPattern | never;

export class JSSourceFile extends SyntaxBase {
    parentNode: null | JSSourceFileParent = null;
    kind: SyntaxKind.JSSourceFile = SyntaxKind.JSSourceFile;
    constructor(public elements: JSSourceElement[], span: TextSpan | null = null) { super(span); }
    *getChildNodes(): IterableIterator<JSSourceFileChild> { for (let element of this.elements)
        yield element; }
}

type JSSourceFileParent = never;

type JSSourceFileChild = JSLetDeclaration | JSArrowFunctionDeclaration | JSFunctionDeclaration | JSImportDeclaration | JSReturnStatement | JSConditionalStatement | JSExpressionStatement | JSTryCatchStatement | never;

export function createEndOfFile(span: TextSpan | null = null): EndOfFile { return new EndOfFile(span); }

export function createBoltStringLiteral(value: string, span: TextSpan | null = null): BoltStringLiteral { return new BoltStringLiteral(value, span); }

export function createBoltIntegerLiteral(value: bigint, span: TextSpan | null = null): BoltIntegerLiteral { return new BoltIntegerLiteral(value, span); }

export function createBoltIdentifier(text: string, span: TextSpan | null = null): BoltIdentifier { return new BoltIdentifier(text, span); }

export function createBoltOperator(text: string, span: TextSpan | null = null): BoltOperator { return new BoltOperator(text, span); }

export function createBoltAssignment(operator: string | null, span: TextSpan | null = null): BoltAssignment { return new BoltAssignment(operator, span); }

export function createBoltComma(span: TextSpan | null = null): BoltComma { return new BoltComma(span); }

export function createBoltSemi(span: TextSpan | null = null): BoltSemi { return new BoltSemi(span); }

export function createBoltColon(span: TextSpan | null = null): BoltColon { return new BoltColon(span); }

export function createBoltColonColon(span: TextSpan | null = null): BoltColonColon { return new BoltColonColon(span); }

export function createBoltDot(span: TextSpan | null = null): BoltDot { return new BoltDot(span); }

export function createBoltDotDot(span: TextSpan | null = null): BoltDotDot { return new BoltDotDot(span); }

export function createBoltRArrow(span: TextSpan | null = null): BoltRArrow { return new BoltRArrow(span); }

export function createBoltRArrowAlt(span: TextSpan | null = null): BoltRArrowAlt { return new BoltRArrowAlt(span); }

export function createBoltLArrow(span: TextSpan | null = null): BoltLArrow { return new BoltLArrow(span); }

export function createBoltEqSign(span: TextSpan | null = null): BoltEqSign { return new BoltEqSign(span); }

export function createBoltGtSign(span: TextSpan | null = null): BoltGtSign { return new BoltGtSign(span); }

export function createBoltExMark(span: TextSpan | null = null): BoltExMark { return new BoltExMark(span); }

export function createBoltLtSign(span: TextSpan | null = null): BoltLtSign { return new BoltLtSign(span); }

export function createBoltVBar(span: TextSpan | null = null): BoltVBar { return new BoltVBar(span); }

export function createBoltWhereKeyword(span: TextSpan | null = null): BoltWhereKeyword { return new BoltWhereKeyword(span); }

export function createBoltQuoteKeyword(span: TextSpan | null = null): BoltQuoteKeyword { return new BoltQuoteKeyword(span); }

export function createBoltFnKeyword(span: TextSpan | null = null): BoltFnKeyword { return new BoltFnKeyword(span); }

export function createBoltForeignKeyword(span: TextSpan | null = null): BoltForeignKeyword { return new BoltForeignKeyword(span); }

export function createBoltForKeyword(span: TextSpan | null = null): BoltForKeyword { return new BoltForKeyword(span); }

export function createBoltLetKeyword(span: TextSpan | null = null): BoltLetKeyword { return new BoltLetKeyword(span); }

export function createBoltReturnKeyword(span: TextSpan | null = null): BoltReturnKeyword { return new BoltReturnKeyword(span); }

export function createBoltLoopKeyword(span: TextSpan | null = null): BoltLoopKeyword { return new BoltLoopKeyword(span); }

export function createBoltYieldKeyword(span: TextSpan | null = null): BoltYieldKeyword { return new BoltYieldKeyword(span); }

export function createBoltMatchKeyword(span: TextSpan | null = null): BoltMatchKeyword { return new BoltMatchKeyword(span); }

export function createBoltImportKeyword(span: TextSpan | null = null): BoltImportKeyword { return new BoltImportKeyword(span); }

export function createBoltExportKeyword(span: TextSpan | null = null): BoltExportKeyword { return new BoltExportKeyword(span); }

export function createBoltPubKeyword(span: TextSpan | null = null): BoltPubKeyword { return new BoltPubKeyword(span); }

export function createBoltModKeyword(span: TextSpan | null = null): BoltModKeyword { return new BoltModKeyword(span); }

export function createBoltMutKeyword(span: TextSpan | null = null): BoltMutKeyword { return new BoltMutKeyword(span); }

export function createBoltEnumKeyword(span: TextSpan | null = null): BoltEnumKeyword { return new BoltEnumKeyword(span); }

export function createBoltStructKeyword(span: TextSpan | null = null): BoltStructKeyword { return new BoltStructKeyword(span); }

export function createBoltTypeKeyword(span: TextSpan | null = null): BoltTypeKeyword { return new BoltTypeKeyword(span); }

export function createBoltTraitKeyword(span: TextSpan | null = null): BoltTraitKeyword { return new BoltTraitKeyword(span); }

export function createBoltImplKeyword(span: TextSpan | null = null): BoltImplKeyword { return new BoltImplKeyword(span); }

export function createBoltParenthesized(text: string, span: TextSpan | null = null): BoltParenthesized { return new BoltParenthesized(text, span); }

export function createBoltBraced(text: string, span: TextSpan | null = null): BoltBraced { return new BoltBraced(text, span); }

export function createBoltBracketed(text: string, span: TextSpan | null = null): BoltBracketed { return new BoltBracketed(text, span); }

export function createBoltSourceFile(elements: BoltSourceElement[], pkg: Package | null, span: TextSpan | null = null): BoltSourceFile { return new BoltSourceFile(elements, pkg, span); }

export function createBoltQualName(isAbsolute: boolean, modulePath: BoltIdentifier[], name: BoltSymbol, span: TextSpan | null = null): BoltQualName { return new BoltQualName(isAbsolute, modulePath, name, span); }

export function createBoltTypeOfExpression(expression: BoltExpression, span: TextSpan | null = null): BoltTypeOfExpression { return new BoltTypeOfExpression(expression, span); }

export function createBoltReferenceTypeExpression(name: BoltQualName, typeArgs: BoltTypeExpression[] | null, span: TextSpan | null = null): BoltReferenceTypeExpression { return new BoltReferenceTypeExpression(name, typeArgs, span); }

export function createBoltFunctionTypeExpression(params: BoltParameter[], returnType: BoltTypeExpression | null, span: TextSpan | null = null): BoltFunctionTypeExpression { return new BoltFunctionTypeExpression(params, returnType, span); }

export function createBoltLiftedTypeExpression(expression: BoltExpression, span: TextSpan | null = null): BoltLiftedTypeExpression { return new BoltLiftedTypeExpression(expression, span); }

export function createBoltTypeParameter(index: number, name: BoltIdentifier, typeExpr: BoltTypeExpression | null, defaultType: BoltTypeExpression | null, span: TextSpan | null = null): BoltTypeParameter { return new BoltTypeParameter(index, name, typeExpr, defaultType, span); }

export function createBoltBindPattern(name: BoltIdentifier, span: TextSpan | null = null): BoltBindPattern { return new BoltBindPattern(name, span); }

export function createBoltTypePattern(typeExpr: BoltTypeExpression, nestedPattern: BoltPattern, span: TextSpan | null = null): BoltTypePattern { return new BoltTypePattern(typeExpr, nestedPattern, span); }

export function createBoltExpressionPattern(expression: BoltExpression, span: TextSpan | null = null): BoltExpressionPattern { return new BoltExpressionPattern(expression, span); }

export function createBoltTuplePatternElement(index: number, pattern: BoltPattern, span: TextSpan | null = null): BoltTuplePatternElement { return new BoltTuplePatternElement(index, pattern, span); }

export function createBoltTuplePattern(elements: BoltTuplePatternElement[], span: TextSpan | null = null): BoltTuplePattern { return new BoltTuplePattern(elements, span); }

export function createBoltRecordFieldPattern(isRest: boolean, name: BoltIdentifier | null, pattern: BoltPattern | null, span: TextSpan | null = null): BoltRecordFieldPattern { return new BoltRecordFieldPattern(isRest, name, pattern, span); }

export function createBoltRecordPattern(name: BoltTypeExpression, fields: BoltRecordFieldPattern[], span: TextSpan | null = null): BoltRecordPattern { return new BoltRecordPattern(name, fields, span); }

export function createBoltQuoteExpression(tokens: (Token | BoltExpression)[], span: TextSpan | null = null): BoltQuoteExpression { return new BoltQuoteExpression(tokens, span); }

export function createBoltTupleExpression(elements: BoltExpression[], span: TextSpan | null = null): BoltTupleExpression { return new BoltTupleExpression(elements, span); }

export function createBoltReferenceExpression(name: BoltQualName, span: TextSpan | null = null): BoltReferenceExpression { return new BoltReferenceExpression(name, span); }

export function createBoltMemberExpression(expression: BoltExpression, path: BoltIdentifier[], span: TextSpan | null = null): BoltMemberExpression { return new BoltMemberExpression(expression, path, span); }

export function createBoltFunctionExpression(params: BoltParameter[], returnType: BoltTypeExpression | null, body: BoltFunctionBodyElement[], span: TextSpan | null = null): BoltFunctionExpression { return new BoltFunctionExpression(params, returnType, body, span); }

export function createBoltCallExpression(operator: BoltExpression, operands: BoltExpression[], span: TextSpan | null = null): BoltCallExpression { return new BoltCallExpression(operator, operands, span); }

export function createBoltYieldExpression(value: BoltExpression, span: TextSpan | null = null): BoltYieldExpression { return new BoltYieldExpression(value, span); }

export function createBoltMatchArm(pattern: BoltPattern, body: BoltExpression, span: TextSpan | null = null): BoltMatchArm { return new BoltMatchArm(pattern, body, span); }

export function createBoltMatchExpression(value: BoltExpression, arms: BoltMatchArm[], span: TextSpan | null = null): BoltMatchExpression { return new BoltMatchExpression(value, arms, span); }

export function createBoltCase(test: BoltExpression, result: BoltExpression, span: TextSpan | null = null): BoltCase { return new BoltCase(test, result, span); }

export function createBoltCaseExpression(cases: BoltCase[], span: TextSpan | null = null): BoltCaseExpression { return new BoltCaseExpression(cases, span); }

export function createBoltBlockExpression(elements: BoltFunctionBodyElement[], span: TextSpan | null = null): BoltBlockExpression { return new BoltBlockExpression(elements, span); }

export function createBoltConstantExpression(value: Value, span: TextSpan | null = null): BoltConstantExpression { return new BoltConstantExpression(value, span); }

export function createBoltReturnStatement(value: BoltExpression | null, span: TextSpan | null = null): BoltReturnStatement { return new BoltReturnStatement(value, span); }

export function createBoltConditionalCase(test: BoltExpression | null, body: BoltFunctionBodyElement[], span: TextSpan | null = null): BoltConditionalCase { return new BoltConditionalCase(test, body, span); }

export function createBoltConditionalStatement(cases: BoltConditionalCase[], span: TextSpan | null = null): BoltConditionalStatement { return new BoltConditionalStatement(cases, span); }

export function createBoltResumeStatement(value: BoltExpression, span: TextSpan | null = null): BoltResumeStatement { return new BoltResumeStatement(value, span); }

export function createBoltExpressionStatement(expression: BoltExpression, span: TextSpan | null = null): BoltExpressionStatement { return new BoltExpressionStatement(expression, span); }

export function createBoltLoopStatement(elements: BoltFunctionBodyElement[], span: TextSpan | null = null): BoltLoopStatement { return new BoltLoopStatement(elements, span); }

export function createBoltParameter(index: number, bindings: BoltPattern, typeExpr: BoltTypeExpression | null, defaultValue: BoltExpression | null, span: TextSpan | null = null): BoltParameter { return new BoltParameter(index, bindings, typeExpr, defaultValue, span); }

export function createBoltModule(modifiers: BoltModifiers, name: BoltIdentifier[], elements: BoltSourceElement[], span: TextSpan | null = null): BoltModule { return new BoltModule(modifiers, name, elements, span); }

export function createBoltFunctionDeclaration(modifiers: BoltModifiers, target: string, name: BoltSymbol, params: BoltParameter[], returnType: BoltTypeExpression | null, typeParams: BoltTypeParameter[] | null, body: BoltFunctionBodyElement[], span: TextSpan | null = null): BoltFunctionDeclaration { return new BoltFunctionDeclaration(modifiers, target, name, params, returnType, typeParams, body, span); }

export function createBoltVariableDeclaration(modifiers: BoltModifiers, bindings: BoltPattern, typeExpr: BoltTypeExpression | null, value: BoltExpression | null, span: TextSpan | null = null): BoltVariableDeclaration { return new BoltVariableDeclaration(modifiers, bindings, typeExpr, value, span); }

export function createBoltPlainImportSymbol(remote: BoltQualName, local: BoltSymbol, span: TextSpan | null = null): BoltPlainImportSymbol { return new BoltPlainImportSymbol(remote, local, span); }

export function createBoltImportDirective(modifiers: BoltModifiers, file: BoltStringLiteral, symbols: BoltImportSymbol[] | null, span: TextSpan | null = null): BoltImportDirective { return new BoltImportDirective(modifiers, file, symbols, span); }

export function createBoltPlainExportSymbol(local: BoltQualName, remote: BoltSymbol, span: TextSpan | null = null): BoltPlainExportSymbol { return new BoltPlainExportSymbol(local, remote, span); }

export function createBoltExportDirective(file: string, symbols: BoltExportSymbol[] | null, span: TextSpan | null = null): BoltExportDirective { return new BoltExportDirective(file, symbols, span); }

export function createBoltTraitDeclaration(modifiers: BoltModifiers, typeParams: BoltTypeParameter[] | null, name: BoltIdentifier, typeBoundExpr: BoltTypeExpression | null, elements: BoltTraitOrImplElement[] | null, span: TextSpan | null = null): BoltTraitDeclaration { return new BoltTraitDeclaration(modifiers, typeParams, name, typeBoundExpr, elements, span); }

export function createBoltImplDeclaration(modifiers: BoltModifiers, typeParams: BoltTypeParameter[] | null, name: BoltIdentifier, traitTypeExpr: BoltTypeExpression | null, elements: BoltTraitOrImplElement[], span: TextSpan | null = null): BoltImplDeclaration { return new BoltImplDeclaration(modifiers, typeParams, name, traitTypeExpr, elements, span); }

export function createBoltTypeAliasDeclaration(modifiers: BoltModifiers, name: BoltIdentifier, typeParams: BoltTypeParameter[] | null, typeExpr: BoltTypeExpression, span: TextSpan | null = null): BoltTypeAliasDeclaration { return new BoltTypeAliasDeclaration(modifiers, name, typeParams, typeExpr, span); }

export function createBoltRecordField(name: BoltIdentifier, typeExpr: BoltTypeExpression, span: TextSpan | null = null): BoltRecordField { return new BoltRecordField(name, typeExpr, span); }

export function createBoltRecordDeclaration(modifiers: BoltModifiers, name: BoltIdentifier, typeParms: BoltTypeParameter[] | null, members: BoltRecordMember[] | null, span: TextSpan | null = null): BoltRecordDeclaration { return new BoltRecordDeclaration(modifiers, name, typeParms, members, span); }

export function createBoltMacroCall(name: BoltIdentifier, text: string, span: TextSpan | null = null): BoltMacroCall { return new BoltMacroCall(name, text, span); }

export function createJSIdentifier(text: string, span: TextSpan | null = null): JSIdentifier { return new JSIdentifier(text, span); }

export function createJSString(value: string, span: TextSpan | null = null): JSString { return new JSString(value, span); }

export function createJSInteger(value: bigint, span: TextSpan | null = null): JSInteger { return new JSInteger(value, span); }

export function createJSFromKeyword(span: TextSpan | null = null): JSFromKeyword { return new JSFromKeyword(span); }

export function createJSReturnKeyword(span: TextSpan | null = null): JSReturnKeyword { return new JSReturnKeyword(span); }

export function createJSTryKeyword(span: TextSpan | null = null): JSTryKeyword { return new JSTryKeyword(span); }

export function createJSFinallyKeyword(span: TextSpan | null = null): JSFinallyKeyword { return new JSFinallyKeyword(span); }

export function createJSCatchKeyword(span: TextSpan | null = null): JSCatchKeyword { return new JSCatchKeyword(span); }

export function createJSImportKeyword(span: TextSpan | null = null): JSImportKeyword { return new JSImportKeyword(span); }

export function createJSAsKeyword(span: TextSpan | null = null): JSAsKeyword { return new JSAsKeyword(span); }

export function createJSConstKeyword(span: TextSpan | null = null): JSConstKeyword { return new JSConstKeyword(span); }

export function createJSLetKeyword(span: TextSpan | null = null): JSLetKeyword { return new JSLetKeyword(span); }

export function createJSExportKeyword(span: TextSpan | null = null): JSExportKeyword { return new JSExportKeyword(span); }

export function createJSFunctionKeyword(span: TextSpan | null = null): JSFunctionKeyword { return new JSFunctionKeyword(span); }

export function createJSWhileKeyword(span: TextSpan | null = null): JSWhileKeyword { return new JSWhileKeyword(span); }

export function createJSForKeyword(span: TextSpan | null = null): JSForKeyword { return new JSForKeyword(span); }

export function createJSOperator(text: string, span: TextSpan | null = null): JSOperator { return new JSOperator(text, span); }

export function createJSCloseBrace(span: TextSpan | null = null): JSCloseBrace { return new JSCloseBrace(span); }

export function createJSCloseBracket(span: TextSpan | null = null): JSCloseBracket { return new JSCloseBracket(span); }

export function createJSCloseParen(span: TextSpan | null = null): JSCloseParen { return new JSCloseParen(span); }

export function createJSOpenBrace(span: TextSpan | null = null): JSOpenBrace { return new JSOpenBrace(span); }

export function createJSOpenBracket(span: TextSpan | null = null): JSOpenBracket { return new JSOpenBracket(span); }

export function createJSOpenParen(span: TextSpan | null = null): JSOpenParen { return new JSOpenParen(span); }

export function createJSSemi(span: TextSpan | null = null): JSSemi { return new JSSemi(span); }

export function createJSComma(span: TextSpan | null = null): JSComma { return new JSComma(span); }

export function createJSDot(span: TextSpan | null = null): JSDot { return new JSDot(span); }

export function createJSDotDotDot(span: TextSpan | null = null): JSDotDotDot { return new JSDotDotDot(span); }

export function createJSMulOp(span: TextSpan | null = null): JSMulOp { return new JSMulOp(span); }

export function createJSAddOp(span: TextSpan | null = null): JSAddOp { return new JSAddOp(span); }

export function createJSDivOp(span: TextSpan | null = null): JSDivOp { return new JSDivOp(span); }

export function createJSSubOp(span: TextSpan | null = null): JSSubOp { return new JSSubOp(span); }

export function createJSLtOp(span: TextSpan | null = null): JSLtOp { return new JSLtOp(span); }

export function createJSGtOp(span: TextSpan | null = null): JSGtOp { return new JSGtOp(span); }

export function createJSBOrOp(span: TextSpan | null = null): JSBOrOp { return new JSBOrOp(span); }

export function createJSBXorOp(span: TextSpan | null = null): JSBXorOp { return new JSBXorOp(span); }

export function createJSBAndOp(span: TextSpan | null = null): JSBAndOp { return new JSBAndOp(span); }

export function createJSBNotOp(span: TextSpan | null = null): JSBNotOp { return new JSBNotOp(span); }

export function createJSNotOp(span: TextSpan | null = null): JSNotOp { return new JSNotOp(span); }

export function createJSBindPattern(name: JSIdentifier, span: TextSpan | null = null): JSBindPattern { return new JSBindPattern(name, span); }

export function createJSConstantExpression(value: Value, span: TextSpan | null = null): JSConstantExpression { return new JSConstantExpression(value, span); }

export function createJSMemberExpression(value: JSExpression, property: JSIdentifier, span: TextSpan | null = null): JSMemberExpression { return new JSMemberExpression(value, property, span); }

export function createJSCallExpression(operator: JSExpression, operands: JSExpression[], span: TextSpan | null = null): JSCallExpression { return new JSCallExpression(operator, operands, span); }

export function createJSBinaryExpression(left: JSExpression, operator: JSOperator, right: JSExpression, span: TextSpan | null = null): JSBinaryExpression { return new JSBinaryExpression(left, operator, right, span); }

export function createJSUnaryExpression(operator: JSOperator, operand: JSExpression, span: TextSpan | null = null): JSUnaryExpression { return new JSUnaryExpression(operator, operand, span); }

export function createJSNewExpression(target: JSExpression, args: JSExpression[], span: TextSpan | null = null): JSNewExpression { return new JSNewExpression(target, args, span); }

export function createJSSequenceExpression(expressions: JSExpression[], span: TextSpan | null = null): JSSequenceExpression { return new JSSequenceExpression(expressions, span); }

export function createJSConditionalExpression(test: JSExpression, consequent: JSExpression, alternate: JSExpression, span: TextSpan | null = null): JSConditionalExpression { return new JSConditionalExpression(test, consequent, alternate, span); }

export function createJSLiteralExpression(value: Value, span: TextSpan | null = null): JSLiteralExpression { return new JSLiteralExpression(value, span); }

export function createJSReferenceExpression(name: string, span: TextSpan | null = null): JSReferenceExpression { return new JSReferenceExpression(name, span); }

export function createJSCatchBlock(bindings: JSPattern | null, elements: JSSourceElement[], span: TextSpan | null = null): JSCatchBlock { return new JSCatchBlock(bindings, elements, span); }

export function createJSTryCatchStatement(tryBlock: JSSourceElement[], catchBlock: JSCatchBlock | null, finalBlock: JSSourceElement[] | null, span: TextSpan | null = null): JSTryCatchStatement { return new JSTryCatchStatement(tryBlock, catchBlock, finalBlock, span); }

export function createJSExpressionStatement(expression: JSExpression, span: TextSpan | null = null): JSExpressionStatement { return new JSExpressionStatement(expression, span); }

export function createJSConditionalCase(test: JSExpression | null, body: JSFunctionBodyElement[], span: TextSpan | null = null): JSConditionalCase { return new JSConditionalCase(test, body, span); }

export function createJSConditionalStatement(cases: JSConditionalCase[], span: TextSpan | null = null): JSConditionalStatement { return new JSConditionalStatement(cases, span); }

export function createJSReturnStatement(value: JSExpression | null, span: TextSpan | null = null): JSReturnStatement { return new JSReturnStatement(value, span); }

export function createJSParameter(index: number, bindings: JSPattern, defaultValue: JSExpression | null, span: TextSpan | null = null): JSParameter { return new JSParameter(index, bindings, defaultValue, span); }

export function createJSImportStarBinding(local: JSIdentifier, span: TextSpan | null = null): JSImportStarBinding { return new JSImportStarBinding(local, span); }

export function createJSImportAsBinding(remote: JSIdentifier, local: JSIdentifier | null, span: TextSpan | null = null): JSImportAsBinding { return new JSImportAsBinding(remote, local, span); }

export function createJSImportDeclaration(bindings: JSImportBinding[], filename: JSString, span: TextSpan | null = null): JSImportDeclaration { return new JSImportDeclaration(bindings, filename, span); }

export function createJSFunctionDeclaration(modifiers: JSDeclarationModifiers, name: JSIdentifier, params: JSParameter[], body: JSStatement[], span: TextSpan | null = null): JSFunctionDeclaration { return new JSFunctionDeclaration(modifiers, name, params, body, span); }

export function createJSArrowFunctionDeclaration(name: JSIdentifier, params: JSParameter[], body: JSExpression, span: TextSpan | null = null): JSArrowFunctionDeclaration { return new JSArrowFunctionDeclaration(name, params, body, span); }

export function createJSLetDeclaration(bindings: JSPattern, value: JSExpression | null, span: TextSpan | null = null): JSLetDeclaration { return new JSLetDeclaration(bindings, value, span); }

export function createJSSourceFile(elements: JSSourceElement[], span: TextSpan | null = null): JSSourceFile { return new JSSourceFile(elements, span); }

export function isEndOfFile(value: any): value is EndOfFile { return value.kind === SyntaxKind.EndOfFile; }

export function isToken(value: any): value is Token { return value.kind === SyntaxKind.JSNotOp || value.kind === SyntaxKind.JSBNotOp || value.kind === SyntaxKind.JSBAndOp || value.kind === SyntaxKind.JSBXorOp || value.kind === SyntaxKind.JSBOrOp || value.kind === SyntaxKind.JSGtOp || value.kind === SyntaxKind.JSLtOp || value.kind === SyntaxKind.JSSubOp || value.kind === SyntaxKind.JSDivOp || value.kind === SyntaxKind.JSAddOp || value.kind === SyntaxKind.JSMulOp || value.kind === SyntaxKind.JSDotDotDot || value.kind === SyntaxKind.JSDot || value.kind === SyntaxKind.JSComma || value.kind === SyntaxKind.JSSemi || value.kind === SyntaxKind.JSOpenParen || value.kind === SyntaxKind.JSOpenBracket || value.kind === SyntaxKind.JSOpenBrace || value.kind === SyntaxKind.JSCloseParen || value.kind === SyntaxKind.JSCloseBracket || value.kind === SyntaxKind.JSCloseBrace || value.kind === SyntaxKind.JSOperator || value.kind === SyntaxKind.JSForKeyword || value.kind === SyntaxKind.JSWhileKeyword || value.kind === SyntaxKind.JSFunctionKeyword || value.kind === SyntaxKind.JSExportKeyword || value.kind === SyntaxKind.JSLetKeyword || value.kind === SyntaxKind.JSConstKeyword || value.kind === SyntaxKind.JSAsKeyword || value.kind === SyntaxKind.JSImportKeyword || value.kind === SyntaxKind.JSCatchKeyword || value.kind === SyntaxKind.JSFinallyKeyword || value.kind === SyntaxKind.JSTryKeyword || value.kind === SyntaxKind.JSReturnKeyword || value.kind === SyntaxKind.JSFromKeyword || value.kind === SyntaxKind.JSInteger || value.kind === SyntaxKind.JSString || value.kind === SyntaxKind.JSIdentifier || value.kind === SyntaxKind.EndOfFile || value.kind === SyntaxKind.BoltBracketed || value.kind === SyntaxKind.BoltBraced || value.kind === SyntaxKind.BoltParenthesized || value.kind === SyntaxKind.BoltImplKeyword || value.kind === SyntaxKind.BoltTraitKeyword || value.kind === SyntaxKind.BoltTypeKeyword || value.kind === SyntaxKind.BoltStructKeyword || value.kind === SyntaxKind.BoltEnumKeyword || value.kind === SyntaxKind.BoltMutKeyword || value.kind === SyntaxKind.BoltModKeyword || value.kind === SyntaxKind.BoltPubKeyword || value.kind === SyntaxKind.BoltExportKeyword || value.kind === SyntaxKind.BoltImportKeyword || value.kind === SyntaxKind.BoltMatchKeyword || value.kind === SyntaxKind.BoltYieldKeyword || value.kind === SyntaxKind.BoltLoopKeyword || value.kind === SyntaxKind.BoltReturnKeyword || value.kind === SyntaxKind.BoltLetKeyword || value.kind === SyntaxKind.BoltForKeyword || value.kind === SyntaxKind.BoltForeignKeyword || value.kind === SyntaxKind.BoltFnKeyword || value.kind === SyntaxKind.BoltQuoteKeyword || value.kind === SyntaxKind.BoltWhereKeyword || value.kind === SyntaxKind.BoltVBar || value.kind === SyntaxKind.BoltLtSign || value.kind === SyntaxKind.BoltExMark || value.kind === SyntaxKind.BoltGtSign || value.kind === SyntaxKind.BoltEqSign || value.kind === SyntaxKind.BoltLArrow || value.kind === SyntaxKind.BoltRArrowAlt || value.kind === SyntaxKind.BoltRArrow || value.kind === SyntaxKind.BoltDotDot || value.kind === SyntaxKind.BoltDot || value.kind === SyntaxKind.BoltColonColon || value.kind === SyntaxKind.BoltColon || value.kind === SyntaxKind.BoltSemi || value.kind === SyntaxKind.BoltComma || value.kind === SyntaxKind.BoltAssignment || value.kind === SyntaxKind.BoltOperator || value.kind === SyntaxKind.BoltIdentifier || value.kind === SyntaxKind.BoltIntegerLiteral || value.kind === SyntaxKind.BoltStringLiteral; }

export function isSourceFile(value: any): value is SourceFile { return value.kind === SyntaxKind.JSSourceFile || value.kind === SyntaxKind.BoltSourceFile; }

export function isFunctionBodyElement(value: any): value is FunctionBodyElement { return value.kind === SyntaxKind.JSLetDeclaration || value.kind === SyntaxKind.JSArrowFunctionDeclaration || value.kind === SyntaxKind.JSFunctionDeclaration || value.kind === SyntaxKind.JSImportDeclaration || value.kind === SyntaxKind.JSReturnStatement || value.kind === SyntaxKind.JSConditionalStatement || value.kind === SyntaxKind.JSExpressionStatement || value.kind === SyntaxKind.JSTryCatchStatement || value.kind === SyntaxKind.BoltMacroCall || value.kind === SyntaxKind.BoltVariableDeclaration || value.kind === SyntaxKind.BoltFunctionDeclaration || value.kind === SyntaxKind.BoltLoopStatement || value.kind === SyntaxKind.BoltExpressionStatement || value.kind === SyntaxKind.BoltResumeStatement || value.kind === SyntaxKind.BoltConditionalStatement || value.kind === SyntaxKind.BoltReturnStatement; }

export function isReturnStatement(value: any): value is ReturnStatement { return value.kind === SyntaxKind.JSReturnStatement || value.kind === SyntaxKind.BoltReturnStatement; }

export function isBoltSyntax(value: any): value is BoltSyntax { return value.kind === SyntaxKind.BoltMacroCall || value.kind === SyntaxKind.BoltRecordField || value.kind === SyntaxKind.BoltPlainExportSymbol || value.kind === SyntaxKind.BoltImportDirective || value.kind === SyntaxKind.BoltPlainImportSymbol || value.kind === SyntaxKind.BoltModule || value.kind === SyntaxKind.BoltRecordDeclaration || value.kind === SyntaxKind.BoltTypeAliasDeclaration || value.kind === SyntaxKind.BoltImplDeclaration || value.kind === SyntaxKind.BoltTraitDeclaration || value.kind === SyntaxKind.BoltVariableDeclaration || value.kind === SyntaxKind.BoltFunctionDeclaration || value.kind === SyntaxKind.BoltParameter || value.kind === SyntaxKind.BoltConditionalCase || value.kind === SyntaxKind.BoltLoopStatement || value.kind === SyntaxKind.BoltExpressionStatement || value.kind === SyntaxKind.BoltResumeStatement || value.kind === SyntaxKind.BoltConditionalStatement || value.kind === SyntaxKind.BoltReturnStatement || value.kind === SyntaxKind.BoltCase || value.kind === SyntaxKind.BoltMatchArm || value.kind === SyntaxKind.BoltConstantExpression || value.kind === SyntaxKind.BoltBlockExpression || value.kind === SyntaxKind.BoltCaseExpression || value.kind === SyntaxKind.BoltMatchExpression || value.kind === SyntaxKind.BoltYieldExpression || value.kind === SyntaxKind.BoltCallExpression || value.kind === SyntaxKind.BoltFunctionExpression || value.kind === SyntaxKind.BoltMemberExpression || value.kind === SyntaxKind.BoltReferenceExpression || value.kind === SyntaxKind.BoltTupleExpression || value.kind === SyntaxKind.BoltQuoteExpression || value.kind === SyntaxKind.BoltRecordFieldPattern || value.kind === SyntaxKind.BoltTuplePatternElement || value.kind === SyntaxKind.BoltRecordPattern || value.kind === SyntaxKind.BoltTuplePattern || value.kind === SyntaxKind.BoltExpressionPattern || value.kind === SyntaxKind.BoltTypePattern || value.kind === SyntaxKind.BoltBindPattern || value.kind === SyntaxKind.BoltTypeParameter || value.kind === SyntaxKind.BoltLiftedTypeExpression || value.kind === SyntaxKind.BoltFunctionTypeExpression || value.kind === SyntaxKind.BoltReferenceTypeExpression || value.kind === SyntaxKind.BoltTypeOfExpression || value.kind === SyntaxKind.BoltQualName || value.kind === SyntaxKind.BoltSourceFile || value.kind === SyntaxKind.BoltBracketed || value.kind === SyntaxKind.BoltBraced || value.kind === SyntaxKind.BoltParenthesized || value.kind === SyntaxKind.BoltImplKeyword || value.kind === SyntaxKind.BoltTraitKeyword || value.kind === SyntaxKind.BoltTypeKeyword || value.kind === SyntaxKind.BoltStructKeyword || value.kind === SyntaxKind.BoltEnumKeyword || value.kind === SyntaxKind.BoltMutKeyword || value.kind === SyntaxKind.BoltModKeyword || value.kind === SyntaxKind.BoltPubKeyword || value.kind === SyntaxKind.BoltExportKeyword || value.kind === SyntaxKind.BoltImportKeyword || value.kind === SyntaxKind.BoltMatchKeyword || value.kind === SyntaxKind.BoltYieldKeyword || value.kind === SyntaxKind.BoltLoopKeyword || value.kind === SyntaxKind.BoltReturnKeyword || value.kind === SyntaxKind.BoltLetKeyword || value.kind === SyntaxKind.BoltForKeyword || value.kind === SyntaxKind.BoltForeignKeyword || value.kind === SyntaxKind.BoltFnKeyword || value.kind === SyntaxKind.BoltQuoteKeyword || value.kind === SyntaxKind.BoltWhereKeyword || value.kind === SyntaxKind.BoltVBar || value.kind === SyntaxKind.BoltLtSign || value.kind === SyntaxKind.BoltExMark || value.kind === SyntaxKind.BoltGtSign || value.kind === SyntaxKind.BoltEqSign || value.kind === SyntaxKind.BoltLArrow || value.kind === SyntaxKind.BoltRArrowAlt || value.kind === SyntaxKind.BoltRArrow || value.kind === SyntaxKind.BoltDotDot || value.kind === SyntaxKind.BoltDot || value.kind === SyntaxKind.BoltColonColon || value.kind === SyntaxKind.BoltColon || value.kind === SyntaxKind.BoltSemi || value.kind === SyntaxKind.BoltComma || value.kind === SyntaxKind.BoltAssignment || value.kind === SyntaxKind.BoltOperator || value.kind === SyntaxKind.BoltIdentifier || value.kind === SyntaxKind.BoltIntegerLiteral || value.kind === SyntaxKind.BoltStringLiteral || value.kind === SyntaxKind.EndOfFile; }

export function isBoltToken(value: any): value is BoltToken { return value.kind === SyntaxKind.BoltBracketed || value.kind === SyntaxKind.BoltBraced || value.kind === SyntaxKind.BoltParenthesized || value.kind === SyntaxKind.BoltImplKeyword || value.kind === SyntaxKind.BoltTraitKeyword || value.kind === SyntaxKind.BoltTypeKeyword || value.kind === SyntaxKind.BoltStructKeyword || value.kind === SyntaxKind.BoltEnumKeyword || value.kind === SyntaxKind.BoltMutKeyword || value.kind === SyntaxKind.BoltModKeyword || value.kind === SyntaxKind.BoltPubKeyword || value.kind === SyntaxKind.BoltExportKeyword || value.kind === SyntaxKind.BoltImportKeyword || value.kind === SyntaxKind.BoltMatchKeyword || value.kind === SyntaxKind.BoltYieldKeyword || value.kind === SyntaxKind.BoltLoopKeyword || value.kind === SyntaxKind.BoltReturnKeyword || value.kind === SyntaxKind.BoltLetKeyword || value.kind === SyntaxKind.BoltForKeyword || value.kind === SyntaxKind.BoltForeignKeyword || value.kind === SyntaxKind.BoltFnKeyword || value.kind === SyntaxKind.BoltQuoteKeyword || value.kind === SyntaxKind.BoltWhereKeyword || value.kind === SyntaxKind.BoltVBar || value.kind === SyntaxKind.BoltLtSign || value.kind === SyntaxKind.BoltExMark || value.kind === SyntaxKind.BoltGtSign || value.kind === SyntaxKind.BoltEqSign || value.kind === SyntaxKind.BoltLArrow || value.kind === SyntaxKind.BoltRArrowAlt || value.kind === SyntaxKind.BoltRArrow || value.kind === SyntaxKind.BoltDotDot || value.kind === SyntaxKind.BoltDot || value.kind === SyntaxKind.BoltColonColon || value.kind === SyntaxKind.BoltColon || value.kind === SyntaxKind.BoltSemi || value.kind === SyntaxKind.BoltComma || value.kind === SyntaxKind.BoltAssignment || value.kind === SyntaxKind.BoltOperator || value.kind === SyntaxKind.BoltIdentifier || value.kind === SyntaxKind.BoltIntegerLiteral || value.kind === SyntaxKind.BoltStringLiteral || value.kind === SyntaxKind.EndOfFile; }

export function isBoltStringLiteral(value: any): value is BoltStringLiteral { return value.kind === SyntaxKind.BoltStringLiteral; }

export function isBoltIntegerLiteral(value: any): value is BoltIntegerLiteral { return value.kind === SyntaxKind.BoltIntegerLiteral; }

export function isBoltSymbol(value: any): value is BoltSymbol { return value.kind === SyntaxKind.BoltOperator || value.kind === SyntaxKind.BoltVBar || value.kind === SyntaxKind.BoltLtSign || value.kind === SyntaxKind.BoltExMark || value.kind === SyntaxKind.BoltGtSign || value.kind === SyntaxKind.BoltIdentifier; }

export function isBoltIdentifier(value: any): value is BoltIdentifier { return value.kind === SyntaxKind.BoltIdentifier; }

export function isBoltOperatorLike(value: any): value is BoltOperatorLike { return value.kind === SyntaxKind.BoltVBar || value.kind === SyntaxKind.BoltLtSign || value.kind === SyntaxKind.BoltExMark || value.kind === SyntaxKind.BoltGtSign; }

export function isBoltOperator(value: any): value is BoltOperator { return value.kind === SyntaxKind.BoltOperator; }

export function isBoltAssignment(value: any): value is BoltAssignment { return value.kind === SyntaxKind.BoltAssignment; }

export function isBoltComma(value: any): value is BoltComma { return value.kind === SyntaxKind.BoltComma; }

export function isBoltSemi(value: any): value is BoltSemi { return value.kind === SyntaxKind.BoltSemi; }

export function isBoltColon(value: any): value is BoltColon { return value.kind === SyntaxKind.BoltColon; }

export function isBoltColonColon(value: any): value is BoltColonColon { return value.kind === SyntaxKind.BoltColonColon; }

export function isBoltDot(value: any): value is BoltDot { return value.kind === SyntaxKind.BoltDot; }

export function isBoltDotDot(value: any): value is BoltDotDot { return value.kind === SyntaxKind.BoltDotDot; }

export function isBoltRArrow(value: any): value is BoltRArrow { return value.kind === SyntaxKind.BoltRArrow; }

export function isBoltRArrowAlt(value: any): value is BoltRArrowAlt { return value.kind === SyntaxKind.BoltRArrowAlt; }

export function isBoltLArrow(value: any): value is BoltLArrow { return value.kind === SyntaxKind.BoltLArrow; }

export function isBoltEqSign(value: any): value is BoltEqSign { return value.kind === SyntaxKind.BoltEqSign; }

export function isBoltGtSign(value: any): value is BoltGtSign { return value.kind === SyntaxKind.BoltGtSign; }

export function isBoltExMark(value: any): value is BoltExMark { return value.kind === SyntaxKind.BoltExMark; }

export function isBoltLtSign(value: any): value is BoltLtSign { return value.kind === SyntaxKind.BoltLtSign; }

export function isBoltVBar(value: any): value is BoltVBar { return value.kind === SyntaxKind.BoltVBar; }

export function isBoltKeyword(value: any): value is BoltKeyword { return value.kind === SyntaxKind.BoltImplKeyword || value.kind === SyntaxKind.BoltTraitKeyword || value.kind === SyntaxKind.BoltTypeKeyword || value.kind === SyntaxKind.BoltStructKeyword || value.kind === SyntaxKind.BoltEnumKeyword || value.kind === SyntaxKind.BoltMutKeyword || value.kind === SyntaxKind.BoltModKeyword || value.kind === SyntaxKind.BoltPubKeyword || value.kind === SyntaxKind.BoltExportKeyword || value.kind === SyntaxKind.BoltImportKeyword || value.kind === SyntaxKind.BoltMatchKeyword || value.kind === SyntaxKind.BoltYieldKeyword || value.kind === SyntaxKind.BoltLoopKeyword || value.kind === SyntaxKind.BoltReturnKeyword || value.kind === SyntaxKind.BoltLetKeyword || value.kind === SyntaxKind.BoltForKeyword || value.kind === SyntaxKind.BoltForeignKeyword || value.kind === SyntaxKind.BoltFnKeyword || value.kind === SyntaxKind.BoltQuoteKeyword || value.kind === SyntaxKind.BoltWhereKeyword; }

export function isBoltWhereKeyword(value: any): value is BoltWhereKeyword { return value.kind === SyntaxKind.BoltWhereKeyword; }

export function isBoltQuoteKeyword(value: any): value is BoltQuoteKeyword { return value.kind === SyntaxKind.BoltQuoteKeyword; }

export function isBoltFnKeyword(value: any): value is BoltFnKeyword { return value.kind === SyntaxKind.BoltFnKeyword; }

export function isBoltForeignKeyword(value: any): value is BoltForeignKeyword { return value.kind === SyntaxKind.BoltForeignKeyword; }

export function isBoltForKeyword(value: any): value is BoltForKeyword { return value.kind === SyntaxKind.BoltForKeyword; }

export function isBoltLetKeyword(value: any): value is BoltLetKeyword { return value.kind === SyntaxKind.BoltLetKeyword; }

export function isBoltReturnKeyword(value: any): value is BoltReturnKeyword { return value.kind === SyntaxKind.BoltReturnKeyword; }

export function isBoltLoopKeyword(value: any): value is BoltLoopKeyword { return value.kind === SyntaxKind.BoltLoopKeyword; }

export function isBoltYieldKeyword(value: any): value is BoltYieldKeyword { return value.kind === SyntaxKind.BoltYieldKeyword; }

export function isBoltMatchKeyword(value: any): value is BoltMatchKeyword { return value.kind === SyntaxKind.BoltMatchKeyword; }

export function isBoltImportKeyword(value: any): value is BoltImportKeyword { return value.kind === SyntaxKind.BoltImportKeyword; }

export function isBoltExportKeyword(value: any): value is BoltExportKeyword { return value.kind === SyntaxKind.BoltExportKeyword; }

export function isBoltPubKeyword(value: any): value is BoltPubKeyword { return value.kind === SyntaxKind.BoltPubKeyword; }

export function isBoltModKeyword(value: any): value is BoltModKeyword { return value.kind === SyntaxKind.BoltModKeyword; }

export function isBoltMutKeyword(value: any): value is BoltMutKeyword { return value.kind === SyntaxKind.BoltMutKeyword; }

export function isBoltEnumKeyword(value: any): value is BoltEnumKeyword { return value.kind === SyntaxKind.BoltEnumKeyword; }

export function isBoltStructKeyword(value: any): value is BoltStructKeyword { return value.kind === SyntaxKind.BoltStructKeyword; }

export function isBoltTypeKeyword(value: any): value is BoltTypeKeyword { return value.kind === SyntaxKind.BoltTypeKeyword; }

export function isBoltTraitKeyword(value: any): value is BoltTraitKeyword { return value.kind === SyntaxKind.BoltTraitKeyword; }

export function isBoltImplKeyword(value: any): value is BoltImplKeyword { return value.kind === SyntaxKind.BoltImplKeyword; }

export function isBoltPunctuated(value: any): value is BoltPunctuated { return value.kind === SyntaxKind.BoltBracketed || value.kind === SyntaxKind.BoltBraced || value.kind === SyntaxKind.BoltParenthesized; }

export function isBoltParenthesized(value: any): value is BoltParenthesized { return value.kind === SyntaxKind.BoltParenthesized; }

export function isBoltBraced(value: any): value is BoltBraced { return value.kind === SyntaxKind.BoltBraced; }

export function isBoltBracketed(value: any): value is BoltBracketed { return value.kind === SyntaxKind.BoltBracketed; }

export function isBoltSourceFile(value: any): value is BoltSourceFile { return value.kind === SyntaxKind.BoltSourceFile; }

export function isBoltQualName(value: any): value is BoltQualName { return value.kind === SyntaxKind.BoltQualName; }

export function isBoltTypeExpression(value: any): value is BoltTypeExpression { return value.kind === SyntaxKind.BoltLiftedTypeExpression || value.kind === SyntaxKind.BoltFunctionTypeExpression || value.kind === SyntaxKind.BoltReferenceTypeExpression || value.kind === SyntaxKind.BoltTypeOfExpression; }

export function isBoltTypeOfExpression(value: any): value is BoltTypeOfExpression { return value.kind === SyntaxKind.BoltTypeOfExpression; }

export function isBoltReferenceTypeExpression(value: any): value is BoltReferenceTypeExpression { return value.kind === SyntaxKind.BoltReferenceTypeExpression; }

export function isBoltFunctionTypeExpression(value: any): value is BoltFunctionTypeExpression { return value.kind === SyntaxKind.BoltFunctionTypeExpression; }

export function isBoltLiftedTypeExpression(value: any): value is BoltLiftedTypeExpression { return value.kind === SyntaxKind.BoltLiftedTypeExpression; }

export function isBoltTypeParameter(value: any): value is BoltTypeParameter { return value.kind === SyntaxKind.BoltTypeParameter; }

export function isBoltPattern(value: any): value is BoltPattern { return value.kind === SyntaxKind.BoltRecordPattern || value.kind === SyntaxKind.BoltTuplePattern || value.kind === SyntaxKind.BoltExpressionPattern || value.kind === SyntaxKind.BoltTypePattern || value.kind === SyntaxKind.BoltBindPattern; }

export function isBoltBindPattern(value: any): value is BoltBindPattern { return value.kind === SyntaxKind.BoltBindPattern; }

export function isBoltTypePattern(value: any): value is BoltTypePattern { return value.kind === SyntaxKind.BoltTypePattern; }

export function isBoltExpressionPattern(value: any): value is BoltExpressionPattern { return value.kind === SyntaxKind.BoltExpressionPattern; }

export function isBoltTuplePatternElement(value: any): value is BoltTuplePatternElement { return value.kind === SyntaxKind.BoltTuplePatternElement; }

export function isBoltTuplePattern(value: any): value is BoltTuplePattern { return value.kind === SyntaxKind.BoltTuplePattern; }

export function isBoltRecordFieldPattern(value: any): value is BoltRecordFieldPattern { return value.kind === SyntaxKind.BoltRecordFieldPattern; }

export function isBoltRecordPattern(value: any): value is BoltRecordPattern { return value.kind === SyntaxKind.BoltRecordPattern; }

export function isBoltExpression(value: any): value is BoltExpression { return value.kind === SyntaxKind.BoltConstantExpression || value.kind === SyntaxKind.BoltBlockExpression || value.kind === SyntaxKind.BoltCaseExpression || value.kind === SyntaxKind.BoltMatchExpression || value.kind === SyntaxKind.BoltYieldExpression || value.kind === SyntaxKind.BoltCallExpression || value.kind === SyntaxKind.BoltFunctionExpression || value.kind === SyntaxKind.BoltMemberExpression || value.kind === SyntaxKind.BoltReferenceExpression || value.kind === SyntaxKind.BoltTupleExpression || value.kind === SyntaxKind.BoltQuoteExpression; }

export function isBoltQuoteExpression(value: any): value is BoltQuoteExpression { return value.kind === SyntaxKind.BoltQuoteExpression; }

export function isBoltTupleExpression(value: any): value is BoltTupleExpression { return value.kind === SyntaxKind.BoltTupleExpression; }

export function isBoltReferenceExpression(value: any): value is BoltReferenceExpression { return value.kind === SyntaxKind.BoltReferenceExpression; }

export function isBoltMemberExpression(value: any): value is BoltMemberExpression { return value.kind === SyntaxKind.BoltMemberExpression; }

export function isBoltFunctionExpression(value: any): value is BoltFunctionExpression { return value.kind === SyntaxKind.BoltFunctionExpression; }

export function isBoltCallExpression(value: any): value is BoltCallExpression { return value.kind === SyntaxKind.BoltCallExpression; }

export function isBoltYieldExpression(value: any): value is BoltYieldExpression { return value.kind === SyntaxKind.BoltYieldExpression; }

export function isBoltMatchArm(value: any): value is BoltMatchArm { return value.kind === SyntaxKind.BoltMatchArm; }

export function isBoltMatchExpression(value: any): value is BoltMatchExpression { return value.kind === SyntaxKind.BoltMatchExpression; }

export function isBoltCase(value: any): value is BoltCase { return value.kind === SyntaxKind.BoltCase; }

export function isBoltCaseExpression(value: any): value is BoltCaseExpression { return value.kind === SyntaxKind.BoltCaseExpression; }

export function isBoltBlockExpression(value: any): value is BoltBlockExpression { return value.kind === SyntaxKind.BoltBlockExpression; }

export function isBoltConstantExpression(value: any): value is BoltConstantExpression { return value.kind === SyntaxKind.BoltConstantExpression; }

export function isBoltStatement(value: any): value is BoltStatement { return value.kind === SyntaxKind.BoltLoopStatement || value.kind === SyntaxKind.BoltExpressionStatement || value.kind === SyntaxKind.BoltResumeStatement || value.kind === SyntaxKind.BoltConditionalStatement || value.kind === SyntaxKind.BoltReturnStatement; }

export function isBoltReturnStatement(value: any): value is BoltReturnStatement { return value.kind === SyntaxKind.BoltReturnStatement; }

export function isBoltConditionalCase(value: any): value is BoltConditionalCase { return value.kind === SyntaxKind.BoltConditionalCase; }

export function isBoltConditionalStatement(value: any): value is BoltConditionalStatement { return value.kind === SyntaxKind.BoltConditionalStatement; }

export function isBoltResumeStatement(value: any): value is BoltResumeStatement { return value.kind === SyntaxKind.BoltResumeStatement; }

export function isBoltExpressionStatement(value: any): value is BoltExpressionStatement { return value.kind === SyntaxKind.BoltExpressionStatement; }

export function isBoltLoopStatement(value: any): value is BoltLoopStatement { return value.kind === SyntaxKind.BoltLoopStatement; }

export function isBoltParameter(value: any): value is BoltParameter { return value.kind === SyntaxKind.BoltParameter; }

export function isBoltDeclaration(value: any): value is BoltDeclaration { return value.kind === SyntaxKind.BoltRecordDeclaration || value.kind === SyntaxKind.BoltVariableDeclaration || value.kind === SyntaxKind.BoltFunctionDeclaration; }

export function isBoltTypeDeclaration(value: any): value is BoltTypeDeclaration { return value.kind === SyntaxKind.BoltRecordDeclaration || value.kind === SyntaxKind.BoltTypeAliasDeclaration || value.kind === SyntaxKind.BoltImplDeclaration || value.kind === SyntaxKind.BoltTraitDeclaration; }

export function isBoltModule(value: any): value is BoltModule { return value.kind === SyntaxKind.BoltModule; }

export function isBoltDeclarationLike(value: any): value is BoltDeclarationLike { return value.kind === SyntaxKind.BoltRecordDeclaration || value.kind === SyntaxKind.BoltTypeAliasDeclaration || value.kind === SyntaxKind.BoltImplDeclaration || value.kind === SyntaxKind.BoltTraitDeclaration || value.kind === SyntaxKind.BoltVariableDeclaration || value.kind === SyntaxKind.BoltFunctionDeclaration; }

export function isBoltFunctionBodyElement(value: any): value is BoltFunctionBodyElement { return value.kind === SyntaxKind.BoltMacroCall || value.kind === SyntaxKind.BoltVariableDeclaration || value.kind === SyntaxKind.BoltFunctionDeclaration || value.kind === SyntaxKind.BoltLoopStatement || value.kind === SyntaxKind.BoltExpressionStatement || value.kind === SyntaxKind.BoltResumeStatement || value.kind === SyntaxKind.BoltConditionalStatement || value.kind === SyntaxKind.BoltReturnStatement; }

export function isBoltFunctionDeclaration(value: any): value is BoltFunctionDeclaration { return value.kind === SyntaxKind.BoltFunctionDeclaration; }

export function isBoltVariableDeclaration(value: any): value is BoltVariableDeclaration { return value.kind === SyntaxKind.BoltVariableDeclaration; }

export function isBoltImportSymbol(value: any): value is BoltImportSymbol { return value.kind === SyntaxKind.BoltPlainImportSymbol; }

export function isBoltPlainImportSymbol(value: any): value is BoltPlainImportSymbol { return value.kind === SyntaxKind.BoltPlainImportSymbol; }

export function isBoltImportDirective(value: any): value is BoltImportDirective { return value.kind === SyntaxKind.BoltImportDirective; }

export function isBoltExportSymbol(value: any): value is BoltExportSymbol { return value.kind === SyntaxKind.BoltPlainExportSymbol; }

export function isBoltPlainExportSymbol(value: any): value is BoltPlainExportSymbol { return value.kind === SyntaxKind.BoltPlainExportSymbol; }

export function isBoltExportDirective(value: any): value is BoltExportDirective { return value.kind === SyntaxKind.BoltExportDirective; }

export function isBoltTraitOrImplElement(value: any): value is BoltTraitOrImplElement { return value.kind === SyntaxKind.BoltMacroCall || value.kind === SyntaxKind.BoltTypeAliasDeclaration || value.kind === SyntaxKind.BoltFunctionDeclaration; }

export function isBoltTraitDeclaration(value: any): value is BoltTraitDeclaration { return value.kind === SyntaxKind.BoltTraitDeclaration; }

export function isBoltImplDeclaration(value: any): value is BoltImplDeclaration { return value.kind === SyntaxKind.BoltImplDeclaration; }

export function isBoltTypeAliasDeclaration(value: any): value is BoltTypeAliasDeclaration { return value.kind === SyntaxKind.BoltTypeAliasDeclaration; }

export function isBoltRecordMember(value: any): value is BoltRecordMember { return value.kind === SyntaxKind.BoltMacroCall || value.kind === SyntaxKind.BoltRecordField; }

export function isBoltRecordField(value: any): value is BoltRecordField { return value.kind === SyntaxKind.BoltRecordField; }

export function isBoltRecordDeclaration(value: any): value is BoltRecordDeclaration { return value.kind === SyntaxKind.BoltRecordDeclaration; }

export function isBoltSourceElement(value: any): value is BoltSourceElement { return value.kind === SyntaxKind.BoltMacroCall || value.kind === SyntaxKind.BoltExportDirective || value.kind === SyntaxKind.BoltImportDirective || value.kind === SyntaxKind.BoltModule || value.kind === SyntaxKind.BoltRecordDeclaration || value.kind === SyntaxKind.BoltTypeAliasDeclaration || value.kind === SyntaxKind.BoltImplDeclaration || value.kind === SyntaxKind.BoltTraitDeclaration || value.kind === SyntaxKind.BoltVariableDeclaration || value.kind === SyntaxKind.BoltFunctionDeclaration || value.kind === SyntaxKind.BoltLoopStatement || value.kind === SyntaxKind.BoltExpressionStatement || value.kind === SyntaxKind.BoltResumeStatement || value.kind === SyntaxKind.BoltConditionalStatement || value.kind === SyntaxKind.BoltReturnStatement; }

export function isBoltMacroCall(value: any): value is BoltMacroCall { return value.kind === SyntaxKind.BoltMacroCall; }

export function isJSSyntax(value: any): value is JSSyntax { return value.kind === SyntaxKind.JSSourceFile || value.kind === SyntaxKind.JSImportAsBinding || value.kind === SyntaxKind.JSImportStarBinding || value.kind === SyntaxKind.JSLetDeclaration || value.kind === SyntaxKind.JSArrowFunctionDeclaration || value.kind === SyntaxKind.JSFunctionDeclaration || value.kind === SyntaxKind.JSImportDeclaration || value.kind === SyntaxKind.JSParameter || value.kind === SyntaxKind.JSConditionalCase || value.kind === SyntaxKind.JSCatchBlock || value.kind === SyntaxKind.JSReturnStatement || value.kind === SyntaxKind.JSConditionalStatement || value.kind === SyntaxKind.JSExpressionStatement || value.kind === SyntaxKind.JSTryCatchStatement || value.kind === SyntaxKind.JSReferenceExpression || value.kind === SyntaxKind.JSLiteralExpression || value.kind === SyntaxKind.JSConditionalExpression || value.kind === SyntaxKind.JSSequenceExpression || value.kind === SyntaxKind.JSNewExpression || value.kind === SyntaxKind.JSUnaryExpression || value.kind === SyntaxKind.JSBinaryExpression || value.kind === SyntaxKind.JSCallExpression || value.kind === SyntaxKind.JSMemberExpression || value.kind === SyntaxKind.JSConstantExpression || value.kind === SyntaxKind.JSBindPattern || value.kind === SyntaxKind.JSNotOp || value.kind === SyntaxKind.JSBNotOp || value.kind === SyntaxKind.JSBAndOp || value.kind === SyntaxKind.JSBXorOp || value.kind === SyntaxKind.JSBOrOp || value.kind === SyntaxKind.JSGtOp || value.kind === SyntaxKind.JSLtOp || value.kind === SyntaxKind.JSSubOp || value.kind === SyntaxKind.JSDivOp || value.kind === SyntaxKind.JSAddOp || value.kind === SyntaxKind.JSMulOp || value.kind === SyntaxKind.JSDotDotDot || value.kind === SyntaxKind.JSDot || value.kind === SyntaxKind.JSComma || value.kind === SyntaxKind.JSSemi || value.kind === SyntaxKind.JSOpenParen || value.kind === SyntaxKind.JSOpenBracket || value.kind === SyntaxKind.JSOpenBrace || value.kind === SyntaxKind.JSCloseParen || value.kind === SyntaxKind.JSCloseBracket || value.kind === SyntaxKind.JSCloseBrace || value.kind === SyntaxKind.JSOperator || value.kind === SyntaxKind.JSForKeyword || value.kind === SyntaxKind.JSWhileKeyword || value.kind === SyntaxKind.JSFunctionKeyword || value.kind === SyntaxKind.JSExportKeyword || value.kind === SyntaxKind.JSLetKeyword || value.kind === SyntaxKind.JSConstKeyword || value.kind === SyntaxKind.JSAsKeyword || value.kind === SyntaxKind.JSImportKeyword || value.kind === SyntaxKind.JSCatchKeyword || value.kind === SyntaxKind.JSFinallyKeyword || value.kind === SyntaxKind.JSTryKeyword || value.kind === SyntaxKind.JSReturnKeyword || value.kind === SyntaxKind.JSFromKeyword || value.kind === SyntaxKind.JSInteger || value.kind === SyntaxKind.JSString || value.kind === SyntaxKind.JSIdentifier || value.kind === SyntaxKind.EndOfFile; }

export function isJSToken(value: any): value is JSToken { return value.kind === SyntaxKind.JSNotOp || value.kind === SyntaxKind.JSBNotOp || value.kind === SyntaxKind.JSBAndOp || value.kind === SyntaxKind.JSBXorOp || value.kind === SyntaxKind.JSBOrOp || value.kind === SyntaxKind.JSGtOp || value.kind === SyntaxKind.JSLtOp || value.kind === SyntaxKind.JSSubOp || value.kind === SyntaxKind.JSDivOp || value.kind === SyntaxKind.JSAddOp || value.kind === SyntaxKind.JSMulOp || value.kind === SyntaxKind.JSDotDotDot || value.kind === SyntaxKind.JSDot || value.kind === SyntaxKind.JSComma || value.kind === SyntaxKind.JSSemi || value.kind === SyntaxKind.JSOpenParen || value.kind === SyntaxKind.JSOpenBracket || value.kind === SyntaxKind.JSOpenBrace || value.kind === SyntaxKind.JSCloseParen || value.kind === SyntaxKind.JSCloseBracket || value.kind === SyntaxKind.JSCloseBrace || value.kind === SyntaxKind.JSOperator || value.kind === SyntaxKind.JSForKeyword || value.kind === SyntaxKind.JSWhileKeyword || value.kind === SyntaxKind.JSFunctionKeyword || value.kind === SyntaxKind.JSExportKeyword || value.kind === SyntaxKind.JSLetKeyword || value.kind === SyntaxKind.JSConstKeyword || value.kind === SyntaxKind.JSAsKeyword || value.kind === SyntaxKind.JSImportKeyword || value.kind === SyntaxKind.JSCatchKeyword || value.kind === SyntaxKind.JSFinallyKeyword || value.kind === SyntaxKind.JSTryKeyword || value.kind === SyntaxKind.JSReturnKeyword || value.kind === SyntaxKind.JSFromKeyword || value.kind === SyntaxKind.JSInteger || value.kind === SyntaxKind.JSString || value.kind === SyntaxKind.JSIdentifier || value.kind === SyntaxKind.EndOfFile; }

export function isJSIdentifier(value: any): value is JSIdentifier { return value.kind === SyntaxKind.JSIdentifier; }

export function isJSString(value: any): value is JSString { return value.kind === SyntaxKind.JSString; }

export function isJSInteger(value: any): value is JSInteger { return value.kind === SyntaxKind.JSInteger; }

export function isJSFromKeyword(value: any): value is JSFromKeyword { return value.kind === SyntaxKind.JSFromKeyword; }

export function isJSReturnKeyword(value: any): value is JSReturnKeyword { return value.kind === SyntaxKind.JSReturnKeyword; }

export function isJSTryKeyword(value: any): value is JSTryKeyword { return value.kind === SyntaxKind.JSTryKeyword; }

export function isJSFinallyKeyword(value: any): value is JSFinallyKeyword { return value.kind === SyntaxKind.JSFinallyKeyword; }

export function isJSCatchKeyword(value: any): value is JSCatchKeyword { return value.kind === SyntaxKind.JSCatchKeyword; }

export function isJSImportKeyword(value: any): value is JSImportKeyword { return value.kind === SyntaxKind.JSImportKeyword; }

export function isJSAsKeyword(value: any): value is JSAsKeyword { return value.kind === SyntaxKind.JSAsKeyword; }

export function isJSConstKeyword(value: any): value is JSConstKeyword { return value.kind === SyntaxKind.JSConstKeyword; }

export function isJSLetKeyword(value: any): value is JSLetKeyword { return value.kind === SyntaxKind.JSLetKeyword; }

export function isJSExportKeyword(value: any): value is JSExportKeyword { return value.kind === SyntaxKind.JSExportKeyword; }

export function isJSFunctionKeyword(value: any): value is JSFunctionKeyword { return value.kind === SyntaxKind.JSFunctionKeyword; }

export function isJSWhileKeyword(value: any): value is JSWhileKeyword { return value.kind === SyntaxKind.JSWhileKeyword; }

export function isJSForKeyword(value: any): value is JSForKeyword { return value.kind === SyntaxKind.JSForKeyword; }

export function isJSOperatorLike(value: any): value is JSOperatorLike { return value.kind === SyntaxKind.JSNotOp || value.kind === SyntaxKind.JSBNotOp || value.kind === SyntaxKind.JSBAndOp || value.kind === SyntaxKind.JSBXorOp || value.kind === SyntaxKind.JSBOrOp || value.kind === SyntaxKind.JSGtOp || value.kind === SyntaxKind.JSLtOp || value.kind === SyntaxKind.JSSubOp || value.kind === SyntaxKind.JSDivOp || value.kind === SyntaxKind.JSAddOp || value.kind === SyntaxKind.JSMulOp; }

export function isJSOperator(value: any): value is JSOperator { return value.kind === SyntaxKind.JSOperator; }

export function isJSCloseBrace(value: any): value is JSCloseBrace { return value.kind === SyntaxKind.JSCloseBrace; }

export function isJSCloseBracket(value: any): value is JSCloseBracket { return value.kind === SyntaxKind.JSCloseBracket; }

export function isJSCloseParen(value: any): value is JSCloseParen { return value.kind === SyntaxKind.JSCloseParen; }

export function isJSOpenBrace(value: any): value is JSOpenBrace { return value.kind === SyntaxKind.JSOpenBrace; }

export function isJSOpenBracket(value: any): value is JSOpenBracket { return value.kind === SyntaxKind.JSOpenBracket; }

export function isJSOpenParen(value: any): value is JSOpenParen { return value.kind === SyntaxKind.JSOpenParen; }

export function isJSSemi(value: any): value is JSSemi { return value.kind === SyntaxKind.JSSemi; }

export function isJSComma(value: any): value is JSComma { return value.kind === SyntaxKind.JSComma; }

export function isJSDot(value: any): value is JSDot { return value.kind === SyntaxKind.JSDot; }

export function isJSDotDotDot(value: any): value is JSDotDotDot { return value.kind === SyntaxKind.JSDotDotDot; }

export function isJSMulOp(value: any): value is JSMulOp { return value.kind === SyntaxKind.JSMulOp; }

export function isJSAddOp(value: any): value is JSAddOp { return value.kind === SyntaxKind.JSAddOp; }

export function isJSDivOp(value: any): value is JSDivOp { return value.kind === SyntaxKind.JSDivOp; }

export function isJSSubOp(value: any): value is JSSubOp { return value.kind === SyntaxKind.JSSubOp; }

export function isJSLtOp(value: any): value is JSLtOp { return value.kind === SyntaxKind.JSLtOp; }

export function isJSGtOp(value: any): value is JSGtOp { return value.kind === SyntaxKind.JSGtOp; }

export function isJSBOrOp(value: any): value is JSBOrOp { return value.kind === SyntaxKind.JSBOrOp; }

export function isJSBXorOp(value: any): value is JSBXorOp { return value.kind === SyntaxKind.JSBXorOp; }

export function isJSBAndOp(value: any): value is JSBAndOp { return value.kind === SyntaxKind.JSBAndOp; }

export function isJSBNotOp(value: any): value is JSBNotOp { return value.kind === SyntaxKind.JSBNotOp; }

export function isJSNotOp(value: any): value is JSNotOp { return value.kind === SyntaxKind.JSNotOp; }

export function isJSPattern(value: any): value is JSPattern { return value.kind === SyntaxKind.JSBindPattern; }

export function isJSBindPattern(value: any): value is JSBindPattern { return value.kind === SyntaxKind.JSBindPattern; }

export function isJSExpression(value: any): value is JSExpression { return value.kind === SyntaxKind.JSReferenceExpression || value.kind === SyntaxKind.JSLiteralExpression || value.kind === SyntaxKind.JSConditionalExpression || value.kind === SyntaxKind.JSSequenceExpression || value.kind === SyntaxKind.JSNewExpression || value.kind === SyntaxKind.JSUnaryExpression || value.kind === SyntaxKind.JSBinaryExpression || value.kind === SyntaxKind.JSCallExpression || value.kind === SyntaxKind.JSMemberExpression || value.kind === SyntaxKind.JSConstantExpression; }

export function isJSConstantExpression(value: any): value is JSConstantExpression { return value.kind === SyntaxKind.JSConstantExpression; }

export function isJSMemberExpression(value: any): value is JSMemberExpression { return value.kind === SyntaxKind.JSMemberExpression; }

export function isJSCallExpression(value: any): value is JSCallExpression { return value.kind === SyntaxKind.JSCallExpression; }

export function isJSBinaryExpression(value: any): value is JSBinaryExpression { return value.kind === SyntaxKind.JSBinaryExpression; }

export function isJSUnaryExpression(value: any): value is JSUnaryExpression { return value.kind === SyntaxKind.JSUnaryExpression; }

export function isJSNewExpression(value: any): value is JSNewExpression { return value.kind === SyntaxKind.JSNewExpression; }

export function isJSSequenceExpression(value: any): value is JSSequenceExpression { return value.kind === SyntaxKind.JSSequenceExpression; }

export function isJSConditionalExpression(value: any): value is JSConditionalExpression { return value.kind === SyntaxKind.JSConditionalExpression; }

export function isJSLiteralExpression(value: any): value is JSLiteralExpression { return value.kind === SyntaxKind.JSLiteralExpression; }

export function isJSReferenceExpression(value: any): value is JSReferenceExpression { return value.kind === SyntaxKind.JSReferenceExpression; }

export function isJSSourceElement(value: any): value is JSSourceElement { return value.kind === SyntaxKind.JSLetDeclaration || value.kind === SyntaxKind.JSArrowFunctionDeclaration || value.kind === SyntaxKind.JSFunctionDeclaration || value.kind === SyntaxKind.JSImportDeclaration || value.kind === SyntaxKind.JSReturnStatement || value.kind === SyntaxKind.JSConditionalStatement || value.kind === SyntaxKind.JSExpressionStatement || value.kind === SyntaxKind.JSTryCatchStatement; }

export function isJSFunctionBodyElement(value: any): value is JSFunctionBodyElement { return value.kind === SyntaxKind.JSLetDeclaration || value.kind === SyntaxKind.JSArrowFunctionDeclaration || value.kind === SyntaxKind.JSFunctionDeclaration || value.kind === SyntaxKind.JSImportDeclaration || value.kind === SyntaxKind.JSReturnStatement || value.kind === SyntaxKind.JSConditionalStatement || value.kind === SyntaxKind.JSExpressionStatement || value.kind === SyntaxKind.JSTryCatchStatement; }

export function isJSStatement(value: any): value is JSStatement { return value.kind === SyntaxKind.JSReturnStatement || value.kind === SyntaxKind.JSConditionalStatement || value.kind === SyntaxKind.JSExpressionStatement || value.kind === SyntaxKind.JSTryCatchStatement; }

export function isJSCatchBlock(value: any): value is JSCatchBlock { return value.kind === SyntaxKind.JSCatchBlock; }

export function isJSTryCatchStatement(value: any): value is JSTryCatchStatement { return value.kind === SyntaxKind.JSTryCatchStatement; }

export function isJSExpressionStatement(value: any): value is JSExpressionStatement { return value.kind === SyntaxKind.JSExpressionStatement; }

export function isJSConditionalCase(value: any): value is JSConditionalCase { return value.kind === SyntaxKind.JSConditionalCase; }

export function isJSConditionalStatement(value: any): value is JSConditionalStatement { return value.kind === SyntaxKind.JSConditionalStatement; }

export function isJSReturnStatement(value: any): value is JSReturnStatement { return value.kind === SyntaxKind.JSReturnStatement; }

export function isJSParameter(value: any): value is JSParameter { return value.kind === SyntaxKind.JSParameter; }

export function isJSDeclaration(value: any): value is JSDeclaration { return value.kind === SyntaxKind.JSLetDeclaration || value.kind === SyntaxKind.JSArrowFunctionDeclaration || value.kind === SyntaxKind.JSFunctionDeclaration || value.kind === SyntaxKind.JSImportDeclaration; }

export function isJSImportBinding(value: any): value is JSImportBinding { return value.kind === SyntaxKind.JSImportAsBinding || value.kind === SyntaxKind.JSImportStarBinding; }

export function isJSImportStarBinding(value: any): value is JSImportStarBinding { return value.kind === SyntaxKind.JSImportStarBinding; }

export function isJSImportAsBinding(value: any): value is JSImportAsBinding { return value.kind === SyntaxKind.JSImportAsBinding; }

export function isJSImportDeclaration(value: any): value is JSImportDeclaration { return value.kind === SyntaxKind.JSImportDeclaration; }

export function isJSFunctionDeclaration(value: any): value is JSFunctionDeclaration { return value.kind === SyntaxKind.JSFunctionDeclaration; }

export function isJSArrowFunctionDeclaration(value: any): value is JSArrowFunctionDeclaration { return value.kind === SyntaxKind.JSArrowFunctionDeclaration; }

export function isJSLetDeclaration(value: any): value is JSLetDeclaration { return value.kind === SyntaxKind.JSLetDeclaration; }

export function isJSSourceFile(value: any): value is JSSourceFile { return value.kind === SyntaxKind.JSSourceFile; }

export function isSyntax(value: any): value is Syntax { return typeof value === "object" && value !== null && value instanceof SyntaxBase; }

export class Visitor {
    visit(node: Syntax): void { switch (node.kind) {
        case SyntaxKind.EndOfFile:
            this.visitEndOfFile((node as EndOfFile));
            break;
        case SyntaxKind.BoltStringLiteral:
            this.visitBoltStringLiteral((node as BoltStringLiteral));
            break;
        case SyntaxKind.BoltIntegerLiteral:
            this.visitBoltIntegerLiteral((node as BoltIntegerLiteral));
            break;
        case SyntaxKind.BoltIdentifier:
            this.visitBoltIdentifier((node as BoltIdentifier));
            break;
        case SyntaxKind.BoltOperator:
            this.visitBoltOperator((node as BoltOperator));
            break;
        case SyntaxKind.BoltAssignment:
            this.visitBoltAssignment((node as BoltAssignment));
            break;
        case SyntaxKind.BoltComma:
            this.visitBoltComma((node as BoltComma));
            break;
        case SyntaxKind.BoltSemi:
            this.visitBoltSemi((node as BoltSemi));
            break;
        case SyntaxKind.BoltColon:
            this.visitBoltColon((node as BoltColon));
            break;
        case SyntaxKind.BoltColonColon:
            this.visitBoltColonColon((node as BoltColonColon));
            break;
        case SyntaxKind.BoltDot:
            this.visitBoltDot((node as BoltDot));
            break;
        case SyntaxKind.BoltDotDot:
            this.visitBoltDotDot((node as BoltDotDot));
            break;
        case SyntaxKind.BoltRArrow:
            this.visitBoltRArrow((node as BoltRArrow));
            break;
        case SyntaxKind.BoltRArrowAlt:
            this.visitBoltRArrowAlt((node as BoltRArrowAlt));
            break;
        case SyntaxKind.BoltLArrow:
            this.visitBoltLArrow((node as BoltLArrow));
            break;
        case SyntaxKind.BoltEqSign:
            this.visitBoltEqSign((node as BoltEqSign));
            break;
        case SyntaxKind.BoltGtSign:
            this.visitBoltGtSign((node as BoltGtSign));
            break;
        case SyntaxKind.BoltExMark:
            this.visitBoltExMark((node as BoltExMark));
            break;
        case SyntaxKind.BoltLtSign:
            this.visitBoltLtSign((node as BoltLtSign));
            break;
        case SyntaxKind.BoltVBar:
            this.visitBoltVBar((node as BoltVBar));
            break;
        case SyntaxKind.BoltWhereKeyword:
            this.visitBoltWhereKeyword((node as BoltWhereKeyword));
            break;
        case SyntaxKind.BoltQuoteKeyword:
            this.visitBoltQuoteKeyword((node as BoltQuoteKeyword));
            break;
        case SyntaxKind.BoltFnKeyword:
            this.visitBoltFnKeyword((node as BoltFnKeyword));
            break;
        case SyntaxKind.BoltForeignKeyword:
            this.visitBoltForeignKeyword((node as BoltForeignKeyword));
            break;
        case SyntaxKind.BoltForKeyword:
            this.visitBoltForKeyword((node as BoltForKeyword));
            break;
        case SyntaxKind.BoltLetKeyword:
            this.visitBoltLetKeyword((node as BoltLetKeyword));
            break;
        case SyntaxKind.BoltReturnKeyword:
            this.visitBoltReturnKeyword((node as BoltReturnKeyword));
            break;
        case SyntaxKind.BoltLoopKeyword:
            this.visitBoltLoopKeyword((node as BoltLoopKeyword));
            break;
        case SyntaxKind.BoltYieldKeyword:
            this.visitBoltYieldKeyword((node as BoltYieldKeyword));
            break;
        case SyntaxKind.BoltMatchKeyword:
            this.visitBoltMatchKeyword((node as BoltMatchKeyword));
            break;
        case SyntaxKind.BoltImportKeyword:
            this.visitBoltImportKeyword((node as BoltImportKeyword));
            break;
        case SyntaxKind.BoltExportKeyword:
            this.visitBoltExportKeyword((node as BoltExportKeyword));
            break;
        case SyntaxKind.BoltPubKeyword:
            this.visitBoltPubKeyword((node as BoltPubKeyword));
            break;
        case SyntaxKind.BoltModKeyword:
            this.visitBoltModKeyword((node as BoltModKeyword));
            break;
        case SyntaxKind.BoltMutKeyword:
            this.visitBoltMutKeyword((node as BoltMutKeyword));
            break;
        case SyntaxKind.BoltEnumKeyword:
            this.visitBoltEnumKeyword((node as BoltEnumKeyword));
            break;
        case SyntaxKind.BoltStructKeyword:
            this.visitBoltStructKeyword((node as BoltStructKeyword));
            break;
        case SyntaxKind.BoltTypeKeyword:
            this.visitBoltTypeKeyword((node as BoltTypeKeyword));
            break;
        case SyntaxKind.BoltTraitKeyword:
            this.visitBoltTraitKeyword((node as BoltTraitKeyword));
            break;
        case SyntaxKind.BoltImplKeyword:
            this.visitBoltImplKeyword((node as BoltImplKeyword));
            break;
        case SyntaxKind.BoltParenthesized:
            this.visitBoltParenthesized((node as BoltParenthesized));
            break;
        case SyntaxKind.BoltBraced:
            this.visitBoltBraced((node as BoltBraced));
            break;
        case SyntaxKind.BoltBracketed:
            this.visitBoltBracketed((node as BoltBracketed));
            break;
        case SyntaxKind.BoltSourceFile:
            this.visitBoltSourceFile((node as BoltSourceFile));
            break;
        case SyntaxKind.BoltQualName:
            this.visitBoltQualName((node as BoltQualName));
            break;
        case SyntaxKind.BoltTypeOfExpression:
            this.visitBoltTypeOfExpression((node as BoltTypeOfExpression));
            break;
        case SyntaxKind.BoltReferenceTypeExpression:
            this.visitBoltReferenceTypeExpression((node as BoltReferenceTypeExpression));
            break;
        case SyntaxKind.BoltFunctionTypeExpression:
            this.visitBoltFunctionTypeExpression((node as BoltFunctionTypeExpression));
            break;
        case SyntaxKind.BoltLiftedTypeExpression:
            this.visitBoltLiftedTypeExpression((node as BoltLiftedTypeExpression));
            break;
        case SyntaxKind.BoltTypeParameter:
            this.visitBoltTypeParameter((node as BoltTypeParameter));
            break;
        case SyntaxKind.BoltBindPattern:
            this.visitBoltBindPattern((node as BoltBindPattern));
            break;
        case SyntaxKind.BoltTypePattern:
            this.visitBoltTypePattern((node as BoltTypePattern));
            break;
        case SyntaxKind.BoltExpressionPattern:
            this.visitBoltExpressionPattern((node as BoltExpressionPattern));
            break;
        case SyntaxKind.BoltTuplePatternElement:
            this.visitBoltTuplePatternElement((node as BoltTuplePatternElement));
            break;
        case SyntaxKind.BoltTuplePattern:
            this.visitBoltTuplePattern((node as BoltTuplePattern));
            break;
        case SyntaxKind.BoltRecordFieldPattern:
            this.visitBoltRecordFieldPattern((node as BoltRecordFieldPattern));
            break;
        case SyntaxKind.BoltRecordPattern:
            this.visitBoltRecordPattern((node as BoltRecordPattern));
            break;
        case SyntaxKind.BoltQuoteExpression:
            this.visitBoltQuoteExpression((node as BoltQuoteExpression));
            break;
        case SyntaxKind.BoltTupleExpression:
            this.visitBoltTupleExpression((node as BoltTupleExpression));
            break;
        case SyntaxKind.BoltReferenceExpression:
            this.visitBoltReferenceExpression((node as BoltReferenceExpression));
            break;
        case SyntaxKind.BoltMemberExpression:
            this.visitBoltMemberExpression((node as BoltMemberExpression));
            break;
        case SyntaxKind.BoltFunctionExpression:
            this.visitBoltFunctionExpression((node as BoltFunctionExpression));
            break;
        case SyntaxKind.BoltCallExpression:
            this.visitBoltCallExpression((node as BoltCallExpression));
            break;
        case SyntaxKind.BoltYieldExpression:
            this.visitBoltYieldExpression((node as BoltYieldExpression));
            break;
        case SyntaxKind.BoltMatchArm:
            this.visitBoltMatchArm((node as BoltMatchArm));
            break;
        case SyntaxKind.BoltMatchExpression:
            this.visitBoltMatchExpression((node as BoltMatchExpression));
            break;
        case SyntaxKind.BoltCase:
            this.visitBoltCase((node as BoltCase));
            break;
        case SyntaxKind.BoltCaseExpression:
            this.visitBoltCaseExpression((node as BoltCaseExpression));
            break;
        case SyntaxKind.BoltBlockExpression:
            this.visitBoltBlockExpression((node as BoltBlockExpression));
            break;
        case SyntaxKind.BoltConstantExpression:
            this.visitBoltConstantExpression((node as BoltConstantExpression));
            break;
        case SyntaxKind.BoltReturnStatement:
            this.visitBoltReturnStatement((node as BoltReturnStatement));
            break;
        case SyntaxKind.BoltConditionalCase:
            this.visitBoltConditionalCase((node as BoltConditionalCase));
            break;
        case SyntaxKind.BoltConditionalStatement:
            this.visitBoltConditionalStatement((node as BoltConditionalStatement));
            break;
        case SyntaxKind.BoltResumeStatement:
            this.visitBoltResumeStatement((node as BoltResumeStatement));
            break;
        case SyntaxKind.BoltExpressionStatement:
            this.visitBoltExpressionStatement((node as BoltExpressionStatement));
            break;
        case SyntaxKind.BoltLoopStatement:
            this.visitBoltLoopStatement((node as BoltLoopStatement));
            break;
        case SyntaxKind.BoltParameter:
            this.visitBoltParameter((node as BoltParameter));
            break;
        case SyntaxKind.BoltModule:
            this.visitBoltModule((node as BoltModule));
            break;
        case SyntaxKind.BoltFunctionDeclaration:
            this.visitBoltFunctionDeclaration((node as BoltFunctionDeclaration));
            break;
        case SyntaxKind.BoltVariableDeclaration:
            this.visitBoltVariableDeclaration((node as BoltVariableDeclaration));
            break;
        case SyntaxKind.BoltPlainImportSymbol:
            this.visitBoltPlainImportSymbol((node as BoltPlainImportSymbol));
            break;
        case SyntaxKind.BoltImportDirective:
            this.visitBoltImportDirective((node as BoltImportDirective));
            break;
        case SyntaxKind.BoltPlainExportSymbol:
            this.visitBoltPlainExportSymbol((node as BoltPlainExportSymbol));
            break;
        case SyntaxKind.BoltExportDirective:
            this.visitBoltExportDirective((node as BoltExportDirective));
            break;
        case SyntaxKind.BoltTraitDeclaration:
            this.visitBoltTraitDeclaration((node as BoltTraitDeclaration));
            break;
        case SyntaxKind.BoltImplDeclaration:
            this.visitBoltImplDeclaration((node as BoltImplDeclaration));
            break;
        case SyntaxKind.BoltTypeAliasDeclaration:
            this.visitBoltTypeAliasDeclaration((node as BoltTypeAliasDeclaration));
            break;
        case SyntaxKind.BoltRecordField:
            this.visitBoltRecordField((node as BoltRecordField));
            break;
        case SyntaxKind.BoltRecordDeclaration:
            this.visitBoltRecordDeclaration((node as BoltRecordDeclaration));
            break;
        case SyntaxKind.BoltMacroCall:
            this.visitBoltMacroCall((node as BoltMacroCall));
            break;
        case SyntaxKind.JSIdentifier:
            this.visitJSIdentifier((node as JSIdentifier));
            break;
        case SyntaxKind.JSString:
            this.visitJSString((node as JSString));
            break;
        case SyntaxKind.JSInteger:
            this.visitJSInteger((node as JSInteger));
            break;
        case SyntaxKind.JSFromKeyword:
            this.visitJSFromKeyword((node as JSFromKeyword));
            break;
        case SyntaxKind.JSReturnKeyword:
            this.visitJSReturnKeyword((node as JSReturnKeyword));
            break;
        case SyntaxKind.JSTryKeyword:
            this.visitJSTryKeyword((node as JSTryKeyword));
            break;
        case SyntaxKind.JSFinallyKeyword:
            this.visitJSFinallyKeyword((node as JSFinallyKeyword));
            break;
        case SyntaxKind.JSCatchKeyword:
            this.visitJSCatchKeyword((node as JSCatchKeyword));
            break;
        case SyntaxKind.JSImportKeyword:
            this.visitJSImportKeyword((node as JSImportKeyword));
            break;
        case SyntaxKind.JSAsKeyword:
            this.visitJSAsKeyword((node as JSAsKeyword));
            break;
        case SyntaxKind.JSConstKeyword:
            this.visitJSConstKeyword((node as JSConstKeyword));
            break;
        case SyntaxKind.JSLetKeyword:
            this.visitJSLetKeyword((node as JSLetKeyword));
            break;
        case SyntaxKind.JSExportKeyword:
            this.visitJSExportKeyword((node as JSExportKeyword));
            break;
        case SyntaxKind.JSFunctionKeyword:
            this.visitJSFunctionKeyword((node as JSFunctionKeyword));
            break;
        case SyntaxKind.JSWhileKeyword:
            this.visitJSWhileKeyword((node as JSWhileKeyword));
            break;
        case SyntaxKind.JSForKeyword:
            this.visitJSForKeyword((node as JSForKeyword));
            break;
        case SyntaxKind.JSOperator:
            this.visitJSOperator((node as JSOperator));
            break;
        case SyntaxKind.JSCloseBrace:
            this.visitJSCloseBrace((node as JSCloseBrace));
            break;
        case SyntaxKind.JSCloseBracket:
            this.visitJSCloseBracket((node as JSCloseBracket));
            break;
        case SyntaxKind.JSCloseParen:
            this.visitJSCloseParen((node as JSCloseParen));
            break;
        case SyntaxKind.JSOpenBrace:
            this.visitJSOpenBrace((node as JSOpenBrace));
            break;
        case SyntaxKind.JSOpenBracket:
            this.visitJSOpenBracket((node as JSOpenBracket));
            break;
        case SyntaxKind.JSOpenParen:
            this.visitJSOpenParen((node as JSOpenParen));
            break;
        case SyntaxKind.JSSemi:
            this.visitJSSemi((node as JSSemi));
            break;
        case SyntaxKind.JSComma:
            this.visitJSComma((node as JSComma));
            break;
        case SyntaxKind.JSDot:
            this.visitJSDot((node as JSDot));
            break;
        case SyntaxKind.JSDotDotDot:
            this.visitJSDotDotDot((node as JSDotDotDot));
            break;
        case SyntaxKind.JSMulOp:
            this.visitJSMulOp((node as JSMulOp));
            break;
        case SyntaxKind.JSAddOp:
            this.visitJSAddOp((node as JSAddOp));
            break;
        case SyntaxKind.JSDivOp:
            this.visitJSDivOp((node as JSDivOp));
            break;
        case SyntaxKind.JSSubOp:
            this.visitJSSubOp((node as JSSubOp));
            break;
        case SyntaxKind.JSLtOp:
            this.visitJSLtOp((node as JSLtOp));
            break;
        case SyntaxKind.JSGtOp:
            this.visitJSGtOp((node as JSGtOp));
            break;
        case SyntaxKind.JSBOrOp:
            this.visitJSBOrOp((node as JSBOrOp));
            break;
        case SyntaxKind.JSBXorOp:
            this.visitJSBXorOp((node as JSBXorOp));
            break;
        case SyntaxKind.JSBAndOp:
            this.visitJSBAndOp((node as JSBAndOp));
            break;
        case SyntaxKind.JSBNotOp:
            this.visitJSBNotOp((node as JSBNotOp));
            break;
        case SyntaxKind.JSNotOp:
            this.visitJSNotOp((node as JSNotOp));
            break;
        case SyntaxKind.JSBindPattern:
            this.visitJSBindPattern((node as JSBindPattern));
            break;
        case SyntaxKind.JSConstantExpression:
            this.visitJSConstantExpression((node as JSConstantExpression));
            break;
        case SyntaxKind.JSMemberExpression:
            this.visitJSMemberExpression((node as JSMemberExpression));
            break;
        case SyntaxKind.JSCallExpression:
            this.visitJSCallExpression((node as JSCallExpression));
            break;
        case SyntaxKind.JSBinaryExpression:
            this.visitJSBinaryExpression((node as JSBinaryExpression));
            break;
        case SyntaxKind.JSUnaryExpression:
            this.visitJSUnaryExpression((node as JSUnaryExpression));
            break;
        case SyntaxKind.JSNewExpression:
            this.visitJSNewExpression((node as JSNewExpression));
            break;
        case SyntaxKind.JSSequenceExpression:
            this.visitJSSequenceExpression((node as JSSequenceExpression));
            break;
        case SyntaxKind.JSConditionalExpression:
            this.visitJSConditionalExpression((node as JSConditionalExpression));
            break;
        case SyntaxKind.JSLiteralExpression:
            this.visitJSLiteralExpression((node as JSLiteralExpression));
            break;
        case SyntaxKind.JSReferenceExpression:
            this.visitJSReferenceExpression((node as JSReferenceExpression));
            break;
        case SyntaxKind.JSCatchBlock:
            this.visitJSCatchBlock((node as JSCatchBlock));
            break;
        case SyntaxKind.JSTryCatchStatement:
            this.visitJSTryCatchStatement((node as JSTryCatchStatement));
            break;
        case SyntaxKind.JSExpressionStatement:
            this.visitJSExpressionStatement((node as JSExpressionStatement));
            break;
        case SyntaxKind.JSConditionalCase:
            this.visitJSConditionalCase((node as JSConditionalCase));
            break;
        case SyntaxKind.JSConditionalStatement:
            this.visitJSConditionalStatement((node as JSConditionalStatement));
            break;
        case SyntaxKind.JSReturnStatement:
            this.visitJSReturnStatement((node as JSReturnStatement));
            break;
        case SyntaxKind.JSParameter:
            this.visitJSParameter((node as JSParameter));
            break;
        case SyntaxKind.JSImportStarBinding:
            this.visitJSImportStarBinding((node as JSImportStarBinding));
            break;
        case SyntaxKind.JSImportAsBinding:
            this.visitJSImportAsBinding((node as JSImportAsBinding));
            break;
        case SyntaxKind.JSImportDeclaration:
            this.visitJSImportDeclaration((node as JSImportDeclaration));
            break;
        case SyntaxKind.JSFunctionDeclaration:
            this.visitJSFunctionDeclaration((node as JSFunctionDeclaration));
            break;
        case SyntaxKind.JSArrowFunctionDeclaration:
            this.visitJSArrowFunctionDeclaration((node as JSArrowFunctionDeclaration));
            break;
        case SyntaxKind.JSLetDeclaration:
            this.visitJSLetDeclaration((node as JSLetDeclaration));
            break;
        case SyntaxKind.JSSourceFile:
            this.visitJSSourceFile((node as JSSourceFile));
            break;
    } }
    protected visitSyntax(node: Syntax): void { }
    protected visitEndOfFile(node: EndOfFile): void { this.visitBoltToken(node); this.visitJSToken(node); }
    protected visitToken(node: Token): void { this.visitSyntax(node); }
    protected visitSourceFile(node: SourceFile): void { this.visitSyntax(node); }
    protected visitFunctionBodyElement(node: FunctionBodyElement): void { this.visitSyntax(node); }
    protected visitReturnStatement(node: ReturnStatement): void { this.visitSyntax(node); }
    protected visitBoltSyntax(node: BoltSyntax): void { this.visitSyntax(node); }
    protected visitBoltToken(node: BoltToken): void { this.visitToken(node); this.visitBoltSyntax(node); }
    protected visitBoltStringLiteral(node: BoltStringLiteral): void { this.visitBoltToken(node); }
    protected visitBoltIntegerLiteral(node: BoltIntegerLiteral): void { this.visitBoltToken(node); }
    protected visitBoltSymbol(node: BoltSymbol): void { this.visitBoltToken(node); }
    protected visitBoltIdentifier(node: BoltIdentifier): void { this.visitBoltSymbol(node); }
    protected visitBoltOperatorLike(node: BoltOperatorLike): void { this.visitBoltSymbol(node); }
    protected visitBoltOperator(node: BoltOperator): void { this.visitBoltSymbol(node); }
    protected visitBoltAssignment(node: BoltAssignment): void { this.visitBoltToken(node); }
    protected visitBoltComma(node: BoltComma): void { this.visitBoltToken(node); }
    protected visitBoltSemi(node: BoltSemi): void { this.visitBoltToken(node); }
    protected visitBoltColon(node: BoltColon): void { this.visitBoltToken(node); }
    protected visitBoltColonColon(node: BoltColonColon): void { this.visitBoltToken(node); }
    protected visitBoltDot(node: BoltDot): void { this.visitBoltToken(node); }
    protected visitBoltDotDot(node: BoltDotDot): void { this.visitBoltToken(node); }
    protected visitBoltRArrow(node: BoltRArrow): void { this.visitBoltToken(node); }
    protected visitBoltRArrowAlt(node: BoltRArrowAlt): void { this.visitBoltToken(node); }
    protected visitBoltLArrow(node: BoltLArrow): void { this.visitBoltToken(node); }
    protected visitBoltEqSign(node: BoltEqSign): void { this.visitBoltToken(node); }
    protected visitBoltGtSign(node: BoltGtSign): void { this.visitBoltToken(node); this.visitBoltOperatorLike(node); }
    protected visitBoltExMark(node: BoltExMark): void { this.visitBoltToken(node); this.visitBoltOperatorLike(node); }
    protected visitBoltLtSign(node: BoltLtSign): void { this.visitBoltToken(node); this.visitBoltOperatorLike(node); }
    protected visitBoltVBar(node: BoltVBar): void { this.visitBoltToken(node); this.visitBoltOperatorLike(node); }
    protected visitBoltKeyword(node: BoltKeyword): void { this.visitSyntax(node); }
    protected visitBoltWhereKeyword(node: BoltWhereKeyword): void { this.visitBoltToken(node); this.visitBoltKeyword(node); }
    protected visitBoltQuoteKeyword(node: BoltQuoteKeyword): void { this.visitBoltToken(node); this.visitBoltKeyword(node); }
    protected visitBoltFnKeyword(node: BoltFnKeyword): void { this.visitBoltToken(node); this.visitBoltKeyword(node); }
    protected visitBoltForeignKeyword(node: BoltForeignKeyword): void { this.visitBoltToken(node); this.visitBoltKeyword(node); }
    protected visitBoltForKeyword(node: BoltForKeyword): void { this.visitBoltToken(node); this.visitBoltKeyword(node); }
    protected visitBoltLetKeyword(node: BoltLetKeyword): void { this.visitBoltToken(node); this.visitBoltKeyword(node); }
    protected visitBoltReturnKeyword(node: BoltReturnKeyword): void { this.visitBoltToken(node); this.visitBoltKeyword(node); }
    protected visitBoltLoopKeyword(node: BoltLoopKeyword): void { this.visitBoltToken(node); this.visitBoltKeyword(node); }
    protected visitBoltYieldKeyword(node: BoltYieldKeyword): void { this.visitBoltToken(node); this.visitBoltKeyword(node); }
    protected visitBoltMatchKeyword(node: BoltMatchKeyword): void { this.visitBoltToken(node); this.visitBoltKeyword(node); }
    protected visitBoltImportKeyword(node: BoltImportKeyword): void { this.visitBoltToken(node); this.visitBoltKeyword(node); }
    protected visitBoltExportKeyword(node: BoltExportKeyword): void { this.visitBoltToken(node); this.visitBoltKeyword(node); }
    protected visitBoltPubKeyword(node: BoltPubKeyword): void { this.visitBoltToken(node); this.visitBoltKeyword(node); }
    protected visitBoltModKeyword(node: BoltModKeyword): void { this.visitBoltToken(node); this.visitBoltKeyword(node); }
    protected visitBoltMutKeyword(node: BoltMutKeyword): void { this.visitBoltToken(node); this.visitBoltKeyword(node); }
    protected visitBoltEnumKeyword(node: BoltEnumKeyword): void { this.visitBoltToken(node); this.visitBoltKeyword(node); }
    protected visitBoltStructKeyword(node: BoltStructKeyword): void { this.visitBoltToken(node); this.visitBoltKeyword(node); }
    protected visitBoltTypeKeyword(node: BoltTypeKeyword): void { this.visitBoltToken(node); this.visitBoltKeyword(node); }
    protected visitBoltTraitKeyword(node: BoltTraitKeyword): void { this.visitBoltToken(node); this.visitBoltKeyword(node); }
    protected visitBoltImplKeyword(node: BoltImplKeyword): void { this.visitBoltToken(node); this.visitBoltKeyword(node); }
    protected visitBoltPunctuated(node: BoltPunctuated): void { this.visitBoltToken(node); }
    protected visitBoltParenthesized(node: BoltParenthesized): void { this.visitBoltPunctuated(node); }
    protected visitBoltBraced(node: BoltBraced): void { this.visitBoltPunctuated(node); }
    protected visitBoltBracketed(node: BoltBracketed): void { this.visitBoltPunctuated(node); }
    protected visitBoltSourceFile(node: BoltSourceFile): void { this.visitBoltSyntax(node); this.visitSourceFile(node); }
    protected visitBoltQualName(node: BoltQualName): void { this.visitBoltSyntax(node); }
    protected visitBoltTypeExpression(node: BoltTypeExpression): void { this.visitBoltSyntax(node); }
    protected visitBoltTypeOfExpression(node: BoltTypeOfExpression): void { this.visitBoltTypeExpression(node); }
    protected visitBoltReferenceTypeExpression(node: BoltReferenceTypeExpression): void { this.visitBoltTypeExpression(node); }
    protected visitBoltFunctionTypeExpression(node: BoltFunctionTypeExpression): void { this.visitBoltTypeExpression(node); }
    protected visitBoltLiftedTypeExpression(node: BoltLiftedTypeExpression): void { this.visitBoltTypeExpression(node); }
    protected visitBoltTypeParameter(node: BoltTypeParameter): void { this.visitBoltSyntax(node); }
    protected visitBoltPattern(node: BoltPattern): void { this.visitBoltSyntax(node); }
    protected visitBoltBindPattern(node: BoltBindPattern): void { this.visitBoltPattern(node); }
    protected visitBoltTypePattern(node: BoltTypePattern): void { this.visitBoltPattern(node); }
    protected visitBoltExpressionPattern(node: BoltExpressionPattern): void { this.visitBoltPattern(node); }
    protected visitBoltTuplePatternElement(node: BoltTuplePatternElement): void { this.visitBoltSyntax(node); }
    protected visitBoltTuplePattern(node: BoltTuplePattern): void { this.visitBoltPattern(node); }
    protected visitBoltRecordFieldPattern(node: BoltRecordFieldPattern): void { this.visitBoltSyntax(node); }
    protected visitBoltRecordPattern(node: BoltRecordPattern): void { this.visitBoltPattern(node); }
    protected visitBoltExpression(node: BoltExpression): void { this.visitBoltSyntax(node); }
    protected visitBoltQuoteExpression(node: BoltQuoteExpression): void { this.visitBoltExpression(node); }
    protected visitBoltTupleExpression(node: BoltTupleExpression): void { this.visitBoltExpression(node); }
    protected visitBoltReferenceExpression(node: BoltReferenceExpression): void { this.visitBoltExpression(node); }
    protected visitBoltMemberExpression(node: BoltMemberExpression): void { this.visitBoltExpression(node); }
    protected visitBoltFunctionExpression(node: BoltFunctionExpression): void { this.visitBoltExpression(node); }
    protected visitBoltCallExpression(node: BoltCallExpression): void { this.visitBoltExpression(node); }
    protected visitBoltYieldExpression(node: BoltYieldExpression): void { this.visitBoltExpression(node); }
    protected visitBoltMatchArm(node: BoltMatchArm): void { this.visitBoltSyntax(node); }
    protected visitBoltMatchExpression(node: BoltMatchExpression): void { this.visitBoltExpression(node); }
    protected visitBoltCase(node: BoltCase): void { this.visitBoltSyntax(node); }
    protected visitBoltCaseExpression(node: BoltCaseExpression): void { this.visitBoltExpression(node); }
    protected visitBoltBlockExpression(node: BoltBlockExpression): void { this.visitBoltExpression(node); }
    protected visitBoltConstantExpression(node: BoltConstantExpression): void { this.visitBoltExpression(node); }
    protected visitBoltStatement(node: BoltStatement): void { this.visitBoltSyntax(node); this.visitBoltFunctionBodyElement(node); this.visitBoltSourceElement(node); }
    protected visitBoltReturnStatement(node: BoltReturnStatement): void { this.visitReturnStatement(node); this.visitBoltStatement(node); }
    protected visitBoltConditionalCase(node: BoltConditionalCase): void { this.visitBoltSyntax(node); }
    protected visitBoltConditionalStatement(node: BoltConditionalStatement): void { this.visitBoltStatement(node); }
    protected visitBoltResumeStatement(node: BoltResumeStatement): void { this.visitBoltStatement(node); }
    protected visitBoltExpressionStatement(node: BoltExpressionStatement): void { this.visitBoltStatement(node); }
    protected visitBoltLoopStatement(node: BoltLoopStatement): void { this.visitBoltStatement(node); }
    protected visitBoltParameter(node: BoltParameter): void { this.visitBoltSyntax(node); }
    protected visitBoltDeclaration(node: BoltDeclaration): void { this.visitBoltSyntax(node); this.visitBoltSourceElement(node); }
    protected visitBoltTypeDeclaration(node: BoltTypeDeclaration): void { this.visitBoltSyntax(node); this.visitBoltSourceElement(node); }
    protected visitBoltModule(node: BoltModule): void { this.visitBoltSyntax(node); this.visitBoltSourceElement(node); }
    protected visitBoltDeclarationLike(node: BoltDeclarationLike): void { this.visitSyntax(node); }
    protected visitBoltFunctionBodyElement(node: BoltFunctionBodyElement): void { this.visitFunctionBodyElement(node); }
    protected visitBoltFunctionDeclaration(node: BoltFunctionDeclaration): void { this.visitBoltFunctionBodyElement(node); this.visitBoltDeclaration(node); this.visitBoltDeclarationLike(node); this.visitBoltTraitOrImplElement(node); }
    protected visitBoltVariableDeclaration(node: BoltVariableDeclaration): void { this.visitBoltFunctionBodyElement(node); this.visitBoltDeclaration(node); this.visitBoltDeclarationLike(node); }
    protected visitBoltImportSymbol(node: BoltImportSymbol): void { this.visitBoltSyntax(node); }
    protected visitBoltPlainImportSymbol(node: BoltPlainImportSymbol): void { this.visitBoltImportSymbol(node); }
    protected visitBoltImportDirective(node: BoltImportDirective): void { this.visitBoltSyntax(node); this.visitBoltSourceElement(node); }
    protected visitBoltExportSymbol(node: BoltExportSymbol): void { this.visitBoltSyntax(node); }
    protected visitBoltPlainExportSymbol(node: BoltPlainExportSymbol): void { this.visitBoltExportSymbol(node); }
    protected visitBoltExportDirective(node: BoltExportDirective): void { this.visitBoltSourceElement(node); }
    protected visitBoltTraitOrImplElement(node: BoltTraitOrImplElement): void { this.visitSyntax(node); }
    protected visitBoltTraitDeclaration(node: BoltTraitDeclaration): void { this.visitBoltDeclarationLike(node); this.visitBoltTypeDeclaration(node); }
    protected visitBoltImplDeclaration(node: BoltImplDeclaration): void { this.visitBoltTypeDeclaration(node); this.visitBoltDeclarationLike(node); }
    protected visitBoltTypeAliasDeclaration(node: BoltTypeAliasDeclaration): void { this.visitBoltDeclarationLike(node); this.visitBoltTypeDeclaration(node); this.visitBoltTraitOrImplElement(node); }
    protected visitBoltRecordMember(node: BoltRecordMember): void { this.visitBoltSyntax(node); }
    protected visitBoltRecordField(node: BoltRecordField): void { this.visitBoltRecordMember(node); }
    protected visitBoltRecordDeclaration(node: BoltRecordDeclaration): void { this.visitBoltDeclaration(node); this.visitBoltTypeDeclaration(node); this.visitBoltDeclarationLike(node); }
    protected visitBoltSourceElement(node: BoltSourceElement): void { this.visitSyntax(node); }
    protected visitBoltMacroCall(node: BoltMacroCall): void { this.visitBoltRecordMember(node); this.visitBoltSourceElement(node); this.visitBoltTraitOrImplElement(node); this.visitBoltFunctionBodyElement(node); }
    protected visitJSSyntax(node: JSSyntax): void { this.visitSyntax(node); }
    protected visitJSToken(node: JSToken): void { this.visitJSSyntax(node); this.visitToken(node); }
    protected visitJSIdentifier(node: JSIdentifier): void { this.visitJSToken(node); }
    protected visitJSString(node: JSString): void { this.visitJSToken(node); }
    protected visitJSInteger(node: JSInteger): void { this.visitJSToken(node); }
    protected visitJSFromKeyword(node: JSFromKeyword): void { this.visitJSToken(node); }
    protected visitJSReturnKeyword(node: JSReturnKeyword): void { this.visitJSToken(node); }
    protected visitJSTryKeyword(node: JSTryKeyword): void { this.visitJSToken(node); }
    protected visitJSFinallyKeyword(node: JSFinallyKeyword): void { this.visitJSToken(node); }
    protected visitJSCatchKeyword(node: JSCatchKeyword): void { this.visitJSToken(node); }
    protected visitJSImportKeyword(node: JSImportKeyword): void { this.visitJSToken(node); }
    protected visitJSAsKeyword(node: JSAsKeyword): void { this.visitJSToken(node); }
    protected visitJSConstKeyword(node: JSConstKeyword): void { this.visitJSToken(node); }
    protected visitJSLetKeyword(node: JSLetKeyword): void { this.visitJSToken(node); }
    protected visitJSExportKeyword(node: JSExportKeyword): void { this.visitJSToken(node); }
    protected visitJSFunctionKeyword(node: JSFunctionKeyword): void { this.visitJSToken(node); }
    protected visitJSWhileKeyword(node: JSWhileKeyword): void { this.visitJSToken(node); }
    protected visitJSForKeyword(node: JSForKeyword): void { this.visitJSToken(node); }
    protected visitJSOperatorLike(node: JSOperatorLike): void { this.visitSyntax(node); }
    protected visitJSOperator(node: JSOperator): void { this.visitJSToken(node); }
    protected visitJSCloseBrace(node: JSCloseBrace): void { this.visitJSToken(node); }
    protected visitJSCloseBracket(node: JSCloseBracket): void { this.visitJSToken(node); }
    protected visitJSCloseParen(node: JSCloseParen): void { this.visitJSToken(node); }
    protected visitJSOpenBrace(node: JSOpenBrace): void { this.visitJSToken(node); }
    protected visitJSOpenBracket(node: JSOpenBracket): void { this.visitJSToken(node); }
    protected visitJSOpenParen(node: JSOpenParen): void { this.visitJSToken(node); }
    protected visitJSSemi(node: JSSemi): void { this.visitJSToken(node); }
    protected visitJSComma(node: JSComma): void { this.visitJSToken(node); }
    protected visitJSDot(node: JSDot): void { this.visitJSToken(node); }
    protected visitJSDotDotDot(node: JSDotDotDot): void { this.visitJSToken(node); }
    protected visitJSMulOp(node: JSMulOp): void { this.visitJSToken(node); this.visitJSOperatorLike(node); }
    protected visitJSAddOp(node: JSAddOp): void { this.visitJSToken(node); this.visitJSOperatorLike(node); }
    protected visitJSDivOp(node: JSDivOp): void { this.visitJSToken(node); this.visitJSOperatorLike(node); }
    protected visitJSSubOp(node: JSSubOp): void { this.visitJSToken(node); this.visitJSOperatorLike(node); }
    protected visitJSLtOp(node: JSLtOp): void { this.visitJSToken(node); this.visitJSOperatorLike(node); }
    protected visitJSGtOp(node: JSGtOp): void { this.visitJSToken(node); this.visitJSOperatorLike(node); }
    protected visitJSBOrOp(node: JSBOrOp): void { this.visitJSToken(node); this.visitJSOperatorLike(node); }
    protected visitJSBXorOp(node: JSBXorOp): void { this.visitJSToken(node); this.visitJSOperatorLike(node); }
    protected visitJSBAndOp(node: JSBAndOp): void { this.visitJSToken(node); this.visitJSOperatorLike(node); }
    protected visitJSBNotOp(node: JSBNotOp): void { this.visitJSToken(node); this.visitJSOperatorLike(node); }
    protected visitJSNotOp(node: JSNotOp): void { this.visitJSToken(node); this.visitJSOperatorLike(node); }
    protected visitJSPattern(node: JSPattern): void { this.visitJSSyntax(node); }
    protected visitJSBindPattern(node: JSBindPattern): void { this.visitJSPattern(node); }
    protected visitJSExpression(node: JSExpression): void { this.visitJSSyntax(node); }
    protected visitJSConstantExpression(node: JSConstantExpression): void { this.visitJSExpression(node); }
    protected visitJSMemberExpression(node: JSMemberExpression): void { this.visitJSExpression(node); }
    protected visitJSCallExpression(node: JSCallExpression): void { this.visitJSExpression(node); }
    protected visitJSBinaryExpression(node: JSBinaryExpression): void { this.visitJSExpression(node); }
    protected visitJSUnaryExpression(node: JSUnaryExpression): void { this.visitJSExpression(node); }
    protected visitJSNewExpression(node: JSNewExpression): void { this.visitJSExpression(node); }
    protected visitJSSequenceExpression(node: JSSequenceExpression): void { this.visitJSExpression(node); }
    protected visitJSConditionalExpression(node: JSConditionalExpression): void { this.visitJSExpression(node); }
    protected visitJSLiteralExpression(node: JSLiteralExpression): void { this.visitJSExpression(node); }
    protected visitJSReferenceExpression(node: JSReferenceExpression): void { this.visitJSExpression(node); }
    protected visitJSSourceElement(node: JSSourceElement): void { this.visitSyntax(node); }
    protected visitJSFunctionBodyElement(node: JSFunctionBodyElement): void { this.visitFunctionBodyElement(node); }
    protected visitJSStatement(node: JSStatement): void { this.visitJSSyntax(node); this.visitJSSourceElement(node); this.visitJSFunctionBodyElement(node); }
    protected visitJSCatchBlock(node: JSCatchBlock): void { this.visitJSSyntax(node); }
    protected visitJSTryCatchStatement(node: JSTryCatchStatement): void { this.visitJSStatement(node); }
    protected visitJSExpressionStatement(node: JSExpressionStatement): void { this.visitJSStatement(node); }
    protected visitJSConditionalCase(node: JSConditionalCase): void { this.visitJSSyntax(node); }
    protected visitJSConditionalStatement(node: JSConditionalStatement): void { this.visitJSStatement(node); }
    protected visitJSReturnStatement(node: JSReturnStatement): void { this.visitReturnStatement(node); this.visitJSStatement(node); }
    protected visitJSParameter(node: JSParameter): void { this.visitJSSyntax(node); }
    protected visitJSDeclaration(node: JSDeclaration): void { this.visitJSSyntax(node); this.visitJSSourceElement(node); }
    protected visitJSImportBinding(node: JSImportBinding): void { this.visitJSSyntax(node); }
    protected visitJSImportStarBinding(node: JSImportStarBinding): void { this.visitJSImportBinding(node); }
    protected visitJSImportAsBinding(node: JSImportAsBinding): void { this.visitJSImportBinding(node); }
    protected visitJSImportDeclaration(node: JSImportDeclaration): void { this.visitJSDeclaration(node); this.visitJSFunctionBodyElement(node); }
    protected visitJSFunctionDeclaration(node: JSFunctionDeclaration): void { this.visitJSDeclaration(node); this.visitJSFunctionBodyElement(node); }
    protected visitJSArrowFunctionDeclaration(node: JSArrowFunctionDeclaration): void { this.visitJSDeclaration(node); this.visitJSFunctionBodyElement(node); }
    protected visitJSLetDeclaration(node: JSLetDeclaration): void { this.visitJSDeclaration(node); this.visitJSFunctionBodyElement(node); }
    protected visitJSSourceFile(node: JSSourceFile): void { this.visitJSSyntax(node); this.visitSourceFile(node); }
}

export function kindToString(kind: SyntaxKind): string { if (SyntaxKind[kind] === undefined)
    throw new Error("The SyntaxKind value that was passed in was not found."); return SyntaxKind[kind]; }

export type Syntax = EndOfFile | BoltStringLiteral | BoltIntegerLiteral | BoltIdentifier | BoltOperator | BoltAssignment | BoltComma | BoltSemi | BoltColon | BoltColonColon | BoltDot | BoltDotDot | BoltRArrow | BoltRArrowAlt | BoltLArrow | BoltEqSign | BoltGtSign | BoltExMark | BoltLtSign | BoltVBar | BoltWhereKeyword | BoltQuoteKeyword | BoltFnKeyword | BoltForeignKeyword | BoltForKeyword | BoltLetKeyword | BoltReturnKeyword | BoltLoopKeyword | BoltYieldKeyword | BoltMatchKeyword | BoltImportKeyword | BoltExportKeyword | BoltPubKeyword | BoltModKeyword | BoltMutKeyword | BoltEnumKeyword | BoltStructKeyword | BoltTypeKeyword | BoltTraitKeyword | BoltImplKeyword | BoltParenthesized | BoltBraced | BoltBracketed | BoltSourceFile | BoltQualName | BoltTypeOfExpression | BoltReferenceTypeExpression | BoltFunctionTypeExpression | BoltLiftedTypeExpression | BoltTypeParameter | BoltBindPattern | BoltTypePattern | BoltExpressionPattern | BoltTuplePatternElement | BoltTuplePattern | BoltRecordFieldPattern | BoltRecordPattern | BoltQuoteExpression | BoltTupleExpression | BoltReferenceExpression | BoltMemberExpression | BoltFunctionExpression | BoltCallExpression | BoltYieldExpression | BoltMatchArm | BoltMatchExpression | BoltCase | BoltCaseExpression | BoltBlockExpression | BoltConstantExpression | BoltReturnStatement | BoltConditionalCase | BoltConditionalStatement | BoltResumeStatement | BoltExpressionStatement | BoltLoopStatement | BoltParameter | BoltModule | BoltFunctionDeclaration | BoltVariableDeclaration | BoltPlainImportSymbol | BoltImportDirective | BoltPlainExportSymbol | BoltExportDirective | BoltTraitDeclaration | BoltImplDeclaration | BoltTypeAliasDeclaration | BoltRecordField | BoltRecordDeclaration | BoltMacroCall | JSIdentifier | JSString | JSInteger | JSFromKeyword | JSReturnKeyword | JSTryKeyword | JSFinallyKeyword | JSCatchKeyword | JSImportKeyword | JSAsKeyword | JSConstKeyword | JSLetKeyword | JSExportKeyword | JSFunctionKeyword | JSWhileKeyword | JSForKeyword | JSOperator | JSCloseBrace | JSCloseBracket | JSCloseParen | JSOpenBrace | JSOpenBracket | JSOpenParen | JSSemi | JSComma | JSDot | JSDotDotDot | JSMulOp | JSAddOp | JSDivOp | JSSubOp | JSLtOp | JSGtOp | JSBOrOp | JSBXorOp | JSBAndOp | JSBNotOp | JSNotOp | JSBindPattern | JSConstantExpression | JSMemberExpression | JSCallExpression | JSBinaryExpression | JSUnaryExpression | JSNewExpression | JSSequenceExpression | JSConditionalExpression | JSLiteralExpression | JSReferenceExpression | JSCatchBlock | JSTryCatchStatement | JSExpressionStatement | JSConditionalCase | JSConditionalStatement | JSReturnStatement | JSParameter | JSImportStarBinding | JSImportAsBinding | JSImportDeclaration | JSFunctionDeclaration | JSArrowFunctionDeclaration | JSLetDeclaration | JSSourceFile;

export enum SyntaxKind {
    EndOfFile,
    BoltStringLiteral,
    BoltIntegerLiteral,
    BoltIdentifier,
    BoltOperator,
    BoltAssignment,
    BoltComma,
    BoltSemi,
    BoltColon,
    BoltColonColon,
    BoltDot,
    BoltDotDot,
    BoltRArrow,
    BoltRArrowAlt,
    BoltLArrow,
    BoltEqSign,
    BoltGtSign,
    BoltExMark,
    BoltLtSign,
    BoltVBar,
    BoltWhereKeyword,
    BoltQuoteKeyword,
    BoltFnKeyword,
    BoltForeignKeyword,
    BoltForKeyword,
    BoltLetKeyword,
    BoltReturnKeyword,
    BoltLoopKeyword,
    BoltYieldKeyword,
    BoltMatchKeyword,
    BoltImportKeyword,
    BoltExportKeyword,
    BoltPubKeyword,
    BoltModKeyword,
    BoltMutKeyword,
    BoltEnumKeyword,
    BoltStructKeyword,
    BoltTypeKeyword,
    BoltTraitKeyword,
    BoltImplKeyword,
    BoltParenthesized,
    BoltBraced,
    BoltBracketed,
    BoltSourceFile,
    BoltQualName,
    BoltTypeOfExpression,
    BoltReferenceTypeExpression,
    BoltFunctionTypeExpression,
    BoltLiftedTypeExpression,
    BoltTypeParameter,
    BoltBindPattern,
    BoltTypePattern,
    BoltExpressionPattern,
    BoltTuplePatternElement,
    BoltTuplePattern,
    BoltRecordFieldPattern,
    BoltRecordPattern,
    BoltQuoteExpression,
    BoltTupleExpression,
    BoltReferenceExpression,
    BoltMemberExpression,
    BoltFunctionExpression,
    BoltCallExpression,
    BoltYieldExpression,
    BoltMatchArm,
    BoltMatchExpression,
    BoltCase,
    BoltCaseExpression,
    BoltBlockExpression,
    BoltConstantExpression,
    BoltReturnStatement,
    BoltConditionalCase,
    BoltConditionalStatement,
    BoltResumeStatement,
    BoltExpressionStatement,
    BoltLoopStatement,
    BoltParameter,
    BoltModule,
    BoltFunctionDeclaration,
    BoltVariableDeclaration,
    BoltPlainImportSymbol,
    BoltImportDirective,
    BoltPlainExportSymbol,
    BoltExportDirective,
    BoltTraitDeclaration,
    BoltImplDeclaration,
    BoltTypeAliasDeclaration,
    BoltRecordField,
    BoltRecordDeclaration,
    BoltMacroCall,
    JSIdentifier,
    JSString,
    JSInteger,
    JSFromKeyword,
    JSReturnKeyword,
    JSTryKeyword,
    JSFinallyKeyword,
    JSCatchKeyword,
    JSImportKeyword,
    JSAsKeyword,
    JSConstKeyword,
    JSLetKeyword,
    JSExportKeyword,
    JSFunctionKeyword,
    JSWhileKeyword,
    JSForKeyword,
    JSOperator,
    JSCloseBrace,
    JSCloseBracket,
    JSCloseParen,
    JSOpenBrace,
    JSOpenBracket,
    JSOpenParen,
    JSSemi,
    JSComma,
    JSDot,
    JSDotDotDot,
    JSMulOp,
    JSAddOp,
    JSDivOp,
    JSSubOp,
    JSLtOp,
    JSGtOp,
    JSBOrOp,
    JSBXorOp,
    JSBAndOp,
    JSBNotOp,
    JSNotOp,
    JSBindPattern,
    JSConstantExpression,
    JSMemberExpression,
    JSCallExpression,
    JSBinaryExpression,
    JSUnaryExpression,
    JSNewExpression,
    JSSequenceExpression,
    JSConditionalExpression,
    JSLiteralExpression,
    JSReferenceExpression,
    JSCatchBlock,
    JSTryCatchStatement,
    JSExpressionStatement,
    JSConditionalCase,
    JSConditionalStatement,
    JSReturnStatement,
    JSParameter,
    JSImportStarBinding,
    JSImportAsBinding,
    JSImportDeclaration,
    JSFunctionDeclaration,
    JSArrowFunctionDeclaration,
    JSLetDeclaration,
    JSSourceFile
}

