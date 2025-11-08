// Type declarations for CSS modules
declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

// Type declarations for SCSS modules
declare module "*.scss" {
  const content: { [className: string]: string };
  export default content;
}

// Type declarations for other style files
declare module "*.sass" {
  const content: { [className: string]: string };
  export default content;
}

declare module "*.less" {
  const content: { [className: string]: string };
  export default content;
}