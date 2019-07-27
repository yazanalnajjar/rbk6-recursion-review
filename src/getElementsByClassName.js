// If life was easy, we could just do things the easy way:
// var getElementsByClassName = function (className) {
//   return document.getElementsByClassName(className);
// };

// But instead we're going to implement it from scratch:
var getElementsByClassName = function(className, element) {
    // your code here
  
    element = element || document.body;
    var results = [];
  
    if (element.classList && _.contains(element.classList, className)) {
      results.push(element);
    }
    _.each(element.childNodes, function(node, i) {
      results = results.concat(getElementsByClassName(className, node));
    });
  
    return results;
    };
