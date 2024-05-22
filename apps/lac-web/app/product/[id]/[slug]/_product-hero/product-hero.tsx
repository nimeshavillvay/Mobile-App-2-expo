import { SESSION_TOKEN_COOKIE } from "@/_lib/constants";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from "@repo/web-ui/components/ui/carousel";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import Balancer from "react-wrap-balancer";
import "server-only";
import { getProduct } from "../apis";
import ProductPrices from "./_product-prices";
import ProductVariants from "./_product-variants";
import SaleBadges from "./_sale-badges";
import AddToCart from "./add-to-cart";
import AddToCartFormProvider from "./add-to-cart-form-provider";
import ProductDesktopCarousel from "./product-desktop-carousel";
import {
  DropShipItemNotice,
  ProductDescription,
  ProductDetails,
  ProductNumbers,
  ProductSpecifications,
} from "./product-hero-sections";

type ProductHeroProps = {
  id: string;
  slug: string;
};

const ProductHero = async ({ id, slug }: ProductHeroProps) => {
  const cookiesStore = cookies();
  const sessionToken = cookiesStore.get(SESSION_TOKEN_COOKIE);

  const product = await getProduct(id, slug, sessionToken?.value);

  const images = product.selectedProduct.detailedImages
    ? product.selectedProduct.detailedImages.map((image) => ({
        src: image.img,
        alt: image.alt,
      }))
    : [
        {
          src: product.selectedProduct.image,
          alt: product.selectedProduct.productName,
        },
      ];

  return (
    <AddToCartFormProvider
      minQuantity={product.selectedProduct.minimumOrderQuantity}
    >
      <div className="container my-2 flex flex-row items-center gap-2 md:my-1">
        <Link
          href={`/search?query=${product.brand}`}
          className="text-sm font-normal text-black hover:underline"
        >
          Shop <span className="font-semibold">{product.brand}</span>
        </Link>

        <SaleBadges
          productId={parseInt(id)}
          listPrice={product.selectedProduct.listPrice}
        />
      </div>

      <h1 className="container my-2 font-title text-2xl font-medium tracking-[-0.009rem] text-wurth-gray-800 md:mb-7 md:mt-1 md:tracking-[-0.144px]">
        <Balancer>{product.selectedProduct.productName}</Balancer>
      </h1>

      {/* Desktop view */}
      <div className="hidden md:container md:grid md:grid-cols-[minmax(0,3fr)_minmax(26rem,2fr)] md:gap-x-8 md:gap-y-[3.75rem]">
        <ProductDesktopCarousel images={images} />

        <div className="space-y-6">
          <div className="space-y-2">
            <ProductNumbers
              sku={product.selectedProduct.productSku}
              manufacturerNo={product.selectedProduct.mfrPartNo}
            />

            <ProductDescription>
              {product.selectedProduct.productDescription}
            </ProductDescription>
          </div>

          <ProductPrices
            productId={parseInt(id)}
            listPrice={product.selectedProduct.listPrice}
            uom={product.selectedProduct.unitOfMeasure}
          />

          <ProductVariants id={id} />

          <AddToCart
            productId={parseInt(id)}
            minQty={product.selectedProduct.minimumOrderQuantity}
            incQty={product.selectedProduct.quantityByIncrements}
            isFavourite={product.selectedProduct.isFavourite}
            favoriteIds={product.selectedProduct.favoriteIds}
            uom={product.selectedProduct.unitOfMeasure}
          />

          {product.selectedProduct.isDirectlyShippedFromVendor && (
            <DropShipItemNotice />
          )}
        </div>

        <ProductDetails id={id} slug={slug} />

        {!!product.selectedProduct.attributes && (
          <ProductSpecifications
            attributes={product.selectedProduct.attributes.map((attribute) => ({
              name: attribute.name,
              value: attribute.value,
            }))}
          />
        )}
      </div>

      {/* Mobile view */}
      <>
        <ProductNumbers
          sku={product.selectedProduct.productSku}
          manufacturerNo={product.selectedProduct.mfrPartNo}
          className="container my-2 md:hidden"
        />

        <ProductDescription className="container my-2 md:hidden">
          {product.selectedProduct.productDescription}
        </ProductDescription>

        <Carousel className="mb-10 mt-5 md:hidden">
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={image.src}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={770}
                  height={770}
                  className="aspect-1 object-contain"
                  priority={index === 0}
                />
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselDots className="mt-1" />
        </Carousel>

        <ProductPrices
          productId={parseInt(id)}
          listPrice={product.selectedProduct.listPrice}
          uom={product.selectedProduct.unitOfMeasure}
          className="container my-6 md:hidden"
        />

        <ProductVariants id={id} className="container my-6 md:hidden" />

        <AddToCart
          productId={parseInt(id)}
          minQty={product.selectedProduct.minimumOrderQuantity}
          incQty={product.selectedProduct.quantityByIncrements}
          uom={product.selectedProduct.unitOfMeasure}
          className="container my-6 md:hidden"
          isFavourite={product.selectedProduct.isFavourite}
          favoriteIds={product.selectedProduct.favoriteIds}
        />

        {product.selectedProduct.isDirectlyShippedFromVendor && (
          <DropShipItemNotice className="container my-6 md:hidden" />
        )}

        <ProductDetails
          id={id}
          slug={slug}
          className="container my-10 md:hidden"
        />

        {!!product.selectedProduct.attributes && (
          <ProductSpecifications
            attributes={product.selectedProduct.attributes.map((attribute) => ({
              name: attribute.name,
              value: attribute.value,
            }))}
            className="container my-10 md:hidden"
          />
        )}
      </>
    </AddToCartFormProvider>
  );
};

export default ProductHero;
