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

// Load to Dock specific sort options
export const LOAD_TO_DOCK_SORT_OPTIONS: ISortOption[] = [
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
    id: 'delivery-id-asc',
    label: 'Delivery ID (Ascending)',
    value: 'delivery-id-asc'
  },
  {
    id: 'delivery-id-desc',
    label: 'Delivery ID (Descending)',
    value: 'delivery-id-desc'
  },
  {
    id: 'customer-name-asc',
    label: 'Customer Name (A-Z)',
    value: 'customer-name-asc'
  },
  {
    id: 'customer-name-desc',
    label: 'Customer Name (Z-A)',
    value: 'customer-name-desc'
  },
  {
    id: 'dock-asc',
    label: 'Dock (A-Z)',
    value: 'dock-asc'
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

// Load to Dock specific filter options
export const LOAD_TO_DOCK_FILTER_OPTIONS: IFilterOption[] = [
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
    id: 'dock-specific',
    label: 'Dock: DOCK-01',
    value: 'dock-01',
    type: 'text'
  },
  {
    id: 'dock-specific-2',
    label: 'Dock: DOCK-02',
    value: 'dock-02',
    type: 'text'
  },
  {
    id: 'customer-specific',
    label: 'Customer: A. C. Networks',
    value: 'ac-networks',
    type: 'text'
  },
  {
    id: 'date-range-today',
    label: 'Date: Today',
    value: 'today',
    type: 'date'
  },
  {
    id: 'date-range-week',
    label: 'Date: This Week',
    value: 'this-week',
    type: 'date'
  },
  {
    id: 'date-range-month',
    label: 'Date: This Month',
    value: 'this-month',
    type: 'date'
  },
  {
    id: 'has-items',
    label: 'Has Items',
    value: 'has-items',
    type: 'boolean'
  },
  {
    id: 'no-items',
    label: 'No Items',
    value: 'no-items',
    type: 'boolean'
  }
];

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
