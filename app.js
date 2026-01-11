const tg = window.Telegram.WebApp;
tg.ready();

// ====== МЕНЮ (структура как у Stars Coffee) ======
const menuData = {
    "Напитки": [
        { name: "Капучино", priceRub: 260 },
        { name: "Латте", priceRub: 280 }
    ],
    "Сэндвичи": [
        { name: "Сэндвич с курицей", priceRub: 390 }
    ],
    "Десерты": [
        { name: "Чизкейк", priceRub: 320 }
    ]
};

let selectedItem = null;

// ====== РЕНДЕР МЕНЮ ======
const menuDiv = document.getElementById("menu");

for (const category in menuData) {
    const cat = document.createElement("div");
    cat.className = "category";
    cat.innerText = category;
    menuDiv.appendChild(cat);

    menuData[category].forEach(item => {
        const starsPrice = Math.round(item.priceRub * 1.84);

        const div = document.createElement("div");
        div.className = "item";
        div.innerHTML = `
            <div class="image">Фото</div>
            <div class="info">
                <div>${item.name}</div>
                <div class="price">⭐ ${starsPrice}</div>
            </div>
        `;

        div.onclick = () => openConfirm(item, starsPrice);
        menuDiv.appendChild(div);
    });
}

// ====== СТРАНИЦЫ ======
function showPage(id) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}

// ====== ПОДТВЕРЖДЕНИЕ ======
function openConfirm(item, starsPrice) {
    selectedItem = { ...item, starsPrice };

    document.getElementById("confirm-name").innerText = item.name;
    document.getElementById("confirm-price").innerText = `⭐ ${starsPrice}`;

    showPage("page-confirm");
}

// ====== ОПЛАТА ======
document.getElementById("pay").onclick = () => {
    tg.openInvoice({
        title: selectedItem.name,
        description: "Заказ в Stars Coffee",
        currency: "XTR",
        prices: [{ label: selectedItem.name, amount: selectedItem.starsPrice }],
        payload: selectedItem.name
    });
};

// ====== УСПЕХ ======
tg.onEvent("invoiceClosed", (data) => {
    if (data.status === "paid") {
        tg.sendData(JSON.stringify({
            type: "payment_success",
            product: selectedItem.name,
            price: selectedItem.starsPrice
        }));

        document.getElementById("qr-image").src =
            "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=paid";

        showPage("page-qr");
    }
});

// ====== НАЗАД ======
document.getElementById("back").onclick = () => {
    showPage("page-menu");
};