"use client";

import { BlogPostCard } from "./BlogPostCard";

// Mock data - replace with actual data fetching
const blogPosts = [
  {
    id: "1",
    title: "Understanding Mindfulness in the Modern Workplace",
    excerpt:
      "Explore how mindfulness practices can transform your work environment and improve mental well-being for your entire team.",
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
    author: {
      name: "Dr. Sarah Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
    category: "Psychological Well-being",
    date: "2024-01-15",
    readTime: "5 min read",
    type: "internal" as const,
    slug: "understanding-mindfulness-workplace",
  },
  {
    id: "2",
    title: "Product Update: New Analytics Dashboard",
    excerpt:
      "We've rolled out a comprehensive analytics dashboard to help you track engagement and measure the impact of your wellness programs.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    author: {
      name: "Michael Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    },
    category: "Product Updates",
    date: "2024-01-12",
    readTime: "3 min read",
    type: "internal" as const,
    slug: "new-analytics-dashboard",
  },
  {
    id: "3",
    title: "The Science of Stress Management",
    excerpt:
      "Learn evidence-based techniques for managing stress and building resilience in high-pressure environments.",
    image:
      "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&q=80",
    author: {
      name: "Dr. Emily Rodriguez",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    },
    category: "Psychological Well-being",
    date: "2024-01-10",
    readTime: "7 min read",
    type: "external" as const,
    externalUrl: "https://example.com/stress-management",
  },
  {
    id: "4",
    title: "Building a Culture of Mental Health Support",
    excerpt:
      "Discover strategies for creating an organizational culture that prioritizes mental health and encourages open conversations.",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80",
    author: {
      name: "James Wilson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
    },
    category: "Psychological Well-being",
    date: "2024-01-08",
    readTime: "6 min read",
    type: "internal" as const,
    slug: "building-mental-health-culture",
  },
  {
    id: "5",
    title: "Introducing Enhanced Video Consultation Features",
    excerpt:
      "Our latest update brings improved video quality, screen sharing, and secure messaging to your consultation sessions.",
    image:
      "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=800&q=80",
    author: {
      name: "Lisa Park",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
    },
    category: "Product Updates",
    date: "2024-01-05",
    readTime: "4 min read",
    type: "internal" as const,
    slug: "enhanced-video-consultation",
  },
  {
    id: "6",
    title: "The Role of Sleep in Mental Well-being",
    excerpt:
      "Understanding the critical connection between quality sleep and psychological health, plus practical tips for better rest.",
    image:
      "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80",
    author: {
      name: "Dr. Sarah Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
    category: "Psychological Well-being",
    date: "2024-01-02",
    readTime: "8 min read",
    type: "external" as const,
    externalUrl: "https://example.com/sleep-mental-health",
  },
];

export function BlogFeed() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
