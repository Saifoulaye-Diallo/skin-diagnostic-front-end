import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import api from '../../services/api';

interface AuthState {
  token: string | null;
  user: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  user: null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { username: string; password: string }) => {
    console.log("Données reçues :", { credentials });
    try {
      const response = await api.post('/token/', credentials);
      const { access } = response.data;
      localStorage.setItem('token', access);
      console.log("USER");
      toast.success('Connexion réussie');
      return { access };
    } catch (error: any) {
      console.error('❌ USER ERROR', error);
      const message = error.response?.data?.detail || 'Identifiants invalides';
      throw new Error(message);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: { username: string; email: string; password: string }) => {
    try {
      const response = await api.post('/register/', userData);
      toast.success('Inscription réussie ! Vous pouvez maintenant vous connecter.');
      return response.data;
    } catch (error: any) {
      let message = "Erreur lors de l'inscription";
      if (error.response?.data) {
        if (error.response.data.username) {
          message = "Ce nom d'utilisateur est déjà pris";
        } else if (error.response.data.email) {
          message = "Cette adresse e-mail est déjà utilisée";
        } else if (error.response.data.password) {
          message = "Le mot de passe n'est pas valide";
        } else if (error.response.data.detail) {
          message = error.response.data.detail;
        }
      }
      throw new Error(message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem('token');
      toast.success('Déconnexion réussie');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.access;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Identifiants invalides';
        toast.error(state.error);
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Erreur lors de l'inscription";
        toast.error(state.error);
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;