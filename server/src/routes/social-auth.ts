import { Router } from "express";
import passport from "passport";
import session from "express-session";
import axios from "axios";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import {
  Strategy as GitHubStrategy,
  Profile as GitHubProfile,
} from "passport-github2";
import { socialLoginController } from "../controller/social-auth";

const socialAuthRouter = Router();

socialAuthRouter.use(
  session({
    secret: process.env.AUTH_SECRET!,
    resave: false,
    saveUninitialized: false,
  })
);

socialAuthRouter.use(passport.initialize());
socialAuthRouter.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj: any, done) => {
  done(null, obj);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URI!,
    },
    async (accessToken, refreshToken, profile, done) => {
      const { token, user } = await socialLoginController({
        user: {
          id: profile.id,
          name: profile.displayName,
          email: profile.emails?.[0]?.value,
        },
        account: { provider: "google" },
      });

      return done(null, { token, user });
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: process.env.GITHUB_CALLBACK_URI!,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: GitHubProfile,
      done: (error: any, user?: any) => void
    ) => {
      let email = profile.emails?.[0]?.value;

      if (!email) {
        try {
          const { data } = await axios.get(
            "https://api.github.com/user/emails",
            {
              headers: {
                Authorization: `token ${accessToken}`,
                "User-Agent": "taskflowtask-management",
              },
            }
          );

          // Find primary email
          const primaryEmail = data.find((e: any) => e.primary)?.email;
          email = primaryEmail || data[0]?.email;
        } catch (err) {
          console.log("GitHub email fetch failed:", err);
        }
      }

      if (!email) {
        return done(new Error("Unable to get email from GitHub"), null);
      }

      const { token, user } = await socialLoginController({
        user: {
          id: profile.id,
          name: profile.username,
          email: email,
        },
        account: { provider: "github" },
      });

      return done(null, { token, user });
    }
  )
);

// Google
socialAuthRouter.get(
  "/signin/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

socialAuthRouter.get(
  "/callback/google",
  passport.authenticate("google", { failureRedirect: "/auth/sign-in" }),
  (req, res) => {
    // @ts-ignore
    const token = req.user?.token;
    res.redirect(`${process.env.CLIENT_URL}?token=${token}`);
  }
);

// GitHub
socialAuthRouter.get(
  "/signin/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

socialAuthRouter.get(
  "/callback/github",
  passport.authenticate("github", { failureRedirect: "/auth/sign-in" }),
  (req, res) => {
    // @ts-ignore
    const token = req.user?.token;
    res.redirect(`${process.env.CLIENT_URL}?token=${token}`);
  }
);

export default socialAuthRouter;
