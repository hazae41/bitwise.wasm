# bitwise.wasm

Bitwise operations for WebAssembly

```bash
npm i @hazae41/bitwise.wasm
```

[**Node Package 📦**](https://www.npmjs.com/package/@hazae41/bitwise.wasm)

## Features
- Reproducible building
- Pre-bundled and streamed
- Zero-copy memory slices

## Algorithms
- Bits pack and unpack
- Bits xormod

## Usage

### Concat bits with bytes

```typescript
import { BitwiseWasm, Memory, bitwise_unpack, bitwise_pack_right } from "@hazae41/bitwise.wasm";

// Wait for WASM to load
await BitwiseWasm.initBundled();

// Create a header of bits
const head_bits = new Uint8Array([0x00, 0x01, 0x00, 0x01])

// Create a body of bytes
const body_bytes = new Uint8Array(256)
crypto.getRandomValues(body_bytes)

// Pass it to WASM
using body_bytes_memory = new Memory(body_bytes)

// Unpack it
using body_bits_memory = bitwise_unpack(body_bytes_memory)

// Pass it to JS
const body_bits = body_bits_memory.bytes

// Concat both bits arrays
const full_bits = new Uint8Array(head_bits.length + body_bits.length)
full_bits.set(head_bits, 0)
full_bits.set(body_bits, head_bits.length)

// Pass it to WASM
using full_bits_memory = new Memory(full_bits)

// Pack it adding 0-padding to the right
using full_bytes_memory = bitwise_pack_right(fullBits)

// Pass it to JS
const full_bytes = full_bytes_memory.bytes
```

### Xoring with mask

```tsx
import { BitwiseWasm, Memory, bitwise_xor_mod } from "@hazae41/bitwise.wasm";

// Wait for WASM to load
await BitwiseWasm.initBundled();

const bytes = new Uint8Array(1024)
crypto.getRandomValues(bytes)

using bytes_memory = new Memory(bytes)

const mask = new Uint8Array(4)
crypto.getRandomValues(mask)

using mask_memory = new Memory(mask)

using xored_memory = bitwise_xor_mod(bytes_memory, mask_memory)
const xored = xored_memory.bytes

using unxored_memory = bitwise_xor_mod(xored_memory, mask_memory)
const unxored = unxored_memory.bytes
```

## Building

### Unreproducible building

You need to install [Rust](https://www.rust-lang.org/tools/install)

Then, install [wasm-pack](https://rustwasm.github.io/wasm-pack/installer/)

```bash
cargo install wasm-pack
```

Finally, do a clean install and build

```bash
npm ci && npm run build
```

### Reproducible building

You can build the exact same bytecode using Docker, just be sure you're on a `linux/amd64` host

```bash
docker compose up --build
```

Then check that all the files are the same using `git status`

```bash
git status --porcelain
```

If the output is empty then the bytecode is the same as the one I commited

### Automated checks

Each time I commit to the repository, the GitHub's CI does the following:
- Clone the repository
- Reproduce the build using `docker compose up --build`
- Throw an error if the `git status --porcelain` output is not empty

Each time I release a new version tag on GitHub, the GitHub's CI does the following:
- Clone the repository
- Do not reproduce the build, as it's already checked by the task above
- Throw an error if there is a `npm diff` between the cloned repository and the same version tag on NPM

If a version is present on NPM but not on GitHub, do not use!
