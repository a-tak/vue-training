import React, { Component } from 'react';
//コンポーネントを読み込み
import Add from './Add';
import TodoList from './TodoList';
import '../styles/index.css';
 
class App extends Component {
  constructor(props) {
    super(props);
    // 関数のバインド
    this.addTodo = this.addTodo.bind(this);
    this.checkTodo = this.checkTodo.bind(this);	
    // stateの初期化
    this.state = {todos: []};
  }
 
  // TODO追加アクション
  addTodo(text) {
    const { todos } = this.state;
    this.setState(
      {
        todos: [...todos, { id: todos.length, text: text, isChecked: false }]
      }
    );
  }
 
  // TODOチェックアクション
  checkTodo(id) {
    const todos = [...this.state.todos];
    todos.forEach((todo) => {
      if (todo.id === id) {
        todo.isChecked = !todo.isChecked;
      }
    });
    this.setState(
      { todos: todos }
    );
  }
 
  render() {
    const { todos } = this.state;
    // AddコンポーネントとTodoListコンポーネントの配置
    return (
      <div className="App">
        <Add addTodo={this.addTodo} />
        <TodoList todos={todos} checkTodo={this.checkTodo} />
      </div>
    );
  }
}
 
export default App;