"use client";

import useDebouncedState from "@/_hooks/misc/use-debounced-state.hook";
import useSuspensePriceCheck from "@/_hooks/product/use-suspense-price-check.hook";
import { cn, formatNumberToPrice } from "@/_lib/utils";
import useAddToCartForm from "../use-add-to-cart-form.hook";

type ProductPricesProps = {
  readonly token: string;
  readonly productId: number;
  readonly listPrice: number;
  readonly uom: string;
  readonly hasDiscount: boolean;
  readonly className?: string;
};

const ProductPrices = ({
  productId,
  listPrice,
  uom,
  token,
  hasDiscount,
  className,
}: ProductPricesProps) => {
  const { watch } = useAddToCartForm();
  const quantity = watch("quantity");
  const delayedQuantity = useDebouncedState(quantity);

  const priceCheckQuery = useSuspensePriceCheck(token, [
    { productId, qty: delayedQuantity },
  ]);
  const priceData = priceCheckQuery.data.productPrices[0];
  const currentPrice = priceData?.uomPrice ?? priceData?.price ?? 0;

  const discount = Math.round(((listPrice - currentPrice) / listPrice) * 100);

  const actualUom = priceData?.uomPriceUnit ?? uom;

  const isLaminateItem = !!priceData?.uomPrice && !!priceData?.uomPriceUnit;

  return (
    <section className={cn("space-y-3 md:space-y-4", className)}>
      <div className="flex flex-row items-end gap-1 text-lg leading-6 text-wurth-gray-800">
        <div className="text-xl font-semibold leading-none">
          $
          <span className="font-title text-[1.75rem] leading-8">
            {formatNumberToPrice(currentPrice)}
          </span>
        </div>

        {hasDiscount && !isLaminateItem && discount > 0 && (
          <div className="text-wurth-gray-400 line-through">
            ${formatNumberToPrice(listPrice)}
          </div>
        )}

        <div>
          <span className="text-sm font-semibold">/</span>
          <span className="font-title leading-none">{actualUom}</span>
        </div>

        {hasDiscount && !isLaminateItem && discount > 0 && (
          <div className="font-semibold text-green-700">
            You save ${formatNumberToPrice(listPrice - currentPrice)}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-0.5">
        {priceData?.priceBreakDowns.map((item) => (
          <div
            key={item.quantity}
            className="rounded-lg bg-wurth-gray-50 px-4 py-3 odd:rounded-r-none last:odd:rounded-r-lg even:rounded-l-none md:py-2"
          >
            <h5 className="text-sm font-medium text-wurth-gray-800">
              {item.quantity} items
            </h5>

            <div className="text-sm font-semibold leading-none text-wurth-gray-800">
              <span className="text-base font-bold leading-6">
                ${formatNumberToPrice(item.price)}
              </span>
              /{uom}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductPrices;
