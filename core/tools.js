class Tools {
    uniqueId () {
      return Math.random().toString(36).substr(2, 16)
    }
}

module.exports = new Tools()