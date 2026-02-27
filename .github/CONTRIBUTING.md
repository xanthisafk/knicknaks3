# Contributing to Knicknaks

First off, thank you for considering contributing to Knicknaks! It's people like you that make Knicknaks such a great tool.

## How Can I Contribute?

### Reporting Bugs

- **Check if the bug has already been reported** by searching on GitHub under [Issues](https://github.com/xanthis/knicknaks/issues).
- If you can't find an open issue addressing the problem, [open a new one](https://github.com/xanthis/knicknaks/issues/new/choose). Be sure to include a title and clear description, as much relevant information as possible, and a code sample or an executable test case demonstrating the expected behavior that is not occurring.

### Suggesting Enhancements

- **Check the [Roadmap](tools.md)** to see if the feature is already planned.
- Open a [Feature Request](https://github.com/xanthis/knicknaks/issues/new/choose) to discuss the enhancement.

### Pull Requests

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Style Guide

- Use functional components with React.
- Use Tailwind CSS for styling.
- Keep tools offline-first; avoid external API calls if possible.
- Use TypeScript for all new code.

## New Tool Checklist

If you are adding a new tool, please follow these steps:

1. Use the command `npm run new-tool` to scaffold a new tool.
2. Implement the component in `src/tools/[tool-name]/[ToolName]Tool.tsx`.
3. Define the tool configuration in `src/tools/[tool-name]/index.ts`.
4. Ensure it's exported correctly so the main application can find it.

---

Thank you for contributing!
