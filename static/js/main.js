// React to PlainJS:tm: by GPT-4o, all rights reserved to the original author..
// "HSR Tools is/was created and maintained by Feeed."

// No promises of accuracy or completeness are made as GPT self-attempted to make a 1:1 conversion.
// Mostly free of React, except for CSS from the original, which is still used.
// Tests? No. None were made. This may not even work.
// I could've just kept using the WaybackMachine copy, but Cifera might steal it. Better safe than sorry.


// Yes, the tooltip functionality is absolutely terrible.


// START OF GPT-4o GENERATED CODE
// Helper to create elements with attributes and children
function createElement(tag, attrs = {}, ...children) {
    const el = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs)) {
        if (key === "className") el.className = value;
        else if (key === "innerHTML") el.innerHTML = value;
        else if (key.startsWith("on") && typeof value === "function") {
            el.addEventListener(key.substring(2).toLowerCase(), value);
        } else if (value !== undefined) {
            el.setAttribute(key, value);
        }
    }
    for (const child of children) {
        if (child !== null && child !== undefined) {
            el.append(child.nodeType ? child : document.createTextNode(child));
        }
    }
    return el;
}

// State management
function useState(init) {
    let value = init;
    const listeners = [];
    function set(newVal) {
        value = newVal;
        listeners.forEach(fn => fn(value));
    }
    function subscribe(fn) {
        listeners.push(fn);
        fn(value);
    }
    return [() => value, set, subscribe];
}

