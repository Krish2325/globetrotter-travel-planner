// Money is stored in the DB as Int minor units (e.g. paise) since SQLite has
// no exact Decimal type. These helpers convert at the API boundary so
// clients keep sending/receiving plain decimal currency values.
const MONEY_FIELDS = new Set([
  'basePrice', 'totalBudget', 'accommodation', 'food',
  'transport', 'activities', 'shopping', 'miscellaneous', 'amount',
]);

// number|string|null|undefined -> Int minor units, or null/undefined unchanged.
const toMinorUnits = (v) => {
  if (v === undefined) return undefined;
  if (v === null || v === '') return null;
  return Math.round(Number(v) * 100);
};

// Recursively walks a value (including nested/related records) and divides
// any known money field back down to major units for display.
const toDisplay = (val) => {
  if (Array.isArray(val)) return val.map(toDisplay);
  if (val instanceof Date) return val;
  if (val && typeof val === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(val)) {
      out[k] = MONEY_FIELDS.has(k) && typeof v === 'number' ? v / 100 : toDisplay(v);
    }
    return out;
  }
  return val;
};

module.exports = { toMinorUnits, toDisplay };
