export type Attributes = {
  attribute_name: string;
  attribute_value: string | null;
};

export type OldPagination = {
  db_count: string;
  offset: number;
  perPage: number;
};

export type ItemInfo = {
  productId: number;
  isExcludedProduct: boolean;
  productSku: string;
  productName: string;
  image: string;
  isComparison: boolean;
  isHazardous: boolean;
  specialShipping: boolean;
  productIdOnSap: string;
  mfrPartNo: string;
  productDescription: string;
  productTitle: string;
  brandCode: number;
  unitOfMeasure: string;
  boxQuantity: number;
  minimumOrderQuantity: number;
  quantityByIncrements: number;
  weight: number;
  prop65MessageOne: string;
  prop65MessageTwo: string;
  prop65MessageThree: string;
  listPrice: number;
  isSaleItem: boolean;
  fClassId: number;
  class: string;
  attributes: Attributes[];
  productStatus: string;
  isDirectlyShippedFromVendor: boolean;
  productSummary: string;
  brand: string;
  productCategory: string;
};

export type OldPurchasedProduct = {
  product: string;
  id: string;
  isFavourite: boolean;
  orderDate: string;
  sku: string;
  totalItem: string;
};

export type OldPurchasedItems = {
  products: OldPurchasedProduct[];
  pagination: [OldPagination];
};

// Shared types for new design
export type Filter = {
  id: string;
  title: string;
  values: {
    id: string;
    value: string;
    active: boolean;
  }[];
};

export type FilterTitle = "PO #" | "Job Name" | "Status" | "Transaction Type";

export type PurchasedProduct = {
  productTitle: string;
  productSku: string;
  productId: number;
  totalItem: number;
  purchaseOrderDate: string;
  isFavorite: boolean;
};

export type Pagination = {
  totalCount: number;
  offset: number;
  perPage: number;
};

export type PurchasedItems = {
  products: PurchasedProduct[];
  pagination: Pagination;
};

export type PriceBreakDownObject = {
  qty_1: number;
  price_1: number;
};

export type PriceBreakDowns = PriceBreakDownObject[];

export type PasswordPolicies = {
  minimumLength: number;
  minimumNumbers: number;
  minimumAlphabets: number;
};

export type CartItemConfiguration = {
  avail_1: string;
  avail_2: string;
  avail_3: string;
  avail_4: string;
  avail_5: string;
  plant_1: string;
  plant_2: string;
  plant_3: string;
  plant_4: string;
  plant_5: string;
  poOrJobName?: string;
  shipping_method_1: string;
  shipping_method_2: string;
  shipping_method_3: string;
  shipping_method_4: string;
  shipping_method_5: string;
  will_call_avail: string;
  will_call_plant: string;
  hashvalue: string;
  selectedOption: string;
  backorder_all: string;
};

export type CartConfiguration = {
  po_job: null;
  jobName: string | null;
  coupon: string | null;
  po: string | null;
  sold_to: null;
  ship_to: null;
  user_email: null;
  is_overridden: null;
  overridden_email: null;
  osr: null;
  "first-name": null;
  delivering_plant: null;
  avail_payment_options: string;
  attnName: null;
  pickDate: null;
  driverNote: null;
  orderEmail: null;
  completeDelivery: null;
  paymentToken: null;
  cardName: null;
  cardType: null;
  expireDate: null;
  paymentMethod: null;
  isAPrimaryShippingAddress?: null;
  shippingAddressId: null;
};

export type GroupList = {
  groupid: string;
  type: string;
  item_group_name: string;
  slug: string;
  brandName: string;
  brandid: string;
  group_img: string;
  compliance_flags: string;
  fclassid: null;
  txt_meta_title?: string;
  itemSkuList: {
    productid: string;
    is_product_exclude: boolean;
    txt_wurth_lac_item: string;
    item_name: string;
    img: string;
    slug: string;
    is_favourite: null;
    is_comparison: null;
    "SKU-attribute": string;
    txt_hazardous: string;
    txt_sap: string;
    txt_mfn: string;
    txt_description_name: string;
    txt_sub_description: string;
    sel_assigned_brand: string;

    txt_uom_label: string;

    txt_box_qt: string;
    txt_min_order_amount: string;
    txt_order_qty_increments: string;
    txt_weight_value: string;
    txt_prop65_message_01: string;
    txt_prop65_message_02: null;
    txt_prop65_message_03: null;

    list_price: string;
    on_sale: string;
    is_directly_shipped_from_vendor: boolean;
  }[];
  variationsCount: number;
};

export type Status = "ACTIVE" | "SUSPENDED";

export type ShippingMethod = {
  code: string;
  name: string;
};

export type PaymentMethod = {
  code: string;
  name: string;
  isCreditCard: boolean;
};

export type Plant = {
  code: string;
  name: string;
};

export type Filters = {
  id: string;
  filter: string;
  values: {
    id: number;
    value: string;
    icon: string | null;
    tooltip: string | null;
    active: boolean;
  }[];
};
