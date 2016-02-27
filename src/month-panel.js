/**
 * @module Calendar
 * @author lzhengms <lzhengms@gmail.com> - 2015-03-11 13:21:43
 * @todo use handlebars
 */

'use strict';

var $ = require('nd-jquery');
var __ = require('nd-i18n');
var datetime = require('nd-datetime');
var Widget = require('nd-widget');

function patchZero(n) {
  return n < 10 ? '0' + n : n;
}

var defaultFormat = 'yyyy-MM';

module.exports = Widget.extend({

  attrs: {
    className: 'ui-calendar-month',
    date: new Date(),
    months: [__('一月'), __('二月'), __('三月'), __('四月'), __('五月'), __('六月'), __('七月'), __('八月'), __('九月'), __('十月'), __('十一月'), __('十二月')],
    isDisabled: function( /*month*/ ) { // function, 返回false的则不可点击
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

        if (this.get('isDisabled').call(this, new Date(year, flag, 1)) === true) {
          temp.push('class="month-disabled"');
        } else {
          temp.push('data-role="set-month"');
          if (flag === month) {
            temp.push(' class="month-curr"');
          }
        }

        temp.push(' data-val="' + (year + '-' + patchZero(flag + 1)) + '"');
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
