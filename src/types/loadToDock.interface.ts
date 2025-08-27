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
  itemId: string;
  itemSku: string;
  itemDescription: string;
  requestedQuantity: number;
  loadedQuantity: number;
  unit: string;
  hasPhotos: boolean;
  hasVideo: boolean;
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
