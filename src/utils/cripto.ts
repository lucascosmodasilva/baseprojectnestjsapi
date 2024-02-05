import * as crypto from 'crypto';

export default class Cripto {
  static passwordCript: string = process.env.CRIPT_PASSWORD;

  static criptMethod = 'aes-256-cbc';

  static key = crypto
    .createHash('sha512')
    .update(this.passwordCript)
    .digest('hex')
    .substring(0, 32);

  static encryptionIV = crypto
    .createHash('sha512')
    .update(this.passwordCript)
    .digest('hex')
    .substring(0, 16);

  static async cript(text: string): Promise<string> {
    const cipher = crypto.createCipheriv(
      this.criptMethod,
      this.key,
      this.encryptionIV,
    );
    return Buffer.from(
      cipher.update(text, 'utf8', 'hex') + cipher.final('hex'),
    ).toString('base64');
  }

  static async decript(text: string): Promise<string> {
    const buff = Buffer.from(text, 'base64');
    const decipher = crypto.createDecipheriv(
      this.criptMethod,
      this.key,
      this.encryptionIV,
    );
    return (
      decipher.update(buff.toString('utf8'), 'hex', 'utf8') +
      decipher.final('utf8')
    );
  }

  static async encriptFields<T>(obj: T, fields: string[]): Promise<T> {
    if (!obj) return obj;

    if (Array.isArray(obj)) {
      for (let y = 0; y < obj.length; y++) {
        const itemArray = obj[y];

        const keys = Object.keys(itemArray);
        for (let i = 0; i < keys.length; i++) {
          const itemField = keys[i];

          for (let z = 0; z < fields.length; z++) {
            const field = fields[z];

            if (
              itemArray[itemField] !== null &&
              itemArray[itemField] !== undefined &&
              itemField === field &&
              typeof itemArray[itemField] === 'string'
            ) {
              itemArray[itemField] = await Cripto.cript(itemArray[itemField]);
            }
          }
        }
      }
    } else {
      const keys = Object.keys(obj);
      for (let i = 0; i < keys.length; i++) {
        const itemField = keys[i];

        for (let z = 0; z < fields.length; z++) {
          const field = fields[z];

          if (
            obj[itemField] !== null &&
            obj[itemField] !== undefined &&
            itemField === field &&
            typeof obj[itemField] === 'string'
          ) {
            obj[itemField] = await Cripto.cript(obj[itemField]);
          }
        }
      }
    }

    return obj;
  }

  static async decriptFields<T>(obj: T, fields: string[]): Promise<T> {
    if (!obj) return obj;

    if (Array.isArray(obj)) {
      for (let y = 0; y < obj.length; y++) {
        const itemArray = obj[y];

        const keys = Object.keys(itemArray);
        for (let i = 0; i < keys.length; i++) {
          const itemField = keys[i];

          for (let z = 0; z < fields.length; z++) {
            const field = fields[z];

            if (
              itemArray[itemField] !== null &&
              itemArray[itemField] !== undefined &&
              itemField === field &&
              typeof itemArray[itemField] === 'string'
            ) {
              itemArray[itemField] = await Cripto.decript(itemArray[itemField]);
            }
          }
        }
      }
    } else {
      const keys = Object.keys(obj);
      for (let i = 0; i < keys.length; i++) {
        const itemField = keys[i];

        for (let z = 0; z < fields.length; z++) {
          const field = fields[z];

          if (
            obj[itemField] !== null &&
            obj[itemField] !== undefined &&
            itemField === field &&
            typeof obj[itemField] === 'string'
          ) {
            obj[itemField] = await Cripto.decript(obj[itemField]);
          }
        }
      }
    }

    return obj;
  }
}
