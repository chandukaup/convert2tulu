function renderInfo() {
    return `
        <div class="info">
            <span class="info-icon">💡</span>
            <span>Type in Kannada using <a href="https://www.google.com/intl/kn/inputtools/try/" target="_blank">Google Input Tools</a>. Text will automatically convert to Tulu script.</span>
        </div>
    `;
}

function renderHeader() {
    return `
        <div class="header">
            <h1>Convert to Tulu</h1>
            <div class="header-actions">
                <a href="https://github.com/chandukaup/convert2tulu" class="header-btn" target="_blank" rel="noopener">
                    ⭐ GitHub
                </a>
                <button class="header-btn" onclick="showHelp()">
                    ❓ Help
                </button>
                <button class="header-btn" onclick="toggleTheme()">
                    <span id="themeIcon">🌙</span>
                </button>
            </div>
        </div>
    `;
}

function renderFooter() {
    return `
        <div class="footer">
            <p>© 2025 Convert to Tulu· For any query you can contact me at
                <a href="https://twitter.com/chandukaup" target="_blank">
                    <span class="red-text text-darken-2" style="font-weight: bold;">@chandukaup</span>
                </a> on Twitter.
                <a href="https://opensource.org/licenses/MIT" target="_blank">MIT License</a> · 
                <a href="https://github.com/chandukaup/convert2tulu" target="_blank">GitHub</a>
             </p>
        </div>
    `;
}

function renderButtonActions() {
    return `
        <div class="action-button-section">
            <!-- Action Buttons -->
            <div class="action-buttons">
                <button class="action-btn" onclick="copyText()" data-title="Copy Text">
                    📋 Copy Text
                </button>
                <button class="action-btn" onclick="downloadImage()" data-title="Download Image">
                    ⬇️ Download Image
                </button>
                <button class="action-btn" onclick="copyAsImage()" data-title="Copy as Image">
                    🖼️ Copy as Image
                </button>
                <button class="action-btn" onclick="toggleDebug()" data-title="Toggle Debug">
                    🐞 Debug
                </button>
                <button class="action-btn" onclick="toggleSection('stylingContent', 'stylingIcon')", data-title="Apply Styling">
                    🎨 Styling
                    <span class="toggle-icon collapsed" id="stylingIcon">▼</span>
                </button>
            </div>

            <!-- Styling Section (Collapsible) -->
            <div class="collapsible-section" style="border-top: none; border-top-left-radius: 0; border-top-right-radius: 0;">
                <div class="styling-section collapsed" id="stylingContent">
                    <div class="styling-grid">
                        <div class="styling-item">
                            <label for="fontSelect">Font:</label>
                            <select id="fontSelect" onchange="changeFont()">
                                <optgroup label="baravu-fonts">
                                    <option value="baravu" selected>Baravu</option>
                                    <option value="baravu-mandara">Baravu Mandara</option>
                                    <!-- <option value="baravu-pingara">Baravu Pingara</option> -->
                                    <!-- <option value="baravu-allige">Baravu Allige</option> -->
                                </optgroup>
                                <optgroup label="tulusri-font">
                                    <option value="tulusri">Tulu Sri</option>
                                </optgroup>
                            </select>
                        </div>
                        
                        <div class="styling-item">
                            <label for="fontSize">Size: <span id="fontSizeValue">20</span>px</label>
                            <input type="range" id="fontSize" min="12" max="72" value="20" oninput="changeFontSize()">
                        </div>
                        
                        <div class="styling-item">
                            <label for="textColor">Text Color:</label>
                            <input type="color" id="textColor" value="#e0e0e0" onchange="changeTextColor()">
                        </div>

                        <div class="styling-item">
                            <label for="textShadowColor">Text Shadow Color:</label>
                            <input type="color" id="textShadowColor" value="#e0e0e0" onchange="changeTextShadowColor()">
                        </div>

                        <div class="styling-item">
                            <label for="bgColor">Background:</label>
                            <input type="color" id="bgColor" value="#2d2d2d" onchange="changeBgColor()">
                        </div>

                        <!-- BG Image -->
                        <div class="styling-item styling-item-full">
                            <label for="bgImage">BG Image:</label>
                            <div class="bg-image-controls">
                                <input type="file" id="bgImage" accept="image/*" onchange="changeBgImage()">
                                <button class="remove-bg-btn" onclick="removeBgImage()" id="removeBgBtn" style="display: none;">×</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="debug" id="debugPanel">
                Debug info will appear here...
            </div>
        </div>
    `;
}
