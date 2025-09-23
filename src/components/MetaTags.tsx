import { useEffect } from 'react';

interface MetaTagsProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export const MetaTags: React.FC<MetaTagsProps> = ({
  title = "Bitcoin Conference India - Registration",
  description = "Register for Bitcoin Conference India in Hyderabad. India's first Bitcoin conference featuring world-class speakers and networking opportunities. Get a chance to win FREE tickets!",
  image = "https://bitcoinconferenceindia.com/bitcoin-conference-banner.png",
  url = "https://bitcoinconferenceindia.com/"
}) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (property: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${property}"]` : `meta[name="${property}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (isProperty) {
          meta.setAttribute('property', property);
        } else {
          meta.setAttribute('name', property);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', 'Bitcoin, Conference, India, Hyderabad, Cryptocurrency, Blockchain, Registration, Free Tickets');

    // Open Graph tags
    updateMetaTag('og:type', 'website', true);
    updateMetaTag('og:url', url, true);
    updateMetaTag('og:title', 'Bitcoin Conference India - Hyderabad', true);
    updateMetaTag('og:description', '🇮🇳 Join India\'s premier Bitcoin gathering featuring world-class speakers, networking opportunities, and insights into the future of Bitcoin in India. Register now for a chance to win FREE tickets! 🎫', true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:image:width', '1200', true);
    updateMetaTag('og:image:height', '630', true);
    updateMetaTag('og:image:alt', 'Bitcoin Conference India - Hyderabad, India', true);
    updateMetaTag('og:site_name', 'Bitcoin Conference India', true);
    updateMetaTag('og:locale', 'en_IN', true);

    // Twitter tags
    updateMetaTag('twitter:card', 'summary_large_image', true);
    updateMetaTag('twitter:url', url, true);
    updateMetaTag('twitter:title', 'Bitcoin Conference India - Hyderabad', true);
    updateMetaTag('twitter:description', '🇮🇳 Join India\'s premier Bitcoin gathering featuring world-class speakers, networking opportunities, and insights into the future of Bitcoin in India. Register now for a chance to win FREE tickets! 🎫', true);
    updateMetaTag('twitter:image', image, true);

    // Force favicon refresh
    const refreshFavicon = () => {
      const links = document.querySelectorAll('link[rel*="icon"]');
      links.forEach(link => {
        const href = (link as HTMLLinkElement).href;
        if (href.includes('favicon')) {
          const newHref = href.split('?')[0] + '?v=' + Date.now();
          (link as HTMLLinkElement).href = newHref;
        }
      });
    };

    // Refresh favicon after a short delay
    setTimeout(refreshFavicon, 100);
  }, [title, description, image, url]);

  return null;
};