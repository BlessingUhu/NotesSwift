/** @type {import('next').NextConfig} */
const nextConfig = {};
const path = require("path");

module.exports = nextConfig;

module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
    prependData: `@import "/app/variables.scss";`,
  },
  env: {
    MONGODB: "mongodb+srv://blessing2002feb:TwYM8a2IZZ1vhIWi@cluster0.ixsokg8.mongodb.net/",
    NEXTAUTH_URL: "http://localhost:3000",
    NEXTAUTH_SECRET: "FYRHFFUfjsoJDD69DKID5IDHdjf0KMDJDJFKJFN=",
    GOOGLE_CLIENT_SECRET: "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",
    GOOGLE_CLIENT_ID: "946843435867-l7cir3ei00r6j7bn118rj1g5tv5uppag.apps.googleusercontent.com",
    MAILTRAP_USERNAME:"67b42fa788030a",
    MAILTRAP_PASSWORD: "6f9f8ad5146a02",
  },
};
