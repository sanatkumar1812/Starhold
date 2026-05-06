# STARHOLD V2.7: Technical Architecture Brief

This document provides a deep dive into the cryptographic and logical enhancements implemented in the V2.7 upgrade of the STARHOLD protocol.

## 1. HKDF (HMAC-based Key Derivation Function)
**Transition**: Moving from `hashlib.sha256` concatenation to `HKDF`.

*   **Entropy Extraction**: Raw inputs like star distances (the "seed") may not be uniformly distributed. HKDF "extracts" high-quality entropy and then "expands" it into an encryption key.
*   **The Salt (Temporal Context)**: By using `target_time_utc` as the salt, we ensure that even if the star field is identical at two different times, the resulting keys will be cryptographically distinct.
*   **The Info (Hardware Binding)**: By passing the `HARDWARE_ID` into the `info` parameter, we bind the key to the specific satellite hardware. A key derived for Satellite-A will not work on Satellite-B, even with the same stars and time.

## 2. AES-GCM (Authenticated Encryption)
**Transition**: Moving from XOR/Basic AES to `AES-GCM`.

*   **Confidentiality + Integrity**: Unlike standard AES, GCM (Galois/Counter Mode) provides "Authenticated Encryption." It generates a 16-byte "Tag" (MAC) during encryption.
*   **Tamper Evidence**: If a single bit of the ciphertext or the AAD is changed, the `decrypt` operation will fail with an `InvalidTag` exception. This prevents "bit-flipping" attacks.
*   **AAD (Additional Authenticated Data)**: We use the Ground Station ID as AAD. This data isn't encrypted but is *authenticated*. It binds the packet to the sender's identity.

## 3. Zero-Trust "InvalidTag" Logic
**Transition**: Moving from "digital bricks" to explicit cryptographic failure.

*   **Fail-Fast Security**: In previous versions, using the wrong key might result in "garbage" text. In V2.7, the system refuses to even attempt to parse the data if the tag doesn't match. 
*   **Anti-Spoofing**: If an attacker tries to guess the key, they won't get partial success; they get a `CRITICAL AUTH FAILURE`.

## 4. Spacetime Enforcement
**Constraint**: Strict $\pm 60$-second window.

*   **Replay Attack Prevention**: A packet captured by an adversary cannot be replayed hours later. The satellite enforces that "Now" must match the "Target Time" in the packet.
*   **Orbit Synchronization**: This ensures the Ground Station and Satellite are looking at the exact same slice of the universe simultaneously.

## 5. Stellar Geometry (The Pentagon)
**Concept**: Physical Reality as a Cryptographic Key.

*   **Unforgeable Seed**: The RA/Dec coordinates and relative distances of the 5 brightest stars form a unique 10-point geometric vector.
*   **Fuzzy Binning (0.5°)**: By binning distances into 0.5° increments, the system is robust against minor atmospheric jitter or sensor noise while remaining mathematically unique.

## 6. Secure RAM Purge
**Requirement**: Mandatory zeroization.

*   **Cold Boot Protection**: Key material is transient. Once decryption is attempted (success or fail), the memory address holding the `sky_key` is overwritten with null bytes (`\x00`) to prevent memory forensics.
