'use strict'

var $ = require('nd-jquery')
var chai = require('chai')
var expect = chai.expect

var Calendar = require('../index')
var datetime = require('nd-datetime')

function createCalendar(options) {
  var time = {
    hour: true,
    minit: true,
    second: true
  }
  var bar = {
    display: true
  }
  var view = 'date'
  var opts = $.extend({}, {
    trigger: '<input type="text" />',
    time: time,
    bar: bar,
    view: view
  }, options || {})
  console.log(111, opts)
  return new Calendar(opts)
}

describe('nd-calendar', function() {
  describe('show/hide', function() {
    var cal

    before(function() {
      cal = createCalendar().render()
    })

    after(function() {
      cal.destroy()
    })

    it('new Calendar', function() {
      expect(Calendar).to.be.a('function')
      expect(new Calendar()).to.be.an('object')
    })

    it('show', function() {
      $(cal).trigger('show')
      expect($('.ui-calendar').css('display')).to.equal('block')
    })

    it('default panel show', function() {
      $(cal).trigger('show')
      expect($('.ui-calendar-date').css('display')).to.equal('block')

      expect($('.ui-calendar-time').css('display')).to.equal('block')
      expect($('.ui-calendar-hour').css('display')).to.equal('block')
      expect($('.ui-calendar-minute').css('display')).to.equal('block')
      expect($('.ui-calendar-second').css('display')).to.equal('block')

      expect($('.ui-calendar-bar').css('display')).to.equal('block')
      expect($('.ui-calendar-bar-clear').css('display')).to.equal('inline-block')
      expect($('.ui-calendar-bar-ok').css('display')).to.equal('inline-block')
    })

    it('hide', function() {
      $(cal).trigger('hide')
      expect($('.ui-calendar').css('display')).to.equal('none')
    })
  })

  describe('year panel', function() {
    var cal
    before(function() {
      cal = createCalendar({view: 'year'}).render()
    })
    after(function() {
      cal && cal.destroy()
    })

    it('show year panel', function() {
      $(cal).trigger('show')
      //初始
      expect($('.ui-calendar-date').css('display')).to.equal('none')
      expect($('.ui-calendar-time').css('display')).to.equal('none')
      expect($('.ui-calendar-month').css('display')).to.equal('none')
      expect($('.ui-calendar-year').css('display')).to.equal('block')
    })
  })

  describe('month panel', function() {
    var cal
    before(function() {
      cal = createCalendar({view: 'month'}).render()
    })
    after(function() {
      cal && cal.destroy()
    })

    it('show month panel', function() {
      $(cal).trigger('show')
      //初始
      expect($('.ui-calendar-date').css('display')).to.equal('none')
      expect($('.ui-calendar-time').css('display')).to.equal('none')
      expect($('.ui-calendar-month').css('display')).to.equal('block')
      expect($('.ui-calendar-year').css('display')).to.equal('none')
    })
  })

  describe('date panel', function() {
    var cal
    before(function() {
      cal = createCalendar().render()
    })
    after(function() {
      cal && cal.destroy()
    })

    it('prev/next', function() {
      var date = cal.dates.get('date')
      var d = datetime(date).d()
      cal.dates.next()
      var nextD = datetime(cal.dates.get('date')).d()
      expect(nextD - 1).to.equal(d)
      cal.dates.prev()
      var prevD = datetime(cal.dates.get('date')).d()
      expect(prevD).to.equal(d)
    })
  })

  describe('set time', function() {
    var cal
    var currentYear = parseInt(new Date().getFullYear(), 10)
    var currentMonth = parseInt(new Date().getMonth(), 10)
    var showMonths = ['一月', '二月', '三月', '四月', '五月', '六月'
      , '七月', '八月', '九月', '十月', '十一月', '十二月']
    beforeEach(function() {
      cal = createCalendar().render()
      $(cal).trigger('show')
    })
    afterEach(function() {
      cal && cal.destroy()
    })

    /********year start********/
    it('select years', function() {
      expect($('.ui-calendar-control.year').text()).to.equal(currentYear.toString()) //默认为当前时间
      cal.years.trigger('select', new Date('2014-06-01 06:05:56'))
      expect($('.ui-calendar-control.year').text()).to.equal('2014')
    })

    it('select prev-year', function() {
      cal.$('[data-role="prev-year"]').click()
      expect($('.ui-calendar-control.year').text()).to.equal((currentYear - 1).toString())
    })

    it('select next-year', function() {
      cal.$('[data-role="next-year"]').click()
      expect($('.ui-calendar-control.year').text()).to.equal((currentYear + 1).toString())
    })

    it('click current-year', function() {
      expect($('.ui-calendar-year').css('display')).to.equal('none')

      cal.$('[data-role="current-year"]').click()

      expect($('.ui-calendar-year').css('display')).to.equal('block')
      expect($('.ui-calendar-year').find('.year-curr').text()).to.equal(currentYear.toString())
    })

    it('click get-prev-page', function() {
      cal.$('[data-role="current-year"]').click()
      cal.$('[data-role="get-prev-page"]').click()
      expect($('.ui-calendar-year').find('.year-curr').text()).to.equal((currentYear-10).toString())
    })

    it('click get-next-page', function() {
      cal.$('[data-role="current-year"]').click()
      cal.$('[data-role="get-next-page"]').click()
      expect($('.ui-calendar-year').find('.year-curr').text()).to.equal((currentYear+10).toString())
    })

    it('click set-year', function() {
      cal.$('[data-role="current-year"]').click()
      expect($('.ui-calendar-date').css('display')).to.equal('none')
      expect($('.ui-calendar-year').find('.year-curr').text()).to.equal(currentYear.toString())

      var lastYear = currentYear - 1
      var lastYearStr = '[data-val="' + lastYear.toString() + '"]'
      cal.$('.ui-calendar-year').find(lastYearStr).click()
      expect($('.ui-calendar-control.year').text()).to.equal(lastYear.toString())
      expect($('.ui-calendar-date').css('display')).to.equal('block')
      expect($('.ui-calendar-year').css('display')).to.equal('none')
    })

    // it('click year-disabled', function() {
    //   cal.$('[data-role="current-year"]').click()
    //   expect($('.ui-calendar-date').css('display')).to.equal('none')
    //   expect($('.ui-calendar-year').find('.year-curr').text()).to.equal(currentYear.toString())
    //
    //   cal.$('[data-role="get-prev-page"]').click()
    //   cal.$('[data-role="get-prev-page"]').click()
    //   cal.$('.year-disabled').click()
    // })
    /********year end********/

    /**********month end******/
    it('select months', function() {
      $(cal).trigger('show')
      cal.months.trigger('select', new Date('2015-05-01 06:05:56'))
      expect($('.ui-calendar-control.year').text()).to.equal('2015')
      expect($('.ui-calendar-control.month').text()).to.equal('五月')
    })

    it('click current-month', function() {
      expect($('.ui-calendar-month').css('display')).to.equal('none')
      cal.$('[data-role="current-month"]').click()
      expect($('.ui-calendar-month').css('display')).to.equal('block')
      expect($('.ui-calendar-month').find('.month-curr').text()).to.equal(showMonths[currentMonth])
      expect($('.ui-calendar-panel .month').text()).to.equal(showMonths[currentMonth])
    })

    it('click prev-month', function() {
      cal.$('[data-role="current-month"]').click()
      cal.$('[data-role="prev-month"]').click()

      var index = currentMonth - 1
      if (index < 0) {
        index = 11
      }
      expect($('.ui-calendar-month').find('.month-curr').text()).to.equal(showMonths[index])
      expect($('.ui-calendar-panel .month').text()).to.equal(showMonths[index])
    })

    it('click next-month', function() {
      cal.$('[data-role="current-month"]').click()
      cal.$('[data-role="next-month"]').click()

      var index = currentMonth + 1
      if (index > 11) {
        index = 0
      }
      expect($('.ui-calendar-month').find('.month-curr').text()).to.equal(showMonths[index])
      expect($('.ui-calendar-panel .month').text()).to.equal(showMonths[index])
    })

    it('click set-month', function() {
      cal.$('[data-role="current-month"]').click()
      expect($('.ui-calendar-date').css('display')).to.equal('none')

      cal.$('.ui-calendar-month .month-curr').click()
      expect($('.ui-calendar-panel .month').text()).to.equal(showMonths[currentMonth])
      expect($('.ui-calendar-date').css('display')).to.equal('block')
      expect($('.ui-calendar-month').css('display')).to.equal('none')
    })
    /**********month end******/

    it('click clear', function() {
      expect($('.ui-calendar').css('display')).to.equal('block')
      cal.$('[data-role="btn-clear"]').click()
      expect($('.ui-calendar').css('display')).to.equal('none')
    })

    it('click ok', function() {
      expect($('.ui-calendar').css('display')).to.equal('block')
      cal.$('[data-role="btn-ok"]').click()
      expect($('.ui-calendar').css('display')).to.equal('none')
    })

    it('change time', function() {
      cal.$('[data-input="hour"]').attr('value', '20')
      cal.$('[data-input="hour"]').blur()
      cal.$('[data-input="minute"]').attr('value', '09')
      cal.$('[data-input="minute"]').blur()
      cal.$('[data-input="second"]').attr('value', '58')
      cal.$('[data-input="second"]').blur()

      expect(cal.get('date').getHours()).to.equal(20)
      expect(cal.get('date').getMinutes()).to.equal(9)
      expect(cal.get('date').getSeconds()).to.equal(58)
    })

    it('set date', function() {
      var curMonth = datetime().format('yyyy-MM')
      var oneDay = curMonth + '-15'
      cal.$('[data-val="' + oneDay + '"]').click()
      expect(cal.$('.curr-month.curr-date')[0].innerHTML).to.equal('15')
    })

    it('click date-disabled', function() {
      var curMonth = datetime().format('yyyy-MM')
      var oneDay = curMonth + '-15'
      var prevDay = curMonth + '-14'
      var nextDay = curMonth + '-16'
      var anotherCal = createCalendar({
        isDisabled: {
          date: function(date) {
            return date < datetime(oneDay).toNumber()
          }
        }
      }).render()
      $(anotherCal).trigger('show')
      if (new Date().getDay() < 15) {
        expect(anotherCal.$('.curr-month.curr-date')[0]).to.equal(undefined)
        anotherCal.$('[data-val="' + datetime().format('yyyy-MM-dd') + '"]').click()
        expect(anotherCal.$('.curr-month.curr-date')[0]).to.equal(undefined)
      } else {
        anotherCal.$('[data-val="' + prevDay + '"]').click()
        expect(anotherCal.$('.curr-month.curr-date')[0].innerHTML).to.equal(datetime().d().toString())
        anotherCal.$('[data-val="' + nextDay + '"]').click()
        expect(anotherCal.$('.curr-month.curr-date')[0].innerHTML).to.equal('16')
      }
    })
  })

  describe('as a plugin', function() {
    var plugin = Calendar.pluginEntry
    it('plugin', function() {
      expect(plugin.name).to.equal('Calendar')
      expect(typeof plugin.starter).to.equal('function')
    })
  })
})
