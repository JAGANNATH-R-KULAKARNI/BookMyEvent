const bcrypt=require('bcrypt');

export class EncryptPassword{

  static async encrypt(password: string) {
      const hashedPassword = await bcrypt.hash(password, 10)
      return hashedPassword;
  }

  static async compare(passwordStored: string, passwordUserEntered: string) {
    return await bcrypt.compare(passwordStored, passwordUserEntered);
  }
}