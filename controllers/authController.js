const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

exports.signUp = async (req, res, next) => {
    const { username, password } = req.body;

    try {
        const hash = await bcrypt.hash(password, 12);
        const user = await User.create({ username, password: hash });
        req.session.user = user
        res.status(201).json({
            status: "success",
            data: {
                user
            }
        })
    } catch (error) {
        console.log("err ", error);
        res.status(400).json({
            status: "fail"
        })
    }
}

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({
                message: "no user found"
            })
        }

        const isCorrect = await bcrypt.compare(password, user.password);

        if (isCorrect) {
            req.session.user = user;
            res.status(200).json({
                status: "success",
            })
        }
        else {
            res.status(400).json({
                message: "invalid credentials"
            })
        }


    } catch (error) {
        console.log("err ", error);
        res.status(400).json({
            status: "fail"
        })
    }
}