import bcryptjs from 'bcryptjs'

const saltRounds = 10;

export const encrypt = async (pass: string) => {
  try {
    const salt = await bcryptjs.genSalt(saltRounds);
    return await bcryptjs.hash(pass, salt);
  } catch (err) {
    throw err;
  }
};

export const validateHash = async (password: string, hashedPassword: string): Promise<boolean> => {
  try {
    const isMatch = await bcryptjs.compare(password, hashedPassword);
    return isMatch;
  } catch (error) {
    throw error;
  }
};