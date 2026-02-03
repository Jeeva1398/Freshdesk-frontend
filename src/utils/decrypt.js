import CryptoJS from "crypto-js";

export const encrypted_response = (data) => {
    return CryptoJS.AES.encrypt(
        JSON.stringify(data),
        "secret key 123"
    ).toString();
};

export const decrypted_request = (data) => {
    let bytes = CryptoJS.AES.decrypt(data, "secret key 123");
    return bytes.toString(CryptoJS.enc.Utf8);
};