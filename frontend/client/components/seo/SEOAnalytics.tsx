import { useEffect } from "react";

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

interface SEOAnalyticsProps {
  trackingId?: string;
  enableGTM?: boolean;
  enableHotjar?: boolean;
  enableMicrosoftClarity?: boolean;
}

export const SEOAnalytics: React.FC<SEOAnalyticsProps> = ({
  trackingId = "G-XXXXXXXXXX", // Replace with actual Google Analytics 4 ID
  enableGTM = true,
  enableHotjar = false,
  enableMicrosoftClarity = false,
}) => {
  useEffect(() => {
    // Google Analytics 4
    if (trackingId) {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
      document.head.appendChild(script);

      script.onload = () => {
        window.dataLayer = window.dataLayer || [];
        window.gtag = function () {
          window.dataLayer.push(arguments);
        };
        window.gtag("js", new Date());
        window.gtag("config", trackingId, {
          page_title: document.title,
          page_location: window.location.href,
        });
      };
    }

    // Google Tag Manager (optional)
    if (enableGTM) {
      const gtmScript = document.createElement("script");
      gtmScript.innerHTML = `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-XXXXXXX');
      `;
      document.head.appendChild(gtmScript);
    }

    // Hotjar (optional)
    if (enableHotjar) {
      const hotjarScript = document.createElement("script");
      hotjarScript.innerHTML = `
        (function(h,o,t,j,a,r){
          h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
          h._hjSettings={hjid:XXXXXXX,hjsv:6};
          a=o.getElementsByTagName('head')[0];
          r=o.createElement('script');r.async=1;
          r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
          a.appendChild(r);
        })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
      `;
      document.head.appendChild(hotjarScript);
    }

    // Microsoft Clarity (optional)
    if (enableMicrosoftClarity) {
      const clarityScript = document.createElement("script");
      clarityScript.innerHTML = `
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "XXXXXXXXX");
      `;
      document.head.appendChild(clarityScript);
    }

    return () => {
      // Cleanup analytics scripts on unmount
      const scripts = document.querySelectorAll(
        'script[src*="googletagmanager"], script[src*="hotjar"], script[src*="clarity"]',
      );
      scripts.forEach((script) => script.remove());
    };
  }, [trackingId, enableGTM, enableHotjar, enableMicrosoftClarity]);

  return null;
};

// Custom analytics tracking functions
export const trackEvent = (eventName: string, parameters?: any) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, parameters);
  }
};

export const trackPageView = (url: string, title?: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", "G-XXXXXXXXXX", {
      page_path: url,
      page_title: title,
    });
  }
};

// E-commerce tracking for lesson bookings
export const trackPurchase = (
  transactionId: string,
  value: number,
  items: any[],
) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "purchase", {
      transaction_id: transactionId,
      value: value,
      currency: "USD",
      items: items,
    });
  }
};

// Lead tracking for teacher applications
export const trackLead = (
  leadType: "student_signup" | "teacher_application",
) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "generate_lead", {
      event_category: "engagement",
      event_label: leadType,
    });
  }
};

// Performance monitoring
export const trackPerformance = () => {
  if (typeof window !== "undefined" && "performance" in window) {
    window.addEventListener("load", () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType(
          "navigation",
        )[0] as PerformanceNavigationTiming;
        const pageLoadTime = perfData.loadEventEnd - perfData.loadEventStart;
        const domContentLoaded =
          perfData.domContentLoadedEventEnd -
          perfData.domContentLoadedEventStart;

        if (window.gtag) {
          window.gtag("event", "page_load_time", {
            event_category: "performance",
            event_label: "page_load",
            value: Math.round(pageLoadTime),
          });

          window.gtag("event", "dom_content_loaded", {
            event_category: "performance",
            event_label: "dom_ready",
            value: Math.round(domContentLoaded),
          });
        }
      }, 0);
    });
  }
};
