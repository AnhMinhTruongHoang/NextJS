import React, { useState } from "react";

interface IProps {
  name: string;
  age: number;
  infor: {
    g: string;
    addr: string;
  };
  abc?: string; // optional
  handleTest: (value: string) => void;
  listTodo: string[];
  setListTodo: (v: string[]) => void;
}

const Todo = (props: IProps) => {
  const { age, name, infor, listTodo, setListTodo, handleTest } = props;
  const [todo, setTodo] = useState("");

  const hanldeClick = () => {
    if (!todo) {
      alert("empty");
      return;
    } else {
      setListTodo([...listTodo, todo]);
      setTodo("");
    }
  };
  return (
    <>
      <div>
        <label htmlFor="demo">Input value</label>
        <input
          type="text"
          id="demo"
          name="demo"
          value={todo} // Add value prop to link input to state
          onChange={(event) => {
            setTodo(event.target.value);
          }}
        />

        <p>
          Hello, {name} , {age}.,
        </p>
      </div>
      <button
        onClick={() => {
          hanldeClick();
        }}
      >
        Save
      </button>
      <br />
    </>
  );
};

export default Todo;
