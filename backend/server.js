
const express = require("express");
const dotenv = require('dotenv');
const cors = require('cors');
const path = require("path");

const connectDB = require("./config/db");
const seedSuperAdmin = require("./seed");

const authRoutes = require('./routes/auth');
const userRoutes = require("./routes/userRoutes");
const userRoleRoutes = require("./routes/userRole"); 
const productRoutes = require("./routes/productRoutes");
const rawRoutes = require("./routes/rawRoutes");
const tagRoutes = require("./routes/tagRoute");
const newProductRoutes = require("./routes/newProductRoutes");

dotenv.config();


connectDB();

const app = express();


app.use(cors());
app.use(express.json());


const buildPath = path.join(__dirname, "../frontend/build");
app.use(express.static(buildPath));




app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', userRoleRoutes); 
app.use("/api/products", productRoutes); 
app.use("/api/raw", rawRoutes); 
app.use("/api/tags", tagRoutes);
app.use('/uploads', express.static('uploads'));
app.use("/api/new-products", newProductRoutes); 


app.get("/*", (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"), (err) => {
        if (err) {
            res.status(500).send(err);
        }
    });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});