import {
  ProductsGrid,
  ProductsGridDesktopContainer,
  ProductsGridFiltersSkeleton,
  ProductsGridHeaderSkeleton,
  ProductsGridListSkeleton,
  ProductsGridMobileFiltersHeaderSkeleton,
  ProductsGridPaginationSkeleton,
} from "@/_components/products-grid";
import usePathnameHistoryState from "@/_hooks/misc/use-pathname-history-state.hook";
import { getBreadcrumbs } from "@/_lib/apis/server";
import { getGTMPageType } from "@/_lib/gtm-utils";
import { cn } from "@/_lib/utils";
import { sendGTMEvent } from "@next/third-parties/google";
import { ChevronLeft } from "@repo/web-ui/components/icons/chevron-left";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@repo/web-ui/components/ui/breadcrumb";
import { Button } from "@repo/web-ui/components/ui/button";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Fragment, Suspense } from "react";
import ProductsList from "./_products-list";
import { getCategory } from "./apis";
import SubCategoriesList from "./sub-categories-list";
import type { CategoryPageProps, SubCategory } from "./types";

export const generateMetadata = async ({
  params: { id, slug },
}: CategoryPageProps): Promise<Metadata> => {
  const category = await getCategory(id, slug);

  return {
    title: category.title,
    description: category.description,
  };
};

const CategoryPage = async ({ params: { id, slug } }: CategoryPageProps) => {
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

  const category = await getCategory(id, slug);
  const breadcrumbs = await getBreadcrumbs(id, "category");

  const subCategories = category.subCategories.map(
    (subCategory) =>
      ({
        id: subCategory.id,
        slug: subCategory.slug,
        title: subCategory.title,
        image: subCategory.image,
      }) satisfies SubCategory,
  );

  return (
    <>
      <div className="container my-2 md:hidden">
        <Button variant="link" asChild className="group gap-1 px-0">
          <Link href="/">
            <ChevronLeft
              width={16}
              height={16}
              className="group-hover:stroke-red-800"
            />
            Home
          </Link>
        </Button>
      </div>

      <Breadcrumb className="container my-3 hidden md:block">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/" className="bread-crumb">
                Home
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          {breadcrumbs.map((breadcrumb, index) => (
            <Fragment key={breadcrumb.id}>
              <BreadcrumbSeparator />

              <BreadcrumbItem>
                {index < breadcrumbs.length - 1 ? (
                  <BreadcrumbLink asChild>
                    <Link
                      className={cn(
                        index === 0 ? "root-category" : "btn-nav",
                        "bread-crumb",
                      )}
                      href={`/category/${breadcrumb.id}/${breadcrumb.slug}`}
                    >
                      {breadcrumb.categoryName}
                    </Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{breadcrumb.categoryName}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      <section className="container md:my-10">
        <div className="grid overflow-hidden rounded-lg border border-wurth-gray-250 bg-white shadow-lg md:min-h-[21rem] md:grid-cols-2">
          <div className="relative aspect-2 md:hidden">
            {!!category.image && (
              <Image
                src={category.image}
                alt={category.title}
                className="object-contain"
                priority
                fill
              />
            )}
          </div>

          <div className="flex flex-col justify-center space-y-3 p-6 md:min-h-[21rem] md:flex-1 md:space-y-5 md:p-10">
            <h1 className="line-clamp-3 text-balance font-title text-4xl font-medium tracking-tight text-wurth-gray-800 md:text-5xl md:leading-[3.5rem] md:tracking-[-0.036rem]">
              {category.title}
            </h1>

            {!!category.description && (
              <div
                className="text-base text-wurth-gray-800 md:text-lg"
                dangerouslySetInnerHTML={{ __html: category.description }}
              />
            )}
          </div>

          <div className="relative hidden md:block md:min-h-[21rem] md:w-full">
            {!!category.image && (
              <Image
                src={category.image}
                alt={category.title}
                className="object-contain"
                priority
                fill
              />
            )}
          </div>
        </div>
      </section>

      <SubCategoriesList categories={subCategories} />

      <Suspense
        fallback={
          <ProductsGrid>
            <ProductsGridMobileFiltersHeaderSkeleton />

            <ProductsGridHeaderSkeleton />

            <ProductsGridListSkeleton type="mobile" />

            <ProductsGridDesktopContainer>
              <ProductsGridFiltersSkeleton />

              <ProductsGridListSkeleton type="desktop" />
            </ProductsGridDesktopContainer>

            <ProductsGridPaginationSkeleton />
          </ProductsGrid>
        }
      >
        <ProductsList categoryId={id} />
      </Suspense>
    </>
  );
};

export default CategoryPage;
