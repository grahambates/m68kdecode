import CodeStream from "./codestream";
import { simpleDisp, getBits, i16, i8 } from "./lib";
import {
  Operand,
  InstructionExtra,
  DecodedInstruction,
  Operation,
  Implied,
  ARIND,
  DR,
  IMM16,
  CONTROLREG,
  IMM8,
  REGLIST,
  PCDISP,
  DPAIR,
  ARDEC,
  PackAdjustment,
  ARINC,
  FPAIR,
} from "./types";

function decodeGroup0000(w0: number, cs: CodeStream): DecodedInstruction {
  if ((w0 & 0b1111111111111111) === 0b0000001000111100) {
    const size = 1;
    const src = cs.imm8();
    const dst = Implied();
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ANDITOCCR,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111111111) === 0b0000001001111100) {
    const size = 2;
    const src = cs.imm16();
    const dst = Implied();
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ANDITOSR,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111111111) === 0b0000101000111100) {
    const size = 1;
    const src = cs.imm8();
    const dst = Implied();
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.EORITOCCR,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111111111) === 0b0000101001111100) {
    const size = 2;
    const src = cs.imm16();
    const dst = Implied();
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.EORITOSR,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111111111) === 0b0000000000111100) {
    const size = 1;
    const src = cs.imm8();
    const dst = Implied();
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ORITOCCR,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111111111) === 0b0000000001111100) {
    const size = 2;
    const src = cs.imm16();
    const dst = Implied();
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ORITOSR,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000110111000) === 0b0000000100001000) {
    const d = getBits(w0, 9, 3);
    const s = getBits(w0, 6, 1);
    const a = getBits(w0, 0, 3);
    const size = 1 << (s + 1);
    const src: Operand = ARIND(cs.addressReg(a));
    const dst = cs.dataRegOp(d);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.MOVEP,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000110111000) === 0b0000000100101000) {
    const d = getBits(w0, 9, 3);
    const s = getBits(w0, 6, 1);
    const a = getBits(w0, 0, 3);
    const size = 1 << (s + 1);
    const src: Operand = DR(cs.dataReg(d));
    const dst: Operand = ARIND(cs.addressReg(a));
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.MOVEP,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111000000) === 0b0000000100000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.dataRegOp(d);
    const dst = cs.ea(r, m, 4);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.BTST,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111000000) === 0b0000000101000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.dataRegOp(d);
    const dst = cs.ea(r, m, 4);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.BCHG,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111000000) === 0b0000000110000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.dataRegOp(d);
    const dst = cs.ea(r, m, 4);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.BCLR,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111000000) === 0b0000000111000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.dataRegOp(d);
    const dst = cs.ea(r, m, 4);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.BSET,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111000000) === 0b0000100000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1111111000000000) === 0b0000000000000000) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const n = getBits(w1, 0, 9);
      cs.skipWords(1);
      const size = 1;
      const src = IMM16(n);
      const dst = cs.ea(r, m, 1);
      const extra: InstructionExtra | null = null;
      return cs.checkOverflow({
        size,
        operation: Operation.BTST,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b0000100001000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1111111000000000) === 0b0000000000000000) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const n = getBits(w1, 0, 9);
      cs.skipWords(1);
      const size = 1;
      const src = IMM16(n);
      const dst = cs.ea(r, m, 1);
      const extra: InstructionExtra | null = null;
      return cs.checkOverflow({
        size,
        operation: Operation.BCHG,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b0000100010000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1111111000000000) === 0b0000000000000000) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const n = getBits(w1, 0, 9);
      cs.skipWords(1);
      const size = 1;
      const src = IMM16(n);
      const dst = cs.ea(r, m, 1);
      const extra: InstructionExtra | null = null;
      return cs.checkOverflow({
        size,
        operation: Operation.BCLR,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b0000100011000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1111111000000000) === 0b0000000000000000) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const n = getBits(w1, 0, 9);
      cs.skipWords(1);
      const size = 1;
      const src = IMM16(n);
      const dst = cs.ea(r, m, 1);
      const extra: InstructionExtra | null = null;
      return cs.checkOverflow({
        size,
        operation: Operation.BSET,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111110000) === 0b0000011011000000) {
    const d = getBits(w0, 3, 1);
    const r = getBits(w0, 0, 3);
    const size = 0;
    const src = cs.dar(d, r);
    const dst: Operand | null = null;
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.RTM,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111000000) === 0b0000011011000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 0;
    const src = cs.imm8();
    const dst = cs.ea(r, m, 0);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.CALLM,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111000000) === 0b0000011000000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = cs.imm8();
    const dst = cs.ea(r, m, 1);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ADDI,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111000000) === 0b0000011001000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.imm16();
    const dst = cs.ea(r, m, 2);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ADDI,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111000000) === 0b0000011010000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.imm32();
    const dst = cs.ea(r, m, 4);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ADDI,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111000000) === 0b0000010000000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = cs.imm8();
    const dst = cs.ea(r, m, 1);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.SUBI,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111000000) === 0b0000010001000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.imm16();
    const dst = cs.ea(r, m, 2);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.SUBI,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111000000) === 0b0000010010000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.imm32();
    const dst = cs.ea(r, m, 4);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.SUBI,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111000000) === 0b0000001000000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = cs.imm8();
    const dst = cs.ea(r, m, 1);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ANDI,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111000000) === 0b0000001001000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.imm16();
    const dst = cs.ea(r, m, 2);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ANDI,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111000000) === 0b0000001010000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.imm32();
    const dst = cs.ea(r, m, 4);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ANDI,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111000000) === 0b0000000000000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = cs.imm8();
    const dst = cs.ea(r, m, 1);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ORI,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111000000) === 0b0000000001000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.imm16();
    const dst = cs.ea(r, m, 2);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ORI,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111000000) === 0b0000000010000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.imm32();
    const dst = cs.ea(r, m, 4);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ORI,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111100111000000) === 0b0000000011000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b0000111111111111) === 0b0000000000000000) {
      const s = getBits(w0, 9, 2);
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const a = getBits(w1, 15, 1);
      const d = getBits(w1, 12, 3);
      cs.skipWords(1);
      const size = 1 << s;
      const src = cs.ea(r, m, size);
      const dst = cs.dar(a, d);
      const extra: InstructionExtra | null = null;
      return cs.checkOverflow({
        size,
        operation: Operation.CMP2,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111100111000000) === 0b0000000011000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b0000111111111111) === 0b0000100000000000) {
      const s = getBits(w0, 9, 2);
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const a = getBits(w1, 15, 1);
      const d = getBits(w1, 12, 3);
      cs.skipWords(1);
      const size = 1 << s;
      const src = cs.ea(r, m, size);
      const dst = cs.dar(a, d);
      const extra: InstructionExtra | null = null;
      return cs.checkOverflow({
        size,
        operation: Operation.CHK2,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b0000101000000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = cs.imm8();
    const dst = cs.ea(r, m, 1);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.EORI,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111000000) === 0b0000101001000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.imm16();
    const dst = cs.ea(r, m, 2);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.EORI,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111000000) === 0b0000101010000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.imm32();
    const dst = cs.ea(r, m, 4);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.EORI,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111000000) === 0b0000110000000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = cs.imm8();
    const dst = cs.ea(r, m, 1);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.CMPI,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111000000) === 0b0000110001000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.imm16();
    const dst = cs.ea(r, m, 2);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.CMPI,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111000000) === 0b0000110010000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.imm32();
    const dst = cs.ea(r, m, 4);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.CMPI,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111000000) === 0b0000111000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b0000111111111111) === 0b0000000000000000) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const a = getBits(w1, 15, 1);
      const d = getBits(w1, 12, 3);
      cs.skipWords(1);
      const size = 1;
      const dst = cs.dar(a, d);
      const src = cs.ea(r, m, 1);
      const extra: InstructionExtra | null = null;
      return cs.checkOverflow({
        size,
        operation: Operation.MOVES,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b0000111001000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b0000111111111111) === 0b0000000000000000) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const a = getBits(w1, 15, 1);
      const d = getBits(w1, 12, 3);
      cs.skipWords(1);
      const size = 2;
      const dst = cs.dar(a, d);
      const src = cs.ea(r, m, 2);
      const extra: InstructionExtra | null = null;
      return cs.checkOverflow({
        size,
        operation: Operation.MOVES,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b0000111010000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b0000111111111111) === 0b0000000000000000) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const a = getBits(w1, 15, 1);
      const d = getBits(w1, 12, 3);
      cs.skipWords(1);
      const size = 4;
      const dst = cs.dar(a, d);
      const src = cs.ea(r, m, 4);
      const extra: InstructionExtra | null = null;
      return cs.checkOverflow({
        size,
        operation: Operation.MOVES,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b0000111000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b0000111111111111) === 0b0000100000000000) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const a = getBits(w1, 15, 1);
      const d = getBits(w1, 12, 3);
      cs.skipWords(1);
      const size = 1;
      const src = cs.dar(a, d);
      const dst = cs.ea(r, m, 1);
      const extra: InstructionExtra | null = null;
      return cs.checkOverflow({
        size,
        operation: Operation.MOVES,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b0000111001000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b0000111111111111) === 0b0000100000000000) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const a = getBits(w1, 15, 1);
      const d = getBits(w1, 12, 3);
      cs.skipWords(1);
      const size = 2;
      const src = cs.dar(a, d);
      const dst = cs.ea(r, m, 2);
      const extra: InstructionExtra | null = null;
      return cs.checkOverflow({
        size,
        operation: Operation.MOVES,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b0000111010000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b0000111111111111) === 0b0000100000000000) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const a = getBits(w1, 15, 1);
      const d = getBits(w1, 12, 3);
      cs.skipWords(1);
      const size = 4;
      const src = cs.dar(a, d);
      const dst = cs.ea(r, m, 4);
      const extra: InstructionExtra | null = null;
      return cs.checkOverflow({
        size,
        operation: Operation.MOVES,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111110000) === 0b0000011011000000) {
    const a = getBits(w0, 3, 1);
    const r = getBits(w0, 0, 3);
    const size = 0;
    const src = cs.dar(a, r);
    const dst: Operand | null = null;
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.RTM,
      operands: [src, dst],
      extra,
    });
  }
  throw new Error("NotImplemented");
}

