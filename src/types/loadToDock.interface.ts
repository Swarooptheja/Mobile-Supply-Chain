export interface ILoadToDockItem {
  deliveryId: string;
  salesOrderNumber: string;
  customerName: string;
  tripNumber: string;
  date: string;
  dock: string;
  itemCount: number;
  status: 'pending' | 'in-progress' | 'completed';
}

export interface ILoadToDockItemDetail {
  DeliveryLineId: string;
  DeliveryId: string;
  PackFlag: string;
  UserLocation: string;
  HoldFlag: string;
  ShipFromCompanyName: string;
  ShipFromPhoneNum: string;
  ShipFromContactDetails: string;
  ShipToContactName: string;
  ShipToCompanyName: string;
  ShipToPhoneNum: string;
  ShipToEmail: string;
  FromAddress1: string;
  FromAddress2: string;
  FromAddress3: string;
  FromTownOrCity: string;
  FromState: string;
  FromZip: string;
  FromCountry: string;
  ToAddress1: string;
  ToAddress2: string;
  ToAddress3: string;
  ToCity: string;
  ToState: string;
  ToZip: string;
  ToCountry: string;
  ToteCage: string;
  Lane: string;
  DemandType: string;
  CustomerName: string;
  OrderType: string;
  SalesOrderNum: string;
  SalesOrderLineNum: string;
  SOHeaderId: string;
  SOLineId: string;
  ItemId: string;
  ItemNumber: string;
  ItemDesc: string;
  QtyRequested: string;
  QtyPicked: string;
  QtyShipped: string;
  QtyReceived: string;
  QtyDelivered: string;
  QtyCancelled: string;
  QtyBackOrdered: string;
  ItemUom: string;
  SubinventoryCode: string;
  Locator: string;
  ShipFromLocation: string;
  ShipToLocation: string;
  TrackingNumber: string;
  PackedLpnNumber: string;
  Container: string;
  DeliveryDate: string;
  PartialAction: string;
  ShipDate: string;
  Attribute1: string;
  Attribute2: string;
  Attribute3: string;
  LastUpdateDate: string;
  Status: string;
  Flag: string;
  IsSerialControlled: string;
  SerialTypeCode: string;
  HAZDesc: string;
  LabelFileName: string;
  IsHazardControlled: string;
  CurrencyCode: string;
  Dimensions: string;
  GrossWeight: string;
  SyncStatus: string;
  PickSlipNumber: string;
  hasPhotos?: boolean;
  hasVideo?: boolean;
}

export interface ILoadToDockTransaction {
  mobileTransactionId: number;
  deliveryId: number;
  deliveryLineId: number;
  shipDate: string;
  quantity: number;
  partialAction: string;
  responsibilityId: string;
  userId: string;
  trackingNumber: string;
  freightCost: IFreightCost[];
  shipMethod: string;
  grossWeight: number;
}

export interface IFreightCost {
  freightCostTypeId: number;
  freightUnitAmount: string;
  freightCurrencyCode: string;
}

export interface ITransactionResponse {
  deliveryId: string;
  deliveryLineId: string;
  secondaryQty: string;
  returnStatus: string;
  returnMessage: string;
}

export interface ITransactionHistoryItem {
  id: string;
  deliveryId: string;
  deliveryLineId: string;
  itemDescription: string;
  quantity: number;
  status: 'pending' | 'success' | 'failed';
  timestamp: string;
  errorMessage?: string;
  retryCount: number;
}

export interface LoadToDockItemsScreenProps {
  route: {
    params: {
      deliveryItem: ILoadToDockItem;
    };
  };
  navigation: any;
}

export interface LoadToDockItemDetailsScreenProps {
  route: {
    params: {
      deliveryItem: ILoadToDockItem;
      itemDetail: ILoadToDockItemDetail;
    };
  };
  navigation: any;
}

export type TabType = string;
