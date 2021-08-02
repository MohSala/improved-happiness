const express = require("express");
const mongoose = require("mongoose");
const app = express();
const session = require("express-session");
const redis = require("redis");
const cors = require("cors");
const { MONGO_IP, MONGO_PASSWORD, MONGO_PORT, MONGO_USER, REDIS_URL, SESSION_SECRET, REDIS_PORT } = require("./config/config");
let RedisStore = require("connect-redis")(session);
let redisClient = redis.createClient({
    host: REDIS_URL,
    port: REDIS_PORT
})



const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoutes");
const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connectWithRetry = () => {
    mongoose.connect(mongoURL, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true })
        .then(() => console.log("Successfully connected to mongo"))
        .catch((e) => {
            console.log("err ", e)
            setTimeout(connectWithRetry, 5000);
        })
}

connectWithRetry();
app.enable("trust proxy");
app.use(cors({}))
app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_SECRET,
    cookie: {
        secure: false,
        resave: false,
        saveUninitialized: false,
        httpOnly: true,
        maxAge: 30000
    }
}))

app.use(express.json())

app.get("/api", (req, res) => {
    console.log("yeah it ran");
    res.send("hello there!!!")
})

app.use("/api/v1/posts", postRouter);
app.use("/api/v1/user", userRouter);

const port = process.env.PORT || 3001;

app.listen(port, () => console.log("Listening on 3001"));