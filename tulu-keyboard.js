/*
    <tulu-keyboard> - an on-screen keyboard for writing Tulu script.

    Usage:
        <script src="https://convert2tulu.netlify.app/tulu-keyboard.js"></script>
        <tulu-keyboard></tulu-keyboard>

    Attributes:
        labels        tulu | kannada | iast   Script printed on the keys (default: tulu)
        label-switch  show | hide             Let visitors change the label script (default: show)
        output        tulu | kannada          Show and copy the text as Tulu script or Kannada (default: tulu)
        output-switch show | hide             Let visitors change the output (default: show)
        layout        auto | wide | compact   Key arrangement; auto picks by width (default: auto)
        font          baravu | baravu-mandara Baravu font for labels and output (default: baravu)
        font-url      URL of a Baravu font file to use instead of a font already on the page
        target        CSS selector of an existing output box to write into
        persist       localStorage key; when set, the text survives a page refresh

    Properties: el.kannada (read/write), el.baravu (read-only), el.clear()
    Events:     "change" with detail { kannada, baravu } after every edit
 */

(() => {
    if (customElements.get('tulu-keyboard')) return;

    const SCRIPT_URL = new URL(document.currentScript.src);
    const SCRIPT_BASE = new URL('.', SCRIPT_URL);

    const DEPENDENCIES = [
        { path: 'js/baravu/mapping.js', loaded: () => typeof KB_CONSONANTS_MAPPING !== 'undefined' },
        { path: 'js/baravu/converter.js', loaded: () => typeof convertKannadaToASCII === 'function' },
        { path: 'js/tulukeyboard/logic.js', loaded: () => typeof TuluKeyboardLogic !== 'undefined' }
    ];

    const FONT_FAMILIES = { 'baravu': 'baravu_1', 'baravu-mandara': 'baravu_mandara' };
    const FONT_FILES = { 'baravu': 'assets/fonts/baravu_1.ttf', 'baravu-mandara': 'assets/fonts/baravu_mandara.ttf' };
    // Keep false until Jai Tulunad agrees to other sites loading the Baravu fonts from this one.
    const SERVE_FONTS_TO_OTHER_SITES = false;

    const WIDE_LAYOUT_MIN_WIDTH = 600;
    const KANNADA_FONT_STACK = "'Noto Sans Kannada', 'Nirmala UI', 'Kannada Sangam MN', sans-serif";

    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.charset = 'utf-8';
            script.onload = resolve;
            script.onerror = () => reject(new Error(`tulu-keyboard: could not load ${src}`));
            document.head.appendChild(script);
        });
    }

    const dependenciesReady = DEPENDENCIES.reduce(
        (previous, dep) => previous.then(() => dep.loaded() ? null : loadScript(new URL(dep.path + SCRIPT_URL.search, SCRIPT_BASE).href)),
        Promise.resolve()
    );

    const registeredFonts = new Map();

    function registerFont(family, url) {
        if (!registeredFonts.has(family)) {
            const face = new FontFace(family, `url(${url})`);
            document.fonts.add(face);
            registeredFonts.set(family, face.load().catch(() => console.warn(`tulu-keyboard: could not load font ${url}`)));
        }
        return registeredFonts.get(family);
    }

    const STYLES = `
        :host {
            display: block;
            max-width: var(--tk-max-width, 720px);
            margin: 0 auto;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            color: var(--tk-key-color, #3C4043);
            outline: none;
        }
        .toolbar { display: flex; justify-content: space-between; align-items: center; gap: 6px 12px; flex-wrap: wrap; margin-bottom: var(--tk-gap, 6px); }
        .tools { display: flex; gap: 6px; margin-left: auto; }
        .switches { display: contents; }
        .group { display: flex; align-items: center; gap: 6px; }
        .caption { font-size: 13px; opacity: 0.75; }
        .seg { display: inline-flex; border: 1px solid var(--tk-key-border, #ccc); border-radius: var(--tk-radius, 8px); overflow: hidden; }
        .seg button, .tool {
            background: var(--tk-key-bg, #fff); color: var(--tk-key-color, #3C4043);
            border: 0; padding: 8px 12px; font: inherit; font-size: 14px; cursor: pointer;
        }
        .tool { border: 1px solid var(--tk-key-border, #ccc); border-radius: var(--tk-radius, 8px); }
        .seg button[aria-pressed="true"] { background: var(--tk-accent, #4DB6AC); color: #fff; }
        .output {
            min-height: 120px; max-height: 40vh; overflow-y: auto; white-space: pre-wrap; word-break: break-word;
            padding: 12px; margin-bottom: var(--tk-gap, 6px);
            background: var(--tk-output-bg, #fff); color: var(--tk-output-color, #222);
            border: 1px solid var(--tk-key-border, #ccc); border-radius: var(--tk-radius, 8px);
            font-size: var(--tk-output-size, 24px);
        }
        .keyboard {
            --gap: var(--tk-gap, 6px);
            --unit: calc((100% - 9 * var(--gap)) / 10);
            position: relative;
            background: var(--tk-bg, #F0F4F9); border-radius: calc(var(--tk-radius, 6px) + 4px);
            padding: 6px 4px 8px; user-select: none; -webkit-user-select: none;
        }
        .row { display: flex; justify-content: center; gap: var(--gap); margin-top: 10px; }
        .key {
            position: relative; flex: 0 0 var(--unit); min-width: 0; height: var(--tk-key-size, 46px);
            display: flex; align-items: center; justify-content: center; padding: 0;
            background: var(--tk-key-bg, #fff); color: var(--tk-key-color, #3C4043);
            border: 0; border-radius: var(--tk-radius, 6px);
            box-shadow: 0 1px 0 var(--tk-key-shadow, rgba(0, 0, 0, 0.35));
            font: inherit; font-size: calc(var(--tk-label-size, 22px) * 0.8); cursor: pointer;
            touch-action: manipulation; -webkit-tap-highlight-color: transparent;
        }
        .key:active { filter: brightness(0.88); }
        .key.fn { background: var(--tk-fn-key-bg, #E4E7E9); font-size: 15px; }
        .key.enter { background: var(--tk-enter-bg, #4DB6AC); color: var(--tk-enter-color, #fff); }
        .key.w15 { flex-basis: calc(var(--unit) * 1.5 + var(--gap) * 0.5); }
        .key.w3 { flex-basis: calc(var(--unit) * 3 + var(--gap) * 2); }
        .key.tulu-only::after {
            content: ''; position: absolute; top: 4px; right: 4px; width: 6px; height: 6px;
            border-radius: 50%; background: var(--tk-tulu-only-color, #e9a23b);
        }
        .key .tulu { font-family: var(--tk-baravu-font); font-size: var(--tk-label-size, 22px); }
        .key .iast { font-size: calc(var(--tk-label-size, 22px) * 0.65); }
        .fn { font-size: 14px; }

        .preview {
            position: absolute; z-index: 1; pointer-events: none;
            display: flex; align-items: center; justify-content: center;
            background: var(--tk-key-bg, #fff); color: var(--tk-key-color, #3C4043);
            border-radius: var(--tk-radius, 6px); box-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
        }
        .preview .tulu { font-family: var(--tk-baravu-font); font-size: calc(var(--tk-label-size, 22px) * 1.6); }
        .preview .iast, .preview span { font-size: calc(var(--tk-label-size, 22px) * 1.1); }

        .vowels { display: flex; gap: 2px; }
        .vowels .key {
            background: transparent; box-shadow: none; height: calc(var(--tk-key-size, 46px) - 4px);
            border-radius: var(--tk-radius, 6px);
        }
        .vowels .key[aria-pressed="true"] { background: var(--tk-key-bg, #fff); box-shadow: inset 0 -3px 0 var(--tk-accent, #4DB6AC); }
        .vowels .key:hover { background: var(--tk-vowel-hover-bg, rgba(255, 255, 255, 0.25)); }

        .compact .row .key .tulu { font-size: calc(var(--tk-label-size, 22px) * 0.82); }
        .compact .vowels { overflow-x: auto; scrollbar-width: none; }
        .compact .vowels::-webkit-scrollbar { display: none; }
        .compact .vowels .key { flex: 0 0 auto; min-width: 46px; padding: 0 4px; }
        .wide .vowels { flex-wrap: wrap; }
        .wide .vowels .key { flex: 0 0 calc((100% - 16px) / 9); }
    `;

    class TuluKeyboard extends HTMLElement {
        static get observedAttributes() {
            return ['labels', 'label-switch', 'output', 'output-switch', 'layout', 'font', 'font-url', 'target'];
        }

        constructor() {
            super();
            this._kannada = '';
            this._page = 'letters';
            this._ready = false;
            this._width = 0;
            this.attachShadow({ mode: 'open' });
            this.shadowRoot.innerHTML = `
                <style>${STYLES}</style>
                <div class="toolbar" part="toolbar"></div>
                <div class="output" part="output" role="textbox" aria-readonly="true" aria-multiline="true" aria-label="Tulu text"></div>
                <div class="keyboard" part="keyboard"></div>
            `;
            this._toolbar = this.shadowRoot.querySelector('.toolbar');
            this._output = this.shadowRoot.querySelector('.output');
            this._keyboard = this.shadowRoot.querySelector('.keyboard');

            this.shadowRoot.addEventListener('click', event => this._onClick(event));
            this._keyboard.addEventListener('pointerdown', event => this._showPreview(event));
            ['pointerup', 'pointercancel', 'pointerleave'].forEach(type =>
                this._keyboard.addEventListener(type, () => this._hidePreview()));
            this._onKeydown = this._onKeydown.bind(this);
            this.addEventListener('keydown', this._onKeydown);
            this._resizeObserver = new ResizeObserver(entries => {
                const width = entries[0].contentRect.width;
                const wasWide = this._width >= WIDE_LAYOUT_MIN_WIDTH;
                this._width = width;
                if (wasWide !== width >= WIDE_LAYOUT_MIN_WIDTH) this._renderKeys();
            });
        }

        connectedCallback() {
            if (!this.hasAttribute('tabindex')) this.tabIndex = 0;
            this._resizeObserver.observe(this);
            // A host page's own load handler may reset the target's font; apply ours again after it.
            if (document.readyState !== 'complete') {
                window.addEventListener('load', () => this._ready && this._applyFont(), { once: true });
            }
            const key = this.getAttribute('persist');
            if (key && localStorage.getItem(key)) this._kannada = localStorage.getItem(key);
            dependenciesReady.then(() => {
                this._ready = true;
                this._attachTarget();
                this._applyFont();
                this._render();
            }).catch(error => console.error(error.message));
        }

        disconnectedCallback() {
            this._resizeObserver.disconnect();
            if (this._target) this._target.removeEventListener('keydown', this._onKeydown);
        }

        attributeChangedCallback(name) {
            if (!this._ready) return;
            if (name === 'target') this._attachTarget();
            if (['font', 'font-url', 'target', 'output'].includes(name)) this._applyFont();
            this._render();
        }

        get kannada() {
            return this._kannada;
        }

        set kannada(text) {
            this._edit(() => String(text ?? ''));
        }

        get baravu() {
            return this._ready ? convertKannadaToASCII(this._kannada) : '';
        }

        clear() {
            this.kannada = '';
        }

        get _labels() {
            const labels = this.getAttribute('labels');
            return ['tulu', 'kannada', 'iast'].includes(labels) ? labels : 'tulu';
        }

        get _outputScript() {
            return this.getAttribute('output') === 'kannada' ? 'kannada' : 'tulu';
        }

        /** The text shown in the output box and copied: Tulu script (Baravu text) or Kannada text. */
        get _shownText() {
            return this._outputScript === 'kannada' ? this._kannada : this.baravu;
        }

        get _layout() {
            const layout = this.getAttribute('layout');
            if (layout === 'wide' || layout === 'compact') return layout;
            return this._width >= WIDE_LAYOUT_MIN_WIDTH ? 'wide' : 'compact';
        }

        get _font() {
            return FONT_FAMILIES[this.getAttribute('font')] ? this.getAttribute('font') : 'baravu';
        }

        _applyFont() {
            const font = this._font;
            const family = this.hasAttribute('font-url') ? `tulu-keyboard-${font}` : FONT_FAMILIES[font];
            if (this.hasAttribute('font-url')) {
                registerFont(family, this.getAttribute('font-url'));
            } else if (SERVE_FONTS_TO_OTHER_SITES) {
                registerFont(family, new URL(FONT_FILES[font], SCRIPT_BASE).href);
            }
            const stack = `'${family}', Arial, sans-serif`;
            const shownFont = this._outputScript === 'kannada' ? KANNADA_FONT_STACK : stack;
            this._output.style.fontFamily = shownFont;
            if (this._target) this._target.style.fontFamily = shownFont;
            this.style.setProperty('--tk-baravu-font', stack);
            document.fonts.load(`16px '${family}'`).then(() => this._renderKeys());
        }

        _attachTarget() {
            if (this._target) this._target.removeEventListener('keydown', this._onKeydown);
            const selector = this.getAttribute('target');
            this._target = selector ? document.querySelector(selector) : null;
            if (selector && !this._target) console.warn(`tulu-keyboard: no element matches target "${selector}"`);
            if (this._target) this._target.addEventListener('keydown', this._onKeydown);
            this._output.hidden = Boolean(this._target);
        }

        _edit(change) {
            const before = this._kannada;
            this._kannada = change(before);
            if (this._kannada === before || !this._ready) return;
            const key = this.getAttribute('persist');
            if (key) localStorage.setItem(key, this._kannada);
            this._render();
            this.dispatchEvent(new CustomEvent('change', {
                bubbles: true,
                composed: true,
                detail: { kannada: this._kannada, baravu: this.baravu }
            }));
        }

        _onClick(event) {
            const button = event.target.closest('button[data-action]');
            if (!button) return;
            const { action, value } = button.dataset;
            const L = TuluKeyboardLogic;
            switch (action) {
                case 'add': this._edit(text => L.addText(text, value)); break;
                case 'sign': this._edit(text => L.setSign(text, value)); break;
                case 'backspace': this._edit(L.deleteLast); break;
                case 'page':
                    this._page = this._page === 'letters' ? 'numbers' : 'letters';
                    this._renderKeys();
                    break;
                case 'labels': this.setAttribute('labels', value); break;
                case 'output': this.setAttribute('output', value); break;
                case 'copy':
                    navigator.clipboard.writeText(this._shownText).catch(() => console.warn('tulu-keyboard: copy failed'));
                    break;
                case 'clear':
                    if (this._kannada && confirm('Clear all text?')) this.clear();
                    break;
            }
        }

        _onKeydown(event) {
            if (event.ctrlKey || event.metaKey || event.altKey) return;
            const edits = {
                Backspace: TuluKeyboardLogic.deleteLast,
                ' ': text => text + ' ',
                Enter: text => text + '\n'
            };
            if (!edits[event.key]) return;
            event.preventDefault();
            this._edit(edits[event.key]);
        }

        _render() {
            if (!this._ready) return;
            const shown = this._shownText;
            const output = this._target || this._output;
            if ('value' in output) output.value = shown;
            else output.textContent = shown;
            output.scrollTop = output.scrollHeight;
            this._renderToolbar();
            this._renderKeys();
        }

        _renderToolbar() {
            const switchGroup = (caption, action, current, options) => `
                <div class="group">
                    <span class="caption">${caption}</span>
                    <div class="seg" role="group" aria-label="${caption}">
                        ${options.map(([value, text]) => `<button type="button" data-action="${action}" data-value="${value}" aria-pressed="${current === value}">${text}</button>`).join('')}
                    </div>
                </div>`;
            const keysSwitch = this.getAttribute('label-switch') === 'hide' ? '' : switchGroup(
                'Keys:', 'labels', this._labels, [['tulu', 'Tulu'], ['kannada', 'ಕನ್ನಡ'], ['iast', 'IAST']]);
            const outputSwitch = this.getAttribute('output-switch') === 'hide' ? '' : switchGroup(
                'Output:', 'output', this._outputScript, [['tulu', 'Tulu'], ['kannada', 'ಕನ್ನಡ']]);
            const copy = this._target ? '' : '<button type="button" class="tool" data-action="copy">📋 Copy</button>';
            this._toolbar.innerHTML = `<div class="switches">${keysSwitch}${outputSwitch}</div><div class="tools">${copy}<button type="button" class="tool" data-action="clear">🗑️ Clear</button></div>`;
        }

        _renderKeys() {
            if (!this._ready) return;
            const L = TuluKeyboardLogic;
            const key = (action, value, kannada, extra = {}) => {
                const label = extra.label ? `<span class="fn">${extra.label}</span>` : this._label(kannada);
                const classes = ['key', extra.fn ? 'fn' : 'char', extra.width || '', L.isTuluOnly(kannada) ? 'tulu-only' : ''].join(' ');
                const pressed = extra.active === undefined ? '' : ` aria-pressed="${extra.active}"`;
                const ariaLabel = escapeHtml(extra.ariaLabel || L.toIast(kannada) || kannada);
                return `<button type="button" part="key" class="${classes}" data-action="${action}" data-value="${escapeHtml(value)}" aria-label="${ariaLabel}"${pressed}>${label}</button>`;
            };
            const add = c => key('add', c, c);
            const row = keys => `<div class="row">${keys.join('')}</div>`;

            const vowelRow = L.vowelRow(this._kannada).map(k => k.sign === null
                ? add(k.kannada)
                : key('sign', k.sign, k.kannada, { active: k.active }));
            const splitter = key('add', L.ZWNJ, '', { label: 'split', ariaLabel: 'Splitter', fn: true, width: 'w15' });
            const backspace = key('backspace', '', '', { label: '⌫', ariaLabel: 'Backspace', fn: true, width: 'w15' });

            let rows = `<div class="vowels" part="vowel-row">${vowelRow.join('')}</div>`;
            if (this._page === 'letters') {
                const c = L.CONSONANTS;
                rows += row(c.slice(0, 10).map(add));
                rows += row(c.slice(10, 20).map(add));
                rows += row(c.slice(20, 30).map(add));
                rows += row([splitter, ...c.slice(30).map(add), add(L.ANUSVARA), add(L.VISARGA), backspace]);
            } else {
                const punctuation = L.PUNCTUATION.filter(p => p !== '.' && p !== ',');
                rows += row(L.DIGITS.map(add));
                rows += row(punctuation.map(add));
                rows += row([splitter, add(L.ANUSVARA), add(L.VISARGA), backspace]);
            }
            const pageKey = this._page === 'letters'
                ? key('page', '', '', { label: '123', ariaLabel: 'Numbers and punctuation', fn: true, width: 'w15' })
                : key('page', '', 'ಕಖಗ', { ariaLabel: 'Letters', fn: true, width: 'w15' });
            rows += row([
                pageKey,
                ...L.PHRASES.map(add),
                add(','),
                key('add', ' ', '', { label: 'space', ariaLabel: 'Space', width: 'w3' }),
                add('.'),
                key('add', '\n', '', { label: '↵', ariaLabel: 'New line', fn: true, width: 'w15 enter' })
            ]);

            this._keyboard.className = `keyboard ${this._layout}`;
            this._keyboard.innerHTML = rows;

            const strip = this._keyboard.querySelector('.compact .vowels');
            const active = strip && strip.querySelector('[aria-pressed="true"]');
            if (active) strip.scrollLeft = active.offsetLeft - strip.offsetLeft - (strip.clientWidth - active.offsetWidth) / 2;
        }

        _showPreview(event) {
            const button = event.target.closest('.row .key.char');
            if (!button) return;
            this._hidePreview();
            const preview = document.createElement('div');
            preview.className = 'preview';
            preview.innerHTML = button.innerHTML;
            const width = button.offsetWidth * 1.4;
            const height = button.offsetHeight * 1.3;
            preview.style.width = `${width}px`;
            preview.style.height = `${height}px`;
            preview.style.left = `${button.offsetLeft - (width - button.offsetWidth) / 2}px`;
            preview.style.top = `${button.offsetTop - height - 4}px`;
            this._keyboard.appendChild(preview);
            this._preview = preview;
        }

        _hidePreview() {
            if (this._preview) this._preview.remove();
            this._preview = null;
        }

        _label(kannada) {
            const labels = this._labels;
            if (labels === 'kannada') return `<span>${escapeHtml(kannada)}</span>`;
            if (labels === 'iast') return `<span class="iast">${escapeHtml(TuluKeyboardLogic.toIast(kannada))}</span>`;
            return `<span class="tulu">${escapeHtml(convertKannadaToASCII(kannada))}</span>`;
        }
    }

    function escapeHtml(text) {
        return text.replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[ch]);
    }

    customElements.define('tulu-keyboard', TuluKeyboard);
})();
