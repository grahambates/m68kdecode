import CodeStream from "./codestream";
import { simpleDisp, getBits, i16, i8, u8 } from "./lib";
import {
  DecodedInstruction,
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
  AR,
  FR,
} from "./types";

function decodeGroup0000(w0: number, cs: CodeStream): DecodedInstruction {
  if ((w0 & 0b1111111111111111) === 0b0000001000111100) {
    const size = 1;
    const src = cs.imm8();
    const dst = Implied();
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: {
        size,
        operation: "ANDITOCCR",
        operands: [src, dst],
        extra,
      },
    };
  }
  if ((w0 & 0b1111111111111111) === 0b0000001001111100) {
    const size = 2;
    const src = cs.imm16();
    const dst = Implied();
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ANDITOSR", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111111111) === 0b0000101000111100) {
    const size = 1;
    const src = cs.imm8();
    const dst = Implied();
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: {
        size,
        operation: "EORITOCCR",
        operands: [src, dst],
        extra,
      },
    };
  }
  if ((w0 & 0b1111111111111111) === 0b0000101001111100) {
    const size = 2;
    const src = cs.imm16();
    const dst = Implied();
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "EORITOSR", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111111111) === 0b0000000000111100) {
    const size = 1;
    const src = cs.imm8();
    const dst = Implied();
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ORITOCCR", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111111111) === 0b0000000001111100) {
    const size = 2;
    const src = cs.imm16();
    const dst = Implied();
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ORITOSR", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000110111000) === 0b0000000100001000) {
    const d = getBits(w0, 9, 3);
    const s = getBits(w0, 6, 1);
    const a = getBits(w0, 0, 3);
    const size = 1 << (s + 1);
    const src = ARIND(a);
    const dst = DR(d);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "MOVEP", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000110111000) === 0b0000000100101000) {
    const d = getBits(w0, 9, 3);
    const s = getBits(w0, 6, 1);
    const a = getBits(w0, 0, 3);
    const size = 1 << (s + 1);
    const src = DR(d);
    const dst = ARIND(a);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "MOVEP", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111000000) === 0b0000000100000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = DR(d);
    const dst = cs.ea(r, m, 2);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "BTST", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111000000) === 0b0000000101000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = DR(d);
    const dst = cs.ea(r, m, 4);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "BCHG", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111000000) === 0b0000000110000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = DR(d);
    const dst = cs.ea(r, m, 4);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "BCLR", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111000000) === 0b0000000111000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = DR(d);
    const dst = cs.ea(r, m, 4);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "BSET", operands: [src, dst], extra },
    };
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
      const extra = null;
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "BTST", operands: [src, dst], extra },
      };
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
      const extra = null;
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "BCHG", operands: [src, dst], extra },
      };
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
      const extra = null;
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "BCLR", operands: [src, dst], extra },
      };
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
      const extra = null;
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "BSET", operands: [src, dst], extra },
      };
    }
  }
  if ((w0 & 0b1111111111110000) === 0b0000011011000000) {
    const d = getBits(w0, 3, 1);
    const r = getBits(w0, 0, 3);
    const size = 0;
    const src = cs.dar(d, r);
    const dst = null;
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "RTM", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111000000) === 0b0000011011000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 0;
    const src = cs.imm8();
    const dst = cs.ea(r, m, 0);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "CALLM", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111000000) === 0b0000011000000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = cs.imm8();
    const dst = cs.ea(r, m, 1);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ADDI", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111000000) === 0b0000011001000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.imm16();
    const dst = cs.ea(r, m, 2);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ADDI", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111000000) === 0b0000011010000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.imm32();
    const dst = cs.ea(r, m, 4);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ADDI", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111000000) === 0b0000010000000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = cs.imm8();
    const dst = cs.ea(r, m, 1);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "SUBI", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111000000) === 0b0000010001000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.imm16();
    const dst = cs.ea(r, m, 2);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "SUBI", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111000000) === 0b0000010010000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.imm32();
    const dst = cs.ea(r, m, 4);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "SUBI", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111000000) === 0b0000001000000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = cs.imm8();
    const dst = cs.ea(r, m, 1);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ANDI", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111000000) === 0b0000001001000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.imm16();
    const dst = cs.ea(r, m, 2);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ANDI", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111000000) === 0b0000001010000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.imm32();
    const dst = cs.ea(r, m, 4);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ANDI", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111000000) === 0b0000000000000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = cs.imm8();
    const dst = cs.ea(r, m, 1);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ORI", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111000000) === 0b0000000001000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.imm16();
    const dst = cs.ea(r, m, 2);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ORI", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111000000) === 0b0000000010000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.imm32();
    const dst = cs.ea(r, m, 4);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ORI", operands: [src, dst], extra },
    };
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
      const extra = null;
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "CMP2", operands: [src, dst], extra },
      };
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
      const extra = null;
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "CHK2", operands: [src, dst], extra },
      };
    }
  }
  if ((w0 & 0b1111111111000000) === 0b0000101000000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = cs.imm8();
    const dst = cs.ea(r, m, 1);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "EORI", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111000000) === 0b0000101001000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.imm16();
    const dst = cs.ea(r, m, 2);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "EORI", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111000000) === 0b0000101010000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.imm32();
    const dst = cs.ea(r, m, 4);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "EORI", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111000000) === 0b0000110000000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = cs.imm8();
    const dst = cs.ea(r, m, 1);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "CMPI", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111000000) === 0b0000110001000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.imm16();
    const dst = cs.ea(r, m, 2);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "CMPI", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111000000) === 0b0000110010000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.imm32();
    const dst = cs.ea(r, m, 4);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "CMPI", operands: [src, dst], extra },
    };
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
      const extra = null;
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "MOVES", operands: [src, dst], extra },
      };
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
      const extra = null;
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "MOVES", operands: [src, dst], extra },
      };
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
      const extra = null;
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "MOVES", operands: [src, dst], extra },
      };
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
      const extra = null;
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "MOVES", operands: [src, dst], extra },
      };
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
      const extra = null;
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "MOVES", operands: [src, dst], extra },
      };
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
      const extra = null;
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "MOVES", operands: [src, dst], extra },
      };
    }
  }
  if ((w0 & 0b1111111111110000) === 0b0000011011000000) {
    const a = getBits(w0, 3, 1);
    const r = getBits(w0, 0, 3);
    const size = 0;
    const src = cs.dar(a, r);
    const dst = null;
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "RTM", operands: [src, dst], extra },
    };
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
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "MOVE", operands: [src, dst], extra },
    };
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
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "MOVEA", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000000000000) === 0b0010000000000000) {
    const R = getBits(w0, 9, 3);
    const M = getBits(w0, 6, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.ea(r, m, 4);
    const dst = cs.ea(R, M, 4);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "MOVE", operands: [src, dst], extra },
    };
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
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "MOVEA", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000000000000) === 0b0011000000000000) {
    const R = getBits(w0, 9, 3);
    const M = getBits(w0, 6, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.ea(r, m, 2);
    const dst = cs.ea(R, M, 2);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "MOVE", operands: [src, dst], extra },
    };
  }
  throw new Error("NotImplemented");
}

