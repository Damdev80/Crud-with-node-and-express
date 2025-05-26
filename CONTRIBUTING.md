# Contributing to Library Management System

First off, thank you for considering contributing to this project! 🎉

Following these guidelines helps to communicate that you respect the time of the developers managing and developing this open source project. In return, they should reciprocate that respect in addressing your issue, assessing changes, and helping you finalize your pull requests.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Process](#development-process)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Issue Guidelines](#issue-guidelines)
- [Code Style Guidelines](#code-style-guidelines)
- [Testing](#testing)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**
- Use of sexualized language or imagery
- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information without explicit permission

## 🚀 Getting Started

### Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/yourusername/library-management-system.git
   cd library-management-system
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   cp server/.env.example server/.env
   cp client/.env.example client/.env
   # Edit the .env files with your configuration
   ```

4. **Set up the database**
   ```bash
   cd server
   npm run migrate
   npm run seed
   ```

5. **Start development servers**
   ```bash
   # Terminal 1 - Backend
   npm run dev:server
   
   # Terminal 2 - Frontend
   npm run dev:client
   ```

## 🤝 How to Contribute

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed after following the steps**
- **Explain which behavior you expected to see instead and why**
- **Include screenshots if possible**

### Suggesting Features

Feature suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a step-by-step description of the suggested enhancement**
- **Provide specific examples to demonstrate the steps**
- **Describe the current behavior and explain which behavior you expected**
- **Explain why this enhancement would be useful**

### Code Contributions

1. **Choose an issue to work on**
   - Look for issues labeled `good first issue` for beginners
   - Comment on the issue to let others know you're working on it

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the code style guidelines
   - Add tests for new functionality
   - Update documentation if needed

4. **Test your changes**
   ```bash
   npm run test
   npm run lint
   ```

5. **Commit your changes**
   ```bash
   git commit -m "feat: add new feature description"
   ```

6. **Push and create a Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

## 🔄 Development Process

### Branch Naming Convention

- `feat/feature-name` - New features
- `fix/bug-name` - Bug fixes
- `docs/update-name` - Documentation updates
- `refactor/component-name` - Code refactoring
- `test/test-name` - Adding tests

### Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

**Examples:**
```
feat(auth): add JWT token refresh mechanism
fix(books): resolve image upload validation issue
docs(readme): update installation instructions
```

## 📝 Pull Request Guidelines

### Before Submitting

- [ ] Fork the repository and create your branch from `main`
- [ ] Run the existing tests to ensure they pass
- [ ] Add tests for new functionality
- [ ] Ensure code follows the style guidelines
- [ ] Update documentation if needed
- [ ] Check that your code builds without warnings

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Added tests for new functionality
- [ ] Manual testing completed

## Screenshots (if applicable)

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
```

## 🎨 Code Style Guidelines

### JavaScript/React

- Use **ES6+** features
- Use **functional components** with hooks
- Follow **camelCase** for variables and functions
- Use **PascalCase** for component names
- Use **UPPER_SNAKE_CASE** for constants
- Maximum line length: **100 characters**

### CSS/Styling

- Use **Tailwind CSS** utility classes
- Follow **mobile-first** responsive design
- Use semantic HTML elements
- Maintain consistent spacing and color scheme

### File Organization

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI elements
│   └── features/       # Feature-specific components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── services/           # API calls and external services
├── utils/              # Utility functions
├── context/            # React context providers
└── config/             # Configuration files
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Frontend tests only
cd client && npm test

# Backend tests only
cd server && npm test
```

### Writing Tests

- **Unit tests**: Test individual functions/components
- **Integration tests**: Test component interactions
- **E2E tests**: Test complete user workflows

### Test File Convention

```
src/
├── components/
│   ├── Button.jsx
│   └── Button.test.jsx
├── utils/
│   ├── helpers.js
│   └── helpers.test.js
```

## 🔍 Code Review Process

1. **All submissions** require review from at least one maintainer
2. **Changes requested** must be addressed before merging
3. **Automated checks** (tests, linting) must pass
4. **Documentation** must be updated for significant changes

## 🏷️ Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature request
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `documentation` - Improvements or additions to documentation
- `duplicate` - This issue or pull request already exists
- `question` - Further information is requested

## 📞 Getting Help

If you need help or have questions:

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For general questions and community discussion
- **Discord/Slack**: [Link to community chat if available]

## 🎉 Recognition

Contributors are recognized in:
- **README.md** contributors section
- **CHANGELOG.md** for significant contributions
- **GitHub contributors** graph

Thank you for contributing! 🙌
