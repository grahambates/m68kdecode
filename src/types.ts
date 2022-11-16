/* eslint-disable @typescript-eslint/ban-types */

// Used to replace Rust enums with args
type DiscriminatedUnion<K extends PropertyKey, T extends object> = {
  [P in keyof T]: { [Q in K]: P } & T[P] extends infer U
    ? { [Q in keyof U]: U[Q] }
    : never;
}[keyof T];

export enum Operation {
  ANDITOCCR = "ANDITOCCR",
  ANDITOSR = "ANDITOSR",
  EORITOCCR = "EORITOCCR",
  EORITOSR = "EORITOSR",
  ORITOCCR = "ORITOCCR",
  ORITOSR = "ORITOSR",
  MOVEP = "MOVEP",
  BTST = "BTST",
  BCHG = "BCHG",
  BCLR = "BCLR",
  BSET = "BSET",
  RTM = "RTM",
  CALLM = "CALLM",
  ADDI = "ADDI",
  SUBI = "SUBI",
  ANDI = "ANDI",
  ORI = "ORI",
  CMP2 = "CMP2",
  CHK2 = "CHK2",
  EORI = "EORI",
  CMPI = "CMPI",
  MOVES = "MOVES",
  MOVE = "MOVE",
  MOVEA = "MOVEA",
  BGND = "BGND",
  ILLEGAL = "ILLEGAL",
  NOP = "NOP",
  RESET = "RESET",
  RTD = "RTD",
  RTE = "RTE",
  RTR = "RTR",
  RTS = "RTS",
  STOP = "STOP",
  TRAPV = "TRAPV",
  MOVEC = "MOVEC",
  SWAP = "SWAP",
  BKPT = "BKPT",
  EXTW = "EXTW",
  EXTL = "EXTL",
  EXTBL = "EXTBL",
  LEA = "LEA",
  LINK = "LINK",
  UNLK = "UNLK",
  TRAP = "TRAP",
  DIVSL = "DIVSL",
  DIVSLL = "DIVSLL",
  DIVUL = "DIVUL",
  DIVULL = "DIVULL",
  JMP = "JMP",
  JSR = "JSR",
  MULS = "MULS",
  MULU = "MULU",
  NBCD = "NBCD",
  MOVEFROMSR = "MOVEFROMSR",
  MOVETOSR = "MOVETOSR",
  MOVETOUSP = "MOVETOUSP",
  MOVEFROMUSP = "MOVEFROMUSP",
  MOVEFROMCCR = "MOVEFROMCCR",
  MOVETOCCR = "MOVETOCCR",
  PEA = "PEA",
  TAS = "TAS",
  MOVEM = "MOVEM",
  CLR = "CLR",
  NEG = "NEG",
  NEGX = "NEGX",
  NOT = "NOT",
  TST = "TST",
  CHK = "CHK",
  DBCC = "DBCC",
  ADDQ = "ADDQ",
  SUBQ = "SUBQ",
  TRAPCC = "TRAPCC",
  SCC = "SCC",
  BRA = "BRA",
  BSR = "BSR",
  BCC = "BCC",
  MOVEQ = "MOVEQ",
  PACK = "PACK",
  UNPK = "UNPK",
  SBCD = "SBCD",
  DIVS = "DIVS",
  DIVU = "DIVU",
  OR = "OR",
  SUBX = "SUBX",
  SUB = "SUB",
  SUBA = "SUBA",
  CMPA = "CMPA",
  CMPM = "CMPM",
  CMP = "CMP",
  EOR = "EOR",
  ABCD = "ABCD",
  EXG = "EXG",
  AND = "AND",
  ADDX = "ADDX",
  ADD = "ADD",
  ADDA = "ADDA",
  BFCHG = "BFCHG",
  BFCLR = "BFCLR",
  BFEXTS = "BFEXTS",
  BFEXTU = "BFEXTU",
  BFFFO = "BFFFO",
  BFINS = "BFINS",
  BFSET = "BFSET",
  BFTST = "BFTST",
  ASL = "ASL",
  ASR = "ASR",
  LSL = "LSL",
  LSR = "LSR",
  ROXL = "ROXL",
  ROXR = "ROXR",
  ROL = "ROL",
  ROR = "ROR",
  FMOVECR = "FMOVECR",
  FABS = "FABS",
  FSABS = "FSABS",
  FDABS = "FDABS",
  FACOS = "FACOS",
  FADD = "FADD",
  FSADD = "FSADD",
  FDADD = "FDADD",
  FASIN = "FASIN",
  FATAN = "FATAN",
  FATANH = "FATANH",
  FNOP = "FNOP",
  FBCC = "FBCC",
  FCMP = "FCMP",
  FCOS = "FCOS",
  FCOSH = "FCOSH",
  FDBCC = "FDBCC",
  FDIV = "FDIV",
  FSDIV = "FSDIV",
  FDDIV = "FDDIV",
  FETOX = "FETOX",
  FETOXM1 = "FETOXM1",
  FGETEXP = "FGETEXP",
  FGETMAN = "FGETMAN",
  FINT = "FINT",
  FINTRZ = "FINTRZ",
  FLOG10 = "FLOG10",
  FLOG2 = "FLOG2",
  FLOGN = "FLOGN",
  FLOGNP1 = "FLOGNP1",
  FMOD = "FMOD",
  FMOVE = "FMOVE",
  FSMOVE = "FSMOVE",
  FDMOVE = "FDMOVE",
  FMOVEM = "FMOVEM",
  FMUL = "FMUL",
  FSMUL = "FSMUL",
  FDMUL = "FDMUL",
  FNEG = "FNEG",
  FSNEG = "FSNEG",
  FDNEG = "FDNEG",
  FREM = "FREM",
  FSCALE = "FSCALE",
  FTRAPCC = "FTRAPCC",
  FSCC = "FSCC",
  FSGLDIV = "FSGLDIV",
  FSGLMUL = "FSGLMUL",
  FSIN = "FSIN",
  FSINCOS = "FSINCOS",
  FSINH = "FSINH",
  FSQRT = "FSQRT",
  FSSQRT = "FSSQRT",
  FDSQRT = "FDSQRT",
  FSUB = "FSUB",
  FSSUB = "FSSUB",
  FDSUB = "FDSUB",
  FTAN = "FTAN",
  FTANH = "FTANH",
  FTENTOX = "FTENTOX",
  FTST = "FTST",
  FTWOTOX = "FTWOTOX",
}

