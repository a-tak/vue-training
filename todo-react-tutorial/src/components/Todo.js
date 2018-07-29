import React from 'react';
import '../styles/todo.css';
 
// コンポーネントを宣言
const Todo = (props) => {
  // 親コンポーネントから値を受け取る
  const { todo, checkTodo } = props;
  // チェック済みのTODOか判定
  if (todo.isChecked) {
    return (
      <li className="checked" onClick={() => checkTodo(todo.id)}>{todo.text}</li>
    )
  } else {
    return (
      <li onClick={() => checkTodo(todo.id)}>{todo.text}</li>
    )
  }
};
// コンポーネントをエクスポート
export default Todo;
