import { createSlice } from "@reduxjs/toolkit";

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */






/* ─────────────────────────────────────────
   Slice
───────────────────────────────────────── */
const archiveSlice = createSlice({
  name: "archive",
  initialState: {
    items:[], // array of archived product snapshots
    loading:false,
    error:null,
  },
  reducers: {
    addToArchive: (state, action) => {
      const item = action.payload
   
  
      
        state.items.unshift(item);
       
      

    },
    removeFromArchive: (state, action) => {
      const {productId , variantId} = action.payload;
      state.items = state.items.filter((i) => i.product._id !== productId && i.variant._id !== variantId);
    
    },
    clearArchive: (state) => {
      state.items = [];

    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setErr: (state, action) => {
      state.error = action.payload;
    },
    setArchiveItems: (state, action) => {
      state.items = action.payload;
    },
  },
});

export const { addToArchive, removeFromArchive, clearArchive,setErr,setLoading , setArchiveItems } =
  archiveSlice.actions;

export default archiveSlice.reducer;
