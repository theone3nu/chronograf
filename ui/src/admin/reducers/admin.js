import reject from 'lodash/reject'

const newDefaultUser = {
  name: '',
  password: '',
  roles: [],
  permissions: [],
  links: {self: ''},
  isNew: true,
}

const initialState = {
  users: [],
  roles: [],
  queries: [],
  queryIDToKill: null,
}

export default function admin(state = initialState, action) {
  switch (action.type) {
    case 'LOAD_USERS': {
      return {...state, ...action.payload}
    }

    case 'LOAD_ROLES': {
      return {...state, ...action.payload}
    }

    case 'ADD_USER': {
      const newUser = {...newDefaultUser, isEditing: true}
      return {
        ...state,
        users: [
          newUser,
          ...state.users,
        ],
      }
    }

    case 'CONFIRM_USER_CREATED': {
      const {user, createdUser} = action.payload
      const newState = {
        users: state.users.map(u => u.links.self === user.links.self ? {...createdUser} : u),
      }
      return {...state, ...newState}
    }

    case 'EDIT_USER': {
      const {user, updates} = action.payload
      const newState = {
        users: state.users.map(u => u.links.self === user.links.self ? {...u, ...updates} : u),
      }
      return {...state, ...newState}
    }

    case 'CLEAR_EDITING_MODE': {
      const newState = {
        users: state.users.map(u => {
          u.isEditing = false
          return u
        }),
      }
      return {...state, ...newState}
    }

    case 'DELETE_ROLE': {
      const {role} = action.payload
      const newState = {
        roles: state.roles.filter(r => r.name !== role.name),
      }

      return {...state, ...newState}
    }

    case 'DELETE_USER': {
      const {user} = action.payload
      const newState = {
        users: state.users.filter(u => u.links.self !== user.links.self),
      }

      return {...state, ...newState}
    }

    case 'LOAD_QUERIES': {
      return {...state, ...action.payload}
    }

    case 'FILTER_ROLES': {
      const {text} = action.payload
      const newState = {
        roles: state.roles.map(r => {
          r.hidden = !r.name.toLowerCase().includes(text)
          return r
        }),
      }

      return {...state, ...newState}
    }

    case 'FILTER_USERS': {
      const {text} = action.payload
      const newState = {
        users: state.users.map(u => {
          u.hidden = !u.name.toLowerCase().includes(text)
          return u
        }),
      }

      return {...state, ...newState}
    }

    case 'KILL_QUERY': {
      const {queryID} = action.payload
      const nextState = {
        queries: reject(state.queries, (q) => +q.id === +queryID),
      }

      return {...state, ...nextState}
    }

    case 'SET_QUERY_TO_KILL': {
      return {...state, ...action.payload}
    }
  }

  return state
}
