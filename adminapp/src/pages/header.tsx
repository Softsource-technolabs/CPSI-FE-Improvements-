import { Button } from "../../../components/ui/button";
import { Home } from "lucide-react";
import { useEffect, useState, useRef } from "react";

interface LogoProps {
  logoUrl: string;
}

const Logo: React.FC<LogoProps> = ({ logoUrl }) => {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const updateLogoSize = () => {
      if (!imgRef.current) return;
      
      const width = window.innerWidth;
      let height = '2rem'; // Default h-10
      
      if (width >= 1536) {
        height = '4rem'; // 2xl:h-40
      } else if (width >= 1024) {
        height = '5rem'; // lg:h-24
      } else if (width >= 768) {
        height = '3.5rem'; // md:h-14
      } else if (width >= 640) {
        height = '3rem'; // sm:h-12
      }
      
      imgRef.current.style.height = height;
    };
    
    updateLogoSize();
    window.addEventListener('resize', updateLogoSize);
    return () => window.removeEventListener('resize', updateLogoSize);
  }, []);

  return (
    <img
      ref={imgRef}
      // className="aspect-3/2 h-5 sm:h-12 md:h-14 lg:h-24 xl:h-32 2xl:h-40 w-auto"
      style={{
        // aspectRatio: '3/2',
        height: '1rem',
        // backgroundColor: '#007bff',
        width: 'auto'
      }}
      src={logoUrl}
      alt="Logo"
      tabIndex={0}
    />
  );
};

const HeaderLayout: React.FC = () => {
  const [logoUrl, setLogoUrl] = useState<string>("/assets/one_user.png");

  const updateLogo = (isSmallScreen: boolean) => {
    const cachedSettings = localStorage.getItem("customStyle");
    const defaultLogo = "/assets/one_user.png";
    const smallLogo = "/assets/logo.png";

    if (cachedSettings) {
      try {
        const parsed = JSON.parse(cachedSettings);
        const desktopLogo = parsed.logoImageUrl || defaultLogo;
        const mobileLogo = parsed.mobileLogoImageUrl || smallLogo;
        setLogoUrl(isSmallScreen ? mobileLogo : desktopLogo);
      } catch (e) {
        console.error("Error parsing customStyle", e);
        setLogoUrl(isSmallScreen ? smallLogo : defaultLogo);
      }
    } else {
      setLogoUrl(isSmallScreen ? smallLogo : defaultLogo);
    }
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px)");
    updateLogo(mediaQuery.matches);

    const handleResizeChange = (e: MediaQueryListEvent) => updateLogo(e.matches);
    mediaQuery.addEventListener("change", handleResizeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleResizeChange);
    };
  }, []);

 useEffect(() => {
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === "settingsTimestamp") {
      const mediaQuery = window.matchMedia("(max-width: 640px)");
      updateLogo(mediaQuery.matches);
    }
  };

  window.addEventListener("storage", handleStorageChange);
  return () => {
    window.removeEventListener("storage", handleStorageChange);
  };
}, []);

  return (
    <header className="sticky top-0 w-full border-b shadow-sm z-50 py-0">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-blue-50 z-0" />
      <div
        className="relative z-10 flex items-center justify-between px-4 h-16 bg-white whitespace-nowrap"
        style={{ backgroundColor: "var(--headerBackColor)" }}
      >
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6 min-w-0">
          <Logo logoUrl={logoUrl} />
          <span className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl text-gray-400 font-bold select-none">
            |
          </span>
          {/* <div className="hidden sm:block border-l h-7 border-gray-400 mx-2" /> */}
          <div
            className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold truncate"
            style={{ color: "var(--headerForeColor)" }}
          >
            One User SSO
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0 whitespace-nowrap">
          <span
            className="text-sm sm:text-base lg:text-xl xl:text-2xl 2xl:text-3xl font-medium"
            style={{ color: "var(--headerForeColor)" }}
          >
            ABC School
          </span>
          <Button className="bg-indigo-950 text-white text-xs sm:text-sm xl:text-xl 2xl:text-2xl px-3 py-2">
            <Home className="mr-1 h-4 w-4" />
            Change District
          </Button>
        </div>
      </div>
    </header>
  );
};

export default HeaderLayout;
