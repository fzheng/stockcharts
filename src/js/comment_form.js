'use strict';

import React from "react";
import BaseComponent from "./base";

class CommentForm extends BaseComponent {
  constructor (props) {
    super(props);
    this.state = {author: '', text: ''};
    this._bind('handleAuthorChange', 'handleTextChange', 'handleSubmit');
  }

  handleAuthorChange (e) {
    this.setState({author: e.target.value});
  }

  handleTextChange (e) {
    this.setState({text: e.target.value});
  }

  handleSubmit (e) {
    e.preventDefault();
    const author = this.state.author.trim();
    const text = this.state.text.trim();
    if (!text || !author) {
      return;
    }
    this.props.onCommentSubmit({author: author, text: text});
    this.setState({author: '', text: ''});
  }

  render () {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input
          type="text"
          placeholder="Your name"
          value={this.state.author}
          onChange={this.handleAuthorChange}
          />
        <input
          type="text"
          placeholder="Say something..."
          value={this.state.text}
          onChange={this.handleTextChange}
          />
        <input type="submit" value="Post"/>
      </form>
    );
  }
}

module.exports = CommentForm;
