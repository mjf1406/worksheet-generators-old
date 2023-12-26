const elements = document.getElementsByName('difficulty-explanation')
elements.forEach(element => {
    const difficulty = (element.id).replace('-explanation','')
    const data = DIFFICULTIES[difficulty]
    const totalMin = data.totalCommands.min
    const totalMax = data.totalCommands.max
    const varietyMin = data.commandVariety.min
    const varietyMax = data.commandVariety.max
    element.innerHTML = `${difficulty.titleCase()} mazes can be solved with a total of <b>${totalMin}</b> to <b>${totalMax}</b> commands, utilizing a variety of <b>${varietyMin}</b> to <b>${varietyMax}</b> different types of commands.`
});