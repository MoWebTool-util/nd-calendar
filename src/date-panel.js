/**
 * @module Calendar
 * @author lzhengms <lzhengms@gmail.com> - 2015-03-11 13:21:43
 * @todo use handlebars
 */

'use strict';

var $ = require('jquery');
var datetime = require('nd-datetime');
var Widget = require('nd-widget');

var defaultFormat = 'yyyy-MM-dd';

function getMonthDayCount(month, d) {
  var ds = 31;

  if (month === 1) {
    ds = datetime(d).isLeap() ? 29 : 28;
  } else if (month === 3 || month === 5 || month === 8 || month === 10) {
    ds = 30;
  }

  return ds;
}

module.exports = Widget.extend({

  attrs: {
    className: 'ui-calendar-date',
    date: new Date(),
    week: ['一', '二', '三', '四', '五', '六', '日'],
    weekStart: 1, // 一周的起始，默认星期天
    showWeek: false, // 是否显示星期
    format: defaultFormat, // 默认返回格式
    isDisabled: function( /*date*/ ) { // function, 返回false的则不可点击
      return false;
    }
  },

  events: {

    'click [data-role=set-date]': function(e) {
      // bugfix: 阻止触发 overlay 的 blur
      e.stopPropagation();

      var node = $(e.target);
      var prev = datetime(this.get('date'), this.get('format')).format();
      var date = node.attr('data-val');
      this.set('date', datetime(date, this.get('format')).toDate());
      this.trigger('select', date, prev, node);
    },

    'click .date-disabled': function(e) {
      var node = $(e.target);
      var date = datetime(this.get('date'), this.get('format')).format();
      var val = node.attr('data-val');
      this.trigger('selectDisabled', val, date, node);
    }
  },

  prev: function() {
    var prev = this.get('date');
    var date = datetime(this.get('date')).add('d', -1).toDate();
    this.set('date', date);
    this.trigger('select', date, prev);
    return this;
  },

  next: function() {
    var prev = this.get('date');
    var date = datetime(this.get('date')).add('d', 1).toDate();
    this.set('date', date);
    this.trigger('select', date, prev);
    return this;
  },

  show: function() {
    var className = this.get('className');
    var date = this.get('date');
    var week = this.get('week');
    var month = date.getMonth();
    var curr = date.getDate();
    var html = [];
    var weekdayArray = [];
    var weekArr = [];
    var i;

    for (i = 0; i < 7; i++) {
      var t = this.get('weekStart') + i - 1;
      t = t >= 7 ? t - 7 : t;
      weekArr[i] = t;
      weekdayArray[i] = week[t];
    }

    html.push('<tr class="' + className + '-column">');

    if (this.get('showWeek')) {
      html.push('<th></th>');
    }

    for (i = 0; i < 7; i++) {
      html.push('<th class="' + className + '-' + weekArr[i] + '">' + weekdayArray[i] + '</th>');
    }

    html.push('</tr>');

    var firstDay = new Date(date.getFullYear(), month, 1);
    var firstDayWeek = firstDay.getDay();
    var index = $.inArray(firstDayWeek, weekArr);
    index = index === 0 ? 7 : index;
    var startDay = datetime(firstDay.getTime()).add('d', -index + 1).toNumber();
    var lastDay = datetime(firstDay.getTime()).add('d', getMonthDayCount(month, date) - 1).toDate();
    var lastDayWeek = lastDay.getDay();
    index = $.inArray(lastDayWeek, weekArr);
    var endDay = datetime(lastDay.getTime()).add('d', 7 - index).toDate();

    var arr = [];
    var weekCount = ((endDay - startDay) / (3600 * 24 * 1000) + 1) / 7;

    for (i = 0; i < weekCount; i++) {
      var temp = ['<tr class="' + className + '-panel">'];

      for (var j = 0; j < 7; j++) {
        var d = datetime(startDay).add('d', i * 7 + j); // 日期对象
        var m = d.M() - 1; // 月份
        var s = d.format(this.get('format')); // 日期字符串
        var n = d.d(); // 日期

        temp.push('<td data-val="' + s + '" ');

        if (this.get('isDisabled').call(this, d.toDate()) === true) {
          temp.push('class="date-disabled ');
          temp.push(m === month ? 'curr-month' : m < month ? 'prev-month' : 'next-month');
        } else {
          temp.push('data-role="set-date"');
          temp.push(' class="');

          if (m === month && n === curr) {
            temp.push('curr-date ');
          }

          temp.push(m === month ? 'curr-month' : m < month ? 'prev-month' : 'next-month');
        }

        temp.push('">' + n + '</td>');
      }

      temp.push('</tr>');

      arr[i] = temp.join('');
    }

    arr.unshift(html.join(''));
    arr.unshift('<table data-role="date-panel">');
    arr.push('</table>');

    this.element.html(arr.join('')).show();

    return this;
  }

});
