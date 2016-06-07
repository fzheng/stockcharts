'use strict';

import React from "react";
import BaseComponent from "./base";

class QueryForm extends BaseComponent {
  constructor (props) {
    super(props);
    this.state = {symbol: '', duration: ''};
    this._bind('handleSymbolChange', 'handleDurationChange', 'handleSubmit');
  }

  handleSymbolChange (e) {
    this.setState({symbol: e.target.value});
  }

  handleDurationChange (e) {
    this.setState({duration: e.target.value});
  }

  handleSubmit (e) {
    e.preventDefault();
    const symbol = this.state.symbol.trim();
    if (!symbol) {
      return;
    }
    const duration = parseInt(this.state.duration.trim());
    const query = {symbol: symbol};
    if (duration > 0) {
      query.duration = duration;
    }
    this.props.onQuerySubmit(query);
    this.setState({symbol: '', duration: ''});
  }

  render () {
    return (
      <form className="queryForm" onSubmit={this.handleSubmit}>
        <input
          type="text"
          placeholder="Symbol"
          value={this.state.symbol}
          onChange={this.handleSymbolChange}
          />
        <input
          type="number"
          placeholder="Number of Days"
          value={this.state.duration}
          onChange={this.handleDurationChange}
          />
        <input type="submit" value="Post"/>
      </form>
    );
  }
}

module.exports = QueryForm;
