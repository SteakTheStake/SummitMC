import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Download, AlertCircle } from "lucide-react";

interface ModRequirementsModalProps {
  children: React.ReactNode;
  onConfirmDownload: () => void;
  resolution: string;
  platform: string;
}

const requiredMods = [
  {
    name: "Continuity",
    description: "Enables connected textures and enhanced block rendering",
    url: "https://modrinth.com/mod/continuity",
    essential: true
  },
  {
    name: "Entity Model Features",
    description: "Adds support for custom entity models and animations",
    url: "https://modrinth.com/mod/entity-model-features",
    essential: true
  },
  {
    name: "Entity Texture Features",
    description: "Enables advanced entity texture features and effects",
    url: "https://modrinth.com/mod/entitytexturefeatures",
    essential: true
  },
  {
    name: "Polytone",
    description: "Provides biome-specific texture variations and lighting",
    url: "https://modrinth.com/mod/polytone",
    essential: true
  }
];

export default function ModRequirementsModal({ children, onConfirmDownload, resolution, platform }: ModRequirementsModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDownload = () => {
    onConfirmDownload();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl glassmorphism border-slate-600">
        <DialogHeader>
          <DialogTitle className="font-pixelbasel text-2xl text-teal-400 flex items-center gap-2">
            <AlertCircle size={24} />
            Required Mods for Summit
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-yellow-500 mt-0.5" size={20} />
              <div>
                <h3 className="font-semibold text-yellow-400 mb-1">Important Notice</h3>
                <p className="text-sm text-slate-300">
                  Summit requires specific mods to function properly. Please install these mods before using the texture pack.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-pixelbasel font-semibold text-lg mb-4 text-white">Required Mods</h3>
            <div className="grid gap-3">
              {requiredMods.map((mod, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-white">{mod.name}</h4>
                      {mod.essential && <Badge variant="destructive" className="text-xs">Required</Badge>}
                    </div>
                    <p className="text-sm text-slate-300">{mod.description}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(mod.url, '_blank')}
                    className="ml-3 border-slate-600 hover:bg-slate-700"
                  >
                    <ExternalLink size={14} />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <h3 className="font-semibold text-blue-400 mb-2">Mod Loader Requirements</h3>
            <p className="text-sm text-slate-300 mb-3">
              <strong>Fabric Mod Loader</strong> is preferred for the best experience. Alternatively, any mods that simulate the same features may work, or you can use <strong>OptiFine standalone</strong>.
            </p>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="outline" className="border-blue-500/20 text-blue-400">Fabric (Recommended)</Badge>
              <Badge variant="outline" className="border-slate-600 text-slate-300">OptiFine</Badge>
              <Badge variant="outline" className="border-slate-600 text-slate-300">Compatible Alternatives</Badge>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-700">
            <p className="text-sm text-slate-400">
              Downloading: <span className="text-teal-400 font-semibold">{resolution} - {platform}</span>
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="border-slate-600 hover:bg-slate-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDownload}
                className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
              >
                <Download className="mr-2" size={16} />
                I Understand, Download
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}