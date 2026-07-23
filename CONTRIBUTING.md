# Contributing to SkillSync

First off, thank you for considering contributing to SkillSync! It's people like you that make SkillSync a great platform.

## Branch Naming
Please follow this convention when creating branches:
- `feature/your-feature-name` (For new features)
- `bugfix/issue-description` (For bug fixes)
- `hotfix/critical-issue` (For urgent production fixes)
- `docs/what-changed` (For documentation updates)
- `chore/update-description` (For routine tasks/maintenance)

## Commit Message Format
We follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.
- `feat:` A new feature
- `fix:` A bug fix
- `docs:` Documentation only changes
- `style:` Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- `refactor:` A code change that neither fixes a bug nor adds a feature
- `perf:` A code change that improves performance
- `test:` Adding missing tests or correcting existing tests
- `chore:` Changes to the build process or auxiliary tools and libraries

Example: `feat: add AI resume parsing module`

## Pull Request Rules
- Always create a pull request against the `main` branch.
- Fill out the provided Pull Request Template.
- Ensure all tests and linting pass before requesting a review.
- Request reviews from at least one core maintainer.
- Link the relevant issue (e.g., `Fixes #12`).

## Coding Standards
- **General:** Use ESLint and Prettier for code formatting.
- **Functions:** Keep functions small (under 40 lines ideally).
- **Files:** Follow the Single Responsibility Principle. Keep files under 250 lines if possible.
- **Naming:** Use camelCase for variables/functions and PascalCase for React components and classes.
- **Comments:** Use meaningful comments to explain *why*, not *what*.

## Folder Conventions
- Use feature-based modular architecture.
- Frontend features go in `frontend/src/features/`.
- Backend modules go in `backend/src/features/`.
- Reusable components/utils go in `shared` or `utils` folders.
