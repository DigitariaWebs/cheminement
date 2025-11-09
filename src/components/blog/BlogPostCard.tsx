"use client";

import { ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  author: {
    name: string;
    avatar: string;
  };
  category: string;
  date: string;
  readTime: string;
  type: "internal" | "external";
  slug?: string;
  externalUrl?: string;
}

interface BlogPostCardProps {
  post: BlogPost;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  const isExternal = post.type === "external";
  const href = isExternal ? post.externalUrl! : `/blog/${post.slug}`;
  const Component = isExternal ? "a" : Link;

  const cardContent = (
    <>
      {/* Image */}
      <div className="relative w-full h-48 overflow-hidden rounded-t-lg bg-muted">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
        {isExternal && (
          <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm rounded-full p-2">
            <ExternalLink className="w-4 h-4 text-foreground" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        {/* Category & Date */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-medium text-primary uppercase tracking-wide">
            {post.category}
          </span>
          <span className="text-xs text-muted-foreground">•</span>
          <span className="text-xs text-muted-foreground">
            {new Date(post.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-serif font-bold text-foreground mb-3 line-clamp-2">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">
          {post.excerpt}
        </p>

        {/* Author & Read Time */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-muted">
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                fill
                className="object-cover"
              />
            </div>
            <span className="text-sm font-medium text-foreground">
              {post.author.name}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">{post.readTime}</span>
        </div>
      </div>
    </>
  );

  return (
    <Component
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="group bg-card rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-border overflow-hidden flex flex-col"
    >
      {cardContent}
    </Component>
  );
}
