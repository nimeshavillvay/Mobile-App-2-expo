"use client";

import useSuspenseCart from "@/_hooks/cart/use-suspense-cart.hook";
import useUpdateCartConfigMutation from "@/_hooks/cart/use-update-cart-config-mutation.hook";
import type { PaymentMethod } from "@/_lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Close } from "@repo/web-ui/components/icons/close";
import { Mastercard } from "@repo/web-ui/components/logos/mastercard";
import { Visa } from "@repo/web-ui/components/logos/visa";
import { Button } from "@repo/web-ui/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/web-ui/components/ui/form";
import { Input } from "@repo/web-ui/components/ui/input";
import { Label } from "@repo/web-ui/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@repo/web-ui/components/ui/radio-group";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AddCreditCardDialog from "./add-credit-card-dialog";
import { getPaymentId, isExpiredCreditCard } from "./helpers";
import OrderConfirmDialog from "./order-confirm-dialog";
import useDeleteCreditCardMutation from "./use-delete-credit-card-mutation.hook";
import useSuspenseCreditCards from "./use-suspense-credit-cards.hook";

const formSchema = z.object({
  email: z.string().email(),
  addressTo: z.string(),
});

type BillingAndPaymentInfoProps = {
  readonly token: string;
  readonly paymentMethods: PaymentMethod[];
};

