// ===============================
// RupeeX Currency Converter
// ===============================

const CURRENCIES = [
  { code:"INR", country:"IN", name:"Indian Rupee", symbol:"₹" },
  { code:"USD", country:"US", name:"US Dollar", symbol:"$" },
  { code:"EUR", country:"EU", name:"Euro", symbol:"€" },
  { code:"GBP", country:"GB", name:"British Pound", symbol:"£" },
  { code:"JPY", country:"JP", name:"Japanese Yen", symbol:"¥" },
  { code:"AED", country:"AE", name:"UAE Dirham", symbol:"د.إ" },
  { code:"SAR", country:"SA", name:"Saudi Riyal", symbol:"﷼" },
  { code:"SGD", country:"SG", name:"Singapore Dollar", symbol:"S$" },
  { code:"CAD", country:"CA", name:"Canadian Dollar", symbol:"C$" },
  { code:"AUD", country:"AU", name:"Australian Dollar", symbol:"A$" },
  { code:"CHF", country:"CH", name:"Swiss Franc", symbol:"Fr" },
  { code:"CNY", country:"CN", name:"Chinese Yuan", symbol:"¥" }
];

// Helper: convert country code (e.g. 'IN') to flag emoji
function getFlagEmoji(countryCode){
    if(!countryCode) return '';
    const code = countryCode.toUpperCase();
    return String.fromCodePoint(...[...code].map(c => 0x1F1E6 + c.charCodeAt(0) - 65));
}

// Helper: update a select's background to show the selected country's flag
function updateSelectFlag(select){
    if(!select) return;
    const opt = select.options[select.selectedIndex];
    const flagUrl = opt && opt.dataset && opt.dataset.flag ? opt.dataset.flag : '';

    const arrowGradients = 'linear-gradient(45deg, transparent 50%, rgba(255,255,255,.35) 50%), linear-gradient(135deg, rgba(255,255,255,.35) 50%, transparent 50%)';

    if(flagUrl){
        select.style.backgroundImage = `url(${flagUrl}), ${arrowGradients}`;
        select.style.backgroundPosition = '12px center, calc(100% - 18px) calc(50% - 6px), calc(100% - 12px) calc(50% - 6px)';
        select.style.backgroundSize = '24px 18px, 6px 6px, 6px 6px';
        select.style.paddingLeft = '44px';
    } else {
        // fallback to arrow-only background
        select.style.backgroundImage = arrowGradients;
        select.style.backgroundPosition = 'calc(100% - 18px) calc(50% - 6px), calc(100% - 12px) calc(50% - 6px)';
        select.style.backgroundSize = '6px 6px, 6px 6px';
        select.style.paddingLeft = '';
    }
}

// ===============================
// DOM REFERENCES
// ===============================

const amountInput = document.getElementById("amountInput");
const fromSelect = document.getElementById("fromSelect");
const toSelect = document.getElementById("toSelect");

const convertBtn = document.getElementById("convertBtn");
const swapBtn = document.getElementById("swapBtn");

const resultBox = document.getElementById("resultBox");
const resultAmount = document.getElementById("resultAmount");
const resultMeta = document.getElementById("resultMeta");

const errorBox = document.getElementById("errorBox");

const copyBtn = document.getElementById("copyBtn");

const multiAmount = document.getElementById("multiAmount");
const multiFrom = document.getElementById("multiFrom");
const multiBtn = document.getElementById("multiBtn");
const multiGrid = document.getElementById("multiGrid");

const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");
const themeSelect = document.getElementById("themeSelect");

// ===============================
// HISTORY
// ===============================

let history =
JSON.parse(localStorage.getItem("rupeex_history")) || [];

let lastConverted = null;

// ===============================
// POPULATE SELECTS
// ===============================

