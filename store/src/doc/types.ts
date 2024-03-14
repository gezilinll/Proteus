export type Json = JsonScalar | JsonArray | JsonObject;
export type JsonScalar = string | number | boolean;
export type JsonArray = Json[];
export type JsonObject = { [key: string]: Json };

export type ElementType = 'none' | 'shape' | 'brush' | 'text';
