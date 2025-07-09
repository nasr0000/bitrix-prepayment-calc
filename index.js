const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const BITRIX_WEBHOOK = 'https://itnasr.bitrix24.kz/rest/1/bucjza1li2wbp6lr/';

app.post('/calculate', async (req, res) => {
  const { id, opportunity, UF_CRM_1752085304 } = req.body;
  const prepay = parseFloat(UF_CRM_1752085304 || 0);
  const amount = parseFloat(opportunity || 0);
  const balance = amount - prepay;

  try {
    await axios.post(`${BITRIX_WEBHOOK}crm.deal.update.json`, {
      id,
      fields: {
        UF_CRM_1752085331: balance
      }
    });
    res.send({ success: true, balance });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send({ error: 'Ошибка при обновлении сделки' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер работает на порту ${PORT}`);
});