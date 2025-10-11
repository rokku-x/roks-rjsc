# Publishing Guide

This guide will help you publish the `roks-rjsc` component library to npm.

## Prerequisites

1. You need an npm account. If you don't have one, create it at [npmjs.com](https://www.npmjs.com/signup)
2. Make sure you have access to publish packages (verify your email)

## Publishing Steps

### 1. Login to npm

```bash
npm login
```

This will prompt you for:
- Username
- Password
- Email
- One-time password (if you have 2FA enabled)

### 2. Verify your login

```bash
npm whoami
```

### 3. Test the package locally (optional)

Before publishing, you can test the package by creating a local tarball:

```bash
npm pack
```

This creates a `.tgz` file that you can install in another project to test:

```bash
cd /path/to/test-project
npm install /path/to/roks-rjsc-1.0.0.tgz
```

### 4. Update version (if needed)

Before publishing updates, bump the version number:

```bash
# For bug fixes
npm version patch  # 1.0.0 -> 1.0.1

# For new features (backward compatible)
npm version minor  # 1.0.0 -> 1.1.0

# For breaking changes
npm version major  # 1.0.0 -> 2.0.0
```

### 5. Publish to npm

```bash
npm publish
```

The `prepublishOnly` script in `package.json` will automatically build the library before publishing.

### 6. Verify the publication

After publishing, verify your package at:
```
https://www.npmjs.com/package/roks-rjsc
```

## What Gets Published

Only the following will be included in the npm package:
- `dist/` directory (compiled JavaScript and TypeScript definitions)
- `README.md`
- `package.json`

The source code, configuration files, and examples are excluded via `.npmignore`.

## Installing the Published Package

Once published, users can install your package:

```bash
npm install roks-rjsc
```

## Publishing Updates

1. Make your changes to the source code
2. Run `npm run build` to test the build
3. Update the version: `npm version patch|minor|major`
4. Publish: `npm publish`

## Troubleshooting

### Package name already taken
If `roks-rjsc` is already taken, you can:
- Choose a different name
- Use a scoped package: `@your-username/roks-rjsc`

To use a scoped package, update `package.json`:
```json
{
  "name": "@your-username/roks-rjsc"
}
```

### 403 Forbidden error
This usually means:
- You're not logged in: run `npm login`
- You don't have permission to publish this package name
- Package name is already taken

### Build fails before publish
Make sure all dependencies are installed:
```bash
npm install
npm run build
```

## Best Practices

1. **Semantic Versioning**: Follow [semver](https://semver.org/)
   - MAJOR: Breaking changes
   - MINOR: New features (backward compatible)
   - PATCH: Bug fixes

2. **Update README**: Keep documentation current with each release

3. **Test before publishing**: Always build and test locally first

4. **Git tags**: Version bumps create git tags automatically

5. **CHANGELOG**: Consider maintaining a CHANGELOG.md for version history