function decodeGroup0001(w0: number, cs: CodeStream): DecodedInstruction {
  if ((w0 & 0b1111000000000000) === 0b0001000000000000) {
    const R = getBits(w0, 9, 3);
    const M = getBits(w0, 6, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = cs.ea(r, m, 1);
    const dst = cs.ea(R, M, 1);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.MOVE,
      operands: [src, dst],
      extra,
    });
  }
  throw new Error("NotImplemented");
}

function decodeGroup0010(w0: number, cs: CodeStream): DecodedInstruction {
  if ((w0 & 0b1111000111000000) === 0b0010000001000000) {
    const R = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.ea(r, m, 4);
    const dst = cs.ea(R, 0b001, 4);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.MOVEA,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000000000000) === 0b0010000000000000) {
    const R = getBits(w0, 9, 3);
    const M = getBits(w0, 6, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.ea(r, m, 4);
    const dst = cs.ea(R, M, 4);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.MOVE,
      operands: [src, dst],
      extra,
    });
  }
  throw new Error("NotImplemented");
}

function decodeGroup0011(w0: number, cs: CodeStream): DecodedInstruction {
  if ((w0 & 0b1111000111000000) === 0b0011000001000000) {
    const R = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.ea(r, m, 2);
    const dst = cs.ea(R, 0b001, 2);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.MOVEA,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000000000000) === 0b0011000000000000) {
    const R = getBits(w0, 9, 3);
    const M = getBits(w0, 6, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.ea(r, m, 2);
    const dst = cs.ea(R, M, 2);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.MOVE,
      operands: [src, dst],
      extra,
    });
  }
  throw new Error("NotImplemented");
}

function decodeGroup0100(w0: number, cs: CodeStream): DecodedInstruction {
  if ((w0 & 0b1111111111111111) === 0b0100101011111010) {
    const size = 0;
    const src: Operand | null = null;
    const dst: Operand | null = null;
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.BGND,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111111111) === 0b0100101011111100) {
    const size = 0;
    const src: Operand | null = null;
    const dst: Operand | null = null;
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ILLEGAL,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111111111) === 0b0100111001110001) {
    const size = 0;
    const src: Operand | null = null;
    const dst: Operand | null = null;
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.NOP,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111111111) === 0b0100111001110000) {
    const size = 0;
    const src: Operand | null = null;
    const dst: Operand | null = null;
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.RESET,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111111111) === 0b0100111001110100) {
    const size = 0;
    const src = cs.imm16();
    const dst: Operand | null = null;
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.RTD,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111111111) === 0b0100111001110011) {
    const size = 0;
    const src: Operand | null = null;
    const dst: Operand | null = null;
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.RTE,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111111111) === 0b0100111001110111) {
    const size = 0;
    const src: Operand | null = null;
    const dst: Operand | null = null;
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.RTR,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111111111) === 0b0100111001110101) {
    const size = 0;
    const src: Operand | null = null;
    const dst: Operand | null = null;
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.RTS,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111111111) === 0b0100111001110010) {
    const size = 0;
    const src = cs.imm16();
    const dst: Operand | null = null;
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.STOP,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111111111) === 0b0100111001110110) {
    const size = 0;
    const src: Operand | null = null;
    const dst: Operand | null = null;
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.TRAPV,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111111111) === 0b0100111001111010 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b0000000000000000) === 0b0000000000000000) {
      const a = getBits(w1, 15, 1);
      const r = getBits(w1, 12, 3);
      const c = getBits(w1, 0, 12);
      cs.skipWords(1);
      const size = 4;
      const src = CONTROLREG(c);
      const dst = cs.dar(a, r);
      const extra: InstructionExtra | null = null;
      return cs.checkOverflow({
        size,
        operation: Operation.MOVEC,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111111111) === 0b0100111001111011 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b0000000000000000) === 0b0000000000000000) {
      const a = getBits(w1, 15, 1);
      const r = getBits(w1, 12, 3);
      const c = getBits(w1, 0, 12);
      cs.skipWords(1);
      const size = 4;
      const src = cs.dar(a, r);
      const dst = CONTROLREG(c);
      const extra: InstructionExtra | null = null;
      return cs.checkOverflow({
        size,
        operation: Operation.MOVEC,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111111000) === 0b0100100001000000) {
    const r = getBits(w0, 0, 3);
    const size = 0;
    const src = cs.dataRegOp(r);
    const dst: Operand | null = null;
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.SWAP,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111111000) === 0b0100100001001000) {
    const n = getBits(w0, 0, 3);
    const size = 0;
    const src = IMM8(n);
    const dst: Operand | null = null;
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.BKPT,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111111000) === 0b0100100010000000) {
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.dataRegOp(r);
    const dst: Operand | null = null;
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.EXTW,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111111000) === 0b0100100011000000) {
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.dataRegOp(r);
    const dst: Operand | null = null;
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.EXTL,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111111000) === 0b0100100111000000) {
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.dataRegOp(r);
    const dst: Operand | null = null;
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.EXTBL,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111000000) === 0b0100000111000000) {
    const n = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.ea(r, m, 4);
    const dst = cs.addressRegOp(n);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.LEA,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111111000) === 0b0100111001010000) {
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.addressRegOp(r);
    const dst = cs.imm16();
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.LINK,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111111000) === 0b0100100000001000) {
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.addressRegOp(r);
    const dst = cs.imm32();
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.LINK,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111111000) === 0b0100111001011000) {
    const r = getBits(w0, 0, 3);
    const size = 0;
    const src = cs.addressRegOp(r);
    const dst: Operand | null = null;
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.UNLK,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111110000) === 0b0100111001000000) {
    const v = getBits(w0, 0, 4);
    const size = 0;
    const src = IMM8(v);
    const dst: Operand | null = null;
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.TRAP,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111000000) === 0b0100110001000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1000111111111000) === 0b0000110000000000) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const q = getBits(w1, 12, 3);
      const R = getBits(w1, 0, 3);
      if (R !== q) {
        cs.skipWords(1);
        const size = 4;
        const src = cs.ea(r, m, 4);
        const dst = DPAIR(cs.dataReg(q), cs.dataReg(R));
        const extra: InstructionExtra | null = null;
        return cs.checkOverflow({
          size,
          operation: Operation.DIVSL,
          operands: [src, dst],
          extra,
        });
      }
    }
  }
  if ((w0 & 0b1111111111000000) === 0b0100110001000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1000111111111000) === 0b0000110000000000) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const q = getBits(w1, 12, 3);
      const R = getBits(w1, 0, 3);
      cs.skipWords(1);
      const size = 4;
      const src = cs.ea(r, m, 4);
      const dst = DPAIR(cs.dataReg(q), cs.dataReg(R));
      const extra: InstructionExtra | null = null;
      return cs.checkOverflow({
        size,
        operation: Operation.DIVSL,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b0100110001000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1000111111111000) === 0b0000100000000000) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const q = getBits(w1, 12, 3);
      const R = getBits(w1, 0, 3);
      if (R !== q) {
        cs.skipWords(1);
        const size = 4;
        const src = cs.ea(r, m, 4);
        const dst = DPAIR(cs.dataReg(q), cs.dataReg(R));
        const extra: InstructionExtra | null = null;
        return cs.checkOverflow({
          size,
          operation: Operation.DIVSLL,
          operands: [src, dst],
          extra,
        });
      }
    }
  }
  if ((w0 & 0b1111111111000000) === 0b0100110001000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1000111111111000) === 0b0000100000000000) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const q = getBits(w1, 12, 3);
      cs.skipWords(1);
      const size = 4;
      const src = cs.ea(r, m, 4);
      const dst = cs.dataRegOp(q);
      const extra: InstructionExtra | null = null;
      return cs.checkOverflow({
        size,
        operation: Operation.DIVSL,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b0100110001000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1000111111111000) === 0b0000010000000000) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const q = getBits(w1, 12, 3);
      const R = getBits(w1, 0, 3);
      if (R !== q) {
        cs.skipWords(1);
        const size = 4;
        const src = cs.ea(r, m, 4);
        const dst = DPAIR(cs.dataReg(q), cs.dataReg(R));
        const extra: InstructionExtra | null = null;
        return cs.checkOverflow({
          size,
          operation: Operation.DIVUL,
          operands: [src, dst],
          extra,
        });
      }
    }
  }
  if ((w0 & 0b1111111111000000) === 0b0100110001000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1000111111111000) === 0b0000010000000000) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const q = getBits(w1, 12, 3);
      const R = getBits(w1, 0, 3);
      cs.skipWords(1);
      const size = 4;
      const src = cs.ea(r, m, 4);
      const dst = DPAIR(cs.dataReg(q), cs.dataReg(R));
      const extra: InstructionExtra | null = null;
      return cs.checkOverflow({
        size,
        operation: Operation.DIVUL,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b0100110001000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1000111111111000) === 0b0000000000000000) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const q = getBits(w1, 12, 3);
      const R = getBits(w1, 0, 3);
      if (R !== q) {
        cs.skipWords(1);
        const size = 4;
        const src = cs.ea(r, m, 4);
        const dst = DPAIR(cs.dataReg(q), cs.dataReg(R));
        const extra: InstructionExtra | null = null;
        return cs.checkOverflow({
          size,
          operation: Operation.DIVULL,
          operands: [src, dst],
          extra,
        });
      }
    }
  }
  if ((w0 & 0b1111111111000000) === 0b0100110001000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1000111111111000) === 0b0000000000000000) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const q = getBits(w1, 12, 3);
      cs.skipWords(1);
      const size = 4;
      const src = cs.ea(r, m, 4);
      const dst = cs.dataRegOp(q);
      const extra: InstructionExtra | null = null;
      return cs.checkOverflow({
        size,
        operation: Operation.DIVUL,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b0100111011000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 0;
    const src = cs.ea(r, m, 0);
    const dst: Operand | null = null;
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.JMP,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111000000) === 0b0100111010000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 0;
    const src = cs.ea(r, m, 0);
    const dst: Operand | null = null;
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.JSR,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111000000) === 0b0100110000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1000111111111000) === 0b0000100000000000) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const l = getBits(w1, 12, 3);
      cs.skipWords(1);
      const size = 4;
      const src = cs.ea(r, m, 4);
      const dst = cs.dataRegOp(l);
      const extra: InstructionExtra | null = null;
      return cs.checkOverflow({
        size,
        operation: Operation.MULS,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b0100110000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1000111111111000) === 0b0000110000000000) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const l = getBits(w1, 12, 3);
      const h = getBits(w1, 0, 3);
      cs.skipWords(1);
      const size = 4;
      const src = cs.ea(r, m, 4);
      const dst = DPAIR(cs.dataReg(l), cs.dataReg(h));
      const extra: InstructionExtra | null = null;
      return cs.checkOverflow({
        size,
        operation: Operation.MULS,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b0100110000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1000111111111000) === 0b0000000000000000) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const l = getBits(w1, 12, 3);
      cs.skipWords(1);
      const size = 4;
      const src = cs.ea(r, m, 4);
      const dst = cs.dataRegOp(l);
      const extra: InstructionExtra | null = null;
      return cs.checkOverflow({
        size,
        operation: Operation.MULU,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b0100110000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1000111111111000) === 0b0000010000000000) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const l = getBits(w1, 12, 3);
      const h = getBits(w1, 0, 3);
      cs.skipWords(1);
      const size = 4;
      const src = cs.ea(r, m, 4);
      const dst = DPAIR(cs.dataReg(l), cs.dataReg(h));
      const extra: InstructionExtra | null = null;
      return cs.checkOverflow({
        size,
        operation: Operation.MULU,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b0100100000000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = cs.ea(r, m, 1);
    const dst: Operand | null = null;
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.NBCD,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111000000) === 0b0100000011000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = Implied();
    const dst = cs.ea(r, m, 2);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.MOVEFROMSR,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111000000) === 0b0100011011000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.ea(r, m, 2);
    const dst = Implied();
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.MOVETOSR,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111111000) === 0b0100111001100000) {
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.addressRegOp(r);
    const dst = Implied();
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.MOVETOUSP,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111111000) === 0b0100111001101000) {
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = Implied();
    const dst = cs.addressRegOp(r);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.MOVEFROMUSP,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111000000) === 0b0100001011000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = Implied();
    const dst = cs.ea(r, m, 2);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.MOVEFROMCCR,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111000000) === 0b0100010011000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.ea(r, m, 2);
    const dst = Implied();
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.MOVETOCCR,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111000000) === 0b0100100001000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.ea(r, m, 4);
    const dst = Implied();
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.PEA,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111000000) === 0b0100101011000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = cs.ea(r, m, 1);
    const dst: Operand | null = null;
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.TAS,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111110000000) === 0b0100100010000000) {
    const s = getBits(w0, 6, 1);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2 << s;
    const src = REGLIST(cs.pull16());
    const dst = cs.ea(r, m, size);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.MOVEM,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111110000000) === 0b0100110010000000) {
    const s = getBits(w0, 6, 1);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2 << s;
    const dst = REGLIST(cs.pull16());
    const src = cs.ea(r, m, size);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.MOVEM,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111000000) === 0b0100001000000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = Implied();
    const dst = cs.ea(r, m, size);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.CLR,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111000000) === 0b0100001001000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = Implied();
    const dst = cs.ea(r, m, size);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.CLR,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111000000) === 0b0100001010000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = Implied();
    const dst = cs.ea(r, m, size);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.CLR,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111000000) === 0b0100010000000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = Implied();
    const dst = cs.ea(r, m, size);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.NEG,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111000000) === 0b0100010001000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = Implied();
    const dst = cs.ea(r, m, size);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.NEG,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111000000) === 0b0100010010000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = Implied();
    const dst = cs.ea(r, m, size);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.NEG,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111000000) === 0b0100000000000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = Implied();
    const dst = cs.ea(r, m, size);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.NEGX,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111000000) === 0b0100000001000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = Implied();
    const dst = cs.ea(r, m, size);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.NEGX,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111000000) === 0b0100000010000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = Implied();
    const dst = cs.ea(r, m, size);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.NEGX,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111000000) === 0b0100011000000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = Implied();
    const dst = cs.ea(r, m, size);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.NOT,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111000000) === 0b0100011001000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = Implied();
    const dst = cs.ea(r, m, size);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.NOT,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111000000) === 0b0100011010000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = Implied();
    const dst = cs.ea(r, m, size);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.NOT,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111000000) === 0b0100101000000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = Implied();
    const dst = cs.ea(r, m, size);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.TST,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111000000) === 0b0100101001000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = Implied();
    const dst = cs.ea(r, m, size);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.TST,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111000000) === 0b0100101010000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = Implied();
    const dst = cs.ea(r, m, size);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.TST,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111000000) === 0b0100000110000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.ea(r, m, size);
    const dst = cs.dataRegOp(d);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.CHK,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111000000) === 0b0100000100000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.ea(r, m, size);
    const dst = cs.dataRegOp(d);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.CHK,
      operands: [src, dst],
      extra,
    });
  }
  throw new Error("NotImplemented");
}

