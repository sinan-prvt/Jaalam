import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface WebsiteContent {
  hero_title: string;
  about_text: string;
  services_json: string[];
  gallery_json: string[];
  contact_info: {
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
  };
}

interface Website {
  id: string;
  user_id: string;
  slug: string;
  theme: string;
  business_type: string;
  published: boolean;
  content: WebsiteContent;
}

interface WebsiteState {
  websites: Website[];
  currentWebsite: Website | null;
  loading: boolean;
  error: string | null;
}

const initialState: WebsiteState = {
  websites: [],
  currentWebsite: null,
  loading: false,
  error: null,
};

const websiteSlice = createSlice({
  name: 'website',
  initialState,
  reducers: {
    setWebsites: (state, action: PayloadAction<Website[]>) => {
      state.websites = action.payload;
    },
    setCurrentWebsite: (state, action: PayloadAction<Website>) => {
      state.currentWebsite = action.payload;
    },
    updateWebsite: (state, action: PayloadAction<Website>) => {
      const index = state.websites.findIndex(w => w.id === action.payload.id);
      if (index !== -1) {
        state.websites[index] = action.payload;
      }
      if (state.currentWebsite?.id === action.payload.id) {
        state.currentWebsite = action.payload;
      }
    },
    deleteWebsite: (state, action: PayloadAction<string>) => {
      state.websites = state.websites.filter(w => w.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setWebsites, setCurrentWebsite, updateWebsite, deleteWebsite, setLoading, setError } = websiteSlice.actions;
export default websiteSlice.reducer;
