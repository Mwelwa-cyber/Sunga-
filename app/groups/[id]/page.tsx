import GroupDetailClient from "./GroupDetailClient";

export async function generateStaticParams() {
  return [{ id: "_" }];
}

export default function GroupDetailPage() {
  return <GroupDetailClient />;
}
