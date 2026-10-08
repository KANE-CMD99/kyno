import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { getTodayStats, getHistory, getAllCustomerEmails, exportCustomerEmailsCSV } from "@/db/stats";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const format = searchParams.get("format");

  if (format === "csv") {
    const csv = exportCustomerEmailsCSV();
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="customer-emails-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  }

  const today = getTodayStats();
  const history = getHistory();
  const customers = getAllCustomerEmails();

  return NextResponse.json({
    today,
    history,
    customers,
    total: {
      customers: customers.filter((c, i, arr) => arr.findIndex(x => x.email === c.email) === i).length,
      orders: history.reduce((sum, h) => sum + h.orders, 0) + today.orders,
      revenue: history.reduce((sum, h) => sum + h.revenue, 0) + today.revenue,
    },
  });
}