function decodeGroup0101(w0: number, cs: CodeStream): DecodedInstruction {
  if ((w0 & 0b1111000011111000) === 0b0101000011001000) {
    const c = getBits(w0, 8, 4);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.dataRegOp(r);
    const dst = PCDISP(2, simpleDisp(i16(cs.pull16())));
    const extra: InstructionExtra | null = cs.cc(c);
    return cs.checkOverflow({
      size,
      operation: Operation.DBCC,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111000000) === 0b0101000000000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = cs.quickConst(d);
    const dst = cs.ea(r, m, size);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ADDQ,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111000000) === 0b0101000001000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.quickConst(d);
    const dst = cs.ea(r, m, size);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ADDQ,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111000000) === 0b0101000010000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.quickConst(d);
    const dst = cs.ea(r, m, size);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ADDQ,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111000000) === 0b0101000100000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = cs.quickConst(d);
    const dst = cs.ea(r, m, size);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.SUBQ,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111000000) === 0b0101000101000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.quickConst(d);
    const dst = cs.ea(r, m, size);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.SUBQ,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111000000) === 0b0101000110000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.quickConst(d);
    const dst = cs.ea(r, m, size);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.SUBQ,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000011111111) === 0b0101000011111100) {
    const c = getBits(w0, 8, 4);
    const size = 0;
    const src: Operand | null = null;
    const dst: Operand | null = null;
    const extra: InstructionExtra | null = cs.cc(c);
    return cs.checkOverflow({
      size,
      operation: Operation.TRAPCC,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000011111111) === 0b0101000011111010) {
    const c = getBits(w0, 8, 4);
    const size = 2;
    const src = cs.imm16();
    const dst: Operand | null = null;
    const extra: InstructionExtra | null = cs.cc(c);
    return cs.checkOverflow({
      size,
      operation: Operation.TRAPCC,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000011111111) === 0b0101000011111011) {
    const c = getBits(w0, 8, 4);
    const size = 4;
    const src = cs.imm32();
    const dst: Operand | null = null;
    const extra: InstructionExtra | null = cs.cc(c);
    return cs.checkOverflow({
      size,
      operation: Operation.TRAPCC,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000011000000) === 0b0101000011000000) {
    const c = getBits(w0, 8, 4);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = Implied();
    const dst = cs.ea(r, m, 1);
    const extra: InstructionExtra | null = cs.cc(c);
    return cs.checkOverflow({
      size,
      operation: Operation.SCC,
      operands: [src, dst],
      extra,
    });
  }
  throw new Error("NotImplemented");
}

function decodeGroup0110(w0: number, cs: CodeStream): DecodedInstruction {
  if ((w0 & 0b1111111111111111) === 0b0110000000000000) {
    const size = 2;
    const src = PCDISP(2, simpleDisp(i16(cs.pull16())));
    const dst: Operand | null = null;
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.BRA,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111111111) === 0b0110000011111111) {
    const size = 4;
    const src = PCDISP(2, simpleDisp(i16(cs.pull32())));
    const dst: Operand | null = null;
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.BRA,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111100000000) === 0b0110000000000000) {
    const d = getBits(w0, 0, 8);
    const size = 1;
    const src = PCDISP(2, simpleDisp(i8(d)));
    const dst: Operand | null = null;
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.BRA,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111111111) === 0b0110000100000000) {
    const size = 2;
    const src = PCDISP(2, simpleDisp(i16(cs.pull16())));
    const dst: Operand | null = null;
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.BSR,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111111111) === 0b0110000111111111) {
    const size = 4;
    const src = PCDISP(2, simpleDisp(i16(cs.pull32())));
    const dst: Operand | null = null;
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.BSR,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111100000000) === 0b0110000100000000) {
    const d = getBits(w0, 0, 8);
    const size = 1;
    const src = PCDISP(2, simpleDisp(i8(d)));
    const dst: Operand | null = null;
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.BSR,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000011111111) === 0b0110000000000000) {
    const c = getBits(w0, 8, 4);
    const size = 2;
    const src = PCDISP(2, simpleDisp(i16(cs.pull16())));
    const dst: Operand | null = null;
    const extra: InstructionExtra | null = cs.cc(c);
    return cs.checkOverflow({
      size,
      operation: Operation.BCC,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000011111111) === 0b0110000011111111) {
    const c = getBits(w0, 8, 4);
    const size = 4;
    const src = PCDISP(2, simpleDisp(i16(cs.pull32())));
    const dst: Operand | null = null;
    const extra: InstructionExtra | null = cs.cc(c);
    return cs.checkOverflow({
      size,
      operation: Operation.BCC,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000000000000) === 0b0110000000000000) {
    const c = getBits(w0, 8, 4);
    const d = getBits(w0, 0, 8);
    const size = 1;
    const src = PCDISP(2, simpleDisp(i8(d)));
    const dst: Operand | null = null;
    const extra: InstructionExtra | null = cs.cc(c);
    return cs.checkOverflow({
      size,
      operation: Operation.BCC,
      operands: [src, dst],
      extra,
    });
  }
  throw new Error("NotImplemented");
}

function decodeGroup0111(w0: number, cs: CodeStream): DecodedInstruction {
  if ((w0 & 0b1111000100000000) === 0b0111000000000000) {
    const r = getBits(w0, 9, 3);
    const n = getBits(w0, 0, 8);
    const size = 4;
    const src = IMM8(n);
    const dst = cs.dataRegOp(r);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.MOVEQ,
      operands: [src, dst],
      extra,
    });
  }
  throw new Error("NotImplemented");
}