function decodeGroup0100(w0: number, cs: CodeStream): DecodedInstruction {
  if ((w0 & 0b1111111111111111) === 0b0100101011111010) {
    const size = 0;
    const src = null;
    const dst = null;
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "BGND", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111111111) === 0b0100101011111100) {
    const size = 0;
    const src = null;
    const dst = null;
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ILLEGAL", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111111111) === 0b0100111001110001) {
    const size = 0;
    const src = null;
    const dst = null;
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "NOP", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111111111) === 0b0100111001110000) {
    const size = 0;
    const src = null;
    const dst = null;
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "RESET", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111111111) === 0b0100111001110100) {
    const size = 0;
    const src = cs.imm16();
    const dst = null;
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "RTD", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111111111) === 0b0100111001110011) {
    const size = 0;
    const src = null;
    const dst = null;
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "RTE", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111111111) === 0b0100111001110111) {
    const size = 0;
    const src = null;
    const dst = null;
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "RTR", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111111111) === 0b0100111001110101) {
    const size = 0;
    const src = null;
    const dst = null;
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "RTS", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111111111) === 0b0100111001110010) {
    const size = 0;
    const src = cs.imm16();
    const dst = null;
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "STOP", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111111111) === 0b0100111001110110) {
    const size = 0;
    const src = null;
    const dst = null;
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "TRAPV", operands: [src, dst], extra },
    };
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
      const extra = null;
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "MOVEC", operands: [src, dst], extra },
      };
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
      const extra = null;
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "MOVEC", operands: [src, dst], extra },
      };
    }
  }
  if ((w0 & 0b1111111111111000) === 0b0100100001000000) {
    const r = getBits(w0, 0, 3);
    const size = 0;
    const src = DR(r);
    const dst = null;
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "SWAP", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111111000) === 0b0100100001001000) {
    const n = getBits(w0, 0, 3);
    const size = 0;
    const src = IMM8(u8(n));
    const dst = null;
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "BKPT", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111111000) === 0b0100100010000000) {
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = DR(r);
    const dst = null;
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "EXTW", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111111000) === 0b0100100011000000) {
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = DR(r);
    const dst = null;
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "EXTL", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111111000) === 0b0100100111000000) {
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = DR(r);
    const dst = null;
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "EXTBL", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111000000) === 0b0100000111000000) {
    const n = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.ea(r, m, 4);
    const dst = AR(n);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "LEA", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111111000) === 0b0100111001010000) {
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = AR(r);
    const dst = cs.imm16();
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "LINK", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111111000) === 0b0100100000001000) {
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = AR(r);
    const dst = cs.imm32();
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "LINK", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111111000) === 0b0100111001011000) {
    const r = getBits(w0, 0, 3);
    const size = 0;
    const src = AR(r);
    const dst = null;
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "UNLK", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111110000) === 0b0100111001000000) {
    const v = getBits(w0, 0, 4);
    const size = 0;
    const src = IMM8(u8(v));
    const dst = null;
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "TRAP", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111000000) === 0b0100110001000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1000111111111000) === 0b0000110000000000) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const q = getBits(w1, 12, 3);
      const R = getBits(w1, 0, 3);
      if (R != q) {
        cs.skipWords(1);
        const size = 4;
        const src = cs.ea(r, m, 4);
        const dst = DPAIR(q, R);
        const extra = null;
        return {
          bytesUsed: cs.pos,
          instruction: {
            size,
            operation: "DIVSL",
            operands: [src, dst],
            extra,
          },
        };
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
      const dst = DPAIR(q, R);
      const extra = null;
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "DIVSL", operands: [src, dst], extra },
      };
    }
  }
  if ((w0 & 0b1111111111000000) === 0b0100110001000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1000111111111000) === 0b0000100000000000) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const q = getBits(w1, 12, 3);
      const R = getBits(w1, 0, 3);
      if (R != q) {
        cs.skipWords(1);
        const size = 4;
        const src = cs.ea(r, m, 4);
        const dst = DPAIR(q, R);
        const extra = null;
        return {
          bytesUsed: cs.pos,
          instruction: {
            size,
            operation: "DIVSLL",
            operands: [src, dst],
            extra,
          },
        };
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
      const dst = DR(q);
      const extra = null;
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "DIVSL", operands: [src, dst], extra },
      };
    }
  }
  if ((w0 & 0b1111111111000000) === 0b0100110001000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1000111111111000) === 0b0000010000000000) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const q = getBits(w1, 12, 3);
      const R = getBits(w1, 0, 3);
      if (R != q) {
        cs.skipWords(1);
        const size = 4;
        const src = cs.ea(r, m, 4);
        const dst = DPAIR(q, R);
        const extra = null;
        return {
          bytesUsed: cs.pos,
          instruction: {
            size,
            operation: "DIVUL",
            operands: [src, dst],
            extra,
          },
        };
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
      const dst = DPAIR(q, R);
      const extra = null;
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "DIVUL", operands: [src, dst], extra },
      };
    }
  }
  if ((w0 & 0b1111111111000000) === 0b0100110001000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1000111111111000) === 0b0000000000000000) {
      const m = getBits(w0, 3, 3);
      const r = getBits(w0, 0, 3);
      const q = getBits(w1, 12, 3);
      const R = getBits(w1, 0, 3);
      if (R != q) {
        cs.skipWords(1);
        const size = 4;
        const src = cs.ea(r, m, 4);
        const dst = DPAIR(q, R);
        const extra = null;
        return {
          bytesUsed: cs.pos,
          instruction: {
            size,
            operation: "DIVULL",
            operands: [src, dst],
            extra,
          },
        };
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
      const dst = DR(q);
      const extra = null;
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "DIVUL", operands: [src, dst], extra },
      };
    }
  }
  if ((w0 & 0b1111111111000000) === 0b0100111011000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 0;
    const src = cs.ea(r, m, 0);
    const dst = null;
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "JMP", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111000000) === 0b0100111010000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 0;
    const src = cs.ea(r, m, 0);
    const dst = null;
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "JSR", operands: [src, dst], extra },
    };
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
      const dst = DR(l);
      const extra = null;
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "MULS", operands: [src, dst], extra },
      };
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
      const dst = DPAIR(l, h);
      const extra = null;
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "MULS", operands: [src, dst], extra },
      };
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
      const dst = DR(l);
      const extra = null;
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "MULU", operands: [src, dst], extra },
      };
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
      const dst = DPAIR(l, h);
      const extra = null;
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "MULU", operands: [src, dst], extra },
      };
    }
  }
  if ((w0 & 0b1111111111000000) === 0b0100100000000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = cs.ea(r, m, 1);
    const dst = null;
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "NBCD", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111000000) === 0b0100000011000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = Implied();
    const dst = cs.ea(r, m, 2);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: {
        size,
        operation: "MOVEFROMSR",
        operands: [src, dst],
        extra,
      },
    };
  }
  if ((w0 & 0b1111111111000000) === 0b0100011011000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.ea(r, m, 2);
    const dst = Implied();
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "MOVETOSR", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111111000) === 0b0100111001100000) {
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = AR(r);
    const dst = Implied();
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: {
        size,
        operation: "MOVETOUSP",
        operands: [src, dst],
        extra,
      },
    };
  }
  if ((w0 & 0b1111111111111000) === 0b0100111001101000) {
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = Implied();
    const dst = AR(r);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: {
        size,
        operation: "MOVEFROMUSP",
        operands: [src, dst],
        extra,
      },
    };
  }
  if ((w0 & 0b1111111111000000) === 0b0100001011000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = Implied();
    const dst = cs.ea(r, m, 2);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: {
        size,
        operation: "MOVEFROMCCR",
        operands: [src, dst],
        extra,
      },
    };
  }
  if ((w0 & 0b1111111111000000) === 0b0100010011000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.ea(r, m, 2);
    const dst = Implied();
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: {
        size,
        operation: "MOVETOCCR",
        operands: [src, dst],
        extra,
      },
    };
  }
  if ((w0 & 0b1111111111000000) === 0b0100100001000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.ea(r, m, 4);
    const dst = Implied();
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "PEA", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111000000) === 0b0100101011000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = cs.ea(r, m, 1);
    const dst = null;
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "TAS", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111110000000) === 0b0100100010000000) {
    const s = getBits(w0, 6, 1);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2 << s;
    const src = REGLIST(cs.pull16());
    const dst = cs.ea(r, m, size);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "MOVEM", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111110000000) === 0b0100110010000000) {
    const s = getBits(w0, 6, 1);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2 << s;
    const dst = REGLIST(cs.pull16());
    const src = cs.ea(r, m, size);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "MOVEM", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111000000) === 0b0100001000000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = Implied();
    const dst = cs.ea(r, m, size);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "CLR", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111000000) === 0b0100001001000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = Implied();
    const dst = cs.ea(r, m, size);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "CLR", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111000000) === 0b0100001010000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = Implied();
    const dst = cs.ea(r, m, size);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "CLR", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111000000) === 0b0100010000000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = Implied();
    const dst = cs.ea(r, m, size);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "NEG", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111000000) === 0b0100010001000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = Implied();
    const dst = cs.ea(r, m, size);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "NEG", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111000000) === 0b0100010010000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = Implied();
    const dst = cs.ea(r, m, size);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "NEG", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111000000) === 0b0100000000000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = Implied();
    const dst = cs.ea(r, m, size);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "NEGX", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111000000) === 0b0100000001000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = Implied();
    const dst = cs.ea(r, m, size);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "NEGX", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111000000) === 0b0100000010000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = Implied();
    const dst = cs.ea(r, m, size);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "NEGX", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111000000) === 0b0100011000000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = Implied();
    const dst = cs.ea(r, m, size);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "NOT", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111000000) === 0b0100011001000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = Implied();
    const dst = cs.ea(r, m, size);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "NOT", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111000000) === 0b0100011010000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = Implied();
    const dst = cs.ea(r, m, size);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "NOT", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111000000) === 0b0100101000000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = Implied();
    const dst = cs.ea(r, m, size);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "TST", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111000000) === 0b0100101001000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = Implied();
    const dst = cs.ea(r, m, size);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "TST", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111000000) === 0b0100101010000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = Implied();
    const dst = cs.ea(r, m, size);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "TST", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111000000) === 0b0100000110000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.ea(r, m, size);
    const dst = DR(d);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "CHK", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111000000) === 0b0100000100000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.ea(r, m, size);
    const dst = DR(d);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "CHK", operands: [src, dst], extra },
    };
  }
  throw new Error("NotImplemented");
}

