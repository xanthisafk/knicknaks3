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
    { question: "What is chmod?", answer: "A Unix command to change file and directory permissions (read, write, execute) for owner, group, and others." },
    { question: "What does 755 mean?", answer: "Owner: rwx (7), Group: r-x (5), Others: r-x (5). Common for directories and executables." },
    { question: "What does 644 mean?", answer: "Owner: rw- (6), Group: r-- (4), Others: r-- (4). Typical for regular files." },
    { question: "Is 777 safe?", answer: "No. It grants full access to everyone. Avoid except for temporary debugging." },
    { question: "What do r, w, x stand for?", answer: "r = read, w = write, x = execute." },
    { question: "How are octal values calculated?", answer: "r=4, w=2, x=1. Add them per user class to get each digit." },
    { question: "What’s the difference between files and directories?", answer: "Execute allows running files, but for directories it allows entering/traversing." },
    { question: "What does chmod +x do?", answer: "Adds execute permission without changing other existing permissions." },
    { question: "What is symbolic vs octal mode?", answer: "Symbolic uses letters (u+x), octal uses numbers (755)." },
    { question: "What does 700 mean?", answer: "Owner: rwx (7), Group: --- (0), Others: --- (0). Fully private." }
  ],
  howItWorks: "Simply check or uncheck the visually laid out Read, Write, and Execute checkboxes for each user class (Owner, Group, Public). As you click, the respective octal value and the precise terminal chmod command update in real-time.",
  relatedTools: ["screen-info", "url-parser"],
  schemaType: "WebApplication",
  createdAt: "2026-03-03",
  launchedAt: "2026-03-03",
  lastUpdated: "2026-03-18",
};
