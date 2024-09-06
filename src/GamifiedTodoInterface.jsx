import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Progress } from './components/ui/progress';
import { Sword, Shield, Wand, Crown, Lock, CheckCircle, Clock } from 'lucide-react';

const levels = [
  { name: "Novice", icon: Shield, threshold: 0, achievement: "You've taken your first steps on an epic journey!" },
  { name: "Apprentice", icon: Sword, threshold: 1000, achievement: "You can now challenge the training dummy!" },
  { name: "Adept", icon: Wand, threshold: 3000, achievement: "Magic flows through you. Cast your first spell!" },
  { name: "Expert", icon: Crown, threshold: 6000, achievement: "Lead a small party into the enchanted forest!" },
  { name: "Master", icon: Sword, threshold: 10000, achievement: "You're ready to face the dragon in the mountain!" },
  { name: "Grandmaster", icon: Crown, threshold: 15000, achievement: "The kingdom is yours to rule!" },
];

const initialTasks = [
  {
    id: 1,
    title: "Create Keyword System",
    description: "Master the art of keyword creation and management.",
    subtasks: [
      { id: 1.1, title: "Forge the Keyword Input Field", completed: false, startTime: null, points: 0 },
      { id: 1.2, title: "Enchant the 'Add Keyword' Button", completed: false, startTime: null, points: 0 },
      { id: 1.3, title: "Cast the Keyword Existence Spell", completed: false, startTime: null, points: 0 },
      { id: 1.4, title: "Summon New Keywords to the List", completed: false, startTime: null, points: 0 },
      { id: 1.5, title: "Craft the Keyword Removal Charm", completed: false, startTime: null, points: 0 },
    ]
  },
  {
    id: 2,
    title: "Dashboard Mastery",
    description: "Expand your influence to the mighty Dashboard realm.",
    subtasks: [
      { id: 2.1, title: "Conjure the External Keyword Field", completed: false, startTime: null, points: 0 },
      { id: 2.2, title: "Bind External Links with Ancient Magic", completed: false, startTime: null, points: 0 },
      { id: 2.3, title: "Scribe Success and Failure Runes", completed: false, startTime: null, points: 0 },
    ]
  },
  // ... other tasks ...
];

const App = () => {
  const [completedTasks, setCompletedTasks] = useState(0);
  const [currentTask, setCurrentTask] = useState(0);
  const [showAchievement, setShowAchievement] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [tasks, setTasks] = useState(initialTasks); // Using the tasks array defined earlier
  const totalTasks = tasks.reduce((acc, task) => acc + task.subtasks.length, 0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTasks(prevTasks => {
        return prevTasks.map((task, index) => {
          if (index === currentTask) {
            return {
              ...task,
              subtasks: task.subtasks.map(subtask => {
                if (!subtask.completed && subtask.startTime) {
                  const elapsedTime = Date.now() - subtask.startTime;
                  const newPoints = Math.max(100 - Math.floor(elapsedTime / 1000), 10);
                  return { ...subtask, points: newPoints };
                }
                return subtask;
              })
            };
          }
          return task;
        });
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentTask]);

  const toggleTask = (taskId, subtaskId) => {
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== currentTask) return;

    setTasks(prevTasks => {
      const updatedTasks = [...prevTasks];
      const subtaskIndex = updatedTasks[taskIndex].subtasks.findIndex(subtask => subtask.id === subtaskId);
      const subtask = updatedTasks[taskIndex].subtasks[subtaskIndex];

      if (!subtask.completed) {
        if (!subtask.startTime) {
          subtask.startTime = Date.now();
          subtask.points = 100;
        } else {
          subtask.completed = true;
          setTotalPoints(prev => prev + subtask.points);
        }
      } else {
        subtask.completed = false;
        subtask.startTime = null;
        setTotalPoints(prev => prev - subtask.points);
        subtask.points = 0;
      }

      const newCompletedTasks = updatedTasks.reduce((acc, task) =>
        acc + task.subtasks.filter(subtask => subtask.completed).length, 0
      );
      setCompletedTasks(newCompletedTasks);

      if (updatedTasks[taskIndex].subtasks.every(subtask => subtask.completed)) {
        setCurrentTask(prev => prev + 1);
      }

      const newLevel = calculateLevel();
      const oldLevel = calculateLevel(totalPoints);
      if (newLevel !== oldLevel) {
        setShowAchievement(true);
        setTimeout(() => setShowAchievement(false), 3000);
      }

      return updatedTasks;
    });
  };

  const calculateLevel = (points = totalPoints) => {
    for (let i = levels.length - 1; i >= 0; i--) {
      if (points >= levels[i].threshold) {
        return i;
      }
    }
    return 0;
  };

  const currentLevel = calculateLevel();

  return (
    <div className="p-4 max-w-4xl mx-auto bg-gray-100 min-h-screen">
      <Card className="mb-8 bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
        <CardHeader>
          <CardTitle className="text-3xl">Your Epic Quest Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            {levels.map((level, index) => {
              const LevelIcon = level.icon;
              return (
                <div key={level.name} className={`flex flex-col items-center ${index <= currentLevel ? 'text-yellow-300' : 'text-gray-300'}`}>
                  <LevelIcon size={32} />
                  <span className="text-xs mt-1">{level.name}</span>
                </div>
              );
            })}
          </div>
          <Progress value={(completedTasks / totalTasks) * 100} className="w-full h-4 bg-white/20" indicatorClassName="bg-yellow-300" />
          <div className="mt-2 text-center">
            Feats Accomplished: {completedTasks} / {totalTasks} | Total Points: {totalPoints}
          </div>
        </CardContent>
      </Card>

      {showAchievement && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Card className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white p-8 max-w-md">
            <CardTitle className="text-2xl mb-4">Level Up!</CardTitle>
            <p className="text-lg">{levels[currentLevel].achievement}</p>
          </Card>
        </div>
      )}

      {tasks.map((task, index) => (
        <Card key={task.id} className={`mb-4 ${index === currentTask ? 'border-4 border-yellow-400' : 'opacity-60'}`}>
          <CardHeader>
            <CardTitle className="flex items-center">
              {index < currentTask ? (
                <CheckCircle className="mr-2 text-green-500" />
              ) : index > currentTask ? (
                <Lock className="mr-2 text-gray-500" />
              ) : null}
              {task.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-600">{task.description}</p>
            {task.subtasks.map(subtask => (
              <div key={subtask.id} className="flex items-center mb-2">
                <button
                  onClick={() => toggleTask(task.id, subtask.id)}
                  className={`p-2 rounded-full mr-2 ${subtask.completed ? 'bg-green-500' : 'bg-gray-200'
                    } ${index !== currentTask ? 'cursor-not-allowed' : ''}`}
                  disabled={index !== currentTask}
                >
                  <CheckCircle className={subtask.completed ? 'text-white' : 'text-gray-500'} />
                </button>
                <span className={subtask.completed ? 'line-through text-gray-500' : ''}>{subtask.title}</span>
                {subtask.startTime && !subtask.completed && (
                  <span className="ml-2 flex items-center text-yellow-600">
                    <Clock size={16} className="mr-1" /> {subtask.points} pts
                  </span>
                )}
                {subtask.completed && (
                  <span className="ml-2 text-green-600">+{subtask.points} pts</span>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default App;