# Tool to Convert Kannada Text to Tulu Script.

This tool helps you convert Kannada text into the Tulu script. It offers several conversion options:

### Standard Converter
- This option converts Kannada text into ASCII format and displays the Tulu script using the Baravu font from [Jai Tulunad](https://www.jaitulunad.in/)
- The original Kannada text and the converted Tulu script are displayed side by side for easy comparison.

### Single Textarea
- Similar to the Standard Converter, this option also converts Kannada text into ASCII format and uses the Baravu font from [Jai Tulunad](https://www.jaitulunad.in/)
- The conversion happens in real-time within a single text box.
- Note: Some features may not work well on mobile. For the best experience, it is recommended to use this tool on a desktop.
this only in desktop.

### Original Version
- The converts Kannada text to Malayalam and uses [TULUSRI](https://www.thetulufont.in/) font to display the text as Tulu script.

### Tulu Keyboard
- An on-screen keyboard for typing in Tulu script without a Kannada keyboard. Tap a consonant, then pick its vowel form from the row above it.
- Key labels can be shown in Tulu script, Kannada or IAST.
- Tulu-only sounds (marked with an orange dot) and the splitter have their own keys.

All converters allow you to download the converted text as an image. You can customize the font color, weight, and size, as well as the background color. Additionally, you can upload your own background image before downloading.

## Add the Tulu Keyboard to your own page

The keyboard is a single script plus a `<tulu-keyboard>` tag. The script also loads `js/baravu/` and `js/tulukeyboard/` from the **same URL** as `tulu-keyboard.js`. On your site you only need to host a **Baravu font file** (see below).

### Script URL

**Recommended for embeds — jsDelivr, pinned to a [release tag](https://github.com/chandukaup/convert2tulu/tags):**

```html
<script src="https://cdn.jsdelivr.net/gh/chandukaup/convert2tulu@v1.0.0/tulu-keyboard.js"></script>
```

Replace `v1.0.0` with the tag you tested. You only change behavior when you bump the tag. Conversion files ship from jsDelivr with the script.

**Optional — Netlify (always the current production deploy):**

```html
<script src="https://convert2tulu.netlify.app/tulu-keyboard.js"></script>
```

Use this to try the latest build on the live site. It can change whenever `master` is deployed, without a new tag.

Use UTF-8 on the page (`<meta charset="UTF-8">`).

### What you need to do

1. **Get one Baravu font** from [Jai Tulunad](https://www.jaitulunad.in/) and follow their licence. Upload a single `.ttf` or `.otf` to your site, e.g. `https://yoursite.example/fonts/baravu_1.ttf`. **One font is enough** — you do not need Baravu Mandara, Mallige, etc. on your server. Output and (with default key labels) the keys all use that file. Use a Baravu-family font only; Tulu Sri uses a different encoding and will not work with this keyboard.
2. **Load the script** once per page (see jsDelivr example above; place the tag after any output box you want to fill).
3. **Place the keyboard** and set **`font-url`** to your hosted font. On other people’s domains this attribute is **required** — convert2tulu does not serve Baravu font files to embeds. Without `font-url`, Tulu script in the output and on keys will not render correctly.

### Minimal embed (keyboard brings its own text box)

```html
<script src="https://cdn.jsdelivr.net/gh/chandukaup/convert2tulu@v1.0.0/tulu-keyboard.js"></script>
<tulu-keyboard
  font-url="https://yoursite.example/fonts/baravu_1.ttf"
  layout="wide"
  persist="my-page-tulu-text">
</tulu-keyboard>
```

Visitors tap keys; Tulu script appears in the box above the keyboard. `persist` saves draft text in `localStorage` under that key.

### Use your own output box (like the live keyboard page)

Put your textarea first, then point the keyboard at it with `target`:

```html
<label for="tuluOutput">Tulu Text</label>
<textarea id="tuluOutput" readonly placeholder="Tap the keys below…"></textarea>

<tulu-keyboard
  id="kb"
  target="#tuluOutput"
  font-url="https://yoursite.example/fonts/baravu_1.ttf"
  layout="wide"
  labels="tulu"
  label-switch="show">
</tulu-keyboard>

<script src="https://cdn.jsdelivr.net/gh/chandukaup/convert2tulu@v1.0.0/tulu-keyboard.js"></script>
```

The built-in output box is hidden when `target` is set. Style `#tuluOutput` with the same Baravu font family if you declare `@font-face` on your page (the component also applies the font from `font-url` to the target).

### Listen for edits (optional)

```html
<script>
  document.getElementById('kb').addEventListener('change', (event) => {
    // event.detail.kannada — Kannada Unicode kept behind the scenes
    // event.detail.baravu  — Baravu ASCII shown as Tulu script
    console.log(event.detail);
  });
</script>
```

You can also use `element.kannada`, `element.baravu`, and `element.clear()` from JavaScript.

### Configuration

| Attribute | Values | Default |
|---|---|---|
| `labels` | `tulu`, `kannada`, `iast` | `tulu` |
| `label-switch` | `show`, `hide` | `show` |
| `layout` | `auto`, `wide`, `compact` | `auto` |
| `font` | `baravu`, `baravu-mandara`, `mallige` | `baravu` |
| `font-url` | Absolute URL of **one** Baravu-family font on **your** server | none |
| `target` | CSS selector of your own output box | none (uses built-in box) |
| `persist` | `localStorage` key to keep text across refreshes | none |

On **convert2tulu.netlify.app** only, fonts can be chosen without `font-url` because the site already loads Baravu in CSS. Everywhere else, use `font-url` (one file). With `font-url` set, the `font` attribute only names the internal font family; glyphs always come from that single URL.

Key labels **Kannada** or **IAST** use normal Unicode/Latin on the keys; output still uses your `font-url`.

### Theming

Target the custom element with CSS variables, e.g.:

```css
tulu-keyboard {
  --tk-bg: #f0f4f9;
  --tk-key-bg: #ffffff;
  --tk-accent: #4db6ac;
  --tk-key-size: 48px;
  --tk-max-width: 720px;
}
```

Full list: `--tk-bg`, `--tk-key-bg`, `--tk-fn-key-bg`, `--tk-key-color`, `--tk-key-shadow`, `--tk-key-border`, `--tk-vowel-hover-bg`, `--tk-accent`, `--tk-enter-bg`, `--tk-enter-color`, `--tk-tulu-only-color`, `--tk-key-size`, `--tk-label-size`, `--tk-gap`, `--tk-radius`, `--tk-output-bg`, `--tk-output-color`, `--tk-output-size`, `--tk-max-width`.

### Self-hosting the script (advanced)

You may copy `tulu-keyboard.js` and the folders `js/baravu/` and `js/tulukeyboard/` into your project and serve them from one directory, keeping the same relative paths. The script resolves dependencies from its own URL. You still provide Baravu via `font-url` unless you add matching `@font-face` rules on your page.

A local check page lives at `tests/tuluKeyboardEmbed.html`.

## Online Demo
Online version is available at [https://convert2tulu.netlify.app](https://convert2tulu.netlify.app)