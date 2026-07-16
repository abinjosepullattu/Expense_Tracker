export function formatCurrency(amount, currency) {
  let selectedCurrency = currency;
  if (!selectedCurrency) {
    try {
      const uStr = localStorage.getItem('user');
      if (uStr) {
        const u = JSON.parse(uStr);
        if (u && u.currency) {
          selectedCurrency = u.currency;
        }
      }
    } catch (e) {
      // Fallback
    }
  }
  if (!selectedCurrency) {
    selectedCurrency = 'INR';
  }

  let locale = 'en-IN';
  if (selectedCurrency === 'USD') locale = 'en-US';
  else if (selectedCurrency === 'EUR') locale = 'en-IE';
  else if (selectedCurrency === 'GBP') locale = 'en-GB';
  else if (selectedCurrency === 'CAD') locale = 'en-CA';
  else if (selectedCurrency === 'AUD') locale = 'en-AU';
  else if (selectedCurrency === 'JPY') locale = 'ja-JP';

  return new Intl.NumberFormat(locale, {
    style:                 'currency',
    currency:              selectedCurrency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a date string as DD/MM/YYYY.
 */
export function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

/**
 * Get current month and year.
 */
export function currentPeriod() {
  const now = new Date();
  return { month: now.getMonth() + 1, year: now.getFullYear() };
}

export function getCurrencySymbol(currency) {
  let selectedCurrency = currency;
  if (!selectedCurrency) {
    try {
      const uStr = localStorage.getItem('user');
      if (uStr) {
        const u = JSON.parse(uStr);
        if (u && u.currency) {
          selectedCurrency = u.currency;
        }
      }
    } catch (e) {
      // Fallback
    }
  }
  if (!selectedCurrency) selectedCurrency = 'INR';

  switch (selectedCurrency) {
    case 'USD': return '$';
    case 'EUR': return '€';
    case 'GBP': return '£';
    case 'CAD': return '$';
    case 'AUD': return '$';
    case 'JPY': return '¥';
    default: return '₹';
  }
}
