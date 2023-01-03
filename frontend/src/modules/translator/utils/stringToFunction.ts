import React from 'react'

import { rust } from "@codemirror/lang-rust";
import {javascript} from '@codemirror/lang-javascript'
import {html} from '@codemirror/lang-html'


function StringToFunction(language : string) {
  switch (language) {
    case "javascript":
        return javascript();
    case "rust":
        return rust();
    default:
        return html();
  }
}

export default StringToFunction