import type { ElectrobunConfig } from "electrobun";

export default {
  app: {
    name: "Mark9",
    identifier: "dev.mark9.editor",
    version: "0.0.1",
    description: "WYSIWYG Markdown Editor — Local-first, Git-native",
  },

  build: {
    copy: {
      "../web/dist/index.html": "views/main/index.html",
      "../web/dist/assets": "views/main/assets",
    },
    watchIgnore: ["../web/dist/**"],
  },

  runtime: {
    exitOnLastWindowClosed: true,
  },
} satisfies ElectrobunConfig;
