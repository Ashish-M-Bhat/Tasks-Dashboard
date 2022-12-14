import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTasks } from "../../Store/TasksStore";

// Function to change the Task status
// Get the task to be changed, update the allTasks[] and overwrite the localStorage

const ChangeTaskStatus = (props) => {
  const dispatcher = useDispatch();

  // Get all the tasks (filtered)
  let allTasks = useSelector(state => state.tasks.allTasks);

  // When tasks are updated, the allTasks[] gets duplicate values, with the latest values being at the last
  // This is a bug, the localStoage doesn't have those duplicate values and on refresh, the duplicated values aren't present in the state anymore
  // Cannot use Set since values of the allTasks[] are objects
  // Hence add them to a map with key =>value as id=>taskObject and then get the unique values

  const tasksMap = new Map();

  allTasks.forEach(eachTaskObject => tasksMap.set(eachTaskObject.id, eachTaskObject));

  allTasks=[];

  for(let value of tasksMap.values())
    allTasks.push(value);

  useEffect(() => {
    // get taskToBeUpdated object
    let [taskToBeUpdated] = allTasks.filter(eachTask => eachTask.id === props.id);

    // Check if task is completed. If yes, prompt for a comment, not longer than MAX_COMMENT_LENGTH letters
    let commentTobeAdded='';
    const MAX_COMMENT_LENGTH = 30;

    if(props.updatedStatus === 'completed')
      commentTobeAdded = window.prompt('Enter Comments if any') || '';

      // If any comments, display add them
    if(commentTobeAdded!==''){
      while(commentTobeAdded.length > MAX_COMMENT_LENGTH){
          alert(`Oops, Max Length Allowed is ${MAX_COMMENT_LENGTH} letters`);
          commentTobeAdded = window.prompt('Enter Comments if any') || '';
      }
      // Update the Task Object
      taskToBeUpdated = {...taskToBeUpdated, comment:commentTobeAdded};
    }


      // Remove the task
      let updatedTasks = allTasks.filter(eachTask => eachTask.id !== props.id);

      // Push it back
      updatedTasks.push({...taskToBeUpdated, status: props.updatedStatus});

      // Overwrite the localStorage with the new Array and update the redux store
      localStorage.setItem('allTasks', JSON.stringify(updatedTasks));
      dispatcher(getTasks());

    // Go back to the calling component
    props.setUpdateTaskStatus(false);

  }, []);

  return ;
};

export default ChangeTaskStatus;