/// One of the 8 data registers.
export enum DataRegister {
  D0,
  D1,
  D2,
  D3,
  D4,
  D5,
  D6,
  D7,
}

/// One of the 8 address registers.
///
/// Note that A7 means `USP` in user mode and `SSP`/`ISP` in supervisor mode.
export enum AddressRegister {
  A0,
  A1,
  A2,
  A3,
  A4,
  A5,
  A6,
  A7,
}

/// One of the 8 floating point registers.
export enum FloatingRegister {
  FP0,
  FP1,
  FP2,
  FP3,
  FP4,
  FP5,
  FP6,
  FP7,
}

/// Indicates how memory indexing is to be performed for 68020+ double memory operands.
export enum MemoryIndirection {
  /// Regular memory indirection.
  Indirect = "Indirect",
  /// Memory pre-indexed indirection (indexer applies to inner array).
  IndirectPreIndexed = "IndirectPreIndexed",
  /// Memory post-indexed indirection (indexer applies to outer array).
  IndirectPostIndexed = "IndirectPostIndexed",
}

/// Indicates how indexing is to be performed.
export type Indexer = DiscriminatedUnion<
  "kind",
  {
    /// Index using data register
    DR: { reg: DataRegister; scale: number };
    /// Index using address register
    AR: { reg: AddressRegister; scale: number };
  }
>;

// Indexer factories
export const DRIndexer = (reg: DataRegister, scale: number): Indexer => ({
  kind: "DR",
  reg,
  scale,
});
export const ARIndexer = (reg: AddressRegister, scale: number): Indexer => ({
  kind: "AR",
  reg,
  scale,
});

/// Indicates how a memory operand effective address is to be computed using displacement.
export interface Displacement {
  /// Base displacement. This is always sign-extended to 32-bit by the instruction decoder.
  baseDisplacement: number;
  /// Outer displacement (only used for 68020+ double indirection modes)
  outerDisplacement: number;
  /// Indicates how indexing is to be performed.
  indexer: Indexer | null;
  /// Indicates what type of memory indirection is to be performed.
  indirection: MemoryIndirection | null;
}

