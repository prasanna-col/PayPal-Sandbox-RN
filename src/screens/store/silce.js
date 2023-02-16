import { createSlice } from '@reduxjs/toolkit'

let nextTodoId = 0;

const AppReduxSlice = createSlice({
    name: 'MYSTORE',
    initialState: [],
    reducers: {
        SaveThought(state, action) {
            console.log("SaveThought action", action)
            var data = {
                "id": nextTodoId++,
                "text": action.payload,
                "completed": false,
                "canceled": false,
                "editMode": false
            }
            state.push(data)
        },
        DeleteThought(state, action) {
            var index = action.payload
            state.splice(index, 1);

        },
        CompleteThought(state, action) {
            var index = action.payload
            state[index].completed = !(state[index].completed)

        },
        EnableEditMode(state, action) {
            var index = action.payload
            // var bool = state[index].editMode
            // state[index].editMode = (bool == true ? false : true)

            state[index].editMode = !(state[index].editMode)

        },
        EditThought(state, action) {
            console.log("EditThought action", action)
            var index = action.payload.index
            var value = action.payload.value
            state[index].text = value

        },
        toggleTodo(state, action) {
            const todo = state.find(todo => todo.id === action.payload)
            if (todo) {
                todo.completed = !todo.completed
            }
        }
    }
})

export const { SaveThought, DeleteThought, CompleteThought, EditThought, EnableEditMode, toggleTodo } = AppReduxSlice.actions

export default AppReduxSlice.reducer