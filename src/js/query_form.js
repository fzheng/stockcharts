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
    let symbol = this.state.symbol.trim();
    if (!symbol) {
      return;
    }
    symbol = symbol.toUpperCase();
    const duration = parseInt(this.state.duration);
    const query = {symbol: symbol};
    if (duration > 0) {
      query.duration = duration;
    }
    this.props.onQuerySubmit(query);
  }

  render () {
    return (
      <form className="queryForm form-inline" onSubmit={this.handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            placeholder="Symbol"
            value={this.state.symbol}
            style={{textTransform: "uppercase"}}
            onChange={this.handleSymbolChange}
          />
        </div>
        <div className="form-group">
          <input
            type="number"
            className="form-control"
            placeholder="Days"
            value={this.state.duration}
            style={{display: "none"}}
            onChange={this.handleDurationChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">Query</button>
      </form>
    );
  }
}

module.exports = QueryForm;
