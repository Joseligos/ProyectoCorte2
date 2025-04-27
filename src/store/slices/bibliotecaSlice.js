import { createSlice } from "@reduxjs/toolkit";

const bibliotecaSlice = createSlice({
  name: "biblioteca",
  initialState: {
    catalog: {
      head: null,
      tail: null,
      nodes: {},
    },
    devolucionStack: [],
    esperaQueue: {},
    librosPrestados: {},
  },
  reducers: {
    añadirLibro: (state, action) => {
      const id = Date.now();
      const nuevoLibro = {
        id,
        titulo: action.payload,
        prev: null,
        next: null,
      };

      state.catalog.nodes[id] = nuevoLibro;

      if (!state.catalog.head) {
        state.catalog.head = id;
        state.catalog.tail = id;
      } else {
        const tailLibro = state.catalog.nodes[state.catalog.tail];
        tailLibro.next = id;
        nuevoLibro.prev = tailLibro.id;
        state.catalog.tail = id;
      }
    },
    prestarLibro: (state, action) => {
        const { libroId, usuario } = action.payload;
        const libro = state.catalog.nodes[libroId];
        if (!libro) return;
      
        if (state.librosPrestados[libroId]) {
          if (!state.esperaQueue[libroId]) {
            state.esperaQueue[libroId] = [];
          }
          state.esperaQueue[libroId].push(usuario);
          alert(`${usuario} se ha añadido a la cola para el libro "${libro.titulo}"`);
          return;
        }
      
        state.librosPrestados[libroId] = { titulo: libro.titulo, usuario };
      
        if (libro.prev !== null) {
          state.catalog.nodes[libro.prev].next = libro.next;
        } else {
          state.catalog.head = libro.next;
        }
      
        if (libro.next !== null) {
          state.catalog.nodes[libro.next].prev = libro.prev;
        } else {
          state.catalog.tail = libro.prev;
        }
      
    },
    devolverLibro: (state, action) => {
        const { libroId, titulo } = action.payload;
        const libro = state.librosPrestados[libroId];
      
        if (!libro) return;
      
        delete state.librosPrestados[libroId];
      
        state.devolucionStack = state.devolucionStack.filter(item => item.id !== libroId);
      
        state.devolucionStack.push({ id: libroId, titulo, usuario: libro.usuario });
      
        if (state.esperaQueue[libroId] && state.esperaQueue[libroId].length > 0) {
          const siguienteUsuario = state.esperaQueue[libroId].shift();
          alert(`${siguienteUsuario} ahora tiene el libro "${titulo}"`);
          
          state.librosPrestados[libroId] = { titulo, usuario: siguienteUsuario };
      
          if (state.esperaQueue[libroId].length === 0) {
            delete state.esperaQueue[libroId];
          }
        }
    },   
    rehacerDevolucion: (state) => {
      if (state.devolucionStack.length > 0) {
        const libro = state.devolucionStack.pop();

        if (libro.usuario) {
          state.librosPrestados[libro.id] = { titulo: libro.titulo, usuario: libro.usuario };

          alert(`${libro.titulo} ha sido devuelto a ${libro.usuario}`);
        }
      }
    },
    agregarACola: (state, action) => {
      const { libroId, usuario } = action.payload;
      if (!state.esperaQueue[libroId]) {
        state.esperaQueue[libroId] = [];
      }
      state.esperaQueue[libroId].push(usuario);
    },
  },
});

export const {
  añadirLibro,
  prestarLibro,
  devolverLibro,
  rehacerDevolucion,
  agregarACola,
} = bibliotecaSlice.actions;

export default bibliotecaSlice.reducer;
