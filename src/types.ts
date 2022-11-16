/* eslint-disable @typescript-eslint/ban-types */

// Used to replace Rust enums with args
type DiscriminatedUnion<K extends PropertyKey, T extends object> = {
  [P in keyof T]: { [Q in K]: P } & T[P] extends infer U
    ? { [Q in keyof U]: U[Q] }
    : never;
}[keyof T];

export type Operation =
  | "ANDITOCCR"
  | "ANDITOSR"
  | "EORITOCCR"
  | "EORITOSR"
  | "ORITOCCR"
  | "ORITOSR"
  | "MOVEP"
  | "BTST"
  | "BCHG"
  | "BCLR"
  | "BSET"
  | "RTM"
  | "CALLM"
  | "ADDI"
  | "SUBI"
  | "ANDI"
  | "ORI"
  | "CMP2"
  | "CHK2"
  | "EORI"
  | "CMPI"
  | "MOVES"
  | "MOVE"
  | "MOVEA"
  | "BGND"
  | "ILLEGAL"
  | "NOP"
  | "RESET"
  | "RTD"
  | "RTE"
  | "RTR"
  | "RTS"
  | "STOP"
  | "TRAPV"
  | "MOVEC"
  | "SWAP"
  | "BKPT"
  | "EXTW"
  | "EXTL"
  | "EXTBL"
  | "LEA"
  | "LINK"
  | "UNLK"
  | "TRAP"
  | "DIVSL"
  | "DIVSLL"
  | "DIVUL"
  | "DIVULL"
  | "JMP"
  | "JSR"
  | "MULS"
  | "MULU"
  | "NBCD"
  | "MOVEFROMSR"
  | "MOVETOSR"
  | "MOVETOUSP"
  | "MOVEFROMUSP"
  | "MOVEFROMCCR"
  | "MOVETOCCR"
  | "PEA"
  | "TAS"
  | "MOVEM"
  | "CLR"
  | "NEG"
  | "NEGX"
  | "NOT"
  | "TST"
  | "CHK"
  | "DBCC"
  | "ADDQ"
  | "SUBQ"
  | "TRAPCC"
  | "SCC"
  | "BRA"
  | "BSR"
  | "BCC"
  | "MOVEQ"
  | "PACK"
  | "UNPK"
  | "SBCD"
  | "DIVS"
  | "DIVU"
  | "OR"
  | "SUBX"
  | "SUB"
  | "SUBA"
  | "CMPA"
  | "CMPM"
  | "CMP"
  | "EOR"
  | "ABCD"
  | "EXG"
  | "AND"
  | "ADDX"
  | "ADD"
  | "ADDA"
  | "BFCHG"
  | "BFCLR"
  | "BFEXTS"
  | "BFEXTU"
  | "BFFFO"
  | "BFINS"
  | "BFSET"
  | "BFTST"
  | "ASL"
  | "ASR"
  | "LSL"
  | "LSR"
  | "ROXL"
  | "ROXR"
  | "ROL"
  | "ROR"
  | "FMOVECR"
  | "FABS"
  | "FSABS"
  | "FDABS"
  | "FACOS"
  | "FADD"
  | "FSADD"
  | "FDADD"
  | "FASIN"
  | "FATAN"
  | "FATANH"
  | "FNOP"
  | "FBCC"
  | "FCMP"
  | "FCOS"
  | "FCOSH"
  | "FDBCC"
  | "FDIV"
  | "FSDIV"
  | "FDDIV"
  | "FETOX"
  | "FETOXM1"
  | "FGETEXP"
  | "FGETMAN"
  | "FINT"
  | "FINTRZ"
  | "FLOG10"
  | "FLOG2"
  | "FLOGN"
  | "FLOGNP1"
  | "FMOD"
  | "FMOVE"
  | "FSMOVE"
  | "FDMOVE"
  | "FMOVEM"
  | "FMUL"
  | "FSMUL"
  | "FDMUL"
  | "FNEG"
  | "FSNEG"
  | "FDNEG"
  | "FREM"
  | "FSCALE"
  | "FTRAPCC"
  | "FSCC"
  | "FSGLDIV"
  | "FSGLMUL"
  | "FSIN"
  | "FSINCOS"
  | "FSINH"
  | "FSQRT"
  | "FSSQRT"
  | "FDSQRT"
  | "FSUB"
  | "FSSUB"
  | "FDSUB"
  | "FTAN"
  | "FTANH"
  | "FTENTOX"
  | "FTST"
  | "FTWOTOX";

