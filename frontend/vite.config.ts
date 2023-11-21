import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: "Mazda Driver Identity",
        short_name: "Mazda Driver Identity",
        description:
          "車の乗車体験をデジタルアイデンティティとして再定義し、乗車履歴や旅の思い出をデジタルスキンやアクセサリーなどを通じて視覚化。このアプローチにより、ドライブ体験はより深化し、アイデンティティの表現としての新たな価値を持たせることができる。また、ドライバー同士の交流や地域との結びつきを促進するコミュニケーションツールとしても機能する。",

        icons: [
          {
            src: "favicon.ico",
            sizes: "64x64 32x32 24x24 16x16",
            type: "image/x-icon",
          },
          {
            src: "logo192.png",
            type: "image/png",
            sizes: "192x192",
          },
          {
            src: "logo512.png",
            type: "image/png",
            sizes: "512x512",
          },
        ],
        start_url: "index.html",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#000000",
        lang: "ja",
      },
    }),
  ],
});
