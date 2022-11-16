import {
  MemoryIndirection,
  FPConditionCode,
  ConditionCode,
  FPFormat,
  Operand,
  InstructionExtra,
  BitfieldData,
  Instruction,
  DecodedInstruction,
  Indexer,
  DecodingError,
  Displacement,
  FloatFormat,
  FPF_EXTENDED_REAL,
  REGLIST,
  FPCondition,
  FPF_BYTE_INT,
  FR,
  FPF_WORD_INT,
  FPF_DOUBLE,
  FPF_PACKED_DECIMAL_REAL_STATIC,
  FPF_PACKED_DECIMAL_REAL_DYNAMIC,
  FPF_SINGLE,
  FPF_LONG_INT,
  Condition,
  Bitfield,
  STATIC,
  DYNAMIC,
  IMM8,
  IMM16,
  IMM32,
  DR,
  AR,
  ARIndexer,
  DRIndexer,
  PCDISP,
  ARDISP,
  DISP,
  ABS16,
  ABS32,
  ARIND,
  ARINC,
  ARDEC,
} from "./types";
import { getBits, i16, i8, simpleDisp, u8 } from "./lib";

class CodeStream {
  private pos = 0;
  private error: DecodingError | null = null;

  constructor(public bytes: Uint8Array) {}

  checkOverflow(i: Instruction): DecodedInstruction {
    if (this.error) {
      throw new Error(this.error);
    }
    return { bytesUsed: this.pos, instruction: i };
  }

  hasWords(count: number): boolean {
    return this.pos + count * 2 <= this.bytes.length;
  }

  peekWord(offset: number): number {
    const p = this.pos + offset;
    if (p + 2 <= this.bytes.length) {
      return (this.bytes[p] << 8) | this.bytes[p + 1];
    } else {
      this.error = "OutOfSpace";
      return 0;
    }
  }

  skipWords(count: number) {
    this.pos += 2 * count;
  }

  pull16(): number {
    const result = this.peekWord(0);
    this.pos += 2;
    return result;
  }

  pull32(): number {
    const a = this.pull16();
    const b = this.pull16();
    return (a << 16) | b;
  }

  ea(srcReg: number, srcMod: number, size: number): Operand | null {
    switch (srcMod) {
      case 0b000:
        return DR(srcReg);
      case 0b001:
        return AR(srcReg);
      case 0b010:
        return ARIND(srcReg);
      case 0b011:
        return ARINC(srcReg);
      case 0b100:
        return ARDEC(srcReg);
      case 0b101:
        return ARDISP(srcReg, simpleDisp(i16(this.pull16())));
      case 0b110: {
        const r = srcReg;
        return this.decodeExtendedEa(r);
      }
      case 0b111: {
        switch (srcReg) {
          case 0b000:
            return ABS16(i16(this.pull16()));
          case 0b001:
            return ABS32(this.pull32());
          case 0b010: {
            const pc_offset = this.pos;
            return PCDISP(i8(pc_offset), simpleDisp(i16(this.pull16())));
          }
          case 0b011:
            return this.decodeExtendedEa(null);
          case 0b100: {
            switch (size) {
              case 1:
                return IMM8(u8(this.pull16()));
              case 2:
                return IMM16(this.pull16());
              case 4:
                return IMM32(this.pull32());
              default: {
                this.error = "BadSize";
                return null;
              }
            }
          }
          default: {
            this.error = "NotImplemented";
            return null;
          }
        }
      }
      default: {
        this.error = "NotImplemented";
        return null;
      }
    }
  }

