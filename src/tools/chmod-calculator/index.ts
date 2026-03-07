import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Chmod Calculator",
  slug: "chmod-calculator",
  description: "Easily calculate Unix file permissions",
  longDescription: "Ditch the command line confusion with our interactive Chmod Calculator. This visual GUI tool lets you effortlessly check permission boxes for owner, group, and public scopes, instantly generating the exact octal number and full chmod command required for your Linux or Unix server.",
  category: "dev",
  icon: "🔒",
  keywords: ["chmod calculator", "file permissions generator", "linux permission calculator", "unix chmod 777 online", "octal to symbolic permissions", "rwx file mode", "chmod command builder"],
  tags: ["developer", "linux", "sysadmin"],
  component: () => import("./ChmodCalculatorTool"),
  capabilities: { supportsOffline: true, supportsClipboard: true },
  faq: [
    { question: "What exactly is chmod?", answer: "chmod (short for 'change mode') is a fundamental Unix command used to set or modify read, write, and execute permissions on files and directories for the owner user, the owner group, and all other users." },
    { question: "What does chmod 755 mean?", answer: "755 is a very common permission shorthand. 7 = rwx (owner can read, write, execute), 5 = r-x (group can read, execute), 5 = r-x (others can read, execute). It's standard for web server directories." },
    { question: "Is chmod 777 dangerous?", answer: "Yes, incredibly dangerous on public servers. Chmod 777 grants absolute read, write, and execute permissions to literally anyone with access to the system. Never use it unless absolutely necessary for temporary debugging." }
  ],
  howItWorks: "Simply check or uncheck the visually laid out Read, Write, and Execute checkboxes for each user class (Owner, Group, Public). As you click, the respective octal value and the precise terminal chmod command update in real-time.",
  relatedTools: ["screen-info", "url-parser"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
