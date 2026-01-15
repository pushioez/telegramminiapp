const tg = Telegram.WebApp;
tg.ready();

const RATE = 1.89;

const data = {
    "Авторские напитки": [
        { title: "Латте Лимонный Курд с Шоколадом", desc: "Нежный и сливочный напиток...", price: 425 },
        { title: "Цикорий Молочный", desc: "Нежный горячий напиток...", price: 335 },
        { title: "Цикорий Сливочная Карамель", desc: "Сливочный горячий напиток...", price: 370 }
    ],
    "Выпечка": [
        { title: "Бельгийская вафля", desc: "Нежная бельгийская вафля...", price: 290 },
        { title: "Брецель с солёным маслом", desc: "Натуральные ингредиенты...", price: 420 },
        { title: "Круассан миндальный", desc: "Классический круассан...", price: 320 },
        { title: "Круассан с сыром", desc: "Хрустящий круассан...", price: 270 },
        { title: "Лимонный кекс", desc: "Воздушный ванильный кекс...", price: 250 },
        { title: "Трубочка с варёной сгущёнкой", desc: "Золотистое лакомство...", price: 290 }
    ],
    "Чай и шоколад": [
        { title: "Горячий шоколад", desc: "Изысканный вкус...", price: 385 },
        { title: "Маття Чай Латте", desc: "Фирменный напиток...", price: 395 },
        { title: "Пряный Чай Латте", desc: "Удивительный вкус...", price: 385 },
        { title: "Сливочный Шоколад Крем-Сода", desc: "Фирменный шоколад...", price: 395 }
    ],
    "Комбо в доставке": [
        { title: "Комбо завтрак", desc: "Начните свой день...", price: 730 },
        { title: "Комбо с десертом", desc: "Для сладкоежек...", price: 705 },
        { title: "Комбо с круассан-роллом", desc: "Сытный вариант...", price: 780 },
        { title: "Комбо с сырниками", desc: "Авторский кофе...", price: 705 }
    ]
};

const categoriesEl = document.getElementById("categories");
const menuEl = document.getElementById("menu");
const checkout = document.getElementById("checkout");

let currentCategory = Object.keys(data)[0];
let selectedItem = null;

Object.keys(data).forEach(cat => {
    const span = document.createElement("span");
    span.innerText = cat;
    if (cat === currentCategory) span.classList.add("active");
    span.onclick = () => switchCategory(cat);
    categoriesEl.appendChild(span);
});

function switchCategory(cat) {
    currentCategory = cat;
    [...categoriesEl.children].forEach(c => c.classList.remove("active"));
    [...categoriesEl.children].find(c => c.innerText === cat).classList.add("active");
    renderMenu();
}

function renderMenu() {
    menuEl.innerHTML = "";
    data[currentCategory].forEach(item => {
        const stars = Math.round(item.price * RATE);

        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <div class="info">
                <!-- ВСТАВЬ ФОТО ТОВАРА ЗДЕСЬ -->
                <h3>${item.title}</h3>
                <p>${item.desc}</p>
                <div class="price">⭐ ${stars}</div>
            </div>
            <button>+</button>
        `;

        card.querySelector("button").onclick = () => openCheckout(item, stars);
        menuEl.appendChild(card);
    });
}

function openCheckout(item, stars) {
    selectedItem = { item, stars };
    document.getElementById("checkoutTitle").innerText = item.title;
    document.getElementById("checkoutDesc").innerText = item.desc;
    document.getElementById("checkoutPrice").innerText = `К оплате: ⭐ ${stars}`;
    checkout.classList.remove("hidden");
}

document.getElementById("payBtn").onclick = () => {
    tg.sendData(JSON.stringify(selectedItem));
};

function closeCheckout() {
    checkout.classList.add("hidden");
}

function goHome() {
    checkout.classList.add("hidden");
}

renderMenu();
