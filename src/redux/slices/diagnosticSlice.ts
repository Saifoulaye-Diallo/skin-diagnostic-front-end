import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import api from '../../services/api';

interface DiagnosticState {
  diagnostics: any[];
  currentDiagnostic: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: DiagnosticState = {
  diagnostics: [],
  currentDiagnostic: null,
  loading: false,
  error: null,
};

export const submitDiagnostic = createAsyncThunk(
  'diagnostic/submit',
  async (formData: FormData) => {
    const response = await api.post('/diagnostic/', formData);
    const data = response.data;
    return {
      id: data.id,
      image: data.image_url,
      diagnosis: data.diagnostic,
      created_at: data.date,
      confidence: 0.95, // Default confidence since it's not in the response
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      birthDate: formData.get('birthDate'),
    };
  }
);

export const fetchDiagnostics = createAsyncThunk(
  'diagnostic/fetchAll',
  async () => {
    try {
      const response = await api.get('/images/');
      return response.data.map((item: any) => ({
        id: item.id,
        image: item.image_url,
        diagnosis: item.diagnostic_result,
        created_at: item.date_diagnostic,
        firstName: item.prenom,
        lastName: item.nom,
        birthDate: item.date_naissance,
        confidence: 0.95, // Default confidence since it's not in the response
      }));
    } catch (error) {
      console.error('Error fetching diagnostics:', error);
      throw error;
    }
  }
);

const diagnosticSlice = createSlice({
  name: 'diagnostic',
  initialState,
  reducers: {
    clearCurrentDiagnostic: (state) => {
      state.currentDiagnostic = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitDiagnostic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitDiagnostic.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDiagnostic = action.payload;
        state.diagnostics = [action.payload, ...state.diagnostics];
        state.error = null;
      })
      .addCase(submitDiagnostic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Une erreur est survenue lors de la soumission du diagnostic';
        toast.error('Échec de la soumission du diagnostic');
      })
      .addCase(fetchDiagnostics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDiagnostics.fulfilled, (state, action) => {
        state.loading = false;
        state.diagnostics = action.payload;
        state.error = null;
      })
      .addCase(fetchDiagnostics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Une erreur est survenue lors du chargement des diagnostics';
        toast.error('Échec du chargement des diagnostics');
      });
  },
});

export const { clearCurrentDiagnostic, clearError } = diagnosticSlice.actions;
export default diagnosticSlice.reducer;