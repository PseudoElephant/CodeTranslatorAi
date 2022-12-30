import "../styles/globals.css";

import type { AppProps } from "next/app";
import GeneralLayout from "../common/layouts/general";

import { useMonacoThemes } from "../modules/editor";

export default function App({ Component, pageProps }: AppProps) {
  // Configure Monaco Editor themes only once
  useMonacoThemes();

  return (
    <GeneralLayout>
      <Component {...pageProps} />
    </GeneralLayout>
  );
}
