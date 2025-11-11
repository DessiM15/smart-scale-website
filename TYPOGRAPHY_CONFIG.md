# Smart Scale Typography Configuration

## Typography System Complete

### Font Family
- **Primary Font:** Zen Dots (from Google Fonts)
- **Backup Fonts:** "Segoe UI", sans-serif
- **Font Weights:** 400 (rendered weight; Zen Dots provides a single weight and respects semantic classes)

### Typography Scale

| Element | Size | Weight | Line Height | Letter Spacing |
|---------|------|--------|-------------|----------------|
| H1 | 3.5rem (56px) | 700 | 1.1 | -0.02em |
| H2 | 2.5rem (40px) | 700 | 1.2 | -0.02em |
| H3 | 1.875rem (30px) | 600 | 1.3 | 0 |
| H4 | 1.5rem (24px) | 600 | 1.4 | 0 |
| Body | 1rem (16px) | 400 | 1.6 | 0 |
| Large Text | 1.125rem (18px) | 400 | 1.6 | 0 |
| Small Text | 0.875rem (14px) | 400 | 1.6 | 0 |

> **Note:** Zen Dots is available in a single weight. Semantic weight tokens remain for consistency but render with the font's default appearance.

### Mobile Responsive Sizes

**Tablet (max-width: 768px):**
- H1: 2.5rem (40px)
- H2: 2rem (32px)
- H3: 1.5rem (24px)
- H4: 1.25rem (20px)
- Body: 1rem (16px) - minimum readable size maintained

**Small Mobile (max-width: 480px):**
- H1: 2rem (32px)
- H2: 1.75rem (28px)
- H3: 1.25rem (20px)
- H4: 1.125rem (18px)

### Files Updated

1. Complete: **assets/css/auxa/auxa-typography.css** - Complete typography system
2. Complete: **assets/css/auxa/auxa-variables.css** - Updated font variables
3. Complete: **index.html** - Updated to Zen Dots font and refreshed font references
4. Complete: **about.html** - Updated to Zen Dots font and refreshed font references
5. Complete: **services.html** - Updated to Zen Dots font and refreshed font references
6. Complete: **tech.html** - Updated to Zen Dots font and refreshed font references

### Removed Fonts

- Removed: Geist (playful font)
- Removed: Outfit (from Auxa template)
- Removed: Marcellus (serif font from Auxa)
- Removed: All rounded/playful font references

### CSS Classes Available

**Typography Classes:**
- `.text-h1`, `.text-h2`, `.text-h3`, `.text-h4`
- `.text-body`, `.text-large`, `.text-small`

**Font Weight:**
- `.font-regular` (400)
- `.font-semibold` (600)
- `.font-bold` (700)

**Letter Spacing:**
- `.tracking-tight` (-0.02em)
- `.tracking-normal` (0)
- `.tracking-wide` (0.05em)

**Line Height:**
- `.leading-tight` (1.1)
- `.leading-normal` (1.2)
- `.leading-relaxed` (1.3)
- `.leading-loose` (1.4)
- `.leading-body` (1.6)

### Usage Example

```html
<h1 class="text-h1 font-bold tracking-tight">Professional Heading</h1>
<p class="text-body font-regular">Body text with the Zen Dots display font.</p>
<span class="text-small font-semibold">Small professional text</span>
```

### Google Fonts Import

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Zen+Dots&display=swap" rel="stylesheet">
```

### CSS Variables

```css
--font-primary: 'Zen Dots', 'Segoe UI', sans-serif;
--font-weight-regular: 400;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

---

**Status:** Complete - All primary pages now use the Zen Dots display font
**Last Updated:** 2025-01-XX


