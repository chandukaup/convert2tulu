// ============================================
// TEST UTILITIES
// ============================================
const TestRunner = {
    stats: { passed: 0, failed: 0 },

    assert(condition, testName, message) {
        if (condition) {
            console.log(`✅ ${testName}: PASSED`);
            this.stats.passed++;
        } else {
            console.log(`❌ ${testName}: FAILED - ${message}`);
            this.stats.failed++;
        }
    },

    printSummary() {
        console.log('\n' + '='.repeat(50));
        console.log(`Results: ${this.stats.passed} passed, ${this.stats.failed} failed`);
        console.log('='.repeat(50));
    }
};

const L = TuluKeyboardLogic;
const ZWJ = L.ZWJ;

// Each step mirrors one key tap.
const tap = {
    consonant: c => text => L.addText(text, c),
    vowel: v => text => L.addText(text, v),
    sign: s => text => L.setSign(text, s),
    text: s => text => L.addText(text, s),
    backspace: () => text => L.deleteLast(text)
};

function typeSequence(steps) {
    return steps.reduce((text, step) => step(text), '');
}

// ============================================
// TEST SUITE: tap sequences
// ============================================
function testTapSequences() {
    console.log('\n🧪 Testing tap sequences...\n');

    const tests = [
        {
            name: 'ಕನ್ನಡ from consonants and virama',
            steps: [tap.consonant('ಕ'), tap.consonant('ನ'), tap.sign('್'), tap.consonant('ನ'), tap.consonant('ಡ')],
            kannada: 'ಕನ್ನಡ',
            baravu: 'knAnw'
        },
        {
            name: 'Vowel sign is added to the consonant',
            steps: [tap.consonant('ಕ'), tap.sign('ಿ')],
            kannada: 'ಕಿ',
            baravu: 'ki'
        },
        {
            name: 'Second vowel sign replaces the first',
            steps: [tap.consonant('ಕ'), tap.sign('ಿ'), tap.sign('ು')],
            kannada: 'ಕು',
            baravu: 'ku'
        },
        {
            name: 'Bare form removes the vowel sign',
            steps: [tap.consonant('ಕ'), tap.sign('ಿ'), tap.sign('')],
            kannada: 'ಕ',
            baravu: 'k'
        },
        {
            name: 'Pre-positioned vowel sign is reordered by the converter',
            steps: [tap.consonant('ಕ'), tap.sign('ೆ')],
            kannada: 'ಕೆ',
            baravu: 'ek'
        },
        {
            name: 'Vowel sign goes on the whole conjunct',
            steps: [tap.consonant('ಕ'), tap.sign('್'), tap.consonant('ತ'), tap.sign('ಾ')],
            kannada: 'ಕ್ತಾ',
            baravu: 'kAta'
        },
        {
            name: 'Tulu-only vowel sign',
            steps: [tap.consonant('ಕ'), tap.sign('ೆ' + ZWJ)],
            kannada: 'ಕೆ' + ZWJ,
            baravu: 'ok'
        },
        {
            name: 'Tulu-only vowel sign replaced by a regular sign',
            steps: [tap.consonant('ಕ'), tap.sign('ು' + ZWJ), tap.sign('ಾ')],
            kannada: 'ಕಾ',
            baravu: 'ka'
        },
        {
            name: 'Standalone Tulu-only vowel',
            steps: [tap.vowel('ಎ' + ZWJ)],
            kannada: 'ಎ' + ZWJ,
            baravu: 'oA'
        },
        {
            name: 'Backspace removes a Tulu-only vowel sign in one step',
            steps: [tap.consonant('ಕ'), tap.sign('ೆ' + ZWJ), tap.backspace()],
            kannada: 'ಕ',
            baravu: 'k'
        },
        {
            name: 'Backspace removes one character',
            steps: [tap.consonant('ಕ'), tap.sign('ಿ'), tap.backspace()],
            kannada: 'ಕ',
            baravu: 'k'
        },
        {
            name: 'Backspace on empty text',
            steps: [tap.backspace()],
            kannada: '',
            baravu: ''
        },
        {
            name: 'Vowel sign with no consonant does nothing',
            steps: [tap.vowel('ಅ'), tap.sign('ಿ')],
            kannada: 'ಅ',
            baravu: 'XAA'
        },
        {
            name: 'Vowel sign after a space does nothing',
            steps: [tap.consonant('ಕ'), tap.text(' '), tap.sign('ಿ')],
            kannada: 'ಕ ',
            baravu: 'k '
        },
        {
            name: 'Splitter ends the cluster',
            steps: [tap.consonant('ಕ'), tap.sign('್'), tap.text(L.ZWNJ), tap.consonant('ತ'), tap.sign('ಿ')],
            kannada: 'ಕ್' + L.ZWNJ + 'ತಿ',
            baravu: 'kAXti'
        },
        {
            name: 'Anusvara after a vowel sign',
            steps: [tap.consonant('ಕ'), tap.sign('ಾ'), tap.text(L.ANUSVARA)],
            kannada: 'ಕಾಂ',
            baravu: 'kaM'
        },
        {
            name: 'Vocalic RR vowel ೠ',
            steps: [tap.vowel('ೠ')],
            kannada: 'ೠ',
            baravu: 'XARR'
        },
        {
            name: 'Vocalic RR vowel sign ೄ',
            steps: [tap.consonant('ಕ'), tap.sign('ೄ')],
            kannada: 'ಕೄ',
            baravu: 'kRR'
        },
        {
            name: 'Om phrase key',
            steps: [L.PHRASES[0]].map(p => tap.text(p)),
            kannada: 'ಓಂ',
            baravu: 'FAamXA'
        },
        {
            name: 'Shri phrase key',
            steps: [L.PHRASES[1]].map(p => tap.text(p)),
            kannada: 'ಶ್ರೀ',
            baravu: 'SArXI'
        },
        {
            name: 'Phrase keys inside a word',
            steps: [tap.text('ಜೈ'), tap.text(' '), tap.text(L.PHRASES[1])],
            kannada: 'ಜೈ ಶ್ರೀ',
            baravu: 'eej SArXI'
        },
        {
            name: 'Digits',
            steps: [tap.text('೧'), tap.text('೨')],
            kannada: '೧೨',
            baravu: '12'
        }
    ];

    tests.forEach(test => {
        const kannada = typeSequence(test.steps);
        const baravu = convertKannadaToASCII(kannada);
        TestRunner.assert(
            kannada === test.kannada && baravu === test.baravu,
            test.name,
            `Kannada: "${kannada}" (expected "${test.kannada}"), Baravu: "${baravu}" (expected "${test.baravu}")`
        );
    });
}

