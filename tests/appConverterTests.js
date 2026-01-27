// ============================================
// TEST UTILITIES
// ============================================
const TestRunner = {
    stats: { passed: 0, failed: 0 },
    
    reset() {
        this.stats = { passed: 0, failed: 0 };
    },
    
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

// ============================================
// MOCK HELPERS
// ============================================
const MockHelpers = {
    createMockTextArea(value, cursorPos) {
        return {
            value: value,
            selectionStart: cursorPos,
            selectionEnd: cursorPos,
            setSelectionRange(start, end) {
                this.selectionStart = start;
                this.selectionEnd = end;
            }
        };
    },
    
    mockGlobals(mocks) {
        const originals = {};
        Object.keys(mocks).forEach(key => {
            originals[key] = window[key];
            window[key] = mocks[key];
        });
        return originals;
    },
    
    restoreGlobals(originals) {
        Object.keys(originals).forEach(key => {
            window[key] = originals[key];
        });
    }
};

// ============================================
// TEST SUITE: applyMissingAnuswara
// ============================================
function testApplyMissingAnuswara() {
    console.log('\n🧪 Testing applyMissingAnuswara...\n');
    
    const tests = [
        {
            name: 'Replace ನ್ with ಂ',
            input: 'ಬುಲಿಪುನ್ಡು',
            cursorPos: 5,
            expected: 'ಬುಲಿಪುಂಡು',
            expectedCursor: 6
        },
        {
            name: 'Replace ನ್ with ಂ with multiple words',
            input: 'ಜೆತ್ ಡ್  ಬುಲಿಪುನ್ಡು',
            cursorPos: 4,
            expected: 'ಜೆತ್ಂ ಡ್  ಬುಲಿಪುನ್ಡು',
            expectedCursor: 5
        },
        {
            name: 'Insert ಂ when no ನ್',
            input: 'ಆಡು',
            cursorPos: 1,
            expected: 'ಆಂಡು',
            expectedCursor: 2
        },
        {
            name: 'Alert when cursor at position 0',
            input: 'ನ್ನು',
            cursorPos: 0,
            shouldAlert: true
        }
    ];
    
    tests.forEach(test => {
        runSingleTest_applyMissingAnuswara(test);
    });
}

function runSingleTest_applyMissingAnuswara(test) {
    let alertCalled = false;
    const mockKannadaInput = MockHelpers.createMockTextArea(test.input, test.cursorPos);
    
    // Store originals
    const originalKannadaInput = window.kannadaInput;
    const originalAlert = window.alert;
    const originalConvert = window.convertAndDisplay;
    const originalToast = window.showToast;
    
    // Set mocks BEFORE calling the function
    window.kannadaInput = mockKannadaInput;
    window.tuluDisplay = MockHelpers.createMockTextArea('', 0); 
    window.alert = () => { alertCalled = true; };
    window.convertAndDisplay = () => {};
    window.showToast = () => {};
    
    try {
        applyMissingAnuswara();        
        if (test.shouldAlert) {
            TestRunner.assert(
                alertCalled,
                test.name,
                'Expected alert to be called'
            );
        } else {
            const outputMatch = mockKannadaInput.value === test.expected;
            const cursorMatch = mockKannadaInput.selectionStart === test.expectedCursor;
            
            console.log(`  Input:    "${test.input}" (cursor: ${test.cursorPos})`);
            console.log(`  Expected: "${test.expected}" (cursor: ${test.expectedCursor})`);
            console.log(`  Actual:   "${mockKannadaInput.value}" (cursor: ${mockKannadaInput.selectionStart})`);
            
            TestRunner.assert(
                outputMatch && cursorMatch,
                test.name,
                `Output: ${mockKannadaInput.value}, Cursor: ${mockKannadaInput.selectionStart}`
            );
        }
    } catch (error) {
        TestRunner.assert(false, test.name, error.message);
    } finally {
        // Restore originals
        window.kannadaInput = originalKannadaInput;
        window.alert = originalAlert;
        window.convertAndDisplay = originalConvert;
        window.showToast = originalToast;
    }
}

// ============================================
// TEST SUITE: applySpecialChar (placeholder)
// ============================================
function testApplySpecialChar() {
    console.log('\n🧪 Testing applySpecialChar...\n');
    
    const tests = [
        {
            name: 'Convert eA to oA',
            input: 'teAst',
            cursorPos: 4,
            expected: 'toAst',
            expectedCursor: 4
        },
        // Add more tests
    ];
    
    tests.forEach(test => {
        runSingleTest_applySpecialChar(test);
    });
}

function runSingleTest_applySpecialChar(test) {
    // Similar structure to applyMissingAnuswara tests
    console.log('⚠️ Test not implemented yet');
}

// ============================================
// RUN ALL TESTS
// ============================================
function runAllTests() {
    console.clear();
    console.log('🚀 Running all tests for appConverter.js\n');
    
    TestRunner.reset();
    
    testApplyMissingAnuswara();
    testApplySpecialChar();
    // Add more test suites here as you write them
    
    TestRunner.printSummary();
}

// Run tests
runAllTests();