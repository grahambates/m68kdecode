import {
  BitfieldData,
  ConditionCode,
  FPConditionCode,
  FPFormat,
  Instruction,
  Operand,
} from "./types";
import { i16, i8 } from "./lib";

// Map bytes to size qualifier
const sizes = { 1: ".b", 2: ".w", 4: ".l" };

// Map float formats to size qualifier
const floatSizes: Record<FPFormat["kind"], string> = {
  FPF_BYTE_INT: ".b",
  FPF_DOUBLE: ".d",
  FPF_EXTENDED_REAL: ".x",
  FPF_LONG_INT: ".l",
  FPF_PACKED_DECIMAL_REAL_STATIC: ".p",
  FPF_PACKED_DECIMAL_REAL_DYNAMIC: ".p",
  FPF_SINGLE: ".s",
  FPF_WORD_INT: ".w",
};

// These operations only have a single size (at least per operand type)
// so we can omit the qualifier text.
const singleSize = [
  "ABCD",
  "BCHG",
  "BCLR",
  "BSET",
  "BTST",
  "EXG",
  "EXG",
  "JMP",
  "JSR",
  "LEA",
  "MOVEFROMCCR",
  "MOVEFROMSR",
  "MOVEFROMUSP",
  "MOVEQ",
  "MOVETOCCR",
  "MOVETOSR",
  "MOVETOUSP",
  "NBCD",
  "PEA",
  "SBCD",
  "SCC",
  "SWAP",
  "TAS",
  "FMOVECR",
  "FMOVEM",
  "FSCC",
];

// Only output a single operand for these operations where src/dest are the same register
const unaryFloat = [
  "FABS",
  "FSABS",
  "FDABS",
  "FACOS",
  "FASIN",
  "FATAN",
  "FATANH",
  "FCOS",
  "FCOSH",
  "FETOX",
  "FETOXM1",
  "FGETEXP",
  "FGETMAN",
  "FINT",
  "FINTRZ",
  "FLOG10",
  "FLOG2",
  "FLOGN",
  "FLOGNP1",
  "FNEG",
  "FSNEG",
  "FDNEG",
  "FSIN",
  "FSINCOS",
  "FSINH",
  "FSQRT",
  "FSSQRT",
  "FDSQRT",
  "FTAN",
  "FTANH",
  "FTENTOX",
  "FTWOTOX",
];

// Map control registers codes to names
const controlRegs = {
  0x000: "sfc",
  0x001: "dfc",
  0x002: "cacr",
  0x003: "tc",
  0x004: "itt0",
  0x005: "itt1",
  0x006: "dtt0",
  0x007: "dtt1",
  0x008: "buscr",
  0x800: "usp",
  0x801: "vbr",
  0x802: "caar",
  0x803: "msp",
  0x804: "isp",
  0x805: "mmusr",
  0x806: "urp",
  0x807: "srp",
  0x808: "pcr",
  0xc00: "rombar",
  0xc04: "rambar0",
  0xc05: "rambar1",
  0xc0f: "mbar0",
};

/**
 * Convert decoded instruction object to source text
 *
 * @param {Instruction} instruction Decoded instruction
 * @returns {string} Source instruction text
 */
export function instructionToString(instruction: Instruction): string {
  const { extra, operation, operands, size } = instruction;
  let out = " " + operationToString(instruction);

  // No size qualifier needed when src/dest are both FP registers
  const allFloat =
    operands[0]?.kind === "FR" &&
    (!operands[1] ||
      operands[1]?.kind === "FR" ||
      operands[1]?.kind === "FPAIR");

  if (!singleSize.includes(operation) && !allFloat) {
    const qualifier =
      extra?.kind === "FloatFormat"
        ? floatSizes[extra.format.kind]
        : sizes[size as keyof typeof sizes];
    if (qualifier) {
      out += qualifier;
    }
  }

  const ops = operands
    .map((op) => operandToString(op, instruction))
    .filter(Boolean);

  if (extra?.kind === "PackAdjustment") {
    ops.push("#" + extra.value);
  }

  if (extra?.kind === "Bitfield") {
    const offset = bitfieldDataToString(extra.offset);
    const width = bitfieldDataToString(extra.width);
    // Append to operand containing indirect address
    const i = ops.findIndex((v) => v?.includes("(a"));
    ops[i] += `{${offset}:${width}}`;
  }

  if (unaryFloat.includes(operation) && ops[0] === ops[1]) {
    ops.pop();
  }

  if (ops.length) {
    out += " " + ops.join(",");
  }

  if (extra?.kind === "FloatFormat") {
    const format = extra.format;
    if (format.kind === "FPF_PACKED_DECIMAL_REAL_DYNAMIC") {
      out += `{d${format.fmove}}`;
    } else if (
      format.kind === "FPF_PACKED_DECIMAL_REAL_STATIC" &&
      format.fmove !== 0
    ) {
      out += `{#${format.fmove}}`;
    }
  }

  return out;
}

function bitfieldDataToString(data: BitfieldData): string {
  return data.kind === "DYNAMIC" ? "d" + data.reg : data.value.toString();
}

