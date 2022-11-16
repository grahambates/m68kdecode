/* eslint-disable jest/no-conditional-expect */
import decodeInstruction, {
  ABS16,
  ABS32,
  AR,
  ARDEC,
  ARDISP,
  ARINC,
  ARIND,
  ARIndexer,
  Bitfield,
  Condition,
  ConditionCode,
  CONTROLREG,
  DecodingError,
  DISP,
  DPAIR,
  DR,
  DRIndexer,
  DYNAMIC,
  FloatFormat,
  FPAIR,
  FPCondition,
  FPConditionCode,
  FPF_BYTE_INT,
  FPF_DOUBLE,
  FPF_EXTENDED_REAL,
  FPF_LONG_INT,
  FPF_PACKED_DECIMAL_REAL_DYNAMIC,
  FPF_PACKED_DECIMAL_REAL_STATIC,
  FPF_SINGLE,
  FPF_WORD_INT,
  FR,
  IMM16,
  IMM32,
  IMM8,
  Implied,
  Instruction,
  Operation,
  PackAdjustment,
  PCDISP,
  REGLIST,
  STATIC,
} from "../src";
import { drDisp, drDispScale, simpleDisp } from "../src/lib";

describe("decodeInstruction", () => {
  it.each([
    [
      " move.b d0,d1",
      [0x12, 0x00],
      <Instruction>{
        size: 1,
        operation: Operation.MOVE,
        operands: [DR(0), DR(1)],
        extra: null,
      },
    ],
    [
      " move.b d2,d3",
      [0x16, 0x02],
      <Instruction>{
        size: 1,
        operation: Operation.MOVE,
        operands: [DR(2), DR(3)],
        extra: null,
      },
    ],
    [
      " move.b d4,d5",
      [0x1a, 0x04],
      <Instruction>{
        size: 1,
        operation: Operation.MOVE,
        operands: [DR(4), DR(5)],
        extra: null,
      },
    ],
    [
      " move.b d6,d7",
      [0x1e, 0x06],
      <Instruction>{
        size: 1,
        operation: Operation.MOVE,
        operands: [DR(6), DR(7)],
        extra: null,
      },
    ],
    [
      " move.w a0,a1",
      [0x32, 0x48],
      <Instruction>{
        size: 2,
        operation: Operation.MOVEA,
        operands: [AR(0), AR(1)],
        extra: null,
      },
    ],
    [
      " move.w a2,a3",
      [0x36, 0x4a],
      <Instruction>{
        size: 2,
        operation: Operation.MOVEA,
        operands: [AR(2), AR(3)],
        extra: null,
      },
    ],
    [
      " move.w a4,a5",
      [0x3a, 0x4c],
      <Instruction>{
        size: 2,
        operation: Operation.MOVEA,
        operands: [AR(4), AR(5)],
        extra: null,
      },
    ],
    [
      " move.w a6,a7",
      [0x3e, 0x4e],
      <Instruction>{
        size: 2,
        operation: Operation.MOVEA,
        operands: [AR(6), AR(7)],
        extra: null,
      },
    ],
    [
      " move.b 123(a0,d0),d3",
      [0x16, 0x30, 0x00, 0x7b],
      <Instruction>{
        size: 1,
        operation: Operation.MOVE,
        operands: [ARDISP(0, drDisp(0, 123)), DR(3)],
        extra: null,
      },
    ],
    [
      " move.w 123(a0,d0),d3",
      [0x36, 0x30, 0x00, 0x7b],
      <Instruction>{
        size: 2,
        operation: Operation.MOVE,
        operands: [ARDISP(0, drDisp(0, 123)), DR(3)],
        extra: null,
      },
    ],
    [
      " move.l 123(a0,d0),d3",
      [0x26, 0x30, 0x00, 0x7b],
      <Instruction>{
        size: 4,
        operation: Operation.MOVE,
        operands: [ARDISP(0, drDisp(0, 123)), DR(3)],
        extra: null,
      },
    ],
    [
      " move.l 123(a0,d0),a1",
      [0x22, 0x70, 0x00, 0x7b],
      <Instruction>{
        size: 4,
        operation: Operation.MOVEA,
        operands: [ARDISP(0, drDisp(0, 123)), AR(1)],
        extra: null,
      },
    ],
    [
      " move.w 123(a0,d0),a1",
      [0x32, 0x70, 0x00, 0x7b],
      <Instruction>{
        size: 2,
        operation: Operation.MOVEA,
        operands: [ARDISP(0, drDisp(0, 123)), AR(1)],
        extra: null,
      },
    ],
    [
      " move.b #$12,d7",
      [0x1e, 0x3c, 0x00, 0x12],
      <Instruction>{
        size: 1,
        operation: Operation.MOVE,
        operands: [IMM8(0x12), DR(7)],
        extra: null,
      },
    ],
    [
      " move.w #$1234,d7",
      [0x3e, 0x3c, 0x12, 0x34],
      <Instruction>{
        size: 2,
        operation: Operation.MOVE,
        operands: [IMM16(0x1234), DR(7)],
        extra: null,
      },
    ],
    [
      " move.l #$12345678,d7",
      [0x2e, 0x3c, 0x12, 0x34, 0x56, 0x78],
      <Instruction>{
        size: 4,
        operation: Operation.MOVE,
        operands: [IMM32(0x12345678), DR(7)],
        extra: null,
      },
    ],
    [
      " move.l D1,-(A2)",
      [0x25, 0x01],
      <Instruction>{
        size: 4,
        operation: Operation.MOVE,
        operands: [DR(1), ARDEC(2)],
        extra: null,
      },
    ],
    [
      " move.l D1,(A2)+",
      [0x24, 0xc1],
      <Instruction>{
        size: 4,
        operation: Operation.MOVE,
        operands: [DR(1), ARINC(2)],
        extra: null,
      },
    ],
    [
      " move.l -(A4),(A2)+",
      [0x24, 0xe4],
      <Instruction>{
        size: 4,
        operation: Operation.MOVE,
        operands: [ARDEC(4), ARINC(2)],
        extra: null,
      },
    ],
    [
      " move.l 4.w,A0",
      [0x20, 0x78, 0x00, 0x04],
      <Instruction>{
        size: 4,
        operation: Operation.MOVEA,
        operands: [ABS16(4), AR(0)],
        extra: null,
      },
    ],
    [
      " move.l $11223344,A0",
      [0x20, 0x79, 0x11, 0x22, 0x33, 0x44],
      <Instruction>{
        size: 4,
        operation: Operation.MOVEA,
        operands: [ABS32(0x11223344), AR(0)],
        extra: null,
      },
    ],
    [
      " move.w #$1234,123(d0)",
      [0x31, 0xbc, 0x12, 0x34, 0x01, 0xa0, 0x00, 0x7b],
      <Instruction>{
        size: 2,
        operation: Operation.MOVE,
        operands: [
          IMM16(0x1234),
          DISP({
            baseDisplacement: 123,
            outerDisplacement: 0,
            indexer: DRIndexer(0, 0),
            indirection: null,
          }),
        ],
        extra: null,
      },
    ],
    [
      " move.w -8(pc),d3",
      [0x36, 0x3a, 0xff, 0xf8],
      <Instruction>{
        size: 2,
        operation: Operation.MOVE,
        operands: [
          PCDISP(2, {
            baseDisplacement: -8,
            outerDisplacement: 0,
            indexer: null,
            indirection: null,
          }),
          DR(3),
        ],
        extra: null,
      },
    ],
    [
      " move.w -8(pc,d2*8),d3",
      [0x36, 0x3b, 0x26, 0xf8],
      <Instruction>{
        size: 2,
        operation: Operation.MOVE,
        operands: [
          PCDISP(2, {
            baseDisplacement: -8,
            outerDisplacement: 0,
            indexer: DRIndexer(2, 3),
            indirection: null,
          }),
          DR(3),
        ],
        extra: null,
      },
    ],
    [
      " move.w 123(a1,d2*4),9876(a2,d3*2)",
      [0x35, 0xb1, 0x24, 0x7b, 0x33, 0x20, 0x26, 0x94],
      <Instruction>{
        size: 2,
        operation: Operation.MOVE,
        operands: [
          ARDISP(1, drDispScale(2, 123, 2)),
          ARDISP(2, drDispScale(3, 9876, 1)),
        ],
        extra: null,
      },
    ],
    [
      " move.w d0,12345(a0,a1*2)",
      [0x31, 0x80, 0x93, 0x20, 0x30, 0x39],
      <Instruction>{
        size: 2,
        operation: Operation.MOVE,
        operands: [
          DR(0),
          ARDISP(0, {
            baseDisplacement: 12345,
            outerDisplacement: 0,
            indexer: ARIndexer(1, 1),
            indirection: null,
          }),
        ],
        extra: null,
      },
    ],
    [
      " lea (a0),a1",
      [0x43, 0xd0],
      <Instruction>{
        size: 4,
        operation: Operation.LEA,
        operands: [ARIND(0), AR(1)],
        extra: null,
      },
    ],
    [
      " lea 8(a0),a1",
      [0x43, 0xe8, 0x00, 0x08],
      <Instruction>{
        size: 4,
        operation: Operation.LEA,
        operands: [ARDISP(0, simpleDisp(8)), AR(1)],
        extra: null,
      },
    ],
    [
      " ori #17,ccr",
      [0x00, 0x3c, 0x00, 0x11],
      <Instruction>{
        size: 1,
        operation: Operation.ORITOCCR,
        operands: [IMM8(17), Implied()],
        extra: null,
      },
    ],
    [
      " ori #$1234,sr",
      [0x00, 0x7c, 0x12, 0x34],
      <Instruction>{
        size: 2,
        operation: Operation.ORITOSR,
        operands: [IMM16(0x1234), Implied()],
        extra: null,
      },
    ],
    [
      " ori.w #$1234,d0",
      [0x00, 0x40, 0x12, 0x34],
      <Instruction>{
        size: 2,
        operation: Operation.ORI,
        operands: [IMM16(0x1234), DR(0)],
        extra: null,
      },
    ],
    [
      " ori.b #$12,d2",
      [0x00, 0x02, 0x00, 0x12],
      <Instruction>{
        size: 1,
        operation: Operation.ORI,
        operands: [IMM8(0x12), DR(2)],
        extra: null,
      },
    ],
    [
      " ori.w #$1234,123(a0,d0)",
      [0x00, 0x70, 0x12, 0x34, 0x00, 0x7b],
      <Instruction>{
        size: 2,
        operation: Operation.ORI,
        operands: [IMM16(0x1234), ARDISP(0, drDisp(0, 123))],
        extra: null,
      },
    ],
    [
      " ori.l #$12345678,-(a0)",
      [0x00, 0xa0, 0x12, 0x34, 0x56, 0x78],
      <Instruction>{
        size: 4,
        operation: Operation.ORI,
        operands: [IMM32(0x12345678), ARDEC(0)],
        extra: null,
      },
    ],
    [
      " andi #17,ccr",
      [0x02, 0x3c, 0x00, 0x11],
      <Instruction>{
        size: 1,
        operation: Operation.ANDITOCCR,
        operands: [IMM8(17), Implied()],
        extra: null,
      },
    ],
    [
      " andi #$1234,sr",
      [0x02, 0x7c, 0x12, 0x34],
      <Instruction>{
        size: 2,
        operation: Operation.ANDITOSR,
        operands: [IMM16(0x1234), Implied()],
        extra: null,
      },
    ],
    [
      " andi.w #$1234,d0",
      [0x02, 0x40, 0x12, 0x34],
      <Instruction>{
        size: 2,
        operation: Operation.ANDI,
        operands: [IMM16(0x1234), DR(0)],
        extra: null,
      },
    ],
    [
      " andi.b #$12,d2",
      [0x02, 0x02, 0x00, 0x12],
      <Instruction>{
        size: 1,
        operation: Operation.ANDI,
        operands: [IMM8(0x12), DR(2)],
        extra: null,
      },
    ],
    [
      " andi.w #$1234,123(a0,d0)",
      [0x02, 0x70, 0x12, 0x34, 0x00, 0x7b],
      <Instruction>{
        size: 2,
        operation: Operation.ANDI,
        operands: [IMM16(0x1234), ARDISP(0, drDisp(0, 123))],
        extra: null,
      },
    ],
    [
      " andi.l #$12345678,-(a0)",
      [0x02, 0xa0, 0x12, 0x34, 0x56, 0x78],
      <Instruction>{
        size: 4,
        operation: Operation.ANDI,
        operands: [IMM32(0x12345678), ARDEC(0)],
        extra: null,
      },
    ],
    [
      " eori #17,ccr",
      [0x0a, 0x3c, 0x00, 0x11],
      <Instruction>{
        size: 1,
        operation: Operation.EORITOCCR,
        operands: [IMM8(17), Implied()],
        extra: null,
      },
    ],
    [
      " eori #$1234,sr",
      [0x0a, 0x7c, 0x12, 0x34],
      <Instruction>{
        size: 2,
        operation: Operation.EORITOSR,
        operands: [IMM16(0x1234), Implied()],
        extra: null,
      },
    ],
    [
      " eori.w #$1234,d0",
      [0x0a, 0x40, 0x12, 0x34],
      <Instruction>{
        size: 2,
        operation: Operation.EORI,
        operands: [IMM16(0x1234), DR(0)],
        extra: null,
      },
    ],
    [
      " eori.b #$12,d2",
      [0x0a, 0x02, 0x00, 0x12],
      <Instruction>{
        size: 1,
        operation: Operation.EORI,
        operands: [IMM8(0x12), DR(2)],
        extra: null,
      },
    ],
    [
      " eori.w #$1234,123(a0,d0)",
      [0x0a, 0x70, 0x12, 0x34, 0x00, 0x7b],
      <Instruction>{
        size: 2,
        operation: Operation.EORI,
        operands: [IMM16(0x1234), ARDISP(0, drDisp(0, 123))],
        extra: null,
      },
    ],
    [
      " eori.l #$12345678,-(a0)",
      [0x0a, 0xa0, 0x12, 0x34, 0x56, 0x78],
      <Instruction>{
        size: 4,
        operation: Operation.EORI,
        operands: [IMM32(0x12345678), ARDEC(0)],
        extra: null,
      },
    ],
    [
      " addi.l #$12345678,-(a0)",
      [0x06, 0xa0, 0x12, 0x34, 0x56, 0x78],
      <Instruction>{
        size: 4,
        operation: Operation.ADDI,
        operands: [IMM32(0x12345678), ARDEC(0)],
        extra: null,
      },
    ],
    [
      " subi.l #$12345678,-(a0)",
      [0x04, 0xa0, 0x12, 0x34, 0x56, 0x78],
      <Instruction>{
        size: 4,
        operation: Operation.SUBI,
        operands: [IMM32(0x12345678), ARDEC(0)],
        extra: null,
      },
    ],
    [
      " rtm d3",
      [0x06, 0xc3],
      <Instruction>{
        size: 0,
        operation: Operation.RTM,
        operands: [DR(3), null],
        extra: null,
      },
    ],
    [
      " rtm a1",
      [0x06, 0xc9],
      <Instruction>{
        size: 0,
        operation: Operation.RTM,
        operands: [AR(1), null],
        extra: null,
      },
    ],
    [
      " callm #3,(a1)",
      [0x06, 0xd1, 0x00, 0x03],
      <Instruction>{
        size: 0,
        operation: Operation.CALLM,
        operands: [IMM8(3), ARIND(1)],
        extra: null,
      },
    ],
    [
      " callm #99,$12345678",
      [0x06, 0xf9, 0x00, 0x63, 0x12, 0x34, 0x56, 0x78],
      <Instruction>{
        size: 0,
        operation: Operation.CALLM,
        operands: [IMM8(99), ABS32(0x12345678)],
        extra: null,
      },
    ],
    [
      " cmp2.l (a0),d3",
      [0x04, 0xd0, 0x30, 0x00],
      <Instruction>{
        size: 4,
        operation: Operation.CMP2,
        operands: [ARIND(0), DR(3)],
        extra: null,
      },
    ],
    [
      " cmp2.b 90(a0,d2),a6",
      [0x00, 0xf0, 0xe0, 0x00, 0x20, 0x5a],
      <Instruction>{
        size: 1,
        operation: Operation.CMP2,
        operands: [ARDISP(0, drDisp(2, 90)), AR(6)],
        extra: null,
      },
    ],
    [
      " chk2.w 90(a0,d2),a6",
      [0x02, 0xf0, 0xe8, 0x00, 0x20, 0x5a],
      <Instruction>{
        size: 2,
        operation: Operation.CHK2,
        operands: [ARDISP(0, drDisp(2, 90)), AR(6)],
        extra: null,
      },
    ],
    [
      " cmpi.b #$a5,90(a0,d2*4)",
      [0x0c, 0x30, 0x00, 0xa5, 0x24, 0x5a],
      <Instruction>{
        size: 1,
        operation: Operation.CMPI,
        operands: [IMM8(0xa5), ARDISP(0, drDispScale(2, 90, 2))],
        extra: null,
      },
    ],
    [
      " cmpi.w #$a512,90(a0,d2*4)",
      [0x0c, 0x70, 0xa5, 0x12, 0x24, 0x5a],
      <Instruction>{
        size: 2,
        operation: Operation.CMPI,
        operands: [IMM16(0xa512), ARDISP(0, drDispScale(2, 90, 2))],
        extra: null,
      },
    ],
    [
      " cmpi.l #$12345678,90(a0,d2*4)",
      [0x0c, 0xb0, 0x12, 0x34, 0x56, 0x78, 0x24, 0x5a],
      <Instruction>{
        size: 4,
        operation: Operation.CMPI,
        operands: [IMM32(0x12345678), ARDISP(0, drDispScale(2, 90, 2))],
        extra: null,
      },
    ],
    [
      " btst #18,d0",
      [0x08, 0x00, 0x00, 0x12],
      <Instruction>{
        size: 1,
        operation: Operation.BTST,
        operands: [IMM16(18), DR(0)],
        extra: null,
      },
    ],
    [
      " btst #18,(a0)+",
      [0x08, 0x18, 0x00, 0x12],
      <Instruction>{
        size: 1,
        operation: Operation.BTST,
        operands: [IMM16(18), ARINC(0)],
        extra: null,
      },
    ],
    [
      " bclr #18,(a0)+",
      [0x08, 0x98, 0x00, 0x12],
      <Instruction>{
        size: 1,
        operation: Operation.BCLR,
        operands: [IMM16(18), ARINC(0)],
        extra: null,
      },
    ],
    [
      " bchg #18,(a0)+",
      [0x08, 0x58, 0x00, 0x12],
      <Instruction>{
        size: 1,
        operation: Operation.BCHG,
        operands: [IMM16(18), ARINC(0)],
        extra: null,
      },
    ],
    [
      " bset #18,(a0)+",
      [0x08, 0xd8, 0x00, 0x12],
      <Instruction>{
        size: 1,
        operation: Operation.BSET,
        operands: [IMM16(18), ARINC(0)],
        extra: null,
      },
    ],
    [
      " moves.l a0,(a1)",
      [0x0e, 0x91, 0x88, 0x00],
      <Instruction>{
        size: 4,
        operation: Operation.MOVES,
        operands: [AR(0), ARIND(1)],
        extra: null,
      },
    ],
    [
      " moves.b d0,(a1)",
      [0x0e, 0x11, 0x08, 0x00],
      <Instruction>{
        size: 1,
        operation: Operation.MOVES,
        operands: [DR(0), ARIND(1)],
        extra: null,
      },
    ],
    [" cas d0,d1,(a0)", [0x0c, 0xd0, 0x00, 0x40], DecodingError.NotImplemented],
    [
      " cas2 d0:d1,d2:d3,(a0):(a1)",
      [0x0c, 0xfc, 0x80, 0x80, 0x90, 0xc1],
      DecodingError.NotImplemented,
    ],
    [
      " illegal",
      [0x4a, 0xfc],
      <Instruction>{
        size: 0,
        operation: Operation.ILLEGAL,
        operands: [null, null],
        extra: null,
      },
    ],
    [
      " nop",
      [0x4e, 0x71],
      <Instruction>{
        size: 0,
        operation: Operation.NOP,
        operands: [null, null],
        extra: null,
      },
    ],
    [
      " reset",
      [0x4e, 0x70],
      <Instruction>{
        size: 0,
        operation: Operation.RESET,
        operands: [null, null],
        extra: null,
      },
    ],
    [
      " rtd #578",
      [0x4e, 0x74, 0x02, 0x42],
      <Instruction>{
        size: 0,
        operation: Operation.RTD,
        operands: [IMM16(578), null],
        extra: null,
      },
    ],
    [
      " rte",
      [0x4e, 0x73],
      <Instruction>{
        size: 0,
        operation: Operation.RTE,
        operands: [null, null],
        extra: null,
      },
    ],
    [
      " rtr",
      [0x4e, 0x77],
      <Instruction>{
        size: 0,
        operation: Operation.RTR,
        operands: [null, null],
        extra: null,
      },
    ],
    [
      " rts",
      [0x4e, 0x75],
      <Instruction>{
        size: 0,
        operation: Operation.RTS,
        operands: [null, null],
        extra: null,
      },
    ],
    [
      " stop #123",
      [0x4e, 0x72, 0x00, 0x7b],
      <Instruction>{
        size: 0,
        operation: Operation.STOP,
        operands: [IMM16(123), null],
        extra: null,
      },
    ],
    [
      " trapv",
      [0x4e, 0x76],
      <Instruction>{
        size: 0,
        operation: Operation.TRAPV,
        operands: [null, null],
        extra: null,
      },
    ],
    [
      " swap d7",
      [0x48, 0x47],
      <Instruction>{
        size: 0,
        operation: Operation.SWAP,
        operands: [DR(7), null],
        extra: null,
      },
    ],
    [
      " bkpt #3",
      [0x48, 0x4b],
      <Instruction>{
        size: 0,
        operation: Operation.BKPT,
        operands: [IMM8(3), null],
        extra: null,
      },
    ],
    [
      " ext.w d6",
      [0x48, 0x86],
      <Instruction>{
        size: 2,
        operation: Operation.EXTW,
        operands: [DR(6), null],
        extra: null,
      },
    ],
    [
      " ext.l d6",
      [0x48, 0xc6],
      <Instruction>{
        size: 4,
        operation: Operation.EXTL,
        operands: [DR(6), null],
        extra: null,
      },
    ],
    [
      " extb.l d6",
      [0x49, 0xc6],
      <Instruction>{
        size: 4,
        operation: Operation.EXTBL,
        operands: [DR(6), null],
        extra: null,
      },
    ],
    [
      " link.w a0,#1234",
      [0x4e, 0x50, 0x04, 0xd2],
      <Instruction>{
        size: 2,
        operation: Operation.LINK,
        operands: [AR(0), IMM16(1234)],
        extra: null,
      },
    ],
    [
      " link.l a5,#$12345678",
      [0x48, 0x0d, 0x12, 0x34, 0x56, 0x78],
      <Instruction>{
        size: 4,
        operation: Operation.LINK,
        operands: [AR(5), IMM32(0x12345678)],
        extra: null,
      },
    ],
    [
      " unlk a2",
      [0x4e, 0x5a],
      <Instruction>{
        size: 0,
        operation: Operation.UNLK,
        operands: [AR(2), null],
        extra: null,
      },
    ],
    [
      " trap #15",
      [0x4e, 0x4f],
      <Instruction>{
        size: 0,
        operation: Operation.TRAP,
        operands: [IMM8(15), null],
        extra: null,
      },
    ],
    [
      " divs.w (a1)+,d2",
      [0x85, 0xd9],
      <Instruction>{
        size: 2,
        operation: Operation.DIVS,
        operands: [ARINC(1), DR(2)],
        extra: null,
      },
    ],
    [
      " divs.l d0,d2",
      [0x4c, 0x40, 0x28, 0x02],
      <Instruction>{
        size: 4,
        operation: Operation.DIVSL,
        operands: [DR(0), DR(2)],
        extra: null,
      },
    ],
    [
      " divs.l d0,d3:d2",
      [0x4c, 0x40, 0x2c, 0x03],
      <Instruction>{
        size: 4,
        operation: Operation.DIVSL,
        operands: [DR(0), DPAIR(2, 3)],
        extra: null,
      },
    ],
    [
      " divsl.l d0,d3:d2",
      [0x4c, 0x40, 0x28, 0x03],
      <Instruction>{
        size: 4,
        operation: Operation.DIVSLL,
        operands: [DR(0), DPAIR(2, 3)],
        extra: null,
      },
    ],
    [
      " divu.w (a1)+,d2",
      [0x84, 0xd9],
      <Instruction>{
        size: 2,
        operation: Operation.DIVU,
        operands: [ARINC(1), DR(2)],
        extra: null,
      },
    ],
    [
      " divu.l d0,d2",
      [0x4c, 0x40, 0x20, 0x02],
      <Instruction>{
        size: 4,
        operation: Operation.DIVUL,
        operands: [DR(0), DR(2)],
        extra: null,
      },
    ],
    [
      " divu.l d0,d3:d2",
      [0x4c, 0x40, 0x24, 0x03],
      <Instruction>{
        size: 4,
        operation: Operation.DIVUL,
        operands: [DR(0), DPAIR(2, 3)],
        extra: null,
      },
    ],
    [
      " divul.l d0,d3:d2",
      [0x4c, 0x40, 0x20, 0x03],
      <Instruction>{
        size: 4,
        operation: Operation.DIVULL,
        operands: [DR(0), DPAIR(2, 3)],
        extra: null,
      },
    ],
    [
      " jmp (a0)",
      [0x4e, 0xd0],
      <Instruction>{
        size: 0,
        operation: Operation.JMP,
        operands: [ARIND(0), null],
        extra: null,
      },
    ],
    [
      " jmp $12345678",
      [0x4e, 0xf9, 0x12, 0x34, 0x56, 0x78],
      <Instruction>{
        size: 0,
        operation: Operation.JMP,
        operands: [ABS32(0x12345678), null],
        extra: null,
      },
    ],
    [
      " jmp 123(pc)",
      [0x4e, 0xfa, 0x00, 0x7b],
      <Instruction>{
        size: 0,
        operation: Operation.JMP,
        operands: [
          PCDISP(2, {
            baseDisplacement: 123,
            outerDisplacement: 0,
            indexer: null,
            indirection: null,
          }),
          null,
        ],
        extra: null,
      },
    ],
    [
      " jsr (a0)",
      [0x4e, 0x90],
      <Instruction>{
        size: 0,
        operation: Operation.JSR,
        operands: [ARIND(0), null],
        extra: null,
      },
    ],
    [
      " jsr $12345678",
      [0x4e, 0xb9, 0x12, 0x34, 0x56, 0x78],
      <Instruction>{
        size: 0,
        operation: Operation.JSR,
        operands: [ABS32(0x12345678), null],
        extra: null,
      },
    ],
    [
      " jsr 123(pc)",
      [0x4e, 0xba, 0x00, 0x7b],
      <Instruction>{
        size: 0,
        operation: Operation.JSR,
        operands: [
          PCDISP(2, {
            baseDisplacement: 123,
            outerDisplacement: 0,
            indexer: null,
            indirection: null,
          }),
          null,
        ],
        extra: null,
      },
    ],
    [
      " muls.w  d0,d1",
      [0xc3, 0xc0],
      <Instruction>{
        size: 2,
        operation: Operation.MULS,
        operands: [DR(0), DR(1)],
        extra: null,
      },
    ],
    [
      " muls.l  d0,d1",
      [0x4c, 0x00, 0x18, 0x01],
      <Instruction>{
        size: 4,
        operation: Operation.MULS,
        operands: [DR(0), DR(1)],
        extra: null,
      },
    ],
    [
      " muls.l  d0,d2:d1",
      [0x4c, 0x00, 0x1c, 0x02],
      <Instruction>{
        size: 4,
        operation: Operation.MULS,
        operands: [DR(0), DPAIR(1, 2)],
        extra: null,
      },
    ],
    [
      " mulu.w  d0,d1",
      [0xc2, 0xc0],
      <Instruction>{
        size: 2,
        operation: Operation.MULU,
        operands: [DR(0), DR(1)],
        extra: null,
      },
    ],
    [
      " mulu.l  d0,d1",
      [0x4c, 0x00, 0x10, 0x01],
      <Instruction>{
        size: 4,
        operation: Operation.MULU,
        operands: [DR(0), DR(1)],
        extra: null,
      },
    ],
    [
      " mulu.l  d0,d2:d1",
      [0x4c, 0x00, 0x14, 0x02],
      <Instruction>{
        size: 4,
        operation: Operation.MULU,
        operands: [DR(0), DPAIR(1, 2)],
        extra: null,
      },
    ],
    [
      " nbcd  (a0)+",
      [0x48, 0x18],
      <Instruction>{
        size: 1,
        operation: Operation.NBCD,
        operands: [ARINC(0), null],
        extra: null,
      },
    ],
    [
      " move sr,d0",
      [0x40, 0xc0],
      <Instruction>{
        size: 2,
        operation: Operation.MOVEFROMSR,
        operands: [Implied(), DR(0)],
        extra: null,
      },
    ],
    [
      " move d0,sr",
      [0x46, 0xc0],
      <Instruction>{
        size: 2,
        operation: Operation.MOVETOSR,
        operands: [DR(0), Implied()],
        extra: null,
      },
    ],
    [
      " move a0,usp",
      [0x4e, 0x60],
      <Instruction>{
        size: 4,
        operation: Operation.MOVETOUSP,
        operands: [AR(0), Implied()],
        extra: null,
      },
    ],
    [
      " move usp,a3",
      [0x4e, 0x6b],
      <Instruction>{
        size: 4,
        operation: Operation.MOVEFROMUSP,
        operands: [Implied(), AR(3)],
        extra: null,
      },
    ],
    [
      " move d0,ccr",
      [0x44, 0xc0],
      <Instruction>{
        size: 2,
        operation: Operation.MOVETOCCR,
        operands: [DR(0), Implied()],
        extra: null,
      },
    ],
    [
      " move ccr,d0",
      [0x42, 0xc0],
      <Instruction>{
        size: 2,
        operation: Operation.MOVEFROMCCR,
        operands: [Implied(), DR(0)],
        extra: null,
      },
    ],
    [
      " pea (a0)",
      [0x48, 0x50],
      <Instruction>{
        size: 4,
        operation: Operation.PEA,
        operands: [ARIND(0), Implied()],
        extra: null,
      },
    ],
    [
      " movem.w d0-d4/a0-a2,-(a4)",
      [0x48, 0xa4, 0xf8, 0xe0],
      <Instruction>{
        size: 2,
        operation: Operation.MOVEM,
        operands: [REGLIST(0b1111100011100000), ARDEC(4)],
        extra: null,
      },
    ],
    [
      " movem.l (a4)+,d0-d4/a0-a2",
      [0x4c, 0xdc, 0x07, 0x1f],
      <Instruction>{
        size: 4,
        operation: Operation.MOVEM,
        operands: [ARINC(4), REGLIST(0b0000011100011111)],
        extra: null,
      },
    ],
    [
      " clr.b d0",
      [0x42, 0x00],
      <Instruction>{
        size: 1,
        operation: Operation.CLR,
        operands: [Implied(), DR(0)],
        extra: null,
      },
    ],
    [
      " clr.w (a0)+",
      [0x42, 0x58],
      <Instruction>{
        size: 2,
        operation: Operation.CLR,
        operands: [Implied(), ARINC(0)],
        extra: null,
      },
    ],
    [
      " clr.l (a4)",
      [0x42, 0x94],
      <Instruction>{
        size: 4,
        operation: Operation.CLR,
        operands: [Implied(), ARIND(4)],
        extra: null,
      },
    ],
    [
      " neg.b d0",
      [0x44, 0x00],
      <Instruction>{
        size: 1,
        operation: Operation.NEG,
        operands: [Implied(), DR(0)],
        extra: null,
      },
    ],
    [
      " neg.w (a0)+",
      [0x44, 0x58],
      <Instruction>{
        size: 2,
        operation: Operation.NEG,
        operands: [Implied(), ARINC(0)],
        extra: null,
      },
    ],
    [
      " neg.l (a4)",
      [0x44, 0x94],
      <Instruction>{
        size: 4,
        operation: Operation.NEG,
        operands: [Implied(), ARIND(4)],
        extra: null,
      },
    ],
    [
      " negx.b d0",
      [0x40, 0x00],
      <Instruction>{
        size: 1,
        operation: Operation.NEGX,
        operands: [Implied(), DR(0)],
        extra: null,
      },
    ],
    [
      " negx.w (a0)+",
      [0x40, 0x58],
      <Instruction>{
        size: 2,
        operation: Operation.NEGX,
        operands: [Implied(), ARINC(0)],
        extra: null,
      },
    ],
    [
      " negx.l (a4)",
      [0x40, 0x94],
      <Instruction>{
        size: 4,
        operation: Operation.NEGX,
        operands: [Implied(), ARIND(4)],
        extra: null,
      },
    ],
    [
      " not.b d0",
      [0x46, 0x00],
      <Instruction>{
        size: 1,
        operation: Operation.NOT,
        operands: [Implied(), DR(0)],
        extra: null,
      },
    ],
    [
      " not.w (a0)+",
      [0x46, 0x58],
      <Instruction>{
        size: 2,
        operation: Operation.NOT,
        operands: [Implied(), ARINC(0)],
        extra: null,
      },
    ],
    [
      " not.l (a4)",
      [0x46, 0x94],
      <Instruction>{
        size: 4,
        operation: Operation.NOT,
        operands: [Implied(), ARIND(4)],
        extra: null,
      },
    ],
    [
      " tst.b d0",
      [0x4a, 0x00],
      <Instruction>{
        size: 1,
        operation: Operation.TST,
        operands: [Implied(), DR(0)],
        extra: null,
      },
    ],
    [
      " tst.w (a0)+",
      [0x4a, 0x58],
      <Instruction>{
        size: 2,
        operation: Operation.TST,
        operands: [Implied(), ARINC(0)],
        extra: null,
      },
    ],
    [
      " tst.l (a4)",
      [0x4a, 0x94],
      <Instruction>{
        size: 4,
        operation: Operation.TST,
        operands: [Implied(), ARIND(4)],
        extra: null,
      },
    ],
    [
      " chk.w (a4),d2",
      [0x45, 0x94],
      <Instruction>{
        size: 2,
        operation: Operation.CHK,
        operands: [ARIND(4), DR(2)],
        extra: null,
      },
    ],
    [
      " chk.l (a4),d2",
      [0x45, 0x14],
      <Instruction>{
        size: 4,
        operation: Operation.CHK,
        operands: [ARIND(4), DR(2)],
        extra: null,
      },
    ],
    [
      " bfchg (a4){12:7}",
      [0xea, 0xd4, 0x03, 0x07],
      <Instruction>{
        size: 0,
        operation: Operation.BFCHG,
        operands: [null, ARIND(4)],
        extra: Bitfield(STATIC(12), STATIC(7)),
      },
    ],
    [
      " bfchg (a4){d2:7}",
      [0xea, 0xd4, 0x08, 0x87],
      <Instruction>{
        size: 0,
        operation: Operation.BFCHG,
        operands: [null, ARIND(4)],
        extra: Bitfield(DYNAMIC(2), STATIC(7)),
      },
    ],
    [
      " bfchg (a4){d2:d3}",
      [0xea, 0xd4, 0x08, 0xa3],
      <Instruction>{
        size: 0,
        operation: Operation.BFCHG,
        operands: [null, ARIND(4)],
        extra: Bitfield(DYNAMIC(2), DYNAMIC(3)),
      },
    ],
    [
      " bfclr (a4){12:7}",
      [0xec, 0xd4, 0x03, 0x07],
      <Instruction>{
        size: 0,
        operation: Operation.BFCLR,
        operands: [null, ARIND(4)],
        extra: Bitfield(STATIC(12), STATIC(7)),
      },
    ],
    [
      " bfexts (a4){12:7},d1",
      [0xeb, 0xd4, 0x13, 0x07],
      <Instruction>{
        size: 0,
        operation: Operation.BFEXTS,
        operands: [ARIND(4), DR(1)],
        extra: Bitfield(STATIC(12), STATIC(7)),
      },
    ],
    [
      " bfextu (a4){12:7},d1",
      [0xe9, 0xd4, 0x13, 0x07],
      <Instruction>{
        size: 0,
        operation: Operation.BFEXTU,
        operands: [ARIND(4), DR(1)],
        extra: Bitfield(STATIC(12), STATIC(7)),
      },
    ],
    [
      " bfffo (a4){12:7},d1",
      [0xed, 0xd4, 0x13, 0x07],
      <Instruction>{
        size: 0,
        operation: Operation.BFFFO,
        operands: [ARIND(4), DR(1)],
        extra: Bitfield(STATIC(12), STATIC(7)),
      },
    ],
    [
      " bfins d1,(a4){12:7}",
      [0xef, 0xd4, 0x13, 0x07],
      <Instruction>{
        size: 0,
        operation: Operation.BFINS,
        operands: [DR(1), ARIND(4)],
        extra: Bitfield(STATIC(12), STATIC(7)),
      },
    ],
    [
      " bfset (a4){12:7}",
      [0xee, 0xd4, 0x03, 0x07],
      <Instruction>{
        size: 0,
        operation: Operation.BFSET,
        operands: [null, ARIND(4)],
        extra: Bitfield(STATIC(12), STATIC(7)),
      },
    ],
    [
      " bftst (a4){12:7}",
      [0xe8, 0xd4, 0x03, 0x07],
      <Instruction>{
        size: 0,
        operation: Operation.BFTST,
        operands: [null, ARIND(4)],
        extra: Bitfield(STATIC(12), STATIC(7)),
      },
    ],
    [
      " .self: dbf d3,.self",
      [0x51, 0xcb, 0xff, 0xfe],
      <Instruction>{
        size: 2,
        operation: Operation.DBCC,
        operands: [DR(3), PCDISP(2, simpleDisp(-2))],
        extra: Condition(ConditionCode.CC_F),
      },
    ],
    [
      " .self: dbhi d3,.self",
      [0x52, 0xcb, 0xff, 0xfe],
      <Instruction>{
        size: 2,
        operation: Operation.DBCC,
        operands: [DR(3), PCDISP(2, simpleDisp(-2))],
        extra: Condition(ConditionCode.CC_HI),
      },
    ],
    [
      " .self: dbls d3,.self",
      [0x53, 0xcb, 0xff, 0xfe],
      <Instruction>{
        size: 2,
        operation: Operation.DBCC,
        operands: [DR(3), PCDISP(2, simpleDisp(-2))],
        extra: Condition(ConditionCode.CC_LS),
      },
    ],
    [
      " .self: dbcc d3,.self",
      [0x54, 0xcb, 0xff, 0xfe],
      <Instruction>{
        size: 2,
        operation: Operation.DBCC,
        operands: [DR(3), PCDISP(2, simpleDisp(-2))],
        extra: Condition(ConditionCode.CC_CC),
      },
    ],
    [
      " .self: dbhs d3,.self",
      [0x54, 0xcb, 0xff, 0xfe],
      <Instruction>{
        size: 2,
        operation: Operation.DBCC,
        operands: [DR(3), PCDISP(2, simpleDisp(-2))],
        extra: Condition(ConditionCode.CC_CC),
      },
    ],
    [
      " .self: dbcs d3,.self",
      [0x55, 0xcb, 0xff, 0xfe],
      <Instruction>{
        size: 2,
        operation: Operation.DBCC,
        operands: [DR(3), PCDISP(2, simpleDisp(-2))],
        extra: Condition(ConditionCode.CC_CS),
      },
    ],
    [
      " .self: dblo d3,.self",
      [0x55, 0xcb, 0xff, 0xfe],
      <Instruction>{
        size: 2,
        operation: Operation.DBCC,
        operands: [DR(3), PCDISP(2, simpleDisp(-2))],
        extra: Condition(ConditionCode.CC_CS),
      },
    ],
    [
      " .self: dbne d3,.self",
      [0x56, 0xcb, 0xff, 0xfe],
      <Instruction>{
        size: 2,
        operation: Operation.DBCC,
        operands: [DR(3), PCDISP(2, simpleDisp(-2))],
        extra: Condition(ConditionCode.CC_NE),
      },
    ],
    [
      " .self: dbeq d3,.self",
      [0x57, 0xcb, 0xff, 0xfe],
      <Instruction>{
        size: 2,
        operation: Operation.DBCC,
        operands: [DR(3), PCDISP(2, simpleDisp(-2))],
        extra: Condition(ConditionCode.CC_EQ),
      },
    ],
    [
      " .self: dbvc d3,.self",
      [0x58, 0xcb, 0xff, 0xfe],
      <Instruction>{
        size: 2,
        operation: Operation.DBCC,
        operands: [DR(3), PCDISP(2, simpleDisp(-2))],
        extra: Condition(ConditionCode.CC_VC),
      },
    ],
    [
      " .self: dbvs d3,.self",
      [0x59, 0xcb, 0xff, 0xfe],
      <Instruction>{
        size: 2,
        operation: Operation.DBCC,
        operands: [DR(3), PCDISP(2, simpleDisp(-2))],
        extra: Condition(ConditionCode.CC_VS),
      },
    ],
    [
      " .self: dbpl d3,.self",
      [0x5a, 0xcb, 0xff, 0xfe],
      <Instruction>{
        size: 2,
        operation: Operation.DBCC,
        operands: [DR(3), PCDISP(2, simpleDisp(-2))],
        extra: Condition(ConditionCode.CC_PL),
      },
    ],
    [
      " .self: dbmi d3,.self",
      [0x5b, 0xcb, 0xff, 0xfe],
      <Instruction>{
        size: 2,
        operation: Operation.DBCC,
        operands: [DR(3), PCDISP(2, simpleDisp(-2))],
        extra: Condition(ConditionCode.CC_MI),
      },
    ],
    [
      " .self: dbge d3,.self",
      [0x5c, 0xcb, 0xff, 0xfe],
      <Instruction>{
        size: 2,
        operation: Operation.DBCC,
        operands: [DR(3), PCDISP(2, simpleDisp(-2))],
        extra: Condition(ConditionCode.CC_GE),
      },
    ],
    [
      " .self: dblt d3,.self",
      [0x5d, 0xcb, 0xff, 0xfe],
      <Instruction>{
        size: 2,
        operation: Operation.DBCC,
        operands: [DR(3), PCDISP(2, simpleDisp(-2))],
        extra: Condition(ConditionCode.CC_LT),
      },
    ],
    [
      " .self: dbgt d3,.self",
      [0x5e, 0xcb, 0xff, 0xfe],
      <Instruction>{
        size: 2,
        operation: Operation.DBCC,
        operands: [DR(3), PCDISP(2, simpleDisp(-2))],
        extra: Condition(ConditionCode.CC_GT),
      },
    ],
    [
      " .self: dble d3,.self",
      [0x5f, 0xcb, 0xff, 0xfe],
      <Instruction>{
        size: 2,
        operation: Operation.DBCC,
        operands: [DR(3), PCDISP(2, simpleDisp(-2))],
        extra: Condition(ConditionCode.CC_LE),
      },
    ],
    [
      " addq.b #1,d0",
      [0x52, 0x00],
      <Instruction>{
        size: 1,
        operation: Operation.ADDQ,
        operands: [IMM8(1), DR(0)],
        extra: null,
      },
    ],
    [
      " addq.w #7,a0",
      [0x5e, 0x48],
      <Instruction>{
        size: 2,
        operation: Operation.ADDQ,
        operands: [IMM8(7), AR(0)],
        extra: null,
      },
    ],
    [
      " addq.l #8,d0",
      [0x50, 0x80],
      <Instruction>{
        size: 4,
        operation: Operation.ADDQ,
        operands: [IMM8(8), DR(0)],
        extra: null,
      },
    ],
    [
      " subq.b #1,d0",
      [0x53, 0x00],
      <Instruction>{
        size: 1,
        operation: Operation.SUBQ,
        operands: [IMM8(1), DR(0)],
        extra: null,
      },
    ],
    [
      " subq.w #7,a0",
      [0x5f, 0x48],
      <Instruction>{
        size: 2,
        operation: Operation.SUBQ,
        operands: [IMM8(7), AR(0)],
        extra: null,
      },
    ],
    [
      " subq.l #8,d0",
      [0x51, 0x80],
      <Instruction>{
        size: 4,
        operation: Operation.SUBQ,
        operands: [IMM8(8), DR(0)],
        extra: null,
      },
    ],
    [
      " trapne",
      [0x56, 0xfc],
      <Instruction>{
        size: 0,
        operation: Operation.TRAPCC,
        operands: [null, null],
        extra: Condition(ConditionCode.CC_NE),
      },
    ],
    [
      " trapne.w #1234",
      [0x56, 0xfa, 0x04, 0xd2],
      <Instruction>{
        size: 2,
        operation: Operation.TRAPCC,
        operands: [IMM16(1234), null],
        extra: Condition(ConditionCode.CC_NE),
      },
    ],
    [
      " trapne.l #$12345678",
      [0x56, 0xfb, 0x12, 0x34, 0x56, 0x78],
      <Instruction>{
        size: 4,
        operation: Operation.TRAPCC,
        operands: [IMM32(0x12345678), null],
        extra: Condition(ConditionCode.CC_NE),
      },
    ],
    [
      " sne (a0)",
      [0x56, 0xd0],
      <Instruction>{
        size: 1,
        operation: Operation.SCC,
        operands: [Implied(), ARIND(0)],
        extra: Condition(ConditionCode.CC_NE),
      },
    ],
    [
      " addx.b d0,d1",
      [0xd3, 0x00],
      <Instruction>{
        size: 1,
        operation: Operation.ADDX,
        operands: [DR(0), DR(1)],
        extra: null,
      },
    ],
    [
      " addx.w d0,d1",
      [0xd3, 0x40],
      <Instruction>{
        size: 2,
        operation: Operation.ADDX,
        operands: [DR(0), DR(1)],
        extra: null,
      },
    ],
    [
      " addx.l d0,d1",
      [0xd3, 0x80],
      <Instruction>{
        size: 4,
        operation: Operation.ADDX,
        operands: [DR(0), DR(1)],
        extra: null,
      },
    ],
    [
      " addx.b -(a2),-(a3)",
      [0xd7, 0x0a],
      <Instruction>{
        size: 1,
        operation: Operation.ADDX,
        operands: [ARDEC(2), ARDEC(3)],
        extra: null,
      },
    ],
    [
      " addx.w -(a2),-(a3)",
      [0xd7, 0x4a],
      <Instruction>{
        size: 2,
        operation: Operation.ADDX,
        operands: [ARDEC(2), ARDEC(3)],
        extra: null,
      },
    ],
    [
      " addx.l -(a2),-(a3)",
      [0xd7, 0x8a],
      <Instruction>{
        size: 4,
        operation: Operation.ADDX,
        operands: [ARDEC(2), ARDEC(3)],
        extra: null,
      },
    ],
    [
      " add.b (a2),d0",
      [0xd0, 0x12],
      <Instruction>{
        size: 1,
        operation: Operation.ADD,
        operands: [ARIND(2), DR(0)],
        extra: null,
      },
    ],
    [
      " add.w (a2),d0",
      [0xd0, 0x52],
      <Instruction>{
        size: 2,
        operation: Operation.ADD,
        operands: [ARIND(2), DR(0)],
        extra: null,
      },
    ],
    [
      " add.l (a2),d0",
      [0xd0, 0x92],
      <Instruction>{
        size: 4,
        operation: Operation.ADD,
        operands: [ARIND(2), DR(0)],
        extra: null,
      },
    ],
    [
      " add.b d3,(a2)",
      [0xd7, 0x12],
      <Instruction>{
        size: 1,
        operation: Operation.ADD,
        operands: [DR(3), ARIND(2)],
        extra: null,
      },
    ],
    [
      " add.w d3,(a2)",
      [0xd7, 0x52],
      <Instruction>{
        size: 2,
        operation: Operation.ADD,
        operands: [DR(3), ARIND(2)],
        extra: null,
      },
    ],
    [
      " add.l d3,(a2)",
      [0xd7, 0x92],
      <Instruction>{
        size: 4,
        operation: Operation.ADD,
        operands: [DR(3), ARIND(2)],
        extra: null,
      },
    ],
    [
      " subx.b d0,d1",
      [0x93, 0x00],
      <Instruction>{
        size: 1,
        operation: Operation.SUBX,
        operands: [DR(0), DR(1)],
        extra: null,
      },
    ],
    [
      " subx.w d0,d1",
      [0x93, 0x40],
      <Instruction>{
        size: 2,
        operation: Operation.SUBX,
        operands: [DR(0), DR(1)],
        extra: null,
      },
    ],
    [
      " subx.l d0,d1",
      [0x93, 0x80],
      <Instruction>{
        size: 4,
        operation: Operation.SUBX,
        operands: [DR(0), DR(1)],
        extra: null,
      },
    ],
    [
      " subx.b -(a2),-(a3)",
      [0x97, 0x0a],
      <Instruction>{
        size: 1,
        operation: Operation.SUBX,
        operands: [ARDEC(2), ARDEC(3)],
        extra: null,
      },
    ],
    [
      " subx.w -(a2),-(a3)",
      [0x97, 0x4a],
      <Instruction>{
        size: 2,
        operation: Operation.SUBX,
        operands: [ARDEC(2), ARDEC(3)],
        extra: null,
      },
    ],
    [
      " subx.l -(a2),-(a3)",
      [0x97, 0x8a],
      <Instruction>{
        size: 4,
        operation: Operation.SUBX,
        operands: [ARDEC(2), ARDEC(3)],
        extra: null,
      },
    ],
    [
      " sub.b (a2),d0",
      [0x90, 0x12],
      <Instruction>{
        size: 1,
        operation: Operation.SUB,
        operands: [ARIND(2), DR(0)],
        extra: null,
      },
    ],
    [
      " sub.w (a2),d0",
      [0x90, 0x52],
      <Instruction>{
        size: 2,
        operation: Operation.SUB,
        operands: [ARIND(2), DR(0)],
        extra: null,
      },
    ],
    [
      " sub.l (a2),d0",
      [0x90, 0x92],
      <Instruction>{
        size: 4,
        operation: Operation.SUB,
        operands: [ARIND(2), DR(0)],
        extra: null,
      },
    ],
    [
      " sub.b d3,(a2)",
      [0x97, 0x12],
      <Instruction>{
        size: 1,
        operation: Operation.SUB,
        operands: [DR(3), ARIND(2)],
        extra: null,
      },
    ],
    [
      " sub.w d3,(a2)",
      [0x97, 0x52],
      <Instruction>{
        size: 2,
        operation: Operation.SUB,
        operands: [DR(3), ARIND(2)],
        extra: null,
      },
    ],
    [
      " sub.l d3,(a2)",
      [0x97, 0x92],
      <Instruction>{
        size: 4,
        operation: Operation.SUB,
        operands: [DR(3), ARIND(2)],
        extra: null,
      },
    ],
    [
      " suba.w d3,a2",
      [0x94, 0xc3],
      <Instruction>{
        size: 2,
        operation: Operation.SUBA,
        operands: [DR(3), AR(2)],
        extra: null,
      },
    ],
    [
      " suba.l d3,a2",
      [0x95, 0xc3],
      <Instruction>{
        size: 4,
        operation: Operation.SUBA,
        operands: [DR(3), AR(2)],
        extra: null,
      },
    ],
    [
      " cmpa.w (a1),a2",
      [0xb4, 0xd1],
      <Instruction>{
        size: 2,
        operation: Operation.CMPA,
        operands: [ARIND(1), AR(2)],
        extra: null,
      },
    ],
    [
      " cmpa.l (a1),a2",
      [0xb5, 0xd1],
      <Instruction>{
        size: 4,
        operation: Operation.CMPA,
        operands: [ARIND(1), AR(2)],
        extra: null,
      },
    ],
    [
      " cmpm.b (a0)+,(a2)+",
      [0xb5, 0x08],
      <Instruction>{
        size: 1,
        operation: Operation.CMPM,
        operands: [ARINC(0), ARINC(2)],
        extra: null,
      },
    ],
    [
      " cmpm.w (a0)+,(a2)+",
      [0xb5, 0x48],
      <Instruction>{
        size: 2,
        operation: Operation.CMPM,
        operands: [ARINC(0), ARINC(2)],
        extra: null,
      },
    ],
    [
      " cmpm.l (a0)+,(a2)+",
      [0xb5, 0x88],
      <Instruction>{
        size: 4,
        operation: Operation.CMPM,
        operands: [ARINC(0), ARINC(2)],
        extra: null,
      },
    ],
    [
      " cmp.b (a0)+,d7",
      [0xbe, 0x18],
      <Instruction>{
        size: 1,
        operation: Operation.CMP,
        operands: [ARINC(0), DR(7)],
        extra: null,
      },
    ],
    [
      " cmp.w (a0)+,d7",
      [0xbe, 0x58],
      <Instruction>{
        size: 2,
        operation: Operation.CMP,
        operands: [ARINC(0), DR(7)],
        extra: null,
      },
    ],
    [
      " cmp.l (a0)+,d7",
      [0xbe, 0x98],
      <Instruction>{
        size: 4,
        operation: Operation.CMP,
        operands: [ARINC(0), DR(7)],
        extra: null,
      },
    ],
    [
      " eor.b d7,(a0)+",
      [0xbf, 0x18],
      <Instruction>{
        size: 1,
        operation: Operation.EOR,
        operands: [DR(7), ARINC(0)],
        extra: null,
      },
    ],
    [
      " eor.w d7,(a0)+",
      [0xbf, 0x58],
      <Instruction>{
        size: 2,
        operation: Operation.EOR,
        operands: [DR(7), ARINC(0)],
        extra: null,
      },
    ],
    [
      " eor.l d7,-(a0)",
      [0xbf, 0xa0],
      <Instruction>{
        size: 4,
        operation: Operation.EOR,
        operands: [DR(7), ARDEC(0)],
        extra: null,
      },
    ],
    [
      " lab:\n   bra.s lab",
      [0x60, 0xfe],
      <Instruction>{
        size: 1,
        operation: Operation.BRA,
        operands: [PCDISP(2, simpleDisp(-2)), null],
        extra: null,
      },
    ],
    [
      " lab:\n   bra.w lab",
      [0x60, 0x00, 0xff, 0xfe],
      <Instruction>{
        size: 2,
        operation: Operation.BRA,
        operands: [PCDISP(2, simpleDisp(-2)), null],
        extra: null,
      },
    ],
    [
      " lab:\n   bra.l lab",
      [0x60, 0xff, 0xff, 0xff, 0xff, 0xfe],
      <Instruction>{
        size: 4,
        operation: Operation.BRA,
        operands: [PCDISP(2, simpleDisp(-2)), null],
        extra: null,
      },
    ],
    [
      " lab:\n   bsr.s lab",
      [0x61, 0xfe],
      <Instruction>{
        size: 1,
        operation: Operation.BSR,
        operands: [PCDISP(2, simpleDisp(-2)), null],
        extra: null,
      },
    ],
    [
      " lab:\n   bsr.w lab",
      [0x61, 0x00, 0xff, 0xfe],
      <Instruction>{
        size: 2,
        operation: Operation.BSR,
        operands: [PCDISP(2, simpleDisp(-2)), null],
        extra: null,
      },
    ],
    [
      " lab:\n   bsr.l lab",
      [0x61, 0xff, 0xff, 0xff, 0xff, 0xfe],
      <Instruction>{
        size: 4,
        operation: Operation.BSR,
        operands: [PCDISP(2, simpleDisp(-2)), null],
        extra: null,
      },
    ],
    [
      " lab:\n   bne.s lab",
      [0x66, 0xfe],
      <Instruction>{
        size: 1,
        operation: Operation.BCC,
        operands: [PCDISP(2, simpleDisp(-2)), null],
        extra: Condition(ConditionCode.CC_NE),
      },
    ],
    [
      "   beq.w lab",
      [0x67, 0x00, 0xff, 0xfe],
      <Instruction>{
        size: 2,
        operation: Operation.BCC,
        operands: [PCDISP(2, simpleDisp(-2)), null],
        extra: Condition(ConditionCode.CC_EQ),
      },
    ],
    [
      " lab:\n   bcs.l lab",
      [0x65, 0xff, 0xff, 0xff, 0xff, 0xfe],
      <Instruction>{
        size: 4,
        operation: Operation.BCC,
        operands: [PCDISP(2, simpleDisp(-2)), null],
        extra: Condition(ConditionCode.CC_CS),
      },
    ],
    [
      " pack d0,d1,#12",
      [0x83, 0x40, 0x00, 0x0c],
      <Instruction>{
        size: 0,
        operation: Operation.PACK,
        operands: [DR(0), DR(1)],
        extra: PackAdjustment(12),
      },
    ],
    [
      " unpk d0,d1,#12",
      [0x83, 0x80, 0x00, 0x0c],
      <Instruction>{
        size: 0,
        operation: Operation.UNPK,
        operands: [DR(0), DR(1)],
        extra: PackAdjustment(12),
      },
    ],
    [
      " pack -(a0),-(a1),#37",
      [0x83, 0x48, 0x00, 0x25],
      <Instruction>{
        size: 0,
        operation: Operation.PACK,
        operands: [ARDEC(0), ARDEC(1)],
        extra: PackAdjustment(37),
      },
    ],
    [
      " unpk -(a0),-(a1),#37",
      [0x83, 0x88, 0x00, 0x25],
      <Instruction>{
        size: 0,
        operation: Operation.UNPK,
        operands: [ARDEC(0), ARDEC(1)],
        extra: PackAdjustment(37),
      },
    ],
    [
      " sbcd -(a0),-(a1)",
      [0x83, 0x08],
      <Instruction>{
        size: 1,
        operation: Operation.SBCD,
        operands: [ARDEC(0), ARDEC(1)],
        extra: null,
      },
    ],
    [
      " sbcd d3,d4",
      [0x89, 0x03],
      <Instruction>{
        size: 1,
        operation: Operation.SBCD,
        operands: [DR(3), DR(4)],
        extra: null,
      },
    ],
    [
      " or.b (a0)+,d0",
      [0x80, 0x18],
      <Instruction>{
        size: 1,
        operation: Operation.OR,
        operands: [ARINC(0), DR(0)],
        extra: null,
      },
    ],
    [
      " or.w (a0)+,d0",
      [0x80, 0x58],
      <Instruction>{
        size: 2,
        operation: Operation.OR,
        operands: [ARINC(0), DR(0)],
        extra: null,
      },
    ],
    [
      " or.l (a0)+,d0",
      [0x80, 0x98],
      <Instruction>{
        size: 4,
        operation: Operation.OR,
        operands: [ARINC(0), DR(0)],
        extra: null,
      },
    ],
    [
      " or.b d0,(a0)+",
      [0x81, 0x18],
      <Instruction>{
        size: 1,
        operation: Operation.OR,
        operands: [DR(0), ARINC(0)],
        extra: null,
      },
    ],
    [
      " or.w d0,(a0)+",
      [0x81, 0x58],
      <Instruction>{
        size: 2,
        operation: Operation.OR,
        operands: [DR(0), ARINC(0)],
        extra: null,
      },
    ],
    [
      " or.l d0,(a0)+",
      [0x81, 0x98],
      <Instruction>{
        size: 4,
        operation: Operation.OR,
        operands: [DR(0), ARINC(0)],
        extra: null,
      },
    ],
    [
      " exg d0,d5",
      [0xc1, 0x45],
      <Instruction>{
        size: 4,
        operation: Operation.EXG,
        operands: [DR(0), DR(5)],
        extra: null,
      },
    ],
    [
      " exg a0,a5",
      [0xc1, 0x4d],
      <Instruction>{
        size: 4,
        operation: Operation.EXG,
        operands: [AR(0), AR(5)],
        extra: null,
      },
    ],
    [
      " exg d3,a5",
      [0xc7, 0x8d],
      <Instruction>{
        size: 4,
        operation: Operation.EXG,
        operands: [DR(3), AR(5)],
        extra: null,
      },
    ],
    [
      " and.b (a0)+,d0",
      [0xc0, 0x18],
      <Instruction>{
        size: 1,
        operation: Operation.AND,
        operands: [ARINC(0), DR(0)],
        extra: null,
      },
    ],
    [
      " and.w (a0)+,d0",
      [0xc0, 0x58],
      <Instruction>{
        size: 2,
        operation: Operation.AND,
        operands: [ARINC(0), DR(0)],
        extra: null,
      },
    ],
    [
      " and.l (a0)+,d0",
      [0xc0, 0x98],
      <Instruction>{
        size: 4,
        operation: Operation.AND,
        operands: [ARINC(0), DR(0)],
        extra: null,
      },
    ],
    [
      " and.b d0,(a0)+",
      [0xc1, 0x18],
      <Instruction>{
        size: 1,
        operation: Operation.AND,
        operands: [DR(0), ARINC(0)],
        extra: null,
      },
    ],
    [
      " and.w d0,(a0)+",
      [0xc1, 0x58],
      <Instruction>{
        size: 2,
        operation: Operation.AND,
        operands: [DR(0), ARINC(0)],
        extra: null,
      },
    ],
    [
      " and.l d0,(a0)+",
      [0xc1, 0x98],
      <Instruction>{
        size: 4,
        operation: Operation.AND,
        operands: [DR(0), ARINC(0)],
        extra: null,
      },
    ],
    [
      " asl.b #3,d7",
      [0xe7, 0x07],
      <Instruction>{
        size: 1,
        operation: Operation.ASL,
        operands: [IMM8(3), DR(7)],
        extra: null,
      },
    ],
    [
      " asl.w #3,d7",
      [0xe7, 0x47],
      <Instruction>{
        size: 2,
        operation: Operation.ASL,
        operands: [IMM8(3), DR(7)],
        extra: null,
      },
    ],
    [
      " asl.l #3,d7",
      [0xe7, 0x87],
      <Instruction>{
        size: 4,
        operation: Operation.ASL,
        operands: [IMM8(3), DR(7)],
        extra: null,
      },
    ],
    [
      " asr.b #3,d7",
      [0xe6, 0x07],
      <Instruction>{
        size: 1,
        operation: Operation.ASR,
        operands: [IMM8(3), DR(7)],
        extra: null,
      },
    ],
    [
      " asr.w #3,d7",
      [0xe6, 0x47],
      <Instruction>{
        size: 2,
        operation: Operation.ASR,
        operands: [IMM8(3), DR(7)],
        extra: null,
      },
    ],
    [
      " asr.l #3,d7",
      [0xe6, 0x87],
      <Instruction>{
        size: 4,
        operation: Operation.ASR,
        operands: [IMM8(3), DR(7)],
        extra: null,
      },
    ],
    [
      " asl.b d1,d7",
      [0xe3, 0x27],
      <Instruction>{
        size: 1,
        operation: Operation.ASL,
        operands: [DR(1), DR(7)],
        extra: null,
      },
    ],
    [
      " asl.w d1,d7",
      [0xe3, 0x67],
      <Instruction>{
        size: 2,
        operation: Operation.ASL,
        operands: [DR(1), DR(7)],
        extra: null,
      },
    ],
    [
      " asl.l d1,d7",
      [0xe3, 0xa7],
      <Instruction>{
        size: 4,
        operation: Operation.ASL,
        operands: [DR(1), DR(7)],
        extra: null,
      },
    ],
    [
      " asr.b d1,d7",
      [0xe2, 0x27],
      <Instruction>{
        size: 1,
        operation: Operation.ASR,
        operands: [DR(1), DR(7)],
        extra: null,
      },
    ],
    [
      " asr.w d1,d7",
      [0xe2, 0x67],
      <Instruction>{
        size: 2,
        operation: Operation.ASR,
        operands: [DR(1), DR(7)],
        extra: null,
      },
    ],
    [
      " asr.l d1,d7",
      [0xe2, 0xa7],
      <Instruction>{
        size: 4,
        operation: Operation.ASR,
        operands: [DR(1), DR(7)],
        extra: null,
      },
    ],
    [
      " asl.w (a0)",
      [0xe1, 0xd0],
      <Instruction>{
        size: 2,
        operation: Operation.ASL,
        operands: [Implied(), ARIND(0)],
        extra: null,
      },
    ],
    [
      " asr.w (a0)",
      [0xe0, 0xd0],
      <Instruction>{
        size: 2,
        operation: Operation.ASR,
        operands: [Implied(), ARIND(0)],
        extra: null,
      },
    ],
    [
      " lsl.b #3,d7",
      [0xe7, 0x0f],
      <Instruction>{
        size: 1,
        operation: Operation.LSL,
        operands: [IMM8(3), DR(7)],
        extra: null,
      },
    ],
    [
      " lsl.w #3,d7",
      [0xe7, 0x4f],
      <Instruction>{
        size: 2,
        operation: Operation.LSL,
        operands: [IMM8(3), DR(7)],
        extra: null,
      },
    ],
    [
      " lsl.l #3,d7",
      [0xe7, 0x8f],
      <Instruction>{
        size: 4,
        operation: Operation.LSL,
        operands: [IMM8(3), DR(7)],
        extra: null,
      },
    ],
    [
      " lsr.b #3,d7",
      [0xe6, 0x0f],
      <Instruction>{
        size: 1,
        operation: Operation.LSR,
        operands: [IMM8(3), DR(7)],
        extra: null,
      },
    ],
    [
      " lsr.w #3,d7",
      [0xe6, 0x4f],
      <Instruction>{
        size: 2,
        operation: Operation.LSR,
        operands: [IMM8(3), DR(7)],
        extra: null,
      },
    ],
    [
      " lsr.l #3,d7",
      [0xe6, 0x8f],
      <Instruction>{
        size: 4,
        operation: Operation.LSR,
        operands: [IMM8(3), DR(7)],
        extra: null,
      },
    ],
    [
      " lsl.b d1,d7",
      [0xe3, 0x2f],
      <Instruction>{
        size: 1,
        operation: Operation.LSL,
        operands: [DR(1), DR(7)],
        extra: null,
      },
    ],
    [
      " lsl.w d1,d7",
      [0xe3, 0x6f],
      <Instruction>{
        size: 2,
        operation: Operation.LSL,
        operands: [DR(1), DR(7)],
        extra: null,
      },
    ],
    [
      " lsl.l d1,d7",
      [0xe3, 0xaf],
      <Instruction>{
        size: 4,
        operation: Operation.LSL,
        operands: [DR(1), DR(7)],
        extra: null,
      },
    ],
    [
      " lsr.b d1,d7",
      [0xe2, 0x2f],
      <Instruction>{
        size: 1,
        operation: Operation.LSR,
        operands: [DR(1), DR(7)],
        extra: null,
      },
    ],
    [
      " lsr.w d1,d7",
      [0xe2, 0x6f],
      <Instruction>{
        size: 2,
        operation: Operation.LSR,
        operands: [DR(1), DR(7)],
        extra: null,
      },
    ],
    [
      " lsr.l d1,d7",
      [0xe2, 0xaf],
      <Instruction>{
        size: 4,
        operation: Operation.LSR,
        operands: [DR(1), DR(7)],
        extra: null,
      },
    ],
    [
      " lsl.w (a0)",
      [0xe3, 0xd0],
      <Instruction>{
        size: 2,
        operation: Operation.LSL,
        operands: [Implied(), ARIND(0)],
        extra: null,
      },
    ],
    [
      " lsr.w (a0)",
      [0xe2, 0xd0],
      <Instruction>{
        size: 2,
        operation: Operation.LSR,
        operands: [Implied(), ARIND(0)],
        extra: null,
      },
    ],
    [
      " roxl.b #3,d7",
      [0xe7, 0x17],
      <Instruction>{
        size: 1,
        operation: Operation.ROXL,
        operands: [IMM8(3), DR(7)],
        extra: null,
      },
    ],
    [
      " roxl.w #3,d7",
      [0xe7, 0x57],
      <Instruction>{
        size: 2,
        operation: Operation.ROXL,
        operands: [IMM8(3), DR(7)],
        extra: null,
      },
    ],
    [
      " roxl.l #3,d7",
      [0xe7, 0x97],
      <Instruction>{
        size: 4,
        operation: Operation.ROXL,
        operands: [IMM8(3), DR(7)],
        extra: null,
      },
    ],
    [
      " roxr.b #3,d7",
      [0xe6, 0x17],
      <Instruction>{
        size: 1,
        operation: Operation.ROXR,
        operands: [IMM8(3), DR(7)],
        extra: null,
      },
    ],
    [
      " roxr.w #3,d7",
      [0xe6, 0x57],
      <Instruction>{
        size: 2,
        operation: Operation.ROXR,
        operands: [IMM8(3), DR(7)],
        extra: null,
      },
    ],
    [
      " roxr.l #3,d7",
      [0xe6, 0x97],
      <Instruction>{
        size: 4,
        operation: Operation.ROXR,
        operands: [IMM8(3), DR(7)],
        extra: null,
      },
    ],
    [
      " roxl.b d1,d7",
      [0xe3, 0x37],
      <Instruction>{
        size: 1,
        operation: Operation.ROXL,
        operands: [DR(1), DR(7)],
        extra: null,
      },
    ],
    [
      " roxl.w d1,d7",
      [0xe3, 0x77],
      <Instruction>{
        size: 2,
        operation: Operation.ROXL,
        operands: [DR(1), DR(7)],
        extra: null,
      },
    ],
    [
      " roxl.l d1,d7",
      [0xe3, 0xb7],
      <Instruction>{
        size: 4,
        operation: Operation.ROXL,
        operands: [DR(1), DR(7)],
        extra: null,
      },
    ],
    [
      " roxr.b d1,d7",
      [0xe2, 0x37],
      <Instruction>{
        size: 1,
        operation: Operation.ROXR,
        operands: [DR(1), DR(7)],
        extra: null,
      },
    ],
    [
      " roxr.w d1,d7",
      [0xe2, 0x77],
      <Instruction>{
        size: 2,
        operation: Operation.ROXR,
        operands: [DR(1), DR(7)],
        extra: null,
      },
    ],
    [
      " roxr.l d1,d7",
      [0xe2, 0xb7],
      <Instruction>{
        size: 4,
        operation: Operation.ROXR,
        operands: [DR(1), DR(7)],
        extra: null,
      },
    ],
    [
      " roxl.w (a0)",
      [0xe5, 0xd0],
      <Instruction>{
        size: 2,
        operation: Operation.ROXL,
        operands: [Implied(), ARIND(0)],
        extra: null,
      },
    ],
    [
      " roxr.w (a0)",
      [0xe4, 0xd0],
      <Instruction>{
        size: 2,
        operation: Operation.ROXR,
        operands: [Implied(), ARIND(0)],
        extra: null,
      },
    ],
    [
      " rol.b #3,d7",
      [0xe7, 0x1f],
      <Instruction>{
        size: 1,
        operation: Operation.ROL,
        operands: [IMM8(3), DR(7)],
        extra: null,
      },
    ],
    [
      " rol.w #3,d7",
      [0xe7, 0x5f],
      <Instruction>{
        size: 2,
        operation: Operation.ROL,
        operands: [IMM8(3), DR(7)],
        extra: null,
      },
    ],
    [
      " rol.l #3,d7",
      [0xe7, 0x9f],
      <Instruction>{
        size: 4,
        operation: Operation.ROL,
        operands: [IMM8(3), DR(7)],
        extra: null,
      },
    ],
    [
      " ror.b #3,d7",
      [0xe6, 0x1f],
      <Instruction>{
        size: 1,
        operation: Operation.ROR,
        operands: [IMM8(3), DR(7)],
        extra: null,
      },
    ],
    [
      " ror.w #3,d7",
      [0xe6, 0x5f],
      <Instruction>{
        size: 2,
        operation: Operation.ROR,
        operands: [IMM8(3), DR(7)],
        extra: null,
      },
    ],
    [
      " ror.l #3,d7",
      [0xe6, 0x9f],
      <Instruction>{
        size: 4,
        operation: Operation.ROR,
        operands: [IMM8(3), DR(7)],
        extra: null,
      },
    ],
    [
      " rol.b d1,d7",
      [0xe3, 0x3f],
      <Instruction>{
        size: 1,
        operation: Operation.ROL,
        operands: [DR(1), DR(7)],
        extra: null,
      },
    ],
    [
      " rol.w d1,d7",
      [0xe3, 0x7f],
      <Instruction>{
        size: 2,
        operation: Operation.ROL,
        operands: [DR(1), DR(7)],
        extra: null,
      },
    ],
    [
      " rol.l d1,d7",
      [0xe3, 0xbf],
      <Instruction>{
        size: 4,
        operation: Operation.ROL,
        operands: [DR(1), DR(7)],
        extra: null,
      },
    ],
    [
      " ror.b d1,d7",
      [0xe2, 0x3f],
      <Instruction>{
        size: 1,
        operation: Operation.ROR,
        operands: [DR(1), DR(7)],
        extra: null,
      },
    ],
    [
      " ror.w d1,d7",
      [0xe2, 0x7f],
      <Instruction>{
        size: 2,
        operation: Operation.ROR,
        operands: [DR(1), DR(7)],
        extra: null,
      },
    ],
    [
      " ror.l d1,d7",
      [0xe2, 0xbf],
      <Instruction>{
        size: 4,
        operation: Operation.ROR,
        operands: [DR(1), DR(7)],
        extra: null,
      },
    ],
    [
      " rol.w (a0)",
      [0xe7, 0xd0],
      <Instruction>{
        size: 2,
        operation: Operation.ROL,
        operands: [Implied(), ARIND(0)],
        extra: null,
      },
    ],
    [
      " ror.w (a0)",
      [0xe6, 0xd0],
      <Instruction>{
        size: 2,
        operation: Operation.ROR,
        operands: [Implied(), ARIND(0)],
        extra: null,
      },
    ],
    [
      " moveq #-1,d2",
      [0x74, 0xff],
      <Instruction>{
        size: 4,
        operation: Operation.MOVEQ,
        operands: [IMM8(0xff), DR(2)],
        extra: null,
      },
    ],
    [
      " moveq #127,d5",
      [0x7a, 0x7f],
      <Instruction>{
        size: 4,
        operation: Operation.MOVEQ,
        operands: [IMM8(0x7f), DR(5)],
        extra: null,
      },
    ],
    [
      " fabs fp1",
      [0xf2, 0x00, 0x04, 0x98],
      <Instruction>{
        size: 10,
        operation: Operation.FABS,
        operands: [FR(1), FR(1)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " fsabs fp1",
      [0xf2, 0x00, 0x04, 0xd8],
      <Instruction>{
        size: 10,
        operation: Operation.FSABS,
        operands: [FR(1), FR(1)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " fdabs fp1",
      [0xf2, 0x00, 0x04, 0xdc],
      <Instruction>{
        size: 10,
        operation: Operation.FDABS,
        operands: [FR(1), FR(1)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " fabs.l (a0),fp1",
      [0xf2, 0x10, 0x40, 0x98],
      <Instruction>{
        size: 4,
        operation: Operation.FABS,
        operands: [ARIND(0), FR(1)],
        extra: FloatFormat(FPF_LONG_INT()),
      },
    ],
    [
      " fabs.s (a0),fp1",
      [0xf2, 0x10, 0x44, 0x98],
      <Instruction>{
        size: 4,
        operation: Operation.FABS,
        operands: [ARIND(0), FR(1)],
        extra: FloatFormat(FPF_SINGLE()),
      },
    ],
    [
      " fabs.d (a0),fp1",
      [0xf2, 0x10, 0x54, 0x98],
      <Instruction>{
        size: 8,
        operation: Operation.FABS,
        operands: [ARIND(0), FR(1)],
        extra: FloatFormat(FPF_DOUBLE()),
      },
    ],
    [
      " fabs.w (a0),fp1",
      [0xf2, 0x10, 0x50, 0x98],
      <Instruction>{
        size: 2,
        operation: Operation.FABS,
        operands: [ARIND(0), FR(1)],
        extra: FloatFormat(FPF_WORD_INT()),
      },
    ],
    [
      " fabs.b (a0),fp1",
      [0xf2, 0x10, 0x58, 0x98],
      <Instruction>{
        size: 1,
        operation: Operation.FABS,
        operands: [ARIND(0), FR(1)],
        extra: FloatFormat(FPF_BYTE_INT()),
      },
    ],
    [
      " fabs.x (a0),fp1",
      [0xf2, 0x10, 0x48, 0x98],
      <Instruction>{
        size: 10,
        operation: Operation.FABS,
        operands: [ARIND(0), FR(1)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " fabs.p (a0),fp1",
      [0xf2, 0x10, 0x4c, 0x98],
      <Instruction>{
        size: 12,
        operation: Operation.FABS,
        operands: [ARIND(0), FR(1)],
        extra: FloatFormat(FPF_PACKED_DECIMAL_REAL_STATIC(0)),
      },
    ],
    [
      " fabs fp3,fp1",
      [0xf2, 0x00, 0x0c, 0x98],
      <Instruction>{
        size: 10,
        operation: Operation.FABS,
        operands: [FR(3), FR(1)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " facos fp0,fp1",
      [0xf2, 0x00, 0x00, 0x9c],
      <Instruction>{
        size: 10,
        operation: Operation.FACOS,
        operands: [FR(0), FR(1)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " facos.s (a6),fp1",
      [0xf2, 0x16, 0x44, 0x9c],
      <Instruction>{
        size: 4,
        operation: Operation.FACOS,
        operands: [ARIND(6), FR(1)],
        extra: FloatFormat(FPF_SINGLE()),
      },
    ],
    [
      " fadd fp0,fp1",
      [0xf2, 0x00, 0x00, 0xa2],
      <Instruction>{
        size: 10,
        operation: Operation.FADD,
        operands: [FR(0), FR(1)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " fsadd.s (a6),fp1",
      [0xf2, 0x16, 0x44, 0xe2],
      <Instruction>{
        size: 4,
        operation: Operation.FSADD,
        operands: [ARIND(6), FR(1)],
        extra: FloatFormat(FPF_SINGLE()),
      },
    ],
    [
      " fdadd.d (a6),fp1",
      [0xf2, 0x16, 0x54, 0xe6],
      <Instruction>{
        size: 8,
        operation: Operation.FDADD,
        operands: [ARIND(6), FR(1)],
        extra: FloatFormat(FPF_DOUBLE()),
      },
    ],
    [
      " fasin fp3",
      [0xf2, 0x00, 0x0d, 0x8c],
      <Instruction>{
        size: 10,
        operation: Operation.FASIN,
        operands: [FR(3), FR(3)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " fasin fp0,fp1",
      [0xf2, 0x00, 0x00, 0x8c],
      <Instruction>{
        size: 10,
        operation: Operation.FASIN,
        operands: [FR(0), FR(1)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " fasin.s (a0),fp1",
      [0xf2, 0x10, 0x44, 0x8c],
      <Instruction>{
        size: 4,
        operation: Operation.FASIN,
        operands: [ARIND(0), FR(1)],
        extra: FloatFormat(FPF_SINGLE()),
      },
    ],
    [
      " fatan fp3",
      [0xf2, 0x00, 0x0d, 0x8a],
      <Instruction>{
        size: 10,
        operation: Operation.FATAN,
        operands: [FR(3), FR(3)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " fatan fp0,fp1",
      [0xf2, 0x00, 0x00, 0x8a],
      <Instruction>{
        size: 10,
        operation: Operation.FATAN,
        operands: [FR(0), FR(1)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " fatan.s (a0),fp1",
      [0xf2, 0x10, 0x44, 0x8a],
      <Instruction>{
        size: 4,
        operation: Operation.FATAN,
        operands: [ARIND(0), FR(1)],
        extra: FloatFormat(FPF_SINGLE()),
      },
    ],
    [
      " fatanh fp3",
      [0xf2, 0x00, 0x0d, 0x8d],
      <Instruction>{
        size: 10,
        operation: Operation.FATANH,
        operands: [FR(3), FR(3)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " fatanh fp0,fp1",
      [0xf2, 0x00, 0x00, 0x8d],
      <Instruction>{
        size: 10,
        operation: Operation.FATANH,
        operands: [FR(0), FR(1)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " fatanh.s (a0),fp1",
      [0xf2, 0x10, 0x44, 0x8d],
      <Instruction>{
        size: 4,
        operation: Operation.FATANH,
        operands: [ARIND(0), FR(1)],
        extra: FloatFormat(FPF_SINGLE()),
      },
    ],
    [
      " lab: fbne.l lab",
      [0xf2, 0xce, 0xff, 0xff, 0xff, 0xfe],
      <Instruction>{
        size: 4,
        operation: Operation.FBCC,
        operands: [PCDISP(2, simpleDisp(-2)), null],
        extra: FPCondition(FPConditionCode.FPCC_NE),
      },
    ],
    [
      " lab: fbf.w lab",
      [0xf2, 0x80, 0xff, 0xfe],
      <Instruction>{
        size: 2,
        operation: Operation.FBCC,
        operands: [PCDISP(2, simpleDisp(-2)), null],
        extra: FPCondition(FPConditionCode.FPCC_F),
      },
    ],
    [
      " lab: fbeq.w lab",
      [0xf2, 0x81, 0xff, 0xfe],
      <Instruction>{
        size: 2,
        operation: Operation.FBCC,
        operands: [PCDISP(2, simpleDisp(-2)), null],
        extra: FPCondition(FPConditionCode.FPCC_EQ),
      },
    ],
    [
      " lab: fbogt.w lab",
      [0xf2, 0x82, 0xff, 0xfe],
      <Instruction>{
        size: 2,
        operation: Operation.FBCC,
        operands: [PCDISP(2, simpleDisp(-2)), null],
        extra: FPCondition(FPConditionCode.FPCC_OGT),
      },
    ],
    [
      " lab: fboge.w lab",
      [0xf2, 0x83, 0xff, 0xfe],
      <Instruction>{
        size: 2,
        operation: Operation.FBCC,
        operands: [PCDISP(2, simpleDisp(-2)), null],
        extra: FPCondition(FPConditionCode.FPCC_OGE),
      },
    ],
    [
      " lab: fbolt.w lab",
      [0xf2, 0x84, 0xff, 0xfe],
      <Instruction>{
        size: 2,
        operation: Operation.FBCC,
        operands: [PCDISP(2, simpleDisp(-2)), null],
        extra: FPCondition(FPConditionCode.FPCC_OLT),
      },
    ],
    [
      " lab: fbole.w lab",
      [0xf2, 0x85, 0xff, 0xfe],
      <Instruction>{
        size: 2,
        operation: Operation.FBCC,
        operands: [PCDISP(2, simpleDisp(-2)), null],
        extra: FPCondition(FPConditionCode.FPCC_OLE),
      },
    ],
    [
      " lab: fbogl.w lab",
      [0xf2, 0x86, 0xff, 0xfe],
      <Instruction>{
        size: 2,
        operation: Operation.FBCC,
        operands: [PCDISP(2, simpleDisp(-2)), null],
        extra: FPCondition(FPConditionCode.FPCC_OGL),
      },
    ],
    [
      " lab: fbor.w lab",
      [0xf2, 0x87, 0xff, 0xfe],
      <Instruction>{
        size: 2,
        operation: Operation.FBCC,
        operands: [PCDISP(2, simpleDisp(-2)), null],
        extra: FPCondition(FPConditionCode.FPCC_OR),
      },
    ],
    [
      " lab: fbun.w lab",
      [0xf2, 0x88, 0xff, 0xfe],
      <Instruction>{
        size: 2,
        operation: Operation.FBCC,
        operands: [PCDISP(2, simpleDisp(-2)), null],
        extra: FPCondition(FPConditionCode.FPCC_UN),
      },
    ],
    [
      " lab: fbueq.w lab",
      [0xf2, 0x89, 0xff, 0xfe],
      <Instruction>{
        size: 2,
        operation: Operation.FBCC,
        operands: [PCDISP(2, simpleDisp(-2)), null],
        extra: FPCondition(FPConditionCode.FPCC_UEQ),
      },
    ],
    [
      " lab: fbugt.w lab",
      [0xf2, 0x8a, 0xff, 0xfe],
      <Instruction>{
        size: 2,
        operation: Operation.FBCC,
        operands: [PCDISP(2, simpleDisp(-2)), null],
        extra: FPCondition(FPConditionCode.FPCC_UGT),
      },
    ],
    [
      " lab: fbuge.w lab",
      [0xf2, 0x8b, 0xff, 0xfe],
      <Instruction>{
        size: 2,
        operation: Operation.FBCC,
        operands: [PCDISP(2, simpleDisp(-2)), null],
        extra: FPCondition(FPConditionCode.FPCC_UGE),
      },
    ],
    [
      " lab: fbult.w lab",
      [0xf2, 0x8c, 0xff, 0xfe],
      <Instruction>{
        size: 2,
        operation: Operation.FBCC,
        operands: [PCDISP(2, simpleDisp(-2)), null],
        extra: FPCondition(FPConditionCode.FPCC_ULT),
      },
    ],
    [
      " lab: fbule.w lab",
      [0xf2, 0x8d, 0xff, 0xfe],
      <Instruction>{
        size: 2,
        operation: Operation.FBCC,
        operands: [PCDISP(2, simpleDisp(-2)), null],
        extra: FPCondition(FPConditionCode.FPCC_ULE),
      },
    ],
    [
      " lab: fbne.w lab",
      [0xf2, 0x8e, 0xff, 0xfe],
      <Instruction>{
        size: 2,
        operation: Operation.FBCC,
        operands: [PCDISP(2, simpleDisp(-2)), null],
        extra: FPCondition(FPConditionCode.FPCC_NE),
      },
    ],
    [
      " lab: fbt.w lab",
      [0xf2, 0x8f, 0xff, 0xfe],
      <Instruction>{
        size: 2,
        operation: Operation.FBCC,
        operands: [PCDISP(2, simpleDisp(-2)), null],
        extra: FPCondition(FPConditionCode.FPCC_T),
      },
    ],
    [
      " lab: fbsf.w lab",
      [0xf2, 0x90, 0xff, 0xfe],
      <Instruction>{
        size: 2,
        operation: Operation.FBCC,
        operands: [PCDISP(2, simpleDisp(-2)), null],
        extra: FPCondition(FPConditionCode.FPCC_SF),
      },
    ],
    [
      " lab: fbseq.w lab",
      [0xf2, 0x91, 0xff, 0xfe],
      <Instruction>{
        size: 2,
        operation: Operation.FBCC,
        operands: [PCDISP(2, simpleDisp(-2)), null],
        extra: FPCondition(FPConditionCode.FPCC_SEQ),
      },
    ],
    [
      " lab: fbgt.w lab",
      [0xf2, 0x92, 0xff, 0xfe],
      <Instruction>{
        size: 2,
        operation: Operation.FBCC,
        operands: [PCDISP(2, simpleDisp(-2)), null],
        extra: FPCondition(FPConditionCode.FPCC_GT),
      },
    ],
    [
      " lab: fbge.w lab",
      [0xf2, 0x93, 0xff, 0xfe],
      <Instruction>{
        size: 2,
        operation: Operation.FBCC,
        operands: [PCDISP(2, simpleDisp(-2)), null],
        extra: FPCondition(FPConditionCode.FPCC_GE),
      },
    ],
    [
      " lab: fblt.w lab",
      [0xf2, 0x94, 0xff, 0xfe],
      <Instruction>{
        size: 2,
        operation: Operation.FBCC,
        operands: [PCDISP(2, simpleDisp(-2)), null],
        extra: FPCondition(FPConditionCode.FPCC_LT),
      },
    ],
    [
      " lab: fble.w lab",
      [0xf2, 0x95, 0xff, 0xfe],
      <Instruction>{
        size: 2,
        operation: Operation.FBCC,
        operands: [PCDISP(2, simpleDisp(-2)), null],
        extra: FPCondition(FPConditionCode.FPCC_LE),
      },
    ],
    [
      " lab: fbgl.w lab",
      [0xf2, 0x96, 0xff, 0xfe],
      <Instruction>{
        size: 2,
        operation: Operation.FBCC,
        operands: [PCDISP(2, simpleDisp(-2)), null],
        extra: FPCondition(FPConditionCode.FPCC_GL),
      },
    ],
    [
      " lab: fbgle.w lab",
      [0xf2, 0x97, 0xff, 0xfe],
      <Instruction>{
        size: 2,
        operation: Operation.FBCC,
        operands: [PCDISP(2, simpleDisp(-2)), null],
        extra: FPCondition(FPConditionCode.FPCC_GLE),
      },
    ],
    [
      " lab: fbngle.w lab",
      [0xf2, 0x98, 0xff, 0xfe],
      <Instruction>{
        size: 2,
        operation: Operation.FBCC,
        operands: [PCDISP(2, simpleDisp(-2)), null],
        extra: FPCondition(FPConditionCode.FPCC_NGLE),
      },
    ],
    [
      " lab: fbngl.w lab",
      [0xf2, 0x99, 0xff, 0xfe],
      <Instruction>{
        size: 2,
        operation: Operation.FBCC,
        operands: [PCDISP(2, simpleDisp(-2)), null],
        extra: FPCondition(FPConditionCode.FPCC_NGL),
      },
    ],
    [
      " lab: fbnle.w lab",
      [0xf2, 0x9a, 0xff, 0xfe],
      <Instruction>{
        size: 2,
        operation: Operation.FBCC,
        operands: [PCDISP(2, simpleDisp(-2)), null],
        extra: FPCondition(FPConditionCode.FPCC_NLE),
      },
    ],
    [
      " lab: fbnlt.w lab",
      [0xf2, 0x9b, 0xff, 0xfe],
      <Instruction>{
        size: 2,
        operation: Operation.FBCC,
        operands: [PCDISP(2, simpleDisp(-2)), null],
        extra: FPCondition(FPConditionCode.FPCC_NLT),
      },
    ],
    [
      " lab: fbnge.w lab",
      [0xf2, 0x9c, 0xff, 0xfe],
      <Instruction>{
        size: 2,
        operation: Operation.FBCC,
        operands: [PCDISP(2, simpleDisp(-2)), null],
        extra: FPCondition(FPConditionCode.FPCC_NGE),
      },
    ],
    [
      " lab: fbngt.w lab",
      [0xf2, 0x9d, 0xff, 0xfe],
      <Instruction>{
        size: 2,
        operation: Operation.FBCC,
        operands: [PCDISP(2, simpleDisp(-2)), null],
        extra: FPCondition(FPConditionCode.FPCC_NGT),
      },
    ],
    [
      " lab: fbsne.w lab",
      [0xf2, 0x9e, 0xff, 0xfe],
      <Instruction>{
        size: 2,
        operation: Operation.FBCC,
        operands: [PCDISP(2, simpleDisp(-2)), null],
        extra: FPCondition(FPConditionCode.FPCC_SNE),
      },
    ],
    [
      " lab: fbst.w lab",
      [0xf2, 0x9f, 0xff, 0xfe],
      <Instruction>{
        size: 2,
        operation: Operation.FBCC,
        operands: [PCDISP(2, simpleDisp(-2)), null],
        extra: FPCondition(FPConditionCode.FPCC_ST),
      },
    ],
    [
      " fcmp fp2,fp4",
      [0xf2, 0x00, 0x0a, 0x38],
      <Instruction>{
        size: 10,
        operation: Operation.FCMP,
        operands: [FR(2), FR(4)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " fcmp.s (a0),fp4",
      [0xf2, 0x10, 0x46, 0x38],
      <Instruction>{
        size: 4,
        operation: Operation.FCMP,
        operands: [ARIND(0), FR(4)],
        extra: FloatFormat(FPF_SINGLE()),
      },
    ],
    [
      " fcos fp3",
      [0xf2, 0x00, 0x0d, 0x9d],
      <Instruction>{
        size: 10,
        operation: Operation.FCOS,
        operands: [FR(3), FR(3)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " fcos fp0,fp1",
      [0xf2, 0x00, 0x00, 0x9d],
      <Instruction>{
        size: 10,
        operation: Operation.FCOS,
        operands: [FR(0), FR(1)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " fcos.s (a0),fp1",
      [0xf2, 0x10, 0x44, 0x9d],
      <Instruction>{
        size: 4,
        operation: Operation.FCOS,
        operands: [ARIND(0), FR(1)],
        extra: FloatFormat(FPF_SINGLE()),
      },
    ],
    [
      " fcosh fp3",
      [0xf2, 0x00, 0x0d, 0x99],
      <Instruction>{
        size: 10,
        operation: Operation.FCOSH,
        operands: [FR(3), FR(3)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " fcosh fp0,fp1",
      [0xf2, 0x00, 0x00, 0x99],
      <Instruction>{
        size: 10,
        operation: Operation.FCOSH,
        operands: [FR(0), FR(1)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " fcosh.s (a0),fp1",
      [0xf2, 0x10, 0x44, 0x99],
      <Instruction>{
        size: 4,
        operation: Operation.FCOSH,
        operands: [ARIND(0), FR(1)],
        extra: FloatFormat(FPF_SINGLE()),
      },
    ],
    [
      " fdiv fp0,fp1",
      [0xf2, 0x00, 0x00, 0xa0],
      <Instruction>{
        size: 10,
        operation: Operation.FDIV,
        operands: [FR(0), FR(1)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " fdiv.s (a0),fp1",
      [0xf2, 0x10, 0x44, 0xa0],
      <Instruction>{
        size: 4,
        operation: Operation.FDIV,
        operands: [ARIND(0), FR(1)],
        extra: FloatFormat(FPF_SINGLE()),
      },
    ],
    [
      " fsdiv.s (a0),fp1",
      [0xf2, 0x10, 0x44, 0xe0],
      <Instruction>{
        size: 4,
        operation: Operation.FSDIV,
        operands: [ARIND(0), FR(1)],
        extra: FloatFormat(FPF_SINGLE()),
      },
    ],
    [
      " fddiv.s (a0),fp1",
      [0xf2, 0x10, 0x44, 0xe4],
      <Instruction>{
        size: 4,
        operation: Operation.FDDIV,
        operands: [ARIND(0), FR(1)],
        extra: FloatFormat(FPF_SINGLE()),
      },
    ],
    [
      " fetox fp3",
      [0xf2, 0x00, 0x0d, 0x90],
      <Instruction>{
        size: 10,
        operation: Operation.FETOX,
        operands: [FR(3), FR(3)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " fetox fp0,fp1",
      [0xf2, 0x00, 0x00, 0x90],
      <Instruction>{
        size: 10,
        operation: Operation.FETOX,
        operands: [FR(0), FR(1)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " fetox.s (a0),fp1",
      [0xf2, 0x10, 0x44, 0x90],
      <Instruction>{
        size: 4,
        operation: Operation.FETOX,
        operands: [ARIND(0), FR(1)],
        extra: FloatFormat(FPF_SINGLE()),
      },
    ],
    [
      " fetoxm1 fp3",
      [0xf2, 0x00, 0x0d, 0x88],
      <Instruction>{
        size: 10,
        operation: Operation.FETOXM1,
        operands: [FR(3), FR(3)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " fetoxm1 fp0,fp1",
      [0xf2, 0x00, 0x00, 0x88],
      <Instruction>{
        size: 10,
        operation: Operation.FETOXM1,
        operands: [FR(0), FR(1)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " fetoxm1.s (a0),fp1",
      [0xf2, 0x10, 0x44, 0x88],
      <Instruction>{
        size: 4,
        operation: Operation.FETOXM1,
        operands: [ARIND(0), FR(1)],
        extra: FloatFormat(FPF_SINGLE()),
      },
    ],
    [
      " fgetexp fp3",
      [0xf2, 0x00, 0x0d, 0x9e],
      <Instruction>{
        size: 10,
        operation: Operation.FGETEXP,
        operands: [FR(3), FR(3)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " fgetexp fp0,fp1",
      [0xf2, 0x00, 0x00, 0x9e],
      <Instruction>{
        size: 10,
        operation: Operation.FGETEXP,
        operands: [FR(0), FR(1)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " fgetexp.s (a0),fp1",
      [0xf2, 0x10, 0x44, 0x9e],
      <Instruction>{
        size: 4,
        operation: Operation.FGETEXP,
        operands: [ARIND(0), FR(1)],
        extra: FloatFormat(FPF_SINGLE()),
      },
    ],
    [
      " fgetman fp3",
      [0xf2, 0x00, 0x0d, 0x9f],
      <Instruction>{
        size: 10,
        operation: Operation.FGETMAN,
        operands: [FR(3), FR(3)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " fgetman fp0,fp1",
      [0xf2, 0x00, 0x00, 0x9f],
      <Instruction>{
        size: 10,
        operation: Operation.FGETMAN,
        operands: [FR(0), FR(1)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " fgetman.s (a0),fp1",
      [0xf2, 0x10, 0x44, 0x9f],
      <Instruction>{
        size: 4,
        operation: Operation.FGETMAN,
        operands: [ARIND(0), FR(1)],
        extra: FloatFormat(FPF_SINGLE()),
      },
    ],
    [
      " fint fp3",
      [0xf2, 0x00, 0x0d, 0x81],
      <Instruction>{
        size: 10,
        operation: Operation.FINT,
        operands: [FR(3), FR(3)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " fint fp0,fp1",
      [0xf2, 0x00, 0x00, 0x81],
      <Instruction>{
        size: 10,
        operation: Operation.FINT,
        operands: [FR(0), FR(1)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " fint.s (a0),fp1",
      [0xf2, 0x10, 0x44, 0x81],
      <Instruction>{
        size: 4,
        operation: Operation.FINT,
        operands: [ARIND(0), FR(1)],
        extra: FloatFormat(FPF_SINGLE()),
      },
    ],
    [
      " fintrz fp3",
      [0xf2, 0x00, 0x0d, 0x83],
      <Instruction>{
        size: 10,
        operation: Operation.FINTRZ,
        operands: [FR(3), FR(3)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " fintrz fp0,fp1",
      [0xf2, 0x00, 0x00, 0x83],
      <Instruction>{
        size: 10,
        operation: Operation.FINTRZ,
        operands: [FR(0), FR(1)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " fintrz.s (a0),fp1",
      [0xf2, 0x10, 0x44, 0x83],
      <Instruction>{
        size: 4,
        operation: Operation.FINTRZ,
        operands: [ARIND(0), FR(1)],
        extra: FloatFormat(FPF_SINGLE()),
      },
    ],
    [
      " flog10 fp3",
      [0xf2, 0x00, 0x0d, 0x95],
      <Instruction>{
        size: 10,
        operation: Operation.FLOG10,
        operands: [FR(3), FR(3)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " flog10 fp0,fp1",
      [0xf2, 0x00, 0x00, 0x95],
      <Instruction>{
        size: 10,
        operation: Operation.FLOG10,
        operands: [FR(0), FR(1)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " flog10.s (a0),fp1",
      [0xf2, 0x10, 0x44, 0x95],
      <Instruction>{
        size: 4,
        operation: Operation.FLOG10,
        operands: [ARIND(0), FR(1)],
        extra: FloatFormat(FPF_SINGLE()),
      },
    ],
    [
      " flog2 fp3",
      [0xf2, 0x00, 0x0d, 0x96],
      <Instruction>{
        size: 10,
        operation: Operation.FLOG2,
        operands: [FR(3), FR(3)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " flog2 fp0,fp1",
      [0xf2, 0x00, 0x00, 0x96],
      <Instruction>{
        size: 10,
        operation: Operation.FLOG2,
        operands: [FR(0), FR(1)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " flog2.s (a0),fp1",
      [0xf2, 0x10, 0x44, 0x96],
      <Instruction>{
        size: 4,
        operation: Operation.FLOG2,
        operands: [ARIND(0), FR(1)],
        extra: FloatFormat(FPF_SINGLE()),
      },
    ],
    [
      " flogn fp3",
      [0xf2, 0x00, 0x0d, 0x94],
      <Instruction>{
        size: 10,
        operation: Operation.FLOGN,
        operands: [FR(3), FR(3)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " flogn fp0,fp1",
      [0xf2, 0x00, 0x00, 0x94],
      <Instruction>{
        size: 10,
        operation: Operation.FLOGN,
        operands: [FR(0), FR(1)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " flogn.s (a0),fp1",
      [0xf2, 0x10, 0x44, 0x94],
      <Instruction>{
        size: 4,
        operation: Operation.FLOGN,
        operands: [ARIND(0), FR(1)],
        extra: FloatFormat(FPF_SINGLE()),
      },
    ],
    [
      " flognp1 fp3",
      [0xf2, 0x00, 0x0d, 0x86],
      <Instruction>{
        size: 10,
        operation: Operation.FLOGNP1,
        operands: [FR(3), FR(3)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " flognp1 fp0,fp1",
      [0xf2, 0x00, 0x00, 0x86],
      <Instruction>{
        size: 10,
        operation: Operation.FLOGNP1,
        operands: [FR(0), FR(1)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " flognp1.s (a0),fp1",
      [0xf2, 0x10, 0x44, 0x86],
      <Instruction>{
        size: 4,
        operation: Operation.FLOGNP1,
        operands: [ARIND(0), FR(1)],
        extra: FloatFormat(FPF_SINGLE()),
      },
    ],
    [
      " fmod fp0,fp1",
      [0xf2, 0x00, 0x00, 0xa1],
      <Instruction>{
        size: 10,
        operation: Operation.FMOD,
        operands: [FR(0), FR(1)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " fmod.s (a0),fp1",
      [0xf2, 0x10, 0x44, 0xa1],
      <Instruction>{
        size: 4,
        operation: Operation.FMOD,
        operands: [ARIND(0), FR(1)],
        extra: FloatFormat(FPF_SINGLE()),
      },
    ],
    [
      " fmovecr #30,fp1",
      [0xf2, 0x00, 0x5c, 0x9e],
      <Instruction>{
        size: 10,
        operation: Operation.FMOVECR,
        operands: [IMM8(30), FR(1)],
        extra: null,
      },
    ],
    [
      " lab: fdbgt d6,lab",
      [0xf2, 0x4e, 0x00, 0x12, 0xff, 0xfc],
      <Instruction>{
        size: 2,
        operation: Operation.FDBCC,
        operands: [DR(6), PCDISP(4, simpleDisp(-4))],
        extra: FPCondition(FPConditionCode.FPCC_GT),
      },
    ],
    [
      " fmove fp3,fp5",
      [0xf2, 0x00, 0x0e, 0x80],
      <Instruction>{
        size: 10,
        operation: Operation.FMOVE,
        operands: [FR(3), FR(5)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " fmove.x (a0),fp5",
      [0xf2, 0x10, 0x4a, 0x80],
      <Instruction>{
        size: 10,
        operation: Operation.FMOVE,
        operands: [ARIND(0), FR(5)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " fmove.s (a0),fp5",
      [0xf2, 0x10, 0x46, 0x80],
      <Instruction>{
        size: 4,
        operation: Operation.FMOVE,
        operands: [ARIND(0), FR(5)],
        extra: FloatFormat(FPF_SINGLE()),
      },
    ],
    [
      " fsmove.d (a0),fp5",
      [0xf2, 0x10, 0x56, 0xc0],
      <Instruction>{
        size: 8,
        operation: Operation.FSMOVE,
        operands: [ARIND(0), FR(5)],
        extra: FloatFormat(FPF_DOUBLE()),
      },
    ],
    [
      " fdmove.p (a0),fp5",
      [0xf2, 0x10, 0x4e, 0xc4],
      <Instruction>{
        size: 12,
        operation: Operation.FDMOVE,
        operands: [ARIND(0), FR(5)],
        extra: FloatFormat(FPF_PACKED_DECIMAL_REAL_STATIC(0)),
      },
    ],
    [
      " fmove.s fp4,(a1)",
      [0xf2, 0x11, 0x66, 0x00],
      <Instruction>{
        size: 4,
        operation: Operation.FMOVE,
        operands: [FR(4), ARIND(1)],
        extra: FloatFormat(FPF_SINGLE()),
      },
    ],
    [
      " fmove.p fp4,(a1){#12}",
      [0xf2, 0x11, 0x6e, 0x0c],
      <Instruction>{
        size: 12,
        operation: Operation.FMOVE,
        operands: [FR(4), ARIND(1)],
        extra: FloatFormat(FPF_PACKED_DECIMAL_REAL_STATIC(12)),
      },
    ],
    [
      " fmove.p fp4,(a1){#-64}",
      [0xf2, 0x11, 0x6e, 0x40],
      <Instruction>{
        size: 12,
        operation: Operation.FMOVE,
        operands: [FR(4), ARIND(1)],
        extra: FloatFormat(FPF_PACKED_DECIMAL_REAL_STATIC(-64)),
      },
    ],
    [
      " fmove.p fp4,(a1){#63}",
      [0xf2, 0x11, 0x6e, 0x3f],
      <Instruction>{
        size: 12,
        operation: Operation.FMOVE,
        operands: [FR(4), ARIND(1)],
        extra: FloatFormat(FPF_PACKED_DECIMAL_REAL_STATIC(63)),
      },
    ],
    [
      " fmove.p fp4,(a1){d3}",
      [0xf2, 0x11, 0x7e, 0x30],
      <Instruction>{
        size: 12,
        operation: Operation.FMOVE,
        operands: [FR(4), ARIND(1)],
        extra: FloatFormat(FPF_PACKED_DECIMAL_REAL_DYNAMIC(3)),
      },
    ],
    [
      " fmovem.x fp0-fp4,-(a3)",
      [0xf2, 0x23, 0xe0, 0x1f],
      <Instruction>{
        size: 10,
        operation: Operation.FMOVEM,
        operands: [REGLIST(0b11111), ARDEC(3)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " fmovem.x d7,-(a3)",
      [0xf2, 0x23, 0xe8, 0x70],
      <Instruction>{
        size: 10,
        operation: Operation.FMOVEM,
        operands: [DR(7), ARDEC(3)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " fmovem.x d7,(a3)",
      [0xf2, 0x13, 0xf8, 0x70],
      <Instruction>{
        size: 10,
        operation: Operation.FMOVEM,
        operands: [DR(7), ARIND(3)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " fmovem.x (a3),d7",
      [0xf2, 0x13, 0xd8, 0x70],
      <Instruction>{
        size: 10,
        operation: Operation.FMOVEM,
        operands: [ARIND(3), DR(7)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " fmovem.x (a3)+,d7",
      [0xf2, 0x1b, 0xd8, 0x70],
      <Instruction>{
        size: 10,
        operation: Operation.FMOVEM,
        operands: [ARINC(3), DR(7)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " fmovem.x (a3)+,fp0/fp6",
      [0xf2, 0x1b, 0xd0, 0x82],
      <Instruction>{
        size: 10,
        operation: Operation.FMOVEM,
        operands: [ARINC(3), REGLIST(0b1000_0010)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " fmul fp0,fp1",
      [0xf2, 0x00, 0x00, 0xa3],
      <Instruction>{
        size: 10,
        operation: Operation.FMUL,
        operands: [FR(0), FR(1)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " fmul.s (a0),fp1",
      [0xf2, 0x10, 0x44, 0xa3],
      <Instruction>{
        size: 4,
        operation: Operation.FMUL,
        operands: [ARIND(0), FR(1)],
        extra: FloatFormat(FPF_SINGLE()),
      },
    ],
    [
      " fsmul.s (a0),fp1",
      [0xf2, 0x10, 0x44, 0xe3],
      <Instruction>{
        size: 4,
        operation: Operation.FSMUL,
        operands: [ARIND(0), FR(1)],
        extra: FloatFormat(FPF_SINGLE()),
      },
    ],
    [
      " fdmul.s (a0),fp1",
      [0xf2, 0x10, 0x44, 0xe7],
      <Instruction>{
        size: 4,
        operation: Operation.FDMUL,
        operands: [ARIND(0), FR(1)],
        extra: FloatFormat(FPF_SINGLE()),
      },
    ],
    [
      " fneg fp3",
      [0xf2, 0x00, 0x0d, 0x9a],
      <Instruction>{
        size: 10,
        operation: Operation.FNEG,
        operands: [FR(3), FR(3)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " fneg fp0,fp1",
      [0xf2, 0x00, 0x00, 0x9a],
      <Instruction>{
        size: 10,
        operation: Operation.FNEG,
        operands: [FR(0), FR(1)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " fneg.s (a0),fp1",
      [0xf2, 0x10, 0x44, 0x9a],
      <Instruction>{
        size: 4,
        operation: Operation.FNEG,
        operands: [ARIND(0), FR(1)],
        extra: FloatFormat(FPF_SINGLE()),
      },
    ],
    [
      " fsneg.s (a0),fp1",
      [0xf2, 0x10, 0x44, 0xda],
      <Instruction>{
        size: 4,
        operation: Operation.FSNEG,
        operands: [ARIND(0), FR(1)],
        extra: FloatFormat(FPF_SINGLE()),
      },
    ],
    [
      " fdneg.s (a0),fp1",
      [0xf2, 0x10, 0x44, 0xde],
      <Instruction>{
        size: 4,
        operation: Operation.FDNEG,
        operands: [ARIND(0), FR(1)],
        extra: FloatFormat(FPF_SINGLE()),
      },
    ],
    [
      " fnop",
      [0xf2, 0x80, 0x00, 0x00],
      <Instruction>{
        size: 0,
        operation: Operation.FNOP,
        operands: [null, null],
        extra: null,
      },
    ],
    [
      " frem fp0,fp1",
      [0xf2, 0x00, 0x00, 0xa5],
      <Instruction>{
        size: 10,
        operation: Operation.FREM,
        operands: [FR(0), FR(1)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " frem.s (a0),fp1",
      [0xf2, 0x10, 0x44, 0xa5],
      <Instruction>{
        size: 4,
        operation: Operation.FREM,
        operands: [ARIND(0), FR(1)],
        extra: FloatFormat(FPF_SINGLE()),
      },
    ],
    [
      " fscale fp0,fp1",
      [0xf2, 0x00, 0x00, 0xa6],
      <Instruction>{
        size: 10,
        operation: Operation.FSCALE,
        operands: [FR(0), FR(1)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " fscale.s (a0),fp1",
      [0xf2, 0x10, 0x44, 0xa6],
      <Instruction>{
        size: 4,
        operation: Operation.FSCALE,
        operands: [ARIND(0), FR(1)],
        extra: FloatFormat(FPF_SINGLE()),
      },
    ],
    [
      " fsgt (a0)",
      [0xf2, 0x50, 0x00, 0x12],
      <Instruction>{
        size: 1,
        operation: Operation.FSCC,
        operands: [Implied(), ARIND(0)],
        extra: FPCondition(FPConditionCode.FPCC_GT),
      },
    ],
    [
      " fsgldiv fp0,fp1",
      [0xf2, 0x00, 0x00, 0xa4],
      <Instruction>{
        size: 10,
        operation: Operation.FSGLDIV,
        operands: [FR(0), FR(1)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " fsgldiv.s (a0),fp1",
      [0xf2, 0x10, 0x44, 0xa4],
      <Instruction>{
        size: 4,
        operation: Operation.FSGLDIV,
        operands: [ARIND(0), FR(1)],
        extra: FloatFormat(FPF_SINGLE()),
      },
    ],
    [
      " fsglmul fp0,fp1",
      [0xf2, 0x00, 0x00, 0xa7],
      <Instruction>{
        size: 10,
        operation: Operation.FSGLMUL,
        operands: [FR(0), FR(1)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " fsglmul.s (a0),fp1",
      [0xf2, 0x10, 0x44, 0xa7],
      <Instruction>{
        size: 4,
        operation: Operation.FSGLMUL,
        operands: [ARIND(0), FR(1)],
        extra: FloatFormat(FPF_SINGLE()),
      },
    ],
    [
      " fsin fp3",
      [0xf2, 0x00, 0x0d, 0x8e],
      <Instruction>{
        size: 10,
        operation: Operation.FSIN,
        operands: [FR(3), FR(3)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " fsin fp0,fp1",
      [0xf2, 0x00, 0x00, 0x8e],
      <Instruction>{
        size: 10,
        operation: Operation.FSIN,
        operands: [FR(0), FR(1)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " fsin.s (a0),fp1",
      [0xf2, 0x10, 0x44, 0x8e],
      <Instruction>{
        size: 4,
        operation: Operation.FSIN,
        operands: [ARIND(0), FR(1)],
        extra: FloatFormat(FPF_SINGLE()),
      },
    ],
    [
      " fsincos fp0,fp1:fp2",
      [0xf2, 0x00, 0x01, 0x31],
      <Instruction>{
        size: 10,
        operation: Operation.FSINCOS,
        operands: [FR(0), FPAIR(2, 1)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " fsincos.s (a0),fp1:fp2",
      [0xf2, 0x10, 0x45, 0x31],
      <Instruction>{
        size: 4,
        operation: Operation.FSINCOS,
        operands: [ARIND(0), FPAIR(2, 1)],
        extra: FloatFormat(FPF_SINGLE()),
      },
    ],
    [
      " fsinh fp3",
      [0xf2, 0x00, 0x0d, 0x82],
      <Instruction>{
        size: 10,
        operation: Operation.FSINH,
        operands: [FR(3), FR(3)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " fsinh fp0,fp1",
      [0xf2, 0x00, 0x00, 0x82],
      <Instruction>{
        size: 10,
        operation: Operation.FSINH,
        operands: [FR(0), FR(1)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " fsinh.s (a0),fp1",
      [0xf2, 0x10, 0x44, 0x82],
      <Instruction>{
        size: 4,
        operation: Operation.FSINH,
        operands: [ARIND(0), FR(1)],
        extra: FloatFormat(FPF_SINGLE()),
      },
    ],
    [
      " fsqrt fp3",
      [0xf2, 0x00, 0x0d, 0x84],
      <Instruction>{
        size: 10,
        operation: Operation.FSQRT,
        operands: [FR(3), FR(3)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " fsqrt fp0,fp1",
      [0xf2, 0x00, 0x00, 0x84],
      <Instruction>{
        size: 10,
        operation: Operation.FSQRT,
        operands: [FR(0), FR(1)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " fsqrt.s (a0),fp1",
      [0xf2, 0x10, 0x44, 0x84],
      <Instruction>{
        size: 4,
        operation: Operation.FSQRT,
        operands: [ARIND(0), FR(1)],
        extra: FloatFormat(FPF_SINGLE()),
      },
    ],
    [
      " fssqrt fp3",
      [0xf2, 0x00, 0x0d, 0xc1],
      <Instruction>{
        size: 10,
        operation: Operation.FSSQRT,
        operands: [FR(3), FR(3)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " fdsqrt fp3",
      [0xf2, 0x00, 0x0d, 0xc5],
      <Instruction>{
        size: 10,
        operation: Operation.FDSQRT,
        operands: [FR(3), FR(3)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " fsub fp0,fp1",
      [0xf2, 0x00, 0x00, 0xa8],
      <Instruction>{
        size: 10,
        operation: Operation.FSUB,
        operands: [FR(0), FR(1)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " fsub.s (a0),fp1",
      [0xf2, 0x10, 0x44, 0xa8],
      <Instruction>{
        size: 4,
        operation: Operation.FSUB,
        operands: [ARIND(0), FR(1)],
        extra: FloatFormat(FPF_SINGLE()),
      },
    ],
    [
      " fssub.x (a0),fp1",
      [0xf2, 0x10, 0x48, 0xe8],
      <Instruction>{
        size: 10,
        operation: Operation.FSSUB,
        operands: [ARIND(0), FR(1)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " fdsub.l (a0),fp1",
      [0xf2, 0x10, 0x40, 0xec],
      <Instruction>{
        size: 4,
        operation: Operation.FDSUB,
        operands: [ARIND(0), FR(1)],
        extra: FloatFormat(FPF_LONG_INT()),
      },
    ],
    [
      " ftan fp3",
      [0xf2, 0x00, 0x0d, 0x8f],
      <Instruction>{
        size: 10,
        operation: Operation.FTAN,
        operands: [FR(3), FR(3)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " ftan fp0,fp1",
      [0xf2, 0x00, 0x00, 0x8f],
      <Instruction>{
        size: 10,
        operation: Operation.FTAN,
        operands: [FR(0), FR(1)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " ftan.s (a0),fp1",
      [0xf2, 0x10, 0x44, 0x8f],
      <Instruction>{
        size: 4,
        operation: Operation.FTAN,
        operands: [ARIND(0), FR(1)],
        extra: FloatFormat(FPF_SINGLE()),
      },
    ],
    [
      " ftanh fp3",
      [0xf2, 0x00, 0x0d, 0x89],
      <Instruction>{
        size: 10,
        operation: Operation.FTANH,
        operands: [FR(3), FR(3)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " ftanh fp0,fp1",
      [0xf2, 0x00, 0x00, 0x89],
      <Instruction>{
        size: 10,
        operation: Operation.FTANH,
        operands: [FR(0), FR(1)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " ftanh.s (a0),fp1",
      [0xf2, 0x10, 0x44, 0x89],
      <Instruction>{
        size: 4,
        operation: Operation.FTANH,
        operands: [ARIND(0), FR(1)],
        extra: FloatFormat(FPF_SINGLE()),
      },
    ],
    [
      " ftentox fp3",
      [0xf2, 0x00, 0x0d, 0x92],
      <Instruction>{
        size: 10,
        operation: Operation.FTENTOX,
        operands: [FR(3), FR(3)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " ftentox fp0,fp1",
      [0xf2, 0x00, 0x00, 0x92],
      <Instruction>{
        size: 10,
        operation: Operation.FTENTOX,
        operands: [FR(0), FR(1)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " ftentox.s (a0),fp1",
      [0xf2, 0x10, 0x44, 0x92],
      <Instruction>{
        size: 4,
        operation: Operation.FTENTOX,
        operands: [ARIND(0), FR(1)],
        extra: FloatFormat(FPF_SINGLE()),
      },
    ],
    [
      " ftrapgt",
      [0xf2, 0x7c, 0x00, 0x12],
      <Instruction>{
        size: 0,
        operation: Operation.FTRAPCC,
        operands: [Implied(), null],
        extra: FPCondition(FPConditionCode.FPCC_GT),
      },
    ],
    [
      " ftrapeq.w #123",
      [0xf2, 0x7a, 0x00, 0x01, 0x00, 0x7b],
      <Instruction>{
        size: 2,
        operation: Operation.FTRAPCC,
        operands: [Implied(), IMM16(123)],
        extra: FPCondition(FPConditionCode.FPCC_EQ),
      },
    ],
    [
      " ftrapne.l #1234567",
      [0xf2, 0x7b, 0x00, 0x0e, 0x00, 0x12, 0xd6, 0x87],
      <Instruction>{
        size: 4,
        operation: Operation.FTRAPCC,
        operands: [Implied(), IMM32(1234567)],
        extra: FPCondition(FPConditionCode.FPCC_NE),
      },
    ],
    [
      " ftst.l (a0)",
      [0xf2, 0x10, 0x40, 0x3a],
      <Instruction>{
        size: 4,
        operation: Operation.FTST,
        operands: [ARIND(0), null],
        extra: FloatFormat(FPF_LONG_INT()),
      },
    ],
    [
      " ftst fp7",
      [0xf2, 0x00, 0x1c, 0x3a],
      <Instruction>{
        size: 10,
        operation: Operation.FTST,
        operands: [FR(7), null],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " ftwotox fp3",
      [0xf2, 0x00, 0x0d, 0x91],
      <Instruction>{
        size: 10,
        operation: Operation.FTWOTOX,
        operands: [FR(3), FR(3)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " ftwotox fp0,fp1",
      [0xf2, 0x00, 0x00, 0x91],
      <Instruction>{
        size: 10,
        operation: Operation.FTWOTOX,
        operands: [FR(0), FR(1)],
        extra: FloatFormat(FPF_EXTENDED_REAL()),
      },
    ],
    [
      " ftwotox.s (a0),fp1",
      [0xf2, 0x10, 0x44, 0x91],
      <Instruction>{
        size: 4,
        operation: Operation.FTWOTOX,
        operands: [ARIND(0), FR(1)],
        extra: FloatFormat(FPF_SINGLE()),
      },
    ],
    [
      " movec.l a3,cacr",
      [0x4e, 0x7b, 0xb0, 0x02],
      <Instruction>{
        size: 4,
        operation: Operation.MOVEC,
        operands: [AR(3), CONTROLREG(2)],
        extra: null,
      },
    ],
    [
      " movec.l d3,cacr",
      [0x4e, 0x7b, 0x30, 0x02],
      <Instruction>{
        size: 4,
        operation: Operation.MOVEC,
        operands: [DR(3), CONTROLREG(2)],
        extra: null,
      },
    ],
    [
      " movec.l isp,a3",
      [0x4e, 0x7a, 0xb8, 0x04],
      <Instruction>{
        size: 4,
        operation: Operation.MOVEC,
        operands: [CONTROLREG(0x804), AR(3)],
        extra: null,
      },
    ],
    [
      " movec.l isp,d3",
      [0x4e, 0x7a, 0x38, 0x04],
      <Instruction>{
        size: 4,
        operation: Operation.MOVEC,
        operands: [CONTROLREG(0x804), DR(3)],
        extra: null,
      },
    ],
    [
      " adda.w (a3),a2",
      [0xd4, 0xd3],
      <Instruction>{
        size: 2,
        operation: Operation.ADDA,
        operands: [ARIND(3), AR(2)],
        extra: null,
      },
    ],
    [
      " adda.l (a3),a2",
      [0xd5, 0xd3],
      <Instruction>{
        size: 4,
        operation: Operation.ADDA,
        operands: [ARIND(3), AR(2)],
        extra: null,
      },
    ],
  ])("%s", (_name, bytes, expected) => {
    const code = Uint8Array.from(bytes);
    if (expected === DecodingError.NotImplemented) {
      expect(() => decodeInstruction(code)).toThrowError();
    } else {
      const decoded = decodeInstruction(code);
      expect(decoded.instruction).toEqual(expected);
    }
  });
});
