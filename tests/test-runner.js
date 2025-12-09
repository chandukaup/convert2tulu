function assertEqual(actual, expected, message) {
    if (actual !== expected) {
        throw new Error(
            `${message}\nExpected: ${expected}\nActual:   ${actual}`
        );
    }
}

function runConvertTests(conversionFunction, expectedKey, namePrefix) {
    const results = [];
    for (const t of test_data) {
        try {
            const actual = conversionFunction(t.input);
            assertEqual(actual, t.expected[expectedKey], t.name);
            results.push({ name: `${namePrefix}: ${t.name}`, ok: true, test_data: t.input });
        } catch (e) {
            results.push({ name: `${namePrefix}: ${t.name}`, ok: false, test_data: t.input, error: e.message });
        }
    }
    return results;
}

function renderResults(results, resultsDiv) {
    const container = document.getElementById(resultsDiv);
    const okCount = results.filter(r => r.ok).length;
    const total = results.length;

    const summary = document.createElement("h2");
    summary.textContent = `Passed ${okCount}/${total}`;
    container.appendChild(summary);

    // Create a table for better visibility
    const table = document.createElement("table");
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";

    const headerRow = document.createElement("tr");
    const headers = ['Test', 'Input', 'Status', 'Error'];
    headers.forEach(headerText => {
        const th = document.createElement("th");
        th.textContent = headerText;
        th.style.border = "1px solid black";
        th.style.padding = "5px";
        th.style.textAlign = "left";
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    results.forEach(r => {
        const row = document.createElement("tr");

        const testNameCell = document.createElement("td");
        testNameCell.textContent = r.name;
        testNameCell.style.border = "1px solid black";
        testNameCell.style.padding = "5px";
        row.appendChild(testNameCell);

        const inputCell = document.createElement("td");
        inputCell.textContent = r.test_data;
        inputCell.style.border = "1px solid black";
        inputCell.style.padding = "5px";
        row.appendChild(inputCell);

        const statusCell = document.createElement("td");
        statusCell.textContent = r.ok ? "✅ Passed" : "❌ Failed";
        statusCell.style.border = "1px solid black";
        statusCell.style.padding = "5px";
        row.appendChild(statusCell);

        const errorCell = document.createElement("td");
        errorCell.textContent = r.error || "No Error";
        errorCell.style.border = "1px solid black";
        errorCell.style.padding = "5px";
        row.appendChild(errorCell);

        table.appendChild(row);
    });

    container.appendChild(table);
}

window.addEventListener("load", () => {
    const tulusriResults = runConvertTests(convert, 'tulusri', "Tulusri");
    renderResults(tulusriResults, "tulusri-results");

    const baravuResults = runConvertTests(convertKannadaToASCII, 'baravu', "Baravu");
    renderResults(baravuResults, "baravu-results");
});
