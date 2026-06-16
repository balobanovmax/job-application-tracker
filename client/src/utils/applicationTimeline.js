/** Parse a date-only or ISO datetime string as a local calendar date. */
export function parseApplicationDate(value) {
  if (!value) return null;

  if (typeof value === 'string') {
    const datePart = value.split('T')[0];
    const [year, month, day] = datePart.split('-').map(Number);
    if (!year || !month || !day) return null;
    return new Date(year, month - 1, day);
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate());
  }

  return null;
}

export function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getLocalDateString(date = new Date()) {
  return formatDateKey(date);
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date, amount) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function addWeeks(date, amount) {
  return addDays(date, amount * 7);
}

function addMonths(date, amount) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + amount);
  return next;
}

function getMondayOfWeek(date) {
  const monday = startOfDay(date);
  const day = monday.getDay();
  const diff = monday.getDate() - day + (day === 0 ? -6 : 1);
  monday.setDate(diff);
  return monday;
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function formatWeekLabel(weekStart) {
  const weekEnd = addDays(weekStart, 6);
  const startLabel = weekStart.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  return `${startLabel}-${weekEnd.getDate()}`;
}

function formatMonthLabel(date) {
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function buildDailyTimeline(applications, firstDate, lastDate) {
  const grouped = {};

  applications.forEach((app) => {
    const date = parseApplicationDate(app.date_applied);
    if (!date) return;
    const key = formatDateKey(date);
    grouped[key] = (grouped[key] || 0) + 1;
  });

  const result = [];
  let current = new Date(firstDate);

  while (current <= lastDate) {
    const key = formatDateKey(current);
    result.push({
      label: current.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: grouped[key] || 0,
      date: key,
    });
    current = addDays(current, 1);
  }

  return { data: result, unit: 'days' };
}

function buildWeeklyTimeline(applications, firstDate, lastDate) {
  const grouped = {};

  applications.forEach((app) => {
    const date = parseApplicationDate(app.date_applied);
    if (!date) return;
    const key = formatDateKey(getMondayOfWeek(date));
    grouped[key] = (grouped[key] || 0) + 1;
  });

  const result = [];
  let current = getMondayOfWeek(firstDate);
  const lastWeek = getMondayOfWeek(lastDate);

  while (current <= lastWeek) {
    const key = formatDateKey(current);
    result.push({
      label: formatWeekLabel(current),
      value: grouped[key] || 0,
      date: key,
    });
    current = addWeeks(current, 1);
  }

  return { data: result, unit: 'weeks' };
}

function buildMonthlyTimeline(applications, firstDate, lastDate) {
  const grouped = {};

  applications.forEach((app) => {
    const date = parseApplicationDate(app.date_applied);
    if (!date) return;
    const key = formatDateKey(startOfMonth(date));
    grouped[key] = (grouped[key] || 0) + 1;
  });

  const result = [];
  let current = startOfMonth(firstDate);
  const lastMonth = startOfMonth(lastDate);

  while (current <= lastMonth) {
    const key = formatDateKey(current);
    result.push({
      label: formatMonthLabel(current),
      value: grouped[key] || 0,
      date: key,
    });
    current = addMonths(current, 1);
  }

  return { data: result, unit: 'months' };
}

export function buildApplicationTimeline(applications) {
  if (!applications?.length) {
    return { data: [], unit: 'days' };
  }

  const dates = applications
    .map((app) => parseApplicationDate(app.date_applied))
    .filter(Boolean)
    .sort((a, b) => a - b);

  if (!dates.length) {
    return { data: [], unit: 'days' };
  }

  const firstDate = startOfDay(dates[0]);
  const lastDate = startOfDay(dates[dates.length - 1]);
  const daysDiff = Math.round((lastDate - firstDate) / (1000 * 60 * 60 * 24));

  if (daysDiff < 28) {
    return buildDailyTimeline(applications, firstDate, lastDate);
  }

  if (daysDiff < 120) {
    return buildWeeklyTimeline(applications, firstDate, lastDate);
  }

  return buildMonthlyTimeline(applications, firstDate, lastDate);
}