function buildOptions(select, defaultCode) {

    select.innerHTML = "";

    CURRENCIES.forEach(currency => {

        const option = document.createElement("option");

        option.value = currency.code;

        // Use emoji flags (img tags inside <option> are not reliably supported)
        option.textContent = `${getFlagEmoji(currency.country)} ${currency.code}`;
        option.title = currency.name;
        option.dataset.flag = `https://flagcdn.com/24x18/${currency.country.toLowerCase()}.png`;

        if (currency.code === defaultCode) {
            option.selected = true;
        }

        select.appendChild(option);
    });

    // set flag for the select after options are added
    updateSelectFlag(select);
}

buildOptions(fromSelect, "USD");
buildOptions(toSelect, "INR");
buildOptions(multiFrom, "USD");

// Quick pair chip lists
const indiaChips = document.getElementById('indiaChips');
const globalChips = document.getElementById('globalChips');

function buildChips(){
    indiaChips.innerHTML = '';
    globalChips.innerHTML = '';

    // Define which quick pairs to show
    const indiaPairs = ['USD','AED','SAR','GBP','EUR'];
    const globalPairs = ['USD','EUR','GBP','JPY','AUD','CAD','CHF','CNY','SGD'];

    indiaPairs.forEach(code => {
        const btn = document.createElement('button');
        btn.className = 'chip india';
        const info = CURRENCIES.find(c => c.code === code);
        btn.textContent = `${getFlagEmoji(info.country)} ${code}`;
        btn.title = info ? info.name : code;
        btn.addEventListener('click', async () => {
            fromSelect.value = 'INR';
            toSelect.value = code;
            await convertBtn.click();
        });
        indiaChips.appendChild(btn);
    });

    globalPairs.forEach(code => {
        const btn = document.createElement('button');
        btn.className = 'chip';
        const info = CURRENCIES.find(c => c.code === code);
        btn.textContent = `${getFlagEmoji(info.country)} ${code}`;
        btn.title = info ? info.name : code;
        btn.addEventListener('click', async () => {
            fromSelect.value = 'USD';
            toSelect.value = code;
            await convertBtn.click();
        });
        globalChips.appendChild(btn);
    });
}

buildChips();

// Theme handling: persist selection and apply CSS data-theme on <html>
function applyTheme(theme){
    if(!theme) return;
    document.documentElement.setAttribute('data-theme', theme);
}

// initialize theme from localStorage (or default to light)
const savedTheme = localStorage.getItem('rupeex_theme') || 'light';
applyTheme(savedTheme);
if(themeSelect){
    themeSelect.value = savedTheme;
    themeSelect.addEventListener('change', (e) => {
        const t = e.target.value;
        applyTheme(t);
        localStorage.setItem('rupeex_theme', t);
    });
}

// User requested: convert to dark now — force dark theme and persist it
applyTheme('dark');
localStorage.setItem('rupeex_theme', 'dark');
if(themeSelect) themeSelect.value = 'dark';

// Update flags when selects change
[fromSelect, toSelect, multiFrom].forEach(s => {
    s.addEventListener('change', () => updateSelectFlag(s));
});

