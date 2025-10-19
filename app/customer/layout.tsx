import Navbar from "@/components/common/navbar";
export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
