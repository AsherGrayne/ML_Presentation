# Deployment Guide for IoT Mental Health Presentation

## Quick Deploy Options

### Option 1: GitHub Pages (Recommended)

1. **Create GitHub Repository**
   ```bash
   # Create new repository on GitHub.com
   # Name it: iot-mental-health-presentation
   ```

2. **Upload Files**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/iot-mental-health-presentation.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: main
   - Your site will be available at: `https://YOUR_USERNAME.github.io/iot-mental-health-presentation`

### Option 2: Netlify (Drag & Drop)

1. Go to [netlify.com](https://netlify.com)
2. Click "New site from Git" or drag your folder
3. Your site will be live in minutes

### Option 3: Surge.sh (Command Line)

1. **Install Surge**
   ```bash
   npm install -g surge
   ```

2. **Deploy**
   ```bash
   surge
   # Follow prompts to create account and deploy
   ```

## File Structure for Deployment

Your presentation is ready to deploy with these files:
- `index.html` - Main presentation
- `style.css` - Styling
- `app.js` - Interactive functionality

## Features Available After Deployment

✅ **Responsive Design** - Works on all devices  
✅ **Keyboard Navigation** - Arrow keys, space, home/end  
✅ **Touch Support** - Swipe gestures on mobile  
✅ **Accessibility** - Screen reader friendly  
✅ **Print Mode** - Ctrl+P for printable version  
✅ **Fullscreen** - F11 for presentation mode  
✅ **Progress Tracking** - Visual progress bar  
✅ **Navigation Dots** - Quick slide jumping  

## Customization

- Edit `index.html` to modify content
- Update `style.css` for visual changes
- Modify `app.js` for functionality changes

## Maintenance

- Update content by editing HTML files
- Re-upload to hosting platform
- GitHub Pages updates automatically with git push
