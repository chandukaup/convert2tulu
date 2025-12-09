const test_data = [
  {
    name: "Basic vowels",
    input: "ಅ ಆ ಇ ಈ ಉ ಊ ಋ",
    expected: {
      tulusri: "അ ആ ഇ ഈ ഉ ഊ ഋ",
      baravu: "XAA XAa XAi XAI XAu XAU XAR"
    }
  },
  {
    name: "Dependent vowel signs - ke, ka, koo",
    input: "ಕೆ ಕೇ ಕೋ ಕು ಕೂ",
    expected: {
      tulusri: "കെ കേ കോ കു കൂ",
      baravu: "ek Ek Fka ku kU"
    }
  },
  {
    name: "Cluster + vowel reordering",
    input: "ಕ್ಲೆ",
    expected: {
      tulusri: "ക്ലെ",
      baravu: "ekAl"
    }
  },
  {
    name: "Consonant conjunct - kta",
    input: "ಕ್ತ",
    expected: {
      tulusri: "ക്ത",
      baravu: "kAt"
    }
  },
  {
    name: "Simple word - namaskāra",
    input: "ನಮಸ್ಕಾರ",
    expected: {
      tulusri: "നമസ്കാര",
      baravu: "nmsAkar"
    }
  },
  {
    name: "Multi-cluster word",
    input: "ಸ್ಪಷ್ಟ",
    expected: {
      tulusri: "സ്പഷ്ട",
      baravu: "sApxAq"
    }
  },
  {
    name: "Word with anusvara",
    input: "ಸಂಸ್ಕೃತ",
    expected: {
      tulusri: "സംസ്കൃത",
      baravu: "sMsAkRt"
    }
  },
  {
    name: "Word with visarga",
    input: "ದುಃಖ",
    expected: {
      tulusri: "ദുഃഖ",
      baravu: "duHK"
    }
  },
  {
    name: "Arka rule - ರ್ + ಕ",
    input: "ರ್ಕ",
    expected: {
      tulusri: "ർക",
      baravu: "kf"
    }
  },
  {
    name: "Vowel split inside cluster - ಕೊ, ಕೋ",
    input: "ಕೊ ಕೋ",
    expected: {
      tulusri: "കൊ കോ",
      baravu: "eka Fka"
    }
  },
  {
    name: "Special case - ಅ + ೈ (ai)",
    input: "ಐ ಕೖ ಗಾಯ್",
    expected: {
      tulusri: "ഐ കೖ ഗായ്",
      baravu: "eeA eek gayA"
    }
  },
  {
    name: "Complex cluster + vowel sign",
    input: "ಶ್ರೇಯ",
    expected: {
      tulusri: "ശ്രേയ",
      baravu: "ESAry"
    }
  },
  {
    name: "Handling ಶ್ರೀ",
    input: "ಶ್ರೀ",
    expected: {
      tulusri: "ശ്രീ",
      baravu: "SArXI"
    }
  }
];
