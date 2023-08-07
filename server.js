require("dotenv").config();
const {PORT = 8000, DATABASE_URL} = process.env
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const cors = require("cors")
const morgan = require("morgan")

// DATABASE CONNECTION
mongoose.connect(DATABASE_URL)

// CONNECTION EVENTS
mongoose.connection
.on("open", () => console.log("Mongoose connection successful."))
.on("close", () => console.log("Mongoose connection closed."))
.on("error", (error) => console.log(error))

// MODELS 
const cheeseSchema = new mongoose.Schema({
    name: String,
    countryOfOrigin: String,
    image: String
})
const Cheeses = mongoose.model("Cheese", cheeseSchema)

// MIDDLEWARE
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())

// ROUTES
// INDEX ROUTE - GET
app.get("/cheese", async (req, res) => {
    try {
        const cheese = await Cheeses.find({});
        res.json(cheese);
    } catch (error) {
        res.status(400).json({error});
    }
});

// CREATE ROUTE - POST
app.post("/cheeses", async (req, res) => {
    try {
        const cheese = await Cheeses.create(req.body)
        res.json(cheese)
    } 
    catch(error){
        res.status(400).json({error})
    }
})

// SHOW ROUTE - GET
app.get("/cheeses/:id", async (req, res) => {
    try {
        const cheese = await Cheeses.findById(req.params.id);
        res.json(cheese);
    } catch (error) {
        res.status(400).json({error});
    }
})

// UPDATE ROUTE - PUT
app.put("/cheeses/:id", async (req, res) => {
    try {
        const cheese = await Cheeses.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        res.json(cheese);
    } catch (error) {
        res.status(400).json({error});
    }
});

// DELETE ROUTE
app.delete("/cheeses/:id", async (req, res) => {
    try {
        const cheese = await Cheeses.findByIdAndDelete(req.params.id)
        res.status(204).json(cheese)
    } catch (error) {
        res.status(400).json({error});
    }
});

// LISTENER
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))