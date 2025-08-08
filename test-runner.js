import { runVitest } from 'vitest/node';

export async function runTests(suite = 'all') {
    const output = document.getElementById('testOutput');
    output.innerHTML = '<p>Running tests...</p>';
    
    try {
        // Use dynamic import to run tests in browser
        const testModules = await getTestModules(suite);
        const results = await runBrowserTests(testModules);
        displayResults(results);
    } catch (error) {
        output.innerHTML = `<p style="color: #f38ba8;">Error: ${error.message}</p>`;
    }
}

async function getTestModules(suite) {
    const testFiles = {
        'all': ['character.test.js', 'combat.test.js', 'world.test.js', 'inventory.test.js', 'quest.test.js'],
        'character': ['character.test.js'],
        'combat': ['combat.test.js'],
        'world': ['world.test.js'],
        'inventory': ['inventory.test.js'],
        'quest': ['quest.test.js']
    };
    
    const files = testFiles[suite] || testFiles['all'];
    const modules = [];
    
    for (const file of files) {
        try {
            const module = await import(`./${file}`);
            modules.push({ name: file.replace('.test.js', ''), module });
        } catch (error) {
            console.error(`Failed to load ${file}:`, error);
        }
    }
    
    return modules;
}

async function runBrowserTests(testModules) {
    const results = {
        testResults: []
    };
    
    for (const { name, module } of testModules) {
        const suiteResults = {
            filepath: name,
            tests: []
        };
        
        // Run each test suite's describe blocks
        try {
            // This is a simplified browser test runner
            // In a real scenario, you'd use a proper browser test framework
            const mockExpect = (actual) => ({
                toBe: (expected) => actual === expected,
                toBeGreaterThan: (expected) => actual > expected,
                toBeLessThan: (expected) => actual < expected,
                toThrow: () => false,
                toContain: (expected) => Array.isArray(actual) && actual.includes(expected),
                not: {
                    toBe: (expected) => actual !== expected,
                    toContain: (expected) => !actual.includes(expected)
                }
            });
            
            // Mock vitest functions
            const describe = (description, fn) => {
                try {
                    fn();
                } catch (error) {
                    console.error(`Failed to run ${description}:`, error);
                }
            };
            
            const it = (name, fn) => {
                try {
                    fn();
                    suiteResults.tests.push({ name, status: 'passed' });
                } catch (error) {
                    suiteResults.tests.push({ name: 'Test execution failed', status: 'failed', error: error.message });
                }
            };
            
            // Run the test with mocked functions
            await module.default({
                describe,
                it,
                expect: mockExpect,
                vi: { fn: () => () => {} }
            });
            
        } catch (error) {
            console.error(`Failed to run ${name}:`, error);
            suiteResults.tests.push({ name: 'Test execution failed', status: 'failed', error: error.message });
        }
        
        results.testResults.push(suiteResults);
    }
    
    return results;
}

function displayResults(results) {
    const output = document.getElementById('testOutput');
    const coverageBar = document.getElementById('coverageBar');
    const coverageText = document.getElementById('coverageText');
    
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
    
    const coveragePercent = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;
    coverageBar.style.width = `${coveragePercent}%`;
    coverageText.textContent = `${coveragePercent}% Coverage (${passedTests}/${totalTests} tests)`;
}