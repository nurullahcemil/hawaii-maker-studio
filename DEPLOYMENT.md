# Hawaii Maker Studio - Deployment Guide

## 🚀 Quick Deployment

This guide covers how to deploy changes to the Hawaii Maker Studio Shopify theme.

---

## Prerequisites

- Git installed on your machine
- Access to the GitHub repository
- Shopify Theme Kit or GitHub integration set up
- Push access to the repository

---

## Deployment Workflow

### 1. **Pull Latest Changes**
Always start by pulling the latest changes from the remote repository:

```bash
git pull origin master
```

If you encounter merge conflicts, resolve them before proceeding.

---

### 2. **Make Your Changes**
Edit the necessary files in your local environment:
- `assets/` - JavaScript, CSS, and asset files
- `blocks/` - Reusable content blocks
- `sections/` - Theme sections
- `snippets/` - Reusable Liquid snippets
- `templates/` - Page templates
- `layout/` - Theme layout files
- `config/` - Theme settings and configuration
- `locales/` - Translation files

---

### 3. **Test Locally (if applicable)**
If you have Shopify Theme Kit installed, test your changes:

```bash
theme watch
```

---

### 4. **Stage Your Changes**
Add all modified files to staging:

```bash
git add .
```

Or add specific files:

```bash
git add path/to/file.liquid
```

---

### 5. **Commit Your Changes**
Write a clear, descriptive commit message:

```bash
git commit -m "Brief description of changes

- Detailed point 1
- Detailed point 2
- Additional context"
```

**Good commit message examples:**
```bash
git commit -m "Add Event schema markup for workshop products"
git commit -m "Fix duplicate H1 tags on homepage"
git commit -m "Add heading tag selector to jumbo text block"
```

---

### 6. **Push to GitHub**
Push your changes to the remote repository:

```bash
git push origin master
```

---

### 7. **Sync to Shopify**
If you have GitHub integration enabled in Shopify:
- Changes will automatically sync to your connected theme
- Check your Shopify admin to verify the deployment

If using Shopify Theme Kit manually:
```bash
theme deploy
```

---

## Handling Merge Conflicts

If you encounter conflicts during pull or push:

### During Pull:
```bash
git pull --rebase origin master
```

### Resolve Conflicts:
1. Open conflicted files in your editor
2. Look for conflict markers: `<<<<<<<`, `=======`, `>>>>>>>`
3. Keep the correct version of the code
4. Remove conflict markers
5. Stage the resolved files:
   ```bash
   git add path/to/resolved-file
   ```
6. Continue the rebase:
   ```bash
   git rebase --continue
   ```

### During Push (Rejected):
```bash
git pull --rebase origin master
git push origin master
```

---

## Common Deployment Scenarios

### 🎨 **Styling Changes**
Files: `assets/*.css`, `assets/*.js`

```bash
git add assets/
git commit -m "Update styles for [component/section]"
git push origin master
```

---

### 🧩 **Section/Block Updates**
Files: `sections/*.liquid`, `blocks/*.liquid`

```bash
git add sections/ blocks/
git commit -m "Add new [feature] to [section/block]"
git push origin master
```

---

### 🔧 **Theme Settings**
Files: `config/settings_schema.json`, `config/settings_data.json`

```bash
git add config/
git commit -m "Add new theme settings for [feature]"
git push origin master
```

---

### 📝 **Template Changes**
Files: `templates/*.json`, `templates/*.liquid`

```bash
git add templates/
git commit -m "Update [template-name] template"
git push origin master
```

---

### 🎯 **SEO/Schema Updates**
Files: `snippets/schema-*.liquid`, `sections/*.liquid`

```bash
git add snippets/schema-* sections/
git commit -m "Add [schema-type] structured data markup"
git push origin master
```

---

## Rollback Procedure

### View Commit History:
```bash
git log --oneline
```

### Revert to Previous Commit:
```bash
git revert <commit-hash>
git push origin master
```

### Hard Reset (Use with Caution):
```bash
git reset --hard <commit-hash>
git push origin master --force
```

⚠️ **Warning:** Force push will overwrite remote history. Only use if absolutely necessary.

---

## Branch Strategy (Optional)

For larger changes, consider using feature branches:

### Create Feature Branch:
```bash
git checkout -b feature/new-feature-name
```

### Work on Your Feature:
```bash
git add .
git commit -m "Add new feature"
```

### Push Feature Branch:
```bash
git push origin feature/new-feature-name
```

### Merge to Master:
```bash
git checkout master
git merge feature/new-feature-name
git push origin master
```

### Delete Feature Branch:
```bash
git branch -d feature/new-feature-name
git push origin --delete feature/new-feature-name
```

---

## Environment-Specific Notes

### 🏪 **Production Store**
- URL: hawaii-maker-studio.myshopify.com
- Always test changes in development theme first
- Use Shopify theme previews before publishing

### 🧪 **Development Theme**
- Test all changes here before deploying to live theme
- Preview URL available in Shopify admin

---

## Deployment Checklist

Before deploying to production:

- [ ] Pull latest changes from master
- [ ] Test changes locally or in development theme
- [ ] Check for linter errors
- [ ] Verify no console errors
- [ ] Test on mobile and desktop
- [ ] Verify SEO elements (meta tags, structured data)
- [ ] Check page load performance
- [ ] Review commit message for clarity
- [ ] Push to GitHub
- [ ] Verify deployment in Shopify admin
- [ ] Test live site after deployment

---

## Important Files to Review

### **Theme Configuration:**
- `config/settings_schema.json` - Theme customizer settings
- `config/settings_data.json` - Current theme settings values

### **SEO & Schema:**
- `snippets/schema-*.liquid` - All structured data implementations
- `sections/header.liquid` - Site-wide schema markup

### **Custom Features:**
- `sections/dynamic-booking-form.liquid` - Event booking functionality
- `blocks/jumbo-text.liquid` - Large display text with SEO options
- `templates/product.event.json` - Event product template

---

## Troubleshooting

### Push Rejected:
```bash
git pull --rebase origin master
git push origin master
```

### Divergent Branches:
```bash
git config pull.rebase true
git pull origin master
```

### Lost Changes:
```bash
git reflog
git checkout <commit-hash>
```

### Undo Last Commit (Keep Changes):
```bash
git reset --soft HEAD~1
```

---

## Support & Resources

- **Shopify Theme Documentation:** https://shopify.dev/docs/themes
- **Liquid Documentation:** https://shopify.dev/docs/api/liquid
- **Git Documentation:** https://git-scm.com/doc

---

## Quick Reference Commands

```bash
# Check status
git status

# Pull latest
git pull origin master

# Add all changes
git add .

# Commit with message
git commit -m "Your message"

# Push to remote
git push origin master

# View history
git log --oneline

# Check differences
git diff

# Discard local changes
git checkout -- path/to/file
```

---

**Last Updated:** October 22, 2025  
**Maintained By:** Hawaii Maker Studio Team