function decodeGroup1000(w0: number, cs: CodeStream): DecodedInstruction {
  if ((w0 & 0b1111000111111000) === 0b1000000101000000) {
    const y = getBits(w0, 9, 3);
    const x = getBits(w0, 0, 3);
    const size = 0;
    const src = cs.dataRegOp(x);
    const dst = cs.dataRegOp(y);
    const extra = PackAdjustment(cs.pull16());
    return cs.checkOverflow({
      size,
      operation: Operation.PACK,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1000000101001000) {
    const y = getBits(w0, 9, 3);
    const x = getBits(w0, 0, 3);
    const size = 0;
    const src = ARDEC(cs.addressReg(x));
    const dst = ARDEC(cs.addressReg(y));
    const extra = PackAdjustment(cs.pull16());
    return cs.checkOverflow({
      size,
      operation: Operation.PACK,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1000000110000000) {
    const y = getBits(w0, 9, 3);
    const x = getBits(w0, 0, 3);
    const size = 0;
    const src = cs.dataRegOp(x);
    const dst = cs.dataRegOp(y);
    const extra = PackAdjustment(cs.pull16());
    return cs.checkOverflow({
      size,
      operation: Operation.UNPK,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1000000110001000) {
    const y = getBits(w0, 9, 3);
    const x = getBits(w0, 0, 3);
    const size = 0;
    const src = ARDEC(cs.addressReg(x));
    const dst = ARDEC(cs.addressReg(y));
    const extra = PackAdjustment(cs.pull16());
    return cs.checkOverflow({
      size,
      operation: Operation.UNPK,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1000000100000000) {
    const y = getBits(w0, 9, 3);
    const x = getBits(w0, 0, 3);
    const size = 1;
    const src = cs.dataRegOp(x);
    const dst = cs.dataRegOp(y);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.SBCD,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1000000100001000) {
    const y = getBits(w0, 9, 3);
    const x = getBits(w0, 0, 3);
    const size = 1;
    const src = ARDEC(cs.addressReg(x));
    const dst = ARDEC(cs.addressReg(y));
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.SBCD,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111000000) === 0b1000000111000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.ea(r, m, 2);
    const dst = cs.dataRegOp(d);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.DIVS,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111000000) === 0b1000000011000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.ea(r, m, 2);
    const dst = cs.dataRegOp(d);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.DIVU,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111000000) === 0b1000000000000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = cs.ea(r, m, size);
    const dst = cs.dataRegOp(d);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.OR,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111000000) === 0b1000000001000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.ea(r, m, size);
    const dst = cs.dataRegOp(d);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.OR,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111000000) === 0b1000000010000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.ea(r, m, size);
    const dst = cs.dataRegOp(d);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.OR,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111000000) === 0b1000000100000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = cs.dataRegOp(d);
    const dst = cs.ea(r, m, size);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.OR,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111000000) === 0b1000000101000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.dataRegOp(d);
    const dst = cs.ea(r, m, size);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.OR,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111000000) === 0b1000000110000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.dataRegOp(d);
    const dst = cs.ea(r, m, size);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.OR,
      operands: [src, dst],
      extra,
    });
  }
  throw new Error("NotImplemented");
}

function decodeGroup1001(w0: number, cs: CodeStream): DecodedInstruction {
  if ((w0 & 0b1111000111111000) === 0b1001000100000000) {
    const x = getBits(w0, 9, 3);
    const y = getBits(w0, 0, 3);
    const size = 1;
    const src = cs.dataRegOp(y);
    const dst = cs.dataRegOp(x);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.SUBX,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1001000101000000) {
    const x = getBits(w0, 9, 3);
    const y = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.dataRegOp(y);
    const dst = cs.dataRegOp(x);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.SUBX,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1001000110000000) {
    const x = getBits(w0, 9, 3);
    const y = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.dataRegOp(y);
    const dst = cs.dataRegOp(x);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.SUBX,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1001000100001000) {
    const x = getBits(w0, 9, 3);
    const y = getBits(w0, 0, 3);
    const size = 1;
    const src = ARDEC(cs.addressReg(y));
    const dst = ARDEC(cs.addressReg(x));
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.SUBX,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1001000101001000) {
    const x = getBits(w0, 9, 3);
    const y = getBits(w0, 0, 3);
    const size = 2;
    const src = ARDEC(cs.addressReg(y));
    const dst = ARDEC(cs.addressReg(x));
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.SUBX,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1001000110001000) {
    const x = getBits(w0, 9, 3);
    const y = getBits(w0, 0, 3);
    const size = 4;
    const src = ARDEC(cs.addressReg(y));
    const dst = ARDEC(cs.addressReg(x));
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.SUBX,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111000000) === 0b1001000000000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = cs.ea(r, m, size);
    const dst = cs.dataRegOp(d);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.SUB,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111000000) === 0b1001000001000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.ea(r, m, size);
    const dst = cs.dataRegOp(d);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.SUB,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111000000) === 0b1001000010000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.ea(r, m, size);
    const dst = cs.dataRegOp(d);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.SUB,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111000000) === 0b1001000100000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = cs.dataRegOp(d);
    const dst = cs.ea(r, m, size);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.SUB,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111000000) === 0b1001000101000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.dataRegOp(d);
    const dst = cs.ea(r, m, size);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.SUB,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111000000) === 0b1001000110000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.dataRegOp(d);
    const dst = cs.ea(r, m, size);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.SUB,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111000000) === 0b1001000011000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.ea(r, m, size);
    const dst = cs.addressRegOp(d);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.SUBA,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111000000) === 0b1001000111000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.ea(r, m, size);
    const dst = cs.addressRegOp(d);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.SUBA,
      operands: [src, dst],
      extra,
    });
  }
  throw new Error("NotImplemented");
}

function decodeGroup1011(w0: number, cs: CodeStream): DecodedInstruction {
  if ((w0 & 0b1111000111000000) === 0b1011000011000000) {
    const a = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.ea(r, m, size);
    const dst = cs.addressRegOp(a);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.CMPA,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111000000) === 0b1011000111000000) {
    const a = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.ea(r, m, size);
    const dst = cs.addressRegOp(a);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.CMPA,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1011000100001000) {
    const x = getBits(w0, 9, 3);
    const y = getBits(w0, 0, 3);
    const size = 1;
    const src = ARINC(cs.addressReg(y));
    const dst = ARINC(cs.addressReg(x));
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.CMPM,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1011000101001000) {
    const x = getBits(w0, 9, 3);
    const y = getBits(w0, 0, 3);
    const size = 2;
    const src = ARINC(cs.addressReg(y));
    const dst = ARINC(cs.addressReg(x));
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.CMPM,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1011000110001000) {
    const x = getBits(w0, 9, 3);
    const y = getBits(w0, 0, 3);
    const size = 4;
    const src = ARINC(cs.addressReg(y));
    const dst = ARINC(cs.addressReg(x));
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.CMPM,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111000000) === 0b1011000000000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = cs.ea(r, m, size);
    const dst = cs.dataRegOp(d);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.CMP,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111000000) === 0b1011000001000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.ea(r, m, size);
    const dst = cs.dataRegOp(d);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.CMP,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111000000) === 0b1011000010000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.ea(r, m, size);
    const dst = cs.dataRegOp(d);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.CMP,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111000000) === 0b1011000100000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = cs.dataRegOp(d);
    const dst = cs.ea(r, m, size);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.EOR,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111000000) === 0b1011000101000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.dataRegOp(d);
    const dst = cs.ea(r, m, size);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.EOR,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111000000) === 0b1011000110000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.dataRegOp(d);
    const dst = cs.ea(r, m, size);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.EOR,
      operands: [src, dst],
      extra,
    });
  }
  throw new Error("NotImplemented");
}

function decodeGroup1100(w0: number, cs: CodeStream): DecodedInstruction {
  if ((w0 & 0b1111000111111000) === 0b1100000100000000) {
    const y = getBits(w0, 9, 3);
    const x = getBits(w0, 0, 3);
    const size = 1;
    const src = cs.dataRegOp(x);
    const dst = cs.dataRegOp(y);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ABCD,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1100000100001000) {
    const y = getBits(w0, 9, 3);
    const x = getBits(w0, 0, 3);
    const size = 1;
    const src = ARDEC(cs.addressReg(x));
    const dst = ARDEC(cs.addressReg(y));
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ABCD,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111000000) === 0b1100000011000000) {
    const p = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.ea(r, m, 2);
    const dst = cs.dataRegOp(p);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.MULU,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111000000) === 0b1100000111000000) {
    const p = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.ea(r, m, 2);
    const dst = cs.dataRegOp(p);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.MULS,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1100000101000000) {
    const x = getBits(w0, 9, 3);
    const y = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.dataRegOp(x);
    const dst = cs.dataRegOp(y);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.EXG,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1100000101001000) {
    const x = getBits(w0, 9, 3);
    const y = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.addressRegOp(x);
    const dst = cs.addressRegOp(y);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.EXG,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1100000110001000) {
    const x = getBits(w0, 9, 3);
    const y = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.dataRegOp(x);
    const dst = cs.addressRegOp(y);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.EXG,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111000000) === 0b1100000000000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = cs.ea(r, m, size);
    const dst = cs.dataRegOp(d);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.AND,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111000000) === 0b1100000001000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.ea(r, m, size);
    const dst = cs.dataRegOp(d);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.AND,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111000000) === 0b1100000010000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.ea(r, m, size);
    const dst = cs.dataRegOp(d);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.AND,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111000000) === 0b1100000100000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = cs.dataRegOp(d);
    const dst = cs.ea(r, m, size);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.AND,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111000000) === 0b1100000101000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.dataRegOp(d);
    const dst = cs.ea(r, m, size);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.AND,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111000000) === 0b1100000110000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.dataRegOp(d);
    const dst = cs.ea(r, m, size);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.AND,
      operands: [src, dst],
      extra,
    });
  }
  throw new Error("NotImplemented");
}

