import { ISortOption, IFilterOption } from '../components/SortAndFilter';

// Common sort options that can be used across different screens
export const COMMON_SORT_OPTIONS: ISortOption[] = [
  {
    id: 'date-newest',
    label: 'Date (Newest First)',
    value: 'date-desc'
  },
  {
    id: 'date-oldest',
    label: 'Date (Oldest First)',
    value: 'date-asc'
  },
  {
    id: 'id-asc',
    label: 'ID (Ascending)',
    value: 'id-asc'
  },
  {
    id: 'id-desc',
    label: 'ID (Descending)',
    value: 'id-desc'
  },
  {
    id: 'name-asc',
    label: 'Name (A-Z)',
    value: 'name-asc'
  },
  {
    id: 'name-desc',
    label: 'Name (Z-A)',
    value: 'name-desc'
  }
];

// Common filter options
export const COMMON_FILTER_OPTIONS: IFilterOption[] = [
  {
    id: 'status-pending',
    label: 'Status: Pending',
    value: 'pending',
    type: 'status'
  },
  {
    id: 'status-in-progress',
    label: 'Status: In Progress',
    value: 'in-progress',
    type: 'status'
  },
  {
    id: 'status-completed',
    label: 'Status: Completed',
    value: 'completed',
    type: 'status'
  },
  {
    id: 'status-cancelled',
    label: 'Status: Cancelled',
    value: 'cancelled',
    type: 'status'
  }
];

// Load to Dock specific sort options - LastUpdateDate, DeliveryDate, ShipDate, and Items Count
export const LOAD_TO_DOCK_SORT_OPTIONS: ISortOption[] = [
  {
    id: 'last-update-date-newest',
    label: 'Last Update Date (Newest First)',
    value: 'last-update-date-desc'
  },
  {
    id: 'last-update-date-oldest',
    label: 'Last Update Date (Oldest First)',
    value: 'last-update-date-asc'
  },
  {
    id: 'delivery-date-newest',
    label: 'Delivery Date (Newest First)',
    value: 'delivery-date-desc'
  },
  {
    id: 'delivery-date-oldest',
    label: 'Delivery Date (Oldest First)',
    value: 'delivery-date-asc'
  },
  {
    id: 'ship-date-newest',
    label: 'Ship Date (Newest First)',
    value: 'ship-date-desc'
  },
  {
    id: 'ship-date-oldest',
    label: 'Ship Date (Oldest First)',
    value: 'ship-date-asc'
  },
  {
    id: 'items-count-asc',
    label: 'Items Count (Low to High)',
    value: 'items-count-asc'
  },
  {
    id: 'items-count-desc',
    label: 'Items Count (High to Low)',
    value: 'items-count-desc'
  }
];

// Load to Dock specific filter options - Empty array (no filters for Load to Dock)
export const LOAD_TO_DOCK_FILTER_OPTIONS: IFilterOption[] = [];

// Helper function to get sort options based on screen type
export const getSortOptions = (screenType: 'load-to-dock' | 'common' = 'common'): ISortOption[] => {
  switch (screenType) {
    case 'load-to-dock':
      return LOAD_TO_DOCK_SORT_OPTIONS;
    default:
      return COMMON_SORT_OPTIONS;
  }
};

// Helper function to get filter options based on screen type
export const getFilterOptions = (screenType: 'load-to-dock' | 'common' = 'common'): IFilterOption[] => {
  switch (screenType) {
    case 'load-to-dock':
      return LOAD_TO_DOCK_FILTER_OPTIONS;
    default:
      return COMMON_FILTER_OPTIONS;
  }
};