  decodeExtendedEa(srcReg: number | null): Operand {
    const pcOff = u8(this.pos);
    const ext = this.pull16();
    const scale = u8(getBits(ext, 9, 2));
    const idx = getBits(ext, 12, 3);
    const idxIsA = getBits(ext, 15, 1) === 1;

    if (0 !== (ext & (1 << 8))) {
      // Handle full extension word.
      const bd = getBits(ext, 4, 2);
      const od = getBits(ext, 0, 2);
      let disp: number;
      switch (bd) {
        case 0:
          this.error = "Reserved";
          disp = 0;
          break;
        case 1:
          disp = 0;
          break;
        case 2:
          disp = i16(this.pull16());
          break;
        case 3:
          disp = this.pull32();
          break;
        default:
          this.error = "NotImplemented";
          disp = 0;
      }
      let odisp: number;
      switch (od) {
        case 0:
          odisp = 0;
          break;
        case 1:
          odisp = 0;
          break;
        case 2:
          odisp = i16(this.pull16());
          break;
        case 3:
          odisp = this.pull32();
          break;
        default:
          this.error = "NotImplemented";
          odisp = 0;
      }

      const suppressBase = getBits(ext, 7, 1) === 1;
      const suppressIndexer = getBits(ext, 6, 1) === 1;

      let indirectionMode: MemoryIndirection | null;

      if (!suppressIndexer) {
        switch (getBits(ext, 0, 3)) {
          case 0b000:
            indirectionMode = null;
            break;
          case 0b001:
            indirectionMode = "IndirectPreIndexed";
            break;
          case 0b010:
            indirectionMode = "IndirectPreIndexed";
            break;
          case 0b011:
            indirectionMode = "IndirectPreIndexed";
            break;
          case 0b100:
            this.error = "Reserved";
            indirectionMode = null;
            break;
          case 0b101:
            indirectionMode = "IndirectPostIndexed";
            break;
          case 0b110:
            indirectionMode = "IndirectPostIndexed";
            break;
          case 0b111:
            indirectionMode = "IndirectPostIndexed";
            break;
          default:
            this.error = "NotImplemented";
            indirectionMode = null;
        }
      } else {
        switch (getBits(ext, 0, 3)) {
          case 0b000:
            indirectionMode = null;
            break;
          case 0b001:
            indirectionMode = "Indirect";
            break;
          case 0b010:
            indirectionMode = "Indirect";
            break;
          case 0b011:
            indirectionMode = "Indirect";
            break;
          default:
            this.error = "Reserved";
            indirectionMode = null;
        }
      }

      let indexer: Indexer | null = null;
      if (!suppressIndexer) {
        if (idxIsA) {
          indexer = ARIndexer(idx, scale);
        } else {
          indexer = DRIndexer(idx, scale);
        }
      }

      if (suppressBase) {
        return DISP({
          baseDisplacement: disp,
          outerDisplacement: odisp,
          indexer,
          indirection: indirectionMode,
        });
      } else {
        if (srcReg !== null) {
          return ARDISP(srcReg, {
            baseDisplacement: disp,
            outerDisplacement: odisp,
            indexer,
            indirection: indirectionMode,
          });
        } else {
          return PCDISP(pcOff, {
            baseDisplacement: disp,
            outerDisplacement: odisp,
            indexer,
            indirection: indirectionMode,
          });
        }
      }
    } else {
      // Handle brief extension word
      const disp = i8(ext & 0xff);
      const indexer: Indexer = idxIsA
        ? ARIndexer(idx, scale)
        : DRIndexer(idx, scale);

      const displacement: Displacement = {
        baseDisplacement: disp,
        outerDisplacement: 0,
        indexer,
        indirection: null,
      };

      return srcReg !== null
        ? ARDISP(srcReg, displacement)
        : PCDISP(pcOff, displacement);
    }
  }

  imm8(): Operand {
    return IMM8(u8(this.pull16()));
  }

  imm16(): Operand {
    return IMM16(this.pull16());
  }

  imm32(): Operand {
    return IMM32(this.pull32());
  }

  dar(dOrA: number, regno: number): Operand {
    return dOrA === 0 ? DR(regno) : AR(regno);
  }