function decodeGroup0101(w0: number, cs: CodeStream): DecodedInstruction {
  if ((w0 & 0b1111000011111000) === 0b0101000011001000) {
    const c = getBits(w0, 8, 4);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = DR(r);
    const dst = PCDISP(2, simpleDisp(i16(cs.pull16())));
    const extra = cs.cc(c);
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "DBCC", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111000000) === 0b0101000000000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = cs.quickConst(d);
    const dst = cs.ea(r, m, size);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ADDQ", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111000000) === 0b0101000001000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.quickConst(d);
    const dst = cs.ea(r, m, size);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ADDQ", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111000000) === 0b0101000010000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.quickConst(d);
    const dst = cs.ea(r, m, size);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ADDQ", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111000000) === 0b0101000100000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = cs.quickConst(d);
    const dst = cs.ea(r, m, size);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "SUBQ", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111000000) === 0b0101000101000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.quickConst(d);
    const dst = cs.ea(r, m, size);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "SUBQ", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111000000) === 0b0101000110000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.quickConst(d);
    const dst = cs.ea(r, m, size);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "SUBQ", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000011111111) === 0b0101000011111100) {
    const c = getBits(w0, 8, 4);
    const size = 0;
    const src = null;
    const dst = null;
    const extra = cs.cc(c);
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "TRAPCC", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000011111111) === 0b0101000011111010) {
    const c = getBits(w0, 8, 4);
    const size = 2;
    const src = cs.imm16();
    const dst = null;
    const extra = cs.cc(c);
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "TRAPCC", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000011111111) === 0b0101000011111011) {
    const c = getBits(w0, 8, 4);
    const size = 4;
    const src = cs.imm32();
    const dst = null;
    const extra = cs.cc(c);
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "TRAPCC", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000011000000) === 0b0101000011000000) {
    const c = getBits(w0, 8, 4);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = Implied();
    const dst = cs.ea(r, m, 1);
    const extra = cs.cc(c);
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "SCC", operands: [src, dst], extra },
    };
  }
  throw new Error("NotImplemented");
}

