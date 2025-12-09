/* 
    Mappings from Unicode.org 
        - Kannada Mapping: https://unicode.org/charts/PDF/U0C80.pdf
        - Malayalam Mapping: https://unicode.org/charts/PDF/U0D00.pdf 
 */

const KM_SIGNS_MAPPING = {
    'ಀ': '',
    'ಁ': 'ഁ',
    'ಂ': 'ം',
    'ಃ': 'ഃ',
    '಼': '',
    'ಽ': 'ഽ'
};

const KM_INDEPENDENT_VOWELS_MAPPING = {
    'ಅ': 'അ',
    'ಆ': 'ആ',
    'ಇ': 'ഇ',
    'ಈ': 'ഈ',
    'ಉ': 'ഉ',
    'ಊ': 'ഊ',
    'ಋ': 'ഋ',
    'ಌ': 'ഌ',
    'ಎ': 'എ',
    'ಏ': 'ഏ',
    'ಐ': 'ഐ',
    'ಒ': 'ഒ',
    'ಓ': 'ഓ',
    'ಔ': 'ഔ'
};

const KM_CONSONANTS_MAPPING = {
    'ಕ': 'ക',
    'ಖ': 'ഖ',
    'ಗ': 'ഗ',
    'ಘ': 'ഘ',
    'ಙ': 'ങ',
    'ಚ': 'ച',
    'ಛ': 'ഛ',
    'ಜ': 'ജ',
    'ಝ': 'ഝ',
    'ಞ': 'ഞ',
    'ಟ': 'ട',
    'ಠ': 'ഠ',
    'ಡ': 'ഡ',
    'ಢ': 'ഢ',
    'ಣ': 'ണ',
    'ತ': 'ത',
    'ಥ': 'ഥ',
    'ದ': 'ദ',
    'ಧ': 'ധ',
    'ನ': 'ന',
    'ಪ': 'പ',
    'ಫ': 'ഫ',
    'ಬ': 'ബ',
    'ಭ': 'ഭ',
    'ಮ': 'മ',
    'ಯ': 'യ',
    'ರ': 'ര',
    'ಱ': 'റ',
    'ಲ': 'ല',
    'ಳ': 'ള',
    'ವ': 'വ',
    'ಶ': 'ശ',
    'ಷ': 'ഷ',
    'ಸ': 'സ',
    'ಹ': 'ഹ'
};

const KM_DEPENDENT_VOWEL_SIGNS_MAPPING = {
    'ಾ': 'ാ',
    'ಿ': 'ി',
    'ೀ': 'ീ',
    'ು': 'ു',
    'ೂ': 'ൂ',
    'ೃ': 'ൃ',
    'ೄ': 'ൄ',
    'ೆ': 'െ',
    'ೇ': 'േ',
    'ೈ': 'ൈ',
    'ೊ': 'ൊ',
    'ೋ': 'ോ',
    'ೌ': 'ൌ'
};

const KM_VIRAMA_MAPPING = {
    '್': '്'
};

const KM_ADDITIONAL_VOWELS_MAPPING = {
    'ೠ': 'ൠ',
    'ೡ': 'ൡ'
};

const KM_DEPENDENT_VOWELS_MAPPING = {
    'ೢ': 'ൢ',
    'ೣ': 'ൣ'
};

const KM_CHILLU_LATTERS_MAPPING = {
    'ರ': 'ർ'
}

const KM_DIGITS_MAPPING = {
    '೦': '൦',
    '೧': '൧',
    '೨': '൨',
    '೩': '൩',
    '೪': '൪',
    '೫': '൫',
    '೬': '൬',
    '೭': '൭',
    '೮': '൮',
    '೯': '൯'
};

const KM_MAPPING = {
    ...KM_SIGNS_MAPPING,
    ...KM_INDEPENDENT_VOWELS_MAPPING,
    ...KM_CONSONANTS_MAPPING,
    ...KM_DEPENDENT_VOWEL_SIGNS_MAPPING,
    ...KM_VIRAMA_MAPPING,
    ...KM_ADDITIONAL_VOWELS_MAPPING,
    ...KM_DEPENDENT_VOWELS_MAPPING,
    ...KM_DIGITS_MAPPING
}

const mapping = {
    ...KM_MAPPING
}