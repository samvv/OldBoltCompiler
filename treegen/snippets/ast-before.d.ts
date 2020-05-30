
import { TypeRef } from "./types"
import { Diagnostic } from "./diagnostics"
import { Package } from "./common"
import { TextSpan } from "./text"

export function setParents(node: Syntax): void;

export type SyntaxRange = [Syntax, Syntax];

export function isSyntax(value: any): value is Syntax;

interface SyntaxBase {
  id: number;
  kind: SyntaxKind;
  type?: TypeRef;
  errors: Diagnostic[]
  parentNode: Syntax | null;
  span: TextSpan | null;
  visit(visitors: NodeVisitor[]): void;
  preorder(): IterableIterator<Syntax>;
  getParentOfKind<K1 extends SyntaxKind>(kind: K1): ResolveSyntaxKind<K1> | null;
  getChildNodes(): IterableIterator<Syntax>,
  findAllChildrenOfKind<K1 extends SyntaxKind>(kind: K1): IterableIterator<ResolveSyntaxKind<K1>>;
}

export type ResolveSyntaxKind<K extends SyntaxKind> = Extract<Syntax, { kind: K }>;

