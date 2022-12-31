import bcryptjs from 'bcryptjs'

const saltRounds = 10;

export const encrypt = async (pass: string) => {
    const salt = await bcryptjs.genSalt(saltRounds);
    return await bcryptjs.hash(pass, salt);
};

export const validateHash = async (password: string, hashedPassword: string): Promise<boolean> => {
    const isMatch = await bcryptjs.compare(password, hashedPassword);
    return isMatch;
};