import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import { PDFDocument, StandardFonts, PageSizes, degrees } from 'pdf-lib'

function App() {
  const [startNumber, setStartNumber] = useState(1);
  const [prefix, setPrefix] = useState('');
  const [fontSize, setFontSize] = useState(11);
  const [labelWidth, setLabelWidth] = useState(25.1);
  const [labelHeight, setLabelHeight] = useState(10);
  const [paperSize, setPaperSize] = useState('A4');

  const marginLeft = 24.094 + 8;
  const marginTop = 38.268 + 5;

  const generatePDF = async () => {
    const doc = await PDFDocument.create();
    const font = await doc.embedFont(StandardFonts.TimesRoman);
    const page = doc.addPage(PageSizes[paperSize]);

    const { width, height } = page.getSize();

    const labelWidthPt = (labelWidth / 10) * 28.346
    const labelHeightPt = (labelHeight / 10) * 28.346
    
    const cols = Math.floor((width - marginLeft) / labelWidthPt);
    const rows = Math.floor((height - marginTop) / labelHeightPt) - 1;
    const numCells = cols * rows;

    const start = parseInt(startNumber, 10);

    let x = marginLeft;
    let y = marginTop;
    let line = 0;
    for (let i=0; i < numCells; i++) {
      page.drawText(`${prefix}-${(start + i).toString().padStart(5, '0')}`, {
        x: x,
        y: height - (y+labelHeightPt),
        size: fontSize,
        font: font,
      });
      x += labelWidthPt + 5.5;

      if (x + labelWidthPt > width - marginLeft) {
        x = marginLeft;
        y += labelHeightPt;
        line++;
      }
    }

    const blob = new Blob([await doc.save()], {type: 'application/pdf'});
    window.open(URL.createObjectURL(blob));
  };

  return (
    <div className="App">
      <h1>Generate Labels</h1>
      <div>
        <label>
          Paper Size: 
          <select value={paperSize} onChange={(e) => setPaperSize(e.target.value)}>
            {Object.keys(PageSizes).map((pageSize) => <option value={pageSize}>{pageSize}</option>)}
          </select>
        </label>
      </div>
      <div>
        <label>
          Font Size: 
          <input type="number" value={fontSize} onChange={(e) => setFontSize(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Label Width:
          <input type="number" value={labelWidth} onChange={(e) => setLabelWidth(e.target.value)} />
        </label>
        <label>
          Label Height:
          <input type="number" value={labelHeight} onChange={(e) => setLabelHeight(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Prefix: 
          <input type="text" value={prefix} onChange={(e) => setPrefix(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Start Number: 
          <input type="number" value={startNumber} onChange={(e) => setStartNumber(e.target.value)} />
        </label>
      </div>
      <button onClick={generatePDF}>Generate PDF</button>
    </div>
  );
}

export default App;
