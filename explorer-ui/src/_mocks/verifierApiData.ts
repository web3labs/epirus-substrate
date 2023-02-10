import { EventEmitter } from "stream"

export class MockWebSocket extends EventEmitter {
  new () {
    return new MockWebSocket()
  }

  addEventListener = this.addListener
  removeEventListener = this.removeListener
  send = this.emit
  close = jest.fn()
}

export const mockSourceCode = `
#![cfg_attr(not(feature = "std"), no_std)]

use ink_lang as ink;

#[ink::contract]
pub mod flipper {
    #[ink(storage)]
    pub struct Flipper {
        a: bool,
    }

    impl Flipper {
        /// Creates a new flipper smart contract initialized with the given value.
        #[ink(constructor)]
        pub fn new(init_value: bool) -> Self {
            Self { a: init_value }
        }

        /// Creates a new flipper smart contract initialized to \`false\`.
        #[ink(constructor)]
        pub fn default() -> Self {
            Self::new(Default::default())
        }

        /// Flip
        #[ink(message)]
        pub fn flip(&mut self) {
            self.a = !self.a;
        }

        /// Returns the current value of the Flipper's boolean.
        #[ink(message)]
        pub fn get(&self) -> bool {
            self.a
        }
    }

    #[cfg(test)]
    mod tests {
        use super::*;
        use ink_lang as ink;

        #[ink::test]
        fn default_works() {
            let flipper = Flipper::default();
            assert!(!flipper.get());
        }

        #[ink::test]
        fn it_works() {
            let mut flipper = Flipper::new(false);
            assert!(!flipper.get());
            flipper.flip();
            assert!(flipper.get());
        }
    }
}
`

export const mockMetadata = {
  source: {
    hash: "0xad8e1a3d7d1c44b4c7b3f715765ab8003e15aa2d8d1146a64cbc9b8f7e0a8df9",
    language: "ink! 4.0.0-alpha.3",
    compiler: "rustc 1.64.0",
    build_info: {
      build_mode: "Release",
      cargo_contract_version: "2.0.0-alpha.4",
      rust_toolchain: "stable-x86_64-unknown-linux-gnu",
      wasm_opt_settings: {
        keep_debug_symbols: false,
        optimization_passes: "Z"
      }
    }
  },
  contract: {
    name: "flipper",
    version: "0.1.0",
    authors: [
      "[your_name] <[your_email]>"
    ]
  },
  spec: {
    constructors: [
      {
        args: [
          {
            label: "init_value",
            type: {
              displayName: [
                "bool"
              ],
              type: 0
            }
          }
        ],
        docs: [
          "Constructor that initializes the `bool` value to the given `init_value`."
        ],
        label: "new",
        payable: false,
        selector: "0x9bae9d5e"
      },
      {
        args: [],
        docs: [
          "Constructor that initializes the `bool` value to `false`.",
          "",
          "Constructors can delegate to other constructors."
        ],
        label: "default",
        payable: false,
        selector: "0xed4b9d1b"
      }
    ],
    docs: [],
    events: [],
    messages: [
      {
        args: [],
        docs: [
          "A message that can be called on instantiated contracts.",
          "This one flips the value of the stored `bool` from `true`",
          "to `false` and vice versa."
        ],
        label: "flip",
        mutates: true,
        payable: false,
        returnType: null,
        selector: "0x633aa551"
      },
      {
        args: [],
        docs: [
          "Simply returns the current value of our `bool`."
        ],
        label: "get",
        mutates: false,
        payable: false,
        returnType: {
          displayName: [
            "bool"
          ],
          type: 0
        },
        selector: "0x2f865bd9"
      }
    ]
  },
  storage: {
    root: {
      layout: {
        struct: {
          fields: [
            {
              layout: {
                leaf: {
                  key: "0x00000000",
                  ty: 0
                }
              },
              name: "value"
            }
          ],
          name: "Flipper"
        }
      },
      root_key: "0x00000000"
    }
  },
  types: [
    {
      id: 0,
      type: {
        def: {
          primitive: "bool"
        }
      }
    }
  ],
  version: "4"
}

export const mockSourceList = [{
  type: "file",
  url: "lib.rs",
  name: "lib.rs",
  size: 1000,
  utf8: true
},
{
  type: "file",
  url: "bin",
  name: "bin",
  size: 10,
  utf8: false
},
{
  type: "file",
  url: "toobig",
  name: "toobig",
  size: 500001,
  utf8: false
},
{
  type: "file",
  url: "empty",
  name: "empty",
  size: 0,
  utf8: true
},
{
  type: "file",
  url: "fail",
  name: "fail",
  size: 10,
  utf8: true
},
{
  type: "dir",
  url: "dir0",
  name: "dir0",
  size: 0,
  utf8: false,
  ents: []
},
{
  type: "dir",
  url: "dir1",
  name: "dir1",
  size: 0,
  utf8: false,
  ents: [{
    type: "dir",
    url: "dir1/dir2",
    name: "dir12",
    size: 0,
    utf8: false
  }]
}
]

export const mockLongSourceList = [{
  type: "file",
  url: "lib.rs",
  name: "lib.rs",
  size: 1000,
  utf8: true
},
{
  type: "file",
  url: "bin",
  name: "bin",
  size: 10,
  utf8: false
},
{
  type: "file",
  url: "toobig",
  name: "toobig",
  size: 500001,
  utf8: false
},
{
  type: "file",
  url: "empty",
  name: "empty",
  size: 0,
  utf8: true
},
{
  type: "file",
  url: "fail",
  name: "fail",
  size: 10,
  utf8: true
},
{
  type: "file",
  url: "file0",
  name: "file0",
  size: 0,
  utf8: false
},
{
  type: "file",
  url: "file1",
  name: "file1",
  size: 0,
  utf8: false
},
{
  type: "file",
  url: "file2",
  name: "file2",
  size: 0,
  utf8: false
},
{
  type: "file",
  url: "file3",
  name: "file3",
  size: 0,
  utf8: false
},
{
  type: "file",
  url: "file4",
  name: "file4",
  size: 0,
  utf8: false
},
{
  type: "file",
  url: "file5",
  name: "file5",
  size: 0,
  utf8: false
}
]
