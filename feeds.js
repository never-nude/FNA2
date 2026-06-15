/* Renders the Events and Neighborhood Posts feeds as CNA-style cards.
   Looks for #events-feed (optional data-limit) and #posts-feed on the page. */
(function () {
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function meta(time, location) {
    var m = el("div", "feed-meta");
    if (time) m.appendChild(el("span", null, time));
    if (location) m.appendChild(el("span", null, location));
    return m;
  }

  function eventCard(e) {
    var card = el("article", "feed-card");
    var body = el("div", "feed-body");
    var top = el("div", "feed-top");
    if (e.category) top.appendChild(el("span", "feed-tag", e.category));
    body.appendChild(top);
    body.appendChild(el("h3", "feed-title", e.title));
    if (e.dateLabel) body.appendChild(el("p", "feed-date", e.dateLabel));
    body.appendChild(meta(e.time, e.location));
    if (e.summary) body.appendChild(el("p", "feed-summary", e.summary));
    var actions = el("div", "feed-actions");
    if (e.url) {
      var a = el("a", "feed-btn", e.ctaLabel || "Details");
      a.href = e.url; a.target = "_blank"; a.rel = "external noopener";
      actions.appendChild(a);
    } else if (e.source) {
      actions.appendChild(el("span", "feed-source", e.source));
    }
    body.appendChild(actions);
    card.appendChild(body);
    return card;
  }

  function postCard(p) {
    var card = el("article", "feed-card" + (p.fh ? " feed-card-fh" : ""));
    var body = el("div", "feed-body");
    var top = el("div", "feed-top");
    if (p.fh) top.appendChild(el("span", "feed-tag feed-tag-fh", "Fisher Hill"));
    if (p.category) top.appendChild(el("span", "feed-tag", p.category));
    body.appendChild(top);
    body.appendChild(el("h3", "feed-title", p.title));
    if (p.dateLabel) body.appendChild(el("p", "feed-date", p.dateLabel));
    body.appendChild(meta(p.time, p.location));
    if (p.summary) body.appendChild(el("p", "feed-summary", p.summary));
    if (p.source) {
      var actions = el("div", "feed-actions");
      actions.appendChild(el("span", "feed-source", "Posted by " + p.source));
      body.appendChild(actions);
    }
    card.appendChild(body);
    return card;
  }

  function render(container, items, builder) {
    container.innerHTML = "";
    var grid = el("div", "feed-grid");
    items.forEach(function (it) { grid.appendChild(builder(it)); });
    container.appendChild(grid);
  }

  var evBox = document.getElementById("events-feed");
  if (evBox) {
    fetch("data/events.json").then(function (r) { return r.json(); }).then(function (d) {
      var items = (d.events || []);
      var lim = parseInt(evBox.getAttribute("data-limit"), 10);
      if (lim > 0) items = items.slice(0, lim);
      render(evBox, items, eventCard);
    }).catch(function () { evBox.innerHTML = '<p class="feed-empty">Events are unavailable right now.</p>'; });
  }

  var postBox = document.getElementById("posts-feed");
  if (postBox) {
    fetch("data/posts.json").then(function (r) { return r.json(); }).then(function (d) {
      render(postBox, (d.posts || []), postCard);
    }).catch(function () { postBox.innerHTML = '<p class="feed-empty">Posts are unavailable right now.</p>'; });
  }
})();
