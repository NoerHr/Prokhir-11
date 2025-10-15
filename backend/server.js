require("dotenv").config();
const app = require("./src/app");

const port = process.env.PORT || 2006;

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
