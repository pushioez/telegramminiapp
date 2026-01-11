const tg = window.Telegram.WebApp;
tg.ready();

// ====== ДАННЫЕ КОФЕЕН (пример, можно расширять) ======
const cafes = [
    { name: "Stars Coffee Тверская", lat: 55.7652, lon: 37.6051 },
    { name: "Stars Coffee Арбат", lat: 55.7520, lon: 37.5926 },
    { name: "Stars Coffee Сити", lat: 55.7498, lon: 37.5395 }
];

// ====== ФУНКЦИЯ ДИСТАНЦИИ ======
function distance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

// ====== ГЕОЛОКАЦИЯ И ПОИСК БЛИЖАЙШЕЙ КОФЕЙНИ ======
tg.requestLocation((location) => {
    if (!location) {
        document.getElementById("nearest").innerText =
            "Не удалось получить геолокацию";
        return;
    }

    let nearest = cafes[0];
    let minDist = distance(
        location.latitude,
        location.longitude,
        cafes[0].lat,
        cafes[0].lon
    );

    cafes.forEach(cafe => {
        const d = distance(
            location.latitude,
            location.longitude,
            cafe.lat,
            cafe.lon
        );
        if (d < minDist) {
            minDist = d;
            nearest = cafe;
        }
    });

    document.getElementById("nearest").innerText =
        "Ближайшая кофейня: " + nearest.name;
});

// ====== ОПЛАТА TELEGRAM STARS ======
document.getElementById("pay").onclick = () => {
    tg.openInvoice({
        title: "Кофе",
        description: "Капучино 300 мл",
        currency: "XTR", // Telegram Stars
        prices: [
            { label: "Капучино", amount: 120 }
        ],
        payload: "coffee_120"
    });
};

// ====== ОТЛОВ УСПЕШНОЙ ОПЛАТЫ ======
tg.onEvent("invoiceClosed", (data) => {
    if (data.status === "paid") {
        tg.sendData(JSON.stringify({
            type: "payment_success",
            product: "coffee",
            price: 120
        }));
    }
});