function decodeGroup1101(w0: number, cs: CodeStream): DecodedInstruction {
  if ((w0 & 0b1111000111111000) === 0b1101000100000000) {
    const x = getBits(w0, 9, 3);
    const y = getBits(w0, 0, 3);
    const size = 1;
    const src = cs.dataRegOp(y);
    const dst = cs.dataRegOp(x);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ADDX,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1101000101000000) {
    const x = getBits(w0, 9, 3);
    const y = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.dataRegOp(y);
    const dst = cs.dataRegOp(x);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ADDX,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1101000110000000) {
    const x = getBits(w0, 9, 3);
    const y = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.dataRegOp(y);
    const dst = cs.dataRegOp(x);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ADDX,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1101000100001000) {
    const x = getBits(w0, 9, 3);
    const y = getBits(w0, 0, 3);
    const size = 1;
    const src = ARDEC(cs.addressReg(y));
    const dst = ARDEC(cs.addressReg(x));
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ADDX,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1101000101001000) {
    const x = getBits(w0, 9, 3);
    const y = getBits(w0, 0, 3);
    const size = 2;
    const src = ARDEC(cs.addressReg(y));
    const dst = ARDEC(cs.addressReg(x));
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ADDX,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1101000110001000) {
    const x = getBits(w0, 9, 3);
    const y = getBits(w0, 0, 3);
    const size = 4;
    const src = ARDEC(cs.addressReg(y));
    const dst = ARDEC(cs.addressReg(x));
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ADDX,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111000000) === 0b1101000000000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = cs.ea(r, m, size);
    const dst = cs.dataRegOp(d);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ADD,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111000000) === 0b1101000001000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.ea(r, m, size);
    const dst = cs.dataRegOp(d);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ADD,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111000000) === 0b1101000010000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.ea(r, m, size);
    const dst = cs.dataRegOp(d);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ADD,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111000000) === 0b1101000100000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = cs.dataRegOp(d);
    const dst = cs.ea(r, m, size);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ADD,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111000000) === 0b1101000101000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.dataRegOp(d);
    const dst = cs.ea(r, m, size);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ADD,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111000000) === 0b1101000110000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.dataRegOp(d);
    const dst = cs.ea(r, m, size);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ADD,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111000000) === 0b1101000011000000) {
    const a = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.ea(r, m, size);
    const dst = cs.addressRegOp(a);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ADDA,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111000000) === 0b1101000111000000) {
    const a = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.ea(r, m, size);
    const dst = cs.addressRegOp(a);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ADDA,
      operands: [src, dst],
      extra,
    });
  }
  throw new Error("NotImplemented");
}

function decodeGroup1110(w0: number, cs: CodeStream): DecodedInstruction {
  if ((w0 & 0b1111111111000000) === 0b1110101011000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1111000000000000) === 0b0000000000000000) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const O = getBits(w1, 11, 1);
      const o = getBits(w1, 6, 5);
      const W = getBits(w1, 5, 1);
      const w = getBits(w1, 0, 5);
      cs.skipWords(1);
      const extra: InstructionExtra | null = cs.bitfield(O, o, W, w);
      const size = 0;
      const src: Operand | null = null;
      const dst = cs.ea(r, m, 0);
      return cs.checkOverflow({
        size,
        operation: Operation.BFCHG,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1110110011000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1111000000000000) === 0b0000000000000000) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const O = getBits(w1, 11, 1);
      const o = getBits(w1, 6, 5);
      const W = getBits(w1, 5, 1);
      const w = getBits(w1, 0, 5);
      cs.skipWords(1);
      const extra: InstructionExtra | null = cs.bitfield(O, o, W, w);
      const size = 0;
      const src: Operand | null = null;
      const dst = cs.ea(r, m, 0);
      return cs.checkOverflow({
        size,
        operation: Operation.BFCLR,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1110101111000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1000000000000000) === 0b0000000000000000) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const d = getBits(w1, 12, 3);
      const O = getBits(w1, 11, 1);
      const o = getBits(w1, 6, 5);
      const W = getBits(w1, 5, 1);
      const w = getBits(w1, 0, 5);
      cs.skipWords(1);
      const extra: InstructionExtra | null = cs.bitfield(O, o, W, w);
      const size = 0;
      const src = cs.ea(r, m, 0);
      const dst = cs.dataRegOp(d);
      return cs.checkOverflow({
        size,
        operation: Operation.BFEXTS,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1110100111000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1000000000000000) === 0b0000000000000000) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const d = getBits(w1, 12, 3);
      const O = getBits(w1, 11, 1);
      const o = getBits(w1, 6, 5);
      const W = getBits(w1, 5, 1);
      const w = getBits(w1, 0, 5);
      cs.skipWords(1);
      const extra: InstructionExtra | null = cs.bitfield(O, o, W, w);
      const size = 0;
      const src = cs.ea(r, m, 0);
      const dst = cs.dataRegOp(d);
      return cs.checkOverflow({
        size,
        operation: Operation.BFEXTU,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1110110111000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1000000000000000) === 0b0000000000000000) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const d = getBits(w1, 12, 3);
      const O = getBits(w1, 11, 1);
      const o = getBits(w1, 6, 5);
      const W = getBits(w1, 5, 1);
      const w = getBits(w1, 0, 5);
      cs.skipWords(1);
      const extra: InstructionExtra | null = cs.bitfield(O, o, W, w);
      const size = 0;
      const src = cs.ea(r, m, 0);
      const dst = cs.dataRegOp(d);
      return cs.checkOverflow({
        size,
        operation: Operation.BFFFO,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1110111111000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1000000000000000) === 0b0000000000000000) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const d = getBits(w1, 12, 3);
      const O = getBits(w1, 11, 1);
      const o = getBits(w1, 6, 5);
      const W = getBits(w1, 5, 1);
      const w = getBits(w1, 0, 5);
      cs.skipWords(1);
      const extra: InstructionExtra | null = cs.bitfield(O, o, W, w);
      const size = 0;
      const src = cs.dataRegOp(d);
      const dst = cs.ea(r, m, 0);
      return cs.checkOverflow({
        size,
        operation: Operation.BFINS,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1110111011000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1111000000000000) === 0b0000000000000000) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const O = getBits(w1, 11, 1);
      const o = getBits(w1, 6, 5);
      const W = getBits(w1, 5, 1);
      const w = getBits(w1, 0, 5);
      cs.skipWords(1);
      const extra: InstructionExtra | null = cs.bitfield(O, o, W, w);
      const size = 0;
      const src: Operand | null = null;
      const dst = cs.ea(r, m, 0);
      return cs.checkOverflow({
        size,
        operation: Operation.BFSET,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1110100011000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1111000000000000) === 0b0000000000000000) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const O = getBits(w1, 11, 1);
      const o = getBits(w1, 6, 5);
      const W = getBits(w1, 5, 1);
      const w = getBits(w1, 0, 5);
      cs.skipWords(1);
      const extra: InstructionExtra | null = cs.bitfield(O, o, W, w);
      const size = 0;
      const src: Operand | null = null;
      const dst = cs.ea(r, m, 0);
      return cs.checkOverflow({
        size,
        operation: Operation.BFTST,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111000111111000) === 0b1110000100000000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = IMM8(c);
    const dst = cs.dataRegOp(r);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ASL,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1110000101000000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = IMM8(c);
    const dst = cs.dataRegOp(r);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ASL,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1110000110000000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = IMM8(c);
    const dst = cs.dataRegOp(r);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ASL,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1110000000000000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = IMM8(c);
    const dst = cs.dataRegOp(r);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ASR,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1110000001000000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = IMM8(c);
    const dst = cs.dataRegOp(r);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ASR,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1110000010000000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = IMM8(c);
    const dst = cs.dataRegOp(r);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ASR,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1110000100100000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = cs.dataRegOp(c);
    const dst = cs.dataRegOp(r);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ASL,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1110000101100000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.dataRegOp(c);
    const dst = cs.dataRegOp(r);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ASL,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1110000110100000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.dataRegOp(c);
    const dst = cs.dataRegOp(r);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ASL,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1110000000100000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = cs.dataRegOp(c);
    const dst = cs.dataRegOp(r);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ASR,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1110000001100000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.dataRegOp(c);
    const dst = cs.dataRegOp(r);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ASR,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1110000010100000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.dataRegOp(c);
    const dst = cs.dataRegOp(r);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ASR,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1110000100001000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = IMM8(c);
    const dst = cs.dataRegOp(r);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.LSL,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1110000101001000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = IMM8(c);
    const dst = cs.dataRegOp(r);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.LSL,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1110000110001000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = IMM8(c);
    const dst = cs.dataRegOp(r);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.LSL,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1110000000001000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = IMM8(c);
    const dst = cs.dataRegOp(r);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.LSR,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1110000001001000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = IMM8(c);
    const dst = cs.dataRegOp(r);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.LSR,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1110000010001000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = IMM8(c);
    const dst = cs.dataRegOp(r);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.LSR,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1110000100101000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = cs.dataRegOp(c);
    const dst = cs.dataRegOp(r);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.LSL,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1110000101101000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.dataRegOp(c);
    const dst = cs.dataRegOp(r);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.LSL,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1110000110101000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.dataRegOp(c);
    const dst = cs.dataRegOp(r);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.LSL,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1110000000101000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = cs.dataRegOp(c);
    const dst = cs.dataRegOp(r);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.LSR,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1110000001101000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.dataRegOp(c);
    const dst = cs.dataRegOp(r);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.LSR,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1110000010101000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.dataRegOp(c);
    const dst = cs.dataRegOp(r);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.LSR,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1110000100010000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = IMM8(c);
    const dst = cs.dataRegOp(r);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ROXL,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1110000101010000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = IMM8(c);
    const dst = cs.dataRegOp(r);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ROXL,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1110000110010000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = IMM8(c);
    const dst = cs.dataRegOp(r);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ROXL,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1110000000010000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = IMM8(c);
    const dst = cs.dataRegOp(r);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ROXR,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1110000001010000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = IMM8(c);
    const dst = cs.dataRegOp(r);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ROXR,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1110000010010000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = IMM8(c);
    const dst = cs.dataRegOp(r);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ROXR,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1110000100110000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = cs.dataRegOp(c);
    const dst = cs.dataRegOp(r);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ROXL,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1110000101110000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.dataRegOp(c);
    const dst = cs.dataRegOp(r);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ROXL,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1110000110110000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.dataRegOp(c);
    const dst = cs.dataRegOp(r);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ROXL,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1110000000110000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = cs.dataRegOp(c);
    const dst = cs.dataRegOp(r);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ROXR,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1110000001110000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.dataRegOp(c);
    const dst = cs.dataRegOp(r);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ROXR,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1110000010110000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.dataRegOp(c);
    const dst = cs.dataRegOp(r);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ROXR,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1110000100011000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = IMM8(c);
    const dst = cs.dataRegOp(r);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ROL,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1110000101011000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = IMM8(c);
    const dst = cs.dataRegOp(r);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ROL,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1110000110011000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = IMM8(c);
    const dst = cs.dataRegOp(r);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ROL,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1110000000011000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = IMM8(c);
    const dst = cs.dataRegOp(r);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ROR,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1110000001011000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = IMM8(c);
    const dst = cs.dataRegOp(r);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ROR,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1110000010011000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = IMM8(c);
    const dst = cs.dataRegOp(r);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ROR,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1110000100111000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = cs.dataRegOp(c);
    const dst = cs.dataRegOp(r);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ROL,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1110000101111000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.dataRegOp(c);
    const dst = cs.dataRegOp(r);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ROL,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1110000110111000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.dataRegOp(c);
    const dst = cs.dataRegOp(r);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ROL,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1110000000111000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = cs.dataRegOp(c);
    const dst = cs.dataRegOp(r);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ROR,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1110000001111000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.dataRegOp(c);
    const dst = cs.dataRegOp(r);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ROR,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111000111111000) === 0b1110000010111000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.dataRegOp(c);
    const dst = cs.dataRegOp(r);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ROR,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111000000) === 0b1110000111000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = Implied();
    const dst = cs.ea(r, m, size);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ASL,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111000000) === 0b1110000011000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = Implied();
    const dst = cs.ea(r, m, size);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ASR,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111000000) === 0b1110001111000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = Implied();
    const dst = cs.ea(r, m, size);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.LSL,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111000000) === 0b1110001011000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = Implied();
    const dst = cs.ea(r, m, size);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.LSR,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111000000) === 0b1110010111000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = Implied();
    const dst = cs.ea(r, m, size);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ROXL,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111000000) === 0b1110010011000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = Implied();
    const dst = cs.ea(r, m, size);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ROXR,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111000000) === 0b1110011111000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = Implied();
    const dst = cs.ea(r, m, size);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ROL,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111000000) === 0b1110011011000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = Implied();
    const dst = cs.ea(r, m, size);
    const extra: InstructionExtra | null = null;
    return cs.checkOverflow({
      size,
      operation: Operation.ROR,
      operands: [src, dst],
      extra,
    });
  }
  throw new Error("NotImplemented");
}

