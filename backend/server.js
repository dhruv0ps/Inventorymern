
const express = require("express");
const dotenv = require('dotenv');
const cors = require('cors');


const connectDB = require("./config/db");
const seedSuperAdmin = require("./seed");

const authRoutes = require('./routes/auth');
const userRoutes = require("./routes/userRoutes");
const userRoleRoutes = require("./routes/userRole"); 
const productRoutes = require("./routes/productRoutes");
const rawRoutes = require("./routes/rawRoutes");
const tagRoutes = require("./routes/tagRoute");
const newProductRoutes = require("./routes/newProductRoutes");
const otherLogin = require("./routes/otheruserRoutes")
const customerroutes = require("./routes/customerRoutes")
const customerCategoryRoutes = require('./routes/customerCategoryRoutes');
const agnetRoutes = require("./routes/Agent");
dotenv.config();


connectDB();

const app = express();


app.use(cors());
app.use(express.json());







app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api', userRoleRoutes); 
app.use("/api", productRoutes); 
app.use("/api", rawRoutes); 
app.use("/api", tagRoutes);
app.use('/uploads', express.static('uploads'));
app.use("/api", newProductRoutes); 
app.use("/api",otherLogin);
app.use("/api/customers",customerroutes)
app.use('/api/customercategories', customerCategoryRoutes);
app.use("/api/agent",agnetRoutes);


const PORT = process.env.PORT || 8080;


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});