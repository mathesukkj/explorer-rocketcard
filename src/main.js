import "./css/index.css";
import IMask from "imask";

const ccBgColor1 = document.querySelector(".cc-bg svg > g g:nth-child(1) path");
const ccBgColor2 = document.querySelector(".cc-bg svg > g g:nth-child(2) path");
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img");

function setCardType(type) {
  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    default: ["black", "gray"],
  };

  ccBgColor1.setAttribute("fill", colors[type][0]);
  ccBgColor2.setAttribute("fill", colors[type][1]);
  ccLogo.setAttribute("src", `cc-${type}.svg`);
}
globalThis.setCardType = setCardType;

const CVV = document.querySelector("#security-code");
const CVVPattern = {
  mask: "000",
};
const CVVMasked = IMask(CVV, CVVPattern);

const expirationDate = document.querySelector("#expiration-date");
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
  },
};
const expirationDateMasked = IMask(expirationDate, expirationDatePattern);

const cardNumber = document.querySelector("#card-number");
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7])\d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],

  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "");
    const actualMask = dynamicMasked.compiledMasks.find(({ regex }) =>
      number.match(regex)
    );
    console.log(actualMask);
    return actualMask;
  },
};
const cardNumberMasked = IMask(cardNumber, cardNumberPattern);

const addButton = document.querySelector("#add-card-button");
addButton.addEventListener("click", () => {
  alert("Cartão adicionado!");
});

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();
}); //* previne o reload padrão do botão de submit

const cardHolder = document.querySelector("#card-holder");
cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value");
  ccHolder.innerText = cardHolder.value;
  if (cardHolder.value == "") {
    ccHolder.innerText = "FULANO DA SILVA";
  }
  // ccHolder.innerText = cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value
});

CVVMasked.on("accept", () => {
  function updateCVV(code) {
    const ccSecurity = document.querySelector(".cc-security .value");
    ccSecurity.innerText = code.length === 0 ? "123" : code;
  }
  updateCVV(CVVMasked.value);
});

cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardtype;
  setCardType(cardType);

  function updateCardNumber(number) {
    const ccNumber = document.querySelector(".cc-number");
    ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number;
  }
  updateCardNumber(cardNumberMasked.value);
});