function decodeGroup0110(w0: number, cs: CodeStream): DecodedInstruction {
  if ((w0 & 0b1111111111111111) === 0b0110000000000000) {
    const size = 2;
    const src = PCDISP(2, simpleDisp(i16(cs.pull16())));
    const dst = null;
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "BRA", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111111111) === 0b0110000011111111) {
    const size = 4;
    const src = PCDISP(2, simpleDisp(cs.pull32()));
    const dst = null;
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "BRA", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111100000000) === 0b0110000000000000) {
    const d = getBits(w0, 0, 8);
    const size = 1;
    const src = PCDISP(2, simpleDisp(i8(d)));
    const dst = null;
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "BRA", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111111111) === 0b0110000100000000) {
    const size = 2;
    const src = PCDISP(2, simpleDisp(i16(cs.pull16())));
    const dst = null;
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "BSR", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111111111) === 0b0110000111111111) {
    const size = 4;
    const src = PCDISP(2, simpleDisp(cs.pull32()));
    const dst = null;
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "BSR", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111100000000) === 0b0110000100000000) {
    const d = getBits(w0, 0, 8);
    const size = 1;
    const src = PCDISP(2, simpleDisp(i8(d)));
    const dst = null;
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "BSR", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000011111111) === 0b0110000000000000) {
    const c = getBits(w0, 8, 4);
    const size = 2;
    const src = PCDISP(2, simpleDisp(i16(cs.pull16())));
    const dst = null;
    const extra = cs.cc(c);
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "BCC", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000011111111) === 0b0110000011111111) {
    const c = getBits(w0, 8, 4);
    const size = 4;
    const src = PCDISP(2, simpleDisp(cs.pull32()));
    const dst = null;
    const extra = cs.cc(c);
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "BCC", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000000000000) === 0b0110000000000000) {
    const c = getBits(w0, 8, 4);
    const d = getBits(w0, 0, 8);
    const size = 1;
    const src = PCDISP(2, simpleDisp(i8(d)));
    const dst = null;
    const extra = cs.cc(c);
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "BCC", operands: [src, dst], extra },
    };
  }
  throw new Error("NotImplemented");
}

function decodeGroup0111(w0: number, cs: CodeStream): DecodedInstruction {
  if ((w0 & 0b1111000100000000) === 0b0111000000000000) {
    const r = getBits(w0, 9, 3);
    const n = getBits(w0, 0, 8);
    const size = 4;
    const src = IMM8(u8(n));
    const dst = DR(r);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "MOVEQ", operands: [src, dst], extra },
    };
  }
  throw new Error("NotImplemented");
}

function decodeGroup1000(w0: number, cs: CodeStream): DecodedInstruction {
  if ((w0 & 0b1111000111111000) === 0b1000000101000000) {
    const y = getBits(w0, 9, 3);
    const x = getBits(w0, 0, 3);
    const size = 0;
    const src = DR(x);
    const dst = DR(y);
    const extra = PackAdjustment(cs.pull16());
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "PACK", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1000000101001000) {
    const y = getBits(w0, 9, 3);
    const x = getBits(w0, 0, 3);
    const size = 0;
    const src = ARDEC(x);
    const dst = ARDEC(y);
    const extra = PackAdjustment(cs.pull16());
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "PACK", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1000000110000000) {
    const y = getBits(w0, 9, 3);
    const x = getBits(w0, 0, 3);
    const size = 0;
    const src = DR(x);
    const dst = DR(y);
    const extra = PackAdjustment(cs.pull16());
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "UNPK", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1000000110001000) {
    const y = getBits(w0, 9, 3);
    const x = getBits(w0, 0, 3);
    const size = 0;
    const src = ARDEC(x);
    const dst = ARDEC(y);
    const extra = PackAdjustment(cs.pull16());
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "UNPK", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1000000100000000) {
    const y = getBits(w0, 9, 3);
    const x = getBits(w0, 0, 3);
    const size = 1;
    const src = DR(x);
    const dst = DR(y);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "SBCD", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1000000100001000) {
    const y = getBits(w0, 9, 3);
    const x = getBits(w0, 0, 3);
    const size = 1;
    const src = ARDEC(x);
    const dst = ARDEC(y);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "SBCD", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111000000) === 0b1000000111000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.ea(r, m, 2);
    const dst = DR(d);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "DIVS", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111000000) === 0b1000000011000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.ea(r, m, 2);
    const dst = DR(d);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "DIVU", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111000000) === 0b1000000000000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = cs.ea(r, m, size);
    const dst = DR(d);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "OR", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111000000) === 0b1000000001000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.ea(r, m, size);
    const dst = DR(d);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "OR", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111000000) === 0b1000000010000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.ea(r, m, size);
    const dst = DR(d);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "OR", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111000000) === 0b1000000100000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = DR(d);
    const dst = cs.ea(r, m, size);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "OR", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111000000) === 0b1000000101000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = DR(d);
    const dst = cs.ea(r, m, size);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "OR", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111000000) === 0b1000000110000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = DR(d);
    const dst = cs.ea(r, m, size);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "OR", operands: [src, dst], extra },
    };
  }
  throw new Error("NotImplemented");
}