  bitfield(
    dynOff: number,
    off: number,
    dynWidth: number,
    width: number
  ): InstructionExtra {
    const bfOffset: BitfieldData =
      dynOff === 0
        ? STATIC((off & 31) === 0 ? 32 : u8(off & 31))
        : DYNAMIC(off);

    const bfWidth: BitfieldData =
      dynWidth === 0
        ? STATIC((width & 31) === 0 ? 32 : u8(width & 31))
        : DYNAMIC(width);

    return Bitfield(bfOffset, bfWidth);
  }

  cc(c: number): InstructionExtra {
    switch (c) {
      case 0b0000:
        return Condition(ConditionCode.CC_T); // Always True
      case 0b0001:
        return Condition(ConditionCode.CC_F); // Always False
      case 0b0010:
        return Condition(ConditionCode.CC_HI); // High
      case 0b0011:
        return Condition(ConditionCode.CC_LS); // Low or Same
      case 0b0100:
        return Condition(ConditionCode.CC_CC); // Carry Clear
      case 0b0101:
        return Condition(ConditionCode.CC_CS); // Carry Set
      case 0b0110:
        return Condition(ConditionCode.CC_NE); // Not Equal
      case 0b0111:
        return Condition(ConditionCode.CC_EQ); // Equal
      case 0b1000:
        return Condition(ConditionCode.CC_VC); // Overflow Clear
      case 0b1001:
        return Condition(ConditionCode.CC_VS); // Overflow Set
      case 0b1010:
        return Condition(ConditionCode.CC_PL); // Plus
      case 0b1011:
        return Condition(ConditionCode.CC_MI); // Negative
      case 0b1100:
        return Condition(ConditionCode.CC_GE); // Greater or Equal
      case 0b1101:
        return Condition(ConditionCode.CC_LT); // Less
      case 0b1110:
        return Condition(ConditionCode.CC_GT); // Greater
      default:
        return Condition(ConditionCode.CC_LE); // Less or Equal
    }
  }

  quickConst(i: number): Operand {
    return IMM8(i === 0 ? 8 : u8(i));
  }

  decodeFp(
    rg: number,
    md: number,
    m_r: number,
    s: number,
    d: number,
    k: number
  ): [number, Operand | null, Operand | null, InstructionExtra] {
    if (m_r === 1) {
      let sz: number;
      let fpform: FPFormat;
      switch (s) {
        case 0b000:
          sz = 4;
          fpform = FPF_LONG_INT();
          break;
        case 0b001:
          sz = 4;
          fpform = FPF_SINGLE();
          break;
        case 0b010:
          sz = 10;
          fpform = FPF_EXTENDED_REAL();
          break;
        case 0b011:
          sz = 12;
          fpform = FPF_PACKED_DECIMAL_REAL_STATIC(i8(k << 1) >> 1);
          break;
        case 0b100:
          sz = 2;
          fpform = FPF_WORD_INT();
          break;
        case 0b101:
          sz = 8;
          fpform = FPF_DOUBLE();
          break;
        case 0b110:
          sz = 1;
          fpform = FPF_BYTE_INT();
          break;
        case 0b111:
          sz = 12;
          fpform = FPF_PACKED_DECIMAL_REAL_DYNAMIC(k >> 4);
          break;
        default:
          this.error = "Reserved";
          sz = 0;
          fpform = FPF_BYTE_INT();
      }

      return [sz, this.ea(rg, md, sz), FR(d), FloatFormat(fpform)];
    } else {
      return [10, FR(s), FR(d), FloatFormat(FPF_EXTENDED_REAL())];
    }
  }

