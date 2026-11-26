# The Tulu keyboard keeps Kannada text, not Baravu text

The Tulu keyboard stores what the user taps as Kannada text and reruns the existing Kannada-to-Baravu converter after every tap, instead of having each key append Baravu text directly. Baravu text does not follow typing order: some vowel signs are written before the consonant (ಕೆ → `ek`), and conjuncts and subscript ra rearrange earlier letters (ಕ್ತ → `kAt`, ರ್ಕ → `kf`). Writing Baravu directly would mean every key has to rewrite text already typed, and backspace could delete half of a Tulu letter. Keeping Kannada text reuses the tested converter, makes backspace remove exactly one Kannada character, and gives host pages both forms.

## Consequences

- The output box is append-only. A cursor position in Baravu text does not map cleanly to a position in Kannada text, so tapping into the middle of the output to edit is out of scope until that mapping exists.
- Any key whose effect cannot be expressed as Kannada text, such as a Tulu-only vowel, needs a Kannada encoding the converter understands, like the invisible joiner it already uses.
