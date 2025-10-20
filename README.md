# QR Code Generator

A lightweight, client-side QR Code Generator built with plain HTML, CSS, and JavaScript. No build step or server required—just open the page and generate QR codes instantly.

## Features
- Generate QR codes from any text or URL
- Instant preview in the browser
- Download/save the QR code image (PNG/SVG, depending on implementation)
- Mobile-friendly layout

## Getting Started

### Run locally (no install required)
1. Download or clone this project.
2. Open `index.html` in your browser (double-click it on Windows).

### Optional: Serve with a local web server
Some browsers restrict file URLs. If you prefer a local server:
- Python 3: `python -m http.server 5500` then visit `http://localhost:5500/`
- VS Code: Use the "Live Server" extension to open `index.html`

## Usage
1. Open the app.
2. Enter the text or URL you want to encode.
3. Click the Generate button.
4. Use the Download button (if available) to save the QR image.

## Project Structure
```
QR code generator/
├─ index.html    # App markup and layout
├─ style.css     # App styles
└─ script.js     # QR generation logic and UI interactions
```

## Customization
- Update colors, spacing, and typography in `style.css`.
- Adjust default values, input validation, and QR options in `script.js`.
- Modify layout or add new UI elements in `index.html`.

## Tech Stack
- HTML5
- CSS3
- Vanilla JavaScript

## Browser Support
Works on modern browsers (Chromium, Firefox, Safari, Edge). If something doesn’t work, try serving via a local server as described above.

## License
MIT License. You’re free to use, modify, and distribute with attribution.
