import React from 'react';
import './App.css'
import {io} from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';


class App extends React.Component {

  constructor() {
    super();

    this.state = {
      tasks: [],
      typedText: '',
    }
    this.id = 0
  }


  componentDidMount() {
    this.socket = io('localhost:8000', { transports: ["websocket"] });    
    this.socket.on('updateList', (task) => this.receiveTaskList(task));

  }

  addTask(event) {
    event.preventDefault();
    console.log();
    const obj = {id: uuidv4(), text: this.state.typedText}
    this.updateTaskList(obj);
    document.forms[0].reset();
  }

  removeTask(event) {
    event.preventDefault();
    const idToRemove = event.target.id;
    const tasks = this.state.tasks;
    const taskToRemove = tasks.filter(task => parseInt(task.id) === parseInt(idToRemove))[0]
    let newTasks = [];
    for(let task of tasks) {
      if(task !== taskToRemove) {
        newTasks.push(task)
      }
    }
    this.setState({tasks: newTasks}, () => {
      const tasks = this.state.tasks
      console.log(tasks)
      this.socket.emit('addTask', tasks)
    })

  }

  changeTypedText(event) {
    this.setState({
      typedText: event.target.value
    });
  }

  updateTaskList(obj) {
    this.setState({
      ...this.state,
      tasks: [...this.state.tasks, obj]
    }, () => {
      const tasks = this.state.tasks
      this.socket.emit('addTask', tasks)
    })
  }

  receiveTaskList(arr) {
    this.setState({tasks: arr})
  }


  render() {
    return (
      <div className="App">
    
        <header>
          <h1>ToDoList.app</h1>
        </header>
    
        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>
    
          <ul className="tasks-section__list" id="tasks-list">
            {this.state.tasks.map((task) => (
              <li className="task" key={task.id}>{task.text} <button className="btn btn--red" id={task.id} onClick={(event) => (this.removeTask(event))}>Remove</button></li>
            ))}
          </ul>
    
          <form id="add-task-form">
            <input className="text-input" autoComplete="off" type="text" placeholder="Type your description" id="task-name" onChange={(event) => (this.changeTypedText(event))}/>
            <button className="btn" type="submit" onClick={(event) => (this.addTask(event))}>Add</button>
          </form>
    
        </section>
      </div>
    );
  };

};

export default App;