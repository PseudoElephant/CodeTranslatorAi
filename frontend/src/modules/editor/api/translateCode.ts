// Create new error class
export class TranslateCodeError extends Error {
    status: number;
    
    constructor(message: string, status: number) {
        super(message);
        this.name = 'TranslateCodeError';
        this.status = 500;
    }
}

export const translateCode = async (code: string, languageFrom: string, languageTo: string) => {
  const res = await fetch('https://uc5x9rnr0m.execute-api.us-east-1.amazonaws.com/dev/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': ''
    },
    body: JSON.stringify({ 
        code,
        languageFrom,
        languageTo
     }),
  });

  const translatedCode = await res.json();
  
  if (res.status >= 400) {
    throw new Error(translatedCode?.message || 'Something went wrong');
  }

  return translatedCode;
}