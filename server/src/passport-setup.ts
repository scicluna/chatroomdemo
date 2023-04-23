import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Profile as GitHubProfile } from "passport-github2";

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


passport.serializeUser((user: Express.User, done) => {
    done(null, user);
});

passport.deserializeUser((user: Express.User, done) => {
    done(null, user);
});

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            callbackURL: "/auth/google/callback",
        },
        async (_accessToken, _refreshToken, profile, done) => {
            if (!profile.emails) return new Error("Email not available from Google")

            const user = await prisma.user.upsert({
                where: { googleId: profile.id },
                update: { googleId: profile.id, username: profile.displayName, email: profile.emails[0].value },
                create: { googleId: profile.id, username: profile.displayName, email: profile.emails[0].value }
            });
            done(null, user);
        }
    )
)

passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
            callbackURL: "/auth/github/callback",
        },
        async (_accessToken: string, _refreshToken: string, profile: GitHubProfile, done: (error: any, user?: any) => void) => {
            if (!profile.emails) return new Error("Email not available from Github")

            const user = await prisma.user.upsert({
                where: { githubId: profile.id },
                update: { githubId: profile.id, username: profile.displayName, email: profile.emails[0].value },
                create: { githubId: profile.id, username: profile.displayName, email: profile.emails[0].value },
            });
            done(null, user);
        }
    )
);