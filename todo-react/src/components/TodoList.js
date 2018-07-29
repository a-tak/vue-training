import React from 'react';
// コンポーネントを読み込み
import Todo from './Todo';
import '../styles/todoList.css';
 
const TodoList = (props) => {
  // 親コンポーネントから値を受け取る
  const { todos, checkTodo } = props;
  const list = [];
  // TODOデータの数だけリストを作成
  todos.forEach((todo, index) =>
    list.push(<Todo key={index} todo={todo} checkTodo={checkTodo} />
  ));
  return (
    <ul className="todoList">
      {list}
    </ul>
  );
}
 
// コンポーネントをエクスポート
export default TodoList;