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
    
    kannadaInput.style.fontSize = fontSize + 'px';
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
        kannadaInput.value.trim() !== '') {
        
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

function showHelp() {
    alert('Help:\n\n' +
          '1. Type in Kannada using Google Input Tools\n' +
          '2. Text converts automatically to Tulu\n' +
          '3. Use 👁️ to show/hide original Kannada\n' +
          '4. Use ✨ for special character conversions\n' +
          '5. Download or copy as image for sharing');
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
    kannadaInput.focus();
});

// Focus on load
window.addEventListener('load', () => {
    loadTheme();
    // textArea.focus();
    // toggleStyling();
    toggleDebug();
    debugLog('App loaded and ready');
});
