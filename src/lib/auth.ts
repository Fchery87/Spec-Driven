"use server"

import { betterAuth } from "better-auth"

const baseURL = process.env.NEXT_PUBLIC_APP_URL || process.env.AUTH_BASE_URL

export const auth = betterAuth({
  baseURL,
  emailAndPassword: {
    enabled: true,
    async sendResetPassword(data) {
      console.log("Password reset requested", data.email)
    },
  },
  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET && {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      },
    }),
    ...(process.env.APPLE_CLIENT_ID &&
    process.env.APPLE_CLIENT_SECRET && {
      apple: {
        clientId: process.env.APPLE_CLIENT_ID,
        clientSecret: process.env.APPLE_CLIENT_SECRET,
      },
    }),
  },
})
