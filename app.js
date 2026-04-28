const express = require("express");
const cors = require("cors");
const env = require("./config/env");
const { connectDb } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");

const app = express();//זה מייצר אובייקט של express

app.use(cors());//זה מאפשר לנו לשלוח בקשות מהדור שונה לשרת
app.use(express.json());//זה מאפשר לנו לשלוח בקשות בפורמט json

app.get("/", (req, res) => {//זה מאפשר לנו לקבל בקשות מהשרת
  res.json({ message: "Recipe API is running" });//זה מאפשר לנו לשלוח תגובה ללקוח
});

app.use("/auth", authRoutes);//זה מאפשר לנו לשלוח בקשות לפונקציית auth
app.use("/users", userRoutes);//זה מאפשר לנו לשלוח בקשות לפונקציית user
app.use("/recipes", recipeRoutes);
app.use("/categories", categoryRoutes);//זה מאפשר לנו לשלוח בקשות לפונקציית category

app.use(notFound);//זה מאפשר לנו לשלוח בקשות לפונקציית notFound
app.use(errorHandler);

const startServer = async () => {//זה מאפשר לנו להפעיל את השרת
  try {
    if (!env.jwtSecret) {//זה אם יש לנו סוד של jwt
      throw new Error("JWT_SECRET is missing in environment variables.");//זה אם יש לנו סוד של jwt
    }

    await connectDb();//זה מאפשר לנו להתחבר למסד הנתונים
    app.listen(env.port, () => {//זה מאפשר לנו להפעיל את השרת
      console.log(`Server running on port ${env.port}`);
    });//זה מאפשר לנו להפעיל את השרת
  } catch (error) {//זה אם יש לנו שגיאה
    console.error("Failed to start server:", error.message);//זה מאפשר לנו להדפיס את השגיאה
    process.exit(1);//זה מאפשר לנו לסיים את התהליך
  }
};

startServer();//זה מאפשר לנו להפעיל את השרת