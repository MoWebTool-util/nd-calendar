/**
 * @module Calendar
 * @author lzhengms <lzhengms@gmail.com> - 2015-03-11 13:21:43
 * @todo use handlebars
 */

'use strict';

var $ = require('jquery');
var Widget = require('nd-widget');

function getYearsFirstDate(year) {
  return new Date(+year, 0, 1);
}

module.exports = Widget.extend({

  attrs: {
    className: 'ui-calendar-year',
    date: new Date(),
    n: 10, // 每页显示的年数个数
    m: 3, // 每行默认显示的个数
    isDisabled: function( /*year*/ ) { // function, 返回false的则不可点击
      return false;
    },
    prevPlaceholder: '. . .',
    nextPlaceholder: '. . .'
  },

  events: {
    'click [data-role=set-year]': function(e) {
      // bugfix: 阻止触发 overlay 的 blur
      e.stopPropagation();

      var node = $(e.target);
      var prev = this.get('date');
      var now = getYearsFirstDate(node.attr('data-val'));
      this.set('date', now);
      this.trigger('select', now, prev, node);
    },
    'click .year-disabled': function(e) {
      // bugfix: 阻止触发 overlay 的 blur
      e.stopPropagation();

      var node = $(e.target);
      var year = this.get('date');
      var val = getYearsFirstDate(node.attr('data-val'));
      this.trigger('selectDisabled', val, year, node);
    },
    'click [data-role=get-prev-page]': function(e) {
      // bugfix: 阻止触发 overlay 的 blur
      e.stopPropagation();

      var prev = this.get('date');
      var now = getYearsFirstDate(prev.getFullYear() - this.get('n'));
      this.set('date', now);
      this.show();
      this.trigger('select', now, prev);
    },
    'click [data-role=get-next-page]': function(e) {
      // bugfix: 阻止触发 overlay 的 blur
      e.stopPropagation();

      var prev = this.get('date');
      var now = getYearsFirstDate(prev.getFullYear() + this.get('n'));
      this.set('date', now);
      this.show();
      this.trigger('select', now, prev);
    }
  },

  prev: function() {
    var prev = this.get('date');
    var now = getYearsFirstDate(prev.getFullYear() - 1);
    this.set('date', now);
    this.trigger('select', now, prev);
    return this;
  },

  next: function() {
    var prev = this.get('date');
    var now = getYearsFirstDate(prev.getFullYear() + 1);
    this.set('date', now);
    this.trigger('select', now, prev);
    return this;
  },

  show: function() {
    var className = this.get('className');
    var year = this.get('date').getFullYear();

    var n = this.get('n');
    var m = this.get('m');
    var row = Math.ceil((n + 2) / m);
    var start = year - year % n;
    var list = [];

    for (var i = 0; i < n; i++) {
      list[i] = {
        role: 'set-year',
        value: start + i,
        disabled: this.get('isDisabled').call(this, getYearsFirstDate(start + i))
      };
    }

    list.unshift({
      role: 'get-prev-page',
      value: this.get('prevPlaceholder')
    });

    list.push({
      role: 'get-next-page',
      value: this.get('nextPlaceholder')
    });

    var arr = [];
    var flag = 0;

    for (i = 0; i < row; i++) {
      var temp = ['<tr class="' + className + '-column">'];
      for (var j = flag, len = Math.min(flag + m, list.length); j < len; j++, flag++) {
        var item = list[flag];
        temp.push('<td ');
        if (item.disabled === true) {
          temp.push('class="year-disabled"');
        } else {
          temp.push('data-role="' + item.role + '"');
          if (item.value === year) {
            temp.push(' class="year-curr"');
          }
        }
        temp.push(' data-val="' + item.value + '"');
        temp.push('>', item.value, '</td>');
      }
      temp.push('</tr>');
      arr[i] = temp.join('');
    }
    arr.unshift('<table data-role="year-panel">');
    arr.push('</table>');

    this.element.html(arr.join('')).show();
    return this;
  }
});
