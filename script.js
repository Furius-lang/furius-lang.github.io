// FixPoint: интерактивные функции сайта

// 1. Калькулятор + сохранение выбранных услуг в localStorage
const options = document.querySelectorAll(".repair-option");
const totalElement = document.getElementById("total");

function calculateTotal() {
  let total = 0;
  const selected = [];
  options.forEach((option, index) => {
    if (option.checked) {
      total += Number(option.value);
      selected.push(index);
    }
  });
  totalElement.textContent = total.toLocaleString("ru-RU") + " ₽";
  localStorage.setItem("fixpoint-selected-repairs", JSON.stringify(selected));
}

try {
  const savedOptions = JSON.parse(localStorage.getItem("fixpoint-selected-repairs") || "[]");
  options.forEach((option, index) => option.checked = savedOptions.includes(index));
} catch (error) {
  localStorage.removeItem("fixpoint-selected-repairs");
}
calculateTotal();
options.forEach(option => option.addEventListener("change", calculateTotal));

// 2. Мобильное меню
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");
menuToggle.addEventListener("click", () => nav.classList.toggle("open"));
nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => nav.classList.remove("open")));

// 3. Кнопка «Наверх»
const backToTop = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
  backToTop.classList.toggle("visible", window.scrollY > 450);
});
backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// 4. Появление карточек при прокрутке
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in-view");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(card => revealObserver.observe(card));

// 5. Поиск и фильтр услуг
const searchInput = document.getElementById("serviceSearch");
const filterButtons = document.querySelectorAll(".filter-btn");
const serviceCards = document.querySelectorAll(".service-card");
const emptyResult = document.getElementById("emptyResult");
let activeFilter = "all";

function filterServices() {
  const query = searchInput.value.trim().toLocaleLowerCase();
  let visibleCount = 0;
  serviceCards.forEach(card => {
    const title = card.querySelector("h3").textContent.toLocaleLowerCase();
    const description = card.querySelector("p").textContent.toLocaleLowerCase();
    const matchesText = (title + " " + description).includes(query);
    const matchesCategory = activeFilter === "all" || card.dataset.category === activeFilter;
    const visible = matchesText && matchesCategory;
    card.hidden = !visible;
    if (visible) visibleCount++;
  });
  emptyResult.classList.toggle("show", visibleCount === 0);
}
searchInput.addEventListener("input", filterServices);
filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    activeFilter = button.dataset.filter;
    filterServices();
  });
});

// 6. Модальное окно с подробностями карточки
const modal = document.getElementById("serviceModal");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");
const modalPrice = document.getElementById("modalPrice");
const modalClose = document.getElementById("modalClose");

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}
document.querySelectorAll(".details-btn").forEach(button => {
  button.addEventListener("click", () => {
    const card = button.closest(".service-card");
    const english = document.documentElement.lang === "en";
    modalTitle.textContent = english ? card.dataset.enTitle : card.dataset.title;
    modalText.textContent = english ? card.dataset.enDetails : card.dataset.details;
    modalPrice.textContent = card.dataset.price;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
  });
});
modalClose.addEventListener("click", closeModal);
modal.querySelector("[data-close-modal]").addEventListener("click", closeModal);
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeModal();
});
document.getElementById("modalRequest").addEventListener("click", closeModal);

// 7. Слайдер без сторонних библиотек
const slideTrack = document.getElementById("slideTrack");
const dots = [...document.querySelectorAll(".dot")];
let currentSlide = 0;
function showSlide(index) {
  currentSlide = (index + dots.length) % dots.length;
  slideTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
  dots.forEach((dot, i) => dot.classList.toggle("active", i === currentSlide));
}
document.getElementById("slidePrev").addEventListener("click", () => showSlide(currentSlide - 1));
document.getElementById("slideNext").addEventListener("click", () => showSlide(currentSlide + 1));
dots.forEach((dot, index) => dot.addEventListener("click", () => showSlide(index)));

