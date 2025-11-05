# Auxa-Inspired CSS Files

This directory contains CSS files adapted from the Auxa template for Smart Scale.

## File Structure

```
auxa/
├── auxa-variables.css    # CSS custom properties (variables)
├── auxa-base.css         # Base styles and resets
└── auxa-components.css   # Component-specific styles
```

## Usage

Include these files in your HTML in this order:

```html
<link rel="stylesheet" href="assets/css/auxa/auxa-variables.css">
<link rel="stylesheet" href="assets/css/auxa/auxa-base.css">
<link rel="stylesheet" href="assets/css/auxa/auxa-components.css">
```

## Color Adaptations

The CSS variables have been adapted from Auxa's color scheme to Smart Scale's:
- Primary color: `#6366f1` (indigo-500) instead of `#C4EF17`
- Dark backgrounds: Adapted to Smart Scale's dark mode
- Text colors: Matched to Smart Scale's gray scale

## Status

- [ ] Extract and adapt CSS variables
- [ ] Create base styles
- [ ] Extract component styles
- [ ] Test color scheme
- [ ] Optimize for performance


