import React from "react";

interface SEOLayoutProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  role?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
}

export const SEOLayout: React.FC<SEOLayoutProps> = ({
  children,
  className = "",
  as: Component = "div",
  ...props
}) => {
  return (
    <Component className={`seo-layout ${className}`} {...props}>
      {children}
    </Component>
  );
};

// Semantic HTML components for better SEO structure
export const SEOHeader: React.FC<SEOLayoutProps> = ({ children, ...props }) => (
  <SEOLayout as="header" role="banner" {...props}>
    {children}
  </SEOLayout>
);

export const SEOMain: React.FC<SEOLayoutProps> = ({ children, ...props }) => (
  <SEOLayout as="main" role="main" {...props}>
    {children}
  </SEOLayout>
);

export const SEOSection: React.FC<SEOLayoutProps> = ({
  children,
  ...props
}) => (
  <SEOLayout as="section" {...props}>
    {children}
  </SEOLayout>
);

export const SEOArticle: React.FC<SEOLayoutProps> = ({
  children,
  ...props
}) => (
  <SEOLayout as="article" {...props}>
    {children}
  </SEOLayout>
);

export const SEOAside: React.FC<SEOLayoutProps> = ({ children, ...props }) => (
  <SEOLayout as="aside" role="complementary" {...props}>
    {children}
  </SEOLayout>
);

export const SEONav: React.FC<SEOLayoutProps> = ({ children, ...props }) => (
  <SEOLayout as="nav" role="navigation" {...props}>
    {children}
  </SEOLayout>
);

export const SEOFooter: React.FC<SEOLayoutProps> = ({ children, ...props }) => (
  <SEOLayout as="footer" role="contentinfo" {...props}>
    {children}
  </SEOLayout>
);

// SEO-optimized heading components
interface SEOHeadingProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const SEOH1: React.FC<SEOHeadingProps> = ({
  children,
  className = "",
  ...props
}) => (
  <h1 className={`seo-h1 text-4xl font-bold ${className}`} {...props}>
    {children}
  </h1>
);

export const SEOH2: React.FC<SEOHeadingProps> = ({
  children,
  className = "",
  ...props
}) => (
  <h2 className={`seo-h2 text-3xl font-semibold ${className}`} {...props}>
    {children}
  </h2>
);

export const SEOH3: React.FC<SEOHeadingProps> = ({
  children,
  className = "",
  ...props
}) => (
  <h3 className={`seo-h3 text-2xl font-medium ${className}`} {...props}>
    {children}
  </h3>
);

export const SEOH4: React.FC<SEOHeadingProps> = ({
  children,
  className = "",
  ...props
}) => (
  <h4 className={`seo-h4 text-xl font-medium ${className}`} {...props}>
    {children}
  </h4>
);

// SEO-optimized image component
interface SEOImageProps {
  src: string;
  alt: string;
  title?: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: "lazy" | "eager";
  decoding?: "async" | "sync" | "auto";
  fetchpriority?: "high" | "low" | "auto";
}

export const SEOImage: React.FC<SEOImageProps> = ({
  src,
  alt,
  title,
  width,
  height,
  className = "",
  loading = "lazy",
  decoding = "async",
  fetchpriority = "auto",
  ...props
}) => (
  <img
    src={src}
    alt={alt}
    title={title}
    width={width}
    height={height}
    className={`seo-image ${className}`}
    loading={loading}
    decoding={decoding}
    fetchPriority={fetchpriority}
    {...props}
  />
);

// SEO-optimized link component
interface SEOLinkProps {
  href: string;
  children: React.ReactNode;
  title?: string;
  rel?: string;
  target?: string;
  className?: string;
  "aria-label"?: string;
}

export const SEOLink: React.FC<SEOLinkProps> = ({
  href,
  children,
  title,
  rel,
  target,
  className = "",
  ...props
}) => {
  // Add appropriate rel attributes for external links
  const isExternal = href.startsWith("http") && !href.includes("talkcon.com");
  const linkRel = isExternal ? `noopener noreferrer ${rel || ""}`.trim() : rel;

  return (
    <a
      href={href}
      title={title}
      rel={linkRel}
      target={target}
      className={`seo-link ${className}`}
      {...props}
    >
      {children}
    </a>
  );
};
