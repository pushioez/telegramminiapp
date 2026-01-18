const tg = Telegram.WebApp;
tg.ready();

const RATE = 1.84;

/* ====== РЕГИСТРАЦИЯ ====== */
const userId = tg.initDataUnsafe?.user?.id;

function registerUser() {
    tg.CloudStorage.getItem("user_registered", (err, value) => {
        if (!value) {
            tg.CloudStorage.setItem("user_registered", "true");
            tg.CloudStorage.setItem("orders", JSON.stringify([]));
        }
    });
}

registerUser();

/* ====== ДАННЫЕ МЕНЮ (НЕ ТРОГАЛ) ====== */
const data = {
    "Авторские напитки": [
        {
            title: "Латте Лимонный Курд с Шоколадом",
            desc: "Нежный и сливочный напиток...",
            price: 425,
            image: "latte_lemon_curd_choco.jpg"
        },
        {
            title: "Цикорий Молочный",
            desc: "Нежный горячий напиток...",
            price: 335,
            image: "chicory_milk.jpg"
        },
        {
            title: "Цикорий Сливочная Карамель",
            desc: "Сливочный горячий напиток...",
            price: 370,
            image: "chicory_caramel.jpg"
        }
    ],

    "Выпечка": [
        {
            title: "Бельгийская вафля",
            desc: "Нежная бельгийская вафля...",
            price: 290,
            image: "belgian_waffle.jpg"
        },
        {
            title: "Брецель с солёным маслом",
            desc: "Натуральные ингредиенты...",
            price: 420,
            image: "pretzel_salted_butter.jpg"
        },
        {
            title: "Круассан миндальный",
            desc: "Классический круассан...",
            price: 320,
            image: "croissant_almond.jpg"
        },
        {
            title: "Круассан с сыром",
            desc: "Хрустящий круассан...",
            price: 270,
            image: "croissant_cheese.jpg"
        },
        {
            title: "Лимонный кекс",
            desc: "Воздушный ванильный кекс...",
            price: 250,
            image: "lemon_cake.jpg"
        },
        {
            title: "Трубочка с варёной сгущёнкой",
            desc: "Золотистое лакомство...",
            price: 290,
            image: "wafer_roll_condensed_milk.jpg"
        }
    ],

    "Чай и шоколад": [
        {
            title: "Горячий шоколад",
            desc: "Изысканный вкус...",
            price: 385,
            image: "hot_chocolate.jpg"
        },
        {
            title: "Маття Чай Латте",
            desc: "Фирменный напиток...",
            price: 395,
            image: "matcha_latte.jpg"
        },
        {
            title: "Пряный Чай Латте",
            desc: "Удивительный вкус...",
            price: 385,
            image: "spiced_tea_latte.jpg"
        },
        {
            title: "Сливочный Шоколад Крем-Сода",
            desc: "Фирменный шоколад...",
            price: 395,
            image: "cream_soda_chocolate.jpg"
        }
    ],

    "Комбо в доставке": [
        {
            title: "Комбо завтрак",
            desc: "Начните свой день...",
            price: 730,
            image: "combo_breakfast.jpg"
        },
        {
            title: "Комбо с десертом",
            desc: "Для сладкоежек...",
            price: 705,
            image: "combo_dessert.jpg"
        },
        {
            title: "Комбо с круассан-роллом",
            desc: "Сытный вариант...",
            price: 780,
            image: "combo_croissant_roll.jpg"
        },
        {
            title: "Комбо с сырниками",
            desc: "Авторский кофе...",
            price: 705,
            image: "combo_syrniki.jpg"
        }
    ]
};

/* ====== UI ====== */
const categoriesEl = document.getElementById("categories");
const menuEl = document.getElementById("menu");
const checkout = document.getElementById("checkout");

let currentCategory = Object.keys(data)[0];
let selectedItem = null;

/* категории */
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

/* рендер меню */
function renderMenu() {
    menuEl.innerHTML = "";

    data[currentCategory].forEach(item => {
        const stars = Math.round(item.price * RATE);

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <div class="info">
                <img src="images/${item.image}">
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

/* checkout */
function openCheckout(item, stars) {
    selectedItem = { item, stars, date: new Date().toISOString() };
    document.getElementById("checkoutTitle").innerText = item.title;
    document.getElementById("checkoutDesc").innerText = item.desc;
    document.getElementById("checkoutPrice").innerText = `К оплате: ⭐ ${stars}`;
    checkout.classList.remove("hidden");
}

document.getElementById("payBtn").onclick = () => {
    tg.CloudStorage.getItem("orders", (err, value) => {
        const orders = value ? JSON.parse(value) : [];
        orders.push(selectedItem);
        tg.CloudStorage.setItem("orders", JSON.stringify(orders));
        tg.sendData(JSON.stringify(selectedItem));
    });
};

renderMenu();
