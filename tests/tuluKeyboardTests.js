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

function runAllTests() {
    testTapSequences();
    testVowelRow();
    testIast();
    TestRunner.printSummary();
}
