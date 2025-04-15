import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createProfile = mutation({
    args: {
        name: v.string(),
        email: v.string(),
        password: v.string()
    },
    handler: async (ctx, args) => {
        await ctx.db.insert('profile', {
            name: args.name,
            email: args.email,
            password: args.password
        })

    }

});