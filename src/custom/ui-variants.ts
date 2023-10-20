export type Variant = "contained" | "outlined";


export type Color = "primary" | "secondary" | "tertiary";
export const isColorVariant = (input: any): input is Color => (
  typeof input === "string" &&
  ( input === "primary" ||
    input === "secondary" ||
    input === "tertiary" )
);

export type Size = "large" | "medium" | "small";
export const isSizeVariant = (input: any): input is Size => (
  typeof input === "string" &&
  ( input === "large" ||
    input === "medium" ||
    input === "small" )
);