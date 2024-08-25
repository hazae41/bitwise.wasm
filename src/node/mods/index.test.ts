import { assert, test } from "@hazae41/phobos";
import { relative, resolve } from "path";
import { Memory, bitwise_pack_left, bitwise_pack_right, bitwise_unpack, bitwise_xor_mod, initBundled } from "./index.js";

const directory = resolve("./dist/test/")
const { pathname } = new URL(import.meta.url)
console.log(relative(directory, pathname.replace(".mjs", ".ts")))

function equals(a: Uint8Array, b: Uint8Array) {
  const ba = Buffer.from(a)
  const bb = Buffer.from(b)

  return ba.equals(bb)
}

await initBundled()

await test("Unpack and pack", async () => {
  const aaa = bitwise_pack_right(new Memory(new Uint8Array([0, 0, 0, 0, 1])))
  const bbb = bitwise_pack_right(bitwise_unpack(new Memory(new Uint8Array([8]))))
  assert(equals(aaa.bytes, bbb.bytes))
})

await test("Ambiguous", async ({ test }) => {
  const ambiguous = new Uint8Array([
    1, 1, 1, 0,
    1, 1, 1, 1,
    0, 0, 0, 1,
  ])

  const unambiguous_right = new Uint8Array([
    1, 1, 1, 0,
    1, 1, 1, 1,
    0, 0, 0, 1,
    0, 0, 0, 0
  ])

  const unambiguous_left = new Uint8Array([
    0, 0, 0, 0,
    1, 1, 1, 0,
    1, 1, 1, 1,
    0, 0, 0, 1,
  ])

  assert(equals(bitwise_unpack(bitwise_pack_right(new Memory(ambiguous))).bytes, unambiguous_right), `pack_right`)
  assert(equals(bitwise_unpack(bitwise_pack_left(new Memory(ambiguous))).bytes, unambiguous_left), `pack_left`)
})

await test("dataview", async () => {

  assert(equals(
    bitwise_pack_right(new Memory(new Uint8Array([0, 0, 0, 0, 1]))).bytes,
    bitwise_pack_right(bitwise_unpack(new Memory(new Uint8Array([8])))).bytes
  ), "a")

  const packed = new Uint8Array([0b00111001, 0b11001100])
  const unpacked = bitwise_unpack(new Memory(packed)).bytes

  const sliceBits = unpacked.subarray(2, 2 + 3)
  const sliceBytes = bitwise_pack_left(new Memory(sliceBits)).bytes
  const sliceUint8 = new DataView(sliceBytes.slice().buffer).getUint8(0)

  assert(sliceUint8 === 7, "b")
})

await test("xor_mod", async () => {
  const bytes = new Uint8Array(1024)
  crypto.getRandomValues(bytes)

  const mask = new Uint8Array(4)
  crypto.getRandomValues(mask)

  const mbytes = new Memory(bytes)
  const mmask = new Memory(mask)

  bitwise_xor_mod(mbytes, mmask)
  assert(!equals(bytes, mbytes.bytes))

  bitwise_xor_mod(mbytes, mmask)
  assert(equals(bytes, mbytes.bytes))
})