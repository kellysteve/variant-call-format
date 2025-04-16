from flask import Flask, render_template, request, jsonify
import gzip
import io

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/upload', methods=['POST'])
def upload_vcf():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    try:
        # Handle both regular and gzipped VCF
        if file.filename.endswith('.gz'):
            with gzip.open(file, 'rt') as f:
                content = f.read()
        else:
            content = file.read().decode('utf-8')
        
        # Simple parsing - for production use PyVCF
        lines = content.split('\n')
        metadata = [line for line in lines if line.startswith('##')]
        variants = [line.split('\t') for line in lines if not line.startswith('#') and line.strip()]
        
        return jsonify({
            'metadata': metadata[:10],  # First 10 metadata lines
            'variant_count': len(variants),
            'sample_variants': variants[:100]  # First 100 variants
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
