
export const initialState = {
  list: [],
  query: "",
  showForm: false,
  editing: null, // item being edited
};

export function reducer(state, action){
  switch(action.type){
    case "set-list": return { ...state, list: action.payload };
    case "set-query": return { ...state, query: action.payload };
    case "open-create": return { ...state, showForm: true, editing: null };
    case "open-edit": return { ...state, showForm: true, editing: action.payload };
    case "close-form": return { ...state, showForm: false, editing: null };
    default: return state;
  }
}