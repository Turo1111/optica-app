import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  idEmpleado: "",
  idSucursal: "",
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
      state.idEmpleado = action.payload.idEmpleado;
      state.idSucursal = action.payload.idSucursal;
      state.usuario = action.payload.usuario;
      state.token = action.payload.token;
      state.sucursal = action.payload.sucursal;
      state.roles = action.payload.roles;
    },
    clearUser: (state) => {
      state.idEmpleado = "";
      state.idSucursal = "";
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
