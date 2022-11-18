//! An instruction decoder for M680x0 family instructions.

// Ported from original Rust library by @deplinenoise
// Copyright 2019 Andreas Fredriksson
// https://github.com/deplinenoise/m68kdecode

import { decodeInstruction } from "./decode";
import { instructionToString } from "./to_string";

export * from "./types";

export { decodeInstruction } from "./decode";

export { instructionToString } from "./to_string";

/**
 * Convenience function to decode and convert to string
 *
 * @param code {Uint8Array} Instruction byte array
 * @returns {string} Source instruction text
 */
export function decodeInstructionToString(code: Uint8Array): string {
  return instructionToString(decodeInstruction(code).instruction);
}
