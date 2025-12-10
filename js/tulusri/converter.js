
function getMapping(letter) {
    if (letter in mapping) {
        return mapping[letter];
    }
    return letter;
}

function convert(txt) {
    console.log(' Converting : '+txt);
    return convertWithEscape(txt);
}

function convertWithEscape(txt, escapeChar) {
    let doMap = true;
    let convertedWord = [];

    for (let i = 0; i < txt.length; i++) {
        let letterToConvert = txt[i];

        if (letterToConvert === escapeChar) {
            doMap = !doMap;
            continue;
        }

        // fix for chillu letters between kannada and malayalam letters
        if ((letterToConvert in KM_VIRAMA_MAPPING) && doMap === true) {
            if ((txt[i - 1] in KM_CHILLU_LATTERS_MAPPING) && !isAscii(txt, i)) {
                //remove the letter and replace with corresponding chillu letter 
                convertedWord.pop();
                letterToConvert = KM_CHILLU_LATTERS_MAPPING[txt[i - 1]];
            }
        }

        if (doMap === true) {
            convertedWord.push(getMapping(letterToConvert));
        } else {
            convertedWord.push(letterToConvert);
        }
    }
    return convertedWord.join('');
}

function isAscii(txt, currentIndex) {
    return (/^[\x00-\x7F]+$/.test(txt[currentIndex+1]));
}