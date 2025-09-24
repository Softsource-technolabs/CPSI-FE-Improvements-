import CryptoJS from "crypto-js";

// This is your fixed key and IV (used for actual encryption/decryption of values)
const key = CryptoJS.enc.Utf8.parse("LtaucCVWF5poi1rqnvjMwWoaUU2SvNOB");
const iv = CryptoJS.enc.Utf8.parse("Sko1VHopmZGuh5Qe");

// Encrypt any text with fixed key/iv
export const encrypt = (plainText: string): string => {
  const encrypted = CryptoJS.AES.encrypt(plainText, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString(); // base64 ciphertext
};

export const decrypt = (cipherText: string): string => {
  try {
    const decrypted = CryptoJS.AES.decrypt(cipherText, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    console.error("Decryption error:", e);
    return "";
  }
};

// ✅ New: derive AESKey and AESIV using EncryptionKey (base64 encoded)
export const encryptKeyToKeyIv = (encryptionKey: string): string => {
  const hashed = CryptoJS.SHA256(encryptionKey); // 256-bit derived key
  const aesKey = CryptoJS.enc.Base64.stringify(hashed); // 44-char base64

  const derivedIv = CryptoJS.MD5(encryptionKey); // 128-bit IV
  const aesIV = CryptoJS.enc.Base64.stringify(derivedIv); // 24-char base64

  return `${aesKey}OUA${aesIV}`;
};
