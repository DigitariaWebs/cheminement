import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBlog extends Document {
  title: string;
  excerpt?: string;
  content?: string;
  image?: string;
  author: {
    name: string;
    avatar?: string;
  };
  category: string;
  date: Date;
  readTime?: string;
  type: "internal" | "external";
  slug: string;
  externalUrl?: string;
  tags?: string[];
  published: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: true,
    },
    excerpt: String,
    content: String,
    image: String,
    author: {
      name: {
        type: String,
        required: true,
      },
      avatar: String,
    },
    category: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    readTime: String,
    type: {
      type: String,
      enum: ["internal", "external"],
      default: "internal",
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    externalUrl: String,
    tags: [String],
    published: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

BlogSchema.index({ category: 1, published: 1 });
BlogSchema.index({ published: 1, date: -1 });

const Blog: Model<IBlog> =
  mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema);

export default Blog;
