const tg = window.Telegram.WebApp;
tg.expand();

const menu = [
    { id: 1, name: "Капучино", price: 150 },
    { id: 2, name: "Латте", price: 170 }
];

const container = document.getElementById("menu");

menu.forEach(item => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
        <img src="placeholder.jpg">
        <div class="info">
            <b>${item.name}</b>
            <p>Описание напитка</p>
            <div class="price">⭐ ${item.price}</div>
            <button>Оплатить</button>
        </div>
    `;

    div.querySelector("button").onclick = () => {
        tg.sendData(item.id.toString());
    };

    container.appendChild(div);
});