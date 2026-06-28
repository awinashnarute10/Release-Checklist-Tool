/**
 * In-browser mock backend backed by localStorage.
 *
 * This lets the whole app run with zero backend (the default) while keeping the
 * real Axios service (releases.js) one env flag away. Every method mimics the
 * REST contract and adds a small latency so loading/skeleton states are visible.
 */
import { emptyChecklist } from "../constants";
import { deriveStatus, makeId } from "../utils";

const STORAGE_KEY = "rc-mock-db";
const LATENCY = 450;

const delay = (ms = LATENCY) => new Promise((r) => setTimeout(r, ms));

const nowIso = () => new Date().toISOString();

function seed() {
  const base = (name, date, doneSteps) => {
    const steps = { ...emptyChecklist() };
    doneSteps.forEach((s) => {
      steps[s] = true;
    });
    return {
      id: makeId(),
      name,
      date,
      steps,
      status: deriveStatus(steps),
      remarks: "",
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
  };

  return [
    base("Version 1.0", "2026-09-20", [
      "PRS_MERGED",
      "CHANGELOG_UPDATED",
      "TESTS_PASSING",
      "GITHUB_RELEASE_CREATED",
      "STAGING_DEPLOYED",
      "QA_VERIFIED",
      "PRODUCTION_DEPLOYED",
      "SMOKE_TESTED",
    ]),
    base("Version 1.1", "2026-09-28", [
      "PRS_MERGED",
      "CHANGELOG_UPDATED",
      "TESTS_PASSING",
    ]),
    base("Version 2.0", "2026-10-10", []),
  ];
}

function read() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeded = seed();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function write(rows) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
  return rows;
}

function notFound(id) {
  const err = new Error(`Release ${id} not found`);
  err.response = { status: 404, data: { message: "Release not found" } };
  return err;
}

export const mockApi = {
  async list() {
    await delay();
    return read()
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async get(id) {
    await delay(250);
    const found = read().find((r) => r.id === id);
    if (!found) throw notFound(id);
    return found;
  },

  async create({ name, date }) {
    await delay();
    const steps = emptyChecklist();
    const release = {
      id: makeId(),
      name: name.trim(),
      date,
      steps,
      status: deriveStatus(steps),
      remarks: "",
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    const rows = read();
    write([release, ...rows]);
    return release;
  },

  async updateSteps(id, partialSteps) {
    await delay(250);
    const rows = read();
    const idx = rows.findIndex((r) => r.id === id);
    if (idx === -1) throw notFound(id);
    const steps = { ...rows[idx].steps, ...partialSteps };
    rows[idx] = {
      ...rows[idx],
      steps,
      status: deriveStatus(steps),
      updatedAt: nowIso(),
    };
    write(rows);
    return rows[idx];
  },

  async updateInfo(id, remarks) {
    await delay(250);
    const rows = read();
    const idx = rows.findIndex((r) => r.id === id);
    if (idx === -1) throw notFound(id);
    rows[idx] = { ...rows[idx], remarks, updatedAt: nowIso() };
    write(rows);
    return rows[idx];
  },

  async remove(id) {
    await delay();
    const rows = read();
    if (!rows.some((r) => r.id === id)) throw notFound(id);
    write(rows.filter((r) => r.id !== id));
    return { id };
  },
};
