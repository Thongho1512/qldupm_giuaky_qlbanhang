// Type declarations for importing CSS/SCSS files
declare module '*.css';
declare module '*.scss';

// For CSS modules that export a mapping of class names
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}
