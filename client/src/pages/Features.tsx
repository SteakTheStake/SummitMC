import FeaturesSection from "@/components/sections/features";
import MainLayout from "@/layouts/MainLayout";

export default function Features() {
  return (
    <MainLayout>
      <div className="min-h-screen pt-20">
        <FeaturesSection />
      </div>
    </MainLayout>
  );
}