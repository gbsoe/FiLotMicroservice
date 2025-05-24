import fs from 'fs';

// Read the markdown file and convert to a simple HTML format
const markdownContent = fs.readFileSync('CLIENT_INTEGRATION_GUIDE.md', 'utf8');

// Simple markdown to HTML conversion
const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>FiLotMicroservice Client Integration Guide</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            color: #333;
        }
        h1 { color: #1e40af; border-bottom: 3px solid #1e40af; padding-bottom: 10px; }
        h2 { color: #1e40af; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; margin-top: 30px; }
        h3 { color: #374151; margin-top: 25px; }
        code { background-color: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-family: monospace; }
        pre { background-color: #f8fafc; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; overflow-x: auto; }
        table { border-collapse: collapse; width: 100%; margin: 15px 0; }
        th, td { border: 1px solid #e5e7eb; padding: 8px 12px; text-align: left; }
        th { background-color: #f3f4f6; font-weight: 600; }
        .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #1e40af; padding-bottom: 20px; }
        .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; }
    </style>
</head>
<body>
    <div class="header">
        <h1>FiLotMicroservice</h1>
        <p><strong>Client Integration Guide</strong></p>
        <p>Precision Investing API Documentation</p>
        <p>Version 1.0.0 | Production Ready</p>
    </div>
    <div>
${markdownContent
  .replace(/^### (.*$)/gim, '<h3>$1</h3>')
  .replace(/^## (.*$)/gim, '<h2>$1</h2>')
  .replace(/^# (.*$)/gim, '<h1>$1</h1>')
  .replace(/```[\s\S]*?```/g, (match) => `<pre><code>${match.slice(3, -3)}</code></pre>`)
  .replace(/`([^`]+)`/g, '<code>$1</code>')
  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  .replace(/\*([^*]+)\*/g, '<em>$1</em>')
  .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
  .replace(/\n\n/g, '</p><p>')
  .replace(/\n/g, '<br>')
  .replace(/^/, '<p>')
  .replace(/$/, '</p>')}
    </div>
    <div class="footer">
        <p>FiLotMicroservice v1.0.0 | Precision Investing API | Authentic Raydium SDK v2 Integration</p>
        <p>Generated on ${new Date().toLocaleDateString()}</p>
        <p>Contact: support@filot.io | Telegram: @Fi_lotbot | X: @crazyrichla</p>
    </div>
</body>
</html>`;

// Save as HTML file that can be printed to PDF
fs.writeFileSync('client/public/FiLotMicroservice_Integration_Guide.html', htmlContent);
console.log('HTML file generated: client/public/FiLotMicroservice_Integration_Guide.html');
console.log('You can open this file in a browser and use Print > Save as PDF to create a PDF version.');