// Run unchanged S01–S11 browser contracts against production only.
import { defineConfig } from "@playwright/test";
import inputConfig from "./v22-input.config.mjs";

export default defineConfig({ ...inputConfig, testMatch: "browser-baseline.pw.ts" });
