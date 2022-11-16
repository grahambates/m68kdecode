import { DataRegister, Displacement } from "./types";

export function getBits(word: number, first: number, length: number): number {
  const s = word >> first;
  const mask = (1 << length) - 1;
  return s & mask;
}

/// Convenience function (for tests and decoding cases) to generate a simple displacement value.
export const simpleDisp = (disp: number): Displacement => ({
  baseDisplacement: disp,
  outerDisplacement: 0,
  indexer: null,
  indirection: null,
});

/// Convenience function (for tests and decoding cases) to generate a displacement with a data
/// register and scale.
export const drDispScale = (
  dr: DataRegister,
  disp: number,
  scale: number
): Displacement => ({
  baseDisplacement: disp,
  outerDisplacement: 0,
  indexer: { kind: "DR", reg: dr, scale },
  indirection: null,
});

/// Convenience function (for tests and decoding cases) to generate a displacement with a data
/// register.
export const drDisp = (dr: DataRegister, disp: number): Displacement =>
  drDispScale(dr, disp, 0);

// Signed integer conversion
export const i16 = (v: number) => (v << 16) >> 16;
export const u16 = (v: number) => v & 0xffff;
export const i8 = (v: number) => (v << 24) >> 24;
export const u8 = (v: number) => v & 0xff;