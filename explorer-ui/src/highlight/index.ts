import hljs from "highlight.js/lib/core"
import json from "highlight.js/lib/languages/json"
import toml from "highlight.js/lib/languages/ini"
import rust from "highlight.js/lib/languages/rust"

import "highlight.js/styles/github.css"

export const SUPPORTED_LANGS = ["rust", "toml", "json"]

hljs.registerLanguage("rust", rust)
hljs.registerLanguage("toml", toml)
hljs.registerLanguage("json", json)

export default hljs
