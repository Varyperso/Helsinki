const initialState = {
  good: 0,
  ok: 0,
  bad: 0
}

export const good = () => {
  return {
    type: 'GOOD'
  }
}
export const ok = () => {
  return {
    type: 'OK'
  }
}
export const bad = () => {
  return {
    type: 'BAD'
  }
}
export const zero = () => {
  return {
    type: 'ZERO'
  }
}

const counterReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'GOOD':
      return { ...state, good: state.good + 1 }
    case 'OK':
      return { ...state, ok: state.ok + 1 }
    case 'BAD':
      return { ...state, bad: state.bad + 1 }
    case 'ZERO':
      return { good: 0, ok: 0, bad: 0 }
    default: return state
  }
}

export default counterReducer