import usePathnameHistoryState from "@/_hooks/misc/use-pathname-history-state.hook";
import { getGTMPageType } from "@/_lib/gtm-utils";
import { sendGTMEvent } from "@next/third-parties/google";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Subscription Confirmation",
};

const SubscriptionConfirmationPage = () => {
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

  return (
    <div className="container flex flex-row justify-center">
      <div className="my-20 space-y-2 text-base text-wurth-gray-500">
        <h1 className="text-2xl font-bold text-wurth-gray-800">
          Thank You for Subscribing
        </h1>

        <p>
          Thank you for subscribing to receive our{" "}
          <span className="font-semibold">Promotions and Special Offers</span>.
        </p>

        <p>
          You may unsubscribe anytime or change your email preferences by
          clicking the &quot;Unsubscribe&quot; link at the bottom of any email
          you receive from us.
        </p>
      </div>
    </div>
  );
};

export default SubscriptionConfirmationPage;