/// Describes one of the two operands in an instruction
export type Operand = DiscriminatedUnion<
  "kind",
  {
    /// The operand is implied, for example when the CCR is being moved to or from.
    ///
    /// When the operand is implied, the instruction documentation must be consulted to see what
    /// data is being affected.
    Implied: {};
    /// An immediate 8-bit value.
    ///
    /// Stored as unsigned, but it often needs to be interpreted as signed.
    IMM8: { value: number };
    /// An immediate 16-bit value.
    ///
    /// Stored as unsigned, but it often needs to be interpreted as signed.
    IMM16: { value: number };
    /// An immediate 32-bit value.
    ///
    /// Stored as unsigned, but it often needs to be interpreted as signed.
    IMM32: { value: number };
    /// An absolute address, given as a sign-extended 16-bit value.
    ABS16: { value: number };
    /// An absolute address, given as a full 32-bit value.
    ABS32: { value: number };
    /// A data register
    DR: { reg: DataRegister };
    /// An address register
    AR: { reg: AddressRegister };
    /// A floating point register
    FR: { reg: FloatingRegister };
    /// A vanilla indrection without displacement, e.g. `(a0)`
    ARIND: { reg: AddressRegister };
    /// Address register indirect with post-increment, e.g. `(a0)+`
    ARINC: { reg: AddressRegister };
    /// Address register indirect with pre-decrement, e.g. `-(a0)`
    ARDEC: { reg: AddressRegister };
    /// Address register indirect with displacement, e.g. `123(pc,d0)`
    ARDISP: { reg: AddressRegister; disp: Displacement };
    /// Program counter indirect with displacement, e.g. `123(pc,d0)`
    PCDISP: { offset: number; disp: Displacement };
    /// Just a displacement (skipping the base register), e.g. `123(d0)`
    DISP: { disp: Displacement };
    /// A data register pair, used for 64-bit multiply/divide results.
    DPAIR: { reg1: DataRegister; reg2: DataRegister };
    /// A floating point register pair, used for `FSINCOS`. First register receives the sine, the
    /// other the cosine.
    FPAIR: { reg1: FloatingRegister; reg2: FloatingRegister };
    /// A register bitmask for `MOVEM` or `FMOVEM`. The order of registers is reversed depending on
    /// whether the address register is pre-decremented or post-incremented.
    REGLIST: { bitmask: number };
    /// A control register
    CONTROLREG: { reg: number };
  }
>;

// Operand factories
export const Implied = (): Operand => ({ kind: "Implied" });
export const IMM8 = (value: number): Operand => ({ kind: "IMM8", value });
export const IMM16 = (value: number): Operand => ({ kind: "IMM16", value });
export const IMM32 = (value: number): Operand => ({ kind: "IMM32", value });
export const ABS16 = (value: number): Operand => ({ kind: "ABS16", value });
export const ABS32 = (value: number): Operand => ({ kind: "ABS32", value });
export const DR = (reg: DataRegister): Operand => ({ kind: "DR", reg });
export const AR = (reg: AddressRegister): Operand => ({ kind: "AR", reg });
export const FR = (reg: FloatingRegister): Operand => ({ kind: "FR", reg });
export const ARIND = (reg: AddressRegister): Operand => ({
  kind: "ARIND",
  reg,
});
export const ARINC = (reg: AddressRegister): Operand => ({
  kind: "ARINC",
  reg,
});
export const ARDEC = (reg: AddressRegister): Operand => ({
  kind: "ARDEC",
  reg,
});
export const ARDISP = (reg: AddressRegister, disp: Displacement): Operand => ({
  kind: "ARDISP",
  reg,
  disp,
});
export const PCDISP = (offset: number, disp: Displacement): Operand => ({
  kind: "PCDISP",
  offset,
  disp,
});
export const DISP = (disp: Displacement): Operand => ({ kind: "DISP", disp });
export const DPAIR = (reg1: DataRegister, reg2: DataRegister): Operand => ({
  kind: "DPAIR",
  reg1,
  reg2,
});
export const FPAIR = (
  reg1: FloatingRegister,
  reg2: FloatingRegister
): Operand => ({ kind: "FPAIR", reg1, reg2 });
export const REGLIST = (bitmask: number): Operand => ({
  kind: "REGLIST",
  bitmask,
});
export const CONTROLREG = (reg: number): Operand => ({
  kind: "CONTROLREG",
  reg,
});

/// Describes one leg of a 68020+ bitfield specification
export type BitfieldData = DiscriminatedUnion<
  "kind",
  {
    /// The offset or width is static.
    STATIC: { value: number };
    /// The offset or width is dynamic and specified via a data register.
    DYNAMIC: { reg: DataRegister };
  }
