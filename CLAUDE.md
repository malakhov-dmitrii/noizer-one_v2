# Noizer One Project Guidelines

## Commands
- `npm run dev` - Start development server at port 3000
- `npm run build` - Build for production
- `npm run check` - Run type checking
- `npm run lint` - Run linting and formatting checks
- `npm run format` - Fix formatting issues automatically
- `npm run test` - Run all Playwright tests
- `npm run test:unit` - Run unit tests with Vitest
- `npm test src/tests/mytest.ts` - Run single test file

## Code Style
- **TypeScript**: Strict typing enabled. Use proper type annotations.
- **Formatting**: Uses Prettier with 100 char line limit, single quotes, tabs (not spaces).
- **Component Structure**: Svelte components with script lang="ts" and CSS in component files.
- **Imports**: Use '@/' alias for src imports (e.g., '@/lib/utils').
- **CSS Framework**: Uses Tailwind CSS with daisyUI components. Prefer utility classes.
- **Naming**: PascalCase for components, camelCase for variables/functions.
- **Error Handling**: Always handle Promises with try/catch blocks.
- **State Management**: Use Svelte stores for app-wide state.
- **Library Usage**: Leverage existing libraries and utilities from package.json.