import React from "react";
import BaseComponent from "./base";
import StockChart from "./stock_chart";

class InteractiveChart extends BaseComponent {
  constructor (props) {
    super(props);
    this.state = {data: {}};
  }

  componentWillReceiveProps (nextProps) {
    this.setState({data: nextProps.data});
  }

  render () {
    return (
      <StockChart container="stockChart" type="stockChart" options={this.state.data}/>
    );
  }
}

module.exports = InteractiveChart;