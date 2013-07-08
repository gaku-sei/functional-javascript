var fjquery = function() {
  var exports = {};
  var jfn, attr, append, children, click, find, on;

  jfn = fjs.fn(
    "jQuery function pattern.",
    function(name) {
      return function(sel) {
        return fjs.applyWith(jQuery.fn[name], jQuery(sel), fjs.butfirst(arguments));
      };
    }
  );

  //#finish(you must filter the keys)
  fjs.loop(function(_, v) {
    exports[v] = jfn(v);
  }, fjs.keys(jQuery));

  //exports.attr = jfn("attr");
  //exports.append = jfn("append");
  //exports.children = jfn("children");
  //exports.click = jfn("click");
  //exports.find = jfn("find");
  //exports.on = jfn("on");

  return exports;
}();
