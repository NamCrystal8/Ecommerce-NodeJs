const app = require("./src/app");
const mongoose = require('mongoose')
const PORT = process.env.DEV_APP_PORT || 3055;

const server = app.listen(PORT, () => {
    console.log(`WSV eCommerce start with port ${PORT}`);
});
process.on("SIGINT", () => {
    server.close(() => {
        console.log("Exit Server Express")
        mongoose.connection.close(() => {
            console.log("Exit MongoDB")
            process.exit()
        })
    });
})