const kannadaInput = document.getElementById('kannadaInput');
const tuluOutput = document.getElementById('tuluOutput');
const kannadaSection = document.getElementById('kannadaSection');

const ZWNJ_MARKER = '\u200C'; // Zero-Width Non-Joiner
const ZWJ_MARKER = '\u200D'; // Zero-Width Joiner

let isComposing = false;

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

// main conversion function
function convertAndDisplay() {
    const kannadaText = kannadaInput.value;

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
    const kannadaCursorPos = kannadaInput.selectionStart;    
    if (kannadaCursorPos === 0) {
        alert('Please place cursor after the character you want to convert');
        return;
    }
    
    const before = kannadaInput.value.slice(0, kannadaCursorPos);
    const after = kannadaInput.value.slice(kannadaCursorPos);

    let newAfter;
    
    // Check if 'ನ್' exists in the text after cursor
    if (after.includes('ನ್')) {
        // Replace first occurrence of 'ನ್' with 'ಂ'
        newAfter = after.replace('ನ್', 'ಂ');
    } else {
        // Append 'ಂ' at cursor position
        newAfter = 'ಂ' + after;
    }
    
    kannadaInput.value = before + newAfter;
    
    // Move cursor after the anuswara (same for both cases)
    kannadaInput.setSelectionRange(kannadaCursorPos + 1, kannadaCursorPos + 1);
    
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

    // if kannada text is hidden, display it
    const wasHidden = kannadaSection.style.display === 'none';
    if (wasHidden) {
        kannadaSection.style.display = 'block';
        setTimeout(() => {
            alert('Place cursor in the Kannada text after the character you want to convert, then click ✨ again');
            kannadaInput.focus();
        }, 100);
        return;
    }
    
    const kannadaCursorPos = kannadaInput.selectionStart;
    
    if (kannadaCursorPos === 0) {
        alert('Please place cursor after the character you want to convert');
        return;
    }
    
    // insert invisible marker
    const before = kannadaInput.value.slice(0, kannadaCursorPos);
    const after = kannadaInput.value.slice(kannadaCursorPos);

    kannadaInput.value = before + marker + after;
    
    // Move cursor after marker
    kannadaInput.setSelectionRange(kannadaCursorPos + 1, kannadaCursorPos + 1);
    
    // reconvert the text
    convertAndDisplay();
    
    if (wasHidden) {
        setTimeout(() => {
            kannadaSection.style.display = 'none';
            tuluOutput.focus();
        }, 500);
    }    
}
