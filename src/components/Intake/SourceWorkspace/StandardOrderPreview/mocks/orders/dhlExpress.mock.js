export const dhlExpressOrder = {
  orderId: "DHL-VN-SGN-2025-000781",
  awbNumber: "176-89451234",
  carrier: "DHL EXPRESS",
  serviceLevel: "EXPRESS_WORLDWIDE",

  incoterm: "DDP",
  hsCode: "85171200",
  customsClearance: "PENDING",

  originCountry: "DE",
  destinationCountry: "VN",

  arrivalDate: new Date(Date.now() - 4 * 86400000).toISOString(),
  expectedDelivery: new Date(Date.now() - 6 * 3600000).toISOString(),
  lastStatusChange: new Date(Date.now() - 30 * 3600000).toISOString(),

  currentStatus: "WAREHOUSE_HOLD",

  freeTimeDays: 3,
  dailyRate: 85,

  orderValue: 12500,

  milestones: [
    {
      status: "PICKED_UP",
      location: "Frankfurt, DE",
      timestamp: new Date(Date.now() - 6 * 86400000).toISOString(),
    },
    {
      status: "ARRIVED_DESTINATION",
      location: "SGN Airport",
      timestamp: new Date(Date.now() - 4 * 86400000).toISOString(),
    },
  ],

  cargoCondition: {
    temperature: { current: 7.8, min: 5, max: 9, unit: "°C" },
    humidity: { current: 63, threshold: 70, unit: "%" },
  },
};
