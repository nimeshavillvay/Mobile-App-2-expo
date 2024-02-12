"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/_components/ui/form";
import { Input } from "@/_components/ui/input";
import VisuallyHidden from "@/_components/visually-hidden";
import useCart from "@/_hooks/cart/use-cart.hook";
import useUpdateCartConfigMutation from "@/_hooks/cart/use-update-cart-config-mutation.hook";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  po: z.string().min(1, "Required"),
  jobName: z.string().min(1, "Required"),
});
type FormSchema = z.infer<typeof formSchema>;

const ShoppingCartList = () => {
  const cartQuery = useCart();
  const updateCartMutation = useUpdateCartConfigMutation();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    values: {
      po: cartQuery?.data?.configuration.po ?? "",
      jobName: cartQuery?.data?.configuration.jobName ?? "",
    },
  });

  const onSubmit = (values: FormSchema) => {
    updateCartMutation.mutate({ configuration: values, step: "cart_meta" });
  };

  if (cartQuery.isLoading) {
    return <div>Loading cart...</div>;
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-row items-center justify-between gap-[30px]"
        >
          <FormField
            control={form.control}
            name="po"
            render={({ field }) => (
              <FormItem className="w-full flex-1">
                <FormLabel>
                  PO# <span className="text-brand-primary">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your PO#"
                    disabled={updateCartMutation.isPending}
                    {...field}
                  />
                </FormControl>

                <VisuallyHidden>
                  <FormDescription>
                    This is the PO number for the order
                  </FormDescription>
                </VisuallyHidden>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="jobName"
            render={({ field }) => (
              <FormItem className="w-full flex-1">
                <FormLabel>
                  Job Name <span className="text-brand-primary">*</span>
                </FormLabel>

                <FormControl>
                  <Input
                    placeholder="Your job name"
                    disabled={updateCartMutation.isPending}
                    {...field}
                  />
                </FormControl>

                <VisuallyHidden>
                  <FormDescription>
                    This is the job name for the order
                  </FormDescription>
                </VisuallyHidden>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex-1">Change Shipping Method</div>

          <div className="flex-1">Home Branch</div>
        </form>
      </Form>
    </div>
  );
};

export default ShoppingCartList;