function decodeGroup1001(w0: number, cs: CodeStream): DecodedInstruction {
  if ((w0 & 0b1111000111111000) === 0b1001000100000000) {
    const x = getBits(w0, 9, 3);
    const y = getBits(w0, 0, 3);
    const size = 1;
    const src = DR(y);
    const dst = DR(x);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "SUBX", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1001000101000000) {
    const x = getBits(w0, 9, 3);
    const y = getBits(w0, 0, 3);
    const size = 2;
    const src = DR(y);
    const dst = DR(x);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "SUBX", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1001000110000000) {
    const x = getBits(w0, 9, 3);
    const y = getBits(w0, 0, 3);
    const size = 4;
    const src = DR(y);
    const dst = DR(x);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "SUBX", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1001000100001000) {
    const x = getBits(w0, 9, 3);
    const y = getBits(w0, 0, 3);
    const size = 1;
    const src = ARDEC(y);
    const dst = ARDEC(x);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "SUBX", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1001000101001000) {
    const x = getBits(w0, 9, 3);
    const y = getBits(w0, 0, 3);
    const size = 2;
    const src = ARDEC(y);
    const dst = ARDEC(x);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "SUBX", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1001000110001000) {
    const x = getBits(w0, 9, 3);
    const y = getBits(w0, 0, 3);
    const size = 4;
    const src = ARDEC(y);
    const dst = ARDEC(x);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "SUBX", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111000000) === 0b1001000000000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = cs.ea(r, m, size);
    const dst = DR(d);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "SUB", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111000000) === 0b1001000001000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.ea(r, m, size);
    const dst = DR(d);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "SUB", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111000000) === 0b1001000010000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.ea(r, m, size);
    const dst = DR(d);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "SUB", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111000000) === 0b1001000100000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = DR(d);
    const dst = cs.ea(r, m, size);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "SUB", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111000000) === 0b1001000101000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = DR(d);
    const dst = cs.ea(r, m, size);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "SUB", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111000000) === 0b1001000110000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = DR(d);
    const dst = cs.ea(r, m, size);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "SUB", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111000000) === 0b1001000011000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.ea(r, m, size);
    const dst = AR(d);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "SUBA", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111000000) === 0b1001000111000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.ea(r, m, size);
    const dst = AR(d);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "SUBA", operands: [src, dst], extra },
    };
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
    const dst = AR(a);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "CMPA", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111000000) === 0b1011000111000000) {
    const a = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.ea(r, m, size);
    const dst = AR(a);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "CMPA", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1011000100001000) {
    const x = getBits(w0, 9, 3);
    const y = getBits(w0, 0, 3);
    const size = 1;
    const src = ARINC(y);
    const dst = ARINC(x);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "CMPM", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1011000101001000) {
    const x = getBits(w0, 9, 3);
    const y = getBits(w0, 0, 3);
    const size = 2;
    const src = ARINC(y);
    const dst = ARINC(x);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "CMPM", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1011000110001000) {
    const x = getBits(w0, 9, 3);
    const y = getBits(w0, 0, 3);
    const size = 4;
    const src = ARINC(y);
    const dst = ARINC(x);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "CMPM", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111000000) === 0b1011000000000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = cs.ea(r, m, size);
    const dst = DR(d);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "CMP", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111000000) === 0b1011000001000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.ea(r, m, size);
    const dst = DR(d);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "CMP", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111000000) === 0b1011000010000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.ea(r, m, size);
    const dst = DR(d);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "CMP", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111000000) === 0b1011000100000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = DR(d);
    const dst = cs.ea(r, m, size);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "EOR", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111000000) === 0b1011000101000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = DR(d);
    const dst = cs.ea(r, m, size);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "EOR", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111000000) === 0b1011000110000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = DR(d);
    const dst = cs.ea(r, m, size);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "EOR", operands: [src, dst], extra },
    };
  }
  throw new Error("NotImplemented");
}

function decodeGroup1100(w0: number, cs: CodeStream): DecodedInstruction {
  if ((w0 & 0b1111000111111000) === 0b1100000100000000) {
    const y = getBits(w0, 9, 3);
    const x = getBits(w0, 0, 3);
    const size = 1;
    const src = DR(x);
    const dst = DR(y);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ABCD", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1100000100001000) {
    const y = getBits(w0, 9, 3);
    const x = getBits(w0, 0, 3);
    const size = 1;
    const src = ARDEC(x);
    const dst = ARDEC(y);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ABCD", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111000000) === 0b1100000011000000) {
    const p = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.ea(r, m, 2);
    const dst = DR(p);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "MULU", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111000000) === 0b1100000111000000) {
    const p = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.ea(r, m, 2);
    const dst = DR(p);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "MULS", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1100000101000000) {
    const x = getBits(w0, 9, 3);
    const y = getBits(w0, 0, 3);
    const size = 4;
    const src = DR(x);
    const dst = DR(y);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "EXG", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1100000101001000) {
    const x = getBits(w0, 9, 3);
    const y = getBits(w0, 0, 3);
    const size = 4;
    const src = AR(x);
    const dst = AR(y);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "EXG", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1100000110001000) {
    const x = getBits(w0, 9, 3);
    const y = getBits(w0, 0, 3);
    const size = 4;
    const src = DR(x);
    const dst = AR(y);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "EXG", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111000000) === 0b1100000000000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = cs.ea(r, m, size);
    const dst = DR(d);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "AND", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111000000) === 0b1100000001000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.ea(r, m, size);
    const dst = DR(d);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "AND", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111000000) === 0b1100000010000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.ea(r, m, size);
    const dst = DR(d);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "AND", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111000000) === 0b1100000100000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = DR(d);
    const dst = cs.ea(r, m, size);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "AND", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111000000) === 0b1100000101000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = DR(d);
    const dst = cs.ea(r, m, size);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "AND", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111000000) === 0b1100000110000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = DR(d);
    const dst = cs.ea(r, m, size);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "AND", operands: [src, dst], extra },
    };
  }
  throw new Error("NotImplemented");
}

