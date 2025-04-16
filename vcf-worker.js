self.onmessage = function(e) {
    const content = e.data;
    const lines = content.split('\n');
    let metadata = [];
    let variants = [];
    
    for (const line of lines) {
        if (line.startsWith('##')) {
            metadata.push(line);
        } else if (!line.startsWith('#') && line.trim() !== '') {
            variants.push(line.split('\t'));
        }
    }
    
    self.postMessage({
        metadata: metadata,
        variants: variants
    });
};
