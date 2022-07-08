var clippy = {}
;(clippy.Agent = function(a, b, c) {
  ;(this.path = a),
    (this._queue = new clippy.Queue($.proxy(this._onQueueEmpty, this))),
    (this._el = $('<div class="clippy"></div>').hide()),
    $(document.body).append(this._el),
    (this._animator = new clippy.Animator(this._el, a, b, c)),
    (this._balloon = new clippy.Balloon(this._el)),
    this._setupEvents()
}),
  (clippy.Agent.prototype = {
    gestureAt: function(a, b) {
      var c = this._getDirection(a, b),
        d = 'Gesture' + c,
        e = 'Look' + c,
        f = this.hasAnimation(d) ? d : e
      return this.play(f)
    },
    hide: function(a, b) {
      this._hidden = !0
      var c = this._el
      this.stop()
      if (a) {
        this._el.hide(), this.stop(), this.pause(), b && b()
        return
      }
      return this._playInternal('Hide', function() {
        c.hide(), this.pause(), b && b()
      })
    },
    moveTo: function(a, b, c) {
      var d = this._getDirection(a, b),
        e = 'Move' + d
      c === undefined && (c = 1e3),
        this._addToQueue(function(d) {
          if (c === 0) {
            this._el.css({
              top: b,
              left: a
            }),
              this.reposition(),
              d()
            return
          }
          if (!this.hasAnimation(e)) {
            this._el.animate(
              {
                top: b,
                left: a
              },
              c,
              d
            )
            return
          }
          var f = $.proxy(function(e, f) {
            f === clippy.Animator.States.EXITED && d(),
              f === clippy.Animator.States.WAITING &&
                this._el.animate(
                  {
                    top: b,
                    left: a
                  },
                  c,
                  $.proxy(function() {
                    this._animator.exitAnimation()
                  }, this)
                )
          }, this)
          this._playInternal(e, f)
        }, this)
    },
    _playInternal: function(a, b) {
      this._isIdleAnimation() &&
        this._idleDfd &&
        this._idleDfd.state() === 'pending' &&
        this._idleDfd.done(
          $.proxy(function() {
            this._playInternal(a, b)
          }, this)
        ),
        this._animator.showAnimation(a, b)
    },
    play: function(a, b, c) {
      return this.hasAnimation(a)
        ? (b === undefined && (b = 5e3),
          this._addToQueue(function(d) {
            var e = !1,
              f = function(a, b) {
                b === clippy.Animator.States.EXITED && ((e = !0), c && c(), d())
              }
            b &&
              window.setTimeout(
                $.proxy(function() {
                  if (e) return
                  this._animator.exitAnimation()
                }, this),
                b
              ),
              this._playInternal(a, f)
          }, this),
          !0)
        : !1
    },
    show: function(a) {
      this._hidden = !1
      if (a) {
        this._el.show(), this.resume(), this._onQueueEmpty()
        return
      }
      if (this._el.css('top') === 'auto' || !this._el.css('left') === 'auto') {
        var b = $(window).width() * 0.8,
          c = ($(window).height() + $(document).scrollTop()) * 0.8
        this._el.css({
          top: c,
          left: b
        })
      }
      return this.resume(), this.play('Show')
    },
    speak: function(a, b) {
      this._addToQueue(function(c) {
        this._balloon.speak(c, a, b)
      }, this)
    },
    closeBalloon: function() {
      this._balloon.hide()
    },
    delay: function(a) {
      ;(a = a || 250),
        this._addToQueue(function(b) {
          this._onQueueEmpty(), window.setTimeout(b, a)
        })
    },
    stopCurrent: function() {
      this._animator.exitAnimation(), this._balloon.close()
    },
    stop: function() {
      this._queue.clear(), this._animator.exitAnimation(), this._balloon.hide()
    },
    hasAnimation: function(a) {
      return this._animator.hasAnimation(a)
    },
    animations: function() {
      return this._animator.animations()
    },
    animate: function() {
      var a = this.animations(),
        b = a[Math.floor(Math.random() * a.length)]
      return b.indexOf('Idle') === 0 ? this.animate() : this.play(b)
    },
    _getDirection: function(a, b) {
      var c = this._el.offset(),
        d = this._el.height(),
        e = this._el.width(),
        f = c.left + e / 2,
        g = c.top + d / 2,
        h = g - b,
        i = f - a,
        j = Math.round(180 * Math.atan2(h, i) / Math.PI)
      return -45 <= j && j < 45
        ? 'Right'
        : 45 <= j && j < 135
          ? 'Up'
          : (135 <= j && j <= 180) || (-180 <= j && j < -135)
            ? 'Left'
            : -135 <= j && j < -45 ? 'Down' : 'Top'
    },
    _onQueueEmpty: function() {
      if (this._hidden || this._isIdleAnimation()) return
      var a = this._getIdleAnimation()
      ;(this._idleDfd = $.Deferred()),
        this._animator.showAnimation(a, $.proxy(this._onIdleComplete, this))
    },
    _onIdleComplete: function(a, b) {
      b === clippy.Animator.States.EXITED && this._idleDfd.resolve()
    },
    _isIdleAnimation: function() {
      var a = this._animator.currentAnimationName
      return a && a.indexOf('Idle') === 0
    },
    _getIdleAnimation: function() {
      var a = this.animations(),
        b = []
      for (var c = 0; c < a.length; c++) {
        var d = a[c]
        d.indexOf('Idle') === 0 && b.push(d)
      }
      var e = Math.floor(Math.random() * b.length)
      return b[e]
    },
    _setupEvents: function() {
      $(window).on('resize', $.proxy(this.reposition, this)),
        this._el.on('mousedown', $.proxy(this._onMouseDown, this)),
        this._el.on('dblclick', $.proxy(this._onDoubleClick, this))
    },
    _onDoubleClick: function() {
      this.play('ClickedOn') || this.animate()
    },
    reposition: function() {
      if (!this._el.is(':visible')) return
      var a = this._el.offset(),
        b = this._el.outerHeight(),
        c = this._el.outerWidth(),
        d = $(window).width(),
        e = $(window).height(),
        f = $(window).scrollTop(),
        g = $(window).scrollLeft(),
        h = a.top - f,
        i = a.left - g,
        j = 5
      h - j < 0 ? (h = j) : h + b + j > e && (h = e - b - j),
        i - j < 0 ? (i = j) : i + c + j > d && (i = d - c - j),
        this._el.css({
          left: i,
          top: h
        }),
        this._balloon.reposition()
    },
    _onMouseDown: function(a) {
      a.preventDefault(), this._startDrag(a)
    },
    _startDrag: function(a) {
      this.pause(),
        this._balloon.hide(!0),
        (this._offset = this._calculateClickOffset(a)),
        (this._moveHandle = $.proxy(this._dragMove, this)),
        (this._upHandle = $.proxy(this._finishDrag, this)),
        $(window).on('mousemove', this._moveHandle),
        $(window).on('mouseup', this._upHandle),
        (this._dragUpdateLoop = window.setTimeout(
          $.proxy(this._updateLocation, this),
          10
        ))
    },
    _calculateClickOffset: function(a) {
      var b = a.pageX,
        c = a.pageY,
        d = this._el.offset()
      return {
        top: c - d.top,
        left: b - d.left
      }
    },
    _updateLocation: function() {
      this._el.css({
        top: this._targetY,
        left: this._taregtX
      }),
        (this._dragUpdateLoop = window.setTimeout(
          $.proxy(this._updateLocation, this),
          10
        ))
    },
    _dragMove: function(a) {
      a.preventDefault()
      var b = a.clientX - this._offset.left,
        c = a.clientY - this._offset.top
      ;(this._taregtX = b), (this._targetY = c)
    },
    _finishDrag: function() {
      window.clearTimeout(this._dragUpdateLoop),
        $(window).off('mousemove', this._moveHandle),
        $(window).off('mouseup', this._upHandle),
        this._balloon.show(),
        this.reposition(),
        this.resume()
    },
    _addToQueue: function(a, b) {
      b && (a = $.proxy(a, b)), this._queue.queue(a)
    },
    pause: function() {
      this._animator.pause(), this._balloon.pause()
    },
    resume: function() {
      this._animator.resume(), this._balloon.resume()
    }
  }),
  (clippy.Animator = function(a, b, c, d) {
    ;(this._el = a),
      (this._data = c),
      (this._path = b),
      (this._currentFrameIndex = 0),
      (this._currentFrame = undefined),
      (this._exiting = !1),
      (this._currentAnimation = undefined),
      (this._endCallback = undefined),
      (this._started = !1),
      (this._sounds = {}),
      (this.currentAnimationName = undefined),
      this.preloadSounds(d),
      (this._overlays = [this._el])
    var e = this._el
    this._setupElement(this._el)
    for (var f = 1; f < this._data.overlayCount; f++) {
      var g = this._setupElement($('<div></div>'))
      e.append(g), this._overlays.push(g), (e = g)
    }
  }),
  (clippy.Animator.prototype = {
    _setupElement: function(a) {
      var b = this._data.framesize
      return (
        a.css('display', 'none'),
        a.css({
          width: b[0],
          height: b[1]
        }),
        a.css('background', "url('" + this._path + "/map.png') no-repeat"),
        a
      )
    },
    animations: function() {
      var a = [],
        b = this._data.animations
      for (var c in b) a.push(c)
      return a
    },
    preloadSounds: function(a) {
      for (var b = 0; b < this._data.sounds.length; b++) {
        var c = this._data.sounds[b],
          d = a[c]
        if (!d) continue
        this._sounds[c] = new Audio(d)
      }
    },
    hasAnimation: function(a) {
      return !!this._data.animations[a]
    },
    exitAnimation: function() {
      this._exiting = !0
    },
    showAnimation: function(a, b) {
      return (
        (this._exiting = !1),
        this.hasAnimation(a)
          ? ((this._currentAnimation = this._data.animations[a]),
            (this.currentAnimationName = a),
            this._started || (this._step(), (this._started = !0)),
            (this._currentFrameIndex = 0),
            (this._currentFrame = undefined),
            (this._endCallback = b),
            !0)
          : !1
      )
    },
    _draw: function() {
      var a = []
      this._currentFrame && (a = this._currentFrame.images || [])
      for (var b = 0; b < this._overlays.length; b++)
        if (b < a.length) {
          var c = a[b],
            d = -c[0] + 'px ' + -c[1] + 'px'
          this._overlays[b].css({
            'background-position': d,
            display: 'block'
          })
        } else this._overlays[b].css('display', 'none')
    },
    _getNextAnimationFrame: function() {
      if (!this._currentAnimation) return undefined
      if (!this._currentFrame) return 0
      var a = this._currentFrame,
        b = this._currentFrame.branching
      if (this._exiting && a.exitBranch !== undefined) return a.exitBranch
      if (b) {
        var c = Math.random() * 100
        for (var d = 0; d < b.branches.length; d++) {
          var e = b.branches[d]
          if (c <= e.weight) return e.frameIndex
          c -= e.weight
        }
      }
      return this._currentFrameIndex + 1
    },
    _playSound: function() {
      var a = this._currentFrame.sound
      if (!a) return
      var b = this._sounds[a]
      b && b.play()
    },
    _atLastFrame: function() {
      return this._currentFrameIndex >= this._currentAnimation.frames.length - 1
    },
    _step: function() {
      if (!this._currentAnimation) return
      var a = Math.min(
          this._getNextAnimationFrame(),
          this._currentAnimation.frames.length - 1
        ),
        b = !this._currentFrame || this._currentFrameIndex !== a
      this._currentFrameIndex = a
      if (!this._atLastFrame() || !this._currentAnimation.useExitBranching)
        this._currentFrame = this._currentAnimation.frames[
          this._currentFrameIndex
        ]
      this._draw(),
        this._playSound(),
        (this._loop = window.setTimeout(
          $.proxy(this._step, this),
          this._currentFrame.duration
        )),
        this._endCallback &&
          b &&
          this._atLastFrame() &&
          (this._currentAnimation.useExitBranching && !this._exiting
            ? this._endCallback(
                this.currentAnimationName,
                clippy.Animator.States.WAITING
              )
            : this._endCallback(
                this.currentAnimationName,
                clippy.Animator.States.EXITED
              ))
    },
    pause: function() {
      window.clearTimeout(this._loop)
    },
    resume: function() {
      this._step()
    }
  }),
  (clippy.Animator.States = {
    WAITING: 1,
    EXITED: 0
  }),
  (clippy.Balloon = function(a) {
    ;(this._targetEl = a), (this._hidden = !0), this._setup()
  }),
  (clippy.Balloon.prototype = {
    WORD_SPEAK_TIME: 200,
    CLOSE_BALLOON_DELAY: 2e3,
    _setup: function() {
      ;(this._balloon = $(
        '<div class="clippy-balloon"><div class="clippy-tip"></div><div class="clippy-content"></div></div> '
      ).hide()),
        (this._content = this._balloon.find('.clippy-content')),
        $(document.body).append(this._balloon)
    },
    reposition: function() {
      var a = ['top-left', 'top-right', 'bottom-left', 'bottom-right']
      for (var b = 0; b < a.length; b++) {
        var c = a[b]
        this._position(c)
        if (!this._isOut()) break
      }
    },
    _BALLOON_MARGIN: 15,
    _position: function(a) {
      var b = this._targetEl.offset(),
        c = this._targetEl.height(),
        d = this._targetEl.width(),
        e = this._balloon.outerHeight(),
        f = this._balloon.outerWidth()
      this._balloon.removeClass('clippy-top-left'),
        this._balloon.removeClass('clippy-top-right'),
        this._balloon.removeClass('clippy-bottom-right'),
        this._balloon.removeClass('clippy-bottom-left')
      var g, h
      switch (a) {
        case 'top-left':
          ;(g = b.left + d - f), (h = b.top - e - this._BALLOON_MARGIN)
          break
        case 'top-right':
          ;(g = b.left), (h = b.top - e - this._BALLOON_MARGIN)
          break
        case 'bottom-right':
          ;(g = b.left), (h = b.top + c + this._BALLOON_MARGIN)
          break
        case 'bottom-left':
          ;(g = b.left + d - f), (h = b.top + c + this._BALLOON_MARGIN)
      }
      this._balloon.css({
        top: h,
        left: g
      }),
        this._balloon.addClass('clippy-' + a)
    },
    _isOut: function() {
      var a = this._balloon.offset(),
        b = this._balloon.outerHeight(),
        c = this._balloon.outerWidth(),
        d = $(window).width(),
        e = $(window).height(),
        f = $(document).scrollTop(),
        g = $(document).scrollLeft(),
        h = a.top - f,
        i = a.left - g,
        j = 5
      return h - j < 0 || i - j < 0
        ? !0
        : h + b + j > e || i + c + j > d ? !0 : !1
    },
    speak: function(a, b, c) {
      ;(this._hidden = !1), this.show()
      var d = this._content
      d.height('auto'),
        d.width('auto'),
        d.text(b),
        d.height(d.height()),
        d.width(d.width()),
        d.text(''),
        this.reposition(),
        (this._complete = a),
        this._sayWords(b, c, a)
    },
    show: function() {
      if (this._hidden) return
      this._balloon.show()
    },
    hide: function(a) {
      if (a) {
        this._balloon.hide()
        return
      }
      this._hiding = window.setTimeout(
        $.proxy(this._finishHideBalloon, this),
        this.CLOSE_BALLOON_DELAY
      )
    },
    _finishHideBalloon: function() {
      if (this._active) return
      this._balloon.hide(), (this._hidden = !0), (this._hiding = null)
    },
    _sayWords: function(a, b, c) {
      ;(this._active = !0), (this._hold = b)
      var d = a.split(/[^\S-]/),
        e = this.WORD_SPEAK_TIME,
        f = this._content,
        g = 1
      ;(this._addWord = $.proxy(function() {
        if (!this._active) return
        g > d.length
          ? ((this._active = !1), this._hold || (c(), this.hide()))
          : (f.text(d.slice(0, g).join(' ')),
            g++,
            (this._loop = window.setTimeout($.proxy(this._addWord, this), e)))
      }, this)),
        this._addWord()
    },
    close: function() {
      this._active ? (this._hold = !1) : this._hold && this._complete()
    },
    pause: function() {
      window.clearTimeout(this._loop),
        this._hiding &&
          (window.clearTimeout(this._hiding), (this._hiding = null))
    },
    resume: function() {
      this._addWord && this._addWord(),
        (this._hiding = window.setTimeout(
          $.proxy(this._finishHideBalloon, this),
          this.CLOSE_BALLOON_DELAY
        ))
    }
  }),
  (clippy.BASE_PATH = '//s3.amazonaws.com/clippy.js/Agents/'),
  (clippy.load = function(a, b, c) {
    var d = clippy.BASE_PATH + a,
      e = clippy.load._loadMap(d),
      f = clippy.load._loadAgent(a, d),
      g = clippy.load._loadSounds(a, d),
      h
    f.done(function(a) {
      h = a
    })
    var i
    g.done(function(a) {
      i = a
    })
    var j = function() {
      var a = new clippy.Agent(d, h, i)
      b(a)
    }
    $.when(e, f, g)
      .done(j)
      .fail(c)
  }),
  (clippy.load._maps = {}),
  (clippy.load._loadMap = function(a) {
    var b = clippy.load._maps[a]
    if (b) return b
    b = clippy.load._maps[a] = $.Deferred()
    var c = a + '/map.png',
      d = new Image()
    return (
      (d.onload = b.resolve),
      (d.onerror = b.reject),
      d.setAttribute('src', c),
      b.promise()
    )
  }),
  (clippy.load._sounds = {}),
  (clippy.load._loadSounds = function(a, b) {
    var c = clippy.load._sounds[a]
    if (c) return c
    c = clippy.load._sounds[a] = $.Deferred()
    var d = document.createElement('audio'),
      e = !!d.canPlayType && '' != d.canPlayType('audio/mpeg'),
      f = !!d.canPlayType && '' != d.canPlayType('audio/ogg; codecs="vorbis"')
    if (!e && !f) c.resolve({})
    else {
      var g = b + (e ? '/sounds-mp3.js' : '/sounds-ogg.js')
      clippy.load._loadScript(g)
    }
    return c.promise()
  }),
  (clippy.load._data = {}),
  (clippy.load._loadAgent = function(a, b) {
    var c = clippy.load._data[a]
    if (c) return c
    c = clippy.load._getAgentDfd(a)
    var d = b + '/agent.js'
    return clippy.load._loadScript(d), c.promise()
  }),
  (clippy.load._loadScript = function(a) {
    var b = document.createElement('script')
    b.setAttribute('src', a),
      b.setAttribute('async', 'async'),
      b.setAttribute('type', 'text/javascript'),
      document.head.appendChild(b)
  }),
  (clippy.load._getAgentDfd = function(a) {
    var b = clippy.load._data[a]
    return b || (b = clippy.load._data[a] = $.Deferred()), b
  }),
  (clippy.ready = function(a, b) {
    var c = clippy.load._getAgentDfd(a)
    c.resolve(b)
  }),
  (clippy.soundsReady = function(a, b) {
    var c = clippy.load._sounds[a]
    c || (c = clippy.load._sounds[a] = $.Deferred()), c.resolve(b)
  }),
  (clippy.Queue = function(a) {
    ;(this._queue = []), (this._onEmptyCallback = a)
  }),
  (clippy.Queue.prototype = {
    queue: function(a) {
      this._queue.push(a),
        this._queue.length === 1 && !this._active && this._progressQueue()
    },
    _progressQueue: function() {
      if (!this._queue.length) {
        this._onEmptyCallback()
        return
      }
      var a = this._queue.shift()
      this._active = !0
      var b = $.proxy(this.next, this)
      a(b)
    },
    clear: function() {
      this._queue = []
    },
    next: function() {
      ;(this._active = !1), this._progressQueue()
    }
  })
