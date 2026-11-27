// Common UI Functions
function toggleSection(contentId, iconId) {
    const content = document.getElementById(contentId);
    const icon = document.getElementById(iconId);
    content.classList.toggle('collapsed');
    icon.classList.toggle('collapsed');
}

function changeFontSize() {
    const fontSize = document.getElementById('fontSize').value;
    document.getElementById('fontSizeValue').textContent = fontSize;
    
    if (window.kannadaInput) kannadaInput.style.fontSize = fontSize + 'px';
    tuluOutput.style.fontSize = fontSize + 'px';
}

function changeTextColor() {
    const color = document.getElementById('textColor').value;
    tuluOutput.style.color = color;
}

function changeTextShadowColor() {
    const color = document.getElementById('textShadowColor').value;
    tuluOutput.style.textShadow = '3px 3px 3px ' + color;
}

function changeBgColor() {
    const color = document.getElementById('bgColor').value;
    tuluOutput.style.backgroundColor = color;
}

function changeBgImage() {
    const file = document.getElementById('bgImage').files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const bgStyle = `url(${e.target.result})`;
            tuluOutput.style.backgroundImage = bgStyle;
            tuluOutput.style.backgroundSize = 'cover';
            tuluOutput.style.backgroundPosition = 'center';
            document.getElementById('removeBgBtn').style.display = 'inline-block';
        };
        reader.readAsDataURL(file);
    }
}

function removeBgImage() {
    tuluOutput.style.backgroundImage = 'none';
    document.getElementById('bgImage').value = '';
    document.getElementById('removeBgBtn').style.display = 'none';
}

function changeFont() {
    const fontSelect = document.getElementById('fontSelect');
    const selectedFont = fontSelect.value;
    const selectedOption = fontSelect.options[fontSelect.selectedIndex];
    const newFontType = selectedOption.parentElement.label;
    
    // Check if switching between baravu and tulusri
    if (typeof window.currentFontType !== 'undefined' && 
        window.currentFontType !== newFontType && 
        window.kannadaInput && kannadaInput.value.trim() !== '') {
        
        if (confirm('Switching between Baravu and Tulusri fonts will clear your text as they use different encoding systems.\n\nContinue?')) {
            kannadaInput.value = '';
            tuluOutput.value = '';
            applyFont(selectedFont);
            window.currentFontType = newFontType;
        } else {
            fontSelect.value = window.currentFont;
        }
    } else {
        applyFont(selectedFont);
        window.currentFontType = newFontType;
    }
    
    window.currentFont = selectedFont;
}

function applyFont(selectedFont) {
    const fontMap = {
        'baravu': 'baravu_1',
        'baravu-mandara': 'baravu_mandara',
        'baravu-pingara': 'baravu_pingara_v5',
        'baravu-allige': 'baravu_allige_1.4',
        'mallige': 'mallige_v1_4',
        'tulusri': 'tulusri'
    };
    
    const fontFamily = fontMap[selectedFont] || 'baravu_1';
    tuluOutput.style.fontFamily = `'${fontFamily}', Arial, sans-serif`;
    debugLog(`Font changed to: ${selectedFont}`);
}

// Common Utility Functions

// checks if the current selected font is tulusri
function isTulusriFont() {
    return window.currentFontType === "tulusri-font";
}

function copyText() {
    tuluOutput.select();
    document.execCommand('copy');
    showToast('Text copied to clipboard!');
    debugLog('Text copied');
}

function clearAll() {
    if (confirm('Are you sure you want to clear all text?')) {
        kannadaInput.value = '';
        tuluOutput.value = '';
        kannadaInput.focus();
        debugLog('Text cleared');
    }
}

function toggleDebug() {
    const debugPanel = document.getElementById('debugPanel');
    debugPanel.style.display = debugPanel.style.display === 'none' ? 'block' : 'none';
}

// Debug function
function debugLog(message) {
    const debugPanel = document.getElementById('debugPanel');
    const timestamp = new Date().toLocaleTimeString();
    debugPanel.innerHTML = `[${timestamp}] ${message}<br>` + debugPanel.innerHTML;
}

function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('themeIcon');
    
    body.classList.toggle('light-theme');
    
    if (body.classList.contains('light-theme')) {
        themeIcon.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    } else {
        themeIcon.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    }
}

// downloading as image
function downloadImage() {
    const node = document.getElementById('tuluOutput');
    
    // Store original styles
    const originalHeight = node.style.height;
    const originalOverflow = node.style.overflow;
    const originalResize = node.style.resize;
    
    // Expand to full content height (no scrollbar)
    node.style.height = node.scrollHeight + 'px';
    node.style.overflow = 'hidden';  // Changed from 'visible'
    node.style.resize = 'none';       // Disable resize handle
    
    const scale = 1.5;
    const style = {
        transform: 'scale(' + scale + ')',
        transformOrigin: 'top left',
        width: node.offsetWidth + 'px',
        height: node.scrollHeight + 'px'
    };

    const params = {
        height: node.scrollHeight * scale,
        width: node.offsetWidth * scale,
        quality: 1,
        style
    };
    
    domtoimage.toPng(node, params).then(function(dataUrl) {
        // Restore original styles
        node.style.height = originalHeight;
        node.style.overflow = originalOverflow;
        node.style.resize = originalResize;
        
        // Download
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'tulu-text.png';
        link.click();
    }).catch(function(error) {
        // Restore on error too
        node.style.height = originalHeight;
        node.style.overflow = originalOverflow;
        node.style.resize = originalResize;
        
        console.error('Download failed:', error);
        alert('Failed to download image');
    });
}

