import { z } from "zod";

// ValidLanguagesEnum is a list of all languages supported by the completion model
export const ValidLanguagesEnum = z.enum([
    "python",
    "javascript",
    "java",
    "c",
    "c++",
    "c#",
    "go",
    "php",
    "ruby",
    "swift",
    "kotlin",
    "scala",
    "rust",
    "r",
    "bash",
    "typescript",
    "objective-c",
    "perl",
    "sql",
    "lua",
    "matlab",
    "assembly",
    "haskell",
    "clojure",
    "erlang",
    "elixir",
    "coffeescript",
    "f#",
    "visual-basic",
    "dart",
    "pascal",
    "groovy",
    "lisp",
    "fortran",
    "prolog",
    "scheme",
    "ocaml",
]);

// ValidLanguagesEnumInsensitive is a case-insensitive version of ValidLanguagesEnum
export const ValidLanguagesEnumInsensitive = ValidLanguagesEnum.transform(
    (val) => val.toLowerCase(),
)

// ValidLanguagesEnum is a list of all languages supported by the completion model
export type ValidLanguagesEnum = z.infer<typeof ValidLanguagesEnum>;

// TranslatorRequest is the request body for the translate function
export const TranslatorRequest = z.object({
    code: z.string(),
    languageFrom: ValidLanguagesEnumInsensitive,
    languageTo: ValidLanguagesEnumInsensitive,
})

// TranslatorRequest is the request body for the translate function
export type TranslatorRequest = z.infer<typeof TranslatorRequest>;
