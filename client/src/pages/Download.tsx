import DownloadSection from "@/components/sections/download";
import ToolsSection from "@/components/sections/tools";
import MainLayout from "@/layouts/MainLayout";

export default function Download() {
  return (
    <MainLayout>
      <div className="min-h-screen pt-20">
        <DownloadSection />
        <ToolsSection />
      </div>
    </MainLayout>
  );
}