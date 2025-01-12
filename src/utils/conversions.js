const convertToFixedUnits = (name, value, unit, expectedUnit) => {
  if (unit === expectedUnit) return value;

  // Conversion logic
  const conversions = {
    g_to_mg: (val) => val * 1000,
    mg_to_g: (val) => val / 1000,
    g_to_mcg: (val) => val * 1000000,
    mcg_to_g: (val) => val / 1000000,
    mg_to_mcg: (val) => val * 1000,
    mcg_to_mg: (val) => val / 1000,
  };

  const key = `${unit}_to_${expectedUnit}`;

  if (!conversions[key]) {
    throw new Error(`Unsupported unit conversion: ${unit} to ${expectedUnit}`);
  }

  return conversions[key](value);
};

export { convertToFixedUnits };
