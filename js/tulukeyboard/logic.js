/*
    Tulu keyboard: what each tap does to the Kannada text.
    Pure functions - every operation takes the Kannada text and returns the new text.
 */

const TuluKeyboardLogic = (() => {
    const ZWJ = '\u200D';
    const ZWNJ = '\u200C';
    const VIRAMA = '್';
    const ANUSVARA = 'ಂ';
    const VISARGA = 'ಃ';

    // ೞ and ಱ are left out: the Baravu fonts have no glyphs for them.
    const CONSONANTS = [
        'ಕ', 'ಖ', 'ಗ', 'ಘ', 'ಙ',
        'ಚ', 'ಛ', 'ಜ', 'ಝ', 'ಞ',
        'ಟ', 'ಠ', 'ಡ', 'ಢ', 'ಣ',
        'ತ', 'ಥ', 'ದ', 'ಧ', 'ನ',
        'ಪ', 'ಫ', 'ಬ', 'ಭ', 'ಮ',
        'ಯ', 'ರ', 'ಲ', 'ವ', 'ಶ',
        'ಷ', 'ಸ', 'ಹ', 'ಳ'
    ];

    // '' is the bare consonant. Entries ending in ZWJ are Tulu-only vowels.
    const SIGNS = [
        '', 'ಾ', 'ಿ', 'ೀ', 'ು', 'ೂ', 'ೃ', 'ೆ', 'ೇ', 'ೈ', 'ೊ', 'ೋ', 'ೌ', VIRAMA,
        'ೆ' + ZWJ, 'ೇ' + ZWJ, 'ು' + ZWJ
    ];

    const VOWELS = [
        'ಅ', 'ಆ', 'ಇ', 'ಈ', 'ಉ', 'ಊ', 'ಋ', 'ಎ', 'ಏ', 'ಐ', 'ಒ', 'ಓ', 'ಔ',
        'ಎ' + ZWJ, 'ಏ' + ZWJ, 'ಉ' + ZWJ
    ];

    const DIGITS = ['೧', '೨', '೩', '೪', '೫', '೬', '೭', '೮', '೯', '೦'];
    const PUNCTUATION = ['.', ',', '?', '!', '।', '-', '(', ')', ':', ';', '"', "'"];

    const SIGN_CHARS = 'ಾಿೀುೂೃೄೆೇೈೊೋೌ್';
    const CONSONANT_CHARS = CONSONANTS.join('');
    const CLUSTER_AT_END = new RegExp(
        `((?:[${CONSONANT_CHARS}]${VIRAMA})*[${CONSONANT_CHARS}])([${SIGN_CHARS}]${ZWJ}?)?$`
    );

    /**
     * The consonant or conjunct at the end of the text, with the vowel sign on it.
     * Returns null when the text does not end in a consonant.
     */
    function activeCluster(text) {
        const m = text.match(CLUSTER_AT_END);
        return m ? { start: m.index, cluster: m[1], sign: m[2] || '' } : null;
    }

    function addText(text, addition) {
        return text + addition;
    }

    /**
     * Puts the vowel sign on the active cluster, replacing any sign already there.
     * Does nothing when there is no active cluster.
     */
    function setSign(text, sign) {
        const active = activeCluster(text);
        if (!active) return text;
        return text.slice(0, active.start) + active.cluster + sign;
    }

    /** Removes the last character, treating a Tulu-only vowel as one character. */
    function deleteLast(text) {
        return text.endsWith(ZWJ) ? text.slice(0, -2) : text.slice(0, -1);
    }

    /**
     * The keys of the vowel row for the current text: the active cluster with each
     * vowel sign, or the standalone vowels when there is no active cluster.
     */
    function vowelRow(text) {
        const active = activeCluster(text);
        if (!active) {
            return VOWELS.map(v => ({ kannada: v, sign: null, active: false }));
        }
        return SIGNS.map(s => ({ kannada: active.cluster + s, sign: s, active: active.sign === s }));
    }

    function isTuluOnly(kannada) {
        return kannada.endsWith(ZWJ);
    }

    const IAST_CONSONANTS = {
        'ಕ': 'k', 'ಖ': 'kh', 'ಗ': 'g', 'ಘ': 'gh', 'ಙ': 'ṅ',
        'ಚ': 'c', 'ಛ': 'ch', 'ಜ': 'j', 'ಝ': 'jh', 'ಞ': 'ñ',
        'ಟ': 'ṭ', 'ಠ': 'ṭh', 'ಡ': 'ḍ', 'ಢ': 'ḍh', 'ಣ': 'ṇ',
        'ತ': 't', 'ಥ': 'th', 'ದ': 'd', 'ಧ': 'dh', 'ನ': 'n',
        'ಪ': 'p', 'ಫ': 'ph', 'ಬ': 'b', 'ಭ': 'bh', 'ಮ': 'm',
        'ಯ': 'y', 'ರ': 'r', 'ಲ': 'l', 'ವ': 'v', 'ಶ': 'ś',
        'ಷ': 'ṣ', 'ಸ': 's', 'ಹ': 'h', 'ಳ': 'ḷ'
    };
    const IAST_SIGNS = {
        'ಾ': 'ā', 'ಿ': 'i', 'ೀ': 'ī', 'ು': 'u', 'ೂ': 'ū', 'ೃ': 'ṛ', 'ೄ': 'ṝ',
        'ೆ': 'e', 'ೇ': 'ē', 'ೈ': 'ai', 'ೊ': 'o', 'ೋ': 'ō', 'ೌ': 'au', [VIRAMA]: ''
    };
    const IAST_VOWELS = {
        'ಅ': 'a', 'ಆ': 'ā', 'ಇ': 'i', 'ಈ': 'ī', 'ಉ': 'u', 'ಊ': 'ū', 'ಋ': 'ṛ',
        'ಎ': 'e', 'ಏ': 'ē', 'ಐ': 'ai', 'ಒ': 'o', 'ಓ': 'ō', 'ಔ': 'au'
    };
    // Keyed by the Kannada vowel or sign that the joiner follows.
    const IAST_TULU_ONLY = { 'ೆ': 'ɛ', 'ೇ': 'ɛ̄', 'ು': 'ŭ', 'ಎ': 'ɛ', 'ಏ': 'ɛ̄', 'ಉ': 'ŭ' };
    const IAST_OTHER = {
        [ANUSVARA]: 'ṁ', [VISARGA]: 'ḥ', [ZWJ]: '', [ZWNJ]: '',
        '೦': '0', '೧': '1', '೨': '2', '೩': '3', '೪': '4',
        '೫': '5', '೬': '6', '೭': '7', '೮': '8', '೯': '9'
    };

    function toIast(text) {
        let out = '';
        for (let i = 0; i < text.length; i++) {
            const ch = text[i];
            if (IAST_CONSONANTS[ch]) {
                out += IAST_CONSONANTS[ch];
                const next = text[i + 1];
                if (next in IAST_SIGNS) {
                    const tuluOnly = text[i + 2] === ZWJ && IAST_TULU_ONLY[next];
                    out += tuluOnly || IAST_SIGNS[next];
                    i += tuluOnly ? 2 : 1;
                } else {
                    out += 'a';
                }
            } else if (IAST_VOWELS[ch]) {
                const tuluOnly = text[i + 1] === ZWJ && IAST_TULU_ONLY[ch];
                out += tuluOnly || IAST_VOWELS[ch];
                if (tuluOnly) i++;
            } else {
                out += ch in IAST_OTHER ? IAST_OTHER[ch] : ch;
            }
        }
        return out;
    }

    return {
        ZWJ, ZWNJ, VIRAMA, ANUSVARA, VISARGA,
        CONSONANTS, SIGNS, VOWELS, DIGITS, PUNCTUATION,
        activeCluster, addText, setSign, deleteLast, vowelRow, isTuluOnly, toIast
    };
})();
