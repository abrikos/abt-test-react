import {configureStore, createSlice} from '@reduxjs/toolkit'
import {loadDb, addUser, deleteUser, saveDb} from './mock'

const slice = createSlice({
    name: 'userList',
    initialState: {
        userList: [],
    },
    reducers: {
        addItem: (state, action) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.userList = addUser(action.payload)
        },
        deleteItem: (state, action) => {
            state.userList = deleteUser(action.payload)
        },
        loadItems: (state) => {
            state.userList = loadDb();
        },
        resetItems: (state) => {
            state.userList = saveDb([]);
        },
    },
})
export const {addItem, deleteItem, loadItems, resetItems} = slice.actions

export default configureStore(slice)
