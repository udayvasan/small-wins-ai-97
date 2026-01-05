// src/components/GoogleTranslate.tsx
import { useEffect, useState } from "react";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

/* ------------------ Language List ------------------ */
const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
  { code: "gu", name: "ગુજરાતી", flag: "🇮🇳" },
];

/* ------------------ Type Fix for TS ------------------ */
declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

export function GoogleTranslate() {
  const [currentLang, setCurrentLang] = useState("en");

  /* ------------------ Load Google Script ------------------ */
  useEffect(() => {
    if (document.getElementById("google-translate-script")) return;

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: languages.map(l => l.code).join(","),
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };

    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    /* -------- Hide Google Default UI -------- */
    const style = document.createElement("style");
    style.innerHTML = `
      .goog-te-banner-frame,
      .goog-logo-link,
      .goog-te-gadget {
        display: none !important;
      }
      body {
        top: 0 !important;
      }
    `;
    document.head.appendChild(style);
  }, []);

  /* ------------------ Translate Function ------------------ */
  const translatePage = (langCode: string) => {
    setCurrentLang(langCode);

    const select = document.querySelector(
      ".goog-te-combo"
    ) as HTMLSelectElement;

    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event("change"));
    } else {
      // fallback (first load)
      document.cookie = `googtrans=/en/${langCode}; path=/`;
      window.location.reload();
    }
  };

  const activeLang =
    languages.find(l => l.code === currentLang) || languages[0];

  /* ------------------ UI ------------------ */
  return (
    <>
      {/* Hidden Google Element */}
      <div id="google_translate_element" style={{ display: "none" }} />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2">
            <Globe className="w-4 h-4" />
            <span>{activeLang.flag}</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          {languages.map(lang => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => translatePage(lang.code)}
              className={`cursor-pointer ${
                currentLang === lang.code ? "bg-accent" : ""
              }`}
            >
              <span className="mr-2">{lang.flag}</span>
              {lang.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
