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

export const validateCrendential = mutation({
    args: {
        email: v.string(),
        password: v.string()
    },
    handler: async (ctx, args) => {
        const user = await ctx.db
          .query("profile")
          .withIndex("by_email", (q) => q.eq("email", args.email))
          .unique();
          console.log(user?.email,"user")
          if (!user) {
            throw new Error('User not found');
          }
          if(args.email === user?.email && args.password === user?.password){
            return user
          } else{
            throw new Error("Please enter valid username and password")
          }
    }

});