function decodeGroup1111(w0: number, cs: CodeStream): DecodedInstruction {
  if ((w0 & 0b1111111111111111) === 0b1111001000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1111110000000000) === 0b0101110000000000) {
      const d = getBits(w1, 7, 3);
      const o = getBits(w1, 0, 7);
      cs.skipWords(1);
      const size = 10;
      const src = IMM8(o);
      const dst = cs.floatRegOp(d);
      const extra: InstructionExtra | null = null;
      return cs.checkOverflow({
        size,
        operation: Operation.FMOVECR,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1111001000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1010000001111111) === 0b0000000000011000) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const R = getBits(w1, 14, 1);
      const s = getBits(w1, 10, 3);
      const d = getBits(w1, 7, 3);
      cs.skipWords(1);
      const [size, src, dst, extra] = cs.decodeFp(r, m, R, s, d, 0);
      return cs.checkOverflow({
        size,
        operation: Operation.FABS,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1111001000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1010000001111111) === 0b0000000001011000) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const R = getBits(w1, 14, 1);
      const s = getBits(w1, 10, 3);
      const d = getBits(w1, 7, 3);
      cs.skipWords(1);
      const [size, src, dst, extra] = cs.decodeFp(r, m, R, s, d, 0);
      return cs.checkOverflow({
        size,
        operation: Operation.FSABS,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1111001000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1010000001111111) === 0b0000000001011100) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const R = getBits(w1, 14, 1);
      const s = getBits(w1, 10, 3);
      const d = getBits(w1, 7, 3);
      cs.skipWords(1);
      const [size, src, dst, extra] = cs.decodeFp(r, m, R, s, d, 0);
      return cs.checkOverflow({
        size,
        operation: Operation.FDABS,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1111001000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1010000001111111) === 0b0000000000011100) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const R = getBits(w1, 14, 1);
      const s = getBits(w1, 10, 3);
      const d = getBits(w1, 7, 3);
      cs.skipWords(1);
      const [size, src, dst, extra] = cs.decodeFp(r, m, R, s, d, 0);
      return cs.checkOverflow({
        size,
        operation: Operation.FACOS,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1111001000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1010000001111111) === 0b0000000000100010) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const R = getBits(w1, 14, 1);
      const s = getBits(w1, 10, 3);
      const d = getBits(w1, 7, 3);
      cs.skipWords(1);
      const [size, src, dst, extra] = cs.decodeFp(r, m, R, s, d, 0);
      return cs.checkOverflow({
        size,
        operation: Operation.FADD,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1111001000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1010000001111111) === 0b0000000001100010) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const R = getBits(w1, 14, 1);
      const s = getBits(w1, 10, 3);
      const d = getBits(w1, 7, 3);
      cs.skipWords(1);
      const [size, src, dst, extra] = cs.decodeFp(r, m, R, s, d, 0);
      return cs.checkOverflow({
        size,
        operation: Operation.FSADD,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1111001000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1010000001111111) === 0b0000000001100110) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const R = getBits(w1, 14, 1);
      const s = getBits(w1, 10, 3);
      const d = getBits(w1, 7, 3);
      cs.skipWords(1);
      const [size, src, dst, extra] = cs.decodeFp(r, m, R, s, d, 0);
      return cs.checkOverflow({
        size,
        operation: Operation.FDADD,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1111001000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1010000001111111) === 0b0000000000001100) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const R = getBits(w1, 14, 1);
      const s = getBits(w1, 10, 3);
      const d = getBits(w1, 7, 3);
      cs.skipWords(1);
      const [size, src, dst, extra] = cs.decodeFp(r, m, R, s, d, 0);
      return cs.checkOverflow({
        size,
        operation: Operation.FASIN,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1111001000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1010000001111111) === 0b0000000000001010) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const R = getBits(w1, 14, 1);
      const s = getBits(w1, 10, 3);
      const d = getBits(w1, 7, 3);
      cs.skipWords(1);
      const [size, src, dst, extra] = cs.decodeFp(r, m, R, s, d, 0);
      return cs.checkOverflow({
        size,
        operation: Operation.FATAN,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1111001000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1010000001111111) === 0b0000000000001101) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const R = getBits(w1, 14, 1);
      const s = getBits(w1, 10, 3);
      const d = getBits(w1, 7, 3);
      cs.skipWords(1);
      const [size, src, dst, extra] = cs.decodeFp(r, m, R, s, d, 0);
      return cs.checkOverflow({
        size,
        operation: Operation.FATANH,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111111111) === 0b1111001010000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1111111111111111) === 0b0000000000000000) {
      cs.skipWords(1);
      const size = 0;
      const src: Operand | null = null;
      const dst: Operand | null = null;
      const extra: InstructionExtra | null = null;
      return cs.checkOverflow({
        size,
        operation: Operation.FNOP,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1111001010000000) {
    const c = getBits(w0, 0, 6);
    const size = 2;
    const src = PCDISP(2, simpleDisp(i16(cs.pull16())));
    const dst: Operand | null = null;
    const extra: InstructionExtra | null = cs.fpcc(c);
    return cs.checkOverflow({
      size,
      operation: Operation.FBCC,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111000000) === 0b1111001011000000) {
    const c = getBits(w0, 0, 6);
    const size = 4;
    const src = PCDISP(2, simpleDisp(i16(cs.pull32())));
    const dst: Operand | null = null;
    const extra: InstructionExtra | null = cs.fpcc(c);
    return cs.checkOverflow({
      size,
      operation: Operation.FBCC,
      operands: [src, dst],
      extra,
    });
  }
  if ((w0 & 0b1111111111000000) === 0b1111001000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1010000001111111) === 0b0000000000111000) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const R = getBits(w1, 14, 1);
      const s = getBits(w1, 10, 3);
      const d = getBits(w1, 7, 3);
      cs.skipWords(1);
      const [size, src, dst, extra] = cs.decodeFp(r, m, R, s, d, 0);
      return cs.checkOverflow({
        size,
        operation: Operation.FCMP,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1111001000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1010000001111111) === 0b0000000000011101) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const R = getBits(w1, 14, 1);
      const s = getBits(w1, 10, 3);
      const d = getBits(w1, 7, 3);
      cs.skipWords(1);
      const [size, src, dst, extra] = cs.decodeFp(r, m, R, s, d, 0);
      return cs.checkOverflow({
        size,
        operation: Operation.FCOS,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1111001000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1010000001111111) === 0b0000000000011001) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const R = getBits(w1, 14, 1);
      const s = getBits(w1, 10, 3);
      const d = getBits(w1, 7, 3);
      cs.skipWords(1);
      const [size, src, dst, extra] = cs.decodeFp(r, m, R, s, d, 0);
      return cs.checkOverflow({
        size,
        operation: Operation.FCOSH,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111111000) === 0b1111001001001000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1111111111100000) === 0b0000000000000000) {
      const r = getBits(w0, 0, 3);
      const c = getBits(w1, 0, 5);
      cs.skipWords(1);
      const size = 2;
      const src = cs.dataRegOp(r);
      const dst = PCDISP(4, simpleDisp(i16(cs.pull16())));
      const extra: InstructionExtra | null = cs.fpcc(c);
      return cs.checkOverflow({
        size,
        operation: Operation.FDBCC,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1111001000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1010000001111111) === 0b0000000000100000) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const R = getBits(w1, 14, 1);
      const s = getBits(w1, 10, 3);
      const d = getBits(w1, 7, 3);
      cs.skipWords(1);
      const [size, src, dst, extra] = cs.decodeFp(r, m, R, s, d, 0);
      return cs.checkOverflow({
        size,
        operation: Operation.FDIV,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1111001000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1010000001111111) === 0b0000000001100000) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const R = getBits(w1, 14, 1);
      const s = getBits(w1, 10, 3);
      const d = getBits(w1, 7, 3);
      cs.skipWords(1);
      const [size, src, dst, extra] = cs.decodeFp(r, m, R, s, d, 0);
      return cs.checkOverflow({
        size,
        operation: Operation.FSDIV,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1111001000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1010000001111111) === 0b0000000001100100) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const R = getBits(w1, 14, 1);
      const s = getBits(w1, 10, 3);
      const d = getBits(w1, 7, 3);
      cs.skipWords(1);
      const [size, src, dst, extra] = cs.decodeFp(r, m, R, s, d, 0);
      return cs.checkOverflow({
        size,
        operation: Operation.FDDIV,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1111001000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1010000001111111) === 0b0000000000010000) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const R = getBits(w1, 14, 1);
      const s = getBits(w1, 10, 3);
      const d = getBits(w1, 7, 3);
      cs.skipWords(1);
      const [size, src, dst, extra] = cs.decodeFp(r, m, R, s, d, 0);
      return cs.checkOverflow({
        size,
        operation: Operation.FETOX,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1111001000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1010000001111111) === 0b0000000000001000) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const R = getBits(w1, 14, 1);
      const s = getBits(w1, 10, 3);
      const d = getBits(w1, 7, 3);
      cs.skipWords(1);
      const [size, src, dst, extra] = cs.decodeFp(r, m, R, s, d, 0);
      return cs.checkOverflow({
        size,
        operation: Operation.FETOXM1,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1111001000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1010000001111111) === 0b0000000000011110) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const R = getBits(w1, 14, 1);
      const s = getBits(w1, 10, 3);
      const d = getBits(w1, 7, 3);
      cs.skipWords(1);
      const [size, src, dst, extra] = cs.decodeFp(r, m, R, s, d, 0);
      return cs.checkOverflow({
        size,
        operation: Operation.FGETEXP,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1111001000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1010000001111111) === 0b0000000000011111) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const R = getBits(w1, 14, 1);
      const s = getBits(w1, 10, 3);
      const d = getBits(w1, 7, 3);
      cs.skipWords(1);
      const [size, src, dst, extra] = cs.decodeFp(r, m, R, s, d, 0);
      return cs.checkOverflow({
        size,
        operation: Operation.FGETMAN,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1111001000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1010000001111111) === 0b0000000000011111) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const R = getBits(w1, 14, 1);
      const s = getBits(w1, 10, 3);
      const d = getBits(w1, 7, 3);
      cs.skipWords(1);
      const [size, src, dst, extra] = cs.decodeFp(r, m, R, s, d, 0);
      return cs.checkOverflow({
        size,
        operation: Operation.FGETMAN,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1111001000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1010000001111111) === 0b0000000000000001) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const R = getBits(w1, 14, 1);
      const s = getBits(w1, 10, 3);
      const d = getBits(w1, 7, 3);
      cs.skipWords(1);
      const [size, src, dst, extra] = cs.decodeFp(r, m, R, s, d, 0);
      return cs.checkOverflow({
        size,
        operation: Operation.FINT,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1111001000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1010000001111111) === 0b0000000000000011) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const R = getBits(w1, 14, 1);
      const s = getBits(w1, 10, 3);
      const d = getBits(w1, 7, 3);
      cs.skipWords(1);
      const [size, src, dst, extra] = cs.decodeFp(r, m, R, s, d, 0);
      return cs.checkOverflow({
        size,
        operation: Operation.FINTRZ,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1111001000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1010000001111111) === 0b0000000000010101) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const R = getBits(w1, 14, 1);
      const s = getBits(w1, 10, 3);
      const d = getBits(w1, 7, 3);
      cs.skipWords(1);
      const [size, src, dst, extra] = cs.decodeFp(r, m, R, s, d, 0);
      return cs.checkOverflow({
        size,
        operation: Operation.FLOG10,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1111001000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1010000001111111) === 0b0000000000010110) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const R = getBits(w1, 14, 1);
      const s = getBits(w1, 10, 3);
      const d = getBits(w1, 7, 3);
      cs.skipWords(1);
      const [size, src, dst, extra] = cs.decodeFp(r, m, R, s, d, 0);
      return cs.checkOverflow({
        size,
        operation: Operation.FLOG2,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1111001000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1010000001111111) === 0b0000000000010100) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const R = getBits(w1, 14, 1);
      const s = getBits(w1, 10, 3);
      const d = getBits(w1, 7, 3);
      cs.skipWords(1);
      const [size, src, dst, extra] = cs.decodeFp(r, m, R, s, d, 0);
      return cs.checkOverflow({
        size,
        operation: Operation.FLOGN,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1111001000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1010000001111111) === 0b0000000000000110) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const R = getBits(w1, 14, 1);
      const s = getBits(w1, 10, 3);
      const d = getBits(w1, 7, 3);
      cs.skipWords(1);
      const [size, src, dst, extra] = cs.decodeFp(r, m, R, s, d, 0);
      return cs.checkOverflow({
        size,
        operation: Operation.FLOGNP1,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1111001000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1010000001111111) === 0b0000000000100001) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const R = getBits(w1, 14, 1);
      const s = getBits(w1, 10, 3);
      const d = getBits(w1, 7, 3);
      cs.skipWords(1);
      const [size, src, dst, extra] = cs.decodeFp(r, m, R, s, d, 0);
      return cs.checkOverflow({
        size,
        operation: Operation.FMOD,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1111001000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1110000000000000) === 0b0110000000000000) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const s = getBits(w1, 10, 3);
      const d = getBits(w1, 7, 3);
      const k = getBits(w1, 0, 7);
      cs.skipWords(1);
      const [size, dst, src, extra] = cs.decodeFp(r, m, 1, s, d, k);
      return cs.checkOverflow({
        size,
        operation: Operation.FMOVE,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1111001000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1010000001111111) === 0b0000000000000000) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const R = getBits(w1, 14, 1);
      const s = getBits(w1, 10, 3);
      const d = getBits(w1, 7, 3);
      cs.skipWords(1);
      const [size, src, dst, extra] = cs.decodeFp(r, m, R, s, d, 0);
      return cs.checkOverflow({
        size,
        operation: Operation.FMOVE,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1111001000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1010000001111111) === 0b0000000001000000) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const R = getBits(w1, 14, 1);
      const s = getBits(w1, 10, 3);
      const d = getBits(w1, 7, 3);
      cs.skipWords(1);
      const [size, src, dst, extra] = cs.decodeFp(r, m, R, s, d, 0);
      return cs.checkOverflow({
        size,
        operation: Operation.FSMOVE,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1111001000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1010000001111111) === 0b0000000001000100) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const R = getBits(w1, 14, 1);
      const s = getBits(w1, 10, 3);
      const d = getBits(w1, 7, 3);
      cs.skipWords(1);
      const [size, src, dst, extra] = cs.decodeFp(r, m, R, s, d, 0);
      return cs.checkOverflow({
        size,
        operation: Operation.FDMOVE,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1111001000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1100011100000000) === 0b1100000000000000) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const D = getBits(w1, 13, 1);
      const o = getBits(w1, 11, 2);
      const M = getBits(w1, 0, 8);
      cs.skipWords(1);
      const [size, src, dst, extra] = cs.decodeFpMovem(r, m, D, M, o);
      return cs.checkOverflow({
        size,
        operation: Operation.FMOVEM,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1111001000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1010000001111111) === 0b0000000000100011) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const R = getBits(w1, 14, 1);
      const s = getBits(w1, 10, 3);
      const d = getBits(w1, 7, 3);
      cs.skipWords(1);
      const [size, src, dst, extra] = cs.decodeFp(r, m, R, s, d, 0);
      return cs.checkOverflow({
        size,
        operation: Operation.FMUL,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1111001000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1010000001111111) === 0b0000000001100011) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const R = getBits(w1, 14, 1);
      const s = getBits(w1, 10, 3);
      const d = getBits(w1, 7, 3);
      cs.skipWords(1);
      const [size, src, dst, extra] = cs.decodeFp(r, m, R, s, d, 0);
      return cs.checkOverflow({
        size,
        operation: Operation.FSMUL,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1111001000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1010000001111111) === 0b0000000001100111) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const R = getBits(w1, 14, 1);
      const s = getBits(w1, 10, 3);
      const d = getBits(w1, 7, 3);
      cs.skipWords(1);
      const [size, src, dst, extra] = cs.decodeFp(r, m, R, s, d, 0);
      return cs.checkOverflow({
        size,
        operation: Operation.FDMUL,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1111001000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1010000001111111) === 0b0000000000011010) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const R = getBits(w1, 14, 1);
      const s = getBits(w1, 10, 3);
      const d = getBits(w1, 7, 3);
      cs.skipWords(1);
      const [size, src, dst, extra] = cs.decodeFp(r, m, R, s, d, 0);
      return cs.checkOverflow({
        size,
        operation: Operation.FNEG,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1111001000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1010000001111111) === 0b0000000001011010) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const R = getBits(w1, 14, 1);
      const s = getBits(w1, 10, 3);
      const d = getBits(w1, 7, 3);
      cs.skipWords(1);
      const [size, src, dst, extra] = cs.decodeFp(r, m, R, s, d, 0);
      return cs.checkOverflow({
        size,
        operation: Operation.FSNEG,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1111001000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1010000001111111) === 0b0000000001011110) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const R = getBits(w1, 14, 1);
      const s = getBits(w1, 10, 3);
      const d = getBits(w1, 7, 3);
      cs.skipWords(1);
      const [size, src, dst, extra] = cs.decodeFp(r, m, R, s, d, 0);
      return cs.checkOverflow({
        size,
        operation: Operation.FDNEG,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1111001000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1010000001111111) === 0b0000000000100101) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const R = getBits(w1, 14, 1);
      const s = getBits(w1, 10, 3);
      const d = getBits(w1, 7, 3);
      cs.skipWords(1);
      const [size, src, dst, extra] = cs.decodeFp(r, m, R, s, d, 0);
      return cs.checkOverflow({
        size,
        operation: Operation.FREM,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1111001000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1010000001111111) === 0b0000000000100110) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const R = getBits(w1, 14, 1);
      const s = getBits(w1, 10, 3);
      const d = getBits(w1, 7, 3);
      cs.skipWords(1);
      const [size, src, dst, extra] = cs.decodeFp(r, m, R, s, d, 0);
      return cs.checkOverflow({
        size,
        operation: Operation.FSCALE,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111111111) === 0b1111001001111010 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1111111111000000) === 0b0000000000000000) {
      const c = getBits(w1, 0, 6);
      cs.skipWords(1);
      const size = 2;
      const src = Implied();
      const dst = cs.imm16();
      const extra: InstructionExtra | null = cs.fpcc(c);
      return cs.checkOverflow({
        size,
        operation: Operation.FTRAPCC,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111111111) === 0b1111001001111011 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1111111111000000) === 0b0000000000000000) {
      const c = getBits(w1, 0, 6);
      cs.skipWords(1);
      const size = 4;
      const src = Implied();
      const dst = cs.imm32();
      const extra: InstructionExtra | null = cs.fpcc(c);
      return cs.checkOverflow({
        size,
        operation: Operation.FTRAPCC,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111111111) === 0b1111001001111100 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1111111111000000) === 0b0000000000000000) {
      const c = getBits(w1, 0, 6);
      cs.skipWords(1);
      const size = 0;
      const src = Implied();
      const dst: Operand | null = null;
      const extra: InstructionExtra | null = cs.fpcc(c);
      return cs.checkOverflow({
        size,
        operation: Operation.FTRAPCC,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1111001001000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1111111111000000) === 0b0000000000000000) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const c = getBits(w1, 0, 6);
      cs.skipWords(1);
      const size = 1;
      const src = Implied();
      const dst = cs.ea(r, m, 1);
      const extra: InstructionExtra | null = cs.fpcc(c);
      return cs.checkOverflow({
        size,
        operation: Operation.FSCC,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1111001000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1010000001111111) === 0b0000000000100100) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const R = getBits(w1, 14, 1);
      const s = getBits(w1, 10, 3);
      const d = getBits(w1, 7, 3);
      cs.skipWords(1);
      const [size, src, dst, extra] = cs.decodeFp(r, m, R, s, d, 0);
      return cs.checkOverflow({
        size,
        operation: Operation.FSGLDIV,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1111001000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1010000001111111) === 0b0000000000100111) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const R = getBits(w1, 14, 1);
      const s = getBits(w1, 10, 3);
      const d = getBits(w1, 7, 3);
      cs.skipWords(1);
      const [size, src, dst, extra] = cs.decodeFp(r, m, R, s, d, 0);
      return cs.checkOverflow({
        size,
        operation: Operation.FSGLMUL,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1111001000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1010000001111111) === 0b0000000000001110) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const R = getBits(w1, 14, 1);
      const s = getBits(w1, 10, 3);
      const d = getBits(w1, 7, 3);
      cs.skipWords(1);
      const [size, src, dst, extra] = cs.decodeFp(r, m, R, s, d, 0);
      return cs.checkOverflow({
        size,
        operation: Operation.FSIN,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1111001000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1010000001111000) === 0b0000000000110000) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const R = getBits(w1, 14, 1);
      const s = getBits(w1, 10, 3);
      const S = getBits(w1, 7, 3);
      const C = getBits(w1, 0, 3);
      cs.skipWords(1);
      const [size, src, _dst, extra] = cs.decodeFp(r, m, R, s, S, 0);
      const dst = FPAIR(cs.floatReg(S), cs.floatReg(C));
      return cs.checkOverflow({
        size,
        operation: Operation.FSINCOS,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1111001000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1010000001111111) === 0b0000000000000010) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const R = getBits(w1, 14, 1);
      const s = getBits(w1, 10, 3);
      const d = getBits(w1, 7, 3);
      cs.skipWords(1);
      const [size, src, dst, extra] = cs.decodeFp(r, m, R, s, d, 0);
      return cs.checkOverflow({
        size,
        operation: Operation.FSINH,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1111001000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1010000001111111) === 0b0000000000000100) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const R = getBits(w1, 14, 1);
      const s = getBits(w1, 10, 3);
      const d = getBits(w1, 7, 3);
      cs.skipWords(1);
      const [size, src, dst, extra] = cs.decodeFp(r, m, R, s, d, 0);
      return cs.checkOverflow({
        size,
        operation: Operation.FSQRT,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1111001000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1010000001111111) === 0b0000000001000001) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const R = getBits(w1, 14, 1);
      const s = getBits(w1, 10, 3);
      const d = getBits(w1, 7, 3);
      cs.skipWords(1);
      const [size, src, dst, extra] = cs.decodeFp(r, m, R, s, d, 0);
      return cs.checkOverflow({
        size,
        operation: Operation.FSSQRT,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1111001000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1010000001111111) === 0b0000000001000101) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const R = getBits(w1, 14, 1);
      const s = getBits(w1, 10, 3);
      const d = getBits(w1, 7, 3);
      cs.skipWords(1);
      const [size, src, dst, extra] = cs.decodeFp(r, m, R, s, d, 0);
      return cs.checkOverflow({
        size,
        operation: Operation.FDSQRT,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1111001000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1010000001111111) === 0b0000000000101000) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const R = getBits(w1, 14, 1);
      const s = getBits(w1, 10, 3);
      const d = getBits(w1, 7, 3);
      cs.skipWords(1);
      const [size, src, dst, extra] = cs.decodeFp(r, m, R, s, d, 0);
      return cs.checkOverflow({
        size,
        operation: Operation.FSUB,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1111001000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1010000001111111) === 0b0000000001101000) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const R = getBits(w1, 14, 1);
      const s = getBits(w1, 10, 3);
      const d = getBits(w1, 7, 3);
      cs.skipWords(1);
      const [size, src, dst, extra] = cs.decodeFp(r, m, R, s, d, 0);
      return cs.checkOverflow({
        size,
        operation: Operation.FSSUB,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1111001000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1010000001111111) === 0b0000000001101100) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const R = getBits(w1, 14, 1);
      const s = getBits(w1, 10, 3);
      const d = getBits(w1, 7, 3);
      cs.skipWords(1);
      const [size, src, dst, extra] = cs.decodeFp(r, m, R, s, d, 0);
      return cs.checkOverflow({
        size,
        operation: Operation.FDSUB,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1111001000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1010000001111111) === 0b0000000000001111) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const R = getBits(w1, 14, 1);
      const s = getBits(w1, 10, 3);
      const d = getBits(w1, 7, 3);
      cs.skipWords(1);
      const [size, src, dst, extra] = cs.decodeFp(r, m, R, s, d, 0);
      return cs.checkOverflow({
        size,
        operation: Operation.FTAN,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1111001000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1010000001111111) === 0b0000000000001001) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const R = getBits(w1, 14, 1);
      const s = getBits(w1, 10, 3);
      const d = getBits(w1, 7, 3);
      cs.skipWords(1);
      const [size, src, dst, extra] = cs.decodeFp(r, m, R, s, d, 0);
      return cs.checkOverflow({
        size,
        operation: Operation.FTANH,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1111001000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1010000001111111) === 0b0000000000010010) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const R = getBits(w1, 14, 1);
      const s = getBits(w1, 10, 3);
      const d = getBits(w1, 7, 3);
      cs.skipWords(1);
      const [size, src, dst, extra] = cs.decodeFp(r, m, R, s, d, 0);
      return cs.checkOverflow({
        size,
        operation: Operation.FTENTOX,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1111001000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1010000001111111) === 0b0000000000111010) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const R = getBits(w1, 14, 1);
      const s = getBits(w1, 10, 3);
      const d = getBits(w1, 7, 3);
      cs.skipWords(1);
      const [size, src, _dst, extra] = cs.decodeFp(r, m, R, s, d, 0);
      const dst: Operand | null = null;
      return cs.checkOverflow({
        size,
        operation: Operation.FTST,
        operands: [src, dst],
        extra,
      });
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1111001000000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1010000001111111) === 0b0000000000010001) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const R = getBits(w1, 14, 1);
      const s = getBits(w1, 10, 3);
      const d = getBits(w1, 7, 3);
      cs.skipWords(1);
      const [size, src, dst, extra] = cs.decodeFp(r, m, R, s, d, 0);
      return cs.checkOverflow({
        size,
        operation: Operation.FTWOTOX,
        operands: [src, dst],
        extra,
      });
    }
  }
  throw new Error("NotImplemented");
}
export function decodeInstruction(code: Uint8Array): DecodedInstruction {
  const cs = new CodeStream(code);
  const w0 = cs.pull16();
  switch (w0 >> 12) {
    case 0b0000:
      return decodeGroup0000(w0, cs);
    case 0b0001:
      return decodeGroup0001(w0, cs);
    case 0b0010:
      return decodeGroup0010(w0, cs);
    case 0b0011:
      return decodeGroup0011(w0, cs);
    case 0b0100:
      return decodeGroup0100(w0, cs);
    case 0b0101:
      return decodeGroup0101(w0, cs);
    case 0b0110:
      return decodeGroup0110(w0, cs);
    case 0b0111:
      return decodeGroup0111(w0, cs);
    case 0b1000:
      return decodeGroup1000(w0, cs);
    case 0b1001:
      return decodeGroup1001(w0, cs);
    case 0b1011:
      return decodeGroup1011(w0, cs);
    case 0b1100:
      return decodeGroup1100(w0, cs);
    case 0b1101:
      return decodeGroup1101(w0, cs);
    case 0b1110:
      return decodeGroup1110(w0, cs);
    case 0b1111:
      return decodeGroup1111(w0, cs);
    default:
      throw new Error("NotImplemented");
  }
}
