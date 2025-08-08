// Browser-compatible test runner - no Node.js dependencies
export async function runTests(suite = 'all') {
    const output = document.getElementById('testResults');
    if (!output) {
        console.error('Test results element not found');
        return;
    }
    
    output.innerHTML = '<p>Running tests...</p>';
    
    try {
        const results = await runBrowserTests(suite);
        displayResults(results);
    } catch (error) {
        const output = document.getElementById('testResults');
        if (output) {
            output.innerHTML = `<p style="color: #e74c3c;">Error: ${error.message}</p>`;
        }
    }
}

async function runBrowserTests(suite) {
    const testFiles = {
        'all': ['character.test.js', 'combat.test.js', 'world.test.js', 'inventory.test.js', 'quest.test.js'],
        'character': ['character.test.js'],
        'combat': ['combat.test.js'],
        'world': ['world.test.js'],
        'inventory': ['inventory.test.js'],
        'quest': ['quest.test.js']
    };
    
    const files = testFiles[suite] || testFiles['all'];
    const results = { testResults: [] };
    
    for (const file of files) {
        const suiteResults = {
            filepath: file.replace('.test.js', ''),
            tests: []
        };
        
        try {
            // Create mock testing environment
            const testCases = [];
            const mockDescribe = (description, fn) => {
                try {
                    const originalDescribe = window.describe;
                    window.describe = mockDescribe;
                    fn();
                    window.describe = originalDescribe;
                } catch (error) {
                    console.error(`Failed to run describe block: ${error}`);
                }
            };
            
            const mockIt = (name, testFn) => {
                try {
                    testFn();
                    suiteResults.tests.push({
                        name,
                        status: 'passed'
                    });
                } catch (error) {
                    suiteResults.tests.push({
                        name,
                        status: 'failed',
                        error: error.message
                    });
                }
            };
            
            const mockExpect = (actual) => ({
                toBe: (expected) => {
                    if (actual !== expected) throw new Error(`Expected ${expected}, got ${actual}`);
                },
                toBeGreaterThan: (expected) => {
                    if (!(actual > expected)) throw new Error(`Expected ${actual} to be greater than ${expected}`);
                },
                toBeLessThan: (expected) => {
                    if (!(actual < expected)) throw new Error(`Expected ${actual} to be less than ${expected}`);
                },
                toThrow: (message) => {
                    let threw = false;
                    let errorMessage = '';
                    try {
                        actual();
                    } catch (e) {
                        threw = true;
                        errorMessage = e.message;
                    }
                    if (!threw) throw new Error('Expected function to throw');
                    if (message && !errorMessage.includes(message)) {
                        throw new Error(`Expected error message to contain "${message}", got "${errorMessage}"`);
                    }
                },
                toContain: (expected) => {
                    if (!Array.isArray(actual) || !actual.includes(expected)) {
                        throw new Error(`Expected array to contain ${expected}`);
                    }
                },
                toEqual: (expected) => {
                    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
                        throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
                    }
                },
                not: {
                    toBe: (expected) => {
                        if (actual === expected) throw new Error(`Expected ${actual} not to be ${expected}`);
                    },
                    toContain: (expected) => {
                        if (Array.isArray(actual) && actual.includes(expected)) {
                            throw new Error(`Expected array not to contain ${expected}`);
                        }
                    },
                    toEqual: (expected) => {
                        if (JSON.stringify(actual) === JSON.stringify(expected)) {
                            throw new Error(`Expected ${JSON.stringify(actual)} not to equal ${JSON.stringify(expected)}`);
                        }
                    }
                }
            });
            
            // Set up global test functions
            const originalDescribe = window.describe;
            const originalIt = window.it;
            const originalExpect = window.expect;
            
            window.describe = mockDescribe;
            window.it = mockIt;
            window.expect = mockExpect;
            
            // Import and run the test
            try {
                await import(`./${file}`);
            } finally {
                // Restore original functions
                window.describe = originalDescribe;
                window.it = originalIt;
                window.expect = originalExpect;
            }
            
        } catch (error) {
            suiteResults.tests.push({
                name: 'Test file execution failed',
                status: 'failed',
                error: error.message
            });
        }
        
        results.testResults.push(suiteResults);
    }
    
    return results;
}

function displayResults(results) {
    const output = document.getElementById('testResults');
    const coverageBar = document.getElementById('coverageBar');
    const coverageText = document.getElementById('coverageText');
    
    if (!output) return;
    
    if (!results || !results.testResults) {
        output.innerHTML = '<p>No test results available</p>';
        return;
    }
    
    let totalTests = 0;
    let passedTests = 0;
    
    let html = '';
    
    for (const suite of results.testResults) {
        const suiteName = suite.filepath;
        html += `<div class="test-suite">
            <h3>${suiteName}</h3>`;
        
        for (const test of suite.tests || []) {
            totalTests++;
            if (test.status === 'passed') passedTests++;
            
            const statusClass = test.status === 'passed' ? 'status-pass' : 'status-fail';
            const statusText = test.status === 'passed' ? 'PASS' : 'FAIL';
            
            html += `
                <div class="test-case">
                    <span>${test.name}</span>
                    <span class="test-status ${statusClass}">${statusText}</span>
                </div>`;
        }
        
        html += '</div>';
    }
    
    output.innerHTML = html || '<p>No tests found</p>';
    
    if (coverageBar && coverageText) {
        const coveragePercent = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;
        coverageBar.style.width = `${coveragePercent}%`;
        coverageText.textContent = `${passedTests}/${totalTests} tests (${coveragePercent}%)`;
    }
}

// Set up global test functions if they don't exist
if (!window.describe) {
    window.describe = () => {};
    window.it = () => {};
    window.expect = () => ({});
}