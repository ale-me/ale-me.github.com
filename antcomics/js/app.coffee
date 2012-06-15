stateObject = undefined

updateAddress = (path) ->
  if window.history and window.history.pushState
    history.pushState stateObject, "", path

scrollToLink = ($target, text) ->
  if not $target
    return $("<a class=\"btn btn-inverse disabled\">" + text + "</a>")

  link = $("<a class=\"btn btn-inverse\">#{text}</a>")
  pos = $target.position().top
  url = $target.attr("data-permalink")

  link.click ->
    console.log "scrolling to " + pos

    $("html,body").animate
      scrollTop: pos
    , 300

    updateAddress url

  link

comicBottoms = {}

addNavigation = ($previous, $current, $next) ->
  if not $current?
    return

  if not $previous? and not $next?
    $(".js-info").click(->
      $(".card").toggleClass "flipped"
    ).removeClass "disabled"
    return


  nav = $('<div class="nav btn-group"></div>')
  permalink = $current.attr("data-permalink")

  bottom = $current.position().top + $current.height()

  comicBottoms[bottom] = permalink

  nav.append scrollToLink($previous, "Prev")
  info = $('<a class="btn btn-inverse">Info</a>')
  card = $current.find(".card")
  info.click ->
    card.toggleClass "flipped"

  nav.append info
  nav.append scrollToLink($next, "Next")
  $current.children(".entry").append nav

prev = null
current = null
next = null

$(".post").each ->
  next = $(this)
  addNavigation prev, current, next
  prev = current
  current = next

addNavigation prev, current, null

updateURLByPosition = ()->
  currentPosition = $(window).scrollTop() + $(window).height() / 2

  for bottom, url of comicBottoms
    console.log "top #{bottom} > #{currentPosition} ? for #{url}"
    if bottom > currentPosition
      updateAddress url
      return

  console.log currentPosition
  

scrollStarted = false
scrollInterrupted = false
scrollEventDelay = 150

scrollEvent = ()->
  unless scrollInterrupted
    console.log "scroll complete event"
    console.log updateURLByPosition()
    scrollStarted = false
    scrollInterrupted = false
  else
    scrollInterrupted = false
    setTimeout scrollEvent, scrollEventDelay

$(window).scroll ->
  unless scrollStarted
    scrollStarted = true
    setTimeout scrollEvent, scrollEventDelay
  else if not scrollInterrupted
    scrollInterrupted = true

