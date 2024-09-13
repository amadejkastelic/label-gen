import React, { useState, useEffect } from 'react';
import { PDFDocument, StandardFonts, PageSizes } from 'pdf-lib';
import { Box, TextField, Button, MenuItem, Select, InputLabel, FormControl, Switch, IconButton, Typography, Container } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Brightness4, Brightness7 } from '@mui/icons-material';

function App() {
  const [startNumber, setStartNumber] = useState(1);
  const [prefix, setPrefix] = useState('');
  const [fontSize, setFontSize] = useState(11);
  const [labelWidth, setLabelWidth] = useState(25.1);
  const [labelHeight, setLabelHeight] = useState(10);
  const [paperSize, setPaperSize] = useState('A4');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedDarkMode = localStorage.getItem('darkMode');
    if (storedDarkMode !== null) {
      setDarkMode(storedDarkMode === 'true');
    } else {
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDarkMode);
    }
  }, []);

  const marginLeft = 24.094 + 8;
  const marginTop = 38.268 + 5;

  const generatePDF = async () => {
    const doc = await PDFDocument.create();
    const font = await doc.embedFont(StandardFonts.TimesRoman);
    const page = doc.addPage(PageSizes[paperSize]);

    const { width, height } = page.getSize();

    const labelWidthPt = (labelWidth / 10) * 28.346;
    const labelHeightPt = (labelHeight / 10) * 28.346;

    const cols = Math.floor((width - marginLeft) / labelWidthPt);
    const rows = Math.floor((height - marginTop) / labelHeightPt) - 1;
    const numCells = cols * rows;

    const start = parseInt(startNumber, 10);

    let x = marginLeft;
    let y = marginTop;
    for (let i = 0; i < numCells; i++) {
      page.drawText(`${prefix}-${(start + i).toString().padStart(5, '0')}`, {
        x: x,
        y: height - (y + labelHeightPt),
        size: fontSize,
        font: font,
      });
      x += labelWidthPt + 5.5;

      if (x + labelWidthPt > width - marginLeft) {
        x = marginLeft;
        y += labelHeightPt;
      }
    }

    const blob = new Blob([await doc.save()], { type: 'application/pdf' });
    window.open(URL.createObjectURL(blob));
  };

  // Create the theme with dynamic switching based on darkMode state
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          width: '100vw',
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Container maxWidth="sm">
          <Box sx={{ padding: 4, textAlign: 'center' }}>
            <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
              <IconButton color="inherit" onClick={() => {
                    setDarkMode(!darkMode);
                    localStorage.setItem('darkMode', !darkMode);
                  }}>
                {darkMode ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
              <Typography variant="body1" sx={{ ml: 1 }}>
                Dark Mode
              </Typography>
              <Switch
                checked={darkMode}
                onChange={() => {
                    setDarkMode(!darkMode);
                    localStorage.setItem('darkMode', !darkMode);
                  }
                }
                inputProps={{ 'aria-label': 'toggle dark mode' }}
              />
            </Box>
            <Typography variant="h4" mb={4}>
              Generate Labels
            </Typography>

            <FormControl fullWidth sx={{ marginBottom: 2 }}>
              <InputLabel>Paper Size</InputLabel>
              <Select
                value={paperSize}
                onChange={(e) => setPaperSize(e.target.value)}
                label="Paper Size"
              >
                {Object.keys(PageSizes).map((pageSize) => (
                  <MenuItem key={pageSize} value={pageSize}>
                    {pageSize}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Font Size"
              type="number"
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              sx={{ marginBottom: 2 }}
            />

            <TextField
              fullWidth
              label="Label Width (mm)"
              type="number"
              value={labelWidth}
              onChange={(e) => setLabelWidth(e.target.value)}
              sx={{ marginBottom: 2 }}
            />

            <TextField
              fullWidth
              label="Label Height (mm)"
              type="number"
              value={labelHeight}
              onChange={(e) => setLabelHeight(e.target.value)}
              sx={{ marginBottom: 2 }}
            />

            <TextField
              fullWidth
              label="Prefix"
              type="text"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              sx={{ marginBottom: 2 }}
            />

            <TextField
              fullWidth
              label="Start Number"
              type="number"
              value={startNumber}
              onChange={(e) => setStartNumber(e.target.value)}
              sx={{ marginBottom: 2 }}
            />

            <Button variant="contained" color="primary" onClick={generatePDF}>
              Generate PDF
            </Button>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
