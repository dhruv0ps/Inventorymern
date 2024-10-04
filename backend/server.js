const express = require("express");
const dotenv = require('dotenv');
const cors = require('cors');

const coonectDB = require("./config/db");
const seedSuperAdmin = require("./seed");
const authRoutes = require('./routes/auth');
const userRoutes = require("./routes/userRoutes");
const userRole = require("./routes/userRole");
const productRoutes = require("./routes/productRoutes");
const rawRoutes = require("./routes/rawRoutes");
const tagRoutes = require("./routes/tagRoute");
const newProductRoutes = require("./routes/newProductRoutes")
dotenv.config();
coonectDB();
const app = express();
app.use(express.json());
app.use(cors());
seedSuperAdmin();

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api',userRole)
app.use("/api",productRoutes)
app.use("/api",rawRoutes )
app.use("/api",tagRoutes)
app.use('/uploads', express.static('uploads')); 
app.use("/api",newProductRoutes)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});