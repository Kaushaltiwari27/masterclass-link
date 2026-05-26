# AI Mastery Kickstart — Premium Landing Page & Administrative Portal

A premium, highly converting, and animated landing page for the **2-Day Free AI Masterclass** by **Parv Infosoft**. This portal contains visitor registration features, automated inbox simulations, an admin dashboard metrics viewer, and integration settings with dynamic Meta Pixel conversion tracking.

Live URL: [https://masterclass-link.vercel.app/](https://masterclass-link.vercel.app/)

---

## 🚀 Key Features

*   **Interactive Landing Experience**: Beautiful, modern UI designed with harmonious dark-mode palettes, custom typography, glassmorphism, and responsive layouts.
*   **Dynamic Animations**: Powered by GSAP (GreenSock Animation Platform) and ScrollTrigger for premium micro-interactions, custom marquee alerts, and content reveals.
*   **Real-time Countdown Timer**: Built-in urgency driver tracking the remaining time for registration.
*   **Confetti Success Celebrations**: Confetti canvas simulation triggered immediately upon successful seat reservation.
*   **Simulated Email Inbox**: Interactive automated client-side confirmation dispatch preview on the Thank You Page.
*   **Administrative Dashboard**: Integrated database manager (`admin.html`) listing registrations, professional metrics, goals breakdown, referral traffic sources, search filters, and CSV exporter.
*   **Integrations & Webhooks Manager**: Configuration panel (`settings.html`) supporting custom webhook URLs (e.g., Google Sheets, Zapier) and live JSON transmission testing.
*   **Meta Pixel & Conversion Tracking**: 
    *   Literal base scripts inlined directly in `<head>` for `PageView` and `ViewContent` analytics.
    *   Direct `fbq('track', 'Lead')` conversion firing upon successful registration.
    *   Compatible with static builds and environment variables for deployment.

---

## 🛠️ Technology Stack

*   **Core**: HTML5, Vanilla JavaScript (ES6)
*   **Styling**: Vanilla CSS3 (Custom properties, grid systems, HSL tailored variables, media queries)
*   **Animations**: GreenSock GSAP v3 & ScrollTrigger v3
*   **Build Pipeline**: Node.js build script to inject production environment configurations during Vercel deployment pipelines.

---

## ⚙️ Meta Pixel Configuration & Environment Variables

The codebase is built to support dynamic Meta Pixel IDs during Vercel deployments using environment variables.

### How to configure:
1.  Go to your **Vercel Dashboard** -> **Settings** -> **Environment Variables**.
2.  Add a new environment variable:
    *   **Key**: `NEXT_PUBLIC_META_PIXEL_ID`
    *   **Value**: *[Your Meta Pixel/Dataset ID]*
3.  Trigger a deployment. The `npm run build` script will dynamically:
    *   Generate a fresh copy of `meta-pixel-config.js` containing the ID.
    *   Inject the ID into the `<noscript>` tags of all HTML pages (`index.html`, `admin.html`, `settings.html`) in the final output directory.

---

## 💻 Local Development

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/Kaushaltiwari27/masterclass-link.git
    cd masterclass-link
    ```

2.  **Run a Local Server**:
    Using Python:
    ```bash
    python -m http.server 8000
    ```
    Or Node:
    ```bash
    npx serve .
    ```

3.  **Local Build Simulation**:
    ```bash
    npm install
    # Test environment variable injection locally (Powershell)
    $env:NEXT_PUBLIC_META_PIXEL_ID=""; npm run build
    ```
    This will compile the production-ready assets into the `public/` directory.
