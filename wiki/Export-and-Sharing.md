# Export and Sharing

All the ways to export, share, and embed your Prism creations.

---

## Export Formats

### HTML Download
Download your generated code as a standalone `.html` file. The file is completely self-contained and can be opened in any browser.

**How to use:** Click **Export** in the ribbon toolbar, then select **Download HTML**.

### React (TSX)
Export your code as a React TypeScript component.

**Output format:**
```tsx
import React from 'react';

const GeneratedComponent: React.FC = () => {
  return (
    // Your generated UI code here
  );
};

export default GeneratedComponent;
```

### Vue 3 (SFC)
Export as a Vue 3 Single File Component.

**Output format:**
```vue
<template>
  <!-- Your generated UI -->
</template>

<script setup lang="ts">
// Component logic
</script>

<style scoped>
/* Component styles */
</style>
```

### Svelte
Export as a Svelte component.

**Output format:**
```svelte
<script>
  // Component logic
</script>

<!-- Your generated UI -->

<style>
  /* Component styles */
</style>
```

### CodeSandbox
Open your code directly in CodeSandbox for further development. Creates a new sandbox with your code pre-loaded.

**How to use:** Click **Export** > **Open in CodeSandbox**. A new browser tab opens with your project.

---

## Sharing Options

### URL Sharing
Share your creation via a compressed URL.

**How it works:**
1. Your code is compressed using LZ-String
2. The compressed data is encoded into a URL parameter
3. Anyone with the link can see your creation

**How to use:** Click **Share** in the toolbar, then copy the generated URL.

### QR Code
Generate a QR code that links to your creation for easy mobile preview.

**How to use:** Click **QR Code** in the toolbar. Scan the QR code with a mobile device to preview your app.

### GitHub Export
Export your code directly to GitHub as a gist or to a repository.

---

## Embedding

### Iframe Embed
Embed your creation on any website using an iframe.

```html
<iframe
  src="YOUR_PRISM_URL"
  width="800"
  height="600"
  frameborder="0"
  allowfullscreen
></iframe>
```

**Features:**
- Customizable width and height
- Live preview in the embed dialog
- Copy-to-clipboard button

### JavaScript Embed
For more control, use the JavaScript embed option.

```html
<div id="prism-embed"></div>
<script src="YOUR_PRISM_EMBED_URL"></script>
```

---

## Export Shortcuts

| Action | Shortcut |
|--------|----------|
| Open Export dialog | `Ctrl/Cmd + E` |
| Open Share dialog | `Ctrl/Cmd + Shift + S` |

---

## App Publishing

Save your creation as a published app with metadata:

1. Click **Publish** or **App Settings** in the toolbar
2. Set a **name** for your app
3. Choose an **emoji icon**
4. Write a **description**
5. Select a **category** (Dashboard, Landing, Form, Game, Visualization, Ecommerce, Social, Utility)
6. Add **tags** for searchability
7. Click **Save**

Published apps appear in the **Apps** tab of the history sidebar, where you can:
- Pin favorites for quick access
- Duplicate apps
- Search and filter by category
- Sort by date, name, or category
- Switch between grid and list views

---

Next: [[Contributing]] - How to contribute to Prism.
