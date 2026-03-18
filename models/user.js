const mongoose = require('mongoose');// models/user.js
const { Schema } = mongoose;//זה המודל של המשתמש

const userSchema = new Schema({//הגדרת הסכמה של המשתמש
    username: {//שם המשתמש
        type: String,//סוג הנתון הוא מחרוזת
        required: true,//נדרש
        trim: true//מסיר רווחים מיותרים
    },
    password: {//סיסמה
        type: String,//סוג הנתון הוא מחרוזת
        required: true//נדרש
    },
    email: {//אימייל
        type: String,//סוג הנתון הוא מחרוזת
        required: true,//נדרש
        unique: true,//ייחודי
        lowercase: true,//ממיר לאותיות קטנות
        trim: true//מסיר רווחים מיותרים
    },
    address: {
        type: String,//כתובת
        trim: true//מסיר רווחים מיותרים
    },
    role: {
        type: String,//תפקיד
        enum: ['admin', 'user', 'guest'],//רשימת תפקידים אפשריים
        default: 'user'//ברירת מחדל היא משתמש רגיל שהו כמורשום באתר ולא מנהל או אורח כמו
    }
}, {
    timestamps: true//יוצר שדות createdAt ו-updatedAt אוטומטית
});

module.exports = mongoose.model('User', userSchema);//ייצוא המודל של המשתמש לשימוש בקבצים אחרים