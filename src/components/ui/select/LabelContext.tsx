import { createContext } from "react";

export const LabelRegistryContext = createContext<Map<string, string> | null>(null);