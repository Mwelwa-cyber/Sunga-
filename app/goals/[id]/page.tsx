import GoalDetailClient from "./GoalDetailClient";

export async function generateStaticParams() {
  return [{ id: "_" }];
}

export default function GoalDetailPage() {
  return <GoalDetailClient />;
}
