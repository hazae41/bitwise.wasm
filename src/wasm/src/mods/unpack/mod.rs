extern crate alloc;

use alloc::vec::Vec;

use wasm_bindgen::prelude::*;

use memory_wasm::Memory;

#[wasm_bindgen]
pub unsafe fn bitwise_unpack(bytes: &Memory) -> Memory {
    let length = bytes.len() * 8;

    let mut bits = Vec::<u8>::with_capacity(length);

    let mut byte = bytes.inner.as_ptr();
    let mut bit = bits.as_mut_ptr();

    while byte < bytes.inner.as_ptr().add(bytes.len()) {
        let mut k: isize = 7;
        while k >= 0 {
            *bit = (*byte >> k) & 1;
            bit = bit.add(1);
            k -= 1;
        }
        byte = byte.add(1);
    }

    bits.set_len(length);

    return Memory::new(bits);
}
