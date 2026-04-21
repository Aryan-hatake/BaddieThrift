import { createSlice } from "@reduxjs/toolkit";

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */
const LS_KEY = "bt_archive";

const loadFromLS = () => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveToLS = (items) => {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(items));
  } catch {}
};

/* ─────────────────────────────────────────
   Slice
───────────────────────────────────────── */
const archiveSlice = createSlice({
  name: "archive",
  initialState: {
    items: loadFromLS(), // array of archived product snapshots
  },
  reducers: {
    addToArchive: (state, action) => {
      const product = action.payload; // full product object
      const already = state.items.some((i) => i._id === product._id);
      if (!already) {
        state.items.unshift({
          _id: product._id,
          title: product.title,
          description: product.description,
          price: product.price,
          images: product.images ?? [],
          status: product.status,
          stock: product.stock,
          sku: product.sku,
          archivedAt: new Date().toISOString(),
        });
        saveToLS(state.items);
      }
    },
    removeFromArchive: (state, action) => {
      state.items = state.items.filter((i) => i._id !== action.payload);
      saveToLS(state.items);
    },
    clearArchive: (state) => {
      state.items = [];
      saveToLS([]);
    },
  },
});

export const { addToArchive, removeFromArchive, clearArchive } =
  archiveSlice.actions;

export default archiveSlice.reducer;