function copyAsImage() {
    const node = document.getElementById('tuluOutput');
    
    // Store original styles
    const originalHeight = node.style.height;
    const originalOverflow = node.style.overflow;
    
    // Expand to full content
    node.style.height = node.scrollHeight + 'px';
    node.style.overflow = 'visible';
    
    const scale = 1.5;
    const style = {
        transform: 'scale(' + scale + ')',
        transformOrigin: 'top left',
        width: node.offsetWidth + 'px',
        height: node.scrollHeight + 'px'
    };

    const params = {
        height: node.scrollHeight * scale,
        width: node.offsetWidth * scale,
        quality: 1,
        style
    };
    
    domtoimage.toBlob(node, params).then(function(blob) {
        // Restore original styles
        node.style.height = originalHeight;
        node.style.overflow = originalOverflow;
        
        // Copy to clipboard
        return navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
        ]);
    }).then(function() {
        alert('Image copied to clipboard!');
    }).catch(function(error) {
        // Restore on error
        node.style.height = originalHeight;
        node.style.overflow = originalOverflow;
        
        console.error('Copy failed:', error);
        // Clipboard might not be supported
        alert('Failed to copy image. Try downloading instead.');
    });
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

const PAGE_HELP = {
    converter: {
        title: 'Standard converter',
        bullets: [
            'Type Kannada in the box using <a href="https://www.google.com/intl/kn/inputtools/try/" target="_blank" rel="noopener">Google Input Tools</a> (or your usual Kannada keyboard).',
            'Tulu script in the output box updates automatically as you type.',
            'Open <strong>Original Kannada</strong> to see or edit the Kannada source, or use the section tools (anusvara, splitter, special characters).',
            'Use <strong>Copy Text</strong>, <strong>Download Image</strong>, or <strong>Copy as Image</strong> to share the Tulu text.',
            'Change font and styling from the buttons below the output.'
        ]
    },
    keyboard: {
        title: 'Tulu keyboard',
        bullets: [
            'The <strong>Tulu Text</strong> box shows Tulu script (Baravu font). Tap keys on the keyboard below — there is no separate Kannada typing box.',
            'Tap a <strong>consonant</strong> in the main grid, then tap a form in the <strong>vowel row</strong> above it (that row shows the last consonant with each vowel).',
            'With an empty line, the vowel row shows standalone vowels (ಅ, ಆ, ಇ, …).',
            '<strong>Key labels:</strong> Tulu, ಕನ್ನಡ, or IAST changes only what is printed on the keys; output stays Tulu script.',
            'Keys with an <strong>orange dot</strong> are Tulu-only sounds. Use <strong>split</strong> when two consonants should not join into one conjunct.',
            'Bottom row: <strong>ಓಂ</strong> and <strong>ಶ್ರೀ</strong> phrase keys, <strong>123</strong> for numbers and punctuation (tap again for letters), and space / full stop / new line.',
            'Choose a Baravu font from the font selector; use <strong>Copy Text</strong> or image buttons to share what is in the Tulu Text box.'
        ]
    }
};

function helpPageKey() {
    const key = document.body.dataset.help;
    if (key && PAGE_HELP[key]) return key;
    return document.querySelector('.keyboard-page') ? 'keyboard' : 'converter';
}

function closeHelpModal() {
    const modal = document.getElementById('helpModal');
    if (!modal) return;
    modal.classList.remove('open');
    document.body.classList.remove('help-open');
}

function showHelp() {
    const help = PAGE_HELP[helpPageKey()];
    let modal = document.getElementById('helpModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'helpModal';
        modal.className = 'help-modal';
        modal.innerHTML = `
            <div class="help-modal-backdrop" data-action="close-help"></div>
            <div class="help-modal-panel" role="dialog" aria-modal="true" aria-labelledby="helpModalTitle">
                <div class="help-modal-header">
                    <h2 id="helpModalTitle"></h2>
                    <button type="button" class="help-modal-close" data-action="close-help" aria-label="Close">×</button>
                </div>
                <ul class="help-modal-list"></ul>
            </div>`;
        document.body.appendChild(modal);
        modal.addEventListener('click', event => {
            if (event.target.closest('[data-action="close-help"]')) closeHelpModal();
        });
        document.addEventListener('keydown', event => {
            if (event.key === 'Escape') closeHelpModal();
        });
    }
    modal.querySelector('#helpModalTitle').textContent = help.title;
    modal.querySelector('.help-modal-list').innerHTML = help.bullets.map(item => `<li>${item}</li>`).join('');
    modal.classList.add('open');
    document.body.classList.add('help-open');
    modal.querySelector('.help-modal-close').focus();
}

// Load saved theme on page load
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        document.getElementById('themeIcon').textContent = '🌙';
        document.getElementById('themeText').textContent = 'Dark';
    }
}

// Inialization Functions
window.addEventListener('load', () => {
    // Load theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        document.getElementById('themeIcon').textContent = '🌙';
        document.getElementById('themeText').textContent = 'Dark';
    }
    
    // Initialize font
    const fontSelect = document.getElementById('fontSelect');
    const selectedOption = fontSelect.options[fontSelect.selectedIndex];
    window.currentFontType = selectedOption.parentElement.label;
    window.currentFont = fontSelect.value;
    applyFont(fontSelect.value);
    
    // Focus on Kannada input
    if (window.kannadaInput) kannadaInput.focus();
});

// Focus on load
window.addEventListener('load', () => {
    loadTheme();
    // textArea.focus();
    // toggleStyling();
    toggleDebug();
    debugLog('App loaded and ready');
});
