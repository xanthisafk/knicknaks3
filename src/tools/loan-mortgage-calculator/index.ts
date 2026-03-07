import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Loan / Mortgage Calculator",
  slug: "loan-mortgage-calculator",
  description:
    "Calculate monthly payments, interest for loans",

  longDescription:
    "Estimate monthly loan repayments quickly using this loan and mortgage calculator. Enter the loan amount, interest rate, and repayment term to see your monthly payment, total interest paid, and a full amortisation breakdown. " +
    "Ideal for planning mortgages, car loans, personal loans, or financial budgeting.",

  category: "calculators",
  status: "alpha",
  icon: "🏦",

  keywords: [
    "loan calculator",
    "mortgage calculator",
    "monthly payment calculator",
    "loan interest calculator",
    "amortization calculator",
    "home loan calculator",
    "mortgage payment estimator"
  ],

  tags: ["finance", "calculator"],

  component: () => import("./LoanMortgageCalculatorTool"),

  capabilities: {
    supportsOffline: true,
  },

  faq: [
    {
      question: "What is an amortisation schedule?",
      answer:
        "An amortisation schedule shows how each loan payment is divided between interest and principal over time until the loan is fully paid."
    },
    {
      question: "Can this calculator be used for mortgages and personal loans?",
      answer:
        "Yes. It works for mortgages, car loans, student loans, and personal loans by adjusting the loan amount, interest rate, and repayment term."
    }
  ],

  howItWorks:
    "Enter the loan amount, interest rate, and repayment period. The calculator instantly determines the monthly payment and displays the total interest paid across the loan duration.",

  relatedTools: ["tip-calculator", "date-difference-calculator"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-06",
};