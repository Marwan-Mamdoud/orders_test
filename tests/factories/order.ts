export interface OrderPayloadInput {
  status?: string;
  courier?: string;
  products?: Array<{ name: string; quantity: number; price: number }>;
}

export function buildOrderPayload(input: OrderPayloadInput = {}): OrderPayloadInput {
  return {
    ...(input.status !== undefined && { status: input.status }),
    ...(input.courier !== undefined && { courier: input.courier }),
    ...(input.products !== undefined && { products: input.products }),
  };
}