// --- Custom select implementation to show flags in open list ---
function createCustomSelect(native){
    if(!native) return null;

    // hide native visually but keep accessible
    native.style.position = 'absolute';
    native.style.opacity = '0';
    native.style.pointerEvents = 'none';

    const wrapper = document.createElement('div');
    wrapper.className = 'custom-select';

    const trigger = document.createElement('div');
    trigger.className = 'cs-trigger';

    const flag = document.createElement('span');
    flag.className = 'cs-flag';

    const code = document.createElement('div');
    code.className = 'cs-code';

    const arrow = document.createElement('div');
    arrow.className = 'cs-arrow';
    arrow.textContent = '▾';

    trigger.appendChild(flag);
    trigger.appendChild(code);
    trigger.appendChild(arrow);

    const options = document.createElement('div');
    options.className = 'cs-options';

    // populate options from native select
    Array.from(native.options).forEach(opt => {
        const row = document.createElement('div');
        row.className = 'cs-option';

        const f = document.createElement('span');
        f.className = 'cs-flag';
        if(opt.dataset.flag) f.style.backgroundImage = `url(${opt.dataset.flag})`;

        const txt = document.createElement('div');
        txt.innerHTML = opt.textContent;

        row.appendChild(f);
        row.appendChild(txt);

        row.addEventListener('click', () => {
            native.value = opt.value;
            // sync trigger
            updateTrigger();
            native.dispatchEvent(new Event('change'));
            wrapper.classList.remove('cs-open');
        });

        options.appendChild(row);
    });

    function updateTrigger(){
        const sel = native.options[native.selectedIndex];
        code.textContent = sel ? sel.textContent : '';
        if(sel && sel.dataset && sel.dataset.flag){
            flag.style.backgroundImage = `url(${sel.dataset.flag})`;
        } else {
            flag.style.backgroundImage = '';
        }
    }

    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        // close others
        document.querySelectorAll('.custom-select.cs-open').forEach(el => el.classList.remove('cs-open'));
        wrapper.classList.toggle('cs-open');
    });

    // close on outside click
    document.addEventListener('click', () => wrapper.classList.remove('cs-open'));

    wrapper.appendChild(trigger);
    wrapper.appendChild(options);

    // insert wrapper after native
    native.parentNode.insertBefore(wrapper, native.nextSibling);

    // initialize
    updateTrigger();

    // keep native->trigger sync
    native.addEventListener('change', updateTrigger);

    return wrapper;
}

// create custom selects for the three currency selects
[fromSelect, toSelect, multiFrom].forEach(s => createCustomSelect(s));

// ===============================
// TABS
// ===============================

document.querySelectorAll(".tab-btn").forEach(button => {

    button.addEventListener("click", () => {

        document
            .querySelectorAll(".tab-btn")
            .forEach(btn =>
                btn.classList.remove("active"));

        document
            .querySelectorAll(".panel")
            .forEach(panel =>
                panel.classList.remove("active"));

        button.classList.add("active");

        document
            .getElementById(
                "panel-" + button.dataset.tab
            )
            .classList.add("active");

        if(button.dataset.tab === "history"){
            renderHistory();
        }
    });
});

// ===============================
// SWAP
// ===============================

swapBtn.addEventListener("click", () => {

    const temp = fromSelect.value;

    fromSelect.value = toSelect.value;
    toSelect.value = temp;
});

// ===============================
// API
// ===============================

async function getRate(from, to){

    const response =
    await fetch(
        `https://open.er-api.com/v6/latest/${from}`
    );

    const data = await response.json();

    return data.rates[to];
}

// ===============================
// CONVERT
// ===============================

convertBtn.addEventListener("click", async () => {

    try {

        const amount =
        parseFloat(amountInput.value);

        if(
            isNaN(amount) ||
            amount <= 0
        ){
            showError(
                "Please enter valid amount"
            );
            return;
        }

        hideError();

        convertBtn.disabled = true;
        convertBtn.textContent =
        "Converting...";

        const from = fromSelect.value;
        const to = toSelect.value;

        const rate =
        await getRate(from,to);

        const converted =
        amount * rate;

        const info =
        CURRENCIES.find(
            c => c.code === to
        );

        resultAmount.innerHTML =
        `<span class="sym">
        ${info.symbol}
        </span>
        ${converted.toLocaleString(
            "en-IN",
            {
                minimumFractionDigits:2,
                maximumFractionDigits:4
            }
        )}`;

        resultMeta.innerHTML = `
        <span class="meta-pill">
        1 ${from} = ${rate.toFixed(4)} ${to}
        </span>

        <span class="meta-pill">
        Updated Live
        </span>
        `;

        resultBox.classList.add("visible");

        lastConverted = {
            amount,
            from,
            to,
            converted,
            rate
        };

        saveHistory(
            amount,
            from,
            to,
            converted,
            rate
        );

    } catch(error){

        showError(
            "Failed to convert currency."
        );

    } finally {

        convertBtn.disabled = false;
        convertBtn.textContent =
        "Convert →";
    }
});

