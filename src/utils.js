export function numberFormat(n, fixedDecimals = 0, locale = "pt-BR") {
  if (isNaN(n)) return n;

  if (fixedDecimals) {
    return n?.toLocaleString(locale, {
      minimumFractionDigits: fixedDecimals,
      maximumFractionDigits: fixedDecimals,
    });
  }

  if (n == 0) return 0;
  if (!n) return "";

  if (Number.isInteger(n)) {
    return n.toLocaleString(locale);
  }

  return n.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
