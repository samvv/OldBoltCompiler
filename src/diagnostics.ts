
import chalk from "chalk"
import {Syntax} from "./ast";
import {format, MapLike, FormatArg} from "./util";

export const E_TYPE_DECLARATION_NOT_FOUND = "A type declaration named '{name}' was not found."
export const E_DECLARATION_NOT_FOUND = "Reference to an undefined declaration '{name}'.";
export const E_TYPES_NOT_ASSIGNABLE = "Types {left} and {right} are not assignable.";
export const E_TOO_FEW_ARGUMENTS_FOR_FUNCTION_CALL = "Too few arguments for function call. Expected {expected} but got {actual}.";
export const E_TOO_MANY_ARGUMENTS_FOR_FUNCTION_CALL = "Too many arguments for function call. Expected {expected} but got {actual}.";
export const E_INVALID_ARGUMENTS = "Invalid arguments passed to function '{name}'."

const DIAG_NUM_EXTRA_LINES = 1;

export interface Diagnostic {
  message: string;
  severity: string;
  args?: MapLike<FormatArg>;
  node?: Syntax;
}

export function countDigits(num: number) {
  if (num === 0) {
    return 1
  }
  return Math.ceil(Math.log10(num+1))
}

function firstIndexOfNonEmpty(str: string) {
  let j = 0;
  for (; j < str.length; j++) {
    const ch = str[j];
    if (ch !== ' ' && ch !== '\t') {
      break;
    }
  }
  return j
}

export class DiagnosticPrinter {

  public hasErrors = false;

  public add(diagnostic: Diagnostic): void {
    let out = ''
    if (diagnostic.node !== undefined) {
      const span = diagnostic.node.span!;
      const content = span.file.getText();
      const startLine = Math.max(0, span.start.line-1-DIAG_NUM_EXTRA_LINES)
      const lines = content.split('\n')
      const endLine = Math.min(lines.length-1, (span.end !== undefined ? span.end.line : startLine)+DIAG_NUM_EXTRA_LINES)
      const gutterWidth = Math.max(2, countDigits(endLine+1))
      for (let i = startLine; i < endLine; i++) {
        const line = lines[i];
        let j = firstIndexOfNonEmpty(line);
        out += '  '+chalk.bgWhite.black(' '.repeat(gutterWidth-countDigits(i+1))+(i+1).toString())+' '+line+'\n'
        const gutter = '  '+chalk.bgWhite.black(' '.repeat(gutterWidth))+' '
        let mark: number;
        let skip: number;
        if (i === span.start.line-1 && i === span.end.line-1) {
          skip = span.start.column-1;
          mark = span.end.column-span.start.column;
        } else if (i === span.start.line-1) {
          skip = span.start.column-1;
          mark = line.length-span.start.column+1;
        } else if (i === span.end.line-1) {
          skip = 0;
          mark = span.end.column-1;
        } else if (i > span.start.line-1 && i < span.end.line-1) {
          skip = 0;
          mark = line.length;
        } else {
          continue;
        }
        if (j < skip) {
          j = 0;
        }
        out += gutter+' '.repeat(j+skip)+chalk.red('~'.repeat(mark-j)) + '\n'
      }
      out += '\n'
      out += chalk.bold.yellow(`${span.file.origPath}:${span.start.line}:${span.start.column}: `);
    }
    switch (diagnostic.severity) {
      case 'error':
        this.hasErrors = true;
        out += chalk.bold.red('error: ');
    }
    if (diagnostic.args !== undefined) {
      out += format(diagnostic.message, diagnostic.args) + '\n';
    } else {
      out += diagnostic.message + '\n';
    }
    out += '\n'
    process.stderr.write(out);
  }

}
