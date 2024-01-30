import { api } from "@/_lib/api";
import { useSuspenseQuery } from "@tanstack/react-query";

const useSuspenseProductList = (
  catId: string,
  { page, pageSize, sort }: { page: string; pageSize: string; sort: string },
) => {
  return useSuspenseQuery({
    queryKey: [
      "category",
      catId,
      "products",
      {
        page,
        pageSize,
        sort,
      },
    ],
    queryFn: () =>
      api
        .get(`pim/webservice/rest/productlandinggrouplist/${catId}`, {
          searchParams: new URLSearchParams({
            page,
            perpage: pageSize,
          }),
        })
        .json<{
          group_list: {
            groupId: number;
            item_group_name: string;
            slug: string;
            brandName: string;
            group_img: string;
            itemSkuList: {
              is_product_exclude: boolean;
              txt_wurth_lac_item: string;
              item_name: string;
              img: string;
              is_favourite: null;
              "SKU-attribute": string;
            }[];
            variationsCount: number;
          }[];
          pagination: [
            {
              db_count: number;
              offset: number;
              perPage: string;
            },
          ];
        }>(),
  });
};

export default useSuspenseProductList;
