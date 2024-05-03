"use client";

import type { Plant, ShippingMethod } from "@/_lib/types";
import { Button } from "@/old/_components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/old/_components/ui/collapsible";
import { cn } from "@/old/_utils/helpers";
import dayjs from "dayjs";
import { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { UI_DATE_FORMAT } from "../constants";

type MoreItemDetailsForMobileProps = {
  lineItems: {
    itemNo: string;
    sku: string;
    productId: number;
    itemDescription: string;
    deliveryDate: string;
    plant: string;
    shippingCondition: string;
    invoice: string;
    shipQuantity: number;
    boQty: number;
    boDate: string;
    itemStatus: string;
    promoCode: string;
  }[];
  shippingMethods: ShippingMethod[];
  plants: Plant[];
};

const MoreItemDetailsForMobile = ({
  lineItems,
  shippingMethods,
  plants,
}: MoreItemDetailsForMobileProps) => {
  const [showMoreDetails, setShowMoreDetails] = useState(false);

  const getShippingMethodName = (shippingCode: string) => {
    const shippingMethod = shippingMethods.find(
      (method) => method.code === shippingCode,
    );

    return shippingMethod?.name ?? "N/A";
  };

  const getPlantName = (plantCode: string) => {
    const plant = plants.find((plant) => plant.code === plantCode);

    return plant?.name ?? "N/A";
  };

  return (
    <Collapsible open={showMoreDetails} onOpenChange={setShowMoreDetails}>
      <div className="flex flex-row justify-between">
        <CollapsibleTrigger asChild className="group">
          <Button variant="outline" className="h-12 w-[170px] text-base">
            More Details
            <MdKeyboardArrowDown className="text-2xl leading-none transition-transform duration-200 ease-out group-data-[state=open]:rotate-180" />
          </Button>
        </CollapsibleTrigger>

        <Button className="h-12 w-[170px] text-base">Buy Again</Button>
      </div>

      <CollapsibleContent className="py-2">
        {lineItems?.length &&
          lineItems.map((lineItem) => (
            <>
              <div
                key={lineItem.itemNo}
                className="flex flex-col rounded bg-brand-gray-100 px-3"
              >
                <DetailedLine
                  title="Item No"
                  value={lineItem?.itemNo ?? "N/A"}
                />
                <DetailedLine title="PO/Job Name" value="N/A" />
                <DetailedLine
                  title="Promo Code"
                  value={lineItem.promoCode ?? "N/A"}
                />
                <DetailedLine title="Line No" value="N/A" />
                <DetailedLine
                  title="Invoice"
                  value={lineItem.invoice ?? "N/A"}
                />
                <DetailedLine
                  title="Ship Date"
                  value={
                    lineItem?.deliveryDate !== ""
                      ? dayjs(lineItem.deliveryDate).format(UI_DATE_FORMAT)
                      : "N/A"
                  }
                />
                <DetailedLine
                  title="B/O Date"
                  value={
                    lineItem?.boDate !== ""
                      ? dayjs(lineItem.boDate).format(UI_DATE_FORMAT)
                      : "N/A"
                  }
                />
                <DetailedLine
                  title="Ship Via"
                  value={
                    lineItem?.shippingCondition
                      ? getShippingMethodName(lineItem.shippingCondition)
                      : "N/A"
                  }
                />
                <DetailedLine
                  title="Location"
                  value={lineItem?.plant ? getPlantName(lineItem.plant) : "N/A"}
                  isLastItem
                />
              </div>
            </>
          ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default MoreItemDetailsForMobile;

const DetailedLine = ({
  title,
  value,
  isLastItem = false,
}: {
  title: string;
  value: string;
  isLastItem?: boolean;
}) => (
  <div
    className={cn(
      "flex flex-row items-center justify-between py-3",
      isLastItem ? "" : "border-b",
    )}
  >
    <div>{title}</div>
    <div className="font-bold">{value !== "" ? value : "N/A"}</div>
  </div>
);
