import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CartBar } from "@/components/CartBar";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { getPosts, getSite } from "@/lib/content";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [posts, siteData] = await Promise.all([getPosts(), getSite()]);
  return (
    <>
      <Nav />
      <AnnouncementBar posts={posts.filter((p) => p.kind === "annonce")} />
      <main className="flex-1">{children}</main>
      <Footer site={siteData} />
      <CartBar />
    </>
  );
}
