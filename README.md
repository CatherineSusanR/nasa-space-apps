
# 🌊 NASA Ocean Thermometer

**A Dive into Global Ocean Warming Using NASA Data**

Built for NASA Space Apps Challenge 2025

---

## 🚀 Overview

NASA Ocean Thermometer is an interactive visualization platform highlighting the effects of climate change on Earth’s oceans. Users can explore any of the five major oceans and track changes in **temperature** and **marine ecosystem health** over time using NASA data.

**Purpose:** To make ocean warming and ecosystem degradation **accessible, visual, and actionable**, helping users understand the scale and urgency of climate change and how it impacts marine life.

---

## 🛰️ NASA Data Sources & Resources Used

This project integrates NASA APIs and resources to visualize ocean health:

### Primary Data Sources:

1. **GISS Surface Temperature Analysis (GISTEMP v4)**

   * URL: [GISTEMP](https://data.giss.nasa.gov/gistemp/)
   * API: [JSON Data](https://data.giss.nasa.gov/gistemp/tabledata_v4/GLB.Ts+dSST.json)
   * Description: Global surface temperature anomalies (1997-present)

2. **NASA Ocean Color Web (Chlorophyll-a & Ocean Biology)**

   * URL: [Ocean Color](https://oceancolor.gsfc.nasa.gov/)
   * API: MODIS / SeaWiFS data endpoints
   * Description: Chlorophyll concentration data indicating marine ecosystem health

3. **Earth Observatory Natural Event Tracker (EONET)**

   * URL: [EONET](https://eonet.gsfc.nasa.gov/)
   * API: [EONET API](https://eonet.gsfc.nasa.gov/api/v3/events)
   * Description: Tracks natural events affecting oceans globally

4. **MODIS Aqua & Terra Satellites**

   * URL: [MODIS](https://modis.gsfc.nasa.gov/)
   * Description: Sea surface temperature and chlorophyll measurements

5. **NASA Worldview**

   * URL: [Worldview](https://worldview.earthdata.nasa.gov/)
   * Description: Interactive satellite imagery browser

---

## ✨ Features

* ✅ **5 Major Oceans**: Pacific, Atlantic, Indian, Southern, Arctic
* ✅ **Temperature Visualization**: Real-time ocean warming data
* ✅ **Chlorophyll & Ecosystem Health**: Shows changes in marine productivity
* ✅ **Time Travel Slider**: Explore changes from **1997-present**
* ✅ **Dynamic Visuals**: Heatmaps and chlorophyll overlays

---

## 🌡️ How It Works

**Temperature Calculation:**

```
Ocean Temp = Base Temp + (Years × Warming Rate) + NASA GISTEMP Anomaly
```

**Chlorophyll/Health Index:**

```
Health = 100 - (Temp Anomaly × 15) - (Chlorophyll Loss × 0.3)
```

**Data Integration:**

* **GISTEMP** → global temperature anomalies
* **MODIS & Ocean Color** → chlorophyll and ocean biology data
* **EONET** → real-time natural events affecting oceans

---

## 🏆 NASA Space Apps Challenge 2025

### Challenge Category

Create Your Own Challenge

### Why This Project Matters

* Makes NASA ocean data **visually understandable**
* Highlights **global warming impacts on oceans and marine ecosystems**
* Demonstrates **chlorophyll degradation and ecosystem health decline**
* Encourages **climate awareness and informed decision-making**

### NASA Resources Compliance

* ✅ Uses NASA GISTEMP & MODIS data
* ✅ Uses NASA Ocean Color and EONET APIs
* ✅ References NASA satellites (MODIS, SMAP, GIBS, etc.)
* ✅ Cites NASA research and datasets

---

## 🛠️ Installation & Setup

### Prerequisites

* Node.js (v16 or higher)
* npm or yarn

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/nasa-ocean-thermometer.git
cd nasa-ocean-thermometer
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Install Required Packages

```bash
npm install lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Step 4: File Structure

Ensure your project has this structure:

```
nasa-ocean-thermometer/
├── src/
│   ├── App.js          (Main React component)
│   ├── App.css         (Provided styles)
│   ├── index.css       (Global styles)
│   └── index.js
├── public/
│   └── index.html
├── tailwind.config.js  (Provided config)
├── postcss.config.js
└── package.json
```

### Step 5: Replace Configuration Files

1. Replace `tailwind.config.js` with the provided configuration
2. Replace `App.css` with the provided styles
3. Replace `index.css` with the provided global styles
4. Replace `App.js` with the NASA Ocean component

### Step 6: Create PostCSS Config

Create `postcss.config.js` in the root directory:

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### Step 7: Start the Development Server

```bash
npm start
```

The app will open at `http://localhost:3000`

---

## 🎮 Usage

1. **Select an Ocean**: Choose from 5 major oceans
2. **Adjust Time**: Use the slider to travel from **1997-present**
3. **View Data**: See NASA satellite measurements
4. **Check Ecosystem Health**: Monitor chlorophyll & temperature indicators
5. **Satellite View**: Toggle satellite perspective

---

## 📱 Browser Compatibility

* ✅ Chrome, Firefox, Safari, Edge
* ✅ Mobile browsers supported

---

## 🤝 Contributing

This is a NASA Space Apps Challenge 2025 project. Contributions and feedback are welcome.

---

## 🔗 Links

* NASA GISTEMP: [https://data.giss.nasa.gov/gistemp/](https://data.giss.nasa.gov/gistemp/)
* NASA Ocean Color: [https://oceancolor.gsfc.nasa.gov/](https://oceancolor.gsfc.nasa.gov/)
* NASA EONET: [https://eonet.gsfc.nasa.gov/](https://eonet.gsfc.nasa.gov/)
* NASA APIs: [https://api.nasa.gov/](https://api.nasa.gov/)
* NASA Worldview: [https://worldview.earthdata.nasa.gov/](https://worldview.earthdata.nasa.gov/)

---

**Built with ❤️ for NASA Space Apps Challenge 2025**
*Making climate data actionable, one ocean at a time* 🌊

---


Do you want me to do that?