const BillingAndPaymentInfo = ({
  token,
  paymentMethods,
}: BillingAndPaymentInfoProps) => {
  const id = useId();
  const getId = (code: string) => {
    return `${code}-${id}`;
  };

  const cartQuery = useSuspenseCart(token);
  const creditCartsQuery = useSuspenseCreditCards(token);

  const availablePaymentMethodIds =
    cartQuery.data.configuration.avail_payment_options.split(",");
  const mappedPaymentMethods = paymentMethods.filter((paymentMethod) =>
    availablePaymentMethodIds.includes(paymentMethod.code),
  );

  const showCreditCards = !!mappedPaymentMethods.find(
    (paymentMethod) => paymentMethod.isCreditCard,
  );
  const otherPaymentMethods = mappedPaymentMethods.filter(
    (paymentMethod) => !paymentMethod.isCreditCard,
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      email: cartQuery.data.mappedConfiguration.orderEmail ?? "",
      addressTo: cartQuery.data.mappedConfiguration.overriddenEmail ?? "",
    },
  });

  const updateCartConfigMutation = useUpdateCartConfigMutation();

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateCartConfigMutation.mutate({
      orderEmail: values.email,
      attnName: values.addressTo,
    });
  };

  const deleteCreditCardMutation = useDeleteCreditCardMutation();

  const [paymentId, setPaymentId] = useState(() =>
    getPaymentId(
      {
        paymentToken: cartQuery.data.configuration.paymentToken,
        paymentMethod: cartQuery.data.configuration.paymentMethod,
      },
      { creditCards: creditCartsQuery.data, paymentMethods },
    ),
  );

  const selectPayment = (id: string) => {
    setPaymentId(id);

    // If a credit card is selected
    const selectedCreditCard = creditCartsQuery.data.find(
      (card) => card.id.toString() === id,
    );
    if (selectedCreditCard) {
      return updateCartConfigMutation.mutate({
        cardName: selectedCreditCard.name,
        cardType: selectedCreditCard.type,
        expireDate: selectedCreditCard.expiryDate,
        paymentMethod: paymentMethods.find(
          (paymentMethod) => paymentMethod.isCreditCard,
        )?.code,
        paymentToken: selectedCreditCard.number,
      });
    }

    // If a normal payment method is selected
    const selectedPaymentMethod = paymentMethods.find(
      (paymentMethod) => paymentMethod.code === id,
    );
    if (selectedPaymentMethod) {
      return updateCartConfigMutation.mutate({
        cardName: "",
        cardType: "",
        expireDate: "",
        paymentMethod: selectedPaymentMethod.code,
        paymentToken: "0000",
      });
    }
  };

  return (
    <section className="flex flex-col gap-5 rounded-lg border border-wurth-gray-250 p-5 shadow-lg md:gap-6 md:p-6">
      <h2 className="font-title text-xl font-medium text-wurth-gray-800 md:text-2xl md:tracking-[-0.144px]">
        Payment Info
      </h2>
      <div className="flex flex-col gap-5 md:flex-row md:gap-6">
        <div className="flex-1 space-y-4">
          <h3 className="text-sm font-semibold text-black">Payment method</h3>
          <RadioGroup value={paymentId} onValueChange={selectPayment} asChild>
            <ul className="grid grid-cols-1 gap-5">
              {showCreditCards &&
                creditCartsQuery.data.map((card) => (
                  <li
                    key={card.id}
                    className="relative flex min-h-[4.75rem] flex-row items-center gap-3 rounded-lg border-2 border-wurth-gray-150 p-4"
                  >
                    <RadioGroupItem
                      value={card.id.toString()}
                      id={getId(card.id.toString())}
                      disabled={isExpiredCreditCard(card.expiryDate)}
                    />

                    <Label
                      htmlFor={getId(card.id.toString())}
                      className="flex flex-row items-center gap-3"
                    >
                      {card.type === "MC" && (
                        <Mastercard width={44} height={70} />
                      )}
                      {card.type === "VISA" && <Visa width={44} height={44} />}

                      <span className="flex flex-col">
                        <span className="text-base text-wurth-gray-800">
                          &#x2022;&#x2022;&#x2022;&#x2022;
                          &#x2022;&#x2022;&#x2022;&#x2022;
                          &#x2022;&#x2022;&#x2022;&#x2022;{" "}
                          {card.number.substring(card.number.length - 4)}
                        </span>

                        <span className="text-sm text-wurth-gray-500">
                          {isExpiredCreditCard(card.expiryDate) ? (
                            <span className="text-wurth-red-650">
                              Expired {card.expiryDate}
                            </span>
                          ) : (
                            <span>Expires {card.expiryDate}</span>
                          )}
                        </span>
                      </span>
                    </Label>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-3 top-3 size-4 p-0"
                      onClick={() => deleteCreditCardMutation.mutate(card.id)}
                    >
                      <Close width={16} height={16} />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </li>
                ))}

              {otherPaymentMethods.map((paymentMethod) => (
                <li
                  key={paymentMethod.code}
                  className="flex min-h-[4.75rem] flex-row items-center gap-3 rounded-lg border-2 border-wurth-gray-150 p-4"
                >
                  <RadioGroupItem
                    value={paymentMethod.code}
                    id={getId(paymentMethod.code)}
                  />

                  <Label
                    htmlFor={getId(paymentMethod.code)}
                    className="text-base font-normal text-wurth-gray-800"
                  >
                    {paymentMethod.name}
                  </Label>
                </li>
              ))}
            </ul>
          </RadioGroup>
          <AddCreditCardDialog
            token={token}
            paymentMethods={paymentMethods}
            onCreatedNewCreditCard={setPaymentId}
          />
        </div>
        <div className="flex-1 space-y-4">
          <h3 className="text-sm font-semibold text-black">
            Order Confirmation
          </h3>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email to:</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Email"
                        type="email"
                        {...field}
                        onBlur={form.handleSubmit(onSubmit)}
                      />
                    </FormControl>
                    <FormDescription className="sr-only">
                      The email to send the order confirmation.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="addressTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address to:</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Name"
                        type="text"
                        {...field}
                        onBlur={form.handleSubmit(onSubmit)}
                      />
                    </FormControl>
                    <FormDescription className="sr-only">
                      The name of the confirmation recipient.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      </div>

      <OrderConfirmDialog
        token={token}
        otherPaymentMethods={otherPaymentMethods}
      />
    </section>
  );
};

export default BillingAndPaymentInfo;
