// Mock Order Database for Customer Support Scenarios
export const mockOrders = [
  {
    orderId: "ORD-9482",
    customerName: "Sarah Jenkins",
    customerEmail: "sarah.j@example.com",
    orderDate: "2026-09-24",
    status: "Shipped",
    carrier: "FedEx Express",
    trackingNumber: "FDX-8829104921",
    estimatedDelivery: "2026-09-29 (Tomorrow by 7:00 PM)",
    shippingAddress: "742 Evergreen Terrace, Springfield, OR 97477",
    items: [
      { id: "ITEM-101", name: "AuraWave Noise-Canceling Headphones", price: 179.99, qty: 1 }
    ],
    total: 179.99,
    eligibleForReturn: true,
    lastUpdate: "Departed sorting facility in Portland, OR at 3:15 PM"
  },
  {
    orderId: "ORD-8219",
    customerName: "Alex Rivera",
    customerEmail: "alex.r@example.com",
    orderDate: "2026-09-27",
    status: "Processing",
    carrier: "UPS Ground",
    trackingNumber: "Pending label creation",
    estimatedDelivery: "2026-10-02",
    shippingAddress: "124 Conch Street, Bikini Bottom, WA 98101",
    items: [
      { id: "ITEM-204", name: "ErgoFlow Mechanical Keyboard (Cherry MX Brown)", price: 129.50, qty: 1 },
      { id: "ITEM-205", name: "Memory Foam Wrist Rest", price: 24.00, qty: 1 }
    ],
    total: 153.50,
    eligibleForReturn: true,
    lastUpdate: "Order received and queued in packaging warehouse"
  },
  {
    orderId: "ORD-7104",
    customerName: "Michael Chang",
    customerEmail: "m.chang@example.com",
    orderDate: "2026-09-12",
    status: "Delivered",
    carrier: "USPS Priority",
    trackingNumber: "USPS-9400111899223344",
    deliveredDate: "2026-09-16",
    shippingAddress: "456 Elm Street, Austin, TX 78701",
    items: [
      { id: "ITEM-301", name: "UltraView 27-inch 4K Monitor", price: 349.00, qty: 1 }
    ],
    total: 349.00,
    eligibleForReturn: true,
    lastUpdate: "Left at front door / porch - signed by resident"
  },
  {
    orderId: "ORD-6550",
    customerName: "Emily Watson",
    customerEmail: "emily.w@example.com",
    orderDate: "2026-08-10",
    status: "Delivered",
    carrier: "DHL Express",
    trackingNumber: "DHL-4491029381",
    deliveredDate: "2026-08-14",
    shippingAddress: "88 Market St, San Francisco, CA 94105",
    items: [
      { id: "ITEM-405", name: "ProGlide Ergonomic Wireless Mouse", price: 69.99, qty: 1 }
    ],
    total: 69.99,
    eligibleForReturn: false, // > 30 days
    lastUpdate: "Delivered to mailroom reception"
  }
];

export function findOrder(query) {
  if (!query) return null;
  const clean = query.trim().toUpperCase();
  
  // Check exact or partial order ID match (e.g., "9482" or "ORD-9482")
  return mockOrders.find(o => 
    clean.includes(o.orderId) || 
    clean.includes(o.orderId.replace("ORD-", "")) ||
    o.orderId.includes(clean)
  ) || null;
}
