export default {
  hash256(input) {
    return true
  },
  mail(input) {
    //console.log(input, input.match(/^([0-9a-zA-Z\.\-\_]+\@[0-9a-zA-Z\.\-\_]+\.[0-9a-zA-Z]{0,5})$/));
    return input.match(/^([0-9a-zA-Z\.\-\_]+\@[0-9a-zA-Z\.\-\_]+\.[0-9a-zA-Z]{0,5})$/) !== null
  },
  string(input) {
    //console.log(input, input.match("^([A-Za-z0-9\-\_]+)$"));
    return input.match(/^([A-Züîéèêëïöôa-z0-9\-\_\ ]+)$/) !== null
  },
  bool(input) {
    //
    return input.match(/^(true|false)$/) !== null
  },
  integer(input) {
    input += ""
    console.log(input);
    console.log(input.match(/^-?[0-9]+$/));
    return input.match(/^-?[0-9]+$/) !== null
  }
}
