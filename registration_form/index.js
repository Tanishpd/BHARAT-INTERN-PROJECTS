const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser"); 
const dotenv = require("dotenv");

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/frontend/index.html");
});

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.mgq8g.mongodb.net/registrationFormDB`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch((error) => {
    console.error("MongoDB connection error:", error);
    throw new Error("MongoDB connection failed");
});

const registrationSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
});

const Registration = mongoose.model("Registration", registrationSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await Registration.findOne({ email });

        if (existingUser) {
            console.log("User already exists");
            throw new Error("User already exists");
        }

        const registrationData = new Registration({
            name,
            email,
            password,
        });

        await registrationData.save();
        res.redirect("/success");
    } catch (error) {
        console.error("Error during registration:", error);
        res.redirect("/error");
    }
});

app.get("/success", (req, res) => {
    res.sendFile(__dirname + "/frontend/success.html");
});

app.get("/error", (req, res) => {
    res.sendFile(__dirname + "/frontend/error.html");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
