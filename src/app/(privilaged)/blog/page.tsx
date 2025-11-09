import { BlogFeed } from "@/components/blog/BlogFeed";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-6">
            Blog
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Insights on psychological well-being and product updates to help you
            on your journey.
          </p>
        </div>

        {/* Blog Feed */}
        <BlogFeed />
      </div>
    </div>
  );
}
