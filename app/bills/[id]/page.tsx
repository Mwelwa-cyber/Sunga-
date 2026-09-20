import BillDetailClient from "./BillDetailClient";

export async function generateStaticParams() {
  return [{ id: "_" }];
}

export default function BillDetailPage() {
  return <BillDetailClient />;
}
