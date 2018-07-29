import React from 'react';
import TestUtils from 'react-dom/test-utils';
import Todo from '../components/Todo';
 
// コンポーネントの出力
function setup(propOverrides) {
  const props = Object.assign({
    todo: {
      id: 1,
      text: 'テストTODO',
      isChecked: false,
    }
  }, propOverrides);
 
  const renderer = TestUtils.createRenderer();
  renderer.render(<Todo {...props} />);
  const output = renderer.getRenderOutput();
  return {
    props: props,
    output: output,
  };
}
 
describe('should have li', () => {
  //コンポーネントの出力テスト
  it('draw component', () => {
    // コンポーネントの出力
    const { output } = setup();
    // liタグの存在チェック
    expect(output.type).toEqual('li');
  });
 
  //コンポーネント内テキストの出力テスト
  it('should contain prop text', () => {
    // コンポーネントに渡すpropの定義
    const prop = {
      todo: {
        id: 2,
        text: 'Reactの学習',
        isChecked: false,
      },
      checkTodo: jest.fn(),
    }
    // コンポーネントの出力
    const { output } = setup(prop);
    const itemText = output.props.children;
    // コンポーネントに出力されたテキストのチェック
    expect(itemText).toEqual('Reactの学習');
  });
 
// コンポーネントのcheck関数呼び出しテスト
  it('should be call checkTodo method by click event', () => {
    // ダミーの関数定義
    const checkTodo = jest.fn();
    const prop = {
      checkTodo: checkTodo,
    }
    // コンポーネントの出力
    const { output } = setup(prop);
    // コンポーネントにセットされたダミー関数の起動
    output.props.onClick();
    // 関数の呼び出し回数のチェック
    expect(checkTodo.mock.calls.length).toEqual(1);
  });
});