>;

// BitfieldData factories:
export const STATIC = (value: number): BitfieldData => ({
  kind: "STATIC",
  value,
});
export const DYNAMIC = (reg: DataRegister): BitfieldData => ({
  kind: "DYNAMIC",
  reg,
});

/// A CPU condition code from the CCR
export enum ConditionCode {
  /// Always True
  CC_T = 0b0000,
  /// Always False
  CC_F = 0b0001,
  /// High
  CC_HI = 0b0010,
  /// Low or Same
  CC_LS = 0b0011,
  /// Carry Clear
  CC_CC = 0b0100,
  /// Carry Set
  CC_CS = 0b0101,
  /// Not Equal
  CC_NE = 0b0110,
  /// Equal
  CC_EQ = 0b0111,
  /// Overflow Clear
  CC_VC = 0b1000,
  /// Overflow Set
  CC_VS = 0b1001,
  /// Plus
  CC_PL = 0b1010,
  /// Negative
  CC_MI = 0b1011,
  /// Greater or Equal
  CC_GE = 0b1100,
  /// Less
  CC_LT = 0b1101,
  /// Greater
  CC_GT = 0b1110,
  /// Less or Equal
  CC_LE = 0b1111,
}

/// A FPU condition code
export enum FPConditionCode {
  /// False
  FPCC_F = 0b000000,
  /// Equal
  FPCC_EQ = 0b000001,
  /// Ordered Greater Than
  FPCC_OGT = 0b000010,
  /// Ordered Greater Than or Equal
  FPCC_OGE = 0b000011,
  /// Ordered Less Than
  FPCC_OLT = 0b000100,
  /// Ordered Less Than or Equal
  FPCC_OLE = 0b000101,
  /// Ordered Greater Than or Less Than
  FPCC_OGL = 0b000110,
  /// Ordered
  FPCC_OR = 0b000111,
  /// Unordered
  FPCC_UN = 0b001000,
  /// Unordered or Equal
  FPCC_UEQ = 0b001001,
  /// Unordered or Greater Than
  FPCC_UGT = 0b001010,
  /// Unordered or Greater Than or Equal
  FPCC_UGE = 0b001011,
  /// Unordered or Less Than
  FPCC_ULT = 0b001100,
  /// Unordered or Less Than or Equal
  FPCC_ULE = 0b001101,
  /// Not Equal
  FPCC_NE = 0b001110,
  /// True
  FPCC_T = 0b001111,
  /// Signaling False
  FPCC_SF = 0b010000,
  /// Signaling Equal
  FPCC_SEQ = 0b010001,
  /// Greater Than
  FPCC_GT = 0b010010,
  /// Greater Than or Equal
  FPCC_GE = 0b010011,
  /// Less Than
  FPCC_LT = 0b010100,
  /// Less Than or Equal
  FPCC_LE = 0b010101,
  /// Greater Than or Less Than
  FPCC_GL = 0b010110,
  /// Greater Than or Less Than or Equal
  FPCC_GLE = 0b010111,
  /// Not (Greater Than or Less Than or Equal)
  FPCC_NGLE = 0b011000,
  /// Not (Greater Than or Less Than)
  FPCC_NGL = 0b011001,
  /// Not (Less Than or Equal)
  FPCC_NLE = 0b011010,
  /// Not (Less Than)
  FPCC_NLT = 0b011011,
  /// Not (Greater Than or Equal)
  FPCC_NGE = 0b011100,
  /// Not (Greater Than)
  FPCC_NGT = 0b011101,
  /// Signaling Not Equal
  FPCC_SNE = 0b011110,
  /// Signaling True
  FPCC_ST = 0b011111,
}

