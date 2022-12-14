const bcrypt = require("bcryptjs");
export const encryptPassword = async (password: any) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

export const matchPassword = async (password: string, savedPassword: string) => {
  try {
    return await bcrypt.compare(password, savedPassword);
  } catch (e) {
    console.log("matchapassword error: ", e);
  }
};
