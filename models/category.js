const mongoose = require('mongoose');
const { Schema } = mongoose;

const categorySchema = new Schema({
    code: {//קוד קטגוריה ייחודי
        type: String,//סוג הנתון הוא מחרוזת
        required: true,//נדרש
        unique: true//ייחודי
    },
    description: {//תיאור הקטגוריה
        type: String,//סוג הנתון הוא מחרוזת
        required: true,//נדרש
        trim: true//מסיר רווחים מיותרים
    },
    recipeCount: {//מספר המתכונים בקטגוריה זו
        type: Number,//סוג הנתון הוא מספר
        default: 0//ברירת מחדל היא 0
    },
    recipes: [{//מערך של מתכונים ששייכים לקטגוריה זו
        type: Schema.Types.ObjectId,//שימוש בREFERENCE כדי לקשר למתכונים
        ref: 'Recipe'//השם של המודל שאליו אנחנו מקשרים
    }]
}, {
    timestamps: true//יוצר שדות createdAt ו-updatedAt אוטומטית
});

//ייצוא המודל של הקטגוריה לשימוש בקבצים אחרים
module.exports = mongoose.model('Category', categorySchema);