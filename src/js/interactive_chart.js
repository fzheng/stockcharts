import React from "react";
import BaseComponent from "./base";
import StockChart from "./stock_chart";

class InteractiveChart extends BaseComponent {
  constructor (props) {
    super(props);
    this.state = {symbol: '', data: {}};
  }

  componentWillReceiveProps (nextProps) {
    this.setState({symbol: nextProps.symbol, data: nextProps.data});
  }

  render () {
    const data = this.props.data;
    const symbol = this.props.symbol;

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

    const chartNode = React.createElement(StockChart, {
      container: 'stockChart',
      type: 'stockChart',
      options: {
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

    return (
      <div className="interactiveChart">
        {chartNode}
      </div>
    );
  }
}

module.exports = InteractiveChart;