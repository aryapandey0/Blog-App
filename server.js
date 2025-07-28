const express=require('express')
const cors=require('cors')
const mongoose=require('mongoose')
const app=express();
require('dotenv').config(); 

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

const authRoutes=require("./routes/authRoutes")
app.use("/api/auth",authRoutes);

const postRoutes = require('./routes/postRoutes');
app.use("/api/posts", postRoutes);

const commentRoutes = require("./routes/commentRoutes")
app.use("/api/comment",commentRoutes);

const PORT=process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("MongoDB Connected ✅");
  app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}✅`);
  });
})
.catch((err) => {
  console.log("MongoDB connection failed ❌", err);
});
