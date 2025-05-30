const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API running 🚀');
  });

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});
