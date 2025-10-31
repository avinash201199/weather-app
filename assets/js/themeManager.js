/**
 * Theme Manager Module
 * Handles dark/light mode switching with localStorage persistence
 * and smooth transitions across the application
 */

class ThemeManager {
  constructor() {
    this.themeToggle = document.getElementById("theme-toggle");
    this.body = document.body;
    this.storageKey = "weather-app-theme";
    this.currentTheme = this.getStoredTheme() || this.getSystemTheme();

    this.init();
  }

  /**
   * Initialize the theme manager
   */
  init() {
    this.setTheme(this.currentTheme);
    this.bindEvents();
    this.updateToggleState();

    // Listen for system theme changes
    this.watchSystemTheme();

    console.log("🎨 Theme Manager initialized with theme:", this.currentTheme);
  }

  /**
   * Get stored theme from localStorage
   */
  getStoredTheme() {
    try {
      return localStorage.getItem(this.storageKey);
    } catch (error) {
      console.warn("localStorage not available:", error);
      return null;
    }
  }

  /**
   * Get system preferred theme
   */
  getSystemTheme() {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }
    return "light";
  }

  /**
   * Store theme preference in localStorage
   */
  storeTheme(theme) {
    try {
      localStorage.setItem(this.storageKey, theme);
    } catch (error) {
      console.warn("Could not store theme preference:", error);
    }
  }

  /**
   * Set the theme on the document
   */
  setTheme(theme) {
    this.currentTheme = theme;

    // Remove existing theme classes/attributes
    this.body.removeAttribute("data-theme");
    document.documentElement.removeAttribute("data-theme");

    // Set new theme
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      this.body.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      this.body.setAttribute("data-theme", "light");
    }

    // Store preference
    this.storeTheme(theme);

    // Dispatch custom event for other components
    this.dispatchThemeChange(theme);

    // Update meta theme-color for mobile browsers
    this.updateMetaThemeColor(theme);
  }

  /**
   * Toggle between light and dark themes
   */
  toggleTheme() {
    const newTheme = this.currentTheme === "light" ? "dark" : "light";
    this.setTheme(newTheme);
    this.updateToggleState();

    // Add a subtle animation feedback
    this.addToggleFeedback();
  }

  /**
   * Update the toggle button state
   */
  updateToggleState() {
    if (this.themeToggle) {
      this.themeToggle.setAttribute("data-theme", this.currentTheme);
      this.themeToggle.setAttribute(
        "aria-pressed",
        String(this.currentTheme === "dark")
      );

      const label = this.themeToggle.nextElementSibling;
      if (
        label &&
        label.classList &&
        label.classList.contains("theme-toggle-label")
      ) {
        label.textContent = this.currentTheme === "dark" ? "Dark" : "Light";
      }
    }
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    if (this.themeToggle) {
      this.themeToggle.addEventListener("click", () => {
        this.toggleTheme();
      });

      // Add keyboard support
      this.themeToggle.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.toggleTheme();
        }
      });
    }
  }

  /**
   * Watch for system theme changes
   */
  watchSystemTheme() {
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

      mediaQuery.addEventListener("change", (e) => {
        // Only auto-switch if user hasn't manually set a preference
        if (!this.getStoredTheme()) {
          const systemTheme = e.matches ? "dark" : "light";
          this.setTheme(systemTheme);
          this.updateToggleState();
        }
      });
    }
  }

  /**
   * Dispatch theme change event
   */
  dispatchThemeChange(theme) {
    const event = new CustomEvent("themeChanged", {
      detail: { theme, timestamp: Date.now() },
    });
    document.dispatchEvent(event);
  }

  /**
   * Update meta theme-color for mobile browsers
   */
  updateMetaThemeColor(theme) {
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');

    if (!metaThemeColor) {
      metaThemeColor = document.createElement("meta");
      metaThemeColor.name = "theme-color";
      document.head.appendChild(metaThemeColor);
    }

    const colors = {
      light: "#f8fafc",
      dark: "#0f172a",
    };

    metaThemeColor.content = colors[theme];
  }

  /**
   * Add visual feedback when toggling theme
   */
  addToggleFeedback() {
    const toggle = this.themeToggle?.parentElement;
    if (toggle) {
      toggle.style.transform = "scale(0.95)";
      setTimeout(() => {
        toggle.style.transform = "scale(1)";
      }, 150);
    }
  }

  /**
   * Get current theme
   */
  getCurrentTheme() {
    return this.currentTheme;
  }

  /**
   * Check if dark mode is active
   */
  isDarkMode() {
    return this.currentTheme === "dark";
  }

  /**
   * Force set theme (useful for testing or external control)
   */
  forceSetTheme(theme) {
    if (theme === "light" || theme === "dark") {
      this.setTheme(theme);
      this.updateToggleState();
    }
  }

  /**
   * Reset to system theme
   */
  resetToSystemTheme() {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.warn("Could not clear theme preference:", error);
    }

    const systemTheme = this.getSystemTheme();
    this.setTheme(systemTheme);
    this.updateToggleState();
  }
}

