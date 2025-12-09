const textArea = document.getElementById('tuluOutput');
let isConverting = false;

// store the last known cursor position
let lastCursorPosition = 0;

// store previous value to detect changes
let previousValue = textArea.value;
let conversionTimeout = null;
let isComposing = false;

// Track composition state - mainly for GBoard
textArea.addEventListener('compositionstart', function(e) {
    isComposing = true;
    debugLog(`Composition Started`);
});

textArea.addEventListener('compositionupdate', function(e) {
    debugLog(`Composition Update: "${e.data}"`);
});

textArea.addEventListener('compositionend', function(e) {
    isComposing = false;
    debugLog(`Composition End: "${e.data}"`);
    
    // Convert after composition is complete
    clearTimeout(conversionTimeout);
    conversionTimeout = setTimeout(() => {
        convertTextAtCursor();
        previousValue = textArea.value;
    }, 100);
});

// KeyUp event - handles most keyboards including mobile IME
textArea.addEventListener('keyup', function(e) {
    if (isConverting || isComposing) return;

    const currentValue = textArea.value;
    if (currentValue !== previousValue) {
        debugLog(`KeyUp detected change - Key: ${e.key}`);
        previousValue = currentValue;
        
        clearTimeout(conversionTimeout);
        conversionTimeout = setTimeout(() => {
            convertTextAtCursor();
            previousValue = textArea.value;
        }, 100);
    }
});

// fallback: Polling method for some virtual keyboards
setInterval(() => {
    if (isConverting || isComposing) return;
    
    const currentValue = textArea.value;
    
    if (currentValue !== previousValue) {
        debugLog(`Polling detected change (fallback)`);
        previousValue = currentValue;
        
        clearTimeout(conversionTimeout);
        conversionTimeout = setTimeout(() => {
            convertTextAtCursor();
            previousValue = textArea.value;
        }, 200);
    }
}, 100);

// Main conversion function
function convertTextAtCursor() {
    if (isConverting) return;
    isConverting = true;
    
    const currentText = textArea.value;
    const cursorPos = textArea.selectionStart;
    
    debugLog(`Converting at position ${cursorPos}, total length: ${currentText.length}`);

    const lastChar = currentText[cursorPos - 1];
    const isVowelSign = (char) => {
        return KB_CHARACTER_SETS.vowelSigns.includes(char);
    };
    
    // If last char is a vowel sign, handle it specially
    if (isVowelSign(lastChar)) {
        handleVowelSignAddition(cursorPos);
        isConverting = false;
        return;  // Exit early, don't do full conversion
    }
    
    // Kannada Unicode range: 0C80-0CFF
    const isKannada = (char) => {
        const code = char.charCodeAt(0);
        return (code >= 0x0C80 && code <= 0x0CFF);
    };
    
    let convertedText = '';
    let i = 0;
    
    while (i < currentText.length) {
        if (isKannada(currentText[i])) {
            // found start of Kannada text
            let kannadaText = '';
            while (i < currentText.length && isKannada(currentText[i])) {
                kannadaText += currentText[i];
                i++;
            }
            
            debugLog(`Found Kannada block: "${kannadaText}"`);
            let tuluText = '';
            if (isTulusriFont()) {
                tuluText = convert(kannadaText);
                debugLog(`Converted to Malayalam: "${tuluText}"`);
            } else {
                tuluText = convertKannadaToASCII(kannadaText);
                debugLog(`Converted to Ascii: "${tuluText}"`);
            }
            convertedText += tuluText;
        } else {
            // regular character, keep as-is
            convertedText += currentText[i];
            i++;
        }
    }
    
    // only update if something changed
    if (convertedText !== currentText) {
        debugLog(`Text changed, updating textarea`);
        
        // Calculate new cursor position (try to maintain relative position)
        const cursorRatio = currentText.length > 0 ? cursorPos / currentText.length : 1;
        const newCursorPos = Math.round(convertedText.length * cursorRatio);
        
        textArea.value = convertedText;
        textArea.setSelectionRange(newCursorPos, newCursorPos);
        
        debugLog(`Updated! New cursor at position ${newCursorPos}`);
    } else {
        debugLog(`No Kannada found or already converted`);
    }
    
    isConverting = false;
}

// mainly applicable to Gboard keyboard where vowel signs
// comes after the conversion, so need to handle it separately

