/**
 * @module Calendar
 * @author lzhengms <lzhengms@gmail.com> - 2015-03-11 13:21:43
 */

'use strict';

var $ = require('jquery');
var Widget = require('nd-widget');
var wheel = require('nd-wheel');

var tpl = require('./time.handlebars');

function patchZero(n) {
  return n < 10 ? '0' + n : n;
}

function changeValue(input, val) {
  /*jshint validthis:true*/
  var type = input.attr('data-input');
  val = +val;
  val = isNaN(val) ? (+$.trim(input.val()) || 0) : val;

  if (type === 'hour') {
    val = (val + 24) % 24;
    this._change(val, this.get('minute'), this.get('second'));
  } else {
    val = (val + 60) % 60;
    if (type === 'minute') {
      this._change(this.get('hour'), val, this.get('second'));
    } else {
      this._change(this.get('hour'), this.get('minute'), val);
    }
  }

  input.val(patchZero(val));
}

module.exports = Widget.extend({

  attrs: {
    className: 'ui-calendar-time',
    hour: new Date().getHours(),
    minute: new Date().getMinutes(),
    second: new Date().getSeconds(),
    display: {
      hour: true,
      minute: true,
      second: false
    }
  },

  events: {

    // 'click [data-action]': function(e) {
    //   var node = $(e.target);
    //   var isPrev = /prev/.test(node.attr('data-action'));
    //   var input = node.parent().find('[data-input]');
    //   var val = +$.trim(input.val()) || 0;
    //   val = val + (isPrev ? -1 : 1);
    //   changeValue.call(this, input, val);
    // },

    'blur [data-input]': function(e) {
      var input = $(e.target);
      changeValue.call(this, input);
    }
  },

  show: function() {
    var self = this;

    this.element.html(tpl({
      hour: patchZero(this.get('hour')),
      minute: patchZero(this.get('minute')),
      second: patchZero(this.get('second')),
      display: this.get('display')
    })).show();

    this.$('[data-input]').each(function(i, input) {
      input = $(input);

      wheel(input[0], function(type, prevent) {
        prevent();

        if (type === 'up') {
          changeValue.call(self, input, self.get(input.data('input')) + 1);
        } else if (type === 'down') {
          changeValue.call(self, input, self.get(input.data('input')) - 1);
        }

        input.select();
      });

      input.hover(function() {
        this.select();
      }, function() {
        this.blur();
      });
    });

    return this;
  },

  output: function() {
    return patchZero(this.get('hour')) + ':' + patchZero(this.get('minute')) + ':' + patchZero(this.get('second'));
  },

  _change: function(hour, minute, second) {
    var flag = false;
    var h = this.get('hour');
    var m = this.get('minute');
    var s = this.get('second');

    if (h !== hour) {
      this.set('hour', hour);
      flag = true;
    }

    if (m !== minute) {
      this.set('minute', minute);
      flag = true;
    }

    if (s !== second) {
      this.set('second', second);
      flag = true;
    }

    if (flag) {
      this.trigger('change', hour, minute, second, h, m, s);
    }
  }

});
