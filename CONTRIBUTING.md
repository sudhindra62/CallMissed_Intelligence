# Contributing to CallMissed AI Studio

We love your input! We want to make contributing to this project as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features

## Code Style

- **TypeScript:** We strictly adhere to TypeScript. Avoid `any` types and use interfaces/types for all component props and API responses.
- **Formatting:** Use Prettier for code formatting.
- **Linting:** Follow the existing ESLint configuration. Ensure `npm run lint` passes before pushing.
- **Components:** We use functional components and hooks. Extract reusable UI into the `src/components/ui` directory.
- **Styling:** We use Tailwind CSS. Group classes logically (layout, spacing, typography, colors, effects).

## Folder Conventions

- `src/components/ui`: Generic, reusable, dumb components (buttons, inputs, dialogs).
- `src/components/[domain]`: Domain-specific components (e.g., `chat`, `image`, `layout`).
- `src/features`: Business logic, custom hooks, and state management specific to a feature.
- `src/lib/server`: Backend logic (validation, errors, rate limits) used by Next.js Route Handlers.

## Commit Conventions

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` A new feature
- `fix:` A bug fix
- `docs:` Documentation only changes
- `style:` Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- `refactor:` A code change that neither fixes a bug nor adds a feature
- `perf:` A code change that improves performance
- `test:` Adding missing tests or correcting existing tests
- `chore:` Changes to the build process or auxiliary tools and libraries

## Pull Request Expectations

1. **Fork the repo** and create your branch from `main`.
2. **If you've added code that should be tested**, add tests.
3. **If you've changed APIs**, update the documentation.
4. **Ensure the test suite passes.**
5. **Make sure your code lints.**
6. **Issue that PR!** Include a clear description of the problem you're solving and the changes you've made.
