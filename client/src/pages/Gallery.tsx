import GallerySection from "@/components/sections/gallery";
import MainLayout from "@/layouts/MainLayout";

export default function Gallery() {
  return (
    <MainLayout>
      <div className="min-h-screen pt-20">
        <GallerySection />
      </div>
    </MainLayout>
  );
}