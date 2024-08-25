use wasm_bindgen::prelude::*;

use memory_wasm::Memory;

#[wasm_bindgen]
pub unsafe fn bitwise_xor_mod(bytes: &mut Memory, mask: &Memory) -> () {
    let mut i = 0;

    while i < bytes.len() {
        *bytes.inner.get_unchecked_mut(i) =
            bytes.inner.get_unchecked(i) ^ mask.inner.get_unchecked(i % mask.len());
        i += 1;
    }
}
