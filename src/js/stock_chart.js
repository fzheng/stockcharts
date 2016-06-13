import React from "react";
import BaseComponent from "./base";
import Highcharts from "highcharts/highstock";

class StockChart extends BaseComponent {
  constructor (props) {
    super(props);
    this._bind('componentDidMount', 'componentWillUnmount');
  }

  componentDidMount () {
    if (this.props.modules) {
      this.props.modules.forEach(function (module) {
        module(Highcharts);
      });
    }
    this.chart = new Highcharts[this.props.type || "Chart"](this.props.container, this.props.options);
  }

  componentWillUnmount () {
    this.chart.destroy();
  }

  render () {
    return (
      <div id={this.props.container}></div>
    );
  }
}

module.exports = StockChart;