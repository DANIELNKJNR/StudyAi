export const API_URL = "https://studyai-production-2c0e.up.railway.app";

export const FIELDS = {
  studytime: {
    label: "Study time",
    unit: "hours per week",
    min: 1,
    max: 4,
    hint: "1 = under 2 hours, 2 = 2–5 hours, 3 = 5–10 hours, 4 = over 10 hours per week.",
  },

  absences: {
    label: "School absences",
    unit: "days",
    min: 0,
    max: 100,
    hint: "Enter the number of school days you have missed.",
  },

  G1: {
    label: "First-term grade",
    unit: "out of 20",
    min: 0,
    max: 20,
    hint: "Enter your grade from the first assessment period.",
  },

  G2: {
    label: "Second-term grade",
    unit: "out of 20",
    min: 0,
    max: 20,
    hint: "Enter your grade from the second assessment period.",
  },
};

export const KEYS = Object.keys(FIELDS);
export const PASS_AT = 10;

export const isFieldValid = (key, value) =>
  value !== "" &&
  Number.isFinite(Number(value)) &&
  Number(value) >= FIELDS[key].min &&
  Number(value) <= FIELDS[key].max;

export const isComplete = (values) =>
  KEYS.every((key) => isFieldValid(key, values[key]));

export async function predictStudent(values) {
  const response = await fetch(`${API_URL}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      studytime: Number(values.studytime),
      absences: Number(values.absences),
      G1: Number(values.G1),
      G2: Number(values.G2),
    }),
  });

  if (!response.ok) {
    throw new Error("Prediction failed. Please try again.");
  }

  const data = await response.json();

  return {
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    inputs: {
      studytime: Number(values.studytime),
      absences: Number(values.absences),
      G1: Number(values.G1),
      G2: Number(values.G2),
    },
    predictedGrade: data.predicted_grade,
    label: data.predicted_grade >= PASS_AT ? "PASS RANGE" : "NEEDS IMPROVEMENT",
    factors: KEYS.map((key) => ({
      key,
      label: FIELDS[key].label,
      value: Number(values[key]),
      unit: FIELDS[key].unit,
      target: FIELDS[key].max,
      strength: Number(values[key]) / FIELDS[key].max,
      tone: Number(values[key]) / FIELDS[key].max >= 0.6 ? "strong" : "weak",
      note: "Submitted value",
    })),
  };
}