// TODO - Sill buggy in Mobile when using GBoard
function handleVowelSignAddition(cursorPos) {
    const currentText = textArea.value;
    
    // Find the start of the current word
    let wordStart = cursorPos - 1;
    while (wordStart > 0 && currentText[wordStart - 1] !== ' ') {
        wordStart--;
    }
    
    // Extract the word that needs reconversion
    const word = currentText.slice(wordStart, cursorPos);

    const fixedWord = applyVowelFix(word);

    // replace the fix
    const before = currentText.slice(0, wordStart);
    const after = currentText.slice(cursorPos);
    const newText = before + fixedWord + after;
    
    textArea.value = newText;
    textArea.setSelectionRange(wordStart + fixedWord.length, wordStart + fixedWord.length);
    
    debugLog(`Fixed: "${word}" → "${fixedWord}"`);
}

function applyVowelFix(word) {
    const VOWEL_SIGNS = KB_CHARACTER_SETS.vowelSigns;
    const REGEX = new RegExp("([a-zA-Z]+)([" + VOWEL_SIGNS + "])", "g");

    return word.replace(REGEX, (match, cluster, vowel) => {

        // 1. PRE-POSITIONED vowels (e, E, ee, o, O kinds)
        if (vowel in KB_PRE_POSITIONED_VOWELS) {
            const ascii = KB_PRE_POSITIONED_VOWELS[vowel];
            return applyPreVowel(cluster, ascii, vowel);
        }

        // 2. SUFFIX vowels (ಾ,ಿ,ೀ,...)
        if (vowel in KB_DEPENDENT_VOWEL_SIGNS_MAPPING) {
            return cluster + KB_DEPENDENT_VOWEL_SIGNS_MAPPING[vowel];
        }

        return match; // fallback
    });
}

function applyPreVowel(cluster, ascii) {
    const letters = cluster.split("");
  
    // 1. Identify last A and its consonant
    let i = letters.length - 1;
  
    if (letters[i] !== "A") {
      // No trailing A — shouldn't happen but return prefix
      return ascii + cluster;
    }
  
    // Remove last A
    letters.pop();
    i--;
  
    // Consonant before last A
    const lastCons = letters[i];
  
    // Prefix before that consonant
    const prefix = letters.slice(0, i).join("");
  
    // 2. Construct vowel-applied syllable
    let applied = ascii + lastCons;
  
    // 3. Build remaining "Ar", "Br", etc. from leftover As
    // Remaining pattern: prefix part forms earlier clusters
    let leftover = "";
  
    for (let j = i; j < letters.length; j++) {
      if (letters[j] !== "A") {
        leftover += letters[j] + "A";
      }
    }
  
    // 4. Merge everything
    return applied + leftover;
}
    
/** Special character handling; note: tulusri font doesn't support this yet */
function applySpecialChar() {
    const cursorPos = textArea.selectionStart;
    const currentText = textArea.value;

    if (cursorPos === 0 || currentText[cursorPos - 1] === ' ') {
        alert('Please place cursor after a character to convert');
        return;
    }

    const prev1 = currentText[cursorPos - 1];               // last char
    const prev0 = currentText[cursorPos - 2] || "";         // char before that (safe)
    const prev2 = prev0 + prev1;                            // 2-char pair

    let replacement = null;
    let removeCount = 0;

    // replace `<Any>u` -> `<Any>uAX`
    if (prev1 === "u" && cursorPos >= 2) {
        replacement = prev0 + "uAX";
        removeCount = 2;
    } else if (prev0 === "e" && cursorPos >= 2) { // repleace `e<Any>` -> `o<Any>`
        replacement = "o" + prev1;
        removeCount = 2;
    } else if (prev0 === "E" && cursorPos >= 2) { // repleace `E<Any>` -> `O<Any>`
        replacement = "O" + prev1;
        removeCount = 2;
    }

    // If no rule matched
    if (replacement === null) {
        showToast(`Nothing to replace`);
        return;
    }

    // Apply replacement
    const before = currentText.slice(0, cursorPos - removeCount);
    const after  = currentText.slice(cursorPos);
    const newText = before + replacement + after;

    textArea.value = newText;

    // Fix cursor position after insertion
    const newCursorPos = before.length + replacement.length;
    textArea.selectionStart = textArea.selectionEnd = newCursorPos;

    showToast(`✓ Applied special character handling`);
}
