function convertKannadaToASCII(text) {
    // Step 0: Handle special character markers FIRST
    text = handleSpecialCharacterMarkers(text);

    // Step 1: Pre-processing - handle common phrases and special sequences
    text = preprocessText(text);
    
    // Step 2: Reposition vowel signs that appear before consonant clusters
    text = repositionPrePositionedVowels(text);
    
    // Step 3: Handle special consonant combinations (like ರ್ + consonant)
    text = processConsonantClusters(text);
    
    // Step 4: Convert all characters to their ASCII equivalents
    text = convertCharacters(text);
    
    // Step 5: Post-processing - fix edge cases and cleanup
    text = postProcess(text);

    return text;
}

/**
 * Handle special character markers in Kannada text
 * Uses Zero-Width Joiner (ZWJ) as an invisible marker
 */
function handleSpecialCharacterMarkers(txt) {
  const MARKER = '\u200D'; // Zero-Width Joiner (invisible)
  
  const consonantChars = KB_CHARACTER_SETS.consonants;
  const vowelSigns = KB_CHARACTER_SETS.vowelSigns;
  const viramaMarkers = KB_CHARACTER_SETS.viramaMarkers;
  
  // Build cluster pattern
  const clusterPattern = `(?:[${consonantChars}](?:[${vowelSigns}])?)(?:[${viramaMarkers}][${consonantChars}])*`;
  
  // Special standalone vowels with marker
  txt = txt.replace(new RegExp(`ಎ${MARKER}`, 'g'), "oA");
  txt = txt.replace(new RegExp(`ಏ${MARKER}`, 'g'), "OA");
  txt = txt.replace(new RegExp(`ಉ${MARKER}`, 'g'), "XAuAX");
  
  // Special vowel signs with marker
  txt = txt.replace(new RegExp(`ು${MARKER}`, 'g'), "uAX");
  txt = txt.replace(new RegExp(`ುಂ${MARKER}`, 'g'), "uAXM");
  
  // Special cases: vowel sign with marker after consonant cluster
  // Pattern: cluster + vowel + marker → prefix + cluster
  txt = txt.replace(new RegExp(`(${clusterPattern})(ೆ${MARKER})`, 'g'), "o$1");
  txt = txt.replace(new RegExp(`(${clusterPattern})(ೇ${MARKER})`, 'g'), "O$1");
  
  // Clean up any remaining markers (in case they weren't handled)
  txt = txt.replace(new RegExp(MARKER, 'g'), '');

  return txt;
}

/**
 * Pre-process text by handling common phrases and special markers
 */
function preprocessText(text) {
    // Replace common phrases first (before individual character conversion)
    for (const [kannada, ascii] of Object.entries(KB_PREDEFINED_PHRASES)) {
      text = text.replace(new RegExp(kannada, 'g'), ascii);
    }

    // Normalize virama markers
    text = text.replace(/್‍/g, 'ä');

    // Remove zero-width joiners that aren't needed
    text = text.replace(/‍/g, '');

    return text;
}

/**
 * Build a regex pattern for consonant clusters
 * A cluster is: consonant + optional vowel sign + (virama + consonant)*
 */
function buildClusterPattern() {
    const { consonants, vowelSigns, viramaMarkers } = KB_CHARACTER_SETS;
    return `(?:[${consonants}](?:[${vowelSigns}])?)(?:[${viramaMarkers}][${consonants}])*`;
}

/**
 * Reposition vowel signs that need to appear before the consonant cluster
 * Example: consonant + ೆ becomes e + consonant
 */
function repositionPrePositionedVowels(text) {
    const clusterPattern = buildClusterPattern();
    
    // For each pre-positioned vowel, move it before the cluster
    for (const [vowelSign, prefix] of Object.entries(KB_PRE_POSITIONED_VOWELS)) {
      const pattern = new RegExp(`(${clusterPattern})(${escapeRegex(vowelSign)})`, 'g');
      
      // Check if this vowel needs a suffix after the cluster
      const suffix = KB_COMPOSITE_VOWEL_SUFFIXES[vowelSign] || '';
      
      if (suffix) {
        // Move prefix before cluster and add suffix after
        text = text.replace(pattern, `${prefix}$1${suffix}`);
      } else {
        // Just move prefix before cluster
        text = text.replace(pattern, `${prefix}$1`);
      }
    }

    return text;
}

/**
 * Handle special consonant combinations
 * Example: ರ್ + consonant becomes consonant + f (subscript ra)
 */
function processConsonantClusters(text) {
    // Get all consonant characters for the pattern
    const consonantChars = KB_CHARACTER_SETS.consonants;
    
    // Handle subscript 'ra' (ರ್ + consonant → consonant + f)
    const subscriptRaPattern = new RegExp(`ರ್([${consonantChars}])`, 'g');
    text = text.replace(subscriptRaPattern, '$1f');
    
    // Convert standalone ರ್ (ra with virama, no following consonant)
    text = text.replace(/ರ್/g, 'rA');

    return text;
}

/**
 * Convert all Kannada characters to their ASCII equivalents
 */
function convertCharacters(text) {
    let result = text;
    
    // Convert in order: vowels, consonants, vowel signs, special marks, numerals
    const allMappings = {
      ...KB_INDEPENDENT_VOWELS_MAPPING,
      ...KB_CONSONANTS_MAPPING,
      ...KB_DEPENDENT_VOWEL_SIGNS_MAPPING,
      ...KB_SIGNS_MAPPING,
      ...KB_DIGITS_MAPPING
    };
    
    // Apply each mapping
    for (const [kannada, ascii] of Object.entries(allMappings)) {
      result = result.replace(new RegExp(escapeRegex(kannada), 'g'), ascii);
    }

    return result;
}

/**
 * Post-processing to fix edge cases and cleanup
 */
function postProcess(text) {
    // Fix: subscript 'ra' before a consonant with halant needs spacing
    // Pattern: fA + consonant → fXA + consonant
    const consonantPattern = '[kKgGZcCjJzqQwWNtTdDnpPbBmyrlvSxshL]';
    text = text.replace(
      new RegExp(`fA(${consonantPattern})`, 'g'),
      'fXA$1'
    );
    
    // Normalize multiple 'e' repetitions (ee+ → ee)
    text = text.replace(/ee+/g, 'ee');

    return text;
}
  
/**
 * Escape special regex characters in a string
 */
function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