// ============================================
// TEST SUITE: vowel row
// ============================================
function testVowelRow() {
    console.log('\n🧪 Testing vowel row...\n');

    const empty = L.vowelRow('');
    TestRunner.assert(empty[0].kannada === 'ಅ' && empty.every(k => k.sign === null), 'Empty text shows standalone vowels', JSON.stringify(empty[0]));

    const afterSpace = L.vowelRow('ಕ ');
    TestRunner.assert(afterSpace[0].kannada === 'ಅ', 'After a space shows standalone vowels', JSON.stringify(afterSpace[0]));

    const ka = L.vowelRow('ಕ');
    TestRunner.assert(ka.map(k => k.kannada).includes('ಕಿ'), 'After ಕ shows ಕಿ', JSON.stringify(ka.map(k => k.kannada)));
    TestRunner.assert(ka.find(k => k.active).sign === '', 'After ಕ the bare form is active', JSON.stringify(ka.find(k => k.active)));

    const ki = L.vowelRow('ಕಿ');
    TestRunner.assert(ki.find(k => k.active).sign === 'ಿ', 'After ಕಿ the ಿ form is active', JSON.stringify(ki.find(k => k.active)));

    const kta = L.vowelRow('ಅಕ್ತ');
    TestRunner.assert(kta[1].kannada === 'ಕ್ತಾ', 'Vowel row covers the whole conjunct', kta[1].kannada);

    const shri = L.vowelRow('ಶ್ರೀ');
    TestRunner.assert(shri[1].kannada === 'ಶ್ರಾ' && shri.find(k => k.active).sign === 'ೀ', 'After ಶ್ರೀ the row is for ಶ್ರ with ೀ active', JSON.stringify(shri.find(k => k.active)));

    const om = L.vowelRow('ಓಂ');
    TestRunner.assert(om[0].kannada === 'ಅ', 'After ಓಂ shows standalone vowels', JSON.stringify(om[0]));

    TestRunner.assert(L.VOWELS.includes('ೠ') && L.vowelRow('').some(k => k.kannada === 'ೠ'), 'Standalone vowels include ೠ', JSON.stringify(L.VOWELS));
    TestRunner.assert(L.vowelRow('ಕ').some(k => k.kannada === 'ಕೄ'), 'Vowel row after ಕ includes ಕೄ', JSON.stringify(L.vowelRow('ಕ').map(k => k.kannada)));

    const tuluOnly = L.vowelRow('ಕೆ' + ZWJ);
    TestRunner.assert(tuluOnly.find(k => k.active).sign === 'ೆ' + ZWJ, 'Tulu-only sign is active, not the regular ೆ', JSON.stringify(tuluOnly.find(k => k.active)));
}

