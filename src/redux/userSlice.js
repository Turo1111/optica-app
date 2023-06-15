import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  usuario: "",
  token: "",
  sucursal: "",
  roles: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.usuario = action.payload.usuario;
      state.token = action.payload.token;
      state.sucursal = action.payload.sucursal;
      state.roles = action.payload.roles;
    },
    clearUser: (state) => {
      state.usuario = "";
      state.token = "";
      state.sucursal = "";
      state.roles = "";
    },
  },
});

export const getUser = (state) => state.user;

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
