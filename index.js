const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

const WEBHOOK_BASE = "https://itnasr.bitrix24.kz/rest/1/bucjza1li2wbp6lr";

app.post("/webhook", async (req, res) => {
  try {
    const invoice = req.body;
    const invoiceId = invoice.id;

    const prepayment = parseFloat(invoice.UF_CRM_1752085304) || 0;
    const total = parseFloat(invoice.OPPORTUNITY) || 0;

    const remaining = total - prepayment;

    await axios.post(`${WEBHOOK_BASE}/crm.invoice.update`, {
      id: invoiceId,
      fields: {
        UF_CRM_1752085331: remaining.toFixed(2)
      }
    });

    res.status(200).send("Остаток успешно обновлен");
  } catch (err) {
    console.error("Ошибка при обработке:", err.message);
    res.status(500).send("Ошибка сервера");
  }
});

app.get("/", (_, res) => {
  res.send("Сервер работает!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
