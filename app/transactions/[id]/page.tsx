import EditTransactionClient from "./EditTransactionClient";

export async function generateStaticParams() {
  return [{ id: "_" }];
}

export default function EditTransactionPage() {
  return <EditTransactionClient />;
}
