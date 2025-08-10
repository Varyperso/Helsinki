const useHistory = (historyIndex, history, historyIndexSetter, setNewState) => {
  return (whereTo) => {
    let newIndex = historyIndex
    if (whereTo === '>') newIndex++
    else if (whereTo === '>>') newIndex = history.length - 1
    else if (whereTo === '<') newIndex--
    else if (whereTo === '<<') newIndex = 0
    if (newIndex < 0 || newIndex > history.length - 1) return
    historyIndexSetter(newIndex)
    setNewState(history[newIndex])
  }
};

export default useHistory