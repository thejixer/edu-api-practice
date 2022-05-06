global.print = console.log

global.printError = (...args) => {
  console.log('\x1b[41m', ...args)
  console.log("\x1b[0m")
}

global.deepClone = obj => JSON.parse(JSON.stringify(obj))

global.UID = () => `${new Date().getTime()}${String(Math.random()).slice(3, 9)}`

global.removeNullishKeys = function(obj) {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    
    if (value != null) return {...acc, [key]: value}

    return acc

  },{})
}