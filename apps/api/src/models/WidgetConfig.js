import mongoose from "mongoose";

const widgetConfigSchema = new mongoose.Schema(
  {
    projectId: {
      type: String,
      required: true,
      unique: true,
    },
    agentName: {
      type: String,
      default: "Riya from Homesfy",
    },
    avatarUrl: {
      type: String,
      default: "https://cdn.homesfy.com/assets/riya-avatar.png",
    },
    primaryColor: {
      type: String,
      default: "#6158ff",
    },
    followupMessage: {
      type: String,
      default: "Sure… I’ll send that across right away!",
    },
    bhkPrompt: {
      type: String,
      default: "Which configuration you are looking for?",
    },
    inventoryMessage: {
      type: String,
      default: "That’s cool… we have inventory available with us.",
    },
    phonePrompt: {
      type: String,
      default: "Please enter your mobile number...",
    },
    thankYouMessage: {
      type: String,
      default: "Thanks! Our expert will call you shortly 📞",
    },
    bubblePosition: {
      type: String,
      enum: ["bottom-right", "bottom-left"],
      default: "bottom-right",
    },
    autoOpenDelayMs: {
      type: Number,
      default: 4000,
    },
    welcomeMessage: {
      type: String,
      default: "Hi, I’m Riya from Homesfy 👋\nHow can I help you today?",
    },
    createdBy: {
      type: String,
    },
    updatedBy: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const WidgetConfig = mongoose.model("WidgetConfig", widgetConfigSchema);


