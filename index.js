const express = require("express");
const axios = require("axios");
const app = express();

// Поддержка JSON-запросов
app.use(express.json());

// Для проверки в браузере (GET /)
app.get("/", (req, res) => {
  res.send("🚀 Сервер работает! Ожидаю POST от Bitrix24...");
});

// Обработка POST-запроса от Bitrix (изменение предоплаты)
app.post("/", async (req, res) => {
  try {
    const invoice = req.body;

    const invoiceId = invoice?.data?.FIELDS?.ID;
    const total = parseFloat(invoice?.data?.FIELDS?.OPPORTUNITY || 0);
    const prepayment = parseFloat(invoice?.data?.FIELDS?.UF_CRM_1752085304 || 0);

    const rest = total - prepayment;

    const webhook = "https://itnasr.bitrix24.kz/rest/1/bucjza1li2wbp6lr/";

    const result = await axios.post(`${webhook}crm.invoice.update`, {
      id: invoiceId,
      fields: {
        UF_CRM_1752085331: rest,
      },
    });

    console.log(`🧾 Счёт ${invoiceId}: сумма = ${total}, предоплата = ${prepayment}, остаток = ${rest}`);
    return res.status(200).send("OK");
  } catch (error) {
    console.error("❌ Ошибка при обработке запроса:", error?.response?.data || error.message);
    return res.status(500).send("Ошибка сервера");
  }
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("✅ Сервер запущен на порту", PORT);
});
