$(document).ready(function() {

  // Variables
  var $codeSnippets = $('.code-example-body'),
      $nav = $('.navbar'),
      $body = $('body'),
      $window = $(window),
      $popoverLink = $('[data-popover]'),
      navOffsetTop = $nav.offset().top,
      $document = $(document),
      entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': '&quot;',
        "'": '&#39;',
        "/": '&#x2F;'
      }

  function init() {
    $window.on('scroll', onScroll)
    $window.on('resize', resize)
    $popoverLink.on('click', openPopover)
    $document.on('click', closePopover)
    $('a[href^="#"]').on('click', smoothScroll)
    buildSnippets();
  }

  function smoothScroll(e) {
    e.preventDefault();
    $(document).off("scroll");
    var target = this.hash,
        menu = target;
    $target = $(target);
    $('html, body').stop().animate({
        'scrollTop': $target.offset().top-40
    }, 0, 'swing', function () {
        window.location.hash = target;
        $(document).on("scroll", onScroll);
    });
  }

  function openPopover(e) {
    e.preventDefault()
    closePopover();
    var popover = $($(this).data('popover'));
    popover.toggleClass('open')
    e.stopImmediatePropagation();
  }

  function closePopover(e) {
    if($('.popover.open').length > 0) {
      $('.popover').removeClass('open')
    }
  }

  $("#button").click(function() {
    $('html, body').animate({
        scrollTop: $("#elementtoScrollToID").offset().top
    }, 2000);
});

  function resize() {
    $body.removeClass('has-docked-nav')
    navOffsetTop = $nav.offset().top
    onScroll()
  }

  function onScroll() {
    if(navOffsetTop < $window.scrollTop() && !$body.hasClass('has-docked-nav')) {
      $body.addClass('has-docked-nav')
    }
    if(navOffsetTop > $window.scrollTop() && $body.hasClass('has-docked-nav')) {
      $body.removeClass('has-docked-nav')
    }
  }

  function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
      return entityMap[s];
    });
  }

  function buildSnippets() {
    $codeSnippets.each(function() {
      var newContent = escapeHtml($(this).html())
      $(this).html(newContent)
    })
  }


  init();

});

/* ================ Publication thumbnails: lightbox + missing-image fallback ================ */
$(document).ready(function () {

  // If a thumbnail file is missing, swap in a neutral placeholder instead of a broken image.
  $('.pub-thumb-inner img').on('error', function () {
    var $box = $(this).closest('.pub-thumb-inner');
    var label = $(this).data('venue') || '';
    $(this).remove();
    $box.removeClass('has-image')
        .append($('<div class="pub-thumb-empty"></div>').text(label));
  });

  if ($('.pub-thumb-inner.has-image').length === 0) { return; }

  var $lightbox = $(
    '<div class="pub-lightbox" role="dialog" aria-modal="true" aria-label="Enlarged figure">' +
      '<span class="pub-lightbox-close" role="button" tabindex="0" aria-label="Close">&times;</span>' +
      '<img alt="">' +
    '</div>'
  ).appendTo('body');

  var $lightboxImg = $lightbox.find('img');
  var $lastTrigger = null;

  function openLightbox($box) {
    var $img = $box.find('img');
    if ($img.length === 0) { return; }
    $lastTrigger = $box;
    $lightboxImg.attr('src', $img.attr('src')).attr('alt', $img.attr('alt') || '');
    $lightbox.addClass('open');
    $lightbox.find('.pub-lightbox-close').focus();
  }

  function closeLightbox() {
    $lightbox.removeClass('open');
    $lightboxImg.attr('src', '');
    if ($lastTrigger) { $lastTrigger.focus(); }
  }

  $(document).on('click', '.pub-thumb-inner.has-image', function () {
    openLightbox($(this));
  });

  $(document).on('keydown', '.pub-thumb-inner.has-image', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openLightbox($(this));
    }
  });

  $lightbox.on('click', function (e) {
    if (e.target === this || $(e.target).hasClass('pub-lightbox-close')) {
      closeLightbox();
    }
  });

  $(document).on('keydown', function (e) {
    if (e.key === 'Escape' && $lightbox.hasClass('open')) { closeLightbox(); }
  });

});
