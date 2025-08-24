import CreatorSection from "@/components/sections/creator";
import MainLayout from "@/layouts/MainLayout";

export default function About() {
  return (
    <MainLayout>
      <div className="min-h-screen pt-20">
        <CreatorSection />
      </div>
    </MainLayout>
  );
}