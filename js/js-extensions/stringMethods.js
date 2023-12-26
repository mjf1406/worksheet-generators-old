String.prototype.reverse = function() {
    return this.split('').reverse().join('');
};
String.prototype.titleCase = function() {
    return this.toLowerCase().split(' ').map(function(word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
};
  