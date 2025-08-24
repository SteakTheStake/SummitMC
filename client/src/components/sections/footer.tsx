import { Mountain, ExternalLink } from "lucide-react";

const footerSections = [
  {
    title: "Downloads",
    links: [
      { name: "Modrinth", url: "https://modrinth.com/resourcepack/summit" },
      { name: "PlanetMinecraft", url: "https://www.planetminecraft.com/texture-pack/summit-6177524/" },
      { name: "Archive", url: "#" }
    ]
  },
  {
    title: "Community",
    links: [
      { name: "Discord", url: "https://discord.gg/M9cmBBGKU8" },
      { name: "Reddit", url: "#" },
      { name: "Screenshots", url: "#" },
      { name: "Support", url: "https://discord.gg/M9cmBBGKU8" }
    ]
  },
  {
    title: "Resources",
    links: [
      { name: "Installation Guide", url: "#" },
      { name: "Changelog", url: "#" },
      { name: "FAQ", url: "#" },
      { name: "Performance Tips", url: "#" }
    ]
  }
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-12 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <img src="/limitless-logo.png" alt="Limitless Designs" className="h-10 w-auto" />
              <div>
                <h1 className="font-pixelbasel font-bold text-xl bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent">Summit</h1>
                <p className="text-xs text-slate-400">Limitless Designs</p>
              </div>
            </div>
            <p className="text-slate-400 font-extralight text-[12px] text-center">Minecraft At It's Peak</p>
          </div>
          
          {footerSections.map((section, index) => (
            <div key={index}>
              <h4 className="font-pixelbasel font-semibold text-lg mb-4 minecraft-green">{section.title}</h4>
              <ul className="space-y-2 text-slate-400">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a 
                      href={link.url} 
                      className="hover:text-green-400 transition-colors duration-200 flex items-center gap-2"
                      target={link.url.startsWith("http") ? "_blank" : undefined}
                      rel={link.url.startsWith("http") ? "noopener noreferrer" : undefined}
                    >
                      {link.name}
                      {link.url.startsWith("http") && (
                        <ExternalLink size={14} className="text-slate-500" />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400 text-sm">
          <p className="mb-2">© 2025 Limitless Designs</p>
          <p>'Minecraft' is a trademark of Mojang. Not affiliated with Mojang or Microsoft.</p>
        </div>
      </div>
    </footer>
  );
}
