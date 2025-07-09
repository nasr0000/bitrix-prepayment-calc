const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

app.post("/", async (req, res) => {
  try {
    const invoice = req.body;

    // Извлекаем данные из входящего запроса
    const invoiceId = invoice?.data?.FIELDS?.ID;
    const total = parseFloat(invoice?.data?.FIELDS?.OPPORTUNITY || 0); // Сумма
    const prepayment = parseFloat(invoice?.data?.FIELDS?.UF_CRM_1752085304 || 0); // Предоплата

    const rest = total - prepayment;

    // Обновляем поле остатка
    const webhook = "https://itnasr.bitrix24.kz/rest/1/bucjza1li2wbp6lr/";
    const result = await axios.post(webhook + "crm.invoice.update", {
      id: invoiceId,
      fields: {
        UF_CRM_1752085331: rest
      }
    });

    return res.status(200).send("OK");
  } catch (e) {
    console.error(e);
    return res.status(500).send("ERROR");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
