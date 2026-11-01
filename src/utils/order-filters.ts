export interface OrderFilters {
  status?: string;
  courier?: string;
  startDate?: string | Date;
  endDate?: string | Date;
}

export function buildOrderFilter(filters: OrderFilters = {}): Record<string, any> {
  const filter: Record<string, any> = {};

  if (filters.status) {
    filter.status = filters.status;
  }

  if (filters.courier) {
    filter.courier = filters.courier;
  }

  const createdAt: Record<string, Date> = {};
  if (filters.startDate) {
    const d = new Date(filters.startDate);
    if (!isNaN(d.getTime())) {
      createdAt.$gte = d;
    }
  }
  if (filters.endDate) {
    const d = new Date(filters.endDate);
    if (!isNaN(d.getTime())) {
      createdAt.$lte = d;
    }
  }
  if (createdAt.$gte || createdAt.$lte) {
    filter.createdAt = createdAt;
  }

  return filter;
}
