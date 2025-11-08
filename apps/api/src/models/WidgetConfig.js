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


