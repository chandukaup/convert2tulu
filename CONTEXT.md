# Convert2Tulu

Turns Kannada-script text into Tulu script, so people can write Tulu without a dedicated Tulu input method.

## Language

### Text layers

**Kannada text**:
The source text, written in Kannada Unicode. All Tulu output is derived from it.
_Avoid_: input, original text

**Baravu text**:
The ASCII encoding of Tulu that only looks like Tulu script when shown in a Baravu font.
_Avoid_: ASCII text, converted text

**Tulu script**:
What the reader sees: Baravu text displayed in a Baravu font.
_Avoid_: Tulu text, output

### Keyboard

**Tulu keyboard**:
An on-screen keyboard for writing Tulu script by tapping keys, used in place of a typing box. Each tap adds to Kannada text kept behind the scenes, which is then shown as Tulu script.
_Avoid_: virtual keyboard, IME

**Key label script**:
The script printed on the keys of the Tulu keyboard: Tulu script by default, or Kannada, or IAST.
_Avoid_: keyboard mode, keyboard language

**Consonant grid**:
The rows of the Tulu keyboard holding one key per consonant, two vargas to a row in alphabet order.

**Vowel row**:
The keys showing the last-typed consonant combined with each vowel sign, labelled with the finished form.
_Avoid_: matra row, suggestion bar

**Wide layout**:
The Tulu keyboard arrangement for large screens, where the vowel row wraps onto two lines.

**Compact layout**:
The Tulu keyboard arrangement for phones, where the vowel row is a single strip that scrolls sideways.

**Tulu-only vowel**:
A vowel sound Tulu has and Kannada lacks, such as the open e (ɛ) and the short u (ŭ). Kannada text marks it by adding an invisible joiner after the nearest Kannada vowel.
_Avoid_: special character

**Splitter**:
An invisible mark that stops two consonants from joining into a conjunct.
_Avoid_: ZWNJ, separator

### Embedding

**Host page**:
Any web page that includes the Tulu keyboard script, including this project's own keyboard page.

**Standalone keyboard**:
A Tulu keyboard that comes with its own output box.

**Attached keyboard**:
A Tulu keyboard that writes into an output box already on the host page.
