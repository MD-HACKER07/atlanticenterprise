import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  targetDate: string;
  message: string;
  className?: string;
  onComplete?: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ 
  targetDate, 
  message, 
  className = '',
  onComplete 
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      
      if (difference <= 0) {
        setIsComplete(true);
        if (onComplete) onComplete();
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  if (isComplete) {
    return null;
  }

  const formatTimeValue = (value: number): string => {
    return value < 10 ? `0${value}` : `${value}`;
  };

  return (
    <div className={className}>
      <div className="mb-3 flex items-center justify-center">
        <Clock size={18} className="mr-2 animate-pulse text-blue-300" />
        <p className="text-sm font-medium">{message}</p>
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-blue-700 p-2 rounded shadow-inner">
          <div className="bg-blue-600 rounded p-2 text-center shadow-lg">
            <span className="text-3xl font-bold block">{formatTimeValue(timeLeft.days)}</span>
            <span className="text-xs uppercase block mt-1 opacity-80">DAYS</span>
          </div>
        </div>
        
        <div className="bg-blue-700 p-2 rounded shadow-inner">
          <div className="bg-blue-600 rounded p-2 text-center shadow-lg">
            <span className="text-3xl font-bold block">{formatTimeValue(timeLeft.hours)}</span>
            <span className="text-xs uppercase block mt-1 opacity-80">HOURS</span>
          </div>
        </div>
        
        <div className="bg-blue-700 p-2 rounded shadow-inner">
          <div className="bg-blue-600 rounded p-2 text-center shadow-lg">
            <span className="text-3xl font-bold block">{formatTimeValue(timeLeft.minutes)}</span>
            <span className="text-xs uppercase block mt-1 opacity-80">MINS</span>
          </div>
        </div>
        
        <div className="bg-blue-700 p-2 rounded shadow-inner">
          <div className="bg-blue-600 rounded p-2 text-center shadow-lg">
            <span className="text-3xl font-bold block">{formatTimeValue(timeLeft.seconds)}</span>
            <span className="text-xs uppercase block mt-1 opacity-80">SECS</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer; 