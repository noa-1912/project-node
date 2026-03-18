const mongoose = require('mongoose');//
const { Schema } = mongoose;//זה המודל של המתכון

const layerSchema = new Schema({//הגדרת הסכמה של השכבה במתכון
    description: {//תיאור השכבה
        type: String,//סוג הנתון הוא מחרוזת
        required: true,//נדרש
        trim: true//מסיר רווחים מיותרים
    },//מערך של מרכיבים בשכבה זו
    ingredients: [{//מערך של מרכיבים בשכבה זו
        type: String,//סוג הנתון הוא מחרוזת
        required: true,//נדרש
        trim: true//מסיר רווחים מיותרים
    }]
}, { _id: false });//לא ליצור שדה _id אוטומטית לכל שכבה כי זה לא נחוץ

const recipeSchema = new Schema({//הגדרת הסכמה של המתכון
    name: {//שם המתכון
        type: String,//סוג הנתון הוא מחרוזת
        required: true,//נדרש
        trim: true//מסיר רווחים מיותרים
    },
    description: {//תיאור המתכון
        type: String,
        required: true,//נדרש
        trim: true//מסיר רווחים מיותרים
    },
    categories: [{//מערך של קטגוריות שהמתכון שייך אליהן
        type: Schema.Types.ObjectId,//שימוש בREFERENCE כדי לקשר לקטגוריות
        ref: 'Category',//השם של המודל שאליו אנחנו מקשרים
        required: true//נדרש
    }],
    prepTimeMinutes: {//זמן ההכנה בדקות
        type: Number,//סוג הנתון הוא מספר
        required: true,//נדרש
        min: 1//הזמן חייב להיות לפחות דקה אחת
    },
    difficulty: {//רמת הקושי של המתכון
        type: Number,//סוג הנתון הוא מספר
        required: true,//נדרש
        min: 1,//הרמה חייבת להיות לפחות 1
        max: 5//הרמה לא יכולה להיות יותר מ-5
    },
    dateAdded: {//תאריך ההוספה
        type: Date,
        default: Date.now
    },
    layers: [layerSchema],//מערך של שכבות במתכון, כל שכבה היא אובייקט לפי הסכמה שהגדרנו למעלה
    instructions: [{//מערך של הוראות הכנה למתכון
        type: String,
        required: true,
        trim: true
    }],
    image: {//קישור לתמונה של המתכון
        type: String,//סוג הנתון הוא מחרוזת
        trim: true//מסיר רווחים מיותרים
    },
    isPrivate: {//האם המתכון פרטי או ציבורי
        type: Boolean,
        default: false//ברירת מחדל היא שהמתכון ציבורי
    },
    createdBy: {//המשתמש שיצר את המתכון נשמר רק כREFERENCE לשם שמירת הקשר בין המתכון למשתמש שיצר אותו
        type: Schema.Types.ObjectId,//שימוש בREFERENCE כדי לקשר למשתמש שיצר את המתכון
        ref: 'User',//השם של המודל שאליו אנחנו מקשרים
        required: true//נדרש
    }
}, {
    timestamps: true//יוצר שדות createdAt ו-updatedAt אוטומטית
});

module.exports = mongoose.model('Recipe', recipeSchema);//ייצוא המודל של המתכון לשימוש בקבצים אחרים