// 8. Переключение русского и английского языков + сохранение выбора
const translations = {
  en: {
    navServices:"Services",navPrices:"Prices",navAbout:"About",navContacts:"Contacts",
    eyebrow:"FIXPOINT SERVICE CENTER",heroTitle:'Bring your<br><span>smartphone back to life</span>',
    heroText:"Professional phone repair, fair prices and warranty on completed work.",requestBtn:"Request a repair",servicesBtn:"Our services",
    experience:"years of experience",repairs:"repairs",warranty:"warranty",fixed:"Working again",diagnostics:"Diagnostics",free:"Free",
    serviceEyebrow:"WHAT WE REPAIR",servicesTitle:"Popular services",servicesIntro:"We will find a solution for your device.",
    searchPlaceholder:"Search services...",filterAll:"All",filterHardware:"Hardware",filterSoftware:"Software",
    screen:"Screen replacement",screenDesc:"For cracked displays, lines or an unresponsive touchscreen.",
    battery:"Battery replacement",batteryDesc:"For a phone that drains quickly or shuts down.",
    port:"Charging port repair",portDesc:"If your phone charges poorly or does not detect the cable.",
    speaker:"Speaker cleaning",speakerDesc:"If the sound is quiet or calls are hard to hear.",
    water:"Water damage service",waterDesc:"Device inspection and recovery of damaged components.",
    software:"Software setup",softwareDesc:"Help with updates, setup and troubleshooting.",details:"Details",
    emptyResult:"No services found. Try another search.",priceEyebrow:"CLEAR PRICING",calculatorTitle:"Repair calculator",
    calculatorIntro:"Select repair options to calculate an estimated price.",estimatedCost:"Estimated cost",
    exactPrice:"The exact price is determined after diagnostics.",bookRepair:"Book a repair",
    tagline:"Quality • Reliability • Care",whyUs:"WHY FIXPOINT",aboutTitle:"Your device is in safe hands",
    aboutText:"We help extend the life of smartphones. Before repair, we run diagnostics, agree on the price and explain the required work.",
    benefit1:"✓ Price approval before repair",benefit2:"✓ Careful handling of your device",benefit3:"✓ Warranty on completed work",benefit4:"✓ Convenient online booking",
    sliderEyebrow:"OUR APPROACH",sliderTitle:"Repair in three steps",step1Title:"Diagnostics",step1Text:"We inspect your device and identify the issue.",
    step2Title:"Approval",step2Text:"We explain the solution, timing and estimated cost.",
    step3Title:"Repair and testing",step3Text:"We complete the repair and test key phone functions.",
    contactEyebrow:"HAVE QUESTIONS?",requestTitle:"Send a request",requestIntro:"Fill out the form and our specialist will contact you.",
    yourName:"Your name",yourPhone:"Phone number",problemLabel:"What happened to your phone?",chooseProblem:"Choose an issue",
    sendRequest:"Send request",footerText:"Smartphone repair with care for your device.",contacts:"Contacts",
    hours:"Daily: 10:00 AM–8:00 PM",address:"Address",sampleAddress:"Ulan-Ude, Example Street, 10"
  }
};
const languageToggle = document.getElementById("languageToggle");
function setLanguage(language) {
  document.documentElement.lang = language;
  document.querySelectorAll("[data-i18n]").forEach(element => {
    const key = element.dataset.i18n;
    if (language === "en" && translations.en[key]) element.innerHTML = translations.en[key];
    else if (language === "ru") element.innerHTML = element.dataset.ruText || originalRussian[key] || element.innerHTML;
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {
    const key = element.dataset.i18nPlaceholder;
    if (language === "en" && translations.en[key]) element.placeholder = translations.en[key];
    else element.placeholder = "Поиск услуги...";
  });
  languageToggle.textContent = language === "ru" ? "EN" : "RU";
  localStorage.setItem("fixpoint-language", language);
}
const originalRussian = {};
document.querySelectorAll("[data-i18n]").forEach(element => {
  originalRussian[element.dataset.i18n] = element.innerHTML;
});
languageToggle.addEventListener("click", () => {
  setLanguage(document.documentElement.lang === "ru" ? "en" : "ru");
});
const savedLanguage = localStorage.getItem("fixpoint-language");
if (savedLanguage === "en") setLanguage("en");

// 9. Netlify Forms: встроенная HTML-форма отправляется после публикации на Netlify.
// Форма не перехватывается JavaScript, чтобы Netlify мог принять POST-запрос.
