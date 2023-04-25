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
            if (!profile.emails) return new Error("Email not available from Google");

            const userEmail = profile.emails[0].value;

            try {
                const user = await prisma.$transaction(async (prisma) => {
                    const existingUser = await prisma.user.findUnique({ where: { email: userEmail } });

                    if (existingUser) {
                        return await prisma.user.update({
                            where: { id: existingUser.id },
                            data: { googleId: profile.id },
                        });
                    } else {
                        return await prisma.user.create({
                            data: {
                                googleId: profile.id ? profile.id : null,
                                githubId: null,
                                username: profile.displayName,
                                email: userEmail,
                            },
                        });
                    }
                });

                done(null, user);
            } catch (error: any) {
                done(error);
            }
        }
    )
);

passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
            callbackURL: "/auth/github/callback",
            scope: ["user:email"]
        },
        async (_accessToken: string, _refreshToken: string, profile: GitHubProfile, done: (error: any, user?: any) => void) => {
            if (!profile.emails) return new Error("Email not available from GitHub");

            const userEmail = profile.emails[0].value;

            try {
                const user = await prisma.$transaction(async (prisma) => {
                    const existingUser = await prisma.user.findUnique({ where: { email: userEmail } });

                    if (existingUser) {
                        return await prisma.user.update({
                            where: { id: existingUser.id },
                            data: { githubId: profile.id },
                        });
                    } else {
                        return await prisma.user.create({
                            data: {
                                githubId: profile.id ? profile.id : null,
                                googleId: null,
                                username: profile.displayName,
                                email: userEmail,
                            },
                        });
                    }
                });

                done(null, user);
            } catch (error) {
                done(error);
            }
        }
    )
);
