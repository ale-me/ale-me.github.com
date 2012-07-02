(function() {
  var addNavigation, comicBottoms, current, next, prev, scrollEvent, scrollEventDelay, scrollInterrupted, scrollStarted, scrollToLink, stateObject, updateAddress, updateURLByPosition;

  stateObject = void 0;

  updateAddress = function(path) {
    if (window.history && window.history.pushState) {
      return history.pushState(stateObject, "", path);
    }
  };

  scrollToLink = function($target, text, cssClass) {
    var link, pos, url;
    if (!$target) return;
    link = $("<a class=\"" + cssClass + "\">" + text + "</a>");
    pos = $target.position().top;
    url = $target.attr("data-permalink");
    link.click(function() {
      console.log("scrolling to " + pos);
      return $("html,body").animate({
        scrollTop: pos
      }, 300);
    });
    return link;
  };

  comicBottoms = {};

  addNavigation = function($previous, $current, $next) {
    var bottom, card, nav, permalink;
    if (!($current != null)) return;
    if (!($previous != null) && !($next != null)) {
      $(".js-info").click(function() {
        return $(".card").toggleClass("flipped");
      }).removeClass("disabled");
      return;
    }
    nav = $('<div/>');
    permalink = $current.attr("data-permalink");
    bottom = $current.position().top + $current.height();
    comicBottoms[bottom] = permalink;
    nav.append(scrollToLink($previous, "", 'prev'));
    card = $current.find(".card");
    nav.append(scrollToLink($next, "", 'next'));
    return $current.children(".entry").append(nav);
  };

  prev = null;

  current = null;

  next = null;

  $(".post").each(function() {
    next = $(this);
    addNavigation(prev, current, next);
    prev = current;
    return current = next;
  });

  addNavigation(prev, current, null);

  updateURLByPosition = function() {
    var bottom, currentPosition, url;
    currentPosition = $(window).scrollTop() + $(window).height() / 2;
    for (bottom in comicBottoms) {
      url = comicBottoms[bottom];
      console.log("top " + bottom + " > " + currentPosition + " ? for " + url);
      if (bottom > currentPosition) {
        updateAddress(url);
        return;
      }
    }
    return console.log(currentPosition);
  };

  scrollStarted = false;

  scrollInterrupted = false;

  scrollEventDelay = 150;

  scrollEvent = function() {
    if (!scrollInterrupted) {
      scrollStarted = false;
      return scrollInterrupted = false;
    } else {
      scrollInterrupted = false;
      return setTimeout(scrollEvent, scrollEventDelay);
    }
  };

  $(window).scroll(function() {
    if (!scrollStarted) {
      scrollStarted = true;
      return setTimeout(scrollEvent, scrollEventDelay);
    } else if (!scrollInterrupted) {
      return scrollInterrupted = true;
    }
  });

}).call(this);
