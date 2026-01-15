const tg = Telegram.WebApp;
tg.ready();

const menuData = [
    { title: "Капучино", desc: "Классический кофе", price: 199 },
    { title: "Латте", desc: "Молочный кофе", price: 219 },
    { title: "Американо", desc: "Чёрный кофе", price: 159 },
    { title: "Сэндвич с курицей", desc: "Свежий", price: 299 }
];

const menu = document.getElementById("menu");
const checkout = document.getElementById("checkout");
const success = document.getElementById("success");

let selectedItem = null;

menuData.forEach(item => {
    const stars = Math.round(item.price * 1.84);

    const el = document.createElement("div");
    el.className = "card";
    el.innerHTML = `
        <div class="image">Фото</div>
        <div class="info">
            <h3>${item.title}</h3>
            <p>${item.desc}</p>
            <div class="price">⭐ ${stars}</div>
        </div>
        <button>+</button>
    `;

    el.querySelector("button").onclick = () => openCheckout(item, stars);
    menu.appendChild(el);
});

function openCheckout(item, stars) {
    selectedItem = { item, stars };
    document.getElementById("checkoutTitle").innerText = item.title;
    document.getElementById("checkoutPrice").innerText = `К оплате: ⭐ ${stars}`;
    checkout.classList.remove("hidden");

    tg.HapticFeedback.impactOccurred("light");
}

function closeCheckout() {
    checkout.classList.add("hidden");
}

document.getElementById("payBtn").onclick = () => {
    tg.HapticFeedback.impactOccurred("medium");

    // ЗАГЛУШКА — здесь будет fetch к bot.py
    checkout.classList.add("hidden");
    success.classList.remove("hidden");
};

function goHome() {
    success.classList.add("hidden");
    tg.HapticFeedback.impactOccurred("light");
}

/* DARK MODE */
document.getElementById("themeToggle").onclick = () => {
    document.body.classList.toggle("dark");
};

/* экспорт для кнопок */
window.closeCheckout = closeCheckout;
window.goHome = goHome;