export const operationalMockEngine = {
  booking: {
    label: "Generate Booking",
    scenarios: {
      success: {
        status: "success",
        reference: "BK-2026-8891",
        carrier: "Maersk",
        etd: "2026-02-12 18:00",
        processingTime: "0.4 day",
        message: "Carrier booking confirmed.",
      },
      hold: {
        status: "warning",
        reference: "BK-2026-8891",
        carrier: "Maersk",
        message:
          "Booking created in HOLD state due to missing container weight validation.",
      },
    },
  },

  tms: {
    scenarios: {
      success: {
        status: "success",
        syncTime: "180ms",
        message: "Shipment pushed to TMS successfully.",
      },
      delayed: {
        status: "warning",
        syncTime: "890ms",
        message: "TMS sync delayed. Auto retry scheduled.",
      },
    },
  },

  warehouse: {
    scenarios: {
      success: {
        status: "success",
        jobId: "WMS-4451",
        tasksGenerated: 3,
        workloadImpact: "+3 tasks",
        message: "WMS picking tasks generated.",
      },
    },
  },

  customs: {
    scenarios: {
      success: {
        status: "success",
        declarationNo: "VN-EXP-2026-221",
        validationScore: 92,
        message: "Draft declaration created.",
      },
      error: {
        status: "error",
        missingField: "HS Code",
        message: "Customs blocked: Missing HS Code.",
      },
    },
  },

  freight: {
    scenarios: {
      analysis: {
        status: "analysis",
        bestCarrier: "Maersk",
        rate: 1420,
        savingsPercent: 6.3,
        altCarrier: "CMA CGM",
        message: "Rate comparison completed.",
      },
    },
  },

  demdet: {
    scenarios: {
      analysis: {
        status: "analysis",
        riskLevel: "Medium",
        exposure: 2400,
        freeDaysLeft: 2,
        recommendation: "Expedite gate-out within 48h.",
        message: "DEM/DET simulation completed.",
      },
    },
  },
};
