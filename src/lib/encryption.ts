import CryptoJS from 'crypto-js';

// For production, this should be in an environment variable
// VITE_ENCRYPTION_KEY="..."
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'starhold-cosmic-secure-vault-2024';

/**
 * Encrypts a plain text string using AES
 */
export const encrypt = (text: string): string => {
    if (!text) return '';
    try {
        return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
    } catch (error) {
        console.error('Encryption error:', error);
        return text; // Fallback to plain text if encryption fails
    }
};

/**
 * Decrypts an AES encrypted string
 */
export const decrypt = (ciphertext: string): string => {
    if (!ciphertext) return '';
    // Basic check to see if it might be encrypted (AES ciphertext usually ends with =)
    // or contains non-standard characters
    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);

        if (!decrypted) {
            // If decryption results in empty string, it might not have been encrypted
            return ciphertext;
        }

        return decrypted;
    } catch (error) {
        // If decryption fails, it likely wasn't encrypted or key is wrong
        // Return original text as fallback
        return ciphertext;
    }
};
