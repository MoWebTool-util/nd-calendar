/**
 * User: caolvchong@gmail.com
 * Date: 8/21/13
 * Time: 10:39 AM
 */
'use strict';
var $ = require('jquery');
var datetime = require('nd-datetime');
var Widget = require('nd-widget');

var helper = {
  patchZero: function(n) {
    return n < 10 ? '0' + n : n;
  }
};

var defaultFormat = 'yyyy-MM';
var MonthPanel = Widget.extend({

  attrs: {
    className: 'ui-calendar-month',
    date: new Date(),
    months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    disabled: function( /*month*/ ) { // function, 返回false的则不可点击
      return false;
    }
  },

  events: {

    'click [data-role=set-month]': function(e) {
      // bugfix: 阻止触发 overlay 的 blur
      e.stopPropagation();

      var node = $(e.target);
      var prev = this.get('date');
      var now = datetime(node.attr('data-val'), defaultFormat).toDate();
      this.set('date', now);
      this.trigger('select', now, prev, node);
    },

    'click .month-disabled': function(e) {
      var node = $(e.target);
      var month = this.get('date');
      var val = datetime(node.attr('data-val'), defaultFormat).toDate();
      this.trigger('selectDisabled', val, month, node);
    }

  },

  prev: function() {
    var prev = this.get('date');
    var now = new Date(prev.getFullYear(), prev.getMonth() - 1, 1);
    this.set('date', now);
    this.trigger('select', now, prev);
    return this;
  },

  next: function() {
    var prev = this.get('date');
    var now = new Date(prev.getFullYear(), prev.getMonth() + 1, 1);
    this.set('date', now);
    this.trigger('select', now, prev);
    return this;
  },

  show: function() {
    var className = this.get('className');
    var date = this.get('date');
    var year = date.getFullYear();
    var month = date.getMonth();
    var list = this.get('months');
    var arr = [];
    var flag = 0;

    for (var i = 0; i < 4; i++) {
      var temp = ['<tr class="' + className + '-column">'];

      for (var j = flag, len = flag + 3; j < len; j++, flag++) {
        temp.push('<td ');

        if (this.get('disabled').call(this, new Date(year, flag, 1)) === true) {
          temp.push('class="month-disabled"');
        } else {
          temp.push('data-role="set-month"');
          if (flag === month) {
            temp.push(' class="month-curr"');
          }
        }

        temp.push(' data-val="' + (year + '-' + helper.patchZero(flag + 1)) + '"');
        temp.push('>', list[flag], '</td>');
      }

      temp.push('</tr>');
      arr[i] = temp.join('');
    }

    arr.unshift('<table data-role="month-panel">');
    arr.push('</table>');

    this.element.html(arr.join('')).show();

    return this;
  }
});

module.exports = MonthPanel;
