import usePathnameHistoryState from "@/_hooks/misc/use-pathname-history-state.hook";
import { SESSION_TOKEN_COOKIE } from "@/_lib/constants";
import { getGTMPageType } from "@/_lib/gtm-utils";
import Separator from "@/old/_components/separator";
import { sendGTMEvent } from "@next/third-parties/google";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PurchasedItemsList from "./purchased-items-list";

export const metadata: Metadata = {
  title: "Purchased Items",
};

const PurchasedItemsPage = () => {
  const pathnameHistory = usePathnameHistoryState(
    (state) => state.pathnameHistory,
  );

  sendGTMEvent({
    event: "view_page",
    viewPageData: {
      page_type: getGTMPageType(
        pathnameHistory[pathnameHistory.length - 1] ?? "",
      ),
    },
  });

  const sessionTokenCookie = cookies().get(SESSION_TOKEN_COOKIE);

  if (!sessionTokenCookie?.value) {
    return redirect("/");
  }

  return (
    <>
      <div className="px-4 pt-4 md:px-0 md:pt-0">
        <h2 className="relative font-wurth text-xl font-medium text-brand-primary">
          My Purchased Items
        </h2>

        <Separator
          orientation="horizontal"
          className="mb-4 h-px flex-1 bg-brand-primary"
        />
      </div>

      <PurchasedItemsList token={sessionTokenCookie?.value} />
    </>
  );
};

export default PurchasedItemsPage;
