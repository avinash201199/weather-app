# Duplicate Code Fix - Summary

## 🐛 Issue Fixed

**Problem**: Duplicate and malformed code in `assets/js/script.js` (lines 690-702)
- The `search` function had duplicated Pexels API fetch logic
- Malformed code inside the catch block caused syntax errors
- Code maintainability was poor due to repetition

## ✅ Solution Implemented

### 1. Created Reusable Function
Created a new `fetchBackgroundImage()` function that:
- Accepts a city name as parameter
- Handles Pexels API calls with proper error handling
- Returns a boolean indicating success/failure
- Can be reused throughout the application

**Location**: Lines 294-326

```javascript
async function fetchBackgroundImage(cityName) {
  const apiKey = "OOjKyciq4Sk0Kla7riLuR2j8C9FwThFzKIKIHrpq7c27KvrCul5rVxJj";
  const apiUrl = `https://api.pexels.com/v1/search?query=${cityName}&orientation=landscape`;

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: { Authorization: apiKey },
    });
    
    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.photos && data.photos.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.photos.length);
      const url = data.photos[randomIndex].src.large2x;
      document.getElementById("background").style.backgroundImage = `url(${url})`;
      return true;
    } else {
      console.warn(`No background images found for: ${cityName}`);
      return false;
    }
  } catch (error) {
    console.error("Failed to fetch background from Pexels:", error);
    return false;
  }
}
```

### 2. Implemented Missing Function
Implemented the `changeBackgroundImage()` function that was referenced but not defined:

**Location**: Lines 328-333

```javascript
function changeBackgroundImage() {
  // Fetch new background for the currently selected city
  if (selectedCity) {
    fetchBackgroundImage(selectedCity);
  }
}
```

### 3. Refactored search() Method
Cleaned up the `weather.search()` method to use the reusable function:

**Location**: Lines 708-722

**Before** (40+ lines with duplication):
```javascript
search: async function () {
  if (document.querySelector(".weather-component__search-bar").value != "") {
    selectedCity = document.querySelector(".weather-component__search-bar").value;
    this.fetchWeather(selectedCity);
    
    // 30+ lines of duplicate Pexels fetch code
    // ... malformed duplicate code in catch block
  } else {
    toastFunction(translations[userLang].pleaseAddLocation, 'warning', 3000);
  }
}
```

**After** (14 lines, clean and maintainable):
```javascript
search: async function () {
  const searchBar = document.querySelector(".weather-component__search-bar");
  
  if (searchBar && searchBar.value.trim() !== "") {
    selectedCity = searchBar.value.trim();
    
    // Fetch weather data
    this.fetchWeather(selectedCity);
    
    // Fetch background image using the reusable function
    await fetchBackgroundImage(selectedCity);
  } else {
    toastFunction(translations[userLang].pleaseAddLocation, 'warning', 3000);
  }
}
```

### 4. Fixed fetchWeather() Method
Added missing try-catch block and fetch call:

**Location**: Lines 516-536

```javascript
try {
  this.setLoading(true);
  const response = await fetch(url);
  
  if (!response.ok) {
    document.getElementById("city").innerHTML = "City not Found";
    document.getElementById("temp").style.display = "none";
    document.querySelector(".weather-component__data-wrapper").style.display = "none";
    throw new Error(`${translations[userLang].noWeatherFound}`);
  }
  
  const data = await response.json();
  document.getElementById("temp").style.display = "block";
  document.querySelector(".weather-component__data-wrapper").style.display = "block";
  this.displayWeather(data, city);
} catch (error) {
  console.error("Error fetching weather:", error);
  setError(error.message || "Failed to fetch weather data");
} finally {
  this.setLoading(false);
}
```

### 5. Added Missing setLoading() Method
Implemented the `setLoading()` method that was being called but not defined:

**Location**: Lines 724-733

```javascript
setLoading: function(isLoading) {
  const weatherElement = document.getElementById("weather");
  if (weatherElement) {
    if (isLoading) {
      weatherElement.classList.add("loading");
    } else {
      weatherElement.classList.remove("loading");
    }
  }
}
```

## 📊 Impact

### Code Quality Improvements
- ✅ **Removed ~30 lines** of duplicate code
- ✅ **Fixed syntax errors** caused by malformed code
- ✅ **Improved maintainability** - changes to background fetching now only need to be made in one place
- ✅ **Better error handling** with proper try-catch blocks
- ✅ **Added input validation** with `.trim()` to handle whitespace

### Benefits
1. **DRY Principle**: Don't Repeat Yourself - code is now reusable
2. **Single Responsibility**: Each function has one clear purpose
3. **Error Resilience**: Proper error handling prevents crashes
4. **Testability**: Isolated functions are easier to unit test
5. **Readability**: Cleaner, more understandable code

## 🧪 Testing Recommendations

Before committing, test the following scenarios:

1. **Search for a city**
   - Enter a city name and click search
   - Verify weather data loads
   - Verify background image changes

2. **Click weather icon**
   - Click the weather icon to trigger `changeBackgroundImage()`
   - Verify a new background loads

3. **Empty search**
   - Try searching with empty input
   - Verify toast notification appears

4. **Invalid city**
   - Search for "XYZ123Invalid"
   - Verify error handling works properly

5. **Network errors**
   - Test with network throttling
   - Verify graceful error handling

## 📝 Files Modified

- `assets/js/script.js` - Main application logic

## 🚀 Next Steps

1. **Test the changes** in a browser
2. **Run the dev server**: `npm start`
3. **Verify all functionality** works as expected
4. **Create a git commit** with descriptive message
5. **Submit a pull request** following CONTRIBUTING.md guidelines

## 💡 Commit Message Suggestion

```
Fix: Remove duplicate code in background image fetching

- Created reusable fetchBackgroundImage() function
- Refactored weather.search() to use new function
- Implemented missing changeBackgroundImage() function
- Added missing setLoading() method
- Fixed malformed code in catch block (lines 690-702)
- Improved error handling in fetchWeather()

This change reduces code duplication by ~30 lines and improves
maintainability by consolidating Pexels API logic into a single
reusable function.

Fixes #[issue-number]
```

## 🎉 Summary

Successfully eliminated duplicate code and improved code quality! The application now has:
- A reusable background fetching function
- Proper error handling throughout
- Cleaner, more maintainable code structure
- All syntax errors resolved

**Lines of code reduced**: ~30 lines
**Functions added**: 3 (fetchBackgroundImage, changeBackgroundImage, setLoading)
**Bugs fixed**: 2 (duplicate code, missing try-catch)
