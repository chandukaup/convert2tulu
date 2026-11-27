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

```html
<script src="https://convert2tulu.netlify.app/tulu-keyboard.js"></script>
<tulu-keyboard font-url="/fonts/baravu_1.ttf"></tulu-keyboard>
```

To pin a version so updates can't change your page, load it from jsDelivr instead:
`https://cdn.jsdelivr.net/gh/chandukaup/convert2tulu@<tag>/tulu-keyboard.js`

The Baravu fonts are not served to other sites, so point `font-url` at your own copy of a Baravu font from [Jai Tulunad](https://www.jaitulunad.in/).

| Attribute | Values | Default |
|---|---|---|
| `labels` | `tulu`, `kannada`, `iast` | `tulu` |
| `label-switch` | `show`, `hide` | `show` |
| `kannada-output` | `never`, `with-labels` (show Kannada in the box only while key labels are Kannada) | `never` |
| `layout` | `auto`, `wide`, `compact` | `auto` |
| `font` | `baravu`, `baravu-mandara` | `baravu` |
| `font-url` | URL of a Baravu font file | none |
| `target` | CSS selector of your own output box | none (uses its own box) |
| `persist` | `localStorage` key to keep the text across refreshes | none |

Style it with CSS variables: `--tk-bg`, `--tk-key-bg`, `--tk-fn-key-bg`, `--tk-key-color`, `--tk-key-shadow`, `--tk-key-border`, `--tk-vowel-hover-bg`, `--tk-accent`, `--tk-enter-bg`, `--tk-enter-color`, `--tk-tulu-only-color`, `--tk-key-size`, `--tk-label-size`, `--tk-gap`, `--tk-radius`, `--tk-output-bg`, `--tk-output-color`, `--tk-output-size`, `--tk-max-width`.

Read the text with `el.kannada` and `el.baravu`, clear it with `el.clear()`, and listen for the `change` event, whose `detail` has `{ kannada, baravu }`.

## Online Demo
Online version is available at [https://convert2tulu.netlify.app](https://convert2tulu.netlify.app)