export interface FreeDownloadItem {
  id: string;
  name: string;
  category: string;
  description: string;
  fileSize: string;
  format: string;
  emoji: string;
}

export const freeDownloads: FreeDownloadItem[] = [
  {
    id: "free-1",
    name: "10 Free Lightroom Presets",
    category: "Photos",
    description: "A starter pack of 10 versatile Lightroom presets — warm, cool, and B&W styles. Perfect for testing the Kyno preset workflow before buying a full bundle.",
    fileSize: "2.4 MB",
    format: "ZIP (XMP files)",
    emoji: String.fromCodePoint(0x1F4F7),
  },
  {
    id: "free-2",
    name: "Minimal Portfolio Template (Free)",
    category: "Templates",
    description: "A clean, single-page portfolio template built with HTML/CSS. Drop your work in and deploy in minutes. Great starter for designers and photographers.",
    fileSize: "1.1 MB",
    format: "ZIP (HTML/CSS/JS)",
    emoji: String.fromCodePoint(0x1F4D0),
  },
  {
    id: "free-3",
    name: "Sans Serif Regular (Free Weight)",
    category: "Fonts",
    description: "Our Modern Sans Serif font family — regular weight free for personal and commercial use. Try it in your projects before buying the full 5-weight family.",
    fileSize: "340 KB",
    format: "OTF + WOFF2",
    emoji: String.fromCodePoint(0x1F524),
  },
  {
    id: "free-4",
    name: "UX/UI Starter Kit",
    category: "Templates",
    description: "20 basic Figma components and a 4-page wireframe template. A lightweight starting point for your next design project.",
    fileSize: "4.8 MB",
    format: "ZIP (Figma .fig)",
    emoji: String.fromCodePoint(0x1F4D0),
  },
  {
    id: "free-5",
    name: "Photo Editing Checklist",
    category: "Photos",
    description: "A printable checklist covering the full photo editing workflow — from import to export. Includes tips for Lightroom and Photoshop.",
    fileSize: "180 KB",
    format: "PDF",
    emoji: String.fromCodePoint(0x1F4F7),
  },
  {
    id: "free-6",
    name: "Handwritten Script Display",
    category: "Fonts",
    description: "A display-only version of our Handwritten Script font with limited character set. Great for testing the style in headlines and logos.",
    fileSize: "220 KB",
    format: "OTF + WOFF2",
    emoji: String.fromCodePoint(0x1F524),
  },
];
