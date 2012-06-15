(function() {
  var addNavigation, comicBottoms, current, next, prev, scrollEvent, scrollEventDelay, scrollInterrupted, scrollStarted, scrollToLink, stateObject, updateAddress, updateURLByPosition;

  stateObject = void 0;

  updateAddress = function(path) {
    if (window.history && window.history.pushState) {
      return history.pushState(stateObject, "", path);
    }
  };

  scrollToLink = function($target, text) {
    var link, pos, url;
    if (!$target) {
      return $("<a class=\"btn btn-inverse disabled\">" + text + "</a>");
    }
    link = $("<a class=\"btn btn-inverse\">" + text + "</a>");
    pos = $target.position().top;
    url = $target.attr("data-permalink");
    link.click(function() {
      console.log("scrolling to " + pos);
      $("html,body").animate({
        scrollTop: pos
      }, 300);
      return updateAddress(url);
    });
    return link;
  };

  comicBottoms = {};

  addNavigation = function($previous, $current, $next) {
    var bottom, card, info, nav, permalink;
    if (!($current != null)) return;
    if (!($previous != null) && !($next != null)) {
      $(".js-info").click(function() {
        return $(".card").toggleClass("flipped");
      }).removeClass("disabled");
      return;
    }
    nav = $('<div class="nav btn-group"></div>');
    permalink = $current.attr("data-permalink");
    bottom = $current.position().top + $current.height();
    comicBottoms[bottom] = permalink;
    nav.append(scrollToLink($previous, "Prev"));
    info = $('<a class="btn btn-inverse">Info</a>');
    card = $current.find(".card");
    info.click(function() {
      return card.toggleClass("flipped");
    });
    nav.append(info);
    nav.append(scrollToLink($next, "Next"));
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
      console.log("scroll complete event");
      console.log(updateURLByPosition());
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