// ===============================
// COPY
// ===============================

copyBtn.addEventListener("click", async () => {

    if(!lastConverted) return;

    const text =
    `${lastConverted.amount}
    ${lastConverted.from}
    =
    ${lastConverted.converted}
    ${lastConverted.to}`;

    await navigator.clipboard.writeText(text);

    copyBtn.textContent = "✅ Copied";

    setTimeout(() => {

        copyBtn.textContent =
        "📋 Copy";

    },1500);
});

// ===============================
// MULTI CONVERT
// ===============================

multiBtn.addEventListener("click",
async () => {

    multiGrid.innerHTML = "";

    const amount =
    parseFloat(multiAmount.value);

    const from =
    multiFrom.value;

    const response =
    await fetch(
        `https://open.er-api.com/v6/latest/${from}`
    );

    const data =
    await response.json();

    CURRENCIES.forEach(currency => {

        if(currency.code === from)
            return;

        const value =
        amount *
        data.rates[currency.code];

        const row =
        document.createElement("div");

        row.className =
        "multi-row";

        row.innerHTML = `
        <div class="multi-currency">

            <span class="multi-flag">
                ${getFlagEmoji(currency.country)}
            </span>

            <div>
                <div>
                    ${currency.code}
                </div>

                <div class="multi-name">
                    ${currency.name}
                </div>
            </div>

        </div>

        <div class="multi-value">
            ${currency.symbol}
            ${value.toFixed(2)}
        </div>
        `;

        multiGrid.appendChild(row);
    });
});

// ===============================
// HISTORY
// ===============================

function saveHistory(
    amount,
    from,
    to,
    converted,
    rate
){

    history.unshift({
        amount,
        from,
        to,
        converted,
        rate,
        time: Date.now()
    });

    history =
    history.slice(0,20);

    localStorage.setItem(
        "rupeex_history",
        JSON.stringify(history)
    );
}

function renderHistory(){

    historyList.innerHTML = "";

    if(history.length === 0){

        historyList.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">
                🕒
            </div>

            No conversions yet
        </div>
        `;

        return;
    }

    history.forEach(item => {

        const div =
        document.createElement("div");

        div.className =
        "history-item";

        div.innerHTML = `
        <div>

            <div class="history-pair">
                ${item.from}
                →
                ${item.to}
            </div>

            <div class="history-detail">
                ${item.amount}
                =
                ${item.converted.toFixed(2)}
            </div>

        </div>

        <div>

            <div class="history-rate">
                ${item.rate.toFixed(4)}
            </div>

        </div>
        `;

        historyList.appendChild(div);
    });
}

// ===============================
// CLEAR HISTORY
// ===============================

clearHistoryBtn.addEventListener(
"click",
() => {

    history = [];

    localStorage.removeItem(
        "rupeex_history"
    );

    renderHistory();
});

// ===============================
// ERROR
// ===============================

function showError(message){

    errorBox.textContent = message;

    errorBox.classList.add(
        "visible"
    );
}

function hideError(){

    errorBox.classList.remove(
        "visible"
    );
}

// ===============================
// FLOATING SYMBOLS
// ===============================

(function(){

    const container =
    document.getElementById(
        "floatSymbols"
    );

    const symbols = [
        "₹","$","€","£","¥",
        "💰","💸","🪙"
    ];

    for(let i=0;i<20;i++){

        const div =
        document.createElement("div");

        div.className = "fsym";

        div.textContent =
        symbols[
            Math.floor(
                Math.random() *
                symbols.length
            )
        ];

        div.style.left =
        Math.random()*100 + "vw";

        div.style.fontSize =
        20 + Math.random()*20 + "px";

        div.style.animationDuration =
        10 + Math.random()*15 + "s";

        div.style.animationDelay =
        -(Math.random()*10) + "s";

        container.appendChild(div);
    }

})();