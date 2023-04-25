import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
}, async (_accessToken, _refreshToken, profile, done) => {
    if (!profile.emails)
        return new Error("Email not available from Google");
    const userEmail = profile.emails[0].value;
    try {
        const user = await prisma.$transaction(async (prisma) => {
            const existingUser = await prisma.user.findUnique({ where: { email: userEmail } });
            if (existingUser) {
                return await prisma.user.update({
                    where: { id: existingUser.id },
                    data: { googleId: profile.id },
                });
            }
            else {
                return await prisma.user.create({
                    data: {
                        googleId: profile.id,
                        username: profile.displayName,
                        email: userEmail,
                    },
                });
            }
        });
        done(null, user);
    }
    catch (error) {
        done(error);
    }
}));
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/auth/github/callback",
    scope: ["user:email"]
}, async (_accessToken, _refreshToken, profile, done) => {
    if (!profile.emails)
        return new Error("Email not available from GitHub");
    const userEmail = profile.emails[0].value;
    try {
        const user = await prisma.$transaction(async (prisma) => {
            const existingUser = await prisma.user.findUnique({ where: { email: userEmail } });
            if (existingUser) {
                return await prisma.user.update({
                    where: { id: existingUser.id },
                    data: { githubId: profile.id },
                });
            }
            else {
                return await prisma.user.create({
                    data: {
                        githubId: profile.id,
                        username: profile.displayName,
                        email: userEmail,
                    },
                });
            }
        });
        done(null, user);
    }
    catch (error) {
        done(error);
    }
}));
//# sourceMappingURL=passport-setup.js.map