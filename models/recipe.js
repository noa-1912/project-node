const mongoose = require("mongoose");

const { Schema } = mongoose;

const layerSchema = new Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    ingredients: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
  },
  { _id: false }
);

const recipeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
    ],
    prepTimeMinutes: {
      type: Number,
      required: true,
      min: 1,
    },
    difficulty: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    dateAdded: {
      type: Date,
      default: Date.now,
    },
    layers: [layerSchema],
    instructions: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    image: {
      type: String,
      trim: true,
      default: "",
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

recipeSchema.index({ name: "text", description: "text", instructions: "text" });

module.exports = mongoose.model("Recipe", recipeSchema);