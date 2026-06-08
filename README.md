# RupeeX — Smart Currency Converter 🇮🇳
live demo;https://nithin1267.github.io/CURRENCY-CONVERTER/
> A beautifully crafted, India-first currency converter powered by AI — built with pure HTML, CSS & JavaScript.

![RupeeX Banner](https://img.shields.io/badge/RupeeX-Currency%20Converter-FF9933?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHRleHQgeT0iMjAiIGZvbnQtc2l6ZT0iMjAiPuKCuTwvdGV4dD48L3N2Zz4=)
![Made in India](https://img.shields.io/badge/Made%20in-India%20🇮🇳-138808?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-0033A0?style=for-the-badge)
![No Dependencies](https://img.shields.io/badge/Dependencies-Zero-FFB700?style=for-the-badge)

---

## ✨ Features

- **🔄 Single Conversion** — Convert any amount between 22 world currencies instantly
- **📊 Multi Conversion** — Convert one amount to 10 currencies simultaneously
- **🕐 History** — Last 20 conversions saved locally with timestamps
- **⚡ Quick Pairs** — One-click India-focused & global currency pairs
- **🔁 Swap** — Instantly reverse the conversion direction
- **📋 Copy** — Copy results to clipboard with one click
- **🎨 Animated Background** — Live floating ₹ banknotes and coins on canvas
- **📱 Responsive** — Works beautifully on mobile and desktop

---

## 🛠 Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Markup     | HTML5 (semantic)                    |
| Styling    | CSS3 (custom properties, animations)|
| Logic      | Vanilla JavaScript (ES2020+)        |
| Rates      | frankfurter.app (free, no key)      |
| Fonts      | Sora + Noto Serif Devanagari        |
| Storage    | localStorage (conversion history)   |

**Zero external dependencies. Zero build tools. Just open and run.**

---

## 📁 Project Structure

```
rupeex/
├── index.html   # Markup & layout
├── style.css    # All styles, variables, animations
└── app.js       # Data, logic, Claude API, canvas effects
```

---

## 🚀 Getting Started

### Option 1 — Open directly
Just download the three files and open `index.html` in any modern browser.

### Option 2 — Clone & serve
```bash
git clone https://github.com/Nithin1267/rupeex.git
cd rupeex

# Any static server works, e.g.:
npx serve .
# or
python -m http.server 8080
```

Then visit `http://localhost:8080`

---

## 🌍 Supported Currencies

| Flag | Code | Currency              |
|------|------|-----------------------|
| 🇮🇳  | INR  | Indian Rupee          |
| 🇺🇸  | USD  | US Dollar             |
| 🇪🇺  | EUR  | Euro                  |
| 🇬🇧  | GBP  | British Pound         |
| 🇯🇵  | JPY  | Japanese Yen          |
| 🇦🇪  | AED  | UAE Dirham            |
| 🇸🇦  | SAR  | Saudi Riyal           |
| 🇸🇬  | SGD  | Singapore Dollar      |
| 🇨🇦  | CAD  | Canadian Dollar       |
| 🇦🇺  | AUD  | Australian Dollar     |
| 🇨🇭  | CHF  | Swiss Franc           |
| 🇨🇳  | CNY  | Chinese Yuan          |
| 🇲🇽  | MXN  | Mexican Peso          |
| 🇧🇷  | BRL  | Brazilian Real        |
| 🇰🇷  | KRW  | South Korean Won      |
| 🇳🇴  | NOK  | Norwegian Krone       |
| 🇸🇪  | SEK  | Swedish Krona         |
| 🇭🇰  | HKD  | Hong Kong Dollar      |
| 🇵🇰  | PKR  | Pakistani Rupee       |
| 🇧🇩  | BDT  | Bangladeshi Taka      |
| 🇳🇵  | NPR  | Nepalese Rupee        |
| 🇱🇰  | LKR  | Sri Lankan Rupee      |

---

## ⚙️ How It Works

RupeeX uses the **[frankfurter.app](https://www.frankfurter.app)** API — a free, open-source exchange rate service backed by the European Central Bank. No API key needed, no sign-up.

```
User enters amount + currencies
        ↓
GET https://api.frankfurter.app/latest?amount=100&from=USD&to=INR
        ↓
Returns live JSON { rates: { INR: 8350.00 } }
        ↓
Result displayed + saved to localStorage
```

---

## 🎨 Design Highlights

- **India-themed** colour palette — saffron `#FF9933`, India green `#138808`, navy `#000080`
- **Tricolour stripe** fixed at top of page
- **Glassmorphism** card with `backdrop-filter: blur`
- **Canvas animation** — procedurally drawn ₹500, ₹2000, ₹100, ₹50, ₹10 notes + gold/silver coins floating upward
- **CSS-only shimmer** loading effect on buttons

---

## 📌 Roadmap

- [ ] Live exchange rates via a free forex API
- [ ] PWA support (installable on mobile)
- [ ] Dark / Light theme toggle
- [ ] Currency trend sparklines
- [ ] Share conversion as image

---

## 👨‍💻 Author

**Nithin Kumar**
- GitHub: [@Nithin1267](https://github.com/Nithin1267)

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use, modify, and distribute.

---

<div align="center">
  Made with ❤️ in India &nbsp;·&nbsp; <strong>RupeeX</strong>
</div>
