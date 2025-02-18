'use client'
import { useState } from 'react';
import { mathTeam } from '@/agents/mathTeam';

export default function MathSection() {
  const [num1, setNum1] = useState('');
  const [num2, setNum2] = useState('');
  const [operator, setOperator] = useState('');
  const [mathResult, setMathResult] = useState(null);

  const calculateMath = async () => {
    setMathResult(null);
    console.log(operator, num1, num2);
    try {
      const output = await mathTeam.start({ operator, num1, num2 });

      if (output.status === 'FINISHED') {
        setMathResult(output.result);
      } else if (output.status === 'BLOCKED') {
        console.log(`Math calculation is blocked, unable to complete`);
      }
    } catch (error) {
      console.error('Error performing math calculation:', error);
    }
  };

  return (
    <div className="math-calculator">
      <h2>Math Calculator</h2>
      <div className="options">
        <input
          type="number"
          value={num1}
          onChange={(e) => setNum1(e.target.value)}
          placeholder="Enter first number"
        />
        <input
          type="number"
          value={num2}
          onChange={(e) => setNum2(e.target.value)}
          placeholder="Enter second number"
        />
        <input
          type="text"
          value={operator}
          onChange={(e) => setOperator(e.target.value)}
          placeholder="Operator"
        />
        <button onClick={calculateMath}>
          Calculate
        </button>
      </div>
      <div className="math-result">
        {mathResult !== null ? (
          <p>Result: {mathResult}</p>
        ) : (
          <p className="math-info">
            <span>ℹ️</span>
            <span>Enter two numbers and click Calculate</span>
          </p>
        )}
      </div>
    </div>
  );
}
