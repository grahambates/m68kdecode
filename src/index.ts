//! An instruction decoder for M680x0 family instructions.

// Ported from original Rust library by @deplinenoise
// Copyright 2019 Andreas Fredriksson
// https://github.com/deplinenoise/m68kdecode

import { decodeInstruction } from "./decode";

export * from "./types";

/// Attempt to decode a single M68000 instruction starting at `code[0]`
export default decodeInstruction;
