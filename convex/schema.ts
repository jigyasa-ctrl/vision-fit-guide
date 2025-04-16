import { defineTable, defineSchema } from "convex/server";
import {v} from 'convex/values'

export default defineSchema({
    profile: defineTable({
        name: v.string(),
        email: v.string(),
        password: v.string(),
    })
      .index("by_email", ["email"])
  });