/// Indicates how memory indexing is to be performed for 68020+ double memory operands.
export type MemoryIndirection =
  /// Regular memory indirection.
  | "Indirect"
  /// Memory pre-indexed indirection (indexer applies to inner array).
  | "IndirectPreIndexed"
  /// Memory post-indexed indirection (indexer applies to outer array).
  | "IndirectPostIndexed";

/// Indicates how indexing is to be performed.
export type Indexer = DiscriminatedUnion<
  "kind",
  {
    /// Index using data register
    DR: { reg: number; scale: number };
    /// Index using address register
    AR: { reg: number; scale: number };
  }
>;

// Indexer factories
export const DRIndexer = (reg: number, scale: number): Indexer => ({
  kind: "DR",
  reg,
  scale,
});
export const ARIndexer = (reg: number, scale: number): Indexer => ({
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
    DR: { reg: number };
    /// An address register
    AR: { reg: number };
    /// A floating point register
    FR: { reg: number };
    /// A vanilla indrection without displacement, e.g. `(a0)`
    ARIND: { reg: number };
    /// Address register indirect with post-increment, e.g. `(a0)+`
    ARINC: { reg: number };
    /// Address register indirect with pre-decrement, e.g. `-(a0)`
    ARDEC: { reg: number };
    /// Address register indirect with displacement, e.g. `123(pc,d0)`
    ARDISP: { reg: number; disp: Displacement };
    /// Program counter indirect with displacement, e.g. `123(pc,d0)`
    PCDISP: { offset: number; disp: Displacement };
    /// Just a displacement (skipping the base register), e.g. `123(d0)`
    DISP: { disp: Displacement };
    /// A data register pair, used for 64-bit multiply/divide results.
    DPAIR: { reg1: number; reg2: number };
    /// A floating point register pair, used for `FSINCOS`. First register receives the sine, the
    /// other the cosine.
    FPAIR: { reg1: number; reg2: number };
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
export const DR = (reg: number): Operand => ({ kind: "DR", reg });
export const AR = (reg: number): Operand => ({ kind: "AR", reg });
export const FR = (reg: number): Operand => ({ kind: "FR", reg });
export const ARIND = (reg: number): Operand => ({
  kind: "ARIND",
  reg,
});
export const ARINC = (reg: number): Operand => ({
  kind: "ARINC",
  reg,
});
export const ARDEC = (reg: number): Operand => ({
  kind: "ARDEC",
  reg,
});
export const ARDISP = (reg: number, disp: Displacement): Operand => ({
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
export const DPAIR = (reg1: number, reg2: number): Operand => ({
  kind: "DPAIR",
  reg1,
  reg2,
});
export const FPAIR = (reg1: number, reg2: number): Operand => ({
  kind: "FPAIR",
  reg1,
  reg2,
});
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
    DYNAMIC: { reg: number };
  }
>;

// BitfieldData factories:
export const STATIC = (value: number): BitfieldData => ({
  kind: "STATIC",
  value,
});
export const DYNAMIC = (reg: number): BitfieldData => ({
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
    FPF_PACKED_DECIMAL_REAL_STATIC: { fmove: number }; // Includes fmove K-factor
    /// The memory operand is a 68k packed decimal real (BCD encoded) (12 bytes).
    /// For `FMOVE`, this also includes a dynamic _K-factor_ to be applied to the result.
    FPF_PACKED_DECIMAL_REAL_DYNAMIC: { fmove: number }; // Includes fmove K-factor
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
export const FPF_PACKED_DECIMAL_REAL_STATIC = (fmove: number): FPFormat => ({
  kind: "FPF_PACKED_DECIMAL_REAL_STATIC",
  fmove,
});
export const FPF_PACKED_DECIMAL_REAL_DYNAMIC = (fmove: number): FPFormat => ({
  kind: "FPF_PACKED_DECIMAL_REAL_DYNAMIC",
  fmove,
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
export type DecodingError =
  /// The instruction is not implemented in the decoder.
  | "NotImplemented"
  /// The code stream doesn't contain enough data to decode the instruction.
  | "OutOfSpace"
  /// An illegal register was specified in the instruction encoding.
  | "BadRegister"
  /// An illegal size was specified in the instruction encoding.
  | "BadSize"
  /// A reserved case was hit in the instruction encoding.
  | "Reserved";
