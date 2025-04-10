import { google } from "@ai-sdk/google";
import { customProvider } from "ai";

export const myProvider = customProvider({
  languageModels: {
    "gemini-2.0-flash": google("gemini-2.0-flash-001"),
    "title-model": google("gemini-2.0-flash-001"),
  },
});
