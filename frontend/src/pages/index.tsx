import React from "react";
import Alert from "../common/components/alert";
import Translator from "../modules/translator";

export default function Home() {
  return (
    <div>
      <div className="mx-auto w-3/5 my-12">
        <Alert heading="Limitations">
          This application uses AI to translate code between languages. As such
          the translation is not always perfect and may require additional
          testing/work to get it to work.
        </Alert>
      </div>
      <div className="mx-auto w-4/5 my-12">
        <Translator />
      </div>
    </div>
  );
}
