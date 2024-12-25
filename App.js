import React,{useState,useEffect, use} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import logo from './logo.svg';
import './App.css';
import {FaListUl} from "react-icons/fa";
import {IoFilterSharp} from "react-icons/io5";
import {RiDeleteBin6Line} from "react-icons/ri";
import {FaCheckSquare} from "react-icons/fa";
import {MdEdit} from "react-icons/md";

function App() {
  const [currentFilter, setCurrentFilter] = useState('all'); // "all", "todo", "completed"
  const[allTodos,setTodos] = useState([]);
  const[newTitle,setNewTitle] = useState("");
  const[newDescription,setNewDescription] = useState("");
  const[completedTodos,setCompletedTodos] = useState([]);
  const[currentEdit,setCurrentEdit] = useState("");
  const[currentEditedItem,setCurrentEditedItem] = useState("");

  const handleAddTodo = ()=>{
    const newTodoItem = {
      title:newTitle,
      description:newDescription
    };

    const updatedToDoArr = [...allTodos];
    updatedToDoArr.push(newTodoItem);
    setTodos(updatedToDoArr);
    localStorage.setItem('todolist',JSON.stringify(updatedToDoArr));

    setNewTitle("");
    setNewDescription("");
  };

  const handleDeleteTodo = (index)=>{
    const updatedTodo = [...allTodos];
    updatedTodo.splice(index,1);

    localStorage.setItem('todolist',JSON.stringify(updatedTodo));
    setTodos(updatedTodo);
  };

  const handleComplete = (index)=>{
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();
    const s = now.getSeconds();
    const dd= now.getDate();
    const mm = now.getMonth() + 1;
    const yyyy = now.getFullYear();
    const completedOn = dd + "/" + mm + "/" + yyyy + "at" + h + ':'+ m + ':' + s ;

    const filteredItem = {
      ...allTodos[index],
      completedOn:completedOn
    };

    const updatedCompletedArr = [...completedTodos];
    updatedCompletedArr.push(filteredItem);
    setCompletedTodos(updatedCompletedArr);
    handleDeleteTodo(index);
    localStorage.setItem('completedTodos',JSON.stringify(updatedCompletedArr));
  };

  const handleDeleteCompletedTodo = (index)=>{
    const updatedTodo = [...allTodos];
    updatedTodo.splice(index,1);

    localStorage.setItem('completedTodos',JSON.stringify(updatedTodo));
    setCompletedTodos(updatedTodo);
  }

  useEffect(()=>{
    const savedTodo = JSON.parse(localStorage.getItem('todolist'));
    const savedCompletedTodo = JSON.parse(localStorage.getItem('completedTodos'))
    if(savedTodo){
      setTodos(savedTodo);
    }
    if(savedCompletedTodo){
      setCompletedTodos(savedCompletedTodo);
    }
  },[])

  const handleEdit= (ind,item)=>{
    setCurrentEdit(ind);
    setCurrentEditedItem(item);
  };

  const handleEditedTitle = (value)=> {
    setCurrentEditedItem((prev)=>{
      return {...prev,title:value};
    });
  };

  const handleEditedDescription = (value)=> {
    setCurrentEditedItem((prev)=>{
      return {...prev,description:value};
    });
  };

  const handleEditedTodo =()=> {
    const newToDo = [...allTodos];
    newToDo[currentEdit] = currentEditedItem;
    setTodos(newToDo);
    setCurrentEdit("");
    localStorage.setItem('todolist',JSON.stringify(newToDo));
  };

  return (
    <div className="App">
      <h1> <FaListUl className='checklist' title='Checklist' />    To-do List</h1>
      
      <div className='todo-wrapper'>
        <div className='todo-input'>
          <div className='todo-input-item'>
            <label>Title</label>
            <input type='text' value={newTitle} onChange={(e)=>setNewTitle(e.target.value)} placeholder='Add task title...' />
          </div>
          <div className='todo-input-item'>
            <label>Description</label>
            <input type='text' value={newDescription} onChange={(e)=>setNewDescription(e.target.value)} placeholder='Add task description...' />
          </div>
          <div className='todo-input-item'>
            <button type='button' onClick={handleAddTodo} className='primaryBtn'>
            ADD TASK</button>
          </div>
        </div>
      
        <div className='filter-btns'>
          <IoFilterSharp className='filter-icon' title='Filter tasks' />
          <button 
            className={`secondaryBtn ${currentFilter === 'all' && 'active'}`} 
            onClick={() => setCurrentFilter('all')}
          >
            All Tasks</button>
          <button 
            className={`secondaryBtn ${currentFilter === 'todo' && 'active'}`} 
            onClick={() => setCurrentFilter('todo')}
          >
            ToDo</button>
          <button 
            className={`secondaryBtn ${currentFilter === 'completed' && 'active'}`} 
            onClick={() => setCurrentFilter('completed')}
          >
            Completed</button>
        </div>
            <div className='todo-list'>
                {currentFilter === 'all' && [...allTodos, ...completedTodos].map((item, index) => {
                    return (
                      <div className={`todo-list-items ${item.completedOn ? 'completed' : ''}`} key={index}>
                          <div>
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                            {item.completedOn && <p><small>Task Completed On: {item.completedOn}</small></p>}
                            </div>
                            <div>
                              {!item.completedOn && (
                                <>
                                <MdEdit className='edit-icon' onClick={() => handleEdit(index, item)} title='Edit?' />
                                <FaCheckSquare className='check-icon' onClick={() => handleComplete(index)} title='Completed?' />
                                <RiDeleteBin6Line className='delete-icon' onClick={() => handleDeleteTodo(index)} title='Delete?' />
                                </>
                              )}
                              {item.completedOn && (
                                <>
                                <MdEdit className='edit-icon' onClick={() => handleEdit(index, item)} title='Edit?' />
                                <RiDeleteBin6Line className='delete-icon' onClick={() => handleDeleteCompletedTodo(index)} title='Delete?' />
                                </>
                              )}
                            </div>
                        </div>
                    );
                })}

                {currentFilter === 'todo' && allTodos.map((item, index) => {
                    if (currentEdit === index) {
                        return (
                            <div className='edit-wrapper' key={index}>
                                <input
                                    placeholder='Edited Title'
                                    onChange={(e) => handleEditedTitle(e.target.value)}
                                    value={currentEditedItem.title} />
                                <textarea
                                    placeholder='Edited Description'
                                    rows={4}
                                    onChange={(e) => handleEditedDescription(e.target.value)}
                                    value={currentEditedItem.description} />
                                <div className='todo-input-item'>
                                    <button type='button' onClick={handleEditedTodo} className='primaryBtn'>
                                        EDIT TASK </button>
                                </div>
                            </div>
                        );
                    } else {
                        return (
                            <div className='todo-list-items' key={index}>
                                <div>
                                    <h3>{item.title}</h3>
                                    <p>{item.description}</p>
                                </div>
                                <div>
                                    <MdEdit className='edit-icon' onClick={() => handleEdit(index, item)} title='Edit?' />
                                    <FaCheckSquare className='check-icon' onClick={() => handleComplete(index)} title='Completed?' />
                                    <RiDeleteBin6Line className='delete-icon' onClick={() => handleDeleteTodo(index)} title='Delete?' />
                                </div>
                            </div>
                        );
                    }
                })}

                {currentFilter === 'completed' && completedTodos.map((item, index) => {
                    return (
                        <div className='todo-list-items completed' key={index}>
                            <div>
                                <h3>{item.title}</h3>
                                <p>{item.description}</p>
                                <p><small>Task Completed On: {item.completedOn}</small></p>
                            </div>
                            <div>
                                <MdEdit className='edit-icon' onClick={() => handleEdit(index, item)} title='Edit?' />
                                <RiDeleteBin6Line className='delete-icon' onClick={() => handleDeleteCompletedTodo(index)} title='Delete?' />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    </div>
);
}

export default App;