// Export for use in other modules
export default ThemeManager;
/**

 * Theme-aware background manager
 * Handles background images that adapt to the current theme
 */
class ThemeBackgroundManager {
  constructor(themeManager) {
    this.themeManager = themeManager;
    this.backgroundElement = document.getElementById("background");
    this.currentWeatherCondition = null;

    this.init();
  }

  init() {
    // Listen for theme changes
    document.addEventListener("themeChanged", (e) => {
      this.updateBackgroundForTheme(e.detail.theme);
    });
  }

  /**
   * Update background based on current theme and weather
   */
  updateBackgroundForTheme(theme) {
    if (this.currentWeatherCondition && this.backgroundElement) {
      const backgroundUrl = this.getThemeAwareBackground(
        this.currentWeatherCondition,
        theme
      );
      this.setBackground(backgroundUrl);
    }
  }

  /**
   * Set weather condition and update background
   */
  setWeatherCondition(condition) {
    this.currentWeatherCondition = condition;
    const theme = this.themeManager.getCurrentTheme();
    const backgroundUrl = this.getThemeAwareBackground(condition, theme);
    this.setBackground(backgroundUrl);
  }

  /**
   * Get theme-appropriate background URL
   */
  getThemeAwareBackground(condition, theme) {
    const baseCondition = condition.toLowerCase();
    const timeOfDay = theme === "dark" ? "night" : "day";

    // Theme-aware background mappings
    const backgrounds = {
      light: {
        clear:
          "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1600&h=900&fit=crop",
        clouds:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=900&fit=crop",
        rain: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=1600&h=900&fit=crop",
        snow: "https://images.unsplash.com/photo-1477601263568-180e2c6d046e?w=1600&h=900&fit=crop",
        thunderstorm:
          "https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?w=1600&h=900&fit=crop",
        mist: "https://images.unsplash.com/photo-1487621167305-5d248087c724?w=1600&h=900&fit=crop",
      },
      dark: {
        clear:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=900&fit=crop",
        clouds:
          "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1600&h=900&fit=crop",
        rain: "https://images.unsplash.com/photo-1428592953211-077101b2021b?w=1600&h=900&fit=crop",
        snow: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1600&h=900&fit=crop",
        thunderstorm:
          "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=1600&h=900&fit=crop",
        mist: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1600&h=900&fit=crop",
      },
    };

    // Find matching condition
    for (const [key, url] of Object.entries(backgrounds[theme])) {
      if (baseCondition.includes(key)) {
        return url;
      }
    }

    // Default fallback
    return backgrounds[theme].clear;
  }

  /**
   * Set background with smooth transition
   */
  setBackground(url) {
    if (!this.backgroundElement || !url) return;

    const img = new Image();
    img.onload = () => {
      this.backgroundElement.style.opacity = "0";

      setTimeout(() => {
        this.backgroundElement.style.backgroundImage = `url(${url})`;
        this.backgroundElement.style.opacity = "1";
      }, 300);
    };

    img.onerror = () => {
      console.warn("Failed to load theme background:", url);
    };

    img.src = url;
  }
}

// Export the background manager
window.ThemeBackgroundManager = ThemeBackgroundManager;
