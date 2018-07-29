import React, { Component } from 'react';
import '../styles/add.css';
 
class Add extends Component {
  render() {
    const { addTodo } = this.props;
    return (
      <div className="add">
        <h2 className="title">TODOサンプルアプリケーション</h2>
        <input
          type="text"
          className="inputBox"
          placeholder="TODOを入力"
          ref={(ref) => this.inputBox = ref}
        />
        <input
          type="button"
          className="addBtn"
          value="登録"
          onClick={() => {
            addTodo(this.inputBox.value);
            this.inputBox.value = '';
          }}
        />
      </div>
    );
  }
}
 
export default Add;