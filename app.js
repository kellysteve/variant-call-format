document.getElementById('load-btn').addEventListener('click', function() {
    const fileInput = document.getElementById('vcf-file');
    if (fileInput.files.length === 0) {
        alert('Please select a VCF file first');
        return;
    }
    
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const content = e.target.result;
        parseVcfContent(content);
    };
    
    if (file.name.endsWith('.gz')) {
        alert('GZIP support requires additional libraries. Please upload uncompressed VCF.');
    } else {
        reader.readAsText(file);
    }
});

function parseVcfContent(content) {
    const lines = content.split('\n');
    let metadata = [];
    let variants = [];
    let header = [];
    
    for (const line of lines) {
        if (line.startsWith('##')) {
            metadata.push(line);
        } else if (line.startsWith('#CHROM')) {
            header = line.split('\t');
            metadata.push(line);
        } else if (line.trim() !== '') {
            variants.push(line.split('\t'));
        }
    }
    
    displayResults(metadata, header, variants);
}

function displayResults(metadata, header, variants) {
    // Display metadata
    document.getElementById('metadata').innerHTML = 
        `<h3>File Information</h3>
         <p>Metadata lines: ${metadata.length}</p>
         <p>Variants found: ${variants.length}</p>
         <details>
            <summary>Show metadata</summary>
            <pre>${metadata.slice(0, 10).join('\n')}${metadata.length > 10 ? '\n...' : ''}</pre>
         </details>`;
    
    // Display variants in a table
    if (variants.length > 0) {
        let tableHtml = `<h3>Variants</h3><div class="table-container"><table><thead><tr>`;
        
        // Create header
        for (const col of header) {
            tableHtml += `<th>${col.replace('#', '')}</th>`;
        }
        tableHtml += `</tr></thead><tbody>`;
        
        // Add variants
        for (let i = 0; i < Math.min(100, variants.length); i++) {
            tableHtml += '<tr>';
            for (const val of variants[i]) {
                tableHtml += `<td>${val}</td>`;
            }
            tableHtml += '</tr>';
        }
        tableHtml += `</tbody></table></div>`;
        
        if (variants.length > 100) {
            tableHtml += `<p>Showing first 100 of ${variants.length} variants</p>`;
        }
        
        document.getElementById('vcf-content').innerHTML = tableHtml;
    }
              }