/// Indicates the floating point format in memory for a FPU operation
export type FPFormat = DiscriminatedUnion<
  "kind",
  {
    /// The memory operand is a 32-bit integer.
    FPF_LONG_INT: {};
    /// The memory operand is a IEEE 32-bit single.
    FPF_SINGLE: {};
    /// The memory operand is a 68k extended-precision real (10 bytes).
    FPF_EXTENDED_REAL: {};
    /// The memory operand is a 68k packed decimal real (BCD encoded) (12 bytes).
    /// For `FMOVE`, this also includes a static _K-factor_ to be applied to the result.
    FPF_PACKED_DECIMAL_REAL_STATIC: { value: number }; // Includes fmove K-factor
    /// The memory operand is a 68k packed decimal real (BCD encoded) (12 bytes).
    /// For `FMOVE`, this also includes a dynamic _K-factor_ to be applied to the result.
    FPF_PACKED_DECIMAL_REAL_DYNAMIC: { reg: DataRegister }; // Includes fmove K-factor
    /// The memory operand is a 16-bit integer.
    FPF_WORD_INT: {};
    /// The memory operand is a IEEE 64-bit double.
    FPF_DOUBLE: {};
    /// The memory operand is an 8-bit integer.
    FPF_BYTE_INT: {};
  }
>;

// FPFormat factories
export const FPF_LONG_INT = (): FPFormat => ({
  kind: "FPF_LONG_INT",
});
export const FPF_SINGLE = (): FPFormat => ({
  kind: "FPF_SINGLE",
});
export const FPF_EXTENDED_REAL = (): FPFormat => ({
  kind: "FPF_EXTENDED_REAL",
});
export const FPF_PACKED_DECIMAL_REAL_STATIC = (value: number): FPFormat => ({
  kind: "FPF_PACKED_DECIMAL_REAL_STATIC",
  value,
});
export const FPF_PACKED_DECIMAL_REAL_DYNAMIC = (
  reg: DataRegister
): FPFormat => ({
  kind: "FPF_PACKED_DECIMAL_REAL_DYNAMIC",
  reg,
});
export const FPF_WORD_INT = (): FPFormat => ({
  kind: "FPF_WORD_INT",
});
export const FPF_DOUBLE = (): FPFormat => ({
  kind: "FPF_DOUBLE",
});
export const FPF_BYTE_INT = (): FPFormat => ({
  kind: "FPF_BYTE_INT",
});

/// Additional attributes for an instruction that don't fit anywhere else.
export type InstructionExtra = DiscriminatedUnion<
  "kind",
  {
    /// For 68020+ bitfield instructions, specifies the bitfield offset and width of the EA.
    Bitfield: { offset: BitfieldData; width: BitfieldData };
    /// For instructions involving a CPU condition code (e.g. `DBcc`), specifies the condition code
    /// tested.
    Condition: { code: ConditionCode };
    /// For instructions involving a FPU condition code (e.g. `FDBcc`), specifies the condition code
    /// tested.
    FPCondition: { code: FPConditionCode };
    /// Specifies the pack adjustment for BCD packing.
    PackAdjustment: { value: number };
    /// Specifies the float format of a memory operand for FPU instructions that use a memory EA.
    FloatFormat: { format: FPFormat };
  }
>;

// InstructionExtra factories
export const Bitfield = (
  offset: BitfieldData,
  width: BitfieldData
): InstructionExtra => ({
  kind: "Bitfield",
  offset,
  width,
});
export const Condition = (code: ConditionCode): InstructionExtra => ({
  kind: "Condition",
  code,
});
export const FPCondition = (code: FPConditionCode): InstructionExtra => ({
  kind: "FPCondition",
  code,
});
export const PackAdjustment = (value: number): InstructionExtra => ({
  kind: "PackAdjustment",
  value,
});
export const FloatFormat = (format: FPFormat): InstructionExtra => ({
  kind: "FloatFormat",
  format,
});

/// Represents an instruction.
export interface Instruction {
  /// The size of any data movement (the number of bytes read or written).
  size: number;
  /// The instruction itself.
  operation: Operation;
  /// The two operands involved, source and destination.
  operands: [Operand | null, Operand | null];
  /// Any additional data required to make sense of the operation.
  extra: InstructionExtra | null;
}

/// Represents the result of decoding an instruction from a byte stream.
export interface DecodedInstruction {
  /// The number of bytes that were consumed decoding the instruction.
  bytesUsed: number;
  /// The decoded instruction.
  instruction: Instruction;
}

/// export Enumerates errors that can happen while decoding instructions.
export enum DecodingError {
  /// The instruction is not implemented in the decoder.
  NotImplemented,
  /// The code stream doesn't contain enough data to decode the instruction.
  OutOfSpace,
  /// An illegal register was specified in the instruction encoding.
  BadRegister,
  /// An illegal size was specified in the instruction encoding.
  BadSize,
  /// A reserved case was hit in the instruction encoding.
  Reserved,
}