function operationToString(instruction: Instruction) {
  const op = instruction.operation.toLowerCase();
  const impliedMatch = op.match(/^(.+)(to|from)(sr|ccr|usp)$/);
  if (impliedMatch) {
    return impliedMatch[1];
  }
  if (instruction.extra?.kind === "Condition") {
    return op.replace(
      /cc$/,
      ConditionCode[instruction.extra.code].substring(3).toLowerCase()
    );
  }
  if (instruction.extra?.kind === "FPCondition") {
    return op.replace(
      /cc$/,
      FPConditionCode[instruction.extra.code].substring(5).toLowerCase()
    );
  }
  switch (op) {
    case "divull":
      return "divul";
    case "divsll":
      return "divsl";
    case "divul":
      return "divu";
    case "divsl":
      return "divs";
    case "extbl":
      return "extb";
    case "extw":
    case "extl":
      return "ext";
    default:
      return op;
  }
}

function operandToString(op: Operand | null, inst: Instruction): string | null {
  switch (op?.kind) {
    case "ABS16":
      return i16(op.value) + ".w";
    case "ABS32":
      return op.value.toString();
    case "AR":
      return "a" + op.reg;
    case "ARDEC":
      return `-(a${op.reg})`;
    case "ARDISP":
      return dispToString(op);
    case "ARINC":
      return `(a${op.reg})+`;
    case "ARIND":
      return `(a${op.reg})`;
    case "CONTROLREG":
      return controlRegs[op.reg as keyof typeof controlRegs];
    case "DISP":
      return dispToString(op);
    case "DPAIR":
      return `d${op.reg2}:d${op.reg1}`;
    case "DR":
      return "d" + op.reg;
    case "FPAIR":
      return `fp${op.reg2}:fp${op.reg1}`;
    case "FR":
      return "fp" + op.reg;
    case "IMM16":
    case "IMM32":
      return "#" + op.value.toString();
    case "IMM8": {
      const v = inst.operation.endsWith("Q") ? i8(op.value) : op.value;
      return "#" + v.toString();
    }
    case "Implied": {
      const match = inst.operation.match(/(TO|FROM)(SR|CCR|USP)$/);
      if (!match) {
        return null; // Omit implied shift
      }
      return match[2].toLowerCase();
    }
    case "PCDISP":
      return dispToString(op);
    case "REGLIST":
      return inst.operation === "FMOVEM"
        ? floatRegListToString(op, inst.operands.indexOf(op) === 0)
        : regListToString(op, inst.operands.indexOf(op) === 0);
  }
  return null;
}

function regListToString(op: Operand, source: boolean) {
  if (op.kind !== "REGLIST") {
    throw new Error("Not a reglist operand");
  }
  const dRegs: number[] = [];
  const aRegs: number[] = [];
  // Order of bits is reversed for source register
  const mask = source ? reverseBits(op.bitmask) : op.bitmask;
  for (let i = 0; i < 8; i++) {
    if (mask & (1 << i)) {
      dRegs.push(i);
    }
    if (mask & (1 << (i + 8))) {
      aRegs.push(i);
    }
  }
  return [...groupRegs(dRegs, "d"), ...groupRegs(aRegs, "a")].join("/");
}

function floatRegListToString(op: Operand, source: boolean) {
  if (op.kind !== "REGLIST") {
    throw new Error("Not a reglist operand");
  }
  const regs: number[] = [];
  const mask = source ? op.bitmask : reverseBits(op.bitmask);
  for (let i = 0; i < 8; i++) {
    if (mask & (1 << i)) {
      regs.push(i);
    }
  }
  return groupRegs(regs, "fp").join("/");
}

// Combines sequential registers to range e.g. d1-d4
// Non sequential registers / groups separated with '/'
function groupRegs(regs: number[], t: string): string[] {
  const outStrs: string[] = [];
  let start: number | undefined;
  let last: number | undefined;
  for (const r of regs) {
    if (last === undefined) {
      start = r;
    } else if (r !== 1 + last) {
      outStrs.push(start === last ? t + start : t + start + "-" + t + last);
      start = r;
    }
    last = r;
  }
  if (start !== undefined) {
    outStrs.push(start === last ? t + start : t + start + "-" + t + last);
  }
  return outStrs;
}

function reverseBits(num: number): number {
  const reversed = num.toString(2).padStart(16);
  return parseInt(reversed.split("").reverse().join(""), 2);
}

function dispToString(op: Operand) {
  if (op.kind !== "ARDISP" && op.kind !== "PCDISP" && op.kind !== "DISP") {
    throw new Error("Not a displacement operand");
  }
  let r: string;
  let out = "";
  const args: string[] = [];
  if (op.disp.baseDisplacement) {
    out += op.disp.baseDisplacement;
  }
  if (op.kind === "ARDISP") {
    args.push("a" + op.reg);
  }
  if (op.kind === "PCDISP") {
    args.push("pc");
  }
  if (op.disp.indexer) {
    let arg = op.disp.indexer.kind === "AR" ? "a" : "d";
    arg += op.disp.indexer.reg;
    if (op.disp.indexer.scale) {
      arg += "*" + (1 << op.disp.indexer.scale);
    }
    // TODO: size?
    args.push(arg);
  }
  if (op.disp.outerDisplacement) {
    args.push(op.disp.outerDisplacement.toString());
  }
  if (op.disp.indirection === "IndirectPreIndexed") {
    out += "-";
  }
  out += `(${args.join(",")})`;
  if (op.disp.indirection === "IndirectPostIndexed") {
    out += "+";
  }
  return out;
}
