import bcrypt from "bcrypt" 

const saltRounds = 10;

// export const encrypt = async (pass: string) => {
//   const salt = await bcrypt.genSalt(saltRounds);
//   console.log(`Salt: ${salt}`);
//   return await bcrypt.hash(pass, salt);
// };

export const validateHash = async (password: string, hash: string): Promise<boolean> => {
  return password === "pass";
  
  //TODO: Figure out why this code gives the following error: 
  // CodeTranslatorAi/backend/.esbuild/.build/src/functions/login/package.json does not exist
  
  // return bcrypt
  //   .compare(password, hash)
  //   .then((res) => {
  //     return res;
  //   })
  //   .catch((err) => {
  //     console.error(err);
  //     return false;
  //   });
};