// Main function to create the calculator
function createEHRCalculator(container) {
    // State variables
    const [getE, setE] = useState("");
    const [getR, setR] = useState("");
    const [getL, setL] = useState("");
    const [getI, setI] = useState("");
    const [getC, setC] = useState("");
    const [getD, setD] = useState("");
    const [getP, setP] = useState(null);
    const [getM, setM] = useState(null);
    const [getGuaranteed, setG] = useState(true);

    // Helper to reset form
    function resetForm() {
        setE(""); setR(""); setL(""); setI(""); setC(""); setD(""); setP(null); setM(null);
        update();
    }

    // Helper for input change
    function handleInput(e, setter) {
        setP(null); setM(null);
        const val = e.target.value;
        setter(val.length ? Number(val) : val);
        update();
    }

    // Calculation logic
    function calculate() {
        const BasePercentage = Number(getR()) / 100,
            EffectRes = Number(getL()) / 100,
            DebuffRes = Number(getI()) / 100,
            Desired = Number(getC()) / 100,
            EffectHitRate = Number(getE()) / 100,
            Hits = Number(getD()) || 1;
        if (getGuaranteed()) {
            const TargetDesired = (Desired === 1 ? 0.999 : Desired),
                Needed = (100 * ((1 - Math.pow(1 - TargetDesired, 1 / Hits)) / (BasePercentage * (1 - EffectRes) * (1 - DebuffRes)) - 1)).toFixed(1);
            setP(Needed);
            setM(getC());
        } else {
            const PerHitChance = BasePercentage * (1 + EffectHitRate) * (1 - EffectRes) * (1 - DebuffRes),
                Chance = (100 * (1 - Math.pow(1 - PerHitChance, Hits))).toFixed(1);
            setP(Chance);
            setM(getE());
        }
        update();
    }

    // Check if calculate button should be disabled
    function isCalculateDisabled() {
        if (getGuaranteed()) {
            return !("" !== getC() && "" !== getR() && "" !== getL() && "" !== getI() && "" !== getD());
        } else {
            return !("" !== getE() && "" !== getR() && "" !== getL() && "" !== getI() && "" !== getD());
        }
    }

    // UI elements
    const form = createElement("div", { className: "ehr-calc-form" });

    // Toggle buttons
    const btnEHR = createElement("button", {
        class: "calculator-select-button active",
        type: "button",
        onclick: () => { resetForm(); setG(true); update(); btnEHR.classList.add("active"); btnActual.classList.remove("active");
            effectHitRateDiv.style.display = "none";
            desiredHitDiv.style.display = "";
        }
    }, "Calculate EHR Required");

    const btnActual = createElement("button", {
        class: "calculator-select-button",
        type: "button",
        onclick: () => { resetForm(); setG(false); update(); btnActual.classList.add("active"); btnEHR.classList.remove("active");
            effectHitRateDiv.style.display = "";
            desiredHitDiv.style.display = "none";
        }
    }, "Calculate Actual Chance");
    const btnGroup = createElement("div", {class: "calculator-select"}, btnEHR, btnActual);

    // Inputs
    const inputDesiredChance = createElement("input", {
        class: "calculator-input-field",
        type: "number",
        placeholder: "100",
        value: getC(),
        oninput: e => handleInput(e, setC),
        id: "desired-chance"
    });
    const inputEHR = createElement("input", {
        class: "calculator-input-field",
        type: "number",
        placeholder: "",
        value: getE(),
        oninput: e => handleInput(e, setE),
        id: "ehr"
    });
    const inputBaseChance = createElement("input", {
        class: "calculator-input-field",
        type: "number",
        placeholder: "",
        value: getR(),
        oninput: e => handleInput(e, setR),
        id: "base-chance"
    });
    const inputEffRes = createElement("input", {
        class: "calculator-input-field",
        type: "number",
        placeholder: "40",
        value: getL(),
        oninput: e => handleInput(e, setL),
        id: "enemy-eff-res"
    });
    const inputDebuffRes = createElement("input", {
        class: "calculator-input-field",
        type: "number",
        placeholder: "0",
        value: getI(),
        oninput: e => handleInput(e, setI),
        id: "enemy-debuff-res"
    });
    const inputNumHits = createElement("input", {
        class: "calculator-input-field",
        type: "number",
        placeholder: "1",
        value: getD(),
        oninput: e => handleInput(e, setD),
        id: "num-hits"
    });

    // Calculate and Reset buttons
    const calcBtn = createElement("button", {
        class: "calculator-button-calculate",
        type: "button",
        onclick: calculate
    }, "Calculate");
    const resetBtn = createElement("button", {
        class: "calculator-button-reset",
        type: "button",
        onclick: resetForm
    }, "Reset");
    const calcBtnWrapper = createElement("div", { className: "calculator-button-wrapper" }, resetBtn, calcBtn);

    // Results
    const resultDiv = createElement("div", { className: "ehr-calculate-result" });

    // Update function to show/hide fields and update values
    function update() {
        // Toggle input visibility
        inputDesiredChance.style.display = getGuaranteed() ? "" : "none";
        inputEHR.style.display = getGuaranteed() ? "none" : "";
        // Update input values
        inputDesiredChance.value = getC();
        inputEHR.value = getE();
        inputBaseChance.value = getR();
        inputEffRes.value = getL();
        inputDebuffRes.value = getI();
        inputNumHits.value = getD();
        // Disable calculate button if needed
        calcBtn.disabled = isCalculateDisabled();
        // Update result
        resultDiv.innerHTML = "";
        if (getP() !== null) {
            if (getGuaranteed()) {
                resultDiv.innerHTML = `EHR Required for ${getD() > 1 && getC() == 100 ? "99.9" : getM()}% Success Rate: <span class="ehr-calculate-result-percent calc-green">${getP() < 0 ? 0 : getP()}%</span>`;
            } else {
                resultDiv.innerHTML = `Actual Chance to debuff with ${getM()}% EHR: <span class="ehr-calculate-result-percent calc-green">${getP() > 100 ? 100 : getP() < 0 ? 0 : getP()}%</span>`;
            }
        }
    }

    // Build form
    
    const infoBox = createElement("div", { className: "calculator-info" }, 
        createElement("h1", {class: "calculator-info-title"}, "Effect Hit Rate Calculator"),
        createElement("div", { className: "calculator-info-description" },
            createElement("div", {className: "calculator-info-description-sub"}, "Please choose whether to calculate the:",
                createElement("ul", {},
                    createElement("li", {}, "EHR Required to land a debuff x% of the time"),
                    createElement("li", {}, "Actual Chance to land a debuff given a character's EHR")
                )
            ),
        ),
    )

    const helpEHRButton = createElement("button", { className: "help-icon", id: "ehr-chance" }, "?");
    const helpActualButton = createElement("button", { className: "help-icon", id: "desired-chance" }, "?");
    const helpDebuffBaseButton = createElement("button", { className: "help-icon", id: "debuff-chance" }, "?");
    const helpEffectResButton = createElement("button", { className: "help-icon", id: "enemy-eff-res" }, "?");
    const helpDebuffResButton = createElement("button", { className: "help-icon", id: "enemy-debuff-res" }, "?");
    const helpHitsButton = createElement("button", { className: "help-icon", id: "num-hits" }, "?");

    const buttonTooltipArr = [helpEHRButton, helpDebuffBaseButton, helpEffectResButton, helpDebuffResButton, helpActualButton, helpHitsButton];

    // Add tooltip functionality to help buttons
    buttonTooltipArr.forEach(button => {
        button.addEventListener("click", (event) => {
            event.stopPropagation(); // Prevent click from propagating to document
            const tooltipId = button.id + "-tooltip";
            let tooltip = document.getElementById(tooltipId);
            if (tooltip) {
                tooltip.style.display = tooltip.style.display === "none" ? "block" : "none";
            }

            buttonTooltipArr.forEach(btn => {
                if (btn !== button) {
                    const otherTooltipId = btn.id + "-tooltip";
                    const otherTooltip = document.getElementById(otherTooltipId);
                    if (otherTooltip) {
                        otherTooltip.style.display = "none";
                    }
                }
            });
        });
    });

    document.addEventListener("click", (event) => {
        buttonTooltipArr.forEach(button => {
            const tooltipId = button.id + "-tooltip";
            const tooltip = document.getElementById(tooltipId);
            if (tooltip) {
                tooltip.style.display = "none";
            }
        });
    });


    const effectHitRateDiv = createElement("div", { className: "calculator-input-wrapper", style: "position: relative; display:none;" }, // Initially hidden
        createElement("label", { for: "ehr" }, "Effect Hit Rate (%)"),
        createElement("div", { className: "calculator-input" }, inputEHR,
            createElement("div", { className: "help-icon" },
                helpEHRButton
            ),
            createElement("div", { 
                role: "tooltip", 
                className: "react-tooltip", 
                style: `
                    display: none;
                    position: fixed;
                    top: 35%;
                    left: 40%;
                    z-index: 10;
                    background: #222;
                    color: #fff;
                    padding: 8px 12px;
                    border-radius: 4px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                    min-width: 220px;
                    font-size: 0.95em;
                `, 
                id: "ehr-chance-tooltip" 
            },
                createElement("span", {}, 
                    createElement("span", {className: "tooltip"}, "The character's", 
                        createElement("span", { className: "calc-green" }, " Effect Hit Rate."), 
                    ),  
                ),
            )
        )
    );

    const desiredHitDiv = createElement("div", { className: "calculator-input-wrapper" },
        createElement("label", { for: "desired-chance" }, "Desired Actual Chance (%)"),
        createElement("div", { className: "calculator-input" }, inputDesiredChance,
            createElement("div", { className: "help-icon" },
                helpActualButton
            ),
            createElement("div", { 
                role: "tooltip", 
                className: "react-tooltip", 
                style: `
                    display: none;
                    position: fixed;
                    top: 35%;
                    left: 40%;
                    z-index: 10;
                    background: #222;
                    color: #fff;
                    padding: 8px 12px;
                    border-radius: 4px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                    min-width: 220px;
                    font-size: 0.95em;
                `, 
                id: "desired-chance-tooltip" 
            },
                createElement("span", {}, 
                    createElement("span", {className: "tooltip"}, "The desired", 
                        createElement("span", { className: "calc-green" }, " Actual Chance "), 
                        "of the debuff landing.",
                        createElement("br"),
                        createElement("br"),
                        "If you want the debuff to land",
                        createElement("br"),
                        "100% of the time, enter", 
                        createElement("span",{ className: "calc-green" }, " 100"),"."),
                ),
            )

        )
    );

    const enemyDebuffDiv = createElement("div", { className: "calculator-input-wrapper" },
        createElement("label", { for: "enemy-debuff-res" },
        createElement("span", { className: "calc-red" }, "Enemy"),
         " Debuff RES (%)"),
        createElement("div", { className: "calculator-input" }, inputDebuffRes,
                createElement("div", { className: "help-icon" },
                helpDebuffResButton
            ),
            createElement("div", { 
                role: "tooltip", 
                className: "react-tooltip", 
                style: `
                    display: none;
                    position: fixed;
                    top: 45%;
                    left: 40%;
                    z-index: 10;
                    background: #222;
                    color: #fff;
                    padding: 8px 12px;
                    border-radius: 4px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                    min-width: 220px;
                    font-size: 0.95em;
                `, 
                id: "enemy-debuff-res-tooltip" 
            },
                createElement("span", {}, 
                    createElement("span", {className: "tooltip"}, "The enemy's", 
                        createElement("span", { className: "calc-green" }, " resistance to the",
                            createElement("br"),
                            " specific debuff effect"
                        ), 
                        ".",
                        createElement("br"),
                        createElement("br"),
                        "You can look up the Debuff RES",
                        createElement("br"),
                        "of an enemy by clicking ",
                        createElement("a", { href: "https://honkai-star-rail.fandom.com/wiki/Debuff_RES#Enemy_Debuff_RES" }, "here"),
                        ".",
                        createElement("br"),
                        createElement("br"),
                        "The enemy's resistance to one",
                        createElement("br"),
                        "specific effect is most likely 0%,",
                        createElement("br"),
                        "so enter", 
                        createElement("span",{ className: "calc-green" }, " 0"),
                        " if you aren't sure",
                        createElement("br"),
                        "what the exact enemy's Debuff RES",
                        createElement("br"),
                        "to the effect is."
                    ),
                ),
            )
        )
    );

    const enemyEffectResDiv = createElement("div", { className: "calculator-input-wrapper" },
        createElement("label", { for: "enemy-eff-res" }, 
        createElement("span", { className: "calc-red" }, "Enemy"),
        " Effect RES (%)"),
        createElement("div", { className: "calculator-input" }, inputEffRes,
            createElement("div", { className: "help-icon" },
                helpEffectResButton
            ),
            createElement("div", { 
                role: "tooltip", 
                className: "react-tooltip", 
                style: `
                    display: none;
                    position: fixed;
                    top: 45%;
                    left: 40%;
                    z-index: 12;
                    background: #222;
                    color: #fff;
                    padding: 8px 12px;
                    border-radius: 4px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                    min-width: 220px;
                    font-size: 0.95em;
                `, 
                id: "enemy-eff-res-tooltip" 
            },
                createElement("span", {}, 
                    createElement("span", {className: "tooltip"}, "The enemy's generic", 
                        createElement("span", { className: "calc-green" }, " Effect RES "), 
                        createElement("br"),
                        "stat. This varies per enemy, but",
                        createElement("br"),
                        "the value is always ",
                        createElement("span",{ className: "calc-green" }, "0-40%"),"."),
                        createElement("br"),
                        createElement("br"),
                        "You can look up the Effect RES",
                        createElement("br"),
                        "of an enemy by clicking ",
                        createElement("a", { href: "https://honkai-star-rail.fandom.com/wiki/Effect_RES#Enemy_Effect_RES" }, "here"),
                        ".",
                        createElement("br"),
                        createElement("br"),
                        "Many endgame enemies have",
                        createElement("br"),
                        "40% Effect RES, so enter",
                        createElement("span",{ className: "calc-green" }, " 40"),
                        " if",
                        createElement("br"),
                        "you aren't sure what the exact",
                        createElement("br"),
                        "value is."
                ),
            )
        )
    );

    const baseChanceDiv = createElement("div", { className: "calculator-input-wrapper" },
        createElement("label", { for: "base-chance" }, "Debuff Base Chance (%)"),
        createElement("div", { className: "calculator-input" }, inputBaseChance,
            createElement("div", { className: "help-icon" },
                helpDebuffBaseButton
            ),
            createElement("div", { 
                role: "tooltip", 
                className: "react-tooltip", 
                style: `
                    display: none;
                    position: fixed;
                    top: 45%;
                    left: 40%;
                    z-index: 12;
                    background: #222;
                    color: #fff;
                    padding: 8px 12px;
                    border-radius: 4px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                    min-width: 220px;
                    font-size: 0.95em;
                `, 
                id: "debuff-chance-tooltip" 
            },
                createElement("span", {}, 
                    createElement("span", {className: "tooltip"}, "The", 
                        createElement("span", { className: "calc-green" }, " Base Chance "), 
                        "of the debuff.",
                        createElement("br"),
                        createElement("br"),
                        "This value is explicitly listed as",
                        createElement("br"),
                        createElement("span",{ className: "calc-green" }, '"Base Chance"')," in the effect"),
                        createElement("br"),
                        "description.",
                ),
            )
        )
    );

    const numHitsDiv = createElement("div", { className: "calculator-input-wrapper" },
        createElement("label", { for: "num-hits" }, "Number of Chances"),
        createElement("div", { className: "calculator-input" }, inputNumHits,
            createElement("div", { className: "help-icon" },
                helpHitsButton
            ),
            createElement("div", { 
                role: "tooltip", 
                className: "react-tooltip", 
                style: `
                    display: none;
                    position: fixed;
                    top: 45%;
                    left: 40%;
                    z-index: 10;
                    background: #222;
                    color: #fff;
                    padding: 8px 12px;
                    border-radius: 4px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                    min-width: 220px;
                    font-size: 0.95em;
                `, 
                id: "num-hits-tooltip" 
            },
                createElement("span", {}, 
                    createElement("span", {className: "tooltip"}, "The", 
                        createElement("span", { className: "calc-green" }, " number of chances "), 
                        "the",
                        createElement("br"),
                        "debuff has to land.",
                        createElement("br"),
                        createElement("br"),
                        "Some attacks (e.g. Welt's skill)",
                        createElement("br"),
                        "have multiple hits, and therefore",
                        createElement("br"),
                        "multiple chances to inflict a",
                        createElement("br"),
                        "debuff.", 
                        createElement("br"),
                        createElement("br"),
                        "Most abilities do not have",
                        createElement("br"),
                        "multiple proc chances, so this",
                        createElement("br"),
                        "value should likely be",
                        createElement("span",{ className: "calc-green" }, " 1"),".",),
                ),
            )
        )
    );

    form.append(
        infoBox,
        btnGroup,
        desiredHitDiv,
        effectHitRateDiv,
        baseChanceDiv,
        enemyEffectResDiv,
        enemyDebuffDiv,
        numHitsDiv,
        calcBtnWrapper,
        resultDiv
    );

    const Credits = createElement("div", {},
        createElement("p", {}, "Originally created by ", createElement("a", { href: "https://www.reddit.com/user/Feeed3/", target: "_blank" }, "Feeed"), ".", ),
        createElement("p", {}, "Original website can be found ", createElement("a", { href: "https://web.archive.org/web/20240815155819/https://hsrtools.com/home", target: "_blank" }, "here"), "."),
    )
    const Calculator = createElement("div", { className: "calculator" }, infoBox, form, Credits);
    const Wrapper = createElement("div", { className: "calculator-wrapper" }, Calculator);
    const App = createElement("div", { className: "App" }, Wrapper);


    // Initial update
    update();

    // Mount to container
    container.appendChild(App);
}

// Usage: pass a container DOM element where you want the calculator
// Example: createEHRCalculator(document.getElementById('ehr-calc-container')); to root element
createEHRCalculator(document.getElementById('root') || document.body);
