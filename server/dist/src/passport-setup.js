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
    const existingUser = await prisma.user.findUnique({ where: { email: profile.emails[0].value } });
    if (existingUser) {
        const updatedUser = await prisma.user.update({
            where: { id: existingUser.id },
            data: { googleId: profile.id },
        });
        done(null, updatedUser);
    }
    else {
        const user = await prisma.user.upsert({
            where: { googleId: profile.id },
            update: { googleId: profile.id, username: profile.displayName, email: profile.emails[0].value },
            create: { googleId: profile.id, username: profile.displayName, email: profile.emails[0].value }
        });
        done(null, user);
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
    const existingUser = await prisma.user.findUnique({ where: { email: profile.emails[0].value } });
    if (existingUser) {
        const updatedUser = await prisma.user.update({
            where: { id: existingUser.id },
            data: { githubId: profile.id },
        });
        done(null, updatedUser);
    }
    else {
        const user = await prisma.user.upsert({
            where: { githubId: profile.id },
            update: { githubId: profile.id, username: profile.displayName, email: profile.emails[0].value },
            create: { githubId: profile.id, username: profile.displayName, email: profile.emails[0].value },
        });
        done(null, user);
    }
}));
//# sourceMappingURL=passport-setup.js.map