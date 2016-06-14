'use strict';

import $ from "jquery";
import React from "react";
import ReactDOM from "react-dom";
import BaseComponent from "./base";
import QueryForm from "./query_form";
import QueryResult from "./query_result";


class Main extends BaseComponent {
  constructor (props) {
    super(props);
    this.state = {data: {}, symbol: ''};
    this._bind('handleQuerySubmit', 'updateChart');
  }

  handleQuerySubmit (query) {
    this.setState({symbol: query.symbol});
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: query,
      success: function (data) {
        this.updateChart(query.symbol, data);
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  }

  updateChart (symbol, data) {
    function _fixDate (dateIn) {
      const dat = new Date(dateIn);
      return Date.UTC(dat.getFullYear(), dat.getMonth(), dat.getDate());
    }

    function _getOHLC (json) {
      const dates = json.Dates || [];
      const elements = json.Elements || [];
      const chartSeries = [];

      if (elements[0]) {
        for (let i = 0, datLen = dates.length; i < datLen; i++) {
          const dat = _fixDate(dates[i]);
          const pointData = [
            dat,
            elements[0].DataSeries['open'].values[i],
            elements[0].DataSeries['high'].values[i],
            elements[0].DataSeries['low'].values[i],
            elements[0].DataSeries['close'].values[i]
          ];
          chartSeries.push(pointData);
        }
      }
      return chartSeries;
    }

    function _getVolume (json) {
      const dates = json.Dates || [];
      const elements = json.Elements || [];
      const chartSeries = [];

      if (elements[1]) {
        for (let i = 0, datLen = dates.length; i < datLen; i++) {
          const dat = _fixDate(dates[i]);
          const pointData = [
            dat,
            elements[1].DataSeries['volume'].values[i]
          ];
          chartSeries.push(pointData);
        }
      }
      return chartSeries;
    }

    // split the data set into ohlc and volume
    const ohlc = _getOHLC(data);
    const volume = _getVolume(data);

    // set the allowed units for data grouping
    const groupingUnits = [
      ['week', [1]],
      ['month', [1, 2, 3, 4, 6]]
    ];

    this.setState({
      data: {
        rangeSelector: {
          selected: 1
          //enabled: false
        },
        title: {
          text: symbol + ' Historical Price'
        },
        yAxis: [
          {
            title: {
              text: 'OHLC'
            },
            height: 200,
            lineWidth: 2
          },
          {
            title: {
              text: 'Volume'
            },
            top: 300,
            height: 100,
            offset: 0,
            lineWidth: 2
          }
        ],
        series: [
          {
            type: 'candlestick',
            name: symbol,
            data: ohlc,
            color: 'red',
            upColor: 'green',
            dataGrouping: {
              units: groupingUnits
            }
          },
          {
            type: 'column',
            name: 'Volume',
            data: volume,
            yAxis: 1,
            dataGrouping: {
              units: groupingUnits
            }
          }
        ],
        credits: {
          enabled: false
        }
      }
    });
  }

  render () {
    return (
      <div className="container">
        <div className="row">
          <QueryForm onQuerySubmit={this.handleQuerySubmit}/>
        </div>
        <div className="row">
          <QueryResult symbol={this.state.symbol} data={this.state.data}/>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Main url="/history"/>,
  document.getElementById('main')
);

module.exports = Main;