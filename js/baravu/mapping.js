/* 
    Mappings between Kannada and Baravu format (ASCII) 
 */

const KB_CHARACTER_SETS = {
    consonants: "ಕಖಗಘಙಚಛಜಝಞಟಠಡಢಣತಥದಧನಪಫಬಭಮಯರಲವಶಷಸಹಳೞಱ",
    vowelSigns: "ಾಿೀುೂೃೄೆೇೊೋೌೈ್",
    viramaMarkers: "್ä"
};

const KB_INDEPENDENT_VOWELS_MAPPING = {
    'ಅ': 'XAA',
    'ಆ': 'XAa',
    'ಇ': 'XAi',
    'ಈ': 'XAI',
    'ಉ': 'XAu',
    'ಊ': 'XAU',
    'ಋ': 'XAR',
    'ೠ': 'XARR',
    'ಎ': 'eA',
    'ಏ': 'EA',
    'ಐ': 'eeA',
    'ಒ': 'eAa',
    'ಓ': 'FAa',
    'ಔ': 'XAY'
};

const KB_CONSONANTS_MAPPING = {
    'ಕ': 'k',
    'ಖ': 'K',
    'ಗ': 'g',
    'ಘ': 'G',
    'ಙ': 'Z',
    'ಚ': 'c',
    'ಛ': 'C',
    'ಜ': 'j',
    'ಝ': 'J',
    'ಞ': 'z',
    'ಟ': 'q',
    'ಠ': 'Q',
    'ಡ': 'w',
    'ಢ': 'W',
    'ಣ': 'N',
    'ತ': 't',
    'ಥ': 'T',
    'ದ': 'd',
    'ಧ': 'D',
    'ನ': 'n',
    'ಪ': 'p',
    'ಫ': 'P',
    'ಬ': 'b',
    'ಭ': 'B',
    'ಮ': 'm',
    'ಯ': 'y',
    'ರ': 'r',
    'ಲ': 'l',
    'ವ': 'v',
    'ಶ': 'S',
    'ಷ': 'x',
    'ಸ': 's',
    'ಹ': 'h',
    'ಳ': 'L'
};

const KB_DEPENDENT_VOWEL_SIGNS_MAPPING = {
    '್': 'A',      // Virama/Halant
    'ಾ': 'a',
    'ು': 'u',
    'ೂ': 'U',
    'ೌ': 'Y',
    'ಿ': 'i',
    'ೀ': 'I',
    'ೃ': 'R',
    'ೄ': 'RR'
};

const KB_SIGNS_MAPPING = {
    'ಂ': 'M',      // Anusvara
    'ಃ': 'H',      // Visarga
    '‌': 'X',      // ZWNJ
    '‍': '',       // ZWJ (removed)
    'ä': 'A'       // Alternative halant/virama marker
};

const KB_DIGITS_MAPPING = {
    '೧': '1',
    '೨': '2',
    '೩': '3',
    '೪': '4',
    '೫': '5',
    '೬': '6',
    '೭': '7',
    '೮': '8',
    '೯': '9',
    '೦': '0'
};

const KB_PREDEFINED_PHRASES = {
    'ಶ್ರೀ': 'SArXI',
    'ಓಂ': 'FAamXA'
};

// Vowel signs that need pre-positioning before the consonant cluster
const KB_PRE_POSITIONED_VOWELS = {
    'ೖ': 'ee',     // AI length mark
    'ೆ': 'e',      // E sign
    'ೇ': 'E',      // EE sign
    'ೈ': 'ee',     // AI sign
    'ೊ': 'e',      // O sign (needs 'a' after cluster)
    'ೋ': 'F'       // OO sign (needs 'a' after cluster)
};

// Composite vowel markers (need special suffix handling)
const KB_COMPOSITE_VOWEL_SUFFIXES = {
    'ೊ': 'a',      // Add 'a' after cluster
    'ೋ': 'a'       // Add 'a' after cluster
};