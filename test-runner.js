import { runVitest } from 'vitest/node';

export async function runTests(suite = 'all') {
    const output = document.getElementById('testOutput');
    output.innerHTML = '<p>Running tests...</p>';
    
    try {
        const testResults = await runVitest({
            include: suite === 'all' ? ['**/*.test.js'] : [`**/${suite}.test.js`],
            watch: false,
            ui: false,
            run: true
        });
        
        displayResults(testResults);
    } catch (error) {
        output.innerHTML = `<p style="color: #f38ba8;">Error: ${error.message}</p>`;
    }
}

function displayResults(results) {
    const output = document.getElementById('testOutput');
    const coverageBar = document.getElementById('coverageBar');
    const coverageText = document.getElementById('coverageText');
    
    if (!results) {
        output.innerHTML = '<p>No test results available</p>';
        return;
    }
    
    const testSuites = groupTestsBySuite(results.testResults);
    let totalTests = 0;
    let passedTests = 0;
    
    let html = '';
    
    for (const [suiteName, tests] of Object.entries(testSuites)) {
        html += `<div class="test-suite">
            <h3>${suiteName}</h3>`;
        
        tests.forEach(test => {
            totalTests++;
            if (test.status === 'passed') passedTests++;
            
            const statusClass = test.status === 'passed' ? 'status-pass' : 'status-fail';
            const statusText = test.status === 'passed' ? 'PASS' : 'FAIL';
            
            html += `
                <div class="test-case">
                    <span>${test.name}</span>
                    <span class="test-status ${statusClass}">${statusText}</span>
                </div>`;
        });
        
        html += '</div>';
    }
    
    output.innerHTML = html;
    
    const coveragePercent = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;
    coverageBar.style.width = `${coveragePercent}%`;
    coverageText.textContent = `${coveragePercent}% Coverage (${passedTests}/${totalTests} tests)`;
}

function groupTestsBySuite(testResults) {
    const suites = {};
    
    testResults?.forEach(result => {
        const fileName = result.filepath.split('/').pop().replace('.test.js', '');
        suites[fileName] = suites[fileName] || [];
        
        result.tests?.forEach(test => {
            suites[fileName].push({
                name: test.name,
                status: test.status
            });
        });
    });
    
    return suites;
}

