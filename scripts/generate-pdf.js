import puppeteer from 'puppeteer';
import { promises as fs } from 'fs';
import path from 'path';

async function generatePDF() {
  try {
    // Read the markdown file
    const markdownContent = await fs.readFile('CLIENT_INTEGRATION_GUIDE.md', 'utf8');
    
    // Convert markdown to HTML with styling
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
        h1 {
            color: #1e40af;
            border-bottom: 3px solid #1e40af;
            padding-bottom: 10px;
            page-break-before: always;
        }
        h1:first-of-type {
            page-break-before: auto;
        }
        h2 {
            color: #1e40af;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 5px;
            margin-top: 30px;
        }
        h3 {
            color: #374151;
            margin-top: 25px;
        }
        code {
            background-color: #f3f4f6;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 0.9em;
        }
        pre {
            background-color: #f8fafc;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 16px;
            overflow-x: auto;
            margin: 15px 0;
        }
        pre code {
            background: none;
            padding: 0;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 15px 0;
        }
        th, td {
            border: 1px solid #e5e7eb;
            padding: 8px 12px;
            text-align: left;
        }
        th {
            background-color: #f3f4f6;
            font-weight: 600;
        }
        blockquote {
            border-left: 4px solid #1e40af;
            margin: 15px 0;
            padding-left: 20px;
            color: #6b7280;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 2px solid #1e40af;
            padding-bottom: 20px;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 0.9em;
        }
        @media print {
            body { font-size: 12px; }
            h1 { font-size: 1.8em; }
            h2 { font-size: 1.4em; }
            h3 { font-size: 1.2em; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>FiLotMicroservice</h1>
        <p><strong>Client Integration Guide</strong></p>
        <p>Precision Investing API Documentation</p>
        <p>Version 1.0.0 | Production Ready</p>
    </div>
    ${convertMarkdownToHTML(markdownContent)}
    <div class="footer">
        <p>FiLotMicroservice v1.0.0 | Precision Investing API | Authentic Raydium SDK v2 Integration</p>
        <p>Generated on ${new Date().toLocaleDateString()}</p>
        <p>Contact: support@filot.io | Telegram: @Fi_lotbot | X: @crazyrichla</p>
    </div>
</body>
</html>`;

    // Launch puppeteer and generate PDF
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    // Generate PDF
    await page.pdf({
      path: 'client/public/FiLotMicroservice_Integration_Guide.pdf',
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm'
      }
    });

    await browser.close();
    console.log('PDF generated successfully: client/public/FiLotMicroservice_Integration_Guide.pdf');
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    process.exit(1);
  }
}

function convertMarkdownToHTML(markdown) {
  return markdown
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    
    // Code blocks
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    
    // Bold and italic
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    
    // Line breaks and paragraphs
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>')
    
    // Tables (basic support)
    .replace(/\|([^|]+)\|/g, (match, content) => {
      const cells = content.split('|').map(cell => cell.trim());
      return '<tr>' + cells.map(cell => `<td>${cell}</td>`).join('') + '</tr>';
    });
}

generatePDF();