# Portfolio Component

Portfolio grid with hover effects and carousel inspired by Auxa template.

## Features

- Swiper.js carousel for portfolio items
- Hover zoom effect
- Image with overlay on hover
- Title and description overlay
- "See More Work" link with arrow
- Dynamic loading from Flask API

## Structure

```
portfolio/
├── portfolio-grid.html  # Portfolio grid HTML structure
└── styles.css          # Portfolio-specific styles
```

## Integration Notes

- **Connect to existing Flask API** (`/api/projects`)
- Use current portfolio images
- Maintain current project data structure
- Dynamic loading from backend
- Preserve existing API integration

## API Integration

The portfolio component should:
- Fetch projects from `/api/projects`
- Display project images, titles, descriptions
- Link to live project URLs
- Handle loading and error states

## Status

- [ ] Extract portfolio HTML structure
- [ ] Adapt for Smart Scale project data
- [ ] Integrate Swiper.js carousel
- [ ] Connect to Flask API
- [ ] Add hover zoom effects
- [ ] Test API integration
- [ ] Handle loading states


