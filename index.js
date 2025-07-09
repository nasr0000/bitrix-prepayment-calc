const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

app.post("/", async (req, res) => {
  try {
    const invoice = req.body;

    const invoiceId = invoice?.data?.FIELDS?.ID;
    const total = parseFloat(invoice?.data?.FIELDS?.OPPORTUNITY || 0);
    const prepayment = parseFloat(invoice?.data?.FIELDS?.UF_CRM_1752085304 || 0);

    const rest = total - prepayment;

    const webhook = "https://itnasr.bitrix24.kz/rest/1/bucjza1li2wbp6lr/";
    await axios.post(webhook + "crm.invoice.update", {
      id: invoiceId,
      fields: {
        UF_CRM_1752085331: rest
      }
    });

    res.status(200).send("OK");
  } catch (e) {
    console.error("Ошибка:", e.response?.data || e.message);
    res.status(500).send("ERROR");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});
