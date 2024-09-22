require("dotenv").config(); 

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser'); // Corrected the typo
const Blog = require('./models/blog')

const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');
const { checkForAuthenticationCookie } = require('./middlewares/authentication');

const app = express();
const PORT = process.env.PORT || 8000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("MongoDB connected"))
.catch(()=> console.error("MongoDB connection error:"));

// Set up view engine
app.set('view engine', 'ejs');
app.set("views", path.resolve("./views"));

// Middleware setup
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve('./public')));

// Routes
app.get('/', async (req, res) => {
    const allBlogs = await Blog.find();
    res.render('homepage', {
        user: req.user,  // Assuming req.user is set by checkForAuthenticationCookie middleware
        blogs: allBlogs,  // Assuming allBlogs is an array of blog objects
    });
});

app.use('/user', userRoute);
app.use('/blog', blogRoute);

// // Global error handler
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send('Something broke!');
// });

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
