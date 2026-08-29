const fs = require('fs');
const path = 'apps/web/src/locales/';
const uz = JSON.parse(fs.readFileSync(path + 'uz.json'));
const ru = JSON.parse(fs.readFileSync(path + 'ru.json'));
const en = JSON.parse(fs.readFileSync(path + 'en.json'));

const newKeys = {
  header: {
    delivery_info: "Yetkazib berish: butun O'zbekiston bo'ylab",
    work_hours: "Dush–Shanba: 09:00–19:00"
  },
  product: {
    payment_methods: "To'lov turlari",
    cash: "Naqd pul",
    delivery_title: "Yetkazib berish",
    delivery_desc: "Butun O'zbekiston bo'ylab tezkor yetkazib berish",
    warranty_title: "Kafolat",
    warranty_desc: "Rasmiy kafolat va xizmat ko'rsatish markazlari"
  },
  footer: {
    about_title: "Biz haqimizda",
    about_text: "MarketPro - O'zbekistondagi eng yirik onlayn do'konlardan biri. Biz sifatli mahsulotlar va a'lo xizmat ko'rsatishni taklif etamiz.",
    contact_title: "Aloqa",
    address: "Toshkent sh., Yunusobod tumani, 19-mavze",
    phone: "+998 90 215 52 16",
    email: "info@marketpro.uz"
  }
};

const newKeysRu = {
  header: {
    delivery_info: "Доставка: по всему Узбекистану",
    work_hours: "Пн–Сб: 09:00–19:00"
  },
  product: {
    payment_methods: "Способы оплаты",
    cash: "Наличные",
    delivery_title: "Доставка",
    delivery_desc: "Быстрая доставка по всему Узбекистану",
    warranty_title: "Гарантия",
    warranty_desc: "Официальная гарантия и сервисные центры"
  },
  footer: {
    about_title: "О нас",
    about_text: "MarketPro - один из крупнейших интернет-магазинов в Узбекистане. Мы предлагаем качественные товары и отличный сервис.",
    contact_title: "Контакты",
    address: "г. Ташкент, Юнусабадский район, 19-й квартал",
    phone: "+998 90 215 52 16",
    email: "info@marketpro.uz"
  }
};

const newKeysEn = {
  header: {
    delivery_info: "Delivery: all over Uzbekistan",
    work_hours: "Mon–Sat: 09:00–19:00"
  },
  product: {
    payment_methods: "Payment methods",
    cash: "Cash",
    delivery_title: "Delivery",
    delivery_desc: "Fast delivery all over Uzbekistan",
    warranty_title: "Warranty",
    warranty_desc: "Official warranty and service centers"
  },
  footer: {
    about_title: "About us",
    about_text: "MarketPro is one of the largest online stores in Uzbekistan. We offer quality products and excellent service.",
    contact_title: "Contacts",
    address: "Tashkent, Yunusabad district, 19th quarter",
    phone: "+998 90 215 52 16",
    email: "info@marketpro.uz"
  }
};

function deepMerge(target, source) {
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object && key in target) {
      Object.assign(source[key], deepMerge(target[key], source[key]));
    }
  }
  Object.assign(target || {}, source);
  return target;
}

deepMerge(uz, newKeys);
deepMerge(ru, newKeysRu);
deepMerge(en, newKeysEn);

fs.writeFileSync(path + 'uz.json', JSON.stringify(uz, null, 2));
fs.writeFileSync(path + 'ru.json', JSON.stringify(ru, null, 2));
fs.writeFileSync(path + 'en.json', JSON.stringify(en, null, 2));
console.log('Translations updated.');
