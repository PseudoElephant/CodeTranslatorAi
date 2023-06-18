# CodeTranslatorAi
Repository for the CodeTranslatorAi.com website. The following are mockups for the frontend.

![Picture 1](/images/White_Theme_Mockup_2.png)

![Picture 3](/images/Dark_Theme_Mockup.png)

![Picture 5](/images/Payment_Page_Mockup.png)

A project to explore the possibilities of language models like the ones developed by OpenAI. CodeTranslatorAI uses Codex in order to translate between different programming languages.

## Features
---
The following is an exhaustive list of features available on CodeTranslatorAi:

- AWS Lambda connection. All endpoints are managed through Amazon Web Services.
- Full database implementation using MySQL, Prisma and Planet Scale.
- Translation service using OpenAI API, specifically using Codex.
- Fully functional frontend with darkmode, implemented using React.js and Tailwind and Radix principles.
- Code syntax highlighting on tranlate page done using the Monaco Editor.
- User transaction system implemented using Stripe.
- Session based authentication system using Bycript.

## Limitations
---
A lot of the limitations for this project come directly from the language model Codex as it is not powerful enough to perform certain tasks. The following are examples of a couple limitations we have detected while using our tool.

### Import Statement Limbo
Often when the code we paste-in has a lot of import statements, Codex will only output import statememnts in return, instead of the properly translated code. 

### Running Out of Tokens
When the code we want to translate is too large Codex sometimes fails to provide the complete output. This can be very annoying as it often feels cheap. 

### Improper Translations
Ocassionally Codex will provide improper translations. This is also not good for a service, as it can not provide its user with assurance. 

## Future Work
---
The following are things that we believe would benefit this project in the future:

- **Framework Translation:**  Imagine having changed framework on the backend for a project, from TypeORM to Primsa, even though both frameworks will have very similar code conceptually it is often written completley different. Allowing our tool to perform this tidous translation would be very nice.

- **Token Management:** Some sort of system to make sure that the code Codex is returning to the user is actually fully translated. This way we avoid returning semi-completed work, and charging the user tokens on a crappy translation.