// ============================================
// TEST SUITE: IAST labels
// ============================================
function testIast() {
    console.log('\n🧪 Testing IAST labels...\n');

    const tests = [
        ['ಕ', 'ka'],
        ['ಕಾ', 'kā'],
        ['ಕ್', 'k'],
        ['ಕ್ತಿ', 'kti'],
        ['ಕನ್ನಡ', 'kannaḍa'],
        ['ಕೆ' + ZWJ, 'kɛ'],
        ['ಕೇ' + ZWJ, 'kɛ̄'],
        ['ಕು' + ZWJ, 'kŭ'],
        ['ಎ' + ZWJ, 'ɛ'],
        ['ಐ', 'ai'],
        ['ೠ', 'ṝ'],
        ['ಕೄ', 'kṝ'],
        ['ಶ್ರೀ', 'śrī'],
        ['ಓಂ', 'ōṁ'],
        ['ಕಂ', 'kaṁ'],
        ['೧', '1']
    ];

    tests.forEach(([kannada, expected]) => {
        const actual = L.toIast(kannada);
        TestRunner.assert(actual === expected, `IAST of ${kannada}`, `Expected "${expected}", got "${actual}"`);
    });
}

function testInsertAtCaret() {
    console.log('\n🧪 Testing insert / set sign at caret...\n');

    const mid = L.addTextAt('ಕಕ', 1, ' ');
    TestRunner.assert(
        mid.text === 'ಕ ಕ' && mid.caret === 2,
        'Insert space in middle',
        JSON.stringify(mid)
    );

    const signed = L.setSignAt('ಕ ಕ', 1, 'ಿ');
    TestRunner.assert(
        signed.text.slice(0, 2) === 'ಕಿ',
        'Vowel sign on cluster before caret',
        JSON.stringify(signed)
    );

    const row = L.vowelRow('ಕ ಕ', 1);
    TestRunner.assert(
        row.some(k => k.sign === 'ಿ' && k.kannada.startsWith('ಕ')),
        'Vowel row follows caret cluster',
        JSON.stringify(row[0])
    );
}

