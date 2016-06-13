import React from "react";
import BaseComponent from "./base";
import Highcharts from "highcharts/highstock";

class StockChart extends BaseComponent {
  constructor (props) {
    super(props);
    this._bind('renderChart');
  }

  componentWillReceiveProps (nextProps) {
    this.props = nextProps;
    this.renderChart(this.props);
  }

  componentWillUnmount () {
    this.chart.destroy();
  }

  renderChart (props) {
    if (props.modules) {
      props.modules.forEach(function (module) {
        module(Highcharts);
      });
    }
    this.chart = new Highcharts[props.type || "Chart"](
      props.container,
      props.options
    );
  }

  render () {
    return (
      <div id={this.props.container}></div>
    );
  }
}

module.exports = StockChart;