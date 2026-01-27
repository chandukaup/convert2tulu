let kannadaInput = document.getElementById('kannadaInput');
let tuluOutput = document.getElementById('tuluOutput');
let kannadaSection = document.getElementById('kannadaSection');

const ZWNJ_MARKER = '\u200C'; // Zero-Width Non-Joiner
const ZWJ_MARKER = '\u200D'; // Zero-Width Joiner

let isComposing = false;

if (typeof kannadaInput !== 'undefined' && kannadaInput) {
    // Track composition (for Gboard)
    kannadaInput.addEventListener('compositionstart', function() {
        isComposing = true;
    });

    kannadaInput.addEventListener('compositionend', function() {
        isComposing = false;
        setTimeout(() => {
            convertAndDisplay();
        }, 50);
    });

    // convert on input
    kannadaInput.addEventListener('input', function() {
        if (isComposing) return;
        convertAndDisplay();
    });
}

// main conversion function
function convertAndDisplay() {
    const input = window.kannadaInput || kannadaInput;
    const kannadaText = input.value;

    let tuluText = '';
    if (isTulusriFont()) {
        tuluText = convert(kannadaText);
        debugLog(`Converted to Malayalam: "${tuluText}"`);
    } else {
        tuluText = convertKannadaToASCII(kannadaText);
        debugLog(`Converted to Ascii: "${tuluText}"`);
    }

    tuluOutput.value = tuluText;
}

function applySplitter() {
    applySpecialCharacters(ZWNJ_MARKER);
    showToast(`✓ Applied splitter`);
}

/**
 * 
 * Fix to missing anuswara in the Kannada input.
 * Sometimes, Google Input tool doesn't render Kannada text with
 * anuswara properly. This is a fix for that.
 * e.g., it renders ಬುಲಿಪುನ್ಡು instead of ಬುಲಿಪುಂಡು
 * So, this is a work around to replace 'ನ್' with 'ಂ'
 * 
 */
function applyMissingAnuswara() {
    const input = window.kannadaInput || kannadaInput;
    const kannadaCursorPos = input.selectionStart;    
    if (kannadaCursorPos === 0) {
        alert('Please place cursor after the character you want to convert');
        return;
    }
    
    const before = input.value.slice(0, kannadaCursorPos);
    const after = input.value.slice(kannadaCursorPos);

    let newAfter;
    
    const nextSpaceIndex = after.indexOf(' ');
    const currentWordEnd = nextSpaceIndex === -1 ? after.length : nextSpaceIndex;
    const currentWordAfterCursor = after.substring(0, currentWordEnd);

    if (currentWordAfterCursor.includes('ನ್')) {
        // Replace 'ನ್' only within current word
        const replacedWord = currentWordAfterCursor.replace('ನ್', 'ಂ');
        newAfter = replacedWord + after.substring(currentWordEnd);
    } else {
        // No 'ನ್' in current word, insert 'ಂ' at cursor
        newAfter = 'ಂ' + after;
    }
    
    input.value = before + newAfter;
    
    // Move cursor after the anuswara (same for both cases)
    input.setSelectionRange(kannadaCursorPos + 1, kannadaCursorPos + 1);
    
    // Reconvert the text
    convertAndDisplay();
    showToast(`✓ Applied anuswara`);
}

function applySpecialChar() {
    applySpecialCharacters(ZWJ_MARKER);
    showToast(`✓ Applied special character handling`);
}


// Special character handling
function applySpecialCharacters(marker) {
    
    // Check font type
    if (window.currentFontType !== "baravu-fonts") {
        alert('Special character conversion only works with Baravu fonts');
        return;
    }

    const input = window.kannadaInput || kannadaInput;

    // if kannada text is hidden, display it
    const wasHidden = kannadaSection.style.display === 'none';
    if (wasHidden) {
        kannadaSection.style.display = 'block';
        setTimeout(() => {
            alert('Place cursor in the Kannada text after the character you want to convert, then click ✨ again');
            input.focus();
        }, 100);
        return;
    }
    
    const kannadaCursorPos = input.selectionStart;
    
    if (kannadaCursorPos === 0) {
        alert('Please place cursor after the character you want to convert');
        return;
    }
    
    // insert invisible marker
    const before = input.value.slice(0, kannadaCursorPos);
    const after = input.value.slice(kannadaCursorPos);

    input.value = before + marker + after;
    
    // Move cursor after marker
    input.setSelectionRange(kannadaCursorPos + 1, kannadaCursorPos + 1);
    
    // reconvert the text
    convertAndDisplay();
    
    if (wasHidden) {
        setTimeout(() => {
            kannadaSection.style.display = 'none';
            tuluOutput.focus();
        }, 500);
    }    
}
