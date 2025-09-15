const express = require("express")
require("dotenv").config()
const app = express()

app.use(express.json())

const PORT = process.env.PORT || 5000;

const musician_db = []

// see muscian api
app.get("/music", (req, res) => {
    if (musician_db.length === 0) {
        return res.status(401).json({
            success: false,
            message: "No musician found"
        })   
    }
    return res.status(200).json({
        success: true,
        data: musician_db,
        message: "Musician retrived successfully"
    })
})

// post/add muscian to db
app.post("/music_post", (req, res) => {
    const { name, gender, song, genre, country } = req.body;

    if (!name || !gender || !song || !genre || !country) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    const newMusician = {
        id: musician_db.length + 1,
        name: name,
        gender: gender,
        song: song,
        genre: genre,
        country: country,
    };

    musician_db.push(newMusician);

    return res.status(201).json({
        success: true,
        data: newMusician,
        message: "Musician added successfully"
    });
})

// see a single muscian
app.get("/music/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const musician = musician_db.find(m => m.id === id);
    
    if (!musician) {
        return res.status(404).json({
            success: false,
            message: "Musician not found"
        });
    }
    
    return res.status(200).json({
        success: true,
        data: musician,
        message: "Musician retrieved successfully"
    });
})

// update a muscian by id
app.put("/music_update/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = musician_db.findIndex(m => m.id === id);

    if (index === -1) {
        return res.status(404).json({ success: false, message: "Musician not found" });
    }

    musician_db[index] = { ...musician_db[index], ...req.body };

    return res.status(200).json({
        success: true,
        data: musician_db[index],
        message: "Musician updated successfully"
    });
});

// delete a muscian from db 
app.delete("/music_delete/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = musician_db.findIndex(m => m.id === id);

    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: "Musician not found"
        });
    }

    const deleted = musician_db.splice(index, 1);

    return res.status(200).json({
        success: true,
        data: deleted[0],
        message: "Musician deleted successfully"
    });
});

app.listen(PORT, () => {
    console.log(`running on port ${PORT}`)
})