function testDeleteBaravuCharBefore() {
    console.log('\n🧪 Testing Baravu-position backspace...\n');

    const kannada = 'ತತ್ತರ';
    const expected = 'ttAtr';
    TestRunner.assert(
        convertKannadaToASCII(kannada) === expected,
        'ತತ್ತರ converts to ttAtr',
        convertKannadaToASCII(kannada)
    );

    const mid = L.deleteBaravuCharBefore(kannada, 3, convertKannadaToASCII);
    TestRunner.assert(
        convertKannadaToASCII(mid.text) === 'tttr',
        'Backspace before middle t removes one Baravu glyph (not tttr chaos)',
        convertKannadaToASCII(mid.text)
    );

    const end = L.deleteBaravuCharBefore(kannada, 5, convertKannadaToASCII);
    TestRunner.assert(
        convertKannadaToASCII(end.text) === 'ttAt',
        'Backspace before final r removes r',
        convertKannadaToASCII(end.text)
    );

    const knfBack = L.deleteBaravuCharBefore('ಕರ್ನಕ', 4, convertKannadaToASCII);
    TestRunner.assert(
        knfBack.text === 'ಕರ್ನ' && knfBack.caret === 4,
        'Backspace at end of ಕರ್ನಕ keeps caret at end of ಕರ್ನ (no knf→krAan regression)',
        JSON.stringify(knfBack)
    );
    const knfa = L.setSignAt(knfBack.text, knfBack.caret, 'ಾ');
    TestRunner.assert(
        convertKannadaToASCII(knfa.text) === 'knfa',
        'Adding ಾ after backspace on ಕರ್ನಕ produces ಕರ್ನಾ (knfa)',
        `${knfa.text} → ${convertKannadaToASCII(knfa.text)}`
    );

    const noOrphanZwj = L.deleteBaravuCharBefore('ಕೆ' + ZWJ + 'ಕ', 1, convertKannadaToASCII);
    TestRunner.assert(
        noOrphanZwj.text === 'ಕಕ' && !noOrphanZwj.text.includes(ZWJ),
        'Backspace on Tulu-only vowel leaves no stray ZWJ',
        JSON.stringify(noOrphanZwj)
    );

    const rangeDel = L.deleteBaravuRange('ಕನ್ನಡ ಪದ', 0, 5, convertKannadaToASCII);
    TestRunner.assert(
        rangeDel.text === ' ಪದ' && rangeDel.caret === 0,
        'Range deletion removes selected Baravu word',
        JSON.stringify(rangeDel)
    );
}

function testDeleteBeforeIndex() {
    console.log('\n🧪 Testing delete before caret index...\n');

    const mid = L.deleteBeforeIndex('ಕಕ', 1);
    TestRunner.assert(
        mid.text === 'ಕ' && mid.caret === 0,
        'Backspace in middle of Kannada text',
        JSON.stringify(mid)
    );

    const tuluOnly = L.deleteBeforeIndex('ಕ' + 'ೆ' + ZWJ + 'ಕ', 3);
    TestRunner.assert(
        tuluOnly.text === 'ಕಕ' && tuluOnly.caret === 1,
        'Backspace on Tulu-only vowel sign at caret',
        JSON.stringify(tuluOnly)
    );
}

function testBaravuCaretMapping() {
    console.log('\n🧪 Testing Baravu offset ↔ Kannada index...\n');

    const conjunct = 'ಕರ್ನ';
    const baravuLen = convertKannadaToASCII(conjunct).length;
    TestRunner.assert(
        baravuLen < conjunct.length,
        'ಕರ್ನ Baravu is shorter than Kannada length (regression guard)',
        `${baravuLen} vs ${conjunct.length}`
    );

    let t = conjunct;
    const at = L.baravuOffsetToKannadaIndex(t, baravuLen, convertKannadaToASCII);
    TestRunner.assert(
        at === t.length,
        'Caret at end of Baravu maps to end of Kannada (not knf→kranqk bug)',
        `offset ${baravuLen}, mapped ${at}, kannada length ${t.length}`
    );

    const midSentence = L.baravuOffsetToKannadaIndex('ಕರ್ನ ಟ', 3, convertKannadaToASCII);
    TestRunner.assert(
        midSentence === 4,
        'Caret at end of first word ಕರ್ನ inside a sentence maps to end of ಕರ್ನ',
        `mapped ${midSentence}, expected 4`
    );

    t = L.addTextAt(t, at, 'ಾ').text;
    t = L.addTextAt(t, t.length, 'ಟ').text;
    t = L.setSignAt(t, t.length, 'ಾ').text;
    t = L.addTextAt(t, t.length, 'ಕ').text;
    const out = convertKannadaToASCII(t);
    TestRunner.assert(
        out.startsWith('knf') && out.includes('q'),
        'Karnataka-style tap sequence after ಕರ್ನ+ಾ...',
        `"${out}" from "${t}"`
    );
}

function runAllTests() {
    testTapSequences();
    testInsertAtCaret();
    testDeleteBaravuCharBefore();
    testDeleteBeforeIndex();
    testBaravuCaretMapping();
    testVowelRow();
    testIast();
    TestRunner.printSummary();
}
