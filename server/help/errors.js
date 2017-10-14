
class ErrorMessage {
  constructor (message, parameter, value) {
    this.parameter = parameter
    this.message = message
    this.value = value
  }
}
exports.ErrorMessage = ErrorMessage
class ErrorArray {
  constructor () {
    // es-lint-disable-next-line
    this.errors = new Array()
  }
}
exports.ErrorArray = ErrorArray
