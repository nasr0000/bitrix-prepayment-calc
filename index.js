const express = require("express");
const axios = require("axios");
const app = express();

// Поддержка JSON-запросов
app.use(express.json());

// Проверка работоспособности
app.get("/", (req, res) => {
  res.send("🚀 Сервер работает! Ожидаю POST от Bitrix24...");
});

// Обработка POST-запроса от Bitrix24
app.post("/", async (req, res) => {
  try {
    // Лог полученных данных
    console.log("📩 Получен запрос от Bitrix:");
    console.log(JSON.stringify(req.body, null, 2));

    const invoice = req.body;

    const invoiceId = invoice?.data?.FIELDS?.ID;
    const total = parseFloat(invoice?.data?.FIELDS?.OPPORTUNITY || 0);
    const prepayment = parseFloat(invoice?.data?.FIELDS?.UF_CRM_1752085304 || 0);

    if (!invoiceId || isNaN(total)) {
      console.error("❌ Отсутствуют необходимые параметры ID или OPPORTUNITY.");
      return res.status(400).send("Неверные параметры: ID или OPPORTUNITY");
    }

    const rest = total - prepayment;

    const webhook = "https://itnasr.bitrix24.kz/rest/1/bucjza1li2wbp6lr/";

    // Обновление счёта в Bitrix24
    await axios.post(`${webhook}crm.invoice.update`, {
  id: invoiceId,
  fields: {
    UF_CRM_1752085331: rest
  }
});



    console.log(`✅ Обновлён счёт ${invoiceId}: сумма = ${total}, предоплата = ${prepayment}, остаток = ${rest}`);
    res.status(200).send("OK");
  } catch (error) {
    console.error("❌ Ошибка при обработке запроса:", error?.response?.data || error.message);
    res.status(500).send("Ошибка сервера");
  }
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Сервер запущен на порту ${PORT}`);
});
