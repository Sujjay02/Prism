# Contributing

We welcome contributions to Prism! Here's how to get started.

---

## How to Contribute

### 1. Fork the Repository

Click the **Fork** button on the [Prism GitHub page](https://github.com/Sujjay02/Prism) to create your own copy.

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/Prism.git
cd Prism
```

### 3. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Set Up Environment

```bash
echo "VITE_GEMINI_API_KEY=your_api_key" > .env.local
```

### 6. Start Development

```bash
npm run dev
```

### 7. Make Your Changes

Write your code, following the project conventions outlined below.

### 8. Test Your Changes

- Verify the dev server runs without errors
- Test your feature in the browser
- Run the linter: `npm run lint`
- Ensure the production build succeeds: `npm run build`

### 9. Commit and Push

```bash
git add .
git commit -m "feat: description of your feature"
git push origin feature/your-feature-name
```

### 10. Open a Pull Request

Go to the original repository and click **New Pull Request**. Describe your changes and link any related issues.

---

## Code Conventions

### Project Structure

- **Components** go in `components/` - one component per file
- **Services** go in `services/` - for API and data layer logic
- **Hooks** go in `hooks/` - for reusable React hooks
- **Utils** go in `utils/` - for pure utility functions
- **Types** are defined in `types.ts`
- **Static data** goes in `data/`

### Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `CodePreview.tsx` |
| Services | camelCase | `geminiService.ts` |
| Hooks | camelCase with `use` prefix | `useKeyboardShortcuts.ts` |
| Utils | camelCase | `exportUtils.ts` |
| Types/Interfaces | PascalCase | `HistoryItem`, `AppSettings` |
| CSS classes | Tailwind utility classes | `className="flex items-center gap-2"` |

### Code Style

- **TypeScript** - All code should be written in TypeScript
- **React Hooks** - Use functional components with hooks (no class components)
- **Tailwind CSS** - Use Tailwind utility classes for styling
- **Lucide React** - Use Lucide icons for consistency

### Commit Message Format

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
feat: add new template gallery filter
fix: resolve iframe sandbox error on Safari
docs: update README with new features
refactor: simplify export utility functions
style: improve toolbar button spacing
```

---

## Areas for Contribution

Here are some areas where contributions are especially welcome:

### New Templates
Add new built-in templates to `data/defaultTemplates.ts`. Each template needs:
- A name and description
- Category assignment
- Working HTML/React/Python code

### New Export Formats
Add support for additional framework exports in `utils/exportUtils.ts`.

### Accessibility Improvements
Help improve the accessibility of Prism itself (not just the audit feature).

### Bug Fixes
Check the [Issues](https://github.com/Sujjay02/Prism/issues) page for reported bugs.

### Documentation
Improve this wiki, add inline code comments, or create tutorials.

### Performance
Optimize rendering, reduce bundle size, or improve load times.

---

## Reporting Issues

Found a bug or have a feature request?

1. Check existing [Issues](https://github.com/Sujjay02/Prism/issues) to avoid duplicates
2. Open a new issue with:
   - Clear description of the problem or feature
   - Steps to reproduce (for bugs)
   - Browser and OS information
   - Screenshots if applicable

---

## License

Prism is licensed under the **MIT License**. By contributing, you agree that your contributions will be licensed under the same license.

---

Thank you for helping make Prism better!