  fpcc(c: number): InstructionExtra {
    switch (c) {
      case 0b000000:
        return FPCondition(FPConditionCode.FPCC_F); // False
      case 0b000001:
        return FPCondition(FPConditionCode.FPCC_EQ); // Equal
      case 0b000010:
        return FPCondition(FPConditionCode.FPCC_OGT); // Ordered Greater Than
      case 0b000011:
        return FPCondition(FPConditionCode.FPCC_OGE); // Ordered Greater Than or Equal
      case 0b000100:
        return FPCondition(FPConditionCode.FPCC_OLT); // Ordered Less Than
      case 0b000101:
        return FPCondition(FPConditionCode.FPCC_OLE); // Ordered Less Than or Equal
      case 0b000110:
        return FPCondition(FPConditionCode.FPCC_OGL); // Ordered Greater Than or Less Than
      case 0b000111:
        return FPCondition(FPConditionCode.FPCC_OR); // Ordered
      case 0b001000:
        return FPCondition(FPConditionCode.FPCC_UN); // Unordered
      case 0b001001:
        return FPCondition(FPConditionCode.FPCC_UEQ); // Unordered or Equal
      case 0b001010:
        return FPCondition(FPConditionCode.FPCC_UGT); // Unordered or Greater Than
      case 0b001011:
        return FPCondition(FPConditionCode.FPCC_UGE); // Unordered or Greater Than or Equal
      case 0b001100:
        return FPCondition(FPConditionCode.FPCC_ULT); // Unordered or Less Than
      case 0b001101:
        return FPCondition(FPConditionCode.FPCC_ULE); // Unordered or Less Than or Equal
      case 0b001110:
        return FPCondition(FPConditionCode.FPCC_NE); // Not Equal
      case 0b001111:
        return FPCondition(FPConditionCode.FPCC_T); // True
      case 0b010000:
        return FPCondition(FPConditionCode.FPCC_SF); // Signaling False
      case 0b010001:
        return FPCondition(FPConditionCode.FPCC_SEQ); // Signaling Equal
      case 0b010010:
        return FPCondition(FPConditionCode.FPCC_GT); // Greater Than
      case 0b010011:
        return FPCondition(FPConditionCode.FPCC_GE); // Greater Than or Equal
      case 0b010100:
        return FPCondition(FPConditionCode.FPCC_LT); // Less Than
      case 0b010101:
        return FPCondition(FPConditionCode.FPCC_LE); // Less Than or Equal
      case 0b010110:
        return FPCondition(FPConditionCode.FPCC_GL); // Greater Than or Less Than
      case 0b010111:
        return FPCondition(FPConditionCode.FPCC_GLE); // Greater Than or Less Than or Equal
      case 0b011000:
        return FPCondition(FPConditionCode.FPCC_NGLE); // Not (Greater Than or Less Than or Equal)
      case 0b011001:
        return FPCondition(FPConditionCode.FPCC_NGL); // Not (Greater Than or Less Than)
      case 0b011010:
        return FPCondition(FPConditionCode.FPCC_NLE); // Not (Less Than or Equal)
      case 0b011011:
        return FPCondition(FPConditionCode.FPCC_NLT); // Not (Less Than)
      case 0b011100:
        return FPCondition(FPConditionCode.FPCC_NGE); // Not (Greater Than or Equal)
      case 0b011101:
        return FPCondition(FPConditionCode.FPCC_NGT); // Not (Greater Than)
      case 0b011110:
        return FPCondition(FPConditionCode.FPCC_SNE); // Signaling Not Equal
      default:
        return FPCondition(FPConditionCode.FPCC_ST); // Signaling True
    }
  }

  decodeFpMovem(
    r: number,
    m: number,
    direction: number,
    mask: number,
    mode: number
  ): [number, Operand | null, Operand | null, InstructionExtra] {
    const ea = this.ea(r, m, 10);

    const regs: Operand = (mode & 1) === 0 ? REGLIST(mask) : DR(mask >> 4);

    const extra = FloatFormat(FPF_EXTENDED_REAL());

    return direction === 0
      ? [10, ea, regs, extra] // move from memory to float registers
      : [10, regs, ea, extra]; // move from registers to memory
  }
}

export default CodeStream;
