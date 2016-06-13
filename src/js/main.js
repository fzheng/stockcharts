'use strict';

import React from "react";
import ReactDOM from "react-dom";
import BaseComponent from "./base";
import QueryForm from "./query_form";
import InteractiveChart from "./interactive_chart";
import $ from "jquery";

class Main extends BaseComponent {
  constructor (props) {
    super(props);
    this.state = {data: {}, symbol: ''};
    this._bind('handleQuerySubmit');
  }

  handleQuerySubmit (query) {
    this.setState({symbol: query.symbol});
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: query,
      success: function (data) {
        this.setState({data: data});
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  }

  render () {
    return (
      <div className="container">
        <div className="row">
          <QueryForm onQuerySubmit={this.handleQuerySubmit}/>
        </div>
        <div className="row">
          <InteractiveChart symbol={this.state.symbol} data={this.state.data}/>
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