import { Agent, Task, Team } from 'kaibanjs';
import { DynamicTool } from "@langchain/core/tools";

// Define the calculator tool

const calculatorTool = new DynamicTool({
  name: 'calculatorTool',
  description: 'A tool that processes and returns the {result} of the calculation {num1} {operator} {num2}',
  func: ({ operator, num1, num2 }) => {
    let result = 0;

    switch (operator) {
      case '+':
        result = num1 + num2;
      case '-':
        result = num1 - num2;
      default:
        return result;
    }
  },
});

const operatorSelectionTool = new DynamicTool({
  name: 'operatorSelectionTool',
  description: 'Selects the appropriate {operator}',
  func: ({ operator }) => {
    return operator;
  },
});

// Define the Operator Selection Agent
const operatorAgent = new Agent({
  name: 'Math Operator',
  role: 'Operation Selector',
  goal: 'Select the appropriate mathematical operator based on the numbers',
  background: 'Specialized in mathematical operation selection',
  tools: [operatorSelectionTool]
});

// Define the Calculator Agent
const calculatorAgent = new Agent({
  name: 'Calculator',
  role: 'Math Calculator',
  goal: 'Perform mathematical calculations of {num1} {operator} {num2}',
  background: 'Expert in mathematical operations',
  tools: [calculatorTool]
});

// Define Tasks
const operatorTask = new Task({
  title: 'Select operator',
  description: 'Select the appropriate {operator} (+/-)',
  expectedOutput: 'The selected mathematical {operator} (+ or -)',
  agent: operatorAgent
});

const calculationTask = new Task({
  title: 'Perform calculation',
  description: 'Calculate the result of {num1} {operator} {num2}',
  expectedOutput: 'the {result} of the calculation {num1} {operator} {num2}',
  agent: calculatorAgent
});

// Create the Team
const mathTeam = new Team({
  name: 'AI Math Team',
  agents: [operatorAgent, calculatorAgent],
  tasks: [operatorTask, calculationTask],
  env: { OPENAI_API_KEY: process.env.NEXT_PUBLIC_OPENAI_API_KEY }
});

export { mathTeam };