function decodeGroup1101(w0: number, cs: CodeStream): DecodedInstruction {
  if ((w0 & 0b1111000111111000) === 0b1101000100000000) {
    const x = getBits(w0, 9, 3);
    const y = getBits(w0, 0, 3);
    const size = 1;
    const src = DR(y);
    const dst = DR(x);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ADDX", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1101000101000000) {
    const x = getBits(w0, 9, 3);
    const y = getBits(w0, 0, 3);
    const size = 2;
    const src = DR(y);
    const dst = DR(x);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ADDX", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1101000110000000) {
    const x = getBits(w0, 9, 3);
    const y = getBits(w0, 0, 3);
    const size = 4;
    const src = DR(y);
    const dst = DR(x);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ADDX", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1101000100001000) {
    const x = getBits(w0, 9, 3);
    const y = getBits(w0, 0, 3);
    const size = 1;
    const src = ARDEC(y);
    const dst = ARDEC(x);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ADDX", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1101000101001000) {
    const x = getBits(w0, 9, 3);
    const y = getBits(w0, 0, 3);
    const size = 2;
    const src = ARDEC(y);
    const dst = ARDEC(x);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ADDX", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1101000110001000) {
    const x = getBits(w0, 9, 3);
    const y = getBits(w0, 0, 3);
    const size = 4;
    const src = ARDEC(y);
    const dst = ARDEC(x);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ADDX", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111000000) === 0b1101000000000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = cs.ea(r, m, size);
    const dst = DR(d);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ADD", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111000000) === 0b1101000001000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.ea(r, m, size);
    const dst = DR(d);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ADD", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111000000) === 0b1101000010000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.ea(r, m, size);
    const dst = DR(d);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ADD", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111000000) === 0b1101000100000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = DR(d);
    const dst = cs.ea(r, m, size);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ADD", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111000000) === 0b1101000101000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = DR(d);
    const dst = cs.ea(r, m, size);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ADD", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111000000) === 0b1101000110000000) {
    const d = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = DR(d);
    const dst = cs.ea(r, m, size);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ADD", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111000000) === 0b1101000011000000) {
    const a = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = cs.ea(r, m, size);
    const dst = AR(a);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ADDA", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111000000) === 0b1101000111000000) {
    const a = getBits(w0, 9, 3);
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = cs.ea(r, m, size);
    const dst = AR(a);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ADDA", operands: [src, dst], extra },
    };
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
      const extra = cs.bitfield(O, o, W, w);
      const size = 0;
      const src = null;
      const dst = cs.ea(r, m, 0);
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "BFCHG", operands: [src, dst], extra },
      };
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
      const extra = cs.bitfield(O, o, W, w);
      const size = 0;
      const src = null;
      const dst = cs.ea(r, m, 0);
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "BFCLR", operands: [src, dst], extra },
      };
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
      const extra = cs.bitfield(O, o, W, w);
      const size = 0;
      const src = cs.ea(r, m, 0);
      const dst = DR(d);
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "BFEXTS", operands: [src, dst], extra },
      };
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
      const extra = cs.bitfield(O, o, W, w);
      const size = 0;
      const src = cs.ea(r, m, 0);
      const dst = DR(d);
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "BFEXTU", operands: [src, dst], extra },
      };
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
      const extra = cs.bitfield(O, o, W, w);
      const size = 0;
      const src = cs.ea(r, m, 0);
      const dst = DR(d);
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "BFFFO", operands: [src, dst], extra },
      };
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
      const extra = cs.bitfield(O, o, W, w);
      const size = 0;
      const src = DR(d);
      const dst = cs.ea(r, m, 0);
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "BFINS", operands: [src, dst], extra },
      };
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
      const extra = cs.bitfield(O, o, W, w);
      const size = 0;
      const src = null;
      const dst = cs.ea(r, m, 0);
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "BFSET", operands: [src, dst], extra },
      };
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
      const extra = cs.bitfield(O, o, W, w);
      const size = 0;
      const src = null;
      const dst = cs.ea(r, m, 0);
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "BFTST", operands: [src, dst], extra },
      };
    }
  }
  if ((w0 & 0b1111000111111000) === 0b1110000100000000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = IMM8(u8(c));
    const dst = DR(r);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ASL", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1110000101000000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = IMM8(u8(c));
    const dst = DR(r);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ASL", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1110000110000000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = IMM8(u8(c));
    const dst = DR(r);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ASL", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1110000000000000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = IMM8(u8(c));
    const dst = DR(r);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ASR", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1110000001000000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = IMM8(u8(c));
    const dst = DR(r);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ASR", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1110000010000000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = IMM8(u8(c));
    const dst = DR(r);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ASR", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1110000100100000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = DR(c);
    const dst = DR(r);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ASL", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1110000101100000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = DR(c);
    const dst = DR(r);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ASL", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1110000110100000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = DR(c);
    const dst = DR(r);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ASL", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1110000000100000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = DR(c);
    const dst = DR(r);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ASR", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1110000001100000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = DR(c);
    const dst = DR(r);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ASR", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1110000010100000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = DR(c);
    const dst = DR(r);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ASR", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1110000100001000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = IMM8(u8(c));
    const dst = DR(r);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "LSL", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1110000101001000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = IMM8(u8(c));
    const dst = DR(r);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "LSL", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1110000110001000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = IMM8(u8(c));
    const dst = DR(r);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "LSL", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1110000000001000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = IMM8(u8(c));
    const dst = DR(r);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "LSR", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1110000001001000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = IMM8(u8(c));
    const dst = DR(r);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "LSR", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1110000010001000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = IMM8(u8(c));
    const dst = DR(r);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "LSR", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1110000100101000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = DR(c);
    const dst = DR(r);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "LSL", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1110000101101000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = DR(c);
    const dst = DR(r);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "LSL", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1110000110101000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = DR(c);
    const dst = DR(r);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "LSL", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1110000000101000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = DR(c);
    const dst = DR(r);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "LSR", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1110000001101000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = DR(c);
    const dst = DR(r);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "LSR", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1110000010101000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = DR(c);
    const dst = DR(r);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "LSR", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1110000100010000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = IMM8(u8(c));
    const dst = DR(r);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ROXL", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1110000101010000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = IMM8(u8(c));
    const dst = DR(r);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ROXL", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1110000110010000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = IMM8(u8(c));
    const dst = DR(r);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ROXL", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1110000000010000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = IMM8(u8(c));
    const dst = DR(r);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ROXR", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1110000001010000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = IMM8(u8(c));
    const dst = DR(r);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ROXR", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1110000010010000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = IMM8(u8(c));
    const dst = DR(r);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ROXR", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1110000100110000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = DR(c);
    const dst = DR(r);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ROXL", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1110000101110000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = DR(c);
    const dst = DR(r);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ROXL", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1110000110110000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = DR(c);
    const dst = DR(r);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ROXL", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1110000000110000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = DR(c);
    const dst = DR(r);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ROXR", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1110000001110000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = DR(c);
    const dst = DR(r);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ROXR", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1110000010110000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = DR(c);
    const dst = DR(r);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ROXR", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1110000100011000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = IMM8(u8(c));
    const dst = DR(r);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ROL", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1110000101011000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = IMM8(u8(c));
    const dst = DR(r);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ROL", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1110000110011000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = IMM8(u8(c));
    const dst = DR(r);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ROL", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1110000000011000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = IMM8(u8(c));
    const dst = DR(r);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ROR", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1110000001011000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = IMM8(u8(c));
    const dst = DR(r);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ROR", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1110000010011000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = IMM8(u8(c));
    const dst = DR(r);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ROR", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1110000100111000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = DR(c);
    const dst = DR(r);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ROL", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1110000101111000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = DR(c);
    const dst = DR(r);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ROL", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1110000110111000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = DR(c);
    const dst = DR(r);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ROL", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1110000000111000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 1;
    const src = DR(c);
    const dst = DR(r);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ROR", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1110000001111000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = DR(c);
    const dst = DR(r);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ROR", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111000111111000) === 0b1110000010111000) {
    const c = getBits(w0, 9, 3);
    const r = getBits(w0, 0, 3);
    const size = 4;
    const src = DR(c);
    const dst = DR(r);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ROR", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111000000) === 0b1110000111000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = Implied();
    const dst = cs.ea(r, m, size);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ASL", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111000000) === 0b1110000011000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = Implied();
    const dst = cs.ea(r, m, size);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ASR", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111000000) === 0b1110001111000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = Implied();
    const dst = cs.ea(r, m, size);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "LSL", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111000000) === 0b1110001011000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = Implied();
    const dst = cs.ea(r, m, size);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "LSR", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111000000) === 0b1110010111000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = Implied();
    const dst = cs.ea(r, m, size);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ROXL", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111000000) === 0b1110010011000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = Implied();
    const dst = cs.ea(r, m, size);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ROXR", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111000000) === 0b1110011111000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = Implied();
    const dst = cs.ea(r, m, size);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ROL", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111000000) === 0b1110011011000000) {
    const m = getBits(w0, 3, 3);
    const r = getBits(w0, 0, 3);
    const size = 2;
    const src = Implied();
    const dst = cs.ea(r, m, size);
    const extra = null;
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "ROR", operands: [src, dst], extra },
    };
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
      const src = IMM8(u8(o));
      const dst = FR(d);
      const extra = null;
      return {
        bytesUsed: cs.pos,
        instruction: {
          size,
          operation: "FMOVECR",
          operands: [src, dst],
          extra,
        },
      };
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
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "FABS", operands: [src, dst], extra },
      };
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
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "FSABS", operands: [src, dst], extra },
      };
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
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "FDABS", operands: [src, dst], extra },
      };
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
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "FACOS", operands: [src, dst], extra },
      };
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
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "FADD", operands: [src, dst], extra },
      };
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
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "FSADD", operands: [src, dst], extra },
      };
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
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "FDADD", operands: [src, dst], extra },
      };
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
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "FASIN", operands: [src, dst], extra },
      };
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
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "FATAN", operands: [src, dst], extra },
      };
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
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "FATANH", operands: [src, dst], extra },
      };
    }
  }
  if ((w0 & 0b1111111111111111) === 0b1111001010000000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1111111111111111) === 0b0000000000000000) {
      cs.skipWords(1);
      const size = 0;
      const src = null;
      const dst = null;
      const extra = null;
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "FNOP", operands: [src, dst], extra },
      };
    }
  }
  if ((w0 & 0b1111111111000000) === 0b1111001010000000) {
    const c = getBits(w0, 0, 6);
    const size = 2;
    const src = PCDISP(2, simpleDisp(i16(cs.pull16())));
    const dst = null;
    const extra = cs.fpcc(c);
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "FBCC", operands: [src, dst], extra },
    };
  }
  if ((w0 & 0b1111111111000000) === 0b1111001011000000) {
    const c = getBits(w0, 0, 6);
    const size = 4;
    const src = PCDISP(2, simpleDisp(cs.pull32()));
    const dst = null;
    const extra = cs.fpcc(c);
    return {
      bytesUsed: cs.pos,
      instruction: { size, operation: "FBCC", operands: [src, dst], extra },
    };
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
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "FCMP", operands: [src, dst], extra },
      };
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
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "FCOS", operands: [src, dst], extra },
      };
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
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "FCOSH", operands: [src, dst], extra },
      };
    }
  }
  if ((w0 & 0b1111111111111000) === 0b1111001001001000 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1111111111100000) === 0b0000000000000000) {
      const r = getBits(w0, 0, 3);
      const c = getBits(w1, 0, 5);
      cs.skipWords(1);
      const size = 2;
      const src = DR(r);
      const dst = PCDISP(4, simpleDisp(i16(cs.pull16())));
      const extra = cs.fpcc(c);
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "FDBCC", operands: [src, dst], extra },
      };
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
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "FDIV", operands: [src, dst], extra },
      };
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
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "FSDIV", operands: [src, dst], extra },
      };
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
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "FDDIV", operands: [src, dst], extra },
      };
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
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "FETOX", operands: [src, dst], extra },
      };
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
      return {
        bytesUsed: cs.pos,
        instruction: {
          size,
          operation: "FETOXM1",
          operands: [src, dst],
          extra,
        },
      };
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
      return {
        bytesUsed: cs.pos,
        instruction: {
          size,
          operation: "FGETEXP",
          operands: [src, dst],
          extra,
        },
      };
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
      return {
        bytesUsed: cs.pos,
        instruction: {
          size,
          operation: "FGETMAN",
          operands: [src, dst],
          extra,
        },
      };
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
      return {
        bytesUsed: cs.pos,
        instruction: {
          size,
          operation: "FGETMAN",
          operands: [src, dst],
          extra,
        },
      };
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
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "FINT", operands: [src, dst], extra },
      };
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
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "FINTRZ", operands: [src, dst], extra },
      };
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
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "FLOG10", operands: [src, dst], extra },
      };
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
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "FLOG2", operands: [src, dst], extra },
      };
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
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "FLOGN", operands: [src, dst], extra },
      };
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
      return {
        bytesUsed: cs.pos,
        instruction: {
          size,
          operation: "FLOGNP1",
          operands: [src, dst],
          extra,
        },
      };
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
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "FMOD", operands: [src, dst], extra },
      };
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
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "FMOVE", operands: [src, dst], extra },
      };
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
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "FMOVE", operands: [src, dst], extra },
      };
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
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "FSMOVE", operands: [src, dst], extra },
      };
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
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "FDMOVE", operands: [src, dst], extra },
      };
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
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "FMOVEM", operands: [src, dst], extra },
      };
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
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "FMUL", operands: [src, dst], extra },
      };
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
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "FSMUL", operands: [src, dst], extra },
      };
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
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "FDMUL", operands: [src, dst], extra },
      };
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
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "FNEG", operands: [src, dst], extra },
      };
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
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "FSNEG", operands: [src, dst], extra },
      };
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
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "FDNEG", operands: [src, dst], extra },
      };
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
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "FREM", operands: [src, dst], extra },
      };
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
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "FSCALE", operands: [src, dst], extra },
      };
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
      const extra = cs.fpcc(c);
      return {
        bytesUsed: cs.pos,
        instruction: {
          size,
          operation: "FTRAPCC",
          operands: [src, dst],
          extra,
        },
      };
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
      const extra = cs.fpcc(c);
      return {
        bytesUsed: cs.pos,
        instruction: {
          size,
          operation: "FTRAPCC",
          operands: [src, dst],
          extra,
        },
      };
    }
  }
  if ((w0 & 0b1111111111111111) === 0b1111001001111100 && cs.hasWords(1)) {
    const w1 = cs.peekWord(0);
    if ((w1 & 0b1111111111000000) === 0b0000000000000000) {
      const c = getBits(w1, 0, 6);
      cs.skipWords(1);
      const size = 0;
      const src = Implied();
      const dst = null;
      const extra = cs.fpcc(c);
      return {
        bytesUsed: cs.pos,
        instruction: {
          size,
          operation: "FTRAPCC",
          operands: [src, dst],
          extra,
        },
      };
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
      const extra = cs.fpcc(c);
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "FSCC", operands: [src, dst], extra },
      };
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
      return {
        bytesUsed: cs.pos,
        instruction: {
          size,
          operation: "FSGLDIV",
          operands: [src, dst],
          extra,
        },
      };
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
      return {
        bytesUsed: cs.pos,
        instruction: {
          size,
          operation: "FSGLMUL",
          operands: [src, dst],
          extra,
        },
      };
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
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "FSIN", operands: [src, dst], extra },
      };
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
      const dst = FPAIR(S, C);
      return {
        bytesUsed: cs.pos,
        instruction: {
          size,
          operation: "FSINCOS",
          operands: [src, dst],
          extra,
        },
      };
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
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "FSINH", operands: [src, dst], extra },
      };
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
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "FSQRT", operands: [src, dst], extra },
      };
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
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "FSSQRT", operands: [src, dst], extra },
      };
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
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "FDSQRT", operands: [src, dst], extra },
      };
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
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "FSUB", operands: [src, dst], extra },
      };
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
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "FSSUB", operands: [src, dst], extra },
      };
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
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "FDSUB", operands: [src, dst], extra },
      };
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
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "FTAN", operands: [src, dst], extra },
      };
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
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "FTANH", operands: [src, dst], extra },
      };
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
      return {
        bytesUsed: cs.pos,
        instruction: {
          size,
          operation: "FTENTOX",
          operands: [src, dst],
          extra,
        },
      };
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
      const dst = null;
      return {
        bytesUsed: cs.pos,
        instruction: { size, operation: "FTST", operands: [src, dst], extra },
      };
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
      return {
        bytesUsed: cs.pos,
        instruction: {
          size,
          operation: "FTWOTOX",
          operands: [src, dst],
          extra,
        },
      };
    }
  }
  throw new Error("NotImplemented");
}

/**
 * Attempt to decode a single M68000 instruction starting at `code[0]`
 *
 * @param {Uint8Array} code Instruction byte array
 * @returns {DecodedInstruction} Decoded instruction structured data
 */
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
