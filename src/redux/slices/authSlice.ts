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
    try {
      const response = await api.post('/token/', credentials);
      const { access, user } = response.data;
      localStorage.setItem('token', access);
      toast.success('Connexion réussie');
      return { token: access, user };
    } catch (error: any) {
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

export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/profile/');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Erreur lors du chargement du profil');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData: {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  }, { rejectWithValue }) => {
    try {
      const response = await api.put('/profile/update/', profileData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Erreur lors de la mise à jour du profil');
    }
  }
);

export const updatePassword = createAsyncThunk(
  'auth/updatePassword',
  async (passwordData: { current_password: string; new_password: string }, { rejectWithValue }) => {
    try {
      const response = await api.put('/profile/password/', passwordData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Erreur lors de la mise à jour du mot de passe');
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
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Identifiants invalides';
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
      })
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
        toast.success('Profil mis à jour avec succès');
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(state.error || 'Erreur lors de la mise à jour du profil');
      })
      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        toast.success('Mot de passe mis à jour avec succès');
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(state.error || 'Erreur lors de la mise à jour du mot de passe');
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
