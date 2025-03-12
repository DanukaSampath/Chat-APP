import jwt from 'jsonwebtoken';

const generateTokenAndSetCookie = (userID, res) => {
    const token = jwt.sign({userID}, process.env.JWT_SECRET, {
        expiresIn: "15d",
    });
        res.cookie("jwt", token, { 
        maxAge: 15 * 24 * 60 * 60 * 1000, //miliseconds
        httpOnly: true, //prevent cookie access from javascript
        sameSite: "strict", //cross site attcak
        secure: process.env.NODE_ENV !== "development",
        });
};

export default generateTokenAndSetCookie;
