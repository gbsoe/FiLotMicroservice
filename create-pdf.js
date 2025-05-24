import fs from 'fs';
import { execSync } from 'child_process';

// Create a simplified PDF generation using available tools
const markdownContent = fs.readFileSync('CLIENT_INTEGRATION_GUIDE.md', 'utf8');

// Create HTML with better PDF styling
const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>FiLotMicroservice Client Integration Guide</title>
    <style>
        @page {
            margin: 2cm;
            size: A4;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            font-size: 11pt;
        }
        .cover {
            text-align: center;
            page-break-after: always;
            padding-top: 5cm;
        }
        .cover h1 {
            font-size: 2.5em;
            color: #1e40af;
            margin-bottom: 0.5em;
        }
        .cover .subtitle {
            font-size: 1.5em;
            color: #666;
            margin: 1em 0;
        }
        .cover .version {
            font-size: 1.2em;
            margin: 2em 0;
        }
        h1 {
            color: #1e40af;
            border-bottom: 2px solid #1e40af;
            padding-bottom: 0.5em;
            page-break-before: always;
            font-size: 1.8em;
        }
        h1:first-of-type {
            page-break-before: auto;
        }
        h2 {
            color: #1e40af;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 0.3em;
            margin-top: 2em;
            font-size: 1.4em;
        }
        h3 {
            color: #374151;
            margin-top: 1.5em;
            font-size: 1.2em;
        }
        code {
            background-color: #f3f4f6;
            padding: 0.2em 0.4em;
            border-radius: 3px;
            font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
            font-size: 0.9em;
        }
        pre {
            background-color: #f8fafc;
            border: 1px solid #e5e7eb;
            border-radius: 5px;
            padding: 1em;
            overflow-x: auto;
            margin: 1em 0;
            font-size: 0.85em;
            line-height: 1.4;
        }
        pre code {
            background: none;
            padding: 0;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 1em 0;
            font-size: 0.9em;
        }
        th, td {
            border: 1px solid #e5e7eb;
            padding: 0.5em;
            text-align: left;
        }
        th {
            background-color: #f3f4f6;
            font-weight: 600;
        }
        .footer {
            position: fixed;
            bottom: 1cm;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 0.8em;
            color: #666;
        }
        .page-number:after {
            content: counter(page);
        }
        ul, ol {
            padding-left: 2em;
        }
        li {
            margin: 0.3em 0;
        }
        strong {
            color: #1e40af;
        }
        a {
            color: #1e40af;
            text-decoration: underline;
        }
        blockquote {
            border-left: 4px solid #1e40af;
            margin: 1em 0;
            padding-left: 1em;
            color: #666;
            font-style: italic;
        }
    </style>
</head>
<body>
    <div class="cover">
        <h1>FiLotMicroservice</h1>
        <div class="subtitle">Client Integration Guide</div>
        <div class="subtitle">Precision Investing API Documentation</div>
        <div class="version">Version 1.0.0 | Production Ready</div>
        <div style="margin-top: 3em; color: #666;">
            <p>Authentic Raydium SDK v2 Integration</p>
            <p>Complete Developer Documentation</p>
        </div>
        <div style="margin-top: 4em; font-size: 0.9em; color: #999;">
            <p>Generated: ${new Date().toLocaleDateString()}</p>
            <p>Contact: support@filot.io</p>
        </div>
    </div>
    
    <div class="content">
${convertMarkdownToHTML(markdownContent)}
    </div>
    
    <div class="footer">
        <div>FiLotMicroservice v1.0.0 | Precision Investing API | Page <span class="page-number"></span></div>
    </div>
</body>
</html>`;

function convertMarkdownToHTML(markdown) {
    return markdown
        // Remove any remaining emojis
        .replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '')
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
        // Tables
        .replace(/\|(.+)\|\n\|[-\s|]+\|\n((?:\|.+\|\n?)*)/g, (match, header, rows) => {
            const headerCells = header.split('|').map(cell => cell.trim()).filter(cell => cell);
            const headerRow = '<tr>' + headerCells.map(cell => `<th>${cell}</th>`).join('') + '</tr>';
            
            const bodyRows = rows.trim().split('\n').map(row => {
                const cells = row.split('|').map(cell => cell.trim()).filter(cell => cell);
                return '<tr>' + cells.map(cell => `<td>${cell}</td>`).join('') + '</tr>';
            }).join('');
            
            return `<table>${headerRow}${bodyRows}</table>`;
        })
        // Lists
        .replace(/^[\s]*\* (.+)$/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
        .replace(/^[\s]*\d+\. (.+)$/gm, '<li>$1</li>')
        // Paragraphs
        .replace(/\n\n/g, '</p><p>')
        .replace(/^(?!<[h|u|o|t|p])/, '<p>')
        .replace(/(?!>)$/, '</p>')
        // Clean up
        .replace(/<p><\/p>/g, '')
        .replace(/<p>(<[h|u|o|t])/g, '$1')
        .replace(/(<\/[h|u|o|t|d|r]>)<\/p>/g, '$1');
}

// Write the HTML file
fs.writeFileSync('client/public/FiLotMicroservice_Integration_Guide_PDF.html', htmlContent);

console.log('✅ PDF-ready HTML generated: client/public/FiLotMicroservice_Integration_Guide_PDF.html');
console.log('📄 Users can open this file in any browser and use Print > Save as PDF');
console.log('🔗 Direct link: https://filotmicroservice.replit.app/FiLotMicroservice_Integration_Guide_PDF.html');