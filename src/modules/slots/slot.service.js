import { TimeSlot } from '../../models/timeSlot.model.js';
import { ApiError } from '../../utils/apiError.js';
import { slotNote, slotPeriods, staticTimeSlots } from './slot.data.js';
import { toSlotPayload } from './slot.mapper.js';

const DAY_MS = 24 * 60 * 60 * 1000;

function pad(value) {
  return String(value).padStart(2, '0');
}

function toDateKey(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function startOfLocalDay(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function weekdayLabel(date) {
  return date.toLocaleDateString('en-IN', { weekday: 'long' });
}

function dayLabel(date, today) {
  const key = toDateKey(date);
  const todayKey = toDateKey(today);
  const tomorrowKey = toDateKey(new Date(today.getTime() + DAY_MS));

  if (key === todayKey) {
    return 'Today';
  }
  if (key === tomorrowKey) {
    return 'Tomorrow';
  }
  return weekdayLabel(date);
}

function currentTimeValue(now = new Date()) {
  return `${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

function buildDays(today = startOfLocalDay()) {
  return Array.from({ length: 4 }, (_, index) => {
    const date = new Date(today.getTime() + index * DAY_MS);
    return {
      id: toDateKey(date),
      date: toDateKey(date),
      label: dayLabel(date, today),
    };
  });
}

export async function seedTimeSlots() {
  const keys = staticTimeSlots.map((slot) => `${slot.period}:${slot.startTime}`);
  await TimeSlot.deleteMany({
    $nor: staticTimeSlots.map((slot) => ({ period: slot.period, startTime: slot.startTime })),
  });

  await Promise.all(
    staticTimeSlots.map((slot) =>
      TimeSlot.updateOne(
        { period: slot.period, startTime: slot.startTime },
        { ...slot, isActive: true },
        { upsert: true },
      ),
    ),
  );

  return keys.length;
}

export async function listSlots({ date, period } = {}) {
  const today = startOfLocalDay();
  const days = buildDays(today);
  const selectedDate = date || days[0].date;

  if (!days.some((day) => day.date === selectedDate)) {
    throw new ApiError(400, 'Select a valid day');
  }

  const filter = { isActive: true };
  if (period) {
    filter.period = period;
  }

  const slots = await TimeSlot.find(filter).sort({ sortOrder: 1 });
  const isToday = selectedDate === toDateKey(today);
  const nowTime = currentTimeValue();

  return {
    days,
    selectedDate,
    periods: slotPeriods,
    note: slotNote,
    slots: slots.map((slot) =>
      toSlotPayload(slot, {
        isAvailable: !(isToday && slot.startTime <= nowTime),
      }),
    ),
  };
}
