'use strict';

(() => {
  // Dates are intentionally unset until the brand announces its annual edition.
  // Five calendar days, in the brand's configured time zone, then selection closes.
  const config = Object.freeze({startMonthDay:null, durationDays:5, timeZone:'America/Santo_Domingo'});
  const dayMs = 86400000;
  const isoDay = stamp => new Date(stamp).toISOString().slice(0, 10);

  function getWindow(now = new Date(), schedule = config) {
    const pending = {status:'pending', isOpen:false, start:null, end:null, timeZone:schedule.timeZone};
    if (!/^\d{2}-\d{2}$/.test(schedule.startMonthDay || '') || schedule.durationDays !== 5) return pending;
    const [month, day] = schedule.startMonthDay.split('-').map(Number);
    // An annual date must exist every year; do not accept February 29 or rollover dates.
    const reference = new Date(Date.UTC(2001, month - 1, day));
    if (reference.getUTCMonth() !== month - 1 || reference.getUTCDate() !== day) return pending;
    let parts;
    try {
      parts = new Intl.DateTimeFormat('en-US', {timeZone:schedule.timeZone, year:'numeric', month:'numeric', day:'numeric'}).formatToParts(now);
    } catch { return pending; }
    const value = type => Number(parts.find(part => part.type === type)?.value);
    const year = value('year');
    const currentDay = Date.UTC(year, value('month') - 1, value('day'));
    const startFor = editionYear => Date.UTC(editionYear, month - 1, day);
    const currentStart = startFor(year);
    const previousStart = startFor(year - 1);
    const start = currentDay >= previousStart && currentDay < previousStart + 5 * dayMs ? previousStart : currentStart;
    const isOpen = currentDay >= start && currentDay < start + 5 * dayMs;
    const status = isOpen ? 'open' : currentDay < currentStart ? 'upcoming' : 'closed';
    const displayStart = status === 'closed' ? startFor(year + 1) : start;
    return {status, isOpen, start:isoDay(displayStart), end:isoDay(displayStart + 4 * dayMs), timeZone:schedule.timeZone};
  }

  window.ALRedition = Object.freeze({
    config,
    getWindow,
    canSelect(product, now = new Date(), schedule = config) {
      return !product.exclusive || getWindow(now, schedule).isOpen;
